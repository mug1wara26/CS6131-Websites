import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {Challenge} from "../types/chalTypes";

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

export const create = (chal: Challenge, callback: Function) => {
    const queryString = `
INSERT INTO challenge VALUES
(?, ?, ?, ?, ?, ?)
    `
    db.query(
        queryString,
        [chal.name, chal.ctfid, chal.difficulty, chal.category, chal.points, chal.flag],
        (err, result) => {
            if (err) callback(err)
            else callback(null)
        }
    )
}
