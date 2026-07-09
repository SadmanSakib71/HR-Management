import { RequestHandler } from 'express';
import { upload } from '../config/multer';

export const uploadSingle = (fieldName: string): RequestHandler => upload.single(fieldName);

export const uploadMultiple = (fieldName: string, maxCount = 10): RequestHandler =>
  upload.array(fieldName, maxCount);
