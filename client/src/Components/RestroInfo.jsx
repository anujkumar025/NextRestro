"use client"; // Only needed for Next.js App Router (if using `app/` instead of `pages/`)

import { useState, useEffect, useRef } from "react";

import { FaCamera, FaEdit, FaInstagram, FaUserShield, FaPen } from "react-icons/fa";
import { useRestaurant } from "@/Context/RestaurantContext";
import axios from "axios"; // Import Axios
// import { RestaurantContexts } from "../Contexts/RestaurantsContext";

const RestroInfo = () => {
    // const { restaurantId } = useContext(RestaurantContexts);
    const { isAdmin, setIsAdmin } = useRestaurant();
    const restaurantId = "67d93b95dd42f9512a7b44d6"
    const [navData, setNavData] = useState({
        logo: null,
        logoFile: null,
        banner: null,
        bannerFile: null,
        phone: null,
        instagram: null,
        heading: null,
        description: null,
        colors: { dark: "#000000", light: "#ffffff" },
    });

    const [editingField, setEditingField] = useState(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const phoneRef = useRef(null);
    const instagramRef = useRef(null);

    // Fetch API Data (Next.js prefers environment variables for API URLs)
    useEffect(() => {
        if (!restaurantId) return;

        const fetchNavData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/restaurant`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                localStorage.setItem("restaurantId", data._id);

                setNavData({
                    logo: data.profilePicture ? `data:image/png;base64,${data.profilePicture}` : null,
                    banner: data.bannerPicture ? `data:image/png;base64,${data.bannerPicture}` : null,
                    heading: data.name || "Explore Our Delicious Menu",
                    phone: data.phone || "+91 8762340134",
                    instagram: data.instagram || "7juned7",
                    description: data.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
                    colors: data.colors || { dark: "#000000", light: "#ffffff" },
                });
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };

        fetchNavData();
    }, []);


    // Click outside to stop editing
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (editingField === "heading" && headingRef.current && !headingRef.current.contains(event.target)) ||
                (editingField === "description" && descriptionRef.current && !descriptionRef.current.contains(event.target)) ||
                (editingField === "phone" && phoneRef.current && !phoneRef.current.contains(event.target)) ||
                (editingField === "instagram" && instagramRef.current && !instagramRef.current.contains(event.target))
            ) {
                setEditingField(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingField]);





    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("name", navData.heading);
        formData.append("description", navData.description);
        formData.append("phone", navData.phone);
        formData.append("instagram", navData.instagram);

        // Append colors
        Object.keys(navData.colors).forEach((key) => {
            formData.append(`colors.${key}`, navData.colors[key]);
        });

        // Append images if changed
        if (navData.logoFile) formData.append("profilePicture", navData.logoFile);
        if (navData.bannerFile) formData.append("bannerPicture", navData.bannerFile);

        try {
            const { data } = await axios.put("http://localhost:5001/api/update", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "multipart/form-data", // Required for FormData
                },
            });

            // Create updated navData
            console.log("updated")
            alert("updated")




        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };


    // Click outside to stop editing
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (editingField === "heading" && headingRef.current && !headingRef.current.contains(event.target)) ||
                (editingField === "description" && descriptionRef.current && !descriptionRef.current.contains(event.target)) ||
                (editingField === "phone" && phoneRef.current && !phoneRef.current.contains(event.target)) ||
                (editingField === "instagram" && instagramRef.current && !instagramRef.current.contains(event.target))
            ) {
                setEditingField(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingField]);
    // Handle text updates
    const handleTextChange = (key, value) => {
        setNavData((prev) => ({ ...prev, [key]: value }));
    };
    // Handle image uploads (logo)
    const handleImageChange = (e) => {
        if (!isAdmin) return; // Only allow admin to update
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNavData((prev) => ({
                    ...prev,
                    logo: reader.result,
                    logoFile: file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    // Handle banner image upload
    const handleBannerChange = (e) => {
        if (!isAdmin) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNavData((prev) => ({
                    ...prev,
                    banner: reader.result,
                    bannerFile: file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (editingField === "heading" && headingRef.current && !headingRef.current.contains(event.target)) ||
                (editingField === "description" && paragraphRef.current && !paragraphRef.current.contains(event.target)) ||
                (editingField === "phone" && phoneRef.current && !phoneRef.current.contains(event.target)) ||
                (editingField === "instagram" && instagramRef.current && !instagramRef.current.contains(event.target))
            ) {
                setTimeout(() => setEditingField(null), 100); // Small delay to prevent flickering
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingField]);

    // ✅ API call to update restaurant profile

    useEffect(() => {
        if (isAdmin) {
            localStorage.setItem("navData", JSON.stringify(navData));
        }


    }, [navData, isAdmin]);

    return (
        <>
            {/* Toggle Admin Mode Button */}
            <div
                className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-gray-800 text-white text-lg rounded-full cursor-pointer hover:bg-gray-700 transition shadow-lg"
                title="Toggle Admin Mode"
                onClick={() => setIsAdmin((prev) => !prev)}
            >
                {isAdmin ? <FaUserShield onClick={handleUpdate} className="text-yellow-400" /> : <FaPen className="text-blue-400" />}
            </div>


            <div className="relative min-h-65 text-white w-full py-5 px-3 md:px-6 flex flex-col justify-between">
                <div className="absolute inset-0 w-full h-65 bg-black opacity-50 -z-10"></div>
                <img className="absolute inset-0 w-full h-65 object-cover -z-20" src={navData.banner} alt="banner" />

                <div className="flex w-full justify-between items-start">
                    {/* Logo (Editable) */}
                    <div className="relative flex items-center h-20 w-20">
                        <label htmlFor="logoUpload" className="cursor-pointer">
                            {navData.logo ? (
                                <img src={navData.logo} alt="Logo" className="h-20 w-20 object-contain rounded-full" />
                            ) : (
                                <span className="flex justify-center items-center h-20 w-20 bg-gray-300 rounded-full">
                                    <FaCamera className="text-gray-500" />
                                </span>
                            )}
                        </label>
                        {isAdmin && <input type="file" accept="image/*" id="logoUpload" className="hidden" onChange={handleImageChange} />}
                    </div>

                    {/* Contact Info */}
                    <ul className="flex gap-4 md:gap-6 font-medium mt-2">
                        <li className="hover:text-gray-300 cursor-pointer relative">
                            <div>
                                {editingField === "phone" ? (
                                    <input
                                        ref={phoneRef}
                                        className="text-sm md:text-xl text-mono  font-light bg-transparent border-b border-gray-300 outline-none"
                                        autoFocus
                                        value={navData.phone}
                                        onChange={(e) => handleTextChange("phone", e.target.value)}
                                    />
                                ) : (
                                    <h2 className="text-sm md:text-xl text-mono  font-light">{navData.phone}</h2>
                                )}
                                {isAdmin && <FaEdit className="absolute text-[8px] -top-2 -right-4 text-gray-300 cursor-pointer" onClick={() => setEditingField("phone")} />}
                            </div>
                        </li>
                        <li className="hover:text-gray-300 cursor-pointer flex justify-center items-center">
                            <div>
                                {editingField === "instagram" ? (
                                    <input
                                        ref={instagramRef}
                                        className="text-sm md:text-xl font-mono  font-light bg-transparent border-b border-gray-300 outline-none"
                                        autoFocus
                                        value={navData.instagram}
                                        onChange={(e) => handleTextChange("instagram", e.target.value)}
                                    />
                                ) : (
                                    <h2 className="text-sm md:text-xl font-mono  font-light flex items-center gap-2">
                                        <a href={`https://www.instagram.com/${navData.instagram}`} target="_blank" rel="noopener noreferrer">
                                            <FaInstagram />

                                        </a>
                                    </h2>
                                )}
                                {isAdmin && <FaEdit className="absolute text-[8px] top-5 right-1 text-gray-300 cursor-pointer" onClick={() => setEditingField("instagram")} />}
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Editable Heading & Paragraph */}
                <div className="flex flex-col text-center  gap-4 px-2 items-center ">
                    {isAdmin && (
                        <div className="flex justify-center items-center mt-4">
                            <label htmlFor="bannerUpload" className="cursor-pointer absolute px-4 mb-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                                <p className="text-sm md:text-xl font-mono font-light">

                                    Change Background
                                </p>
                            </label>
                            <input type="file" accept="image/*" id="bannerUpload" className="hidden" onChange={handleBannerChange} />
                        </div>
                    )}

                    {/* Editable Heading */}
                    <div className=" relative justify-center items-center gap-4">
                        {editingField === "heading" ? (
                            <input
                                ref={headingRef}
                                className="text-2xl w-fit  font-light font-mono bg-transparent border-b border-gray-300 outline-none"
                                autoFocus
                                value={navData.heading}
                                onChange={(e) => handleTextChange("heading", e.target.value)}
                            />
                        ) : (
                            <h2 className="text-2xl font-light font-mono  w-fit">{navData.heading}</h2>
                        )}
                        {isAdmin && <FaEdit className="absolute text-[8px] -top-2 -right-4 text-gray-300 cursor-pointer" onClick={() => setEditingField("heading")} />}
                    </div>
                    <div className="flex w-fit relative justify-center items-center gap-4">
                        {editingField === "description" ? (
                            <input
                                ref={descriptionRef}
                                className="text-md font-light font-mono bg-transparent border-b border-gray-300 outline-none"
                                autoFocus
                                value={navData.description}
                                onChange={(e) => handleTextChange("description", e.target.value)}
                            />
                        ) : (
                            <h2 className="text-sm font-light font-mono">{navData.description}</h2>
                        )}
                        {isAdmin && <FaEdit className="absolute text-[8px] -top-2 -right-4 text-gray-300 cursor-pointer" onClick={() => setEditingField("description")} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestroInfo;  