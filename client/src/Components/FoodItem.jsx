'use client';

import { useRestaurant } from "@/Context/RestaurantContext";
import DeleteIcon from "@/utils/DeleteIcon";
import Image from "next/image";
import React from "react";
import axios from "axios";
import EditIcon from "../utils/EditIcon"
const FoodItem = ({ item, menuStyle, theme }) => {
    const { isAdmin, flag, setFlag, editFlag, setEditFlag, totalFood, setTotalFood } = useRestaurant();


    const deleteMenuItem = async () => {
        const itemId = item._id;
        const token = localStorage.getItem("authToken");
        console.log(token)
        try {
            const response = await axios.delete(`http://localhost:5000/api/menu/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Assuming authentication is needed
                },
            });
            setTotalFood((prev) => prev - 1);

            alert("Item deleted successfully!");
        } catch (error) {
            console.error("Error deleting item:", error);
            alert(error.response?.data?.message || "Failed to delete item");
        }
    };
    const handleEditFood = () => {
        setEditFlag(true)
        setFlag(true)
        localStorage.setItem("menuItem", JSON.stringify(item));
        console.log(localStorage.getItem("menuItem"))
    }
    return (
        <>
            {/* Grid Style (style-1) */}
            {menuStyle === "style-1" && (
                <div

                    className={`relative w-full m-1 shadow-lg overflow-hidden ${theme.cardBg}`}>
                    {isAdmin && (
                        <div
                            className="">
                            <div
                                onClick={deleteMenuItem}
                                className="absolute z-20 left-1 top-1 flex items-center shadow-md cursor-pointer justify-center p-2 bg-white border rounded-full pointer-events-auto"

                            >
                                <DeleteIcon className="text-red-500 w-4 h-4" />
                            </div>
                            <div
                                onClick={handleEditFood}
                                className="absolute z-20 right-1 top-1 flex items-center cursor-pointer justify-center p-2 bg-white border shadow-md rounded-full pointer-events-auto"
                            >
                                <EditIcon className="text-green-500 w-4 h-4" />
                            </div>
                        </div>
                    )}

                    {/* Image Section */}
                    <div className="relative w-full h-36">
                        <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-inherit"></div>
                    </div>

                    {/* Food Info */}
                    <div className={`px-1 mb-4 flex justify-between items-center `}>
                        <h3 className={`text-lg md:text-md lg:text-lg font-mono font-bold ${theme.text}`}>{item.name}</h3>
                        <p className={` px-2 md:px-4 lg:px-8 text-sm md:text-md font-mono font-light${theme.text}`}>{item.price}</p>
                    </div>
                </div>
            )
            }

            {/* Stacked Style (style-2) */}
            {
                menuStyle === "style-2" && (
                    <div className={`flex w-full shadow-lg p-2 rounded-lg ${theme.cardBg}`}>
                        {/* Image */}

                        <div className="relative w-32 h-32">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />
                        </div>

                        {/* Food Details */}
                        <div className="flex-1 flex flex-col justify-center ml-4">
                            <h3 className={`text-sm md:text-md font-mono font-light ${theme.text}`}>{item.name}</h3>
                            <p className={`text-sm md:text-md font-mono font-light ${theme.text}`}>{item.price}</p>
                        </div>
                        {
                            isAdmin && <div className="relative">

                                <div className="absolute z-20 right-10 flex item-center shadow-md cursor-pointer justify-center p-2 bg-white border rounded-full">
                                    <DeleteIcon className="text-red-500 w-4 h-4" />
                                </div>
                                <div className="absolute z-20 right-0 flex item-center cursor-pointer justify-center p-2 bg-white border rounded-full">
                                    <EditIcon className="text-green-500 w-4 h-4" />
                                </div>
                            </div>
                        }

                    </div>
                )
            }
        </>
    );
};

export default FoodItem;
