import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {IAnnouncementContent, IFridayPreach, ITokenPayload, IUserContent, IVerseContent} from "../interfaces";
import {handleError, isFriday, validateTextFields} from "../utils";
import {AnnouncementContent, UserContent, VerseContent} from "../model/userContent";
import {TEXT_LIMIT_PREACH} from "../constants/constants";
import PreachSettings from "../model/fridayPreach";

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || "";

router.get("/app/get-all", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log("get-all was called")

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            //hier erst ab startDate = now rausgeben
            const result: IUserContent[] = await UserContent.find({userId})

            const responseObjects = result.map(item => ({
                _id: item._id,
                type: item.type,
                content: item.content,
                date: item.startDate
            }));

            res.status(200).json(responseObjects);
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to get all userContents";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.post("/app/add/verse", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {sura, startVerse, endVerse, date} = req.body;

    if (!sura || !startVerse || !endVerse || !date) {
        res.status(400).json("Missing required fields");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid date");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            await VerseContent.create({
                userId: userId,
                content: {
                    sura,
                    startVerse,
                    endVerse,
                },
                startDate: dateObj,
                endDate: dateObj
            });

            res.status(200).json("Created verse-content successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to update user settings";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.post("/app/add/announcement", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {text, date} = req.body;

    if (!text || !date) {
        res.status(400).json("Missing required fields");
        return;
    }

    if (!validateTextFields(text, TEXT_LIMIT_PREACH)) {
        res.status(400).json("Text fields are invalid or exceed limit");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid date");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            await AnnouncementContent.create({
                userId: userId,
                content: {
                    text
                },
                startDate: dateObj,
                endDate: dateObj
            });

            res.status(200).json("Created announcement successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to update user settings";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.put("/app/update/verse", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {id, date, sura, startVerse, endVerse} = req.body;

    if (!id || !date || !sura || !startVerse || !endVerse) {
        res.status(400).json("Missing required fields");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid date");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const verseContent: IUserContent | null = await UserContent.findOne({userId, _id: id})

            if (!verseContent) {
                res.status(401).json("No verse found to update");
                return;
            }

            verseContent.startDate = dateObj;
            verseContent.endDate = dateObj;
            (verseContent.content as IVerseContent).sura = sura;
            (verseContent.content as IVerseContent).startVerse = startVerse;
            (verseContent.content as IVerseContent).endVerse = endVerse;

            await verseContent.save();

            res.status(200).json("Updated verse successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to update verse";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.put("/app/update/announcement", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {id, text, date} = req.body;

    if (!id || !text || !date) {
        res.status(400).json("Missing required fields");
        return;
    }

    if (!validateTextFields(text, TEXT_LIMIT_PREACH)) {
        res.status(400).json("Text fields are invalid or exceed limit");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid date");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const announcementContent: IUserContent | null = await UserContent.findOne({userId, _id: id})

            if (!announcementContent) {
                res.status(401).json("No announcement found to update");
                return;
            }

            announcementContent.startDate = dateObj;
            announcementContent.endDate = dateObj;
            (announcementContent.content as IAnnouncementContent).text = text;


            await announcementContent.save();

            res.status(200).json("Updated announcement successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to update announcement";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.delete("/app/delete/verse", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {id} = req.body;

    if (!id) {
        res.status(400).json("Missing required field");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const verseContent: IUserContent | null = await VerseContent.findById(id);

            if (!verseContent) {
                res.status(401).json("No verse found to delete");
                return;
            }

            if (verseContent.userId.toString() !== userId) {
                //TODO: permission denied!
            }

            await verseContent.deleteOne();

            res.status(200).json("Deleted verse successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to delete verse";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.delete("/app/delete/announcement", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {id} = req.body;

    if (!id) {
        res.status(400).json("Missing required field");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const announcementContent: IAnnouncementContent | null = await AnnouncementContent.findById(id);

            if (!announcementContent) {
                res.status(401).json("No announcement found to delete");
                return;
            }

            // if (fridayPreach.userId !== userId){
            //     //permission denied?? code?
            //     res.status(403).json("No preach found to delete");
            //     return;
            // }

            await announcementContent.deleteOne();

            res.status(200).json("Deleted announcement successfully");
            return;
        } else {
            res.status(400).json("UserId not found in token");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to delete announcement";

            handleError(res, error, serverLogMessage);
        }
    }
});

export default router;
