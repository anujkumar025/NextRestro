import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.model";
import { IMenu, Menu } from "../models/Menu.model";

export async function handleAddItem(req: Request, res: Response): Promise<any> {
    try {
            const restaurantId = (req as any).restaurant.id; // Extract restaurant ID from authenticated user
            const { name, description, category, foodType, price } = req.body;
            const image = req.file ? req.file.buffer.toString("base64") : undefined;
    
            // Validate required fields
            // if (!name || !category || !foodType || !price) {
            //     return res.status(400).json({ message: "Name, category, price, and availability are required" });
            // }
    
            // Validate image size
            if (req.file && req.file.size > 2 * 1024 * 1024) {
                return res.status(400).json({ message: "Image size should be less than 2MB" });
            }
    
            // Find the restaurant
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }
    
            // Create a new menu item
            const newItem = new Menu({
                name,
                description,
                category,
                foodType,
                price,
                image
            });
    
            // Save menu item
            await newItem.save();
            
            // Add menu item to restaurant's menu array
            if(restaurant.menu != undefined){
                restaurant.menu.push(newItem._id);
                await restaurant.save();
            }
    
            res.status(200).json({ message: "Item added successfully", newItem });
    
        } catch (err) {
            console.error("Error in /api/additem:", err);
            res.status(500).json({ message: "Internal Server Error❌", error: err });
        }
}

export async function handleModifyItem(req: Request, res: Response): Promise<any>{
    try {
        const { id } = req.params; // Get menu item ID from URL
        const { name, description, category, foodType, price} = req.body;

        // Validate input
        if (!name && !description && !category && !foodType && !price && !req.file) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        // Handle image upload
        const image = req.file ? req.file.buffer.toString("base64") : undefined;

        // Prepare update object
        const updateFields: any = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (category) updateFields.category = category;
        if (foodType) updateFields.foodType = foodType;
        if (price) updateFields.price = price;
        if (image) updateFields.image = image;

        // Find and update the menu item
        const updatedMenuItem = await Menu.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json({ message: "Menu item updated successfully", updatedMenuItem });

    } catch (error) {
        console.error("Error updating menu item:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export async function handleDeleteItem(req: Request, res: Response): Promise<any>{
    try {
        // console.log(req.params);
        const itemId  = req.params.id;
        const restaurantId = (req as any).restaurant.id;

        // Check if the dish exists
        const item = await Menu.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "item not found" });
        }

        // Remove dish from the menu collection
        await Menu.findByIdAndDelete(itemId);

        // Remove dish reference from the restaurant's menu array
        await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $pull: { menu: itemId } },
            { new: true }
        );

        res.status(200).json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export async function handleGetMenu(req: Request, res: Response): Promise<any>{
    try {
        const { id } = req.params;

        // Find the restaurant and populate the menu as an array of IMenu objects
        const restaurant = await Restaurant.findById(id).populate<{ menu: IMenu[] }>("menu").lean();

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found or no menu available" });
        }

        // Manually check trial expiration
        const isTrialActive = restaurant.trialEndsAt && new Date() < new Date(restaurant.trialEndsAt);
        if (!isTrialActive) {
            return res.status(403).json({ message: "Your free trial has ended. Please upgrade to continue." });
        }

        // Now TypeScript correctly recognizes menu items as IMenu objects
        const menuWithImages = restaurant.menu.map((item) => ({
            ...item,
            image: item.image ? `data:image/png;base64,${item.image}` : null,
        }));

        res.status(200).json(menuWithImages);
    } catch (error) {
        console.error("Error fetching restaurant menu:", error);
        res.status(500).json({ message: "Internal Server Error❌" });
    }
}
