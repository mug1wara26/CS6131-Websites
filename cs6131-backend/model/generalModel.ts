import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const searchByPage = (table: string, search: string, page_num: number, callback: Function) => {
    let queryString = ''
    let appendString = ''
    let numRowsQuery = 'SELECT COUNT(*)'
    if (table === 'user') queryString = 'SELECT username, displayName, email, pfp, bio'
    else queryString = 'SELECT *'

    if (table === 'writeup') {
        appendString += '\nFROM note'
        appendString += '\nWHERE id in (SELECT id FROM writeup) and title like ?'
    }
    else appendString += `\nFROM ${table}`
    if (['ctf', 'team'].includes(table)) appendString += '\nWHERE public and name like ?'
    else appendString += '\nWHERE username like ?'

    queryString += appendString
    numRowsQuery += appendString

    const limit = (page_num - 1) * 20
    queryString += `\nLIMIT ${limit}, 21`

    db.query(
        queryString,
        search,
        (err, result) => {
            if (err) callback(err)
            else {
                const rows = <RowDataPacket[]> result
                db.query(numRowsQuery, search, (err, result) => {
                    if (err) callback(err)
                    else {
                        const numRows = (<RowDataPacket> result)[0]['COUNT(*)'] as number
                        callback(null, rows.slice(0, 20), rows.length === 21, Math.ceil(numRows / 20))
                    }
                })
            }
        })
}
