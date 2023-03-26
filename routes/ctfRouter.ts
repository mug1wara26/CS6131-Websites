import express, {Request, Response} from "express";
import * as ctfModel from '../model/ctfModel'
import * as teamModel from '../model/teamModel'
import {BasicCTF, CTF} from "../types/ctfTypes";
import jwt from "jsonwebtoken";
import {BasicUser} from "../types/userTypes";
import {Team} from "../types/teamTypes";
import {validate} from "class-validator";
import {createCTF} from "../model/ctfModel";
import {v4 as uuidv4} from 'uuid'
import {teamRouter} from "./teamRouter";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ctfRouter = express.Router();

ctfRouter.get("/teamCTFs/:teamName", async (req: Request, res: Response) => {
    const teamName = req.params.teamName
    ctfModel.findTeamCTFs(teamName, (err: Error, ctfs: Array<CTF>) => {
        if (err) {
            res.statusMessage = 'Unable to get ctfs'
            return res.status(400).end()
        } else {
            const token = req.header('Authorization')
            if (token) {
                jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                    if (err) {
                        res.statusMessage = 'Invalid token'
                        return res.status(400).end();
                    } else {
                        const user = decoded as BasicUser;
                        teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                            if (err) {
                                res.statusMessage = err.message;
                                res.status(400).end()
                            } else if (teams.filter(team => team.name === teamName).length !== 0) {
                                res.status(200).json(ctfs)
                            } else return res.status(200).json(ctfs.filter(ctf => ctf.public))
                        })
                    }
                })
            } else return res.status(200).json(ctfs.filter(ctf => ctf.public))
        }
    })
})

ctfRouter.get("/:id", async (req, res) => {
    const token = req.header('Authorization')
    const id = req.params.id

    console.log(token)

    if (id) {
        ctfModel.findOne(id, (err: Error, ctf: CTF) => {
            if (ctf) {
                if (ctf.public) return res.status(200).json(ctf)
                else {
                    if (token) {
                        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                            if (err) return res.status(400).end()
                            else {
                                const user = decoded as BasicUser
                                console.log(user)
                                teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                                    console.log(teams)
                                    if (err) return res.status(400).end()
                                    else {
                                        if (teams.filter(team => team.name === ctf.teamCreator).length !== 0) return res.status(200).json(ctf)
                                        else return res.status(200).json({id: ctf.id, hasAccess: false})
                                    }
                                })
                            }
                        })
                    }
                    else return res.status(200).json({id: ctf.id, hasAccess: false})
                }
            }
            else return res.status(400).end()
        })
    }
    else return res.status(400).end()
})

ctfRouter.get("/public/:name", async (req, res) => {
    const name = req.params.name
    ctfModel.publicExists(name, (ctfName: string) => {
        if (ctfName) res.status(200).json('Yes')
        else res.status(400).end()
    })
})
ctfRouter.post("/create", async (req, res) => {
    if (!req.body.ctf) res.status(400).end();
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            } else {
                const user = decoded as BasicUser;
                const basicCTF = new BasicCTF()
                Object.assign(basicCTF, req.body.ctf)

                validate(basicCTF).then(errors => {
                    if (errors.length > 0) {
                        let responseMessage = ''
                        if (errors.filter(e => e.property === 'url').length > 0) responseMessage = "CTF Link not valid"
                        else responseMessage = 'Check your information provided'
                        console.log(errors)

                        res.statusMessage = responseMessage
                        return res.status(400).end()
                    } else {
                        validateCTFCreation(basicCTF, user.username, (err: Error) => {
                            console.log(err)
                            if (err) {
                                res.statusMessage = err.message
                                return res.status(400).end()
                            } else {
                                const ctf = new CTF();
                                Object.assign(ctf, basicCTF)
                                console.log(ctf)
                                ctf.id = uuidv4()

                                createCTF(ctf, (err: Error) => {
                                    if (err) res.status(500).end();
                                    else res.status(200).json(ctf);
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})

const validateCTFCreation = (ctf: BasicCTF, username: string, callback: Function) => {
    teamModel.findOne(ctf.teamCreator, (err: Error, team: Team) => {
        // Check if team exists
        if (team) {
            // Only team owner can create ctfs
            if (team.owner === username) {
                // Check if ctf exists publicly
                ctfModel.publicExists(ctf.name, (ctfName: string) => {
                    if (ctf.public) {
                        // Two public ctfs cannot have the same name
                        if (ctfName) return callback(new Error('CTF Name already exists publicly'))
                        // Private team can only make private ctfs
                        if (!team.public) return callback(new Error('Private team cannot create public CTF'))
                    }
                    // Check if ctf name exists within team, whether private or public
                    ctfModel.teamCTFExists(ctf.name, team.name, (ctfName: string) => {
                        // Team cannot have two ctfs with same name
                        if (ctfName) return callback(new Error('Team already has CTF with that name'))
                        // Check if team has exceeded max number of ctfs (10)
                        ctfModel.findTeamCTFs(team.name, (err: Error, teams: Array<Team>) => {
                            if (teams && teams.length >= 10) return callback(new Error('Team has reached max number of CTFs'))
                            else return callback(null)
                        })
                    })
                })
            } else return callback(new Error('Only team owner can create new CTFs'))
        } else return callback(new Error('Team does not exist'))
    })
}

export {ctfRouter}