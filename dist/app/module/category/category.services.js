"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const category_model_1 = require("./category.model");
const createCourseCategory = async (payload) => {
    const { name } = payload;
    if (!payload.name || !payload.description || !payload.thumbnail) {
        throw new AppError_1.default(400, "name, description & thumbnail are required");
    }
    const existingCategory = await category_model_1.CourseCetegory.findOne({ name });
    if (existingCategory) {
        throw new AppError_1.default(400, `${name} category already exists`);
    }
    ;
    const newCategory = await category_model_1.CourseCetegory.create(payload);
    return newCategory;
};
const getAllCourseCategories = async () => {
    const categories = await category_model_1.CourseCetegory.find().sort({ createdAt: -1 });
    return categories;
};
const updateCourseCategory = async (id, payload) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.default(400, "Invalid category ID");
    }
    ;
    const existingCategory = await category_model_1.CourseCetegory.findById(id);
    if (!existingCategory) {
        throw new AppError_1.default(404, "Category not found");
    }
    ;
    if (payload.name) {
        const duplicate = await category_model_1.CourseCetegory.findOne({
            name: payload.name,
            _id: { $ne: id },
        });
        if (duplicate) {
            throw new AppError_1.default(400, `${payload.name} already exists`);
        }
    }
    ;
    const updatedCategory = await category_model_1.CourseCetegory.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedCategory;
};
exports.categoryServices = {
    createCourseCategory,
    getAllCourseCategories,
    updateCourseCategory
};
//# sourceMappingURL=category.services.js.map