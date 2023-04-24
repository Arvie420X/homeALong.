// import { ObjectId } from "bson";
// import { ObjectId } from "bson";
import { model, Schema, ObjectId } from "mongoose";

const schema = new Schema({
    photos: [{}],
    price: {
        type: Number,
        maxLength: 255
    },
    address: {
        type: String,
        maxLength: 255,
        required: true
    },
    bedrooms: Number,
    bathrooms: Number,
    landsize: String,
    carpark: Number,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [120.984222, 14.599512],
        },
    },
    title: {
        type: String,
        maxlength: 255,
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
    },
    description: {},
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
    sold: {
        type: Boolean,
        default: false,
    },
    googleMap: {},
    type: {
        type: String,
        default: "Other",
    },
    action: {
        type: String,
        default: "Sell",
    },
    views: {
        type: Number,
        default: 0,
    }
},
{timestamps: true}
);

schema.index({ location: "2dsphere"}); // necessary for location based search in order for the "location" in this model to work, still works even without this

export default model("Ad", schema);