import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as videoController from "./video.controller";
import * as videoValidator from "./video.validation";
import { uploadVideo } from '../common/services/file.upload.service';
import { roleAuth } from '../common/middleware/role-auth.middleware';
import { isAuthenticated } from '../common/middleware/isAuthenticate.middleware';

const router = Router();

router
  .get("/",isAuthenticated, videoController.getAllVideos)
  .get("/:id",isAuthenticated, videoController.getVideoById)
  .delete("/:id",roleAuth("ADMIN"),isAuthenticated, videoController.deleteVideo)
  .post("/", uploadVideo,videoValidator.createVideo,roleAuth("ADMIN"),isAuthenticated, catchError, videoController.uploadVideos)
  .put("/:id", videoValidator.updateVideo, catchError,roleAuth("ADMIN"),isAuthenticated, videoController.updateVideo)
  .post("/:id/view",isAuthenticated, catchError, videoController.incrementViewCount)
  .get("play/:id/:userId",isAuthenticated,videoController.getVideoPlayback);

export default router;
