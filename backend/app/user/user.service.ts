import { createUserTokens, decodeToken } from '../common/services/passport-jwt.service';
import { type IUser } from "./user.dto";
import { AppDataSource } from '../common/services/postgre.service';
import { User } from "./user.entity";

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
        subscription: false,  
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
 * Retrieves the subscription status of a user by their ID.
 * @async
 * @function getUserSubscription
 * @param {string} id - The ID of the user to retrieve the subscription status for.
 * @returns {Promise<Object|null>} The user document with subscription details or null if not found.
 */
export const getUserSubscription = async (id: string): Promise<boolean | null> => {
    const userRepository = AppDataSource.getRepository(User); 
    const user = await userRepository.findOne({
        where: { _id: id },
        select: ["subscription"], 
    });
    return user ? user.subscription : false; 
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
 * @param {string} refreshToken - The refresh token.
 * @returns {Object} - The new access token and refresh token.
 * @throws {Error} - Throws an error if the refresh token is invalid or expired.
 */
export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const decoded: any = decodeToken(refreshToken);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ _id: decoded.id });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.refToken === refreshToken) {
            const { accessToken, refreshToken: newRefreshToken } = createUserTokens(user);
            user.refToken = newRefreshToken;
            await userRepository.save(user);

            return { accessToken, refreshToken: newRefreshToken };
        } else {
            throw new Error("Invalid refresh token");
        }
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};
