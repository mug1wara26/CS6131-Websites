import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {BasicUser} from "../types/userTypes";
import * as dotenv from "dotenv";
import {validate} from "class-validator";
import * as noteModel from "../model/noteModel"
import {Writeup} from "../types/writeupTypes";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const noteRouter = express.Router();

noteRouter.get('/getWriteups/:username', async (req, res) => {
    const username = req.params.username
    const token = req.header('Authorization')

    noteModel.findUserWriteups(username, (err: Error, writeups: Array<Writeup>) => {
        if (token) {
            jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                if (err) {
                    res.statusMessage = 'Invalid token'
                    return res.status(400).end()
                }
                else {
                    const user = decoded as BasicUser

                    if (user.username === username) return res.status(200).json({writeups: writeups})
                    else return res.status(200).json({writeups: writeups.filter(writeup => writeup.public)})
                }
            })
        }
        else return res.status(200).json({writeups: writeups.filter(writeup => writeup.public)})
    })
})

export {noteRouter}