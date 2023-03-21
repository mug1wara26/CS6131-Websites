import {db} from "../db";
import {RowDataPacket} from "mysql2";
import * as userModel from "./userModel";
import {User} from "../types/userTypes";
import {Team} from "../types/teamTypes";

export const findUserTeams = (username: string, callback: Function) => {
    const queryString = `
SELECT *
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
