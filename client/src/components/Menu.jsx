"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import URL from "@/lib/address";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

export default function Menu({ restaurantId }) {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const form = useForm()

    useEffect(() => {
        console.log(restaurantId)
        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${URL}/api/restaurant/${restaurantId}/menu`);
                setMenu(response.data);
            } catch (err) {
                setError("Failed to load menu");
                console.error("Error fetching menu:", err);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchMenu();
        }
    }, [restaurantId]);

    const handleCardClick = (id) => {
        setSelectedItem(prev => (prev == id ? null: id));
    }

    const handleEditClick = (item) => {
        setEditItem(item);
        setInputValue(item.name);
    };

    function onSubmit(values) {
        console.log(values)
    }

    function handleCancel(values){
        values={};
    }

    if (loading) return <p>Loading menu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-3 w-full">
            <ul className="flex gap-5 flex-col">
                {menu.map((item) => (
                    <div key={item._id} className="flex items-center justify-center gap-5 w-full">
                        <div className="flex gap-5 items-center justify-center">
                            <div className="p-2 flex gap-5 items-center justify-center bg-red-400 hover:bg-red-500 rounded-full border">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                            <div className="p-2 flex gap-5 items-center justify-center hover:bg-[#C0C0C0] rounded-full border" onClick={() => handleEditClick(item)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                        </div>
                        <Card className="p-3 w-full" onClick={() => handleCardClick(item._id)}>
                            <li>
                                <div className="flex gap-5">
                                    {item.image && <img className="object-cover rounded-md" src={item.image} alt={item.name} width={100} />}
                                    <div>
                                        <h3>{item.name}</h3>
                                        <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: selectedItem === item._id ? 1 : 0, height: selectedItem === item._id ? "auto" : 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                        >
                                            <p className="text-gray-600">{item.description}</p>
                                        </motion.div>
                                        <p>Category: {item.category}</p>
                                        <p>Price: ₹{item.price}</p>
                                    </div>
                                </div>
                            </li>
                        </Card>
                    </div>
                ))}
            </ul>
            <Drawer open={!!editItem} onOpenChange={() => setEditItem(null)}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm p-4">
                        <DrawerHeader>
                            <DrawerTitle>Edit Item</DrawerTitle>
                            <DrawerDescription>Update the details of the menu item.</DrawerDescription>
                        </DrawerHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-4 grid grid-cols-2 gap-4">
                                    <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Biryani"  {...field} />
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="About Cuisine"  {...field} />
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="North Indian, Chinese etc"  {...field} />
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="foodType"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Food Type</FormLabel>
                                        <FormControl>
                                        <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Food Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="appetizer">Appetizer</SelectItem>
                                                <SelectItem value="mainCourse">Main Course</SelectItem>
                                                <SelectItem value="dessert">Dessert</SelectItem>
                                                <SelectItem value="beverage">Beverage</SelectItem>
                                            </SelectContent>
                                            </Select>
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="₹"  {...field} />
                                        </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit">Submit</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </div>
                            </form>
                        </Form>
                        <DrawerFooter>
                            {/* <Button onClick={() => setEditItem(null)}>Save</Button> */}
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
