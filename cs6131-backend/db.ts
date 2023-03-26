import * as dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

let config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST
};

export const db = mysql.createConnection(config);