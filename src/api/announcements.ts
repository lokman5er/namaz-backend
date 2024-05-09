// import express, { Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import Announcement from "../model/announcement";
// import { checkTokenExpiration, handleError } from "../utils";
// import {DeleteResult, ITokenPayload} from "../interfaces";
//
// const JWT_SECRET: string = process.env.JWT_SECRET || "";
//
// const router = express.Router();
//
// router.post("/api/new-an", async (req: Request, res: Response): Promise<void> => {
//     const {token, startDate, endDate, text} = req.body;
//
//     if (!token || !startDate || !endDate || !text) {
//         res.status(400).send("Missing required fields");
//         return;
//     }
//
//     if (checkTokenExpiration(token, res)) {
//         return;
//     }
//
//     try {
//         //TODO: are we getting the user object or userId out of the token?
//         const user = jwt.verify(token, JWT_SECRET);
//
//         if (typeof user === "object" && user !== null) {
//             const urlPara = (user as JwtPayload & { urlPara: string }).urlPara;
//             // Retrieve all announcements with the same 'urlPara'
//             const announcements: IAnnouncement[] = await Announcement.find({urlPara});
//
//             // Check if the time period of the new announcement overlaps with any of the existing announcements
//             let overlaps = false;
//
//             const ns = Date.parse(startDate) / 1000;
//             const ne = Date.parse(endDate) / 1000;
//
//             announcements.forEach((a) => {
//                 if (overlaps) {
//                     return;
//                 }
//                 const os = a.startDate.getTime() / 1000;
//
//                 let oe: number;
//                 if (a.endDate !== null && a.endDate !== undefined) {
//                     oe = a.endDate.getTime() / 1000;
//                 } else {
//                     return res.status(500).send("Internal error: End date of an announcement is undefined");
//                 }
//
//                 if (
//                     (ns <= os && ne >= os && ne <= oe) ||
//                     (ns <= os && ne >= oe) ||
//                     (ns >= os && ne <= oe) ||
//                     (ns >= os && ns <= oe && ne >= oe)
//                 ) {
//                     overlaps = true;
//                 }
//             });
//
//             if (overlaps) {
//                 res.status(409).send("Announcement period overlaps with an existing announcement");
//             } else {
//                 const result: IAnnouncement = await Announcement.create({
//                     urlPara,
//                     text,
//                     startDate,
//                     endDate,
//                 });
//
//                 console.log(result);
//                 res.status(200).send("New announcement added successfully")
//             }
//         } else {
//             res.status(500).send("Internal server error");
//         }
//     } catch (error) {
//         const serverLogMessage = "Error while trying to add new announcement";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// router.get("/api/get-All-an", async (req: Request, res: Response): Promise<void> => {
//     const token = req.query.token;
//
//     if (!token) {
//         res.status(400).send("Missing required fields");
//         return;
//     }
//
//     if (typeof token !== "string") {
//         res.status(400).send("Token needs to be a string");
//         return;
//     }
//
//     if (checkTokenExpiration(token, res)) {
//         return;
//     }
//
//     try {
//         const tokenResult = jwt.verify(token, JWT_SECRET);
//         if (typeof tokenResult === "object" && tokenResult !== null) {
//             const user = tokenResult as JwtPayload;
//             const urlPara = user.urlPara;
//             //find all announcements whose endDate is greater than or equal to today at midnight
//             const today = new Date();
//             today.setHours(0, 0, 0, 0); // Set the time to midnight
//             const result = await Announcement.find({
//                 urlPara,
//                 endDate: {$gte: today},
//             }).sort({startDate: 1});
//             res.status(200).json({result});
//         }
//     } catch (error) {
//         //todo add here userId, type for user out of jwtPayload needed
//         const serverLogMessage = "Error while trying to get all announcements";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// router.post("/api/deleteAnnouncement", async (req: Request, res: Response): Promise<void> => {
//     const {token, startDate} = req.body;
//
//     if (!token || !startDate) {
//         res.status(400).send("Missing required fields");
//         return;
//     }
//
//     if (checkTokenExpiration(token, res)) {
//         return;
//     }
//
//     try {
//         const user = jwt.verify(token, JWT_SECRET);
//         if (typeof user === "object" && user !== null && "urlPara" in user) {
//             const urlPara = (user as JwtPayload & { urlPara: string }).urlPara;
//
//             //TODO: CRITICAL!! change this logic to work with userName instead of urlPara -> multiple users can have same urlPara
//             const result: DeleteResult = await Announcement.deleteOne({
//                 urlPara,
//                 startDate
//             });
//
//             if (result.deletedCount > 0) {
//                 res.status(200).send("Announcement deleted successfully");
//             } else {
//                 res.status(404).send("No announcement found to delete");
//             }
//         } else {
//             res.status(400).send("Invalid user data");
//         }
//     } catch (error) {
//         const serverLogMessage = "Error while trying to delete an announcement";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// router.get("/api/getAllAnnouncements", async (req: Request, res: Response): Promise<void> => {
//     const urlPara = req.query.urlPara;
//
//     if (!urlPara) {
//         res.status(400).send("Missing required urlPara");
//         return;
//     }
//
//     try {
//         // Find all announcements whose endDate is greater than or equal to today at midnight
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Set the time to midnight
//
//         const result: IAnnouncement[] = await Announcement.find({
//             urlPara,
//             endDate: {$gte: today},
//         }).sort({startDate: 1});
//
//         res.status(200).json({result});
//     } catch (error) {
//         const serverLogMessage = "Error while trying to get all Announcements";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// // ################################################## APP API START ##################################################
//
// router.post("/app/add", async (req: Request, res: Response): Promise<void> => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//
//     const {startDate, endDate, text} = req.body;
//
//     if (!token || !startDate || !endDate || !text) {
//         res.status(400).send("Missing required fields");
//         return;
//     }
//
//     if (checkTokenExpiration(token, res)) {
//         return;
//     }
//
//     try {
//         const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;
//
//         const userId = tokenPayload.userId;
//
//         const announcements: IAnnouncement[] = await Announcement.find({userId});
//
//         // Check if the time period of the new announcement overlaps with any of the existing announcements
//         let overlaps = false;
//
//         const ns = Date.parse(startDate) / 1000;
//         const ne = Date.parse(endDate) / 1000;
//
//         announcements.forEach((a) => {
//             if (overlaps) {
//                 return;
//             }
//
//             const os = a.startDate.getTime() / 1000;
//
//             let oe: number;
//             if (a.endDate !== null && a.endDate !== undefined) {
//                 oe = a.endDate.getTime() / 1000;
//             } else {
//                 return res.status(500).send("Internal error: End date of an announcement is undefined");
//             }
//
//             if (
//                 (ns <= os && ne >= os && ne <= oe) ||
//                 (ns <= os && ne >= oe) ||
//                 (ns >= os && ne <= oe) ||
//                 (ns >= os && ns <= oe && ne >= oe)
//             ) {
//                 overlaps = true;
//             }
//         });
//
//         if (overlaps) {
//             res.status(409).send("Announcement period overlaps with an existing announcement");
//             return;
//         }
//
//         const result: IAnnouncement = await Announcement.create({
//             userId,
//             text,
//             startDate,
//             endDate,
//         });
//
//         console.log(result);
//         res.status(200).send(result);
//         return;
//     } catch (error) {
//         const serverLogMessage = "Error while trying to add new announcement";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// router.get("/app/get-all", async (req: Request, res: Response): Promise<void> => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//
//     if (!token) {
//         res.status(400).send("Missing required token");
//         return;
//     }
//
//     try {
//         const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;
//
//         // Find all announcements whose endDate >= today at midnight
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//
//         const result: IAnnouncement[] = await Announcement.find({
//             userId: tokenPayload.userId,
//             endDate: {$gte: today},
//         }).sort({startDate: 1});
//
//         res.status(200).json(result);
//     } catch (error) {
//         const serverLogMessage = "Error while trying to get all Announcements";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// router.post("/app/delete", async (req: Request, res: Response): Promise<void> => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//
//     const announcementId = req.body.id;
//
//     if (!token || !announcementId) {
//         res.status(400).send("Missing required fields");
//         return;
//     }
//
//     if (checkTokenExpiration(token, res)) {
//         return;
//     }
//
//     try {
//         const tokenPayload = jwt.verify(token, JWT_SECRET) as ITokenPayload;
//
//         const result: DeleteResult = await Announcement.deleteOne({
//             _id: announcementId
//         });
//
//         if (result.deletedCount === 1) {
//             res.status(200).send("Announcement deleted successfully");
//         } else {
//             res.status(404).send("No announcement found to delete");
//         }
//     } catch (error) {
//         const serverLogMessage = "Error while trying to delete an announcement";
//
//         handleError(res, error, serverLogMessage);
//     }
// });
//
// export default router;
//
//
// //TODO: which one of getAllAn is for admin view, which one for mosque view -> move mosque view to tv.ts
