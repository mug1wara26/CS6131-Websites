import * as dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

let config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
};

// Later on when running from Google Cloud, env variables will be passed in container cloud connection config
if(process.env.NODE_ENV === 'production') {
    console.log('Running from cloud. Connecting to DB through GCP socket.');
    // @ts-ignore
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

// When running from localhost, get the config from .env
else {
    console.log('Running from localhost. Connecting to DB directly.');
    // @ts-ignore
    config.host = process.env.DB_HOST;
}
export const db = mysql.createConnection(config);