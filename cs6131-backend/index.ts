import express from "express";
import * as bodyParser from "body-parser";
import {userRouter} from "./routes/userRouter";
// @ts-ignore
import cors from "cors";


const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use("/users",userRouter);
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});