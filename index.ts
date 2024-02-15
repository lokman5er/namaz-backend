import express from "express";
import mongoose from "mongoose";
import path from "path";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./src/api/user";
import announcementRoutes from "./src/api/announcements";
import tvRoutes from "./src/api/tv";

// for the API call counter
let apiCallCounter: number = 0;
let apiCallCounterFlag: boolean = false;

/**
 * Checks if the API counter is being modified. Prevent race conditions on the counter.
 * 
 * @returns A promise that resolves when the API counter is no longer being modified.
 */
async function checkIfApiCounterIsBeingModified(): Promise<void> {
    while (apiCallCounterFlag) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}
/**
 * Retrieves the current value of the API call counter. Simple getter function.
 * 
 * @returns The number of API calls made.
 */
export function getApiCallCounter(): number {
    return apiCallCounter;
}
/**
 * Increments the API call counter. Just for the devs to know how many times the API has been called.
 * @returns A promise that resolves to void.
 */
export async function incrementApiCallCounter(): Promise<void> {
    checkIfApiCounterIsBeingModified();
    apiCallCounterFlag = true;
    apiCallCounter++;
    apiCallCounterFlag = false;
}

const MONGODB_CREDENTIALS: string = process.env.MONGODB || "";
const PORT: string = process.env.PORT || "";

const app = express();

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
app.use(express.static(path.join(__dirname, "frontend", "public")));
app.use(express.static(path.join(__dirname, "frontend", "images")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "public", "index.html"));
});

app.get("/duyuru", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend", "admin.html"));
});

app.use("/api/user", userRoutes);

app.use("/api/announcement", announcementRoutes);

app.use("/api/tv", tvRoutes);

//TODO: unify req.query and req.body? research usecases
//TODO: add counter for api calls?
//TODO: add proper logging to api calls
//TODO: add telegram api for messaging after critical errors -> kind of healthCheck
// -> sendMessageToTelegramGroup in utils
