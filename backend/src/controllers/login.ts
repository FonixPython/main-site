import { prisma } from "../db.js";
import argon2 from "argon2";
import { Request, Response } from "express";

export interface LoginResponse {
    authorized: boolean,
    token: string | null
}

export async function verifyToken(token: string): Promise<Boolean> {
    try {
        const result = await prisma.sessions.findFirstOrThrow({ where: { token: token } })
        return (true)
    } catch {
        return (false)
    }
}

export async function handleTokenVerify(req: Request, res: Response) {
    const storedToken = req.cookies.sessionToken || null;
    if (storedToken) {
        if (await verifyToken(storedToken)) {
            return res.json({ "authorized": true }).status(200)
        } else {
            return res.json({ "authorized": false }).status(401)
        }
    } else {
        return res.json({ "authorized": false }).status(401)
    }
}

export async function logout(token: string) {
    const result = await prisma.sessions.delete({ where: { token: token } })
}


export async function handleLogout(req: Request, res: Response) {
    try {
        const storedToken = req.cookies.sessionToken || null;
        if (storedToken) {
            await logout(storedToken)
            return res.sendStatus(200)
        } else {
            return res.sendStatus(400)
        }
    } catch {
        res.sendStatus(500)
    }
}

export async function loginAdmin(username: string, password: string, agent_text: string | undefined): Promise<LoginResponse> {
    const validPasswordHash = process.env.ADMIN_PASSWORD
    const validUsername = process.env.ADMIN_USERNAME
    if (await argon2.verify(validPasswordHash || "", password) && validUsername == username) {
        const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token: string = "";
        for (let i: number = 0; i < chars.length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        let result = await prisma.sessions.create({ data: { token: token, userAgent: agent_text || "Unknown agent" } })
        return ({
            authorized: true,
            token: token
        })
    }
    return ({
        authorized: false,
        token: null
    })
}

export async function handleLogin(req: Request, res: Response) {
    try {
        if (req.body.username && req.body.password) {
            const loginResult = await loginAdmin(req.body.username, req.body.password, req.headers["user-agent"])
            if (loginResult.token) {
                res.cookie("sessionToken", loginResult.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 * 24 // 1 day
                });
                return res.sendStatus(200)
            } else {
                return res.sendStatus(401)
            }
        }
        return res.sendStatus(400)
    } catch {
        res.sendStatus(500)
    }
}

