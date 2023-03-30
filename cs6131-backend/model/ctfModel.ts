import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {CTF} from "../types/ctfTypes";
import {Challenge} from "../types/chalTypes";

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

export const findOne = (id: string, callback: Function) => {
    const queryString = `
SELECT *
FROM ctf
WHERE BINARY id=?
    `

    db.query(
        queryString,
        id,
        (err, result) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket> result)[0])
        }
    )
}

export const publicExists = (name: string, callback: Function) => {
    const queryString = `
SELECT name
FROM ctf
WHERE BINARY name = ? and public
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

export const teamCTFExists = (ctfName: string, teamName: string, callback: Function) => {
    const queryString = `
SELECT name
FROM ctf
WHERE BINARY teamCreator = ? and BINARY name = ?
    `
    db.query(
        queryString,
        [teamName, ctfName],
        (err, result) => {
            const name = (<RowDataPacket> result)[0];
            if (name) callback(name)
            else callback("")
        }
    )
}

export const createCTF = (ctf: CTF, callback: Function) => {
    const queryString = `
INSERT INTO ctf VALUES
(?,?,?,?,?,?,?,?,?)
`
    db.query(
        queryString,
        [ctf.id, ctf.name, ctf.teamCreator, ctf.date, ctf.format, ctf.url, ctf.description, ctf.location, ctf.public],
        (err, result) => {
            if (err) callback(err)
            else callback(null)
        }
    )
}

export const createCompetitor = (username: string, teamName: string, ctfid: string, callback: Function) => {
    const queryString = `
INSERT INTO competitor VALUES
(?,?,?)
    `

    db.query(
        queryString,
        [ctfid,teamName,username],
        (err, result) => {
            if (err) callback(err)
            else callback(null, result)
        }
    )
}

export const isCompeting = (username: string, ctfid: string, callback: Function) => {
    const queryString = `
SELECT *
FROM competitor
WHERE BINARY ctfid = ? and BINARY username = ?
    `

    db.query(
        queryString,
        [ctfid, username],
        (err, result) => {
            if (err) callback(err)
            else {
                callback(null, Boolean((<RowDataPacket> result)[0]))
            }
        }
    )
}

export const memberOfTeamCreator = (username: string, ctfid: string, callback: Function) => {
    const queryString = `
SELECT *
FROM ctf, member
WHERE id = ? AND teamCreator = teamName AND username = ?
    `

    db.query(
        queryString,
        [ctfid, username],
        (err, result) => {
            if (err) callback(err)
            else callback(null, Boolean((<RowDataPacket> result)[0]))
        }
    )
}