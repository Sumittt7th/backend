import { body } from "express-validator";

export const createVideo = [
    body("title").notEmpty().withMessage("Title is required"),
    body("access").isIn(["free", "paid"]).withMessage("Access must be either 'free' or 'paid'"),
];

export const updateVideo = [
    body("title").optional().notEmpty().withMessage("Title should not be empty if provided"),
    body("url").optional().notEmpty().withMessage("Video URL should not be empty if provided"),
    body("access").optional().isIn(["free", "paid"]).withMessage("Access must be either 'free' or 'paid'"),
];
