import jwt, { JwtPayload } from "jsonwebtoken";
import { envVers } from "../config/env";
import AppError from "./AppError";
import { User } from "../module/user/user.model";
import { generateJwt } from "./generateJwt";

export const createAccessTokenUseRefreshToken = async (refreshToken: string) => {
    const verifyToken = jwt.verify(refreshToken, envVers.REFRESH_SECRATE) as JwtPayload

    if (!verifyToken) throw new AppError(400, "Invalid Refresh Token");

    const findUser = await User.findOne({ _id: verifyToken.userId, role: verifyToken.role });

    if (!findUser) throw new AppError(400, "Invalid refresh Token");

    const tokens = await generateJwt(findUser);


    return {
        accessToken: tokens.accessToken
    }
}