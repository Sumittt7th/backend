import { IVideo } from "./video.dto";
import cloudinary from "cloudinary";
import { AppDataSource } from '../common/services/postgre.service';
import { Video } from './video.entity';

/**
 * Uploads a video to Cloudinary and saves its metadata to the database.
 * @async
 * @function uploadVideo
 * @param {IVideo} data - Video metadata to save.
 * @param {Express.Multer.File} file - The uploaded video file.
 * @returns {Promise<Object>} The saved video document.
 */
export const uploadVideo = async (data: IVideo, file: Express.Multer.File): Promise<Video> => {
      const result = await cloudinary.v2.uploader.upload(file.path, {
          resource_type: "video", 
          folder: "videos", 
          eager: [
              { streaming_profile: "hd", format: "m3u8" }, 
          ],
      });
      const videoData = {
          ...data,
          url: result.secure_url, 
          public_id: result.public_id,
          hlsUrl: result.eager[0]?.secure_url, 
          viewCount: 0, 
      };      
      const videoRepository = AppDataSource.getRepository(Video);
      const video = videoRepository.create(videoData);
      const savedVideo = await videoRepository.save(video);

      return savedVideo; 

};

/**
 * Retrieves all videos from the database.
 * @async
 * @function getAllVideos
 * @returns {Promise<Array<Object>>} An array of all video documents.
 */
export const getAllVideos = async (): Promise<Video[]> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const videos = await videoRepository.find();
  return videos; 
};

/**
 * Retrieves a video by its ID.
 * @async
 * @function getVideoById
 * @param {string} id - The ID of the video to retrieve.
 * @returns {Promise<Object|null>} The video document or null if not found.
 */
export const getVideoById = async (id: string): Promise<Video | null> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const video = await videoRepository.findOneBy({_id:id});
  return video; 
};

/**
 * Updates video metadata by its ID.
 * @async
 * @function updateVideo
 * @param {string} id - The ID of the video to update.
 * @param {Partial<IVideo>} data - Partial video metadata to update.
 * @returns {Promise<Object|null>} The updated video document or null if not found.
 */
export const updateVideo = async (id: string, data: Partial<IVideo>): Promise<Video | null> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const video = await videoRepository.findOneBy({_id:id});
  if (!video) {
      return null;
  }
  Object.assign(video, data);
  await videoRepository.save(video);

  return video;
};

/**
 * Deletes a video by its ID, including its file on Cloudinary.
 * @async
 * @function deleteVideo
 * @param {string} videoId - The ID of the video to delete.
 * @returns {Promise<Object|null>} The deleted video document or null if not found.
 * @throws {Error} If the video or Cloudinary deletion fails.
 */
export const deleteVideo = async (videoId: string): Promise<Video | null> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const video = await videoRepository.findOne({
      where: { _id: videoId },
  });
  if (!video) {
      throw new Error("Video not found");
  }

  // Remove the video from Cloudinary
  const cloudinaryResponse = await cloudinary.v2.uploader.destroy(video.public_id, {
      resource_type: "video", 
  });
  if (cloudinaryResponse.result !== "ok") {
      throw new Error("Failed to delete video from Cloudinary");
  }
  const deletedVideo = await videoRepository.remove(video);
  return deletedVideo;
};

/**
 * Increments the view count of a video by its ID.
 * @async
 * @function incrementViewCount
 * @param {string} id - The ID of the video.
 * @returns {Promise<Object>} The updated video document with the incremented view count.
 * @throws {Error} If the video is not found.
 */
export const incrementViewCount = async (id: string): Promise<Video | null> => {
  const videoRepository = AppDataSource.getRepository(Video);
  const video = await videoRepository.findOne({
      where: { _id: id },
  });
  if (!video) {
      throw new Error("Video not found");
  }
  video.viewCount += 1;
  await videoRepository.save(video);
  return video;
};
