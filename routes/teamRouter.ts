import express, {Request, Response}  from "express";
import * as teamModel from "../model/teamModel";
import {Team} from "../types/teamTypes";
import {BasicUser, User} from "../types/userTypes";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {validate} from "class-validator";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const teamRouter = express.Router();

teamRouter.post('/create', async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
           if (err) {
               res.statusMessage = 'Invalid token'
               return res.status(400).end()
           }
           else {
               const user = decoded as BasicUser;
               const team = Object.assign(new Team(), {
                   name: req.body.name,
                   description: req.body.description,
                   pfp: req.body.pfp,
                   public: req.body.public,
                   owner: user.username
               })

               validate(team).then(errors => {
                   if (errors.length > 0) {
                       let responseMessage = ''
                       if (errors.filter(e => e.property === 'pfp').length > 0) responseMessage = "Profile link not valid"
                       else responseMessage = 'Check your information provided'
                       console.log(errors)

                       res.statusMessage = responseMessage
                       return res.status(400).end()
                   }
                   else {
                       teamModel.create(team, (err: Error) => {
                           if (err) {
                               res.statusMessage = err.message;
                               return res.status(400).end()
                           }
                           else return res.status(200).end()
                       })
                   }
               })
           }
        })
    }
    else return res.status(400).end()
})

teamRouter.get("/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    teamModel.findOne(name, (err: Error, team: Team) => {
        if (team) {
            if (team.public) return res.status(200).json(team);
            else {
                const token = req.header('Authorization')
                if (token) {
                    jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                        if (err) return res.status(400).end()
                        else {
                            const user = decoded as BasicUser;
                            teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                                if (err) return res.status(400).end()
                                else {
                                    if (teams.filter(team => team.name === name).length !== 0) return res.status(200).json(team)
                                    else return res.status(200).json({name: team.name, hasAccess: false})
                                }
                            })
                        }
                    })
                }
                else return res.status(200).json({name: team.name, hasAccess: false})
            }
        }
        else return res.status(400).end();
    })
})

// TODO: If no token given, return all teams that are public
teamRouter.get("/userTeams/:username", async (req: Request, res: Response) => {
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
    else return res.status(400).end();
})

export {teamRouter};