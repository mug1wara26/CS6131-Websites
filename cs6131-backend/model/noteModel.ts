import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const findUserWriteups = (username: string, callback: Function) => {
    const queryString = `
SELECT writeup.*, note.title, note.content, note.chalName, note.ctfid
FROM note, writeup, author
WHERE note.id = writeup.id
AND note.id = author.noteid
AND BINARY author.author = ?
    `

    db.query(
        queryString,
        username,
        (err, results) => {
            callback(err, results)
        }
    )
}