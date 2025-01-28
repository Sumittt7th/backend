
import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware";
import * as userController from "./user.controller";
import * as userValidator from "./user.validation";
import { roleAuth } from '../common/middleware/role-auth.middleware';
import { isAuthenticated } from '../common/middleware/isAuthenticate.middleware';

const router = Router();

router
  .get("/",roleAuth("ADMIN"),isAuthenticated, userController.getAllUser)
  .get("/:id",isAuthenticated, userController.getUserById)
  .delete("/:id",roleAuth("ADMIN"),isAuthenticated, userController.deleteUser)
  .post("/", userValidator.createUser, catchError, userController.createUser)
  .put("/:id",roleAuth("ADMIN"),isAuthenticated, userValidator.updateUser, catchError, userController.updateUser)
  .patch("/:id",isAuthenticated, userValidator.editUser, catchError, userController.editUser)
  .post(
    "/login",
    userValidator.loginUser,
    catchError,
    userController.loginUser
  )
  .get("/subs/:id",isAuthenticated,userController.getUserSubscriptionStatus)
  .post("/logout",isAuthenticated,catchError,userController.logoutUser)
  .get("/reftoken",catchError,userController.refreshToken);

export default router;

