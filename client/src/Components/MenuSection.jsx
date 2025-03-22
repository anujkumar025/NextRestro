"use client"; // Required for hooks in Next.js app directory

import { useRestaurant } from "@/Context/RestaurantContext";
import { useEffect, useState } from "react";
import AddFood from "./AddFood";
import FoodItem from "./FoodItem";
import SkeletonCard from "./Loders/SkeletonCard";


const MenuSection = () => {
    const { isAdmin, flag, setFlag, totalFood, setTotalFood } = useRestaurant();
    const [theme, setTheme] = useState("maroon");
    const [menuStyle, setMenuStyle] = useState("style-2");

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const restaurantId = "67d93b95dd42f9512a7b44d6"
    // Fetch restaurantId from localStorage on client-side


    // Fetch menu when restaurantId is available
    useEffect(() => {
        if (!restaurantId) return;
        console.log(totalFood)
        const fetchMenu = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/restaurant/${restaurantId}/menu`);

                if (!response.ok) {
                    throw new Error("Failed to fetch menu");
                }

                const data = await response.json();
                const updatedMenu = data.map((item) => ({
                    ...item,
                    image: item.image ? item.image : null,
                }));

                setMenuItems(updatedMenu);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [restaurantId, totalFood]);

    // Theme colors
    const themes = {
        light: { bg: "bg-white", cardBg: "bg-gray-200", text: "text-black", highlight: "bg-gray-400" },
        dark: { bg: "bg-black", cardBg: "bg-gray-800", text: "text-white", highlight: "bg-gray-600" },
        maroon: { bg: "bg-[#800020]", cardBg: "bg-[#FFD700]", text: "text-black", highlight: "bg-[#FFC107]" },
    };

    return (
        <div className={`p-6 ${themes[theme].bg} transition-all duration-300 font-light font-mono text-sm md:text-md lg:text-lg `}>
            {/* Filter Section */}
            <div className="mb-4 flex gap-4 flex-wrap">
                {["All", "Appetizers", "Main Course", "Desserts", "Drinks"].map((category) => (
                    <button key={category} className={`px-2 py-1 md:px-4 md:py-2 ${themes[theme].highlight} hover:bg-gray-300`}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="flex justify-between w-full items-center flex-wrap ">
                    <div onClick={() => setFlag((prev) => !prev)}
                        className={`px-2 md:px-4 py-1.5 md:py rounded-md border border-gray-500 shadow-md cursor-pointer ${theme === "light" ? "bg-gray-300 text-black" : ""} ${theme === "dark" ? "bg-gray-600 text-white" : ""} ${theme === "maroon" ? "bg-[#FFD700] text-black" : ""}`}
                    >
                        Add Food
                    </div>

                    {/* Theme Selector */}
                    <select
                        className={` px-2 md:px-4 py-1.5 rounded-md border border-gray-500 shadow-md cursor-pointer ${theme === "light" ? "bg-gray-300 text-black" : ""} ${theme === "dark" ? "bg-gray-600 text-white" : ""} ${theme === "maroon" ? "bg-[#FFD700] text-black" : ""}`}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light" className="font-mono font-light font-sm md:font-md lg:font-ld"> Light</option>
                        <option value="dark" className="font-mono font-light font-sm md:font-md lg:font-ld"> Dark</option>
                        <option value="maroon" className="font-mono font-light font-sm md:font-md lg:font-ld" > Maroon</option>
                    </select>

                    {/* Menu Style Selector */}
                    <select
                        className={`px-2 md:px-4 py-1.5 md:py rounded-md border border-gray-500 shadow-md cursor-pointer ${theme === "light" ? "bg-gray-300 text-black" : ""} ${theme === "dark" ? "bg-gray-600 text-white" : ""} ${theme === "maroon" ? "bg-[#FFD700] text-black" : ""}`
                        }
                        value={menuStyle}
                        onChange={(e) => setMenuStyle(e.target.value)}
                    >
                        <option value="style-1" className="font-mono font-light font-sm md:font-md lg:font-ld"> Grid</option>
                        <option value="style-2" className="font-mono font-light font-sm md:font-md lg:font-ld"> Stacked</option>
                    </select>
                </div>
            )}

            {/* Add Food Modal */}
            <AddFood flag={flag} setFlag={setFlag} />

            {/* Food Items Section */}
            <div className="my-4">
                {loading ? (
                    <div className={menuStyle === "style-1" ? "grid grid-cols-2 md:grid-cols-3 gap-3" : "flex flex-wrap gap-4"}>
                        {Array(6).fill("").map((_, index) => (
                            <SkeletonCard key={index} menuStyle={menuStyle} />
                        ))}
                    </div>
                ) : (
                    <div className={menuStyle === "style-1" ? "grid grid-cols-2 md:grid-cols-3 gap-3" : "flex flex-wrap gap-4"}>
                        {menuItems.map((item) => (
                            <FoodItem key={item._id} item={item} menuStyle={menuStyle} theme={themes[theme]} flag={flag} setFlag={setFlag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuSection;
