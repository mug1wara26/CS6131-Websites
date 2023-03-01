import {BasicUser, User} from "../types/user";
import {db} from "../db";
import {OkPacket, RowDataPacket} from "mysql2";

export const create = (user: User, callback: Function) => {
    const queryString = "INSERT INTO user VALUES (?,?,?,?,?,?)"

    db.query(
        queryString,
        [user.username, user.displayName, user.email, user.pfp, user.bio, user.hash],
        (err, result) => {
            if (err) callback(err)
            else callback(null, user.username);
        }
    )
}


export const findOne = (username: String, callback: Function) => {
    const queryString = `
    SELECT username, displayName, email, pfp, bio
    from user
    where username=?
    `

    db.query(
        queryString,
        username,
        (err, result) => {
            if (err) callback(err);

            const row = (<RowDataPacket>result)[0];
            if (typeof row === "undefined") {
                callback(new Error("No user found"));
                return;
            }
            const user: User = {
                username: row.username,
                displayName: row.displayName,
                email: row.email,
                pfp: row.pfp,
                bio: row.bio,
                hash: row.hash
            }

            console.log(user)

            callback(null, user);
        }
    )
};

export const loginWithUsername = (username: string, password: string) => {
}