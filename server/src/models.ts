import {Schema, model, connect, Types} from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URI = process.env.DATABASE as string;

connect(DATABASE_URI)
    .then(() => {console.log("DB connected successfully✅")})
    .catch((err) => {console.log("DB did not connect❌\n", err)}) 


// Menu Schema
interface IMenu extends Document {
    name: string;
    description?: string;
    category: string;
    foodType?: string;
    price: number;
    image?: string;
    
}

const menuSchema = new Schema<IMenu>({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    foodType: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
}, { timestamps: true });

const Menu = model<IMenu>("Menu", menuSchema);

// Restaurant Schema 
interface IRestaurant extends Document {
    name?: string;
    description?: string;
    email: string;
    password: string;
    phone: string;
    instagram?: string;
    profilePicture?: string;
    bannerPicture?: string;
    menuType?:string;
    trialEndsAt?: Date;  // NEW FIELD: Stores trial expiration date
    isTrialActive?: () => boolean; // NEW METHOD: Checks trial status
    isVerified?: boolean,
    customizeTheme?: {
        bgColor: string;
        cardBgColor: string;
        textColor: string;
        highlightColor: string;
    };
    menu?: Types.ObjectId[];
}

const restaurantSchema = new Schema<IRestaurant>({
    name: { type: String },
    description: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    instagram: { type: String },
    profilePicture: { type: String },
    bannerPicture: { type: String },
    menuType:{type:String,default:"grid"},
    trialEndsAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 1-week trial
    isVerified: {type: Boolean, default: false},
    customizeTheme: {
        type: {
            bgColor: { type: String },
            cardBgColor: { type: String },
            textColor: { type: String },
            highlightColor: { type: String }
        }
    },
    menu: [{ type: Schema.Types.ObjectId, ref: "Menu" }]
}, { timestamps: true });

// Method to check if trial is still active
restaurantSchema.methods.isTrialActive = function () {
    return this.trialEndsAt && new Date() < this.trialEndsAt;
};

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

export { Menu, IMenu, Restaurant, IRestaurant };
    