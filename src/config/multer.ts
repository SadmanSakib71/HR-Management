import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { ValidationError } from '../common/errors';
import { env } from './env';

export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;

const createImageStorage = (subdirectory: string): StorageEngine => {
  const destinationDir = path.join(env.uploadDir, subdirectory);

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, destinationDir);
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname);
      const uniqueSuffix = crypto.randomBytes(8).toString('hex');
      callback(null, `${Date.now()}-${uniqueSuffix}${extension}`);
    },
  });
};

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void => {
  if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
    callback(
      new ValidationError(
        `Unsupported file type: ${file.mimetype}. Only JPEG, PNG, and WEBP images are allowed.`,
      ),
    );
    return;
  }
  callback(null, true);
};

export const createImageUpload = (subdirectory: string): multer.Multer =>
  multer({
    storage: createImageStorage(subdirectory),
    limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
    fileFilter: imageFileFilter,
  });
