import * as config from "../config.js"
import jwt from "jsonwebtoken";
import { emailTemplate } from "../helpers/email.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
// import base64url from 'base64url';
// import queryString from 'query-string'; // alternative to base64url 
import { Base64 } from 'js-base64';
import urlSafe from 'urlsafe-base64';
import Ad from "../models/ad.js";

const tokenAndUserResponse = (req, res, user) => {
    // 3. create jwt tokens
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: "1h"});
    const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: "7d"});
    // 4. send response
    user.password = undefined;
    user.resetCode = undefined;

    return res.json({
        token,
        refreshToken,
        user
    });
};

export const welcome = (req, res) => {
    res.json({
        data: "hey arvidas from the NodeJs API",
    });
};

export const preRegister = async (req, res) => {
    // controllers/auth.js
    // create jwt with email and password then email as clickable link
    // only when user click on that email link, registeration completes
    try {
        // console.log(req.body);
        const { email, password } = req.body;

        // validation
        if(!validator.validate(email)) {
            return res.json({error: "A valid email is required."})
        }
        if(!password) {
            return res.json({error: "Password is required."});
        }
        if(password && password?.length < 6) {
            return res.json({error: "Password should be at least 6 characters."});
        }

        const user = await User.findOne({ email });
        if(user) {
            return res.json({error: "Email already exist!"})
        }

        // Original encoding
        // const token = jwt.sign({email, password}, config.JWT_SECRET, {expiresIn: "1hr"});
        // console.log('this is the token', token);
        // const encodedToken = base64url(token);
        // console.log('encoded token',encodedToken);

        // const decodedToken = jwt.decode(base64url.decode(encodedToken));
        // console.log('decoded token', decodedToken.email, decodedToken.password);

        // New encoding
        const token = jwt.sign({email, password}, config.JWT_SECRET, {expiresIn: "1hr"});
        // console.log('this is the token', token);
        const encodedToken = Base64.encode(token);
        // console.log('Unsafe encoded token:',encodedToken);
        const urlSafeEncodedToken = urlSafe.encode(encodedToken);
        console.log(urlSafeEncodedToken);
        // console.log('Safe encoded token', urlSafeEncodedToken);

        // let decodedToken = urlSafe.decode(urlSafeEncodedToken).toString();
        // console.log('Decoded token', decodedToken);
        // const rootInfo = jwt.decode(decodedToken);
        // console.log('rootInfo:', rootInfo);

        // alternative to base64url
        // const decoded = jwt.decode(token);
        // const path = decoded.path;
        // const encodedPath = queryString.stringifyUrl({url: '/auth/account-activate/:token', query: {path: path}});

        config.AWSSES.sendEmail(
            emailTemplate(
                email, `
                    <p>Please click the link  below to activate your account.</p>
                    <a href="${config.CLIENT_URL}/auth/account-activate/${urlSafeEncodedToken}">Activate my account</a>
                `, 
                config.REPLY_TO, 
                "Activate your account."), (error, data) => {
            if(error) {
                console.log(error);
                return res.json({ok: false});
            } else {
                // console.log(data);
                return res.json({ok: true});
            }
        })

       
    } catch (error) {
        console.log(error);
        return res.json({error: 'Something went wrong. Try again.'})
    }
}

