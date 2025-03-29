'use client';

import { useRestaurant } from "@/Context/RestaurantContext";
import DeleteIcon from "@/utils/DeleteIcon";
import Image from "next/image";
import React from "react";
import axios from "axios";
import EditIcon from "../utils/EditIcon"
import URL from "@/lib/address";

const FoodItem = ({ item, menuStyle, theme }) => {
    const { isAdmin, flag, setFlag, editFlag, setEditFlag, totalFood, setTotalFood } = useRestaurant();


    const deleteMenuItem = async () => {
        const itemId = item._id;
        const token = localStorage.getItem("authToken");
        // console.log(itemId)
        try {
            const response = await axios.delete(`${URL}/menu/${itemId}`, {
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
        localStorage.setItem("menuItem", JSON.stringify(item));
        // console.log(localStorage.getItem("menuItem"))
        setEditFlag(true)
        setFlag(true)
    }
    const cardBg = theme === "custom" ? customTheme.card : theme.cardBg;
    const textColor = theme === "custom" ? customTheme.text : theme.text;

    return (
        <>
            {/* Grid Style (style-1) */}
            {menuStyle === "grid" && (
                <div

                    className={`relative w-full rounded-md shadow-lg overflow-hidden`}
                    style={{ backgroundColor: cardBg }}>
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
                    <div className="relative w-full h-24 md:h-30 lg:h-40 xl:h-50">
                        <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />

                    </div>

                    {/* Food Info */}
                    <div className={`mb-2 px-1 flex justify-between items-center`}>
                        <h3 className={`text-xs md:text-md lg:text-lg font-mono`}
                            style={{ color: textColor }}>{item.name}</h3>
                        <p className={`text-xs md:px-4 lg:px-8 md:text-md font-mono font-extrabold `}
                            style={{ color: textColor }}>₹{item.price}</p>
                    </div>
                </div>
            )
            }

            {/* Stacked Style (style-2) */}
            {
                menuStyle === "stacked" && (
                    <div className={`flex w-full shadow-lg p-1 rounded-sm`}
                        style={{ backgroundColor: cardBg }}>
                        {/* Image */}

                        <div className="relative w-20 h-18">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="" />
                        </div>

                        {/* Food Details */}
                        <div className="flex-1 flex flex-col justify-start gap-2 ml-4">
                            <h3 className={`text-md font-bold md:text-md font-mono font-bold`}
                                style={{ color: textColor }}
                            >{item.name}</h3>
                            <p className={` md:text-md text-xs font-mono font-light`}
                                style={{ color: textColor }}>₹{item.price}</p>
                        </div>
                        {
                            isAdmin && <div className="relative">

                                <div className="absolute z-20 right-5 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full"
                                    onClick={deleteMenuItem}>
                                    <DeleteIcon
                                        className="text-red-500 w-2 h-2" />
                                </div>
                                <div
                                    onClick={handleEditFood} className="absolute z-20 right-0 flex item-center cursor-pointer justify-center p-1 bg-white border rounded-full">
                                    <EditIcon className="text-green-500 w-2 h-2" />
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
