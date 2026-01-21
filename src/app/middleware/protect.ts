import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { User } from "../module/user/user.model";
import jwt from "jsonwebtoken";
import { envVers } from "../config/env";


export const checkAuths = (...auths: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers?.authorization;

    if (!token) {
        throw new AppError(400, "User not authorized!");
    };

    const validationUser = jwt.verify(token, envVers.ACCESS_SECRATE) as JwtPayload;

    if (!validationUser) {
        throw new AppError(401, "User not valid");
    };

    const existUser = await User.findById(validationUser?.userId);

    if (!existUser) {
        throw new AppError(404, "User not found!");
    }


    if (auths.length && !auths.includes(validationUser.role)) {
        throw new AppError(401, "You are not permited access this route!");
    };
    req.authUser = validationUser;
    next();
}