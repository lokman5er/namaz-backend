import express, {Request, Response} from 'express';
import {handleError, isFriday, translateText, validateTextFields} from "../utils";
import {IFridayPreach, LocalizedTextSchema, ITokenPayload} from "../interfaces";
import jwt from "jsonwebtoken";
import UserSettings from "../model/userSettings";
import PreachSettings from "../model/fridayPreach";
import {TEXT_LIMIT_PREACH} from "../constants/constants";

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || "";

router.post("/translate", async (req: Request, res: Response): Promise<void> => {
    const {sourceLanguage, sourceText} = req.body;

    if (!sourceLanguage || !sourceText) {
        res.status(400).json("Missing required fields");
        return;
    }

    const availableLanguages = ["tr", "de", "ar"];

    let responseObject: LocalizedTextSchema = {
        tr: '',
        de: '',
        ar: '',
    };

    responseObject[sourceLanguage as keyof LocalizedTextSchema] = sourceText;

    for (const language of availableLanguages) {
        if (language === sourceLanguage) {
            continue;
        }

        try {
            const translatedText = await translateText(sourceText, language.toUpperCase());
            responseObject[language as keyof LocalizedTextSchema] = translatedText.translations[0].text;
        } catch (error) {
            console.error(`Error while translating in language ${language}:`, error);
        }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(responseObject);
});

router.get("/settings/get", async (req: Request, res: Response): Promise<void> => {
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
            const userSettings = await UserSettings.findOne({userId: userId});

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

//todo change this to put!
router.post("/settings/update", async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(400).json("Missing required token");
        return;
    }

    const {preach, cumaPrayingTime, fajrPrayingTime, standBy} = req.body;

    if (!preach || !cumaPrayingTime || !fajrPrayingTime || !standBy) {
        res.status(400).json("Missing required fields");
        return;
    }

    try {
        const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;

        const userId = tokenPayload.userId;

        if (userId) {
            await UserSettings.updateOne({userId: userId}, {
                $set: {
                    preach,
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
            const result: IFridayPreach | null = await PreachSettings.findOne({userId, date})

            if (result) {
                res.status(401).json("There is already a preach for that date");
                return;
            }

            await PreachSettings.create({
                userId,
                text,
                date
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
            const result: IFridayPreach[] = await PreachSettings.find({userId})

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
                    date
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

export default router;
