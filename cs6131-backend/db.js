"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv = __importStar(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
dotenv.config();
let config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
};
// Later on when running from Google Cloud, env variables will be passed in container cloud connection config
if (process.env.NODE_ENV === 'production') {
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
exports.db = mysql2_1.default.createConnection(config);
