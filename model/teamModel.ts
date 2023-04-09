import {db} from "../db";
import {RowDataPacket} from "mysql2";
import * as userModel from "./userModel";
import {User} from "../types/userTypes";
import {Team} from "../types/teamTypes";

export const findUserTeams = (username: string, callback: Function) => {
    const queryString = `
SELECT team.*
FROM team left join member on team.name = member.teamName
WHERE BINARY username = ?
ORDER BY name
    `

    db.query(
        queryString,
        username,
        (err, result) => {
            if (err) callback(err)
            else {
                callback(null, <RowDataPacket> result)
            }
        }
    )
}

export const findOne = (name: string, callback: Function) => {
    const queryString = `
SELECT *
FROM team
where BINARY name = ?
    `

    db.query(
        queryString,
        name,
        (err, result) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket> result)[0])
        }
    )
}

export const exists = (name: string, callback: Function) => {
    const queryString = `
SELECT name
FROM team
WHERE BINARY name = ?
    `
    db.query(
        queryString,
        name,
        (err, result) => {
            const name = (<RowDataPacket> result)[0];
            if (name) callback(name)
            else callback("")
        }
    )
}

export const create = (team: Team, callback: Function) => {
    userModel.findOne(team.owner, (err: Error, user: User) => {
        if (err) callback(new Error('User does not exist'))
        else {
            exists(team.name, (teamName: string) => {
                if (!teamName) {
                    findUserTeams(team.owner, (err: Error, teams: Array<Team>) => {
                        if (err) callback(err)
                        else if (teams.length >= 10) callback(new Error('User has reached max number of teams'))
                        else {
                            const querystring = `
INSERT INTO team
VALUES(?,?,?,?,?);
                    `

                            db.query(
                                querystring,
                                [team.name, team.description, team.pfp, team.public, team.owner],
                                (err, result) => {
                                    if (err) callback(err);
                                    else callback(null)
                                }
                            )
                        }
                    })
                }
                else callback(new Error('Team Name already exists'))
            })
        }
    })
}

export const findMembers = (name: string, callback: Function) => {
    const queryString = `
SELECT member.username, team.public
FROM team, member
WHERE BINARY team.name = member.teamName AND BINARY team.name = ?
    `

    db.query(
        queryString,
        name,
        (err, result) => {
            if (err) callback(err)
            else {
                const rows = <RowDataPacket[]> result
                callback(err, rows.map(row => row.username), rows[0].public)
            }
        }
    )
}

// Get num_competing, num_solves, total_points of all public ctfs that each member has competed in
export const findMemberStats = (teamName: string, callback: Function) => {
    const queryString = `
SELECT m.username, count(c.ctfid) num_competing, count(s.ctfid) num_solves, sum(chal.points) total_points
from member m
left join competitor c on m.username = c.competitorName and m.teamName = c.teamName
left join solve s on c.ctfid = s.ctfid
left join challenge chal on chal.name = s.chalName and chal.ctfid = s.ctfid
left join ctf on c.ctfid = ctf.id and ctf.public
where m.teamName = ?
group by m.username
    `

    db.query(
        queryString,
        teamName,
        (err, result) => {
            if (err) callback(err)
            else {
                const rows = (<RowDataPacket[]> result)
                for (const rowsKey in rows) {
                    const totalPoints = rows[rowsKey].total_points
                    rows[rowsKey].total_points = totalPoints !== null ? parseInt(totalPoints) : 0
                }
                callback(null, rows)
            }
    })
}

export const inviteRequestTeam = (tableName: string, teamName: string, username: string, callback:Function) => {
    const queryString = `
INSERT INTO ${tableName} VALUES
(?, ?)
    `

    db.query(
        queryString,
        [teamName, username],
        (err) => {
            callback(err)
        }
    )
}
export const hasRequestedInvited = (table: string, teamName: string, username: string, callback: Function) => {
    const queryString = `
SELECT *
FROM ${table}
WHERE teamName = ? AND username = ?
    `

    db.query(
        queryString,
        [teamName, username],
        (err, result) => {
            if (err) callback(err)
            else {
                if((<RowDataPacket[]> result).length > 0) callback(null, true)
                else callback(null, false)
            }
        }
    )
}

export const findRequestedOrInvitedTeams = (table: string, username: string, callback: Function) => {
    const queryString = `
SELECT team.*
FROM team, ${table} t
WHERE BINARY t.username = ? AND BINARY team.name = t.teamName
    `

    db.query(
        queryString,
        username,
        (err, result) => {
            if (err) callback(err)
            else callback(null, <RowDataPacket> result)
        }
    )
}

export const findRequestedOrInvitedUsers = (table: string, teamName: string, callback: Function) => {
    const queryString = `
SELECT user.username, user.displayName, user.email, user.pfp, user.bio
FROM user, ${table} t
WHERE BINARY t.teamName = ? AND BINARY user.username = t.username
    `

    db.query(
        queryString,
        teamName,
        (err, result) => {
            if (err) callback(err)
            else callback(null, <RowDataPacket> result)
        }
    )
}

export const findNotInvitedTeams = (owner: string, username: string, callback: Function) => {
    const queryString = `
SELECT *
FROM team
WHERE BINARY team.owner = ? AND ? NOT IN (
    SELECT username
    FROM invite
    WHERE teamName = team.name
)
    `

    db.query(
        queryString,
        [owner, username],
        (err, result) => {
            callback(err, <RowDataPacket> result)
        }
    )
}

export const deleteTeam = (teamName: string, callback: Function) => {
    const queryString = `
DELETE FROM team
WHERE BINARY team.name = ?
    `

    db.query(
        queryString,
        teamName,
        (err) => {
            callback(err)
        }
    )
}

export const leaveTeam = (teamName: string, username: string, callback: Function) => {
    const queryString = `
DELETE FROM member
WHERE BINARY team.name = ? AND BINARY username = ?
    `

    db.query(
        queryString,
        [teamName, username],
        (err) => {
            callback(err)
        }
    )
}

export const joinTeam = (teamName: string, username: string, callback: Function) => {
    const queryString = `
INSERT INTO member VALUES
(?, ?)
    `

    db.query(
        queryString,
        [teamName, username],
        (err) => {
            callback(err)
        }
    )
}

export const removeInviteOrRequest = (table: string, teamName: string, username: string, callback: Function) => {
    const queryString = `
DELETE FROM ${table}
WHERE teamName = ? AND username = ?
    `

    db.query(
        queryString,
        [teamName, username],
        (err) => {
            callback(err)
        }
    )
}