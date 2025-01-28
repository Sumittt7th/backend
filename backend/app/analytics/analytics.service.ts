
import { AppDataSource } from '../common/services/postgre.service';
import { Analytics } from './analytics.entity';
import {User} from "../user/user.entity"
import { Video } from '../video/video.entity';

/**
 * Gets or creates analytics for a video and user.
 * @async
 * @function getOrCreateAnalytics
 * @param {string} videoId - ID of the video.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Object>} The analytics document.
 */
export const getOrCreateAnalytics = async (videoId: string, userId: string): Promise<Analytics> => {
    const analyticsRepository = AppDataSource.getRepository(Analytics);
    const userRepository = AppDataSource.getRepository(User);
    const videoRepository = AppDataSource.getRepository(Video);
    let analytics = await analyticsRepository.findOne({
      where: { videoId: { _id: videoId }, userId: { _id: userId } }, 
      relations: ["videoId", "userId"],  
  });
    if (analytics) {
        return analytics;
    }
    analytics = new Analytics();
    const video = await videoRepository.findOne({ where: {_id: videoId}})
    if(!video){
      throw new Error("Video not found")
    }
    analytics.videoId = video;
    const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user) {
    throw new Error("User not found");
  }
    analytics.userId = user;
    analytics.views = 0;
    await analyticsRepository.save(analytics);

    return analytics; 
};

/**
 * Increments the view count for a video's analytics.
 * @async
 * @function incrementViewCountAnalyticsService
 * @param {string} videoId - ID of the video.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Object>} Updated analytics document.
 */
export const incrementViewCount = async (videoId: string, userId: string): Promise<Analytics> => {
    const analytics = await getOrCreateAnalytics(videoId, userId);
    analytics.views += 1;
    const analyticsRepository = AppDataSource.getRepository(Analytics);
    await analyticsRepository.save(analytics);
    return analytics;
};

/**
 * Retrieves analytics data for a specific video ID.
 * @async
 * @function getAnalyticsByVideoIdService
 * @param {string} videoId - ID of the video.
 * @returns {Promise<Array<Object>>} Analytics documents populated with user data.
 */
export const getAnalyticsByVideoId = async (videoId: string) => {
    // Get the repository for the Analytics entity
    const analyticsRepository = AppDataSource.getRepository(Analytics);
  
    
    const analytics = await analyticsRepository.find({
      where: { videoId: { _id: videoId } },
      relations: ["userId"], 
    });
  
    return analytics.map((analytic) => ({
      ...analytic,
      userId: {
        name: analytic.userId?.name,
        email: analytic.userId?.email,
      },
    }));
  };