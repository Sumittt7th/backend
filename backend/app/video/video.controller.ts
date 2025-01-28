import * as videoService from "./video.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import * as userService from "../user/user.service";

/**
 * Uploads a video file.
 * @async
 * @function uploadVideos
 * @param {Request} req - Express request object containing video data in the body and file in req.file.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a response with the uploaded video details or an error message.
 */
export const uploadVideos = asyncHandler(
    async (req: Request, res: Response, next: Function) => {
        if (!req.file) {
            res.send(createResponse(null, "No file uploaded"));
            return;
        }
        const result = await videoService.uploadVideo(req.body, req.file);
        res.send(createResponse(result, "Video uploaded successfully"));
    }
);

/**
 * Retrieves all videos.
 * @async
 * @function getAllVideos
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response with all video details.
 */
export const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.getAllVideos();
    res.send(createResponse(result));
});

/**
 * Retrieves a video by its ID.
 * @async
 * @function getVideoById
 * @param {Request} req - Express request object containing video ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response with the video details.
 */
export const getVideoById = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.getVideoById(req.params.id);
    res.send(createResponse(result));
});

/**
 * Updates video details by ID.
 * @async
 * @function updateVideo
 * @param {Request} req - Express request object containing video ID in params and updated data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response with the updated video details.
 */
export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.updateVideo(req.params.id, req.body);
    res.send(createResponse(result, "Video updated successfully"));
});

/**
 * Deletes a video by its ID.
 * @async
 * @function deleteVideo
 * @param {Request} req - Express request object containing video ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response indicating successful deletion of the video.
 */
export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.deleteVideo(req.params.id);
    res.send(createResponse(result, "Video deleted successfully"));
});

/**
 * Increments the view count for a video by its ID.
 * @async
 * @function incrementViewCount
 * @param {Request} req - Express request object containing video ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response indicating the updated view count.
 */
export const incrementViewCount = asyncHandler(async (req: Request, res: Response) => {
    const result = await videoService.incrementViewCount(req.params.id);
    res.send(createResponse(result, "View count updated"));
});

/**
 * Retrieves the playback URL for a video.
 * @async
 * @function getVideoPlayback
 * @param {Request} req - Express request object containing video ID and user ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a response with the playback URL if accessible or an error message otherwise.
 */
export const getVideoPlayback = asyncHandler(async (req: Request, res: Response) => {
    const { videoId, userId } = req.params;
    const video = await videoService.getVideoById(videoId);
    if (!video) {
        res.status(404).send(createResponse(null, "Video not found"));
        return;
    }
    if (video.access === "paid") {
        const isSubscribed = await userService.getUserSubscription(userId);
        if (!isSubscribed) {
            res.send(createResponse(null, "Please subscribe to view this video"));
            return;
        }
    }
    res.send(createResponse({ videoUrl: video.hlsUrl }, "Video is ready for playback"));
});
