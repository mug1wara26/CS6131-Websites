import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {Writeup} from "../types/writeupTypes";

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

export const createWriteup = (writeup: Writeup, author: string, callback: Function) => {
    db.beginTransaction((err) => {
        if (err) db.rollback((err) => callback(err, false))
        else db.query(
            'INSERT INTO note VALUES (?,?,?,?,?)',
            [writeup.id, writeup.title, writeup.content, writeup.chalName, writeup.ctfid],
            err => {
                if (err) db.rollback((err) => callback(err, false))
                else db.query(
                    'INSERT INTO writeup VALUES (?,?,?)',
                    [writeup.id, writeup.public, writeup.votes],
                    err => {
                        if (err) db.rollback(err => callback(err, false))
                        else db.query(
                            'INSERT INTO author VALUES (?,?)',
                            [writeup.id, author],
                            err => {
                                if (err) db.rollback(err => callback(err, false))
                                else {
                                    db.commit()
                                    callback(null, true)
                                }
                            }
                        )
                    }
                )
            }
        )
    })
}

export const findOneWriteup = (noteid: string, callback: Function) => {
    const queryString = `
SELECT writeup.*, note.title, note.content, note.chalName, note.ctfid
FROM note, writeup
WHERE note.id = writeup.id
AND note.id = ?
    `

    db.query(
        queryString,
        noteid,
        (err, result) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket> result)[0])
        }
    )
}

export const findAuthors = (noteid: string, callback: Function) => {
    const queryString = `
SELECT author
FROM author
WHERE noteid = ?
    `

    db.query(
        queryString,
        noteid,
        (err, results) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket[]> results).map(row => row.author))
        }
    )
}

export const updateWriteup = (writeup: Writeup, callback: Function) => {
    const queryString = `
UPDATE note n LEFT JOIN writeup w ON n.id = w.id
SET n.title = ?, n.content = ?, n.chalName = ?, n.ctfid = ?, w.public = ?
WHERE n.id = ?
    `

    db.query(
        queryString,
        [writeup.title, writeup.content, writeup.chalName, writeup.ctfid, writeup.public, writeup.id],
        (err) => {
            callback(err)
        }
    )
}