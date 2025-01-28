import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";

export const isAuthenticated = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        console.log("No token")
        throw createHttpError(401, {
          message: "No token provided. Please log in.",
        });
        
      }

      const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as IUser;

      if (!decodedUser || !decodedUser._id) {
        throw createHttpError(401, {
          message: "Invalid token. Please log in again.",
        });
      }

      // Attach user details to the request object
      req.user = decodedUser;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(createHttpError(401, "Invalid token."));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(createHttpError(401, "Token has expired."));
      } else {
        next(error);
      }
    }
  }
);
