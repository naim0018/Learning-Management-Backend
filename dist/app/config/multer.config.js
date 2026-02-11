"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: async (req, file) => {
        const fileExtension = file.originalname.split('.').pop() || '';
        const baseFileName = file.originalname
            .replace(`.${fileExtension}`, '')
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
        const uniqueId = `${Math.random().toString(36).substring(2)}-${Date.now()}-${baseFileName}`;
        let resourceType = 'image';
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/pdf') {
            resourceType = 'raw';
        }
        else if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        }
        else if (file.mimetype.startsWith('audio/')) {
            resourceType = 'video'; // ✅ FIXED: audio must be uploaded as video
        }
        return {
            folder: 'assets',
            public_id: uniqueId,
            resource_type: resourceType,
            format: fileExtension,
        };
    },
});
exports.multerUpload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024, // 1GB
    },
});
//# sourceMappingURL=multer.config.js.map