import fs from 'fs';
import path from 'path';
import multer, { StorageEngine } from 'multer';
import { env } from './env';

if (!fs.existsSync(env.uploadDir)) {
  fs.mkdirSync(env.uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadDir);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    callback(null, `${path.basename(file.originalname, extension)}-${uniqueSuffix}${extension}`);
  },
});

export const upload = multer({ storage });
