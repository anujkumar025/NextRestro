import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface RestaurantPayload {
    id: string;
    role: string;
    name: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied" });
        return; 
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as RestaurantPayload;
        (req as any).restaurant = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}
