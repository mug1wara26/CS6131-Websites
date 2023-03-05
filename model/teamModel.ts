import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findUserTeams = (username: string, callback: Function) => {
    const queryString = `
SELECT name, description, pfp, owner
FROM team left join member on team.name = member.teamName
WHERE username = ?
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