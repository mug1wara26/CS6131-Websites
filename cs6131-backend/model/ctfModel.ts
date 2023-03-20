import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {ctf} from "../types/ctfTypes";

export const findTeamCTFs = (teamName: string, callback: Function) => {
    const queryString = `
    SELECT *
    FROM ctf
    WHERE BINARY teamCreator = ?
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