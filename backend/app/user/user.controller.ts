import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from "express";
import passport from "passport";
import { createUserTokens,decodeToken } from "../common/services/passport-jwt.service";
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
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refToken = req.headers.authorization?.replace("Bearer ", "");

    if (refToken) {
      const result = await userService.refreshToken(refToken as string);
      console.log("Result", result);
      res.send(createResponse(result, "Token generated "));
    } else {
      res.send(createResponse(null, "Token not generated "));
    }
  }
);

/**
 * Sends a password reset link to the user's email address.
 *
 * @async
 * @function forgotPassword
 * @param {Request} req - The HTTP request object containing the user's email in the body.
 * @param {Response} res - The HTTP response object to send the result.
 * @throws {Error} If the email is invalid or the user does not exist.
 * @example
 * // POST request body: { email: "user@example.com" }
 * forgotPassword(req, res);
 * // Response: { message: "Password reset link sent to your email" }
 */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await userService.forgotPassword(email);

    res.send(createResponse("Password reset link sent to your email"));
  }
);

/**
 * Resets the user's password using a provided token and new password.
 *
 * @async
 * @function resetPassword
 * @param {Request} req - The HTTP request object containing the token and new password in the body.
 * @param {Response} res - The HTTP response object to send the result.
 * @throws {Error} If the token is invalid, expired, or the user cannot be found.
 * @example
 * // POST request body: { token: "eyJhbGci...", password: "newSecurePassword" }
 * resetPassword(req, res);
 * // Response: { message: "Password successfully reset" }
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const decodedUser: any = await decodeToken(token);

    await userService.resetPassword(decodedUser._id, password);

    res.send(createResponse("Password successfully reset"));
  }
);

/**
 * @function changePassword
 * @description Handles the password change request by validating the user's credentials and updating the password.
 * @param {Request} req - The request object containing the user details and password change information.
 * @param {Response} res - The response object used to send back the success message.
 * @throws {Error} Throws an error if password change fails (e.g., invalid current password or user not found).
 * @returns {void} Sends a response to indicate the success of the password change.
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(id, currentPassword, newPassword);

    res.send(createResponse("Password successfully changed"));
  }
);








