import express, {Request, Response} from "express";
import * as teamModel from "../model/teamModel";
import {MemberStat, Team} from "../types/teamTypes";
import {BasicUser} from "../types/userTypes";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {validate} from "class-validator";
import {QueryError} from "mysql2";
import * as querystring from "querystring";

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

teamRouter.get("/getTeam/:name", async (req: Request, res: Response) => {
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

teamRouter.get('/userTeams', async (req, res) => {
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser
                teamModel.findUserTeams(user.username, (err: Error, teams: Array<Team>) => {
                    if (err) return res.status(500).end()
                    else return res.status(200).json({teams: teams})
                })
            }
        })
    }
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

const inviteRequestTeam = (table: string, teamName: string, username: string, token: string | undefined, callback: Function) => {
    if (teamName && username && token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser

                // If user is requesting to join, token must match, if user is inviting someone to team, user must be owner of team
                if (table === 'invite') {
                    teamModel.findOne(teamName, (err: Error, team: Team) => {
                        if (err) return callback(500, 'Internal Server Error')
                        if (team) {
                            if (team.owner === user.username) inviteRequestTeamCallback(table, teamName, username, (status: number, statusMessage: string) => {
                                callback(status, statusMessage)
                            })
                        }
                        else return callback(400, 'Bad request')
                    })
                }

                if (table === 'request') {
                    teamModel.findMembers(teamName, (err: Error, members: Array<string>) => {
                        if (err) callback(500, 'Internal Server Error')
                        else {
                            if (members.includes(username)) callback(400, 'Bad request')
                            else inviteRequestTeamCallback(table, teamName, username, (status: number, statusMessage: string) => {
                                callback(status, statusMessage)
                            })
                        }
                    })
                }
            }
        })
    }
    else return callback(400, 'Bad request')
}

const inviteRequestTeamCallback = (table: string, teamName: string, username: string, callback: Function) => {
    teamModel.inviteRequestTeam(table, teamName, username, (err: QueryError) => {
        if (err) {
            if (['ER_DUP_ENTRY', 'ER_NO_REFERENCED_ROW_2'].includes(err.code)) return callback(400, 'Bad request')
            else return callback(500, 'Internal Server Error')
        }
        else return callback(200, 'OK')
    })
}
teamRouter.post('/request', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    inviteRequestTeam('request', teamName, username, token, (status: number, statusMessage: string) => {
        res.statusMessage = statusMessage
        return res.status(status).end()
    })
})

teamRouter.post('/invite', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    inviteRequestTeam('invite', teamName, username, token, (status: number, statusMessage: string) => {
        res.statusMessage = statusMessage
        return res.status(status).end()
    })
})

