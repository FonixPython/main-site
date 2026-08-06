import { verifyToken } from "../controllers/login.js";
import { Request, Response, NextFunction } from "express";


export async function validateSession(req: Request, res: Response, next: NextFunction) {
    const storedToken = req.cookies.sessionToken
    if (!storedToken) {
        return res.sendStatus(401)
    }
    const verificationResult = await verifyToken(storedToken)
    if (verificationResult == true) {
        next()
    } else {
        return res.sendStatus(401)
    }
}