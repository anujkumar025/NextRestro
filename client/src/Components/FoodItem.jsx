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

                    className={`relative w-full rounded-md shadow-lg overflow-hidden ${theme.cardBg}`}>
                    {isAdmin && (
                        <div
                            className="">
                            <div
                                onClick={deleteMenuItem}
                                className="absolute z-20 right-6 top-1 flex items-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full pointer-events-auto"

                            >
                                <DeleteIcon className="text-red-500 w-2 h-2" />
                            </div>
                            <div
                                onClick={handleEditFood}
                                className="absolute z-20 right-1 top-1 flex items-center cursor-pointer justify-center p-1 bg-white border shadow-md rounded-full pointer-events-auto"
                            >
                                <EditIcon className="text-green-500 w-2 h-2" />
                            </div>
                        </div>
                    )}

                    {/* Image Section */}
                    <div className="relative w-full h-18">
                        <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />

                    </div>

                    {/* Food Info */}
                    <div className={`mb-2 px-1 flex justify-between items-center`}>
                        <h3 className={`text-xs md:text-md lg:text-lg font-mono ${theme.text}`}>{item.name}</h3>
                        <p className={`text-xs md:px-4 lg:px-8 md:text-md font-mono font-extrabold${theme.text}`}>{item.price}</p>
                    </div>
                </div>
            )
            }

            {/* Stacked Style (style-2) */}
            {
                menuStyle === "style-2" && (
                    <div className={`flex w-full shadow-lg p-1 rounded-sm  ${theme.cardBg}`}>
                        {/* Image */}

                        <div className="relative w-20 h-18">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />
                        </div>

                        {/* Food Details */}
                        <div className="flex-1 flex flex-col justify-start gap-2 ml-4">
                            <h3 className={`text-md font-bold md:text-md font-mono font-bold ${theme.text}`}>{item.name}</h3>
                            <p className={` md:text-md text-xs font-mono font-light ${theme.text}`}>₹ {item.price}</p>
                        </div>
                        {
                            isAdmin && <div className="relative">

                                <div className="absolute z-20 right-10 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full">
                                    <DeleteIcon
                                        onClick={deleteMenuItem}
                                        className="text-red-500 w-3 h-3" />
                                </div>
                                <div
                                    onClick={handleEditFood} className="absolute z-20 right-0 flex item-center cursor-pointer justify-center p-1 bg-white border rounded-full">
                                    <EditIcon className="text-green-500 w-3 h-3" />
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
