import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path"
import { prisma } from "../db.js";
import { resume } from "react-dom/server";
import fs from "fs/promises";

const storage = multer.diskStorage({
    destination: process.env.UPLOAD_PATH || "./uploads",
    filename: function (req: Request & Record<string, any>, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const ext = path.extname(file.originalname);
        const filename = `${Math.random().toString(36).substring(2, 15)}${ext}`;
        cb(null, filename);
    },
});

export function uploadMiddleware(req: Request & Record<string, any>, res: Response, next: NextFunction) {
    const upload = multer({
        storage: storage,
    }).single("file");
    upload(req, res, (err: any) => {
        if (err) return next(err);
        next();
    });
};

async function registerUploadInIndex(req: Request) {
    try {
        if (!req.file) throw new Error("No file uploaded");
        const filenameOnDisk = req.file.filename
        const result = await prisma.uploads.create({ data: { filename: filenameOnDisk, mimeType: req.file.mimetype } })
        if (result) {
            return result
        } else {
            return false
        }
    } catch {
        return false
    }
}

export async function uploadFile(req: Request, res: Response) {
    if (!req.file) { return res.status(400).json({ error: "No file provided" }) }
    let result = await registerUploadInIndex(req);
    if (result) {
        res.status(200).json({
            id: result.id
        });
    } else { res.status(500).json({ error: "Database registration failed" }); }
}

export async function getFile(req: Request, res: Response) {
    try {
        if (req.params.fileId) {
            let fileId: string = Array.isArray(req.params.fileId) ? req.params.fileId[0] : req.params.fileId;
            const result = await prisma.uploads.findFirstOrThrow({ where: { id: fileId } })
            const filePath = path.join(process.env.UPLOAD_PATH || './uploads/', result.filename)
            res.setHeader("Content-Type", result.mimeType)
            return res.download(filePath, result.filename)
        } else {
            res.sendStatus(400)
        }
    } catch {
        res.sendStatus(500)
    }
}

export async function deleteFile(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const fileResult = await prisma.uploads.findFirstOrThrow({ where: { id: req.body.id } })
            try {
                await fs.unlink(path.join(process.env.UPLOAD_PATH ?? './uploads/', fileResult.filename));
            } catch {
                return res.sendStatus(500)
            }
            const deletionResult = await prisma.uploads.delete({ where: { id: req.body.id } })
            if (deletionResult) {
                return res.sendStatus(200)
            } else {
                return res.sendStatus(500)
            }
        }
    } catch {
        return res.sendStatus(500)
    }
}

export async function getUploads(req: Request, res: Response) {
    try {
        const result = await prisma.uploads.findMany({ orderBy: { dateOfUpload: "desc" } })
        if (result) {
            return res.json(result).status(200)
        } else {
            return res.sendStatus(500)
        }
    } catch {
        res.sendStatus(500)
    }
}