import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ValidationError } from '../common/errors';
import { createImageUpload } from '../config/multer';

const employeePhotoUpload = createImageUpload('employees');

const mapMulterError = (error: multer.MulterError): string => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return 'Photo must be 2MB or smaller';
  }
  return 'Photo upload failed';
};

export const uploadEmployeePhoto = (req: Request, res: Response, next: NextFunction): void => {
  employeePhotoUpload.single('photo')(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      next(new ValidationError(mapMulterError(error)));
      return;
    }

    next(error);
  });
};
