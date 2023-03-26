import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findCTFChals = (ctfid: string, callback: Function) => {
    const queryString = `
SELECT *
FROM challenge
WHERE BINARY ctfid = ?
    `

    db.query(
        queryString,
        ctfid,
        (err, result) => {
            if (err) callback(err)
            else callback(null, <RowDataPacket> result)
        }
    )
}