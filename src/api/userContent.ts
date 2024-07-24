import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {IAnnouncementContent, IFridayPreach, ITokenPayload, IUserContent, IVerseContent} from "../interfaces";
import {handleError, isFriday, validateTextFields} from "../utils";
import {AnnouncementContent, UserContent, VerseContent} from "../model/userContent";
import {TEXT_LIMIT_PREACH} from "../constants/constants";
import PreachSettings from "../model/fridayPreach";

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || "";



export default router;
