import express from "express";
import * as bodyParser from "body-parser";
import {userRouter} from "./routes/userRouter";
import {teamRouter} from "./routes/teamRouter";
import {ctfRouter} from "./routes/ctfRouter";
import {chalRouter} from "./routes/chalRouter"
import cors from "cors";
import {generalRouter} from "./routes/generalRouter";
import {noteRouter} from "./routes/noteRouter";

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use("/users", userRouter);
app.use("/teams", teamRouter);
app.use("/ctfs", ctfRouter);
app.use("/chals", chalRouter);
app.use("/notes", noteRouter);
app.use("", generalRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});