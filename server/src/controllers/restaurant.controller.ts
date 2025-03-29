import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.model";

export async function handleRestroUpdate(req: Request, res: Response): Promise<any>{
    try {
        const restaurantId = (req as any).restaurant.id;

        let { name, description, phone, instagram ,customizeTheme,menuType} = req.body;
         if (typeof customizeTheme === "string") {
            try {
                customizeTheme = JSON.parse(customizeTheme);
            } catch (error) {
                return res.status(400).json({ message: "Invalid customizeTheme format" });
            }
        }
        // console.log(menuType)
       
        // Handle image uploads
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const profilePicture = files?.profilePicture?.[0]?.buffer.toString("base64");
        const bannerPicture = files?.bannerPicture?.[0]?.buffer.toString("base64");

        // Update restaurant profile
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            {
                name,
                description,
                phone,
                instagram,
                menuType,
                customizeTheme, // Now properly formatted as an object
                ...(profilePicture && { profilePicture }), // Update only if new image is provided
                ...(bannerPicture && { bannerPicture }),
            },
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", updatedRestaurant });

    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server error❌", error });
    }
}

export async function handleRestroInfo(req: Request, res: Response): Promise<any>{
    try {
        const { id } = req.params;
        // console.log(id);

        // Find the restaurant and exclude 'menu' and 'password' fields
        const restaurant = await Restaurant.findById(id).select("-menu -password").lean();

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Manually check trial expiration
        const isTrialActive = restaurant.trialEndsAt && new Date() < new Date(restaurant.trialEndsAt);
        if (!isTrialActive) {
            return res.status(403).json({ message: "Your free trial has ended. Please upgrade to continue." });
        }

        // Convert images to Base64 format if they exist
        const restaurantWithImages = {
            ...restaurant,
            profilePicture: restaurant.profilePicture
                ? `data:image/png;base64,${restaurant.profilePicture}`
                : null,
            bannerPicture: restaurant.bannerPicture
                ? `data:image/png;base64,${restaurant.bannerPicture}`
                : null,
        };

        res.status(200).json(restaurantWithImages);
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: "Internal Server Error❌" });
    }
}