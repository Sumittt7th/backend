import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import passport from "passport";
import { createUserTokens } from "../common/services/passport-jwt.service";
import createHttpError from 'http-errors';



/**
 * Creates a new user.
 * @async
 * @function createUser
 * @param {Request} req - Express request object containing user data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with the created user.
 */

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created sucssefully"));
});

/**
 * Updates an existing user.
 * @async
 * @function updateUser
 * @param {Request} req - Express request object containing user ID in params and updated data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with the updated user.
 */

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

/**
 * Partially edits an existing user.
 * @async
 * @function editUser
 * @param {Request} req - Express request object containing user ID in params and partial updated data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with the updated user.
 */

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const {name,email} = req.body;
  const result = await userService.editUser(req.params.id, {name:name,email:email,});
  res.send(createResponse(result, "User updated sucssefully"));
});

/**
 * Deletes a user by ID.
 * @async
 * @function deleteUser
 * @param {Request} req - Express request object containing user ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response indicating the user was deleted.
 */

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

/**
 * Retrieves a user by their ID.
 * @async
 * @function getUserById
 * @param {Request} req - Express request object containing user ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with the user data.
 */

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.send(createResponse(result));
});

/**
 * Retrieves all users.
 * @async
 * @function getAllUser
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with all users.
 */

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  res.send(createResponse(result));
});

/**
 * Logs in a user using passport authentication.
 * @async
 * @function loginUser
 * @param {Request} req - Express request object containing login credentials in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with access and refresh tokens on successful authentication.
 */

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  passport.authenticate(
    "login",
    async (err: Error | null, user: any | undefined, info: any) => {
      if (err || !user) {
        return res.status(401).json({
          message: info?.message || "Authentication failed",
        });
      }

      const { accessToken, refreshToken } = createUserTokens(user);
      await userService.editUser(user._id, {refToken: refreshToken });

      res.send(
        createResponse({ accessToken, refreshToken, role: user.role ,user}, "Login successful")
      );
    }
  )(req, res);
});

/**
 * Retrieves a user's subscription status by their ID.
 * @async
 * @function getUserSubscriptionStatus
 * @param {Request} req - Express request object containing user ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Sends a success response with the subscription status.
 */
export const getUserSubscriptionStatus = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await userService.getUserSubscription(id);
  if(result)
  res.send(createResponse(result,"Subscribed"));
else
res.send(createResponse(result,"Not Subscribed"));
});

/**
 * Handles logging out a user by invalidating the session.
 * Clears the access token and refresh token from localStorage.
 * 
 * @async
 * @function
 * @param {Request} req - The Express request object, containing the user data.
 * @param {Response} res - The Express response object used to send the response.
 * @throws {HttpError} Throws an error if the user is not found or is unauthorized.
 * @returns {Response} The response indicating that the user has been successfully logged out.
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if(!req.user){
      throw createHttpError(403, {
          message: "Invalid or unauthorized user role",
      });
  }

  await userService.logoutUser(req.user._id);
  
  res.send(createResponse("User logout successfully"))
});

/**
 * Controller to handle the refresh token request and issue new tokens.
 * 
 * @async
 * @function
 * @param {Request} req - The Express request object, containing the refresh token.
 * @param {Response} res - The Express response object used to send the new tokens.
 * @returns {Response} - The response containing new access and refresh tokens.
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response ) => {
  const refToken  = req.headers.authorization?.replace("Bearer ", "");

  if (!refreshToken) {
    const result = await userService.refreshToken(refToken as string);
    res.send(createResponse(result,"Token generated "));
  }
  else{
    res.send(createResponse(null,"Token not generated "));
  }

  
});




