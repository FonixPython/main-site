import { prisma } from "../db.js";
import { Request, Response } from "express";


export async function getProjects(req: Request, res: Response) {
    try {
        const result = await prisma.projects.findMany();
        if (result) {
            return res.json(result).status(200)
        } else {
            return res.sendStatus(200)
        }
    } catch {
        return res.sendStatus(500)
    }
}

export async function getPublicProjects(req: Request, res: Response) {
    try {
        const result = await prisma.projects.findMany({ where: { public: true } });
        if (result) {
            return res.json(result).status(200)
        } else {
            return res.sendStatus(500)
        }
    } catch {
        return res.sendStatus(500)
    }
}

export async function getProject(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const result = await prisma.projects.findFirstOrThrow({ where: { id: req.body.id } })
            return res.json(result).status(200)
        } else {
            return res.sendStatus(400)
        }
    } catch {
        return res.sendStatus(500)
    }
}

export async function createProject(req: Request, res: Response) {
    try {
        if (req.body.title && req.body.imageUrl && req.body.shortDescription && req.body.github && req.body.public !== undefined) {
            const result = await prisma.projects.create({
                data: {
                    title: String(req.body.title),
                    imageUrl: String(req.body.imageUrl),
                    shortDescription: String(req.body.shortDescription),
                    github: String(req.body.github),
                    public: req.body.public || false
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
    } catch {
        return res.sendStatus(500)
    }
}

export async function deleteProject(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const result = await prisma.projects.delete({ where: { id: Number(req.body.id) } })
            if (result) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(500)
            }
        } else {
            return res.sendStatus(400)
        }
    } catch {
        return res.sendStatus(500)
    }
}

export async function editProject(req: Request, res: Response) {
    try {
        if (req.body.id && (req.body.title || req.body.imageUrl || req.body.shortDescription || req.body.github || (req.body.public !== undefined))) {
            const defaultValues = await prisma.projects.findFirstOrThrow({ where: { id: req.body.id } })
            const changedData = {
                title: req.body.title || defaultValues.title,
                imageUrl: req.body.imageUrl || defaultValues.imageUrl,
                shortDescription: req.body.shortDescription || defaultValues.shortDescription,
                github: req.body.github || defaultValues.github,
                public: req.body.public
            }
            const result = await prisma.projects.update({ where: { id: req.body.id }, data: changedData })
            if (result) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(500)
            }
        } else {
            return res.sendStatus(400)
        }
    } catch {
        return res.sendStatus(500)
    }
}