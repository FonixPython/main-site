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

export async function createNote(req:Request,res:Response) {
    try{
        
    } catch(e){
        console.log(e)
        return res.status(500)
    }
}