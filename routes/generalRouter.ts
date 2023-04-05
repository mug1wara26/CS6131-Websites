import express from "express"
import * as generalModel from "../model/generalModel"
import {BasicUser} from "../types/userTypes";

const generalRouter = express.Router()

generalRouter.get('/search/:table', async (req, res) => {
    const table = req.params.table
    if (req.query.p && req.query.search && ['user', 'team', 'ctf', 'writeup'].includes(table)) {
        const search = req.query.search.toString()
        const pageNum = req.query.p.toString()
        if (!isNaN(Number(pageNum))) {
            generalModel.searchByPage(table, `%${search}%`, Number(pageNum), (err: Error, results: Array<BasicUser >, cutoff: boolean, numPages: number) => {
                if (err) return res.status(500).end()
                else return res.status(200).json({results: results, cutoff: cutoff, numPages: numPages})
            })
        }
        else return res.status(400).end()
    }
    else return res.status(400).end()
})

export {generalRouter}