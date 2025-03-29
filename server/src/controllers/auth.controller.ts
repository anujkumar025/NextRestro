import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/email.service";
import otpStorage from "../utils/otpStorage";


config();

const jwtSecret = process.env.JWT_SECRET as string;

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

export async function handleRegister (req: Request, res: Response): Promise<any> {
    try {
        const { email, password } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already registered!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new restaurant
        const newRestaurant = new Restaurant({
            email,
            password: hashedPassword,
            isVerified: false, // Add a verification flag
        });

        await newRestaurant.save();

        // Generate verification token
        const verificationToken = jwt.sign(
            { id: newRestaurant._id, email },
            jwtSecret,
            { expiresIn: "1d" }
        );

        // Send verification email
        await sendVerificationEmail(newRestaurant.email, verificationToken);

        res.status(201).json({ message: "Restaurant registered successfully. Please verify your email." });

    } catch (error) {
        console.error("Error registering restaurant:", error);
        res.status(500).json({ message: "Server error❌", error });
    }
}

export async function handleVerifyEmail(req: Request, res: Response): Promise<any>{
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }

        // Verify JWT Token
        const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string };

        if (!decoded) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Find the restaurant in the database
        const restaurant = await Restaurant.findById(decoded.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        if (restaurant.isVerified) {
            return res.status(200).json({ message: "Email already verified." });
        }

        // Update restaurant's verification status
        restaurant.isVerified = true;
        restaurant.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await restaurant.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in!" });

    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Server error❌", error });
    }
}

export async function handleSendOTP(req: Request, res: Response): Promise<any>{
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await Restaurant.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        otpStorage.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // Expires in 10 mins

        await sendResetPasswordEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

export async function handleResetPassword(req: Request, res: Response): Promise<any>{
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: "All fields are required" });

        const storedOtp = otpStorage.get(email);
        if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await Restaurant.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        otpStorage.delete(email); // Remove OTP after successful password reset
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

export async function handleLogin(req: Request, res: Response): Promise<any>{
    try {
        const { email, password } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, restaurant.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: restaurant._id, name: restaurant.name },
            jwtSecret,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Login successful", token, id: restaurant._id });
    
    } catch (error) {
        res.status(500).json({ message: "Server error❌", error });
    }
}