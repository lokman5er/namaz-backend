import express, {Request, Response} from 'express';
import DailyData from "../model/dailyData";
import User from "../model/user";
import {IDailyData, IUser} from "../interfaces";
import {handleError, sendMessageToTelegramGroup} from "../utils";

const router = express.Router();

router.get("/getDailyData", async (req: Request, res: Response): Promise<void> => {
    const username = req.query.urlPara;

    if (!username) {
        res.status(400).send("Missing required fields");
        return;
    }

    const user: IUser = await User.findOne({
        username,
    });

    if (!user) {
        res.status(404).send("No user found with username: " + username);
        return;
    }

    const urlPara: string = user.urlPara;

    const today: string = new Date().toISOString().slice(0, 10);

    try {
        // find all prayer times that have a date greater than or equal to today's date
        const result: IDailyData[] = await DailyData.find({
            urlPara,
            date: {$gte: today}
        }).sort({date: 1});

        if (result.length < 12) {
            await sendMessageToTelegramGroup(`Seems like scheduler to fetch diyanet data didn't work, urlPara: 
            ${urlPara} has only ${result.length} future dates in the database`);
        }

        res.status(200).json({data: result});
    } catch (error) {
        const serverLogMessage = "Error while trying to get daily data for username: " + username;

        handleError(res, error, serverLogMessage);
    }
});

router.post('/api/log-error', async (req: Request, res: Response): Promise<void> => {
    console.log('Error received from client:', req.body);
    await sendMessageToTelegramGroup(req.body);
    res.status(204).send();
});

export default router;
