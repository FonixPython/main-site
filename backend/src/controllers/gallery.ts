import { prisma } from "../db.js";
import { Request, Response } from "express";
import path from "path";
import ExifReader from 'exifreader';
import sharp from "sharp";
import fs from "fs/promises";

interface imageData {
    imageId: string,
    lowresImageId: string,
    description: string,
    exifData: string,
    tags: string,
    dateOfCreation: Date,
    public: boolean
}

export async function getPublicImages(req: Request, res: Response) {
    try {
        const result = await prisma.gallery.findMany({ where: { public: true }, orderBy: { dateOfCreation: "desc" } })
        if (result) {
            return res.json(result).status(200)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }

}

export async function downloadImage(req: Request, res: Response) {
    try {
        if (req.params.imageId) {
            let imageId: string = Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId;
            const updated = await prisma.gallery.update({ where: { id: imageId }, data: { downloads: { increment: 1 } } })
            const result = await prisma.uploads.findFirstOrThrow({ where: { id: updated.imageId } })
            const filePath = path.join(process.env.UPLOAD_PATH || './uploads/', result.filename)
            res.setHeader("Content-Type", result.mimeType)
            return res.download(filePath, result.filename)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function registerClick(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const result = await prisma.gallery.update({ where: { id: req.body.id }, data: { clicks: { increment: 1 } } })
            if (result) {
                return res.sendStatus(200)
            }
        } else {
            return res.sendStatus(400)
        }
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export async function getAllImages(req: Request, res: Response) {
    try {
        const result = await prisma.gallery.findMany({ orderBy: { dateOfUpload: "desc" } })
        return res.json(result).status(200)
    } catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

function parseExifDate(date: string | undefined) {
    if (!date) return null;
    const match = date.match(
        /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
    );
    if (!match) return null;
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    );
}

export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) { return res.status(400).json({ error: "No file provided" }) }
        if (req.body.description !== undefined && req.body.tags !== undefined && req.body.public !== undefined) {
            const originalFileUpload = await prisma.uploads.create({ data: { filename: req.file.filename, mimeType: req.file.mimetype } })
            const originaImageFilePath = path.join(process.env.UPLOAD_PATH || './uploads/', originalFileUpload.filename)
            const imageObject: imageData = {
                imageId: originalFileUpload.id,
                lowresImageId: "",
                description: req.body.description || "",
                exifData: JSON.stringify({
                    camera: "Generic Camer",
                    lens: "Generic Camera",
                    shutterSpeed: "Unknown",
                    aperture: "Unknown",
                    iso: "Unknown"
                }),
                tags: req.body.tags || "[]",
                dateOfCreation: new Date(),
                public: req.body.public == "true"
            }
            const exifTags = await ExifReader.load(originaImageFilePath)
            if (exifTags !== undefined) {
                imageObject.dateOfCreation = new Date(parseExifDate(exifTags.DateTimeOriginal?.description) || imageObject.dateOfCreation)
                imageObject.exifData = JSON.stringify({
                    camera: `${exifTags.Make?.description || "Generic"} ${exifTags.Model?.description || "Camera"}`,
                    lens: `${exifTags.LensMake?.description || ""} ${exifTags.LensModel?.description || "Lens"}`,
                    shutterSpeed: exifTags.ShutterSpeedValue?.description || "Unknown",
                    aperture: exifTags.ApertureValue?.description || "Unknown",
                    iso: exifTags.ISOSpeedRatings?.description || "Unknown"
                })
            }
            const lowresFileUpload = await prisma.uploads.create({ data: { filename: `${Math.random().toString(36).substring(2, 15)}.webp`, mimeType: "image/webp" } })
            const lowersImagePath = path.join(process.env.UPLOAD_PATH || './uploads/', lowresFileUpload.filename)
            await sharp(originaImageFilePath)
                .resize({ height: 600 })
                .webp({ quality: 60 })
                .toFile(lowersImagePath);
            const registerResult = await prisma.gallery.create({
                data: {
                    imageId: imageObject.imageId,
                    lowresImageId: lowresFileUpload.id,
                    description: imageObject.description,
                    exifData: imageObject.exifData,
                    tags: imageObject.tags,
                    dateOfCreation: imageObject.dateOfCreation,
                    public: imageObject.public
                }
            })
            if (registerResult) {
                return res.json(registerResult).status(200)
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

export async function deleteImage(req: Request, res: Response) {
    try {
        if (req.body.id) {
            const result = await prisma.gallery.delete({ where: { id: req.body.id } })
            const fullResult = await prisma.uploads.delete({ where: { id: result.imageId } })
            await fs.unlink(path.join(process.env.UPLOAD_PATH ?? './uploads/', fullResult.filename));
            const lowResult = await prisma.uploads.delete({ where: { id: result.lowresImageId } })
            await fs.unlink(path.join(process.env.UPLOAD_PATH ?? './uploads/', lowResult.filename));

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

export async function editImage(req: Request, res: Response) {
    try {
        if (req.body.id && (req.body.description || req.body.tags || req.body.public)) {
            const currentResult = await prisma.gallery.findFirstOrThrow({ where: { id: req.body.id } })
            const updatedObject = {
                description: req.body.description || currentResult.description,
                tags: JSON.stringify(req.body.tags) || currentResult.tags,
                public: req.body.public
            }
            const updatedResult = await prisma.gallery.update({ where: { id: req.body.id }, data: updatedObject })
            if (updatedObject) {
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

export async function getPublicTags(req: Request, res: Response) {
    try {
        const tagArray: string[] = []
        const publicImages = await prisma.gallery.findMany({ where: { public: true } })
        publicImages.map((image) => {
            const imageTagArray = JSON.parse(image.tags)
            imageTagArray.map((tag: string) => {
                if (!tagArray.includes(tag)) { tagArray.push(tag) }
            })
        })
        res.json(tagArray).status(200)
    } catch {
        return res.sendStatus(500)
    }
}

export async function getAllTags(req: Request, res: Response) {
    try {
        const tagArray: string[] = []
        const publicImages = await prisma.gallery.findMany()
        publicImages.map((image) => {
            const imageTagArray = JSON.parse(image.tags)
            imageTagArray.map((tag: string) => {
                if (!tagArray.includes(tag)) { tagArray.push(tag) }
            })
        })
        res.json(tagArray).status(200)
    } catch {
        return res.sendStatus(500)
    }
}