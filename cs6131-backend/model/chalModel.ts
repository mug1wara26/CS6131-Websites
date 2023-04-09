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

export const findOneByUser = (ctfid: string, name: string, username: string, callback: Function) => {
    const queryString = `
SELECT chal.name, chal.ctfid, chal.difficulty, chal.category, chal.points
FROM challenge chal, ctf, team t, member m
WHERE chal.ctfid = ?
and binary chal.name = ?
and binary m.username = ?
and ctf.id = chal.ctfid
and ctf.teamCreator = t.name 
and m.teamName = t.name
UNION
SELECT chal.name, chal.ctfid, chal.difficulty, chal.category, chal.points
FROM challenge chal, competitor comp
WHERE chal.ctfid = comp.ctfid
and binary chal.ctfid = ?
and binary chal.name = ?
and BINARY comp.competitorName = ?
    `

    db.query(
        queryString,
        [ctfid, name, username, ctfid, name, username],
        (err, result) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket> result)[0])
        }
    )
}

export const getFlag = (ctfid: string, chalName: string, username: string, callback: Function) => {
    const queryString = `
SELECT flag
FROM challenge chal, competitor comp
WHERE chal.ctfid = comp.ctfid
and binary chal.ctfid = ?
and binary chal.name = ?
and BINARY comp.competitorName = ?
    `

    db.query(
        queryString,
        [ctfid, chalName, username],
        (err, result) => {
            if (err) callback(err)
            else callback(null, (<RowDataPacket> result)[0].flag)
        }
    )
}

export const solve = (ctfid: string, chalName: string, username: string, callback: Function) => {
    const queryString = `
INSERT INTO solve VALUES
(?, ?, ?)
    `

    db.query(
        queryString,
        [chalName, ctfid, username],
        (err, result) => {
            if (err) callback(err)
            else callback(null)
        }
    )
}

export const isSolved = (ctfid: string, chalName: string, username: string, callback: Function) => {
    const queryString = `
SELECT *
FROM solve
WHERE binary ctfid = ?
and binary chalName = ?
and binary username = ?
    `

    db.query(
        queryString,
        [ctfid, chalName, username],
        (err, result) => {
            callback(err, Boolean((<RowDataPacket> result)[0]))
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
