import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IMenu, IRestaurant, Menu, Restaurant } from "./models";
import jwt from "jsonwebtoken";
import { authenticate } from "./authorize";
import multer from "multer";
import cors from "cors";
import { config } from "dotenv";
import { sendVerificationEmail, sendResetPasswordEmail } from "./emailService";


config();
const PORT = 5000;
const app = express();
app.use(cors());

// Configure Multer for image upload (store in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
const jwtSecret = process.env.JWT_SECRET as string;
const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

interface UserPayload {
    id: string;
    role: string;
    username: string;
}

declare module "express" {
    interface Request {
        user?: UserPayload;
    }
}

// Cleanup function to remove expired OTPs
setInterval(() => {
    const now = Date.now();
    for (const [email, { expiresAt }] of otpStorage.entries()) {
        if (expiresAt < now) {
            otpStorage.delete(email);
            console.log(`OTP for ${email} expired and removed`);
        }
    }
}, 5 * 60 * 1000); // Runs every 5 minutes

// Simple test route
app.get("/api/", (req: Request, res: Response) => {
    res.json("hello!");
});


// Register Restaurant
app.post("/api/register", async (req: Request, res: Response): Promise<any> => {
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
});

app.post("/api/verify-email", async (req: Request, res: Response): Promise<any> => {
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
});

// Endpoint to send OTP
app.post("/api/send-otp", async (req: Request, res: Response): Promise<any> =>{
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
});

// Endpoint to reset password
app.post("/api/reset-password", async (req: Request, res: Response): Promise<any> => {
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
});

// Login Restaurant
app.post("/api/login", async (req: Request, res: Response): Promise<any> => {
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
});


// Update restaurant profile (excluding email, password, and menu)
app.put(
    "/api/update",
    authenticate,
    upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "bannerPicture", maxCount: 1 },
    ]),
    async (req: Request, res: Response): Promise<any> => {
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
);


// Add menu item to restaurant
app.put("/api/additem", authenticate, upload.single("image"), async (req: Request, res: Response): Promise<any> => {
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
});

app.put(
    "/api/menu/:id",
    authenticate,
    upload.single("image"), // Handle image upload
    async (req: Request, res: Response): Promise<any> => {
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
);

app.delete("/api/menu/:itemId", authenticate, async (req: Request, res: Response): Promise<any> => {
    try {
        const { itemId } = req.params;
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
});

// Get restaurant details without menu
app.get("/api/restaurant", authenticate, async (req: Request, res: Response): Promise<any> => {
    try {
        const restaurantId = (req as any).restaurant.id;
        // console.log(restaurantId);

        // Find the restaurant and exclude 'menu' and 'password' fields
        const restaurant = await Restaurant.findById(restaurantId).select("-menu -password").lean();

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
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
});

// Get restaurant details without menu
app.get("/api/:id", async (req: Request, res: Response): Promise<any> => {
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
});


// Get menu of a restaurant by restaurant ID
app.get("/api/restaurant/:id/menu", async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        // Find the restaurant and populate the menu as an array of IMenu objects
        const restaurant = await Restaurant.findById(id).populate<{ menu: IMenu[] }>("menu").lean();

        if (!restaurant || !restaurant.menu || restaurant.menu.length === 0) {
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
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}✅`);
});
