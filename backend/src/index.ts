import express from "express";
import { Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;

const corsOptions = {
    origin: ["http://localhost:5173"],
};

const app = express();

app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, "public")));
app.get("/api", async (req: Request, res: Response) => {
    res.json({ name: "idiot" });
})

app.get("/", async (req: Request, res: Response) => {
    res.sendFile("public/index.html");
})

app.listen(PORT, () => {
    console.log("Server started on port " + String(PORT));
});