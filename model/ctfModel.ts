import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {BasicCTF, CTF} from "../types/ctfTypes";

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