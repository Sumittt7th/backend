
import { param } from "express-validator";


export const validateVideoId = [
    param("videoId").isMongoId().withMessage("Invalid video ID format")
];
