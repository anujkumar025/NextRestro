"use client"; // Needed for Next.js App Router

import { createContext, useState, useEffect, useContext } from "react";


// Create the context
const RestaurantContext = createContext();

// Create a provider component
export const RestaurantProvider = ({ children }) => {
    const [menuStyle, setMenuStyle] = useState("grid")
    const [theme, setTheme] = useState("custom");
    const [customTheme, setCustomTheme] = useState({
        bg: "#ffffff",
        cardBg: "#f5f5f5",
        text: "#000000",
        highlight: "#cccccc",
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [flag, setFlag] = useState(false)
    const [editFlag, setEditFlag] = useState(false)
    const [totalFood, setTotalFood] = useState(0)
    useEffect(() => {
        if (typeof window !== "undefined") { // Ensure it runs only in the browser
            const savedTheme = localStorage.getItem("theme");
            const savedCustomTheme = localStorage.getItem("customTheme");

            if (savedTheme) setTheme(savedTheme);
            if (savedCustomTheme) setCustomTheme(JSON.parse(savedCustomTheme));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme);
            localStorage.setItem("customTheme", JSON.stringify(customTheme));
        }
    }, [theme, customTheme]);
    useEffect(() => {
        // console.log("Updated Custom Theme:", customTheme);
    }, [customTheme]);

    const themes = {
        light: { bg: "#ffffff", cardBg: "#f5f5f5", text: "#000000", highlight: "#cccccc" },
        dark: { bg: "#000000", cardBg: "#333333", text: "#ffffff", highlight: "#666666" },
        custom: customTheme, // User-defined colors
    };



    return (
        <RestaurantContext.Provider value={{ isAdmin, setIsAdmin, flag, setFlag, editFlag, setEditFlag, totalFood, setTotalFood, theme, setTheme, themes, customTheme, setCustomTheme, menuStyle, setMenuStyle }}>
            {children}
        </RestaurantContext.Provider>
    );
};

// Custom hook for easier access to the context
export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
