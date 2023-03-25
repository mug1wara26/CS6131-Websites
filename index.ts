import express from "express";
import * as bodyParser from "body-parser";
import {userRouter} from "./routes/userRouter";
import cors from "cors";
import {teamRouter} from "./routes/teamRouter";
import {ctfRouter} from "./routes/ctfRouter";
import {BasicCTF} from "./types/ctfTypes";
import {validate} from "class-validator";


const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use("/users", userRouter);
app.use("/teams", teamRouter);
app.use("/ctfs", ctfRouter)

const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});