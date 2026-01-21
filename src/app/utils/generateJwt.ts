import { envVers } from "../config/env";
import { IUser } from "../module/user/user.interface";
import jwt from "jsonwebtoken";

export const generateJwt = async (data: Partial<IUser>) => {
    const payload = {
        userId: data?._id,
        email: data.email,
        role: data.role
    };

    const accessToken = jwt.sign(payload, envVers.ACCESS_SECRATE, { expiresIn: "30d" });

    const refreshToken = jwt.sign(payload, envVers.REFRESH_SECRATE, { expiresIn: "90d" });

    return {
        accessToken,
        refreshToken
    }

}