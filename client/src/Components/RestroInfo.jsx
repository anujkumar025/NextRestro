"use client"; // Only needed for Next.js App Router (if using `app/` instead of `pages/`)

import { useState, useEffect, useRef, useContext } from "react";
import EditIcon from "../utils/EditIcon"
import { FaCamera, FaEdit, FaInstagram, FaUserShield, FaPen, FaSignOutAlt, FaSave } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { useRestaurant } from "@/Context/RestaurantContext";
import useRestroEditing from "@/utils/useRestroEditing";


const RestroInfo = () => {



    const {
        navData,
        setNavData,
        editingField,
        setEditingField,
        headingRef,
        descriptionRef,
        phoneRef,
        instagramRef,
        handleTextChange,
        handleImageChange,
        handleBannerChange,
        handleUpdate,
    } = useRestroEditing();

    const [showOptions, setShowOptions] = useState(false);
    const { isAdmin, setIsAdmin } = useRestaurant();
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".admin-toggle")) {
                setShowOptions(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.clear();
    };

    return (
        <>
            {/* Toggle Admin Mode Button */}
            <div className="fixed z-50 bottom-4 right-4 admin-toggle">
                {/* Floating Button */}
                <div
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white text-lg rounded-full cursor-pointer hover:bg-gray-700 transition shadow-lg"
                    title="Toggle Admin Mode"
                    onClick={() => setShowOptions((prev) => !prev)}
                >
                    <FaUserShield className="text-yellow-400" />
                </div>

                {/* Dropdown Menu */}
                {showOptions && (
                    <div className="absolute bottom-16 right-0 bg-white shadow-lg rounded-md py-2 w-32">
                        <button
                            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 w-full"
                            onClick={() => {
                                setEditing((prev) => !prev);
                                setIsAdmin(!isAdmin);
                            }}
                        >
                            {editing ? (<div className="flex items-center" onClick={handleUpdate}>
                                <FaSave className="mr-2" />
                                Save
                            </div>)
                                : (<div className="flex items-center" ><FaEdit className="mr-2" />Edit</div>)}

                        </button>
                        <button
                            className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-200 w-full"
                            onClick={() => {
                                handleLogout();
                                setShowOptions(false); // Close menu only on logout
                            }}
                        >
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                )}
            </div>


            <div className="relative min-h-65 text-white w-full py-5 px-3 md:px-6 flex flex-col justify-between text-sm md:text-md lg:text-lg">
                <div className="absolute inset-0 w-full h-65 bg-black opacity-50 -z-10"></div>
                <img className="absolute inset-0 w-full h-65 object-cover -z-20" src={navData.banner} alt="banner" />

                <div className="flex w-full justify-between items-start ">
                    {/* Logo (Editable) */}
                    <div className="relative flex items-center h-10 w-10">
                        <label htmlFor="logoUpload" className="cursor-pointer">
                            {navData.logo ? (
                                <img src={navData.logo} alt="Logo" className="h-10 w-10 object-contain rounded-full" />
                            ) : (
                                <span className="flex justify-center items-center h-10 w-10 bg-gray-300 rounded-full">
                                    <FaCamera className="text-gray-500" />
                                </span>
                            )}
                        </label>
                        {isAdmin && <input type="file" accept="image/*" id="logoUpload" className="hidden" onChange={handleImageChange} />}
                    </div>

                    {/* Contact Info */}
                    <ul className="flex gap-6 md:gap-8 font-medium mt-2">
                        <li className="hover:text-gray-300 cursor-pointer relative">
                            <div>
                                {editingField === "phone" ? (
                                    <input
                                        ref={phoneRef}
                                        className="text-sm md:text-md lg:text-lg text-mono  font-light bg-transparent border-b border-gray-300 outline-none"
                                        autoFocus
                                        value={navData.phone}
                                        onChange={(e) => handleTextChange("phone", e.target.value)}
                                    />
                                ) : (
                                    <h2 className="text-sm md:text-md lg:text-lg text-mono  font-light">{navData.phone}</h2>
                                )}

                                {isAdmin && (
                                    <div onClick={(e) => {
                                        e.stopPropagation(); // Ensure event isn't blocked
                                        setEditingField("phone");

                                    }}>
                                        <div className="absolute -top-2 -right-3 z-20 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full" >

                                            <EditIcon
                                                size={14}
                                                className="w-2 h-2 text-green-500 "

                                            />
                                        </div>

                                    </div>
                                )}
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
                                    <h2 className="">
                                        <a href={`https://www.instagram.com/${navData.instagram}`} target="_blank" rel="noopener noreferrer">
                                            <FaInstagram />

                                        </a>
                                    </h2>


                                )}
                                {isAdmin && (
                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingField("instagram");

                                    }}
                                        className="absolute top-5 -right-0 z-20 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full"
                                    >

                                        <EditIcon
                                            size={14}
                                            className="w-2 h-2 text-green-500"

                                        />

                                    </div>
                                )}
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Editable Heading & Paragraph */}
                <div className="flex flex-col text-center  gap-4 px-2 items-center ">
                    {isAdmin && (
                        <div className="flex justify-center items-center mt-4">
                            <label htmlFor="bannerUpload" className="cursor-pointer absolute px-4 mb-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                                <p className="text-sm md:text-md lg:text-lg font-mono font-light">

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
                                className="text-2xl md:text-3xl lg:text-4xl w-fit  font-light font-mono bg-transparent border-b border-gray-300 outline-none"
                                autoFocus
                                value={navData.heading}
                                onChange={(e) => handleTextChange("heading", e.target.value)}
                            />
                        ) : (
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light font-mono  w-fit">{navData.heading}</h2>
                        )}
                        {isAdmin && (
                            <div onClick={(e) => {
                                e.stopPropagation(); // Ensure event isn't blocked
                                setEditingField("heading");

                            }}
                                className="absolute -top-2 -right-3 z-20 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full"
                            >

                                <EditIcon
                                    size={12}
                                    className="text-green-500 h-2 w-2"

                                />
                            </div>
                        )}
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
                            <h2 className="text-sm md:text-md lg:text-lg font-light font-mono">{navData.description}</h2>
                        )}
                        {isAdmin && (
                            <div onClick={(e) => {
                                e.stopPropagation(); // Ensure event isn't blocked
                                setEditingField("description");

                            }}
                                className="absolute -top-2 -right-3 z-20 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full">

                                <EditIcon
                                    size={12}
                                    className="w-2 h-2 text-green-500"

                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestroInfo;  