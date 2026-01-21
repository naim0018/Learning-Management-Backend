import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound } from "./app/utils/notFoundRoute";
import { moduleRoute } from "./app/route/route";
import { globalErrorhandler } from "./app/middleware/global.error.handler";

export const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://travisjerovetz-frontend.vercel.app", "*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Module Route
moduleRoute.forEach(item => app.use(`/api/v1${item.path}`, item.routes));

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Server runing success"
    })
});

app.use(globalErrorhandler);
app.use(notFound);