const hasRequestedOrInvited = (table: string, teamName: string, username: string, token: string | undefined, callback: Function) => {
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser
                if (user.username === username) {
                    teamModel.hasRequestedInvited(table, teamName, username, (err: Error, hasRequestedOrInvited: boolean) => {
                        if (err) return callback(500, 'Internal Server Error')
                        else return callback(200, 'OK', hasRequestedOrInvited)
                    })
                }
                else return callback(400, 'Bad request')
            }
        })
    }
    else return callback(400, 'Bad request')
}
teamRouter.get('/hasRequested/:teamName/:username', async (req, res) => {
    const teamName = req.params.teamName
    const username = req.params.username
    const token = req.header('Authorization')

    hasRequestedOrInvited('request', teamName, username, token, (status: number, statusMessage: string, hasRequested: boolean) => {
        if (status === 200) return res.status(200).json({hasRequested: hasRequested})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

teamRouter.get('/hasInvited/:teamName/:username', async (req, res) => {
    const teamName = req.params.teamName
    const username = req.params.username
    const token = req.header('Authorization')

    hasRequestedOrInvited('invite', teamName, username, token, (status: number, statusMessage: string, hasInvited: boolean) => {
        if (status === 200) return res.status(200).json({hasInvited: hasInvited})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

export const getRequestedOrInvitedTeams = (table: string, username: string, token: string | undefined, callback: Function) => {
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser

                if (user.username === username) {
                    teamModel.findRequestedOrInvitedTeams(table, username, (err: Error, teams: Array<Team>) => {
                        if (err) return callback(500, 'Internal Server Error')
                        else return callback(200, 'OK', teams)
                    })
                }
                else return callback(400, 'Bad request')
            }
        })
    }
    else return callback(400, 'Bad request')
}

teamRouter.get('/getRequestedTeams/:username', async (req, res) => {
    const username = req.params.username
    const token = req.header('Authorization')

    getRequestedOrInvitedTeams('request', username, token, (status: number, statusMessage: string, teams: Array<Team>) => {
        if (status === 200) return res.status(200).json({teams: teams})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

teamRouter.get('/getInvitedTeams/:username', async (req, res) => {
    const username = req.params.username
    const token = req.header('Authorization')

    getRequestedOrInvitedTeams('invite', username, token, (status: number, statusMessage: string, teams: Array<Team>) => {
        if (status === 200) return res.status(200).json({teams: teams})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

export const getRequestedOrInvitedUsers = (table: string, teamName: string, token: string | undefined, callback: Function) => {
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser

                teamModel.findOne(teamName, (err: Error, team: Team) => {
                    if (err) return callback(500, 'Internal Server Error')
                    if (team && team.owner === user.username) {
                        teamModel.findRequestedOrInvitedUsers(table, teamName, (err: Error, users: Array<BasicUser>) => {
                            if (err) return callback(500, 'Internal Server Error')
                            else {
                                return callback(200, 'OK', users)
                            }
                        })
                    }
                    else return callback(400, 'Bad request')
                })
            }
        })
    }
    else return callback(400, 'Bad request')
}

teamRouter.get('/getRequestedUsers/:teamName', async (req, res) => {
    const teamName = req.params.teamName
    const token = req.header('Authorization')

    getRequestedOrInvitedUsers('request', teamName, token, (status: number, statusMessage: string, users: Array<BasicUser>) => {
        if (status === 200) return res.status(200).json({users: users})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

teamRouter.get('/getInvitedUsers/:teamName', async (req, res) => {
    const teamName = req.params.teamName
    const token = req.header('Authorization')

    getRequestedOrInvitedUsers('invite', teamName, token, (status: number, statusMessage: string, users: Array<BasicUser>) => {
        if (status === 200) return res.status(200).json({users: users})
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    })
})

teamRouter.get('/getNotInvitedTeams/:username', async (req, res) => {
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
                teamModel.findNotInvitedTeams(user.username, username, (err: Error, teams: Array<Team>) => {
                    if (err) return res.status(500).end()
                    else return res.status(200).json({teams: teams})
                })
            }
        })
    }
    else return res.status(400).end()
})

teamRouter.post('/join', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    if (token && teamName && username) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser
                teamModel.findMembers(teamName, (err: Error, members: Array<string>) => {
                    if (err) return res.status(500).end()
                    else {
                        if (members.includes(username)) return res.status(400).end()
                        else {
                            teamModel.findOne(teamName, (err: Error, team: Team) => {
                                if (err) return res.status(500).end()
                                if (team.owner === user.username) {
                                    teamModel.joinTeam(teamName, username, (err: Error) => {
                                        if (err) return res.status(500).end()
                                        else return res.status(200).end()
                                    })
                                }
                                else return res.status(400).end()
                            })
                        }
                    }
                })
            }
        })
    }
})

const denyRequestOrInvite = (table: string, teamName: string, username: string, token: string | undefined, callback: Function) => {
    if (token && teamName && username) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) return callback(400, 'Invalid token')
            else {
                const user = decoded as BasicUser

                teamModel.findOne(teamName, (err: Error, team: Team) => {
                    if (err) return callback(500, 'Internal Server Error')
                    else if (team.owner === user.username) {
                        teamModel.removeInviteOrRequest(table, teamName, username, (err: Error) => {
                            if (err) callback(500, 'Internal Server Error')
                            else callback(200, 'OK')
                        })
                    }
                    else return callback(400, 'Bad request')
                })
            }
        })
    }
    else return callback(400, 'Bad request')
}

teamRouter.post('/denyRequest', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    denyRequestOrInvite('request', teamName, username, token, (status: number, statusMessage: string) => {
        res.statusMessage = statusMessage
        return res.status(status).end()
    })
})

teamRouter.post('/removeInvite', async (req, res) => {
    const teamName = req.body.teamName
    const username = req.body.username
    const token = req.header('Authorization')

    denyRequestOrInvite('invite', teamName, username, token, (status: number, statusMessage: string) => {
        res.statusMessage = statusMessage
        return res.status(status).end()
    })
})

teamRouter.post('/leave', async (req, res) => {
    const teamName = req.body.teamName
    const token = req.header('Authorization')

    if (token && teamName) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser

                teamModel.findMembers(teamName, (err: Error, members: Array<string>) => {
                    if (err) return res.status(500).end()
                    else if (members.includes(user.username)) {
                        if (members.length === 1) {
                            teamModel.deleteTeam(teamName, (err: Error) => {
                                if (err) return res.status(500).end()
                                else return res.status(200).end()
                            })
                        }
                        else {
                            teamModel.findOne(teamName, (err: Error, team: Team) => {
                                if (err) return res.status(500).end()
                                else {
                                    if (team.owner !== user.username) {
                                        teamModel.leaveTeam(teamName, user.username, (err: Error) => {
                                            if (err) return res.status(500).end()
                                            else return res.status(200).end()
                                        })
                                    }
                                    else return res.status(400).end()
                                }
                            })
                        }
                    }
                    else return res.status(400).end()
                })
            }
        })
    }
    else return res.status(400).end()
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