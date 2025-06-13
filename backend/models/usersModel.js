import db from '../db/index.js';
import bcrypt from 'bcrypt';

console.log("✅ usersModel.js loading db from:");

export const findUser = async (identifier) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [identifier, identifier]);
        return result;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const createUserByID = async (userData) => {
    const { username, email, password_hash } = userData;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUserByID = async (userId, updateData) => {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const queryParams = [...values, userId];

    console.log("Updating user with ID:", userId);
    console.log("Update data:", );

    if (updateData.password_hash) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(updateData.password_hash, saltRounds);
        queryParams[queryParams.length - 2] = hashedPassword;
    }

    console.log("Query parameters:", queryParams);
    return db.query(
        `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
        queryParams
    );
};

export const deleteUserByID = async (userId) => {
    console.log("Deleting user with ID:", userId);
    return db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
};