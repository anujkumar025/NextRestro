import React, { Suspense } from "react";

// Lazy load images for better performance
const LazyImage = React.lazy(() => import("./LazyImage"));

const RestroInfo = async () => {
    const restaurantId = "67d7ea5473ca82e8115923bd";

    const response = await fetch(`http://localhost:5000/api/${restaurantId}`);
    const data = await response.json();

    const navData = {
        logo: data.profilePicture || null,
        banner: data.bannerPicture || null,
        heading: data.name || "Explore Our Delicious Menu",
        phone: data.phone || "+91 8762340134",
        instagram: data.instagram || "7juned7",
        customizeTheme: data.customizeTheme,
        description:
            data.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        colors: data.colors || { dark: "#000000", light: "#ffffff" },
    };

    return (
        <div className="relative min-h-65 text-white w-full py-5 px-3 md:px-6 flex flex-col justify-between text-sm md:text-md lg:text-lg">
            <div className="absolute inset-0 w-full h-65 bg-black opacity-50 -z-10"></div>

            {/* Lazy load banner image */}
            <Suspense fallback={<div className="h-65 bg-gray-300"></div>}>
                <LazyImage src={navData.banner} alt="Banner" className="absolute inset-0 w-full h-65 object-cover -z-20" />
            </Suspense>

            <div className="flex w-full justify-between items-start">
                <div className="relative flex items-center h-10 w-10">
                    {/* Lazy load logo image */}
                    {navData.logo && (
                        <Suspense fallback={<div className="h-10 w-10 bg-gray-300 rounded-full"></div>}>
                            <LazyImage src={navData.logo} alt="Logo" className="h-10 w-10 object-contain rounded-full" />
                        </Suspense>
                    )}
                </div>

                <ul className="flex gap-6 md:gap-8 font-medium mt-2">
                    <li className="hover:text-gray-300 cursor-pointer relative">
                        <h2 className="text-sm md:text-md lg:text-lg text-mono font-light">{navData.phone}</h2>
                    </li>
                    <li className="hover:text-gray-300 cursor-pointer flex justify-center items-center">
                        <h2>
                            <a href={`https://www.instagram.com/${navData.instagram}`} target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </h2>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col text-center gap-4 px-2 items-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light font-mono w-fit">{navData.heading}</h2>
                <h2 className="text-sm md:text-md lg:text-lg font-light font-mono">{navData.description}</h2>
            </div>
        </div>
    );
};

export default RestroInfo;
