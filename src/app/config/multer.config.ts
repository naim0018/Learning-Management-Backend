import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import multer from 'multer';
import { Request } from 'express';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req: Request, file: Express.Multer.File) => {
    const fileExtension = file.originalname.split('.').pop() || '';

    const baseFileName = file.originalname
      .replace(`.${fileExtension}`, '')
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueId = `${Math.random().toString(36).substring(2)}-${Date.now()}-${baseFileName}`;

    let resourceType: 'image' | 'video' | 'raw' = 'image';

    if (file.mimetype === 'application/zip' || file.mimetype === 'application/pdf') {
      resourceType = 'raw';
    } 
    else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    } 
    else if (file.mimetype.startsWith('audio/')) {
      resourceType = 'video';   // ✅ FIXED: audio must be uploaded as video
    }

    return {
      folder: 'assets',
      public_id: uniqueId,
      resource_type: resourceType,
      format: fileExtension,
    };
  },
});

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },
});