import express, {Request, Response} from "express";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

import userRoutes from './src/api/user';
import tvRoutes from './src/api/tv';
import appRoutes from './src/api/app';
import userContentRoutes from './src/api/userContent';
import generalRoutes from "./src/api/general";

const MONGODB_CREDENTIALS: string = process.env.MONGODB || '';
const PORT: string = process.env.PORT || "";

const app = express();

import cors from 'cors';
import AWS from "aws-sdk";
import {handleError} from "./src/utils";
import { IUser} from "./src/interfaces";
import User from "./src/model/user";
import bcrypt from "bcryptjs";
app.use(cors());


async function connectToDatabase(): Promise<void> {
    try {
        await mongoose.connect(
            `mongodb+srv://${MONGODB_CREDENTIALS}@namazapp.ccw7t1d.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log("CONNECTED TO MONGODB");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("FAILED TO CONNECT TO MONGODB");
        console.error(err);
    }
}

connectToDatabase();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/delete-account", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "delete.html"));
});

app.get("/legal", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "legal.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.use("/api/user", userRoutes);

// app.use("/api/announcement", announcementRoutes);

app.use("/api/tv", tvRoutes);

app.use('/api/app', appRoutes);

app.use('/api/user-content', userContentRoutes);

app.use(generalRoutes);

//TODO: unify req.query and req.body? research usecases
//TODO: add counter for api calls?
//TODO: add proper logging to api calls
//TODO: add telegram api for messaging after critical errors -> kind of healthCheck
//TODO: modelListener um beim Erstellen von einem User auch direkt UserSettings zu erstellen, oder direkt in register mit rein?
//TODO: automatisch vergangene gebetszeiten wieder aus DB löschen



const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const msg = {
    to: 'lokmanveve@gmail.com',
    reg: 'info@salah.tv',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong style="color: #2c7291">and easy to do anywhere, even with Node.js</strong>',
};
//ES6
// sgMail.send(msg).then((result:any) => console.log("result: " + result));

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    },
    region: process.env.AWS_REGION
});

export const ses = new AWS.SES({ apiVersion: '2010-12-01' });
