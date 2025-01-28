
import { Router } from "express";
import * as analyticsController from "./analytics.controller";
import * as analyticsValidator from "./analytics.validation";
import { catchError } from "../common/middleware/cath-error.middleware";
import { roleAuth } from '../common/middleware/role-auth.middleware';
import { isAuthenticated } from '../common/middleware/isAuthenticate.middleware';

const router = Router();

// Route to increment video view count (user-specific)
router
    .post("/:id", isAuthenticated, catchError, analyticsController.incrementViewCount)
    .get("/:videoId",isAuthenticated, catchError, analyticsController.getAnalyticsByVideoId);

export default router;