export const register = async (req, res) => {
    try {
        // console.log(req.body);
        // const decoded = jwt.verify(req.body.token, config.JWT_SECRET); either use this or the one below
        const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
        // console.log(decoded);

        const userExist = await User.findOne({ email });
        if(userExist) {
            return res.json({error: "Email already exist!"})
        }

        const hashedPassword = await hashPassword(password);

        const user = await new User({
            username: nanoid(6),
            email,
            password: hashedPassword
        }).save();

        tokenAndUserResponse(req, res, user);

    } catch (error) {
        console.log(error);
        return res.json({error: 'Something went wrong. Try again.'})
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        // 1. find user by email
        const user = await User.findOne({ email });
        if(!user) {
            return res.json({ error: "No user found. Please register."});
        }
        // 2. compare password
        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.json({error: "Wrong password."});
        }
        // 3. create jwt tokens & 4. send response
        tokenAndUserResponse(req, res, user);

    } catch (error) {
        return res.json({ error: "Something went wrong. Try again." })
    }
}

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.json({ error: "Could not find user with that email." })
        } else {
            const resetCode = nanoid();
            // save to user db
            user.resetCode = resetCode;
            user.save();

            // New encoding
            const token = jwt.sign({ email }, config.JWT_SECRET, {expiresIn: "1hr"});
            // console.log('this is the token', token);
            const encodedToken = Base64.encode(token);
            // console.log('Unsafe encoded token:',encodedToken);
            let urlSafeEncodedToken = urlSafe.encode(encodedToken);
            // console.log('Safe encoded token', urlSafeEncodedToken);

            config.AWSSES.sendEmail(emailTemplate(email, `
                <p>Please click the link below to access your account.</p>
                <a href="${config.CLIENT_URL}/auth/access-account/${urlSafeEncodedToken}">Access my account.</a>
            `, config.REPLY_TO, "Access your account."), (error, data) => {
                if(error) {
                    console.log(error);
                    return res.json({ok: false});
                } else {
                    // console.log(data);
                    return res.json({ok: true});
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong. Try again." })
    }
}

export const accessAccount = async (req, res) => {
    try {
        const  resetCode  = jwt.verify(req.body.resetCode, config.JWT_SECRET);
        // console.log("here:",resetCode);
        const user = await User.findOneAndUpdate( resetCode.email , {resetCode: ''}); // first param should be {resetCode: resetCode} but can simplify it.
        console.log('user :',user);
        tokenAndUserResponse(req, res, user);

    } catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong. Try again." })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET); 

        const user = await User.findById(_id);

        tokenAndUserResponse(req, res, user);

    } catch (error) {
        console.log(error);
        res.status(403).json({error: 'Refresh token failed.'})
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // able to get the user._id because of the middleware
        
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);
        
    } catch (error) {
        console.log(error);
        res.status(403).json({error: 'Unauthorized'});
    }
}

export const publicProfile = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});

        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);

    } catch (error) {
        console.log(error);
        return res.json({error: 'User not found'});
    }
}

// update password
export const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;

        if(!password) {
            return res.json({error: 'Password is required'});
        }
        if(password && password?.length < 6) {
            return res.json({error: 'Password should be 6 characters minimum'});
        }

        const user =await User.findByIdAndUpdate(req.user._id, {
            password: await hashPassword(password)
        });

        res.json({ok: true});
        
    } catch (error) {
        console.log(error);
        res.status(403).json({error: 'Unauthorized'});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {new: true});
        user.password = undefined;
        user.resetCode = undefined;
        res.json(user);

    } catch (error) {
        console.log(error);
        if(error.codeName === 'DuplicateKey') {
            return res.json({error: 'Username or email is already taken.'})
        } else {
            return res.status(403).json({error: 'Unauthorized'});
        }
    }
}

export const agents = async (req, res) => {
    try {
        const agents = await User.find({ role: "Seller" })
        .select("-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket");

        res.json(agents);
    } catch (error) {
        console.log(error);
    }
}

export const agentAdCount = async (req, res) => {
    try {
        const ads = await Ad.find({ postedBy: req.params._id })
        .select("_id");

        res.json(ads);
    } catch (error) {
        console.log(error);
    }
}

export const agent = async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username})
        .select("-password -role -enquiredProperties -wishlist -photo.key -photo.Key -photo.Bucket");

        const ads = await Ad.find({postedBy: user._id})
        .select("-photos.key -photos.Key -photos.ETag -photos.Bucket -location -googleMap");

        res.json({ user, ads });
    } catch (error) {
        console.log(error);
    }
}