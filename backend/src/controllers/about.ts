import { Request, Response } from "express";
import { prisma } from "../db.js";


export async function getAboutInfo(req: Request, res: Response) {
    try {
        const titleResult = await prisma.about.findFirstOrThrow({ where: { id: "title" } })
        const aboutResult = await prisma.about.findFirstOrThrow({ where: { id: "about" } })
        const emailResult = await prisma.about.findFirstOrThrow({ where: { id: "email" } })
        const pfpUrlResult = await prisma.about.findFirstOrThrow({ where: { id: "pfpUrl" } })
        const result = {
            "title": titleResult["data"],
            "about": aboutResult["data"],
            "email": emailResult["data"],
            "pfpUrl": pfpUrlResult["data"]
        }

        return res.json(result).status(200)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function setAboutInfo(req: Request, res: Response) {
    try {
        if (req.body.title && req.body.about && req.body.email && req.body.pfpUrl) {
            const aboutResult = await prisma.about.update({ where: { id: "about" }, data: { data: req.body.about } })
            const emailResult = await prisma.about.update({ where: { id: "email" }, data: { data: req.body.email } })
            const pfpUrlResult = await prisma.about.update({ where: { id: "pfpUrl" }, data: { data: req.body.pfpUrl } })
            const titleResult = await prisma.about.update({ where: { id: "title" }, data: { data: req.body.title } })
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function getSocials(req: Request, res: Response) {
    try {
        const result = await prisma.socials.findMany()
        res.json(result).status(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function createSocial(req: Request, res: Response) {
    try {
        if (req.body.name && req.body.url && req.body.iconUrl) {
            const result = await prisma.socials.create({
                data: {
                    name: req.body.name || "New social",
                    url: req.body.url || "/",
                    iconUrl: req.body.iconUrl || "/placeholder.webp"
                }
            })
            if (result) {
                res.sendStatus(200)
            }
        } else {
            res.sendStatus(400)
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

export async function editSocial(req: Request, res: Response) {
    try {
        if (req.body.id && (req.body.name || req.body.url || req.body.iconUrl)) {
            const defaultValues = await prisma.socials.findFirstOrThrow({ where: { id: req.body.id } })
            const changedData = {
                name: req.body.name || defaultValues.name,
                url: req.body.url || defaultValues.url,
                iconUrl: req.body.iconUrl || defaultValues.iconUrl
            }
            const result = await prisma.socials.update({ where: { id: req.body.id }, data: changedData })
            if (result) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(500)
            }
        } else {
            res.sendStatus(400)
        }
    } catch {
        res.sendStatus(500)
    }
}

export async function deleteSocial(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const result = await prisma.socials.delete({ where: { id: req.body.id } })
            if (result) {
                res.sendStatus(200)
            } else { res.sendStatus(500) }
        }
    } catch (e) {
        res.sendStatus(500)
    }
}