'use client';

import React from "react";

const SkeletonCard = ({ menuStyle }) => {
    return (
        <>
            {/* Grid Style (style-1) */}
            {menuStyle === "style-1" && (
                <div className="relative w-full shadow-lg overflow-hidden bg-gray-300 animate-pulse">
                    <div className="relative w-full h-36 bg-gray-400"></div>
                    <div className="p-3 flex justify-between items-center">
                        <div className="h-5 w-24 bg-gray-500 rounded-md"></div>
                        <div className="h-5 w-12 bg-gray-500 rounded-md"></div>
                    </div>
                </div>
            )}

            {/* Stacked Style (style-2) */}
            {menuStyle === "style-2" && (
                <div className="flex w-full shadow-lg rounded-lg bg-gray-300 animate-pulse">
                    <div className="w-32 h-32 bg-gray-400"></div>
                    <div className="flex-1 flex flex-col justify-center ml-4">
                        <div className="h-5 w-32 bg-gray-500 rounded-md"></div>
                        <div className="h-5 w-16 bg-gray-500 rounded-md mt-2"></div>
                    </div>
                </div>
            )}

            {/* Zigzag Style (style-3) */}
            {menuStyle === "style-3" && (
                <div className="flex w-full shadow-lg rounded-md bg-gray-300 animate-pulse">
                    <div className="w-32 h-32 bg-gray-400"></div>
                    <div className="flex-1 mt-4">
                        <div className="h-5 w-32 bg-gray-500 rounded-md"></div>
                        <div className="h-5 w-16 bg-gray-500 rounded-md mt-2"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SkeletonCard;
