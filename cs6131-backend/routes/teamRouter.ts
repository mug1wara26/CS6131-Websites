import express, {Request, Response}  from "express";
import * as teamModel from "../model/teamModel";
import {Team} from "../types/teamTypes";

const teamRouter = express.Router();

teamRouter.get("/user/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    teamModel.findUserTeams(username, (err: Error, teams: Array<Team>) => {
        if (err) {
            res.statusMessage = err.message;
            res.status(400).end();
        }
        else {
            res.status(200).json(teams);
        }
    })
})

export {teamRouter};