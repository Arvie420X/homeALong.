import * as config from "../config.js"
import { nanoid } from "nanoid";
import slugify from "slugify";
import Ad from "../models/ad.js";
import User from "../models/user.js";
import { emailTemplate } from "../helpers/email.js";
import { formatNumber } from "../helpers/formatNumber.js";

export const uploadImage = async (req, res) => {
    try {
        // console.log(req.body);
        const { image } = req.body;

        const base64Image = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );

        const type = image.split(";")[0].split("/")[1];
        
        // image params
        const params = {
        Bucket: "homealong-bucket",
        Key: `${nanoid()}.${type}`,
        Body: base64Image,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
        };

        // upload to s3
        config.AWSS3.upload(params, (error, data) => {
            if (error) {
            console.log(error);
            res.sendStatus(400);
            } else {
            // console.log(data);
            res.send(data);
            }
        });

    } catch (error) {
        console.log(error);
        res.json({error: "Upload failed. Try again."});
    }
};

export const removeImage = async (req, res) => {
    try {
        const { Key, Bucket } = req.body;
        
        config.AWSS3.deleteObject({ Bucket, Key }, (error, data) => {
            if(error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.send({ ok: true });
            }
        })
    } catch (error) {
        console.log(error);
    }
};

export const create = async (req, res) => {
    try {
        // console.log(req.body);
        const { photos, description, title, address, price, type, landsize } = req.body;
        if (!photos?.length) {
            return res.json({error: "Photos are required."})
        }
        if (!price) {
            return res.json({error: "Price is required."})
        } 
        if (!type) {
            return res.json({error: "Is property house or land."})
        } 
        if (!address) {
            return res.json({error: "Address is required."})
        } 
        if (!description) {
            return res.json({error: "Description is required."})
        }

        const geo = await config.GOOGLE_GEOCODER.geocode(address);
        // console.log("This is geo =>", geo);
        
        const ad = await new Ad({
            ...req.body,
            slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`), // solution for the E11000 duplicate key error collection
            postedBy: req.user._id,
            location: {
                type: "Point",
                coordinates: [geo?.[0].longitude, geo?.[0].latitude]
            },
            googleMap: geo,
        });
        ad.save();

        // make user role into Seller
        const user = await User.findByIdAndUpdate(req.user._id, 
            {
                $addToSet: {role: "Seller"},
            },
            { new: true },
        );

        user.password = undefined;
        user.resetCode = undefined;

        res.json({
            ad,
            user,
        });

    } catch (error) {
        res.json({error: "Something went wrong. Try again."});
        console.log(error);
    }
}

export const ads = async (req, res) => {
    try {
        const adsForSell = await Ad.find({ action: "Sell" })
        .select('-googleMap -location -photos.Key -photos.key -photos.ETag')
        .sort({ createdAt: -1 })
        .limit(12);

        const adsForRent = await Ad.find({ action: "Rent" })
        .select('-googleMap -location -photos.Key -photos.key -photos.ETag')
        .sort({ createdAt: -1 })
        .limit(12);

        res.json({ adsForSell, adsForRent});
    } catch (error) {
        console.log(error);
    }
}

export const read = async (req, res) => {
    try {
        const { slug } = req.params;
        const ad = await Ad.findOne({ slug })
            .populate("postedBy", "name username email phone company photos.Location");
        // console.log(ad);

        // related
        const related = await Ad.find({
            _id: { $ne: ad._id}, // $ne meaning is not included: since ad._id is from the ad that the user will search and should not be included to the related ads
            action: ad.action,
            type: ad.type,
            address: {
                $regex: ad.googleMap[0]?.administrativeLevels.level2long || "", // the address of the related ads will be based on this code
                $options: "i",
            },
        })
        .limit(3)
        .select("-photos.Key -photos.key -photos.ETag -photos.Bucket -googleMap");

        res.json({ ad, related });
    } catch (error) {
        console.log(error);
    }
}


// Wishlist

export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { wishlist: req.body.adId }, // $addToSet is a mongoose function similar to $push
            },
            { new: true },
        )

        const { password, resetCode, ...rest } = user._doc;

        res.json(rest);
    } catch (error) {
        console.log(error);
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { wishlist: req.params.adId },
            },
            { new: true },
        )

        const { password, resetCode, ...rest } = user._doc;

        res.json(rest);
    } catch (error) {
        console.log(error);
    }
}

export const contactSeller = async (req, res) => {
    try {
        const { name, email, message, phone, adId } = req.body;
        // console.log(req.body);
        const ad = await Ad.findById(adId).populate("postedBy", "email");
        const user = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { enquiredProperties: adId},
        });
        if(!user) {
            res.json({error: 'Could not find user with that email.'})
        } else {
            // send email
            config.AWSSES.sendEmail(
                emailTemplate(
                    ad.postedBy.email, `
                        <p>You have received a new customer enquiry.</p>

                        <h4>Customer details</h4>
                        <p>Name:${name}</p>
                        <p>Email:${email}</p>
                        <p>Phone:${phone}</p>
                        <p>Message:${message}</p>

                        <a href="${config.CLIENT_URL}/ad/${ad.slug}">${ad.type} in ${ad.address} for ${ad.action} (&#8369;${formatNumber(ad.price)})</a>
                    `, 
                    email, 
                    "New enquiry received."), (error, data) => {
                if(error) {
                    console.log(error);
                    return res.json({ok: false});
                } else {
                    // console.log(data);
                    return res.json({ok: true});
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const userAds = async (req, res) => {
    try {
        const perPage = 4;
        const page = req.params.page ? req.params.page : 1;

        const total = await Ad.find({ postedBy: req.user._id });

        const ads = await Ad.find({ postedBy: req.user._id })
        .select(
            "-photos.Key -photos.key -photos.ETag -photos.Bucket -location -googleMap"
        )
        .populate("postedBy", "name email username phone company")
        .skip((page - 1) * perPage) // the page - 1 :  the first document in a collection in mongoDb has an index of 0
        .limit(perPage)
        .sort({ createdAt: -1});

        res.json({ ads, total: total.length });
    } catch (error) {
        console.log(error);
    }
}

export const update = async (req, res) => {
    try {
        const { photos, price, type, address, description } = req.body;

        const ad = await Ad.findById(req.params._id);
        
        const owner = req.user._id == ad?.postedBy;

        if(!owner) {
            return res.json({error: 'Permission denied!'});
        } else {
            // validation
            if(!photos.length) {
                return res.json({error: 'Photos are required.'});
            }
            if(!price) {
                return res.json({error: 'Price are required.'});
            }
            if(!type) {
                return res.json({error: 'Is property House or Land?'});
            }
            if(!address) {
                return res.json({error: 'Address are required.'});
            }
            if(!description) {
                return res.json({error: 'Description are required.'});
            }

            const geo = await config.GOOGLE_GEOCODER.geocode(address);

            await ad.updateOne({
                ...req.body,
                // slug: ad.slug, this is optional if you want to keep the url the same because of the slug
                slug: slugify(`${type}-${address}-${price}-${nanoid(6)}`),
                location: {
                    type: "Point",
                    coordinates: [geo?.[0].longitude, geo?.[0].latitude],
                }
            });

            res.json({ ok: true });
        }
    } catch (error) {
        console.log(error);
    }
}

export const remove = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params._id);
        const owner = req.user._id == ad?.postedBy;

        if(!owner) {
            return res.json({ error: "Permission denied!" });
        } else {
            await Ad.findByIdAndDelete(ad._id);
            res.json({ ok: true});
        }
    } catch (error) {
        console.log(error);
    }
}

export const enquiredProperties = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const ads = await Ad.find({_id: user.enquiredProperties}).sort({
            createdAt: -1,
        });
        res.json(ads);
    } catch (error) {
        console.log(error);
    }
}

export const wishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const ads = await Ad.find({_id: user.wishlist}).sort({
            createdAt: -1,
        });
        res.json(ads);
    } catch (error) {
        console.log(error);
    }
}

export const adsForSell = async (req, res) => {
    try {
        const ads = await Ad.find({ action: "Sell" })
        .select('-googleMap -location -photos.Key -photos.key -photos.ETag')
        .sort({ createdAt: -1 })
        .limit(24);

        res.json(ads);
    } catch (error) {
        console.log(error);
    }
}

export const adsForRent = async (req, res) => {
    try {
        const ads = await Ad.find({ action: "Rent" })
        .select('-googleMap -location -photos.Key -photos.key -photos.ETag')
        .sort({ createdAt: -1 })
        .limit(24);

        res.json(ads);
    } catch (error) {
        console.log(error);
    }
}

export const search = async (req, res) => {
    try {
        const { action, address, type, priceRange } = req.query;
        console.log("🚀 ~ file: ad.js:384 ~ search ~ req.query:", req.query)
        console.log("🚀 ~ file: ad.js:384 ~ search ~ action, address, type, priceRange:", action, address, type, priceRange)

        // Ensure that all required query parameters are present
        if (!action || !address || !type || !priceRange) {
            return res.status(400).json({ message: 'Missing required query parameters.' });
        }

        const geo = await config.GOOGLE_GEOCODER.geocode(address);

        const ads = await Ad.find({
            action: action === "Buy" ? "Sell" : "Rent",
            type,
            price: {
                $gte: parseInt(priceRange[0]),
                $lte: parseInt(priceRange[1]),
            },
            location: {
                $near: {
                    $maxDistance: 50000,
                    $geometry: {
                        type: "Point",
                        coordinates: [geo?.[0]?.longitude, geo?.[0]?.latitude],
                    },
                },
            },
        })
        .limit(24)
        .sort({ createdAt: -1 })
        .select("-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap");

        res.json(ads);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
