
import * as analyticsService from "./analytics.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

/**
 * Increments the view count for a video based on the video ID and user ID.
 * @async
 * @function incrementViewCount
 * @param {Request} req - Express request object containing video ID in params and user ID in user object.
 * @param {Response} res - Express response object to send the result.
 * @returns {Promise<void>} Sends a response indicating success or failure.
 */
export const incrementViewCount = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const userId = req?.user?._id;
    if(userId){
    const result = await analyticsService.incrementViewCount(videoId, userId);
    res.send(createResponse(result, "View count incremented successfully"));
    }
    else{
        res.send(createResponse(null, "View count not incremented successfully"));
    }
});

/**
 * Fetches analytics data for a specific video ID.
 * @async
 * @function getAnalyticsByVideoId
 * @param {Request} req - Express request object containing video ID in params.
 * @param {Response} res - Express response object to send the analytics data.
 * @returns {Promise<void>} Sends the analytics data as a response.
 */
export const getAnalyticsByVideoId = asyncHandler(async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const result = await analyticsService.getAnalyticsByVideoId(videoId);
    res.send(createResponse(result,"Analytics fetched sucessfully"));
});
