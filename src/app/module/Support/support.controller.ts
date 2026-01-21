import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { Support } from "./support.model";
import { sendResponse } from "../../utils/sendResponse";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createSupport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const email = req.authUser?.email;

    const data = req.body;


    const payload = {
        userEmail: email,
        ...data
    };


    const createSupport = await Support.create(payload);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Message sent to support",
        data: createSupport
    });
});


const getAllSupport = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const totalResolve = await Support.find({ solveStatus: "Resolve" }).countDocuments();
        const totalPending = await Support.find({ solveStatus: "Pending" }).countDocuments();

        const supportQuery = new QueryBuilder(
            Support.find(),
            req.query as Record<string, string>
        )
            .filter()  // ✅ এটা add করা হয়েছে
            .search(["userEmail", "phone", "problemDescription"])
            .sort()
            .paginate();

        const result = await supportQuery.build();
        const meta = await supportQuery.getMeta();

        res.status(200).json({
            success: true,
            message: "Support list retrieved successfully",
            meta,
            data: {
                totalResolve,
                totalPending,
                data: result,
            },
        });
    }
)


const updateSupportStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const { supportId } = req.params;
        const { solveStatus, replay } = req.body;

        const updatedSupport = await Support.findByIdAndUpdate(
            supportId,
            {
                solveStatus,
                replay,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Support updated successfully",
            data: { updatedSupport },
        });
    }
);

export const supportController = {
    createSupport,
    getAllSupport,
    updateSupportStatus
};