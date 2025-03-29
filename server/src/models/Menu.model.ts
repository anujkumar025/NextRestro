import {Schema, model} from "mongoose";

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

export { Menu, IMenu };