import express from 'express';
import { Request, Response } from 'express';
import { validateSession } from './middleware/auth';
import { handleLogin, handleLogout, handleTokenVerify } from './controllers/login';
import { getProjects, getProject, createProject, editProject, deleteProject, getPublicProjects } from './controllers/project';
export const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    res.sendFile("public/index.html");
})

// Authentication routes

router.post("/api/login", handleLogin)
router.get("/api/logout", validateSession, handleLogout)
router.get("/api/validateSession", handleTokenVerify)

// Project routes

router.get("/api/getProjects", validateSession, getProjects)
router.get("/api/getPublicProjects", getPublicProjects)
router.post("/api/getProject", getProject)
router.post("/api/createProject", validateSession, createProject)
router.post("/api/editProject", validateSession, editProject)
router.post("/api/deleteProject", validateSession, deleteProject)

