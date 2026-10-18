import { prisma } from "../db.js";
import { Request, Response } from "express";

export async function getPublicNotes(req: Request, res: Response) {
    try {
        const result = await prisma.schoolNotes.findMany({ where: { public: true } })
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function getAllNotes(req: Request, res: Response) {
    try {
        const result = await prisma.schoolNotes.findMany()
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function getNote(req: Request, res: Response) {
    try {
        if (!req.params.id) {
            return res.sendStatus(400)
        }
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        const result = await prisma.schoolNotes.findFirstOrThrow({ where: { id: id } })
        return res.json(result)
    } catch (e) {
        console.log(e)
        return res.sendStatus(404)
    }
}

export async function createNote(req: Request, res: Response) {
    try {
        if (req.body.fileOnly == undefined || req.body.title || !req.body.year || !req.body.class || (!req.body.fileOnly && req.body.markdown == undefined || req.body.public == undefined)) {
            return res.sendStatus(400)
        }
        const result = await prisma.schoolNotes.create({
            data: {
                title: req.body.title,
                markdown: req.body.markdown,
                attachedFiles: JSON.stringify(req.body.attachedFiles),
                year: Number(req.body.year),
                class: String(req.body.class),
                fileOnly: req.body.fileOnly,
                public: req.body.public
            }
        })
        if (result) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(500)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function editNote(req: Request, res: Response) {
    try {
        if (req.body.id && (req.body.title || req.body.markdown || req.body.attachedFiles || req.body.year || req.body.class || req.body.fileOnly != undefined || req.body.public != undefined)) {
            const result = await prisma.schoolNotes.update({
                where: {
                    id: req.body.id
                },
                data: {
                    title: req.body.title,
                    markdown: req.body.markdown,
                    attachedFiles: JSON.stringify(req.body.attachedFiles),
                    year: Number(req.body.year),
                    class: req.body.class,
                    public: req.body.public,
                    fileOnly: req.body.fileOnly,
                    dateOfUpdate: new Date()
                }
            })
            if (result) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(500)
            }
        } else {
            return res.sendStatus(400)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function deleteNote(req: Request, res: Response) {
    try {
        if (!req.body.id) {
            return res.sendStatus(400)
        }
        const result = await prisma.schoolNotes.delete({ where: { id: req.body.id } })
        if (result) {
            return res.sendStatus(200)
        }
        return res.sendStatus(500)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}