"use client"; // Needed for Next.js App Router

import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const RestaurantContext = createContext();

// Create a provider component
export const RestaurantProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [flag, setFlag] = useState(false)
    const [editFlag, setEditFlag] = useState(false)
    const [totalFood, setTotalFood] = useState(0)
    return (
        <RestaurantContext.Provider value={{ isAdmin, setIsAdmin, flag, setFlag, editFlag, setEditFlag, totalFood, setTotalFood }}>
            {children}
        </RestaurantContext.Provider>
    );
};

// Custom hook for easier access to the context
export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
