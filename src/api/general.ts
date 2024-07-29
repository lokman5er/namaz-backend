import express, {Request, Response} from "express";
import User from "../model/user";
import {handleError} from "../utils";
import axios from "axios";
import {IUser} from "../interfaces";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/confirm-email", async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    if (!token) {
        res.status(400).send("Missing confirmation token");
        return;
    }

    try {
        const user = await User.findOne({
            emailConfirmationToken: token,
            emailConfirmationExpires: { $gte: Date.now() }
        });

        if (!user) {
            res.status(400).send("Invalid or expired confirmation token");
            return;
        }

        user.email = user.pendingEmail as string;
        user.pendingEmail = undefined;
        user.emailConfirmationToken = undefined;
        user.emailConfirmationExpires = undefined;
        await user.save();

        res.status(200).send("Email address successfully confirmed and updated");
    } catch (error) {
        const serverLogMessage = "Error while confirming email change";
        handleError(res, error, serverLogMessage);
    }
});

router.get("/expand-url", async (req: Request, res: Response): Promise<void> => {
    let { shortUrl } = req.query;

    if (!shortUrl || typeof shortUrl !== 'string') {
        res.status(400).send("Missing or invalid shortUrl");
        return;
    }

    shortUrl = decodeURIComponent(shortUrl);

    try {
        let expandedUrl = shortUrl as string;

        if (!expandedUrl.startsWith('http://') && !expandedUrl.startsWith('https://')) {
            expandedUrl = 'https://' + expandedUrl;
        }

        const response = await expandAmazonUrl(expandedUrl);

        res.status(200).json({url: response});

    } catch (error) {
        console.error('Error while expanding url:', error);
        res.status(500).json({ status: 'error', error: 'Error while expanding url' });
    }
});

async function expandAmazonUrl(shortUrl: string) {
    try {
        const response = await axios.get(shortUrl, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400;
            },
        });

        if (response.status === 301 || response.status === 302) {
            return response.headers.location;
        } else {
            return shortUrl;
        }
    } catch (error) {
        console.error('Error while expanding url:', error);
        return shortUrl;
    }
}

router.post("/delete-user", async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.status(400).json("Missing required fields");
        return;
    }

    try {
        const user: IUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }) as IUser;

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json("Wrong password");
            return;
        }

        const result = await User.deleteOne({ username: new RegExp(`^${username}$`, 'i')});

        if (result.deletedCount === 1) {
            res.status(200).json("User deleted successfully");
            return;
        } else {
            res.status(400).json("User not found");
            return;
        }
    } catch (error) {
        const serverLogMessage = "Error while trying to delete account";

        handleError(res, error, serverLogMessage);
    }
});


export default router;
