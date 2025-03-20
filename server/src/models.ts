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
    colors?: {
        dark: string,
        light: string,
        medium: string
    };
    menu?: Types.ObjectId[];
}

const restaurantSchema = new Schema<IRestaurant>({
    name: { type: String },
    description: { type: String },
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    phone: { type: String },
    instagram: { type: String },
    profilePicture: { type: String },
    bannerPicture: { type: String },
    colors: {type:{
        dark: {type: String},
        light: {type: String},
        medium: {type: String}
    }},
    menu: [{ type: Schema.Types.ObjectId, ref: "Menu" }]
}, { timestamps: true });

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

export { Menu, IMenu, Restaurant, IRestaurant };
    