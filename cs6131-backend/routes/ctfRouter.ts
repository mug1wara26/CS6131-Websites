import express, {Request, Response}  from "express";
import * as ctfModel from '../model/ctfModel'
import * as teamModel from '../model/teamModel'
import {ctf} from "../types/ctfTypes";
import jwt from "jsonwebtoken";
import {BasicUser} from "../types/userTypes";
import {Team} from "../types/teamTypes";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ctfRouter = express.Router();

ctfRouter.get("/teamCTFs/:teamName", async (req: Request, res: Response) => {
    const teamName = req.params.teamName
    ctfModel.findTeamCTFs(teamName, (err: Error, ctfs: Array<ctf>) => {
        if (err) {
            res.statusMessage = 'Unable to get ctfs'
            return res.status(400).end()
        }
        else {
            const token = req.header('Authorization')
            if (token) {
                jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                    if (err) {
                        res.statusMessage = 'Invalid token'
                        return res.status(400).end();
                    }
                    else {
                        const user = decoded as BasicUser;
                        teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                            if (err) {
                                res.statusMessage = err.message;
                                res.status(400).end()
                            }
                            else if (teams.filter(team => team.name === teamName).length !== 0){
                                res.status(200).json(ctfs)
                            }
                            else return res.status(200).json(ctfs.filter(ctf => ctf.public))
                        })
                    }
                })
            }
            else return res.status(200).json(ctfs.filter(ctf => ctf.public))
        }
    })
})

export {ctfRouter}