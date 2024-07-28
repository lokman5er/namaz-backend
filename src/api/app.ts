import express, {Request, Response} from 'express';
import {handleError, isFriday, validateEmail, validateLanguage, validateTextFields} from "../utils";
import {
    IFridayPreach,
    ITokenPayload,
    IUserContent,
    IVerseContent,
    IAnnouncementContent, IUser
} from "../interfaces";
import jwt from "jsonwebtoken";
import UserSettings from "../model/userSettings";
import PreachSettings from "../model/fridayPreach";
import {CURRENT_APP_VERSION, TEXT_LIMIT_PREACH} from "../constants/constants";
import {AnnouncementContent, UserContent, VerseContent} from "../model/userContent";
import User from "../model/user";
import bcrypt from "bcryptjs";
import {IncomingHttpHeaders} from "http";
import { v4 as uuidv4 } from 'uuid';
import {sendConfirmationEmail} from "../util/ses";

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || "";

// router.post("/translate", async (req: Request, res: Response): Promise<void> => {
//     const {sourceLanguage, sourceText} = req.body;
//
//     if (!sourceLanguage || !sourceText) {
//         res.status(400).json("Missing required fields");
//         return;
//     }
//
//     const availableLanguages = ["tr", "de", "ar"];
//
//     let responseObject: LocalizedTextSchema = {
//         tr: '',
//         de: '',
//         ar: '',
//     };
//
//     responseObject[sourceLanguage as keyof LocalizedTextSchema] = sourceText;
//
//     for (const language of availableLanguages) {
//         if (language === sourceLanguage) {
//             continue;
//         }
//
//         try {
//             const translatedText = await translateText(sourceText, language.toUpperCase());
//             responseObject[language as keyof LocalizedTextSchema] = translatedText.translations[0].text;
//         } catch (error) {
//             console.error(`Error while translating in language ${language}:`, error);
//         }
//     }
//
//     res.setHeader('Content-Type', 'application/json; charset=utf-8');
//     res.status(200).json(responseObject);
// });

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;

    console.log("username: " + username);
    console.log("password: " + password);

    if (!username || !password) {
        res.status(400).send("try harder ;)");
        return;
    }

    const user: IUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).lean() as IUser;

    if (!user) {
        res.status(400).send("Invalid username/password");
        return;
    }

    console.log("found user");

    if (await bcrypt.compare(password, user.password)) {
        //username + password combination is successful

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                urlPara: user.urlPara,
            },
            JWT_SECRET,
            {expiresIn: "30d"}
        );

        //todo nicht mehr im user speichern!
        await User.updateOne({username: user.username}, {$set: {token}});

        const responseObject = {
            username: user.username,
            token,
            email: user.email ? user.email : "",
        };

        res.status(200).json(responseObject);
        console.log("send 200er for login");

        return;
    }

    res.status(400).json({error: 'Invalid username/password'});
});

router.post("/user/delete", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }


    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const result = await User.deleteOne({_id: userId});

            if (result.deletedCount !== 1) {
                res.status(404).send("No user found with userId: " + userId);
                return;
            }

            res.type('text/plain');
            res.status(200).json("User deleted successfully");
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

