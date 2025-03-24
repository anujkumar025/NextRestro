"use client"; // Required for hooks in Next.js app directory

import { useRestaurant } from "@/Context/RestaurantContext";
import { useEffect, useState } from "react";
import AddFood from "./AddFood";
import FoodItem from "./FoodItem";
import SkeletonCard from "./Loders/SkeletonCard";


const MenuSection = () => {
    const { menuStyle, setMenuStyle, isAdmin, flag, setFlag, totalFood, setTotalFood, theme, setTheme, themes, customTheme, setCustomTheme } = useRestaurant();
    const [showColorPopup, setShowColorPopup] = useState(false);

    const [filteredItems, setFilteredItems] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleColorChange = (key, value) => {
        setCustomTheme((prev) => {
            const updatedTheme = { ...prev, [key]: value };
            return updatedTheme; // Ensures state updates
        });

        setTheme("custom"); // Ensure rerender when a custom theme is selected
    };
    const restaurantId = "67d93b95dd42f9512a7b44d6"

    // Fetch menu when restaurantId is available
    useEffect(() => {

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
                setFilteredItems(updatedMenu);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [restaurantId, totalFood]);
    const handleFilter = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredItems(menuItems);
        } else {
            setFilteredItems(menuItems.filter((item) => item.category === category));
        }
    };
    useEffect(() => {
        console.log("Theme changed to:", theme);
    }, [theme]);


    return (
        <div className={`p-2 md:p-4 transition-all duration-300 font-light font-mono text-xs md:text-md lg:text-lg `}
            style={theme === "custom" ? {
                backgroundColor: customTheme.bg,
                color: customTheme.text
            } : {}}
        >
            {/* Filter Section */}
            <div className="mb-4 flex gap-1 flex-wrap">
                {["All", "Appetizers", "Main Course", "Dessert", "Drinks"].map((category) => (
                    <button key={category}

                        onClick={() => handleFilter(category)}
                        className={`p-2 text-xs md:text-sm py-1 md:px-4 md:py-2 hover:bg-gray-300 rounded`}
                        style={theme === "custom" ? {
                            backgroundColor: customTheme.highlight,
                            color: customTheme.text
                        } : {}}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="flex relative justify-between  w-full items-center flex-wrap">
                    <div onClick={() => {

                        setFlag((prev) => !prev)
                    }}
                        className={`px-1 text-xs md:px-4 py-1 md:py rounded-sm border border-gray-500 shadow-sm cursor-pointer`}
                        style={theme === "custom" ? {
                            backgroundColor: customTheme.highlight,
                            color: customTheme.text
                        } : {}}
                    >
                        Add Food
                    </div>

                    {/* Theme Selector */}
                    <select
                        className="px-2 py-1 rounded-md border border-gray-500 shadow-md cursor-pointer"
                        value={theme}
                        onChange={(e) => {
                            setTheme(e.target.value);
                            console.log("Theme selected:", e.target.value);
                            if (e.target.value === "custom") {
                                setShowColorPopup(true);
                            }
                        }}

                        style={theme === "custom" ? {
                            backgroundColor: customTheme.highlight,
                            color: customTheme.text
                        } : {}}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="custom">Custom</option>
                    </select>
                    {showColorPopup && (

                        <div className="absolute left-25 top-0  py-1 px-2 bg-white z-100   rounded-md shadow-lg">
                            <h2 className="font-bold mb-2 text-sm">Customize Colors</h2>
                            <label className="block mb-1 flex w-full justify-between text-xs">Background: <input type="color" value={customTheme.bg} onChange={(e) => handleColorChange("bg", e.target.value)} className="md:ml-2 w-8 h-5 md:w-12 md:h-8 cursor-pointer" /></label>
                            <label className="block mb-1 flex w-full justify-between text-xs">Text: <input type="color" value={customTheme.text} onChange={(e) => handleColorChange("text", e.target.value)} className="md:ml-2 w-8 h-5 md:w-12 md:h-8 cursor-pointer" /></label>
                            <label className="block mb-1 flex w-full justify-between text-xs">Card: <input type="color" value={customTheme.cardBg} onChange={(e) => handleColorChange("cardBg", e.target.value)} className="md:ml-2 md:w-12 md:h-8  w-8 h-5 cursor-pointer" /></label>
                            <label className="block mb-1 flex w-full justify-between text-xs">Highlight: <input type="color" value={customTheme.highlight} onChange={(e) => handleColorChange("highlight", e.target.value)} className="md:ml-2 md:w-12 md:h-8  w-8 h-5 cursor-pointer" /></label>
                            <div className="mt-1 flex justify-end">
                                <button onClick={() => setShowColorPopup(false)} className="px-1.5 py-1 bg-blue-500 text-xs text-white rounded">Close</button>
                            </div>
                        </div>

                    )}
                    {/* Custom Theme Settings (Only Show if Custom is Selected) */}



                    {/* Menu Style Selector */}
                    <select
                        className={`px-1 md:px-4 py-1 md:py rounded-sm border border-gray-500 shadow-md cursor-pointer ${theme === "light" ? "bg-gray-300 text-black" : ""} ${theme === "dark" ? "bg-gray-600 text-white" : ""} ${theme === "maroon" ? "bg-[#FFD700] text-black" : ""}`
                        }
                        value={menuStyle}
                        onChange={(e) => setMenuStyle(e.target.value)}
                        style={theme === "custom" ? {
                            backgroundColor: customTheme.highlight,
                            color: customTheme.text
                        } : {}}
                    >
                        <option value="grid" className="font-mono font-light font-sm md:font-md lg:font-ld"> Grid</option>
                        <option value="stacked" className="font-mono font-light font-sm md:font-md lg:font-ld"> Stacked</option>
                    </select>
                </div>
            )}

            {/* Add Food Modal */}
            <AddFood flag={flag} setFlag={setFlag} />

            {/* Food Items Section */}
            <div className="my-4">
                {loading ? (
                    <div className={menuStyle === "style-1" ? "grid grid-cols-2 md:grid-cols-3 gap-1" : "flex flex-wrap gap-2"}>
                        {Array(6).fill("").map((_, index) => (
                            <SkeletonCard key={index} menuStyle={menuStyle} />
                        ))}
                    </div>
                ) : (
                    <div className={menuStyle === "style-1" ? "grid grid-cols-3 md:grid-cols-3 gap-2" : "flex flex-wrap gap-4"}>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <FoodItem key={item._id} item={item} menuStyle={menuStyle} theme={themes[theme]} flag={flag} setFlag={setFlag} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No items found for {selectedCategory}.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuSection;
