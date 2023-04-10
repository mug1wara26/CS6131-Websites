import {db} from "../db";
import {RowDataPacket} from "mysql2";
import {CTF, TeamLeaderboard, TeamUserLeaderboard, UserLeaderboard} from "../types/ctfTypes";
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
            else callback(null)
        }
    )
}

export const isCompeting = (username: string, ctfid: string, callback: Function) => {
    const queryString = `
SELECT *
FROM competitor
WHERE BINARY ctfid = ? and BINARY competitorName = ?
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

export const findCompetingCTFs = (username: string, teamName: string, callback: Function) => {
    const queryString = `
SELECT ctf.*
FROM competitor c, ctf
WHERE c.ctfid = ctf.id AND BINARY c.teamName = ? AND BINARY c.competitorName = ?
    `

    db.query(
        queryString,
        [teamName, username],
        (err, result) => {
            if (err) callback(err)
            else callback(null, <RowDataPacket> result)
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

export const findTeamLeaderboard = (ctfid: string, callback: Function) => {
    const queryString = `
SELECT teamName, IFNULL(SUM(points), 0) total
FROM competitor c
LEFT JOIN solve s ON s.username = competitorName AND s.ctfid = c.ctfid
LEFT JOIN challenge chal ON chal.name = s.chalName AND chal.ctfid = c.ctfid
WHERE c.ctfid = ?
GROUP BY teamName
ORDER BY total DESC
    `

    db.query(
        queryString,
        ctfid,
        (err, results) => {
            if (err) callback(err)
            else {
                const returnData = results as Array<TeamLeaderboard>
                let index = 1;
                for (const key in returnData) {
                    returnData[key].index = index
                    index++
                }
                callback(null, returnData)
            }
        }
    )
}

export const findUserLeaderboard = (ctfid: string, callback: Function) => {
    const queryString = `
SELECT competitorName username, teamName, IFNULL(SUM(points), 0) total
FROM competitor c
LEFT JOIN solve s ON s.username = competitorName AND s.ctfid = c.ctfid
LEFT JOIN challenge chal ON chal.name = s.chalName AND chal.ctfid = c.ctfid
WHERE c.ctfid = ?
GROUP BY competitorName
ORDER BY total DESC
    `

    db.query(
        queryString,
        ctfid,
        (err, results) => {
            if (err) callback(err)
            else {
                const returnData = results as Array<UserLeaderboard>
                let index = 1;
                for (const key in returnData) {
                    returnData[key].index = index
                    index++
                }
                callback(null, returnData)
            }
        }
    )
}

export const findTeamUserLeaderboard = (ctfid: string, teamName: string, callback: Function) => {
    const queryString = `
SELECT competitorName username, count(s.chalName) num_solves, IFNULL(sum(points),0) total
FROM competitor c
LEFT JOIN solve s ON c.ctfid = s.ctfid AND s.username = c.competitorName
LEFT JOIN challenge chal ON chal.ctfid = c.ctfid AND chal.name = s.chalName
WHERE c.ctfid = ?
AND BINARY teamName = ?
GROUP BY competitorName
ORDER BY total DESC
    `

    db.query(
        queryString,
        [ctfid, teamName],
        (err, results) => {
            if (err) callback(err)
            else {
                const returnData = results as Array<TeamUserLeaderboard>
                let index = 1;
                for (const key in returnData) {
                    returnData[key].index = index
                    index++
                }
                callback(null, returnData)
            }
        }
    )
}