import express, {Request, Response} from "express";
import * as userModel from "../model/userModel"
import {BasicUser, RegisteringUser, User} from "../types/userTypes";
import {validate} from "class-validator";
import bcrypt from "bcrypt"
import jwt, {JwtPayload} from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userRouter = express.Router();

userRouter.get("/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    userModel.findOne(username, (err: Error, user: User) => {
        if (err) {
            return res.status(200).json({'data': {}});
        }
        else {
            const {hash, ...basicUser} = user;
            res.status(200).json({"data": basicUser})
        }
    })
})

userRouter.post("/register", async (req: Request, res: Response) => {
    const registerUser = Object.assign(new RegisteringUser(), {
        username: req.body.username,
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password
    })


    validate(registerUser).then(errors => {
        if (errors.length > 0) {
            let responseMessage = ''
            if (errors.filter(e => e.property === 'email').length > 0) responseMessage = "Email not valid"
            else responseMessage = "Check the information provided"
            console.log(errors);

            res.statusMessage = responseMessage
            return res.status(400).end()
        }

        bcrypt.hash(registerUser.password, 10, function (err, hash) {
            if (typeof err !== 'undefined') return res.status(500).json({"message": err?.name});

            const user = new User();
            user.username = registerUser.username;
            user.displayName = registerUser.displayName;
            user.email = registerUser.email;
            user.hash = hash;


            userModel.create(user, (err: Error, username: string) => {
                if (err) {
                    console.log({"error info": "Database Create User Error", "error": err})
                    return res.status(500).json({"message": "Database Error"});
                }

                return res.status(200).json({"message": username})
            })
        });
    })
});

userRouter.post('/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        userModel.loginWithUsername(username, password, (err: Error, token: String) => {
            if (err) {
                console.log(err);
                res.statusMessage = err.message;
                return res.status(400).end()
            }
            else {
                return res.status(200).json({"token": token})
            }
        })
    }
})

userRouter.post('/edit', async (req, res) => {
    if (!req.body.user) return res.status(400).end();
    const token = req.header('Authorization')
    if (token) {
        jwt.verify(token, SECRET_KEY!, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err) {
                res.statusMessage = 'Invalid Token'
                return res.status(400).end()
            }
            else {
                const user = decoded as BasicUser
                const editingUser = Object.assign(new BasicUser(), req.body.user)
                if (user.username === editingUser.username) {
                    validate(editingUser).then(errors => {
                        if (errors.length > 0) return res.status(400).json(errors)
                        else {
                            userModel.editUser(editingUser, (err: Error) => {
                                if (err) return res.status(500).end()
                                else {
                                    const token = jwt.sign({...editingUser}, SECRET_KEY!, {
                                        expiresIn: '31d'
                                    });
                                    return res.status(200).json({token: token})
                                }
                            })
                        }
                    })
                }
                else return res.status(400).end()
            }
        })
    }
    else return res.status(400).end()
})

export {userRouter};