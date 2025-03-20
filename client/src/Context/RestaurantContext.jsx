"use client"; // Needed for Next.js App Router

import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const RestaurantContext = createContext();

// Create a provider component
export const RestaurantProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);


    return (
        <RestaurantContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </RestaurantContext.Provider>
    );
};

// Custom hook for easier access to the context
export const useRestaurant = () => {
    return useContext(RestaurantContext);
};