router.get("/settings/get", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            let userSettings = await UserSettings.findOne({userId: userId});

            if (!userSettings) {
                //initial value:
                userSettings = await UserSettings.create({
                    userId: userId,
                    cumaPrayingTime: {
                        active: false,
                        time: "14:00",
                    },
                    fajrPrayingTime: {
                        active: false,
                        time: "04:00",
                    },
                    standBy: {
                        active: false,
                        startTime: "23:00",
                        endTime: "03:00",
                    },
                });
            }

            res.status(200).json(userSettings);
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

router.put("/settings/update", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {cumaPrayingTime, fajrPrayingTime, standBy} = req.body;

    if (!cumaPrayingTime || !fajrPrayingTime || !standBy) {
        res.status(400).json("Missing required fields");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            await UserSettings.updateOne({userId: userId}, {
                $set: {
                    cumaPrayingTime,
                    fajrPrayingTime,
                    standBy
                }
            });

            res.status(200).json("Updated user settings successfully");
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

router.post("/preach/add", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {text, date, startTime, endTime} = req.body;

    if (!text || !date || !startTime || !endTime) {
        res.status(400).json("Missing required fields");
        return;
    }

    if (!validateTextFields(text, TEXT_LIMIT_PREACH)) {
        res.status(400).json("Text fields are invalid or exceed limit");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid startDate");
        return;
    }

    if (!isFriday(dateObj)) {
        res.status(400).json("Selected day is not a friday");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const result: IFridayPreach | null = await PreachSettings.findOne({userId, date})

            if (result) {
                res.status(400).json("There is already a preach for that date");
                return;
            }

            await PreachSettings.create({
                userId,
                text,
                date,
                startTime,
                endTime
            })

            res.type('text/plain');
            res.status(200).json("Created preach successfully");
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

router.get("/preach/get-all", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result: IFridayPreach[] = await PreachSettings.find({
                userId,
                date: { $gte: today }
            })

            res.status(200).json(result);
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

router.put("/preach/update", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {id, text, date, startTime, endTime} = req.body;

    if (!id || !text || !date || !startTime || !endTime) {
        res.status(400).json("Missing required fields");
        return;
    }

    if (!validateTextFields(text, TEXT_LIMIT_PREACH)) {
        res.status(400).json("Text fields are invalid or exceed limit");
        return;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        res.status(400).json("Invalid startDate");
        return;
    }

    if (!isFriday(dateObj)) {
        res.status(401).json("Selected day is not a friday");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const fridayPreach: IFridayPreach | null = await PreachSettings.findOne({userId, _id: id})

            if (!fridayPreach) {
                res.status(401).json("No preach found to update");
                return;
            }

            await PreachSettings.updateOne({ _id: id }, {
                $set: {
                    text,
                    date,
                    startTime,
                    endTime
                }
            });

            res.status(200).json("Updated preach successfully");
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

router.delete("/preach/delete", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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
            const fridayPreach: IFridayPreach | null = await PreachSettings.findById(id);

            if (!fridayPreach) {
                res.status(401).json("No preach found to delete");
                return;
            }

            // if (fridayPreach.userId !== userId){
            //     //permission denied?? code?
            //     res.status(403).json("No preach found to delete");
            //     return;
            // }

            await fridayPreach.deleteOne();

            res.status(200).json("Deleted preach successfully");
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
            const serverLogMessage = "Error while trying to delete preach";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.get("/get-all", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result: IUserContent[] = await UserContent.find({
                userId,
                startDate: { $gte: today }
            });

            console.log("Today's date:", today);

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

router.post("/add/verse", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.post("/add/announcement", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.put("/update/verse", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.put("/update/announcement", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.delete("/delete/verse", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.delete("/delete/announcement", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

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

router.put("/user/change-password", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {currentPassword, newPassword} = req.body;

    if (!newPassword || typeof newPassword !== "string") {
        res.status(400).send("Invalid password");
        return;
    }

    if (newPassword.length < 5) {
        res.status(400).send("Password too short");
        return;
    }

    if (newPassword.length > 15) {
        res.status(400).send("Password too long");
        return;
    }

    let userId;

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        userId = tokenPayload.userId;

        if (userId) {
            const user: IUser = await User.findOne({ _id: userId }) as IUser;

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                res.status(403).send("Invalid password");
                return;
            }

            const newPasswordHashed = await bcrypt.hash(newPassword, 12);

            await User.updateOne(
                {_id: userId},
                {
                    $set: {password: newPasswordHashed},
                }
            );

            res.status(200).send("Password changed successfully");
        }
    } catch (error) {
        const serverLogMessage = "Error while trying to change password of user: " + userId;

        handleError(res, error, serverLogMessage);
    }
});

router.put("/user/change-mail", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {mail, language} = req.body;

    if (!validateEmail(mail) || !validateLanguage(language)) {
        res.status(400).send("Invalid email or language");
        return;
    }

    let userId;

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        userId = tokenPayload.userId;

        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).send("User not found");
                return;
            }

            const now = new Date();
            const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
            const emailSentWithinLastFiveMinutes = user.emailConfirmationExpires && new Date(user.emailConfirmationExpires.getTime() - 3600000) > fiveMinutesAgo;

            if (emailSentWithinLastFiveMinutes) {
                res.status(429).send("Email sent too recently. Please wait before trying again.");
                return;
            }

            const confirmationToken = uuidv4();

            user.pendingEmail = mail;
            user.emailConfirmationToken = confirmationToken;
            user.emailConfirmationExpires = new Date(Date.now() + 3600000);
            await user.save();

            await sendConfirmationEmail(mail, confirmationToken, language);

            res.status(200).send("Confirmation email sent. Please check your new email to confirm the change.");
        }
    } catch (error) {
        const serverLogMessage = "Error while trying to change mail of user: " + userId;

        handleError(res, error, serverLogMessage);
    }
});

router.get("/feature/show-support", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            const response = {
                show: true,
                affiliateId: "123456789"
            }

            res.status(200).json(response);
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

router.get("/feature/show-preach-screen", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            res.status(200).json({show: true});
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

router.get("/imprint", async (req: Request, res: Response): Promise<void> => {
    if (checkAppVersion(req.headers, res)) return;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {

            const responseObject = {
                name: "Lokman Beser",
                address: "Dr.-Golm-Str. 24",
                zip: 27232,
                city: "Sulingen",
                country: "Germany",
            }

            res.status(200).json(responseObject);
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
            const serverLogMessage = "Error while trying to get imprint";

            handleError(res, error, serverLogMessage);
        }
    }
});

function checkAppVersion (headers: IncomingHttpHeaders, res: Response): boolean {
    const appVersion = headers['app-version'];

    if (appVersion !== CURRENT_APP_VERSION) {
        res.status(426).send({data: "App-Version is outdated, please update to newest version."});
        return true;
    }
    return false;
}

export default router;
