import express from "express";
import { loginUser } from "../controllers/authController.js"; // Import the loginUser controller

const router = express.Router();

router.post("/login", loginUser); // Login user

export default router;