import {db} from "../db";
import {RowDataPacket} from "mysql2";

export const searchByPage = (table: string, search: string, page_num: number, callback: Function) => {
    let queryString = ''
    if (table === 'user') queryString = 'SELECT username, displayName, email, pfp, bio'
    else queryString = 'SELECT *'

    if (table === 'writeup') {
        queryString += '\nFROM note'
        queryString += '\nWHERE id in (SELECT id FROM writeup) and title like ?'
    }
    else queryString += `\nFROM ${table}`
    if (['ctf', 'team'].includes(table)) queryString += '\nWHERE public and name like ?'
    else queryString += '\nWHERE username like ?'

    const limit = (page_num - 1) * 20
    queryString += `\nLIMIT ${limit}, 21`

    console.log(queryString)
    db.query(
        queryString,
        search,
        (err, result) => {
            if (err) callback(err)
            else {
                const rows = <RowDataPacket[]> result
                callback(null, rows.slice(0, 20), rows.length === 21)
            }
        })
}
