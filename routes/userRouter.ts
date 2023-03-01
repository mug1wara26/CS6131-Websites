import express, {Request, Response} from "express";
import * as userModel from "../model/user"
import {BasicUser, RegisteringUser, User} from "../types/user";
import {validate} from "class-validator";
import bcrypt from "bcrypt"

const userRouter = express.Router();

userRouter.get("/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    userModel.findOne(username, (err: Error, user: User) => {
        if (err) {
            res.statusMessage = 'User does not exist'
            return res.status(400).end();
        }
        else {
            const {hash, ...basicUser} = user;
            console.log(basicUser)
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
            const responseMessage = {"message" : ''}
            if (errors.filter(e => e.property === 'email').length > 0) responseMessage.message = "Email not valid"
            else responseMessage.message = "Check the information provided"
            res.statusMessage = responseMessage.message
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

export {userRouter};