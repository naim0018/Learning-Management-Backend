import { IRole } from "../module/user/user.interface";
import { User } from "../module/user/user.model"
import { envVers } from "./env"
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
    const findAdmin = await User.findOne({ email: envVers.ADMIN.ADMIN_EMAIL });

    const hashPassword = await bcrypt.hash(envVers.ADMIN.ADMIN_PASSWORD, 10);

    if (!findAdmin) {
        await User.create({
            fullName: "Admin Hasan",
            email: envVers.ADMIN.ADMIN_EMAIL,
            password: hashPassword,
            role: IRole.ADMIN
        });
        console.log("Admin created successfully");
    };
    console.log("Admin already exist");
}