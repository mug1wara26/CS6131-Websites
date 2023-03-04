import {BasicUser, User} from "../types/user";
import {db} from "../db";
import {OkPacket, RowDataPacket} from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

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
    SELECT *
    from user
    where username=?
    `

    db.query(
        queryString,
        username,
        (err, result) => {
            if (err) callback(err);

            else {
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

                callback(null, user);
            }
        }
    )
};

export const loginWithUsername = (username: string, password: string, callback: Function) => {
    findOne(username, (err: Error, user: User) => {
        if (err) callback(new Error("Username does not exist"));
        else {
            bcrypt.compare(password, user.hash, (err, res) => {
                if (err) callback(err);
                if (res) {
                    const {hash, ...basicUser} = user;
                    const token = jwt.sign(basicUser, SECRET_KEY!, {
                        expiresIn: '31d'
                    });

                    callback(null, token)
                }
                else callback(new Error("Password does not match"))
            })
        }
    })
}