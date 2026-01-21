import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";
import bcrypt from "bcrypt"
import { User } from "./user.model";
import { createAccessTokenUseRefreshToken } from "../../utils/createAccessTokenUseRefreshToken";
import { RecentActivity } from "../RecentActivity/recent.activity.model";
import { sendEmail } from "../../config/sendEmail";

const SignUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.signUp(req.body);


    await RecentActivity.create({
        title: "New User Registration",
        description: `${result?.fullName} joined the platform`
    });

    await sendEmail({
        to: result.email,
        subject: "Welcome to LMS",
        templateName: "welcome", // welcome.ejs
        templateData: {
            appName: "LMS",
            name: result.fullName,
            email: result.email,
            password: req.body.password,
            loginUrl: "https://travisjerovetz-frontend.vercel.app"
        }
    });

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: `Well done, ${result.fullName}! Your registration was successful.`,
        data: result
    })

});


const SingIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.signIn(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Wellcome back, ${result.user.fullName}! You have successfully signed in.`,
        data: result
    })

});


// const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id;

//     if (!userId) {
//         return next(new AppError(400, "User ID is required"));
//     }

//     const payload = req.body;

//     const updateData: Record<string, any> = {};

//     // Only valid value update
//     for (const key in payload) {
//         const value = payload[key];

//         if (value !== null && value !== undefined) {
//             if (typeof value === "string" && value.trim() === "") continue;
//             updateData[key] = value;
//         }
//     }

//     // Never update these
//     delete updateData.password;
//     delete updateData.lastLogin;

//     if (Object.keys(updateData).length === 0) {
//         return next(new AppError(400, "No valid fields to update"));
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $set: updateData },
//         { new: true, runValidators: true }
//     ).select("-password -lastLogin");

//     if (!updatedUser) {
//         return next(new AppError(404, "User not found"));
//     }

//     res.status(200).json({
//         status: "success",
//         data: updatedUser,
//     });
// }
// );


const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
        return next(new AppError(400, "User ID is required"));
    }

    const payload = req.body;
    const file = req.file; // 🔥 multer file

    const updateData: Record<string, any> = {};

    // ✅ body থেকে valid field নাও
    for (const key in payload) {
        const value = payload[key];

        if (value !== null && value !== undefined) {
            if (typeof value === "string" && value.trim() === "") continue;
            updateData[key] = value;
        }
    }

    // ✅ avatarUrl file থাকলে সেট করো
    if (file) {
        // যদি local upload
        updateData.avatarUrl = file.path;

        // যদি cloudinary / s3 হলে
        // updateData.avatarUrl = file.location;
    }

    // ❌ sensitive field remove
    delete updateData.password;
    delete updateData.lastLogin;
    delete updateData.totalPoints;

    if (Object.keys(updateData).length === 0) {
        return next(new AppError(400, "No valid fields to update"));
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password -lastLogin");

    if (!updatedUser) {
        return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
}
);



const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await UserServices.getAllUser(query as Record<string, string>);


    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "All User Retrived Successfully",
        data: result.data,
        meta: result.meta
    })

});



const getAllEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await UserServices.getAllEmployee(query as Record<string, string>);



    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "All User Retrived Successfully",
        data: result.data,
        meta: result.meta
    })

})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser.userId;
    const result = await User.findById(userId);

    if (!result) throw new AppError(404, "User Not found");

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Profile retrived successfully",
        data: result
    })

})

const getAccessTokenUseRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.body?.authorization;

    const result = await createAccessTokenUseRefreshToken(refreshToken as string);

    // sendResponse(res, {
    //     success: true,
    //     statusCode: 200,
    //     message: "Token refreshed successfully",
    //     data: result
    // })
    res.status(200).send({
        success: true,
        statusCode: 200,
        message: "Token refreshed successfully",
        accessToken: result.accessToken
    })
});

const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    const result = await User.findByIdAndDelete(userId);

    if (!result) throw new AppError(404, "User not found");

    await RecentActivity.create({
        title: "New User Registration",
        description: `Admin Deleted ${result?.fullName} Account`
    })

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Deleted successfully",
        data: null
    })

});


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.authUser.userId; // auth middleware থেকে
    const { currentPassword, newPassword } = req.body;

    // 1️⃣ user খুঁজে বের করো
    const user = await User.findById(userId).select("+password");

    if (!user) {
        return next(new AppError(404, "User not found"));
    }

    // 2️⃣ current password match করো
    const isPasswordMatched = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordMatched) {
        return next(
            new AppError(403, "Current password is incorrect")
        );
    }

    // 3️⃣ নতুন password hash করো
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ DB তে save করো
    user.password = hashedPassword;
    await user.save();

    // 5️⃣ response পাঠাও
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Password Changed Successfully",
        data: null,
    });
}
);

const createEmployee = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.createEmployee(req.body);

    await sendEmail({
        to: result.email,
        subject: "Welcome to LMS",
        templateName: "welcome", // welcome.ejs
        templateData: {
            appName: "LMS",
            name: result.fullName,
            email: result.email,
            password: req.body.password,
            loginUrl: "https://travisjerovetz-frontend.vercel.app"
        }
    });

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Employee Creation success",
        data: result
    })


})

export const UserController = {
    SignUp,
    SingIn,
    updateUserProfile,
    getAccessTokenUseRefreshToken,
    getAllUser,
    getMe,
    deleteUser,
    changePassword,
    getAllEmployee,
    createEmployee
}