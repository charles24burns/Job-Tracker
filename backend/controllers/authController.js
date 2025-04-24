import { findUser } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_secret = process.env.JWT_SECRET || 'supersecretkey';

export const loginUser = async (req, res) => {
    const {email , password} = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    try {
        // check if the user exists
        const result = await findUser(email);
        const user = result.rows[0];

        if(!user) {
            return res.status(401).json({ error: "Invalid email"});
        }

        // compare passwords
        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log("password:", "{" + password + "}");
        console.log("user.password_hash:", "{"+ user.password_hash + "}");
        console.log("validPassword:", validPassword);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Gernate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_secret, {
            expiresIn: '7h',
        });

        // Respond with token or success
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

