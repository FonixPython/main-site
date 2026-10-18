import { prisma } from "../db.js";
import { Request, Response } from "express";

export async function getPublicNotes(req: Request, res: Response) {
    try {
        const result = await prisma.schoolNotes.findMany({ where: { public: true } })
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}

export async function getAllNotes(req: Request, res: Response) {
    try {
        const result = await prisma.schoolNotes.findMany()
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}

export async function createNote(req: Request, res: Response) {
    try {
        if (req.body.fileOnly == undefined || req.body.title || !req.body.year || !req.body.class || (!req.body.fileOnly && req.body.markdown == undefined || req.body.public == undefined)) {
            return res.status(400)
        }
        const result = await prisma.schoolNotes.create({
            data: {
                markdown: req.body.markdown,

                attachedFiles: JSON.stringify(req.body.attachedFiles),
                year: Number(req.body.year),
                class: String(req.body.class),
                fileOnly: req.body.fileOnly,
                public: req.body.public
            }
        })
        if (result) {
            return res.status(200)
        } else {
            return res.status(500)
        }
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}

export async function editNote(req: Request, res: Response) {
    try {
        if (!req.body.id || (!req.body.public)) { }
    } catch (e) {
        console.log(e)
        return res.status(500)
    }
}