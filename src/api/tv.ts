import express, {Request, Response} from 'express';
import DailyData from "../model/dailyData";
import User from "../model/user";
import {IDailyData, IUser} from "../interfaces";
import {handleError, sendMessageToTelegramGroup} from "../utils";
import {fetchMonthlyData} from "../util/diyanetUtil";

const router = express.Router();

router.get("/daily-data", async (req: Request, res: Response): Promise<void> => {
    const username = req.headers.username;
    const cityId = req.headers.cityid as string;

    let urlPara;

    if (username && username !== "") {
        const user: IUser = await User.findOne({
            username,
        });

        if (!user) {
            res.status(404).send("No user found with username: " + username);
            return;
        }

        urlPara = user.urlPara;
    } else if (cityId && cityId !== "-1") {
        urlPara = cityId;
    } else {
        return;
    }

    await fetchMonthlyData(parseInt(urlPara));

    const today: string = new Date().toISOString().slice(0, 10);

    try {
        const result: IDailyData[] = await DailyData.find({
            urlPara,
            date: {$gte: today}
        }).sort({date: 1});

        res.status(200).json(result);
    } catch (error) {
        const serverLogMessage = "Error while trying to get daily data for username: " + username;

        handleError(res, error, serverLogMessage);
    }
});

router.post('/log-error', async (req: Request, res: Response): Promise<void> => {
    console.log('Error received from client:', req.body);
    await sendMessageToTelegramGroup(req.body);
    res.status(204).send();
});

export default router;
