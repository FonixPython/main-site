import express from 'express';
import { Request, Response } from 'express';
import { validateSession } from './middleware/auth.js';
import { handleLogin, handleLogout, handleTokenVerify } from './controllers/login.js';
import { getProjects, getProject, createProject, editProject, deleteProject, getPublicProjects } from './controllers/project.js';
import { getAboutInfo, setAboutInfo, getSocials, createSocial, editSocial, deleteSocial } from './controllers/about.js';
import { uploadMiddleware, uploadFile, getFile, deleteFile, getUploads } from './controllers/upload.js';
import { getPublicImages, downloadImage, registerClick, getAllImages, uploadImage, deleteImage, editImage } from './controllers/gallery.js';
import { verify } from 'node:crypto';
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

// Site info routes

router.get("/api/getAbout", getAboutInfo)
router.post("/api/setAbout", validateSession, setAboutInfo)

router.get("/api/getSocials", getSocials)
router.post("/api/createSocial", validateSession, createSocial)
router.post("/api/editSocial", validateSession, editSocial)
router.post("/api/deleteSocial", validateSession, deleteSocial)


// Upload routes

router.get("/api/uploads/:fileId", getFile)
router.get("/api/getUploads", validateSession, getUploads)
router.post("/api/upload", validateSession, uploadMiddleware, uploadFile)
router.post("/api/deleteUpload", validateSession, deleteFile)

// Gallery routes

router.get("/api/getPublicImages", getPublicImages)
router.get("/api/downloadImage/:imageId", downloadImage)
router.get("/api/registerClick", registerClick)
router.get("/api/getAllImages", validateSession, getAllImages)
router.post("/api/uploadImage", validateSession, uploadMiddleware, uploadImage)
router.post("/api/deleteImage", validateSession, deleteImage)
router.post("/api/editImage", validateSession, editImage)