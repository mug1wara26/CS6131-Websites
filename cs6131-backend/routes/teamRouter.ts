import express, {Request, Response}  from "express";
import * as teamModel from "../model/teamModel";
import {Team} from "../types/teamTypes";
import {BasicUser} from "../types/userTypes";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const teamRouter = express.Router();

teamRouter.post("/user", async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid Token'
                res.status(400).end();
            }
            else {
                const user = decoded as BasicUser

                teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                    if (err) {
                        res.statusMessage = err.message;
                        res.status(400).end();
                    } else {
                        res.status(200).json(teams);
                    }
                })
            }
        })

    }
    else res.status(400).end();
})

export {teamRouter};