import multer from 'multer';
import path from 'path';
import fs from "fs";

const uploadDir = path.join(__dirname, 'uploads', 'videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, uploadDir);
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});


const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimes = ['video/mp4', 'video/mkv', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type. Only mp4, mkv, and webm are allowed.'));
    }
};


export const uploadVideo = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, 
    },
}).single('video'); 
