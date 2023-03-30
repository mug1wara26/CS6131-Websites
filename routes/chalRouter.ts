import * as chalModel from '../model/chalModel'
import * as ctfModel from '../model/ctfModel'
import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {BasicUser} from "../types/userTypes";
import {IsOptional, validate} from "class-validator";
import {Challenge} from "../types/chalTypes";
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const chalRouter = express.Router();


chalRouter.post('/create', async (req, res) => {
    if (!req.body.challenge) return  res.status(400).end();
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err, decoded) => {
            if (err) {
                res.statusMessage = 'Invalid token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser
                const chal = new Challenge()
                Object.assign(chal, req.body.challenge)
                console.log(chal)

                validate(chal).then(errors => {
                    if (errors.length > 0) return res.status(400).json(errors)
                    else {
                        validateChalCreation(chal, user.username, (status: number, statusMessage: string) => {
                            if (status === 200) {
                                chalModel.create(chal, (err: Error) => {
                                    if (err) return res.status(400).end()
                                    else {
                                        const {flag, ...basicChal} = chal
                                        return res.status(200).json(basicChal)
                                    }
                                })
                            }
                            else {
                                res.statusMessage = statusMessage
                                res.status(status).end()
                            }
                        })
                    }
                })

            }
        })
    }
    else return res.status(400).end()
})

const validateChalCreation = (chal: Challenge, username: string, callback: Function) => {
    ctfModel.memberOfTeamCreator(username, chal.ctfid, (err: Error, isMember: boolean) => {
        if (err) return callback(500, 'Internal server error')
        if (isMember) return callback(200)
        else return callback(400, 'Bad request')
    })
}

export {chalRouter}