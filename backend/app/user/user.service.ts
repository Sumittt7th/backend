import { createUserTokens, decodeToken } from '../common/services/passport-jwt.service';
import { type IUser } from "./user.dto";
import { AppDataSource } from '../common/services/postgre.service';
import { User } from "./user.entity";
import * as mailService from "../common/services/email.service";
import bcrypt from "bcrypt";

/**
 * Creates a new user with the specified data.
 * @async
 * @function createUser
 * @param {IUser} data - User data to create a new user.
 * @returns {Promise<Object>} The created user document.
 */
export const createUser = async (data: IUser): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);   
    const user = userRepository.create({
        ...data,
        active: true,        
        refToken: ""         
    });

    const result = await userRepository.save(user);

    return result;
};

/**
 * Updates an existing user by ID with the provided data.
 * @async
 * @function updateUser
 * @param {string} id - The ID of the user to update.
 * @param {IUser} data - Updated user data.
 * @returns {Promise<Object|null>} The updated user document or null if not found.
 */
export const updateUser = async (id: string, data: Partial<IUser>): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User); 

    const user = await userRepository.findOneBy({ _id: id });

    if (!user) {
        return null; 
    }
    Object.assign(user, data);
    const result = await userRepository.save(user);

    return result;
};

/**
 * Partially updates an existing user by ID with the provided data.
 * @async
 * @function editUser
 * @param {string} id - The ID of the user to edit.
 * @param {Partial<IUser>} data - Partial user data for the update.
 * @returns {Promise<Object|null>} The updated user document or null if not found.
 */
export const editUser = async (id: string, data: Partial<IUser>): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User); 

    const user = await userRepository.findOneBy({ _id: id });

    if (!user) {
        return null; 
    }
    Object.assign(user, data);
    const result = await userRepository.save(user);

    return result;
};

/**
 * Deletes a user by their ID.
 * @async
 * @function deleteUser
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const deleteUser = async (id: string): Promise<boolean> => {
    const userRepository = AppDataSource.getRepository(User); 
    const result = await userRepository.delete(id);
    return result.affected !== 0;
};

/**
 * Retrieves a user by their ID.
 * @async
 * @function getUserById
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
export const getUserById = async (id: string): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User); 
    const result = await userRepository.findOneBy({ _id: id });
    return result; 
};
/**
 * Retrieves all users.
 * @async
 * @function getAllUser
 * @returns {Promise<Array<Object>>} An array of all user documents.
 */
export const getAllUser = async (): Promise<User[]> => {
    const userRepository = AppDataSource.getRepository(User); 
    const result = await userRepository.find();
    return result; 
};

/**
 * Retrieves a user by their email.
 * @async
 * @function getUserByEmail
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User); 
    const result = await userRepository.findOneBy({ email });
    return result; 
};


/**
 * Logs out a user by removing their refresh token from the database.
 * 
 * @async
 * @function
 * @param {string} userId - The ID of the user to log out.
 * @throws {Error} Throws an error if the user is not found in the database.
 * @returns {Promise<void>} A promise indicating the completion of the logout process.
 */

export const logoutUser = async (userId: string): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User); // Get the User repository
    const user = await userRepository.findOneBy({ _id: userId });
    if (!user) {
        throw new Error("User not found");
    }
    user.refToken = "";
    await userRepository.save(user);
};
/**
 * Refreshes the access token using the refresh token.
 * 
 * @param {string} refsToken - The refresh token.
 * @returns {Promise<{ accessToken: string; refreshToken: string }>} The new access token and refresh token.
 * @throws {Error} Throws an error if the refresh token is invalid or expired.
 */
export const refreshToken = async (refsToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const decoded: any = decodeToken(refsToken);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ _id: decoded._id });
    if (!user) {
        throw new Error('User not found');
    }

    const { accessToken, refreshToken } = createUserTokens(user);
    user.refToken = refreshToken;
    await userRepository.save(user);

    return { accessToken, refreshToken };
};

/**
 * Sends a password reset email to the specified user.
 *
 * @async
 * @function forgotPassword
 * @param {string} email - The email address of the user requesting a password reset.
 * @throws {Error} If the user does not exist or is unauthorized.
 * @returns {Promise<void>}
 */
export const forgotPassword = async (email: string): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
        throw new Error('Invalid or unauthorized user role');
    }

    const { accessToken } = createUserTokens(user);
    const resetURL = `${process.env.FE_BASE_URL}/reset-password?token=${accessToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
    };

    await mailService.sendEmail(mailOptions);
};

/**
 * Resets the user's password by updating it with a new hashed password.
 *
 * @async
 * @function resetPassword
 * @param {string} id - The unique identifier of the user whose password is to be reset.
 * @param {string} newPassword - The new password to be set for the user.
 * @throws {Error} If the user does not exist or is unauthorized.
 * @returns {Promise<User>} The updated user object after the password reset.
 */
export const resetPassword = async (id: string, newPassword: string): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ _id: id });

    if (!user) {
        throw new Error('User not found or unauthorized.');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userRepository.save(user);

    return updatedUser;
};

/**
 * Changes the password of a user by validating the current password and updating it with the new one.
 *
 * @async
 * @function changePassword
 * @param {string} id - The unique ID of the user whose password is to be changed.
 * @param {string} currentPassword - The current password of the user to validate.
 * @param {string} newPassword - The new password to set for the user.
 * @throws {Error} Throws an error if the user is not found, the current password is invalid, or the update fails.
 * @returns {Promise<User>} Returns the updated user object after the password change.
 */
export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ _id: id });

    if (!user) {
        throw new Error('User not found.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error('Invalid old password.');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    const updatedUser = await userRepository.save(user);

    return updatedUser;
};