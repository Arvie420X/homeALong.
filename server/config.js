// basically this file is alternative to .env file
import dotenv from 'dotenv';

dotenv.config();

import SES from "aws-sdk/clients/ses.js"
import S3 from "aws-sdk/clients/s3.js"

import NodeGeocoder from "node-geocoder";

// connecting to MongoDB via Atlas
export const DATABASE = process.env.DATABASE;


// AWS
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY =process.env.AWS_SECRET_ACCESS_KEY;


export const EMAIL_FROM = process.env.emailFrom; // this format is just to make the Company name show up instead of the company email in your email

export const REPLY_TO = process.env.replyTo;

const awsConfig= {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: "ap-southeast-2",
    apiVersion: "2010-12-01"
};

export const AWSSES = new SES(awsConfig);
export const AWSS3 = new S3(awsConfig);

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

export const GOOGLE_GEOCODER = NodeGeocoder(options);
 
export const JWT_SECRET = process.env.JWT_SECRET
// export const CLIENT_URL = "http://localhost:5173"  change this later when you decide to use Vite or create-react-app
export const CLIENT_URL = "https://home-along.vercel.app"
