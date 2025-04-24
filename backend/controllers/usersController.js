import Joi from 'joi';
import { findUser, createUserByID, updateUserByID, deleteUserByID } from "../models/usersModel.js";

// Define the schema for user validation
const userSchema = Joi.object({
    username: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password_hash: Joi.string().min(6).required()
});
const updateUserSchema = userSchema.fork(Object.keys(userSchema.describe().keys), (schema) => schema.optional()).min(1);

// Get a user
export const getUser = async (req, res) => {
    const email = req.params.email;
    console.log("getUser email:", email);
    console.log("getUser req.params:", req.params);
    console.log("getUser req.query.email:", req.query.email);
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    // Validate the email format
    const emailSchema = Joi.string().email();
    const { error } = emailSchema.validate(email);
    if (error) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    // Check if the user exists
    try {
        const result = await findUser(email);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    // Check if the user already exists
    const existingUser = await findUser(value.email);
    if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
    }
    // Create the user
    try {
        const result = await createUserByID(value);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID'});
    }
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    console.log("updateUser value:", value);
    try {
        const result = await updateUserByID(userId, value);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    console.log("deleteUser userId:", userId);
    try {
        const result = await deleteUserByID(userId);
        if (result.rowCount === 0) {
            return res.status(404).json( { error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
