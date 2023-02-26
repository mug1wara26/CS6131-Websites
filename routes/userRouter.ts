import express, {Request, Response} from "express";
import * as userModel from "../model/user"
import {BasicUser, RegisteringUser, User} from "../types/user";
import {validate} from "class-validator";
import bcrypt from "bcrypt"

const userRouter = express.Router();


userRouter.get("/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    userModel.findOne(username, (err: Error, user: BasicUser) => {
        if (err) return res.status(500).json({"message": err.message});

        res.status(200).json({"data": user})
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
        if (errors.length > 0) return res.status(400).json({"errors": errors})

        bcrypt.hash(registerUser.password, 10, function (err, hash) {
            if (typeof err !== 'undefined') return res.status(500).json({"errors": err?.message});

            const user = new User();
            user.username = registerUser.username;
            user.displayName = registerUser.displayName;
            user.email = registerUser.email;
            user.hash = hash;


            userModel.create(user, (err: Error, username: string) => {
                console.log(err)
                console.log(username)
                if (err) return res.status(500).json({"message": err.message});

                return res.status(200).json({"message": username + " created successfully"})
            })
        });
    })
})

export {userRouter};