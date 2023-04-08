import express, {Request, Response} from "express";
import * as teamModel from "../model/teamModel";
import {MemberStat, Team} from "../types/teamTypes";
import {BasicUser} from "../types/userTypes";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {validate} from "class-validator";
import {QueryError} from "mysql2";
import {findRequested} from "../model/teamModel";

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
            } else {
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
                    } else {
                        teamModel.create(team, (err: Error) => {
                            if (err) {
                                res.statusMessage = err.message;
                                return res.status(400).end()
                            } else return res.status(200).end()
                        })
                    }
                })
            }
        })
    } else return res.status(400).end()
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
                } else return res.status(200).json({name: team.name, hasAccess: false})
            }
        } else return res.status(400).end();
    })
})

// TODO: If no token given, return all teams that are public
teamRouter.get("/userTeams/:username", async (req: Request, res: Response) => {
    const token = req.header('Authorization')
    const username = req.params.username

    teamModel.findUserTeams(username, (err: Error, teams: Array<Team>) => {
        if (err) return res.status(500).end()
        else if (token) {
            jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                if (err) {
                    res.statusMessage = 'Invalid Token'
                    res.status(400).end();
                } else {
                    const user = decoded as BasicUser
                    if (username === user.username) return res.status(200).json({teams: teams, isPublic: false})
                    else return res.status(200).json({teams: teams.filter(team => team.public), isPublic: true})
                }
            })

        } else return res.status(200).json({teams: teams.filter(team => team.public), isPublic: true})
    })
})

teamRouter.get('/members/:name', async (req, res) => {
    const token = req.header('Authorization')
    const teamName = req.params.name

    teamModel.findMembers(teamName, (err: Error, result: Array<string>, isPublic: boolean) => {
        if (err) return res.status(500).end()
        if (isPublic) return res.status(200).json(result)
        else {
            isMember(token, result, (status: number, message: string) => {
                if(status === 200) return res.status(200).json(result)
                else {
                    res.statusMessage = message;
                    return res.status(status).end()
                }
            })
        }
    })
})


teamRouter.get('/getMemberStats/:teamName', async (req, res) => {
    const token = req.header('Authorization')
    const teamName = req.params.teamName


    teamModel.findMembers(teamName, (err: Error, members: Array<string>, isPublic: boolean) => {
        if (err) return res.status(500).end()
        teamModel.findMemberStats(teamName, (err: Error, memberStats: Array<MemberStat>) => {
            if (err) return res.status(500).end()
            if (isPublic) return res.status(200).json(memberStats)
            isMember(token, members, (status: number, message: string) => {
                if (status===200) return res.status(200).json(memberStats)
                else {
                    res.statusMessage = message;
                    return res.status(status).end()
                }
            })
        })
    })
})

teamRouter.post('/request', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    if (teamName && username && token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser

                if (username === user.username) {
                    teamModel.requestToJoin(teamName, username, (err: QueryError) => {
                        console.log(err)
                        if (err) {
                            if (['ER_DUP_ENTRY', 'ER_NO_REFERENCED_ROW_2'].includes(err.code)) return res.status(400).end()
                            else return res.status(500).end()
                        }
                        else return res.status(200).end()
                    })
                }
                else return res.status(400).end()
            }
        })
    }
    else return res.status(400).end()
})

teamRouter.get('/hasRequested/:teamName/:username', async (req, res) => {
    const teamName = req.params.teamName
    const username = req.params.username
    const token = req.header('Authorization')

    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = "Invalid token"
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser
                if (user.username === username) {
                    findRequested(teamName, username, (err: Error, hasRequested: boolean) => {
                        if (err) return res.status(500).end()
                        else return res.status(200).json({hasRequested: hasRequested})
                    })
                }
                else return res.status(400).end()
            }
        })
    }
    else return res.status(400).end()
})

teamRouter.get('/getRequestedTeams/:username', async (req, res) => {
    const username = req.params.username
    const token = req.header('Authorization')

    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser

                if (user.username === username) {
                    teamModel.findRequestedTeams(username, (err: Error, teams: Array<Team>) => {
                        if (err) return res.status(500).end()
                        else {
                            return res.status(200).json({teams: teams})
                        }
                    })
                }
                else return res.status(400).end()
            }
        })
    }
})

const isMember = (token: string | undefined, members: Array<string>, callback: Function) => {
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser

                if (members.includes(user.username)) return callback(200)
                else return callback(400, 'Bad request')
            }
        })
    }
    else return callback(400, 'Bad request')
}

export {teamRouter};