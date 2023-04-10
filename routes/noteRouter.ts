import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {BasicUser} from "../types/userTypes";
import * as dotenv from "dotenv";
import {validate} from "class-validator";
import * as noteModel from "../model/noteModel"
import {BasicWriteup, Writeup} from "../types/writeupTypes";
import {v4 as uuidv4} from 'uuid'
import {QueryError} from "mysql2";

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

noteRouter.post('/createWriteup', async (req, res) => {
    const basicWriteup = Object.assign(new BasicWriteup(), req.body.writeup)
    const token = req.header('Authorization')

    if (token && basicWriteup) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            } else {
                const user = decoded as BasicUser

                validate(basicWriteup).then(errors => {
                    if (errors.length > 0) return res.status(400).json({errors: errors})
                    else {
                        const writeup = Object.assign(new Writeup(), basicWriteup)
                        writeup.id = uuidv4()
                        writeup.votes = 0

                        noteModel.createWriteup(writeup, user.username, (err: QueryError, committed: boolean) => {
                            if (err || !committed) return res.status(500).end()
                            else return res.status(200).json({writeup: writeup})
                        })
                    }
                })
            }
        })
    }
    else return res.status(400).end()
})

noteRouter.get('/getWriteup/:noteid', async (req, res) => {
    const noteid = req.params.noteid
    const token = req.header('Authorization')

    let writeup: Writeup | undefined = undefined
    let authors: Array<string> | undefined = undefined

    const callback = (writeup: Writeup | undefined, authors: Array<string> | undefined, callback: Function) => {
        if (writeup && authors) {
            if (writeup.public) return callback(200, 'OK', {writeup: writeup, authors: authors, hasAccess: true})
            else {
                if (token) {
                    jwt.verify(token, SECRET_KEY!, (err, decoded) => {
                        if (err) return callback(400, 'Invalid token')
                        else {
                            const user = decoded as BasicUser

                            if (authors.includes(user.username)) return callback(200, 'OK', {writeup: writeup, authors: authors, hasAccess: true})
                            else return callback(200, 'OK', {hasAccess: false})
                        }
                    })
                }
                else return callback(200, 'OK', {hasAccess: false})
            }
        }
        return callback(null)
    }

    const callbackHandler = (status: number, statusMessage: string, returnData: Object) => {
        if (status === 200) return res.status(200).json(returnData)
        else {
            res.statusMessage = statusMessage
            return res.status(status).end()
        }
    }

    noteModel.findOneWriteup(noteid, (err: QueryError, tempWriteup: Writeup) => {
        if (err) return res.status(500).end()
        else {
            writeup = tempWriteup
            if (writeup) {
                callback(writeup, authors, (status: number | null, statusMessage: string, returnData: Object) => {
                    if (status) return callbackHandler(status, statusMessage, returnData)
                })
            }
            else return res.status(404).end()
        }
    })

    noteModel.findAuthors(noteid, (err: QueryError, tempAuthors: Array<string>) => {
        if (err) return res.status(500).end()
        else {
            authors = tempAuthors
            callback(writeup, authors, (status: number | null, statusMessage: string, returnData: Object) => {
                if (status) return callbackHandler(status, statusMessage, returnData)
            })
        }
    })
})

export {noteRouter}