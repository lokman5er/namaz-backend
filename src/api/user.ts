import bcrypt from "bcryptjs";
import User from "../model/user";
import express, {Request, Response} from 'express';
import {handleError} from "../utils";
import jwt, {JwtPayload} from "jsonwebtoken";
import mongoose from "mongoose";
import {IUser} from "../interfaces";
import axios from "axios";

const router = express.Router();

const API_KEY: string = process.env.API_KEY || "";
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const RECAPTCHA_SECRET_KEY: string = process.env.RECAPTCHA_SECRET_KEY || "";

router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const {username, password: plainTextPassword, urlPara, apiKey} = req.body;

    if (apiKey !== API_KEY) {
        res.status(401).send("Wrong Api Key");
        return;
    }

    if (!username || typeof username !== "string") {
        res.status(400).send("Invalid username");
        return;
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
        res.status(400).send("Invalid password");
        return;
    }

    if (plainTextPassword.length < 5) {
        res.status(400).send("Password too short");
        return;
    }

    if (plainTextPassword.length > 15) {
        res.status(400).send("Password too long");
        return;
    }

    if (!urlPara) {
        res.status(400).send("urlPara missing");
        return;
    }

    const password: string = await bcrypt.hash(plainTextPassword, 12);

    try {
        const response = await User.create({
            username,
            password,
            urlPara,
        });
        console.log("User created successfully: ", response);
        res.status(201).send("User created successfully");
        return;
    } catch (error) {
        //TODO: test this properly
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).send("Database validation failed");
            return;
        } else if (typeof error === 'object' && error !== null && 'code' in error) {
            const mongoError = error as { code: number; [key: string]: any };
            if (mongoError.code === 11000) {
                res.status(409).send("Username or urlPara already in use"); // 409 Conflict
                return;
            }
        } else {
            const serverLogMessage = "Error while trying to register new user";

            handleError(res, error, serverLogMessage);
        }
    }
});

//TODO: rename to camelCase
router.post("/change-password", async (req: Request, res: Response): Promise<void> => {
    const {urlPara, newpassword, apiKey} = req.body;

    let userId;

    if (apiKey !== API_KEY) {
        res.status(401).send("Wrong Api Key");
        return;
    }

    if (!newpassword || typeof newpassword !== "string") {
        res.status(400).send("Invalid password");
        return;
    }

    if (newpassword.length < 5) {
        res.status(400).send("Password too short");
        return;
    }

    if (newpassword.length > 15) {
        res.status(400).send("Password too long");
        return;
    }

    try {
        const user: IUser = await User.findOne({urlPara}) as IUser;
        userId = user?.id;

        const password = await bcrypt.hash(newpassword, 12);

        await User.updateOne(
            {userId},
            {
                $set: {password},
            }
        );
        res.status(200).send("Password changed successfully");
    } catch (error) {
        const serverLogMessage = "Error while trying to change password of user: " + userId;

        handleError(res, error, serverLogMessage);
    }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).send("try harder ;)");
        return;
    }

    const user: IUser = await User.findOne({username}).lean() as IUser;

    if (!user) {
        res.status(400).send("Invalid username/password");
        return;
    }

    if (await bcrypt.compare(password, user.password)) {
        //username + password combination is successful

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                urlPara: user.urlPara,
            },
            JWT_SECRET,
            {expiresIn: "60m"}
        );

        await User.updateOne({username: user.username}, {$set: {token}});

        res.status(200).send("Login was successfully");
        return;
    }

    res.status(400).json({error: 'Invalid username/password'});
});

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
    const {token} = req.body;

    if (!token) {
        res.status(400).send("No token provided");
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const userId = (decoded as JwtPayload & { id?: string }).id;

        if (userId) {
            await User.findByIdAndUpdate(userId, {$unset: {token: 1}});
            res.status(200).send("Logged out successfully");
            return;
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).send("Token is expired");
            return;
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).send("Invalid token");
            return;
        } else {
            const serverLogMessage = "Error while trying to logout user";

            handleError(res, error, serverLogMessage);
        }
    }
});

router.get("/check-token", async (req: Request, res: Response): Promise<void> => {
    const token = req.query.token;

    if (typeof token !== "string") {
        res.status(400).send("Token must be a string.");
        return;
    }

    try {
        const result = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string };

        const user = await User.findById(result.id);

        if (!user) {
            res.status(404).send("User not found.");
            return;
        }

        if (!user.token) {
            res.status(401).json({status: "error", error: "Token invalid or expired."});
            return;
        }

        res.status(200).send("Token is valid.");
    } catch (error) {
        const serverLogMessage = "Error while trying to check token";

        handleError(res, error, serverLogMessage);
    }
});

// ################################################## APP API START ##################################################

router.post('/app/login', async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).send("try harder ;)");
        return;
    }

    const user: IUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).lean() as IUser;

    if (!user) {
        res.status(400).send("Invalid username/password");
        return;
    }

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

        res.status(200).json({username, token});
        return;
    }

    res.status(400).json({error: 'Invalid username/password'});
});

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const {username, email, password: plainTextPassword, urlPara} = req.body;
    const token = req.body.recaptcha_token;

    if (!token) {
        res.status(400).json({ error: 'No reCAPTCHA token provided' });
        return;
    }

    if (!email || typeof email !== "string") {
        res.status(400).send("Invalid username");
        return;
    }

    if (!username || typeof username !== "string") {
        res.status(400).send("Invalid username");
        return;
    }

    if (username.length < 6) {
        res.status(400).send("username too short");
        return;
    }

    if (username.length > 15) {
        res.status(400).send("username too long");
        return;
    }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
        res.status(400).send("Invalid password");
        return;
    }

    if (plainTextPassword.length < 6) {
        res.status(400).send("Password too short");
        return;
    }

    if (plainTextPassword.length > 15) {
        res.status(400).send("Password too long");
        return;
    }

    if (!urlPara) {
        res.status(400).send("urlPara missing");
        return;
    }

    const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        {},
        {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            }
        }
    );

    const data = response.data;

    if (!data.success || data.score <= 0.5) {
        res.json({ success: false, message: 'Bot detected' });
    }

    const password: string = await bcrypt.hash(plainTextPassword, 12);

    try {

        const response = await User.create({
            username,
            email,
            password,
            urlPara
        });
        console.log("User created successfully: ", response);
        res.status(201).send({message: "User created successfully"});
        return;
    } catch (error) {
        console.log("error: " + error)
        //TODO: test this properly
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).send("Database validation failed");
            return;
        } else if (typeof error === 'object' && error !== null && 'code' in error) {
            const mongoError = error as { code: number; [key: string]: any };
            if (mongoError.code === 11000) {
                res.status(409).send("Username or urlPara already in use"); // 409 Conflict
                return;
            }
        } else {
            const serverLogMessage = "Error while trying to register new user";

            handleError(res, error, serverLogMessage);
        }
    }
});
export default router;
