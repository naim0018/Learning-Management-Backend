import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import AppError from "../utils/AppError";
import { envVers } from "../config/env";

interface IErrorStore {
    path: string,
    message: string
}

export const globalErrorhandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorStore: IErrorStore[] = [];

    //   if(envVar.node_env === "development"){
    //     console.log(err)
    // };

    // if(req.file){
    //     await deleteImageFormCloudinary(req.file.path);
    // };

    // if(req.files && Array.isArray(req.files) && req.files.length){
    //     const imageUrl = (req.files as Express.Multer.File[]).map((data) => data.path);
    //     await Promise.all(imageUrl.map((url) => deleteImageFormCloudinary(url)))
    // };

    // handle Zod Error
    if (err instanceof ZodError) {
        const issue = err.issues;

        issue.forEach((item: any) => {
            errorStore.push({
                path: item.path.length > 0 ? String(item.path[item.path.length - 1]) : "root",
                message: item.message
            })
        });

        statusCode = 400;
        message = "Zod Error";

    }
    // Handle mogoose Validation Error
    else if (err instanceof mongoose.Error.ValidationError) {
        Object.values(err.errors).forEach((error) => {
            errorStore.push({
                path: error.path,
                message: error.message
            })
        });
        message = "Mongoose Validation error";
        statusCode = 400;
    }
    // Handle Mongoose Duplicate Error
    else if (err.code === 11000) {
        const match = err.message.match(/"([^"]*)"/);
        message = `${match[1]} already exist`;
        statusCode = 400
    }
    // Handle MongoDb Cast Error
    else if (err.name === "CastError") {
        message = "Invalid mongoDb objectId";
        statusCode = 400
    }
    // Handle Custom app error
    else if (err instanceof AppError) {
        message = err.message;
        statusCode = err.statusCode;
    }
    // Handle javascript default error
    else if (err instanceof Error) {
        message = err.message,
            statusCode = 400
    };


    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message,
        errors: errorStore,
        stack: envVers.DEV_ENVIRONMENT === "development" ? err.stack : null,
        err: envVers.DEV_ENVIRONMENT === "development" ? err : null
    })

}