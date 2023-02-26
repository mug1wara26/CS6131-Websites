"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = exports.create = void 0;
const db_1 = require("../db");
const create = (user, callback) => {
    const queryString = "INSERT INTO user VALUES (?,?,?,?,?,?,?)";
    db_1.db.query(queryString, [user.username, user.displayName, user.email, user.pfp, user.bio, user.hash], (err, result) => {
        if (err) {
            callback(err);
        }
        callback(null, user.username);
    });
};
exports.create = create;
const findOne = (username, callback) => {
    const queryString = `
    SELECT username, displayName, email, pfp, bio
    from user
    where username=?
    `;
    db_1.db.query(queryString, username, (err, result) => {
        if (err)
            callback(err);
        const row = result[0];
        if (typeof row === "undefined") {
            callback(new Error("No user found"));
            return;
        }
        const user = {
            username: row.username,
            displayName: row.displayName,
            email: row.email,
            pfp: row.pfp,
            bio: row.bio
        };
        callback(null, user);
    });
};
exports.findOne = findOne;
