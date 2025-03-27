import { useState } from "react";
// Assuming you have an EditIcon component
import useRestroEditing from "@/utils/useRestroEditing"; // Import the hook
import EditIcon from "../utils/EditIcon"
import { useRestaurant } from "@/Context/RestaurantContext";

const RestroFooter = () => {

    const [isEditing, setIsEditing] = useState(false);
    const { isAdmin, setIsAdmin } = useRestaurant();

    const {
        navData,
        setNavData,
        editingField,
        setEditingField,
        headingRef,
        addressRef,
        descriptionRef,
        phoneRef,
        instagramRef,
        handleTextChange,
        handleImageChange,
        handleBannerChange,
        handleUpdate,
    } = useRestroEditing();


    return (
        <footer className="bg-gray-900 text-white py-6 px-4 md:px-8 relative">


            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Restaurant Info */}
                <div>

                    <div className="relative">
                        {editingField === "address" ? (
                            <input
                                ref={addressRef}
                                className="text-sm md:text-md lg:text-lg text-mono  font-light bg-transparent border-b border-gray-300 outline-none"
                                autoFocus
                                value={navData.address}
                                onChange={(e) => handleTextChange("address", e.target.value)}
                            />
                        ) : (
                            <h2 className="text-sm md:text-md lg:text-lg text-mono  font-light">{navData.address}</h2>
                        )}

                        {isAdmin && (
                            <div onClick={(e) => {
                                e.stopPropagation(); // Ensure event isn't blocked
                                setEditingField("address");

                            }}>


                                <div className=" absolute -top-2 left-30 z-20 flex item-center shadow-md cursor-pointer justify-center p-1 bg-white border rounded-full" >
                                    <EditIcon
                                        size={14}
                                        className="w-4 h-4 text-green-500 "

                                    />
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Details */}
                <div>
                    <h3 className="text-lg font-medium">Contact Us</h3>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="phone"
                                value={navData.phone || ""}
                                onChange={handleChange}
                                className="bg-gray-800 text-white p-2 rounded w-full mt-1"
                            />
                            <input
                                type="text"
                                name="instagram"
                                value={navData.instagram || ""}
                                onChange={handleChange}
                                className="bg-gray-800 text-white p-2 rounded w-full mt-1"
                            />
                        </>
                    ) : (
                        <>
                            <p className="text-sm mt-1">📞 {navData.phone || "+91 98765 43210"}</p>
                            <p className="text-sm">📷 {navData.instagram || "@deliciousbites"}</p>
                        </>
                    )}
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-medium">Follow Us</h3>
                    <ul className="flex gap-4 mt-2">
                        <li>
                            <a href={`https://instagram.com/${navData.instagram || "deliciousbites"}`} target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} {navData.heading || "Restaurant Name"}. All rights reserved.
            </div>
        </footer>
    );
};

export default RestroFooter;
