import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRestaurant } from "@/Context/RestaurantContext";

const useRestroEditing = () => {
    const { menuStyle, setMenuStyle, themes, setCustomTheme } = useRestaurant();
    console.log(menuStyle)
    const [navData, setNavData] = useState({
        logo: null,
        logoFile: null,
        banner: null,
        bannerFile: null,
        phone: null,
        instagram: null,
        heading: null,
        description: null,
        menuStyle: null,
        customizeTheme: null,
        address: null,
        facebook: null,
        twitter: null,
        linkedin: null,
        footerText: null,
    });
    const addressRef = useRef(null);
    const footerRef = useRef(null);
    const [editingField, setEditingField] = useState(null);
    const headingRef = useRef(null);
    const descriptionRef = useRef(null);
    const phoneRef = useRef(null);
    const instagramRef = useRef(null);

    useEffect(() => {

        const fetchNavData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/restaurant`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
                });

                localStorage.setItem("restaurantId", data._id);
                setNavData({
                    logo: data.profilePicture || null,
                    banner: data.bannerPicture || null,
                    heading: data.name || "Explore Our Delicious Menu",
                    phone: data.phone || "+91 8762340134",
                    instagram: data.instagram || "7juned7",
                    customizeTheme: data.customizeTheme,
                    menuType: data.menuType,
                    description: data.description || "Lorem ipsum...",
                    colors: data.colors || { dark: "#000000", light: "#ffffff" },
                });
                console.log(data)
                if (data.customizeTheme) {
                    setCustomTheme((prevTheme) => ({
                        ...prevTheme,
                        ...data.customizeTheme,
                    }));
                }
                setMenuStyle(data.menuType);
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };
        fetchNavData();
    }, [setCustomTheme, setMenuStyle]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (editingField === "heading" && headingRef.current && !headingRef.current.contains(event.target)) ||
                (editingField === "description" && descriptionRef.current && !descriptionRef.current.contains(event.target)) ||
                (editingField === "phone" && phoneRef.current && !phoneRef.current.contains(event.target)) ||
                (editingField === "instagram" && instagramRef.current && !instagramRef.current.contains(event.target)) ||
                (editingField === "address" && addressRef.current && !addressRef.current.contains(event.target)) ||
                (editingField === "footerText" && footerRef.current && !footerRef.current.contains(event.target))
            ) {
                setEditingField(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editingField]);

    const handleTextChange = (key, value) => {
        setNavData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageChange = (e) => {
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

    const handleBannerChange = (e) => {
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
    console.log(menuStyle)
    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("name", navData.heading);
        formData.append("description", navData.description);
        formData.append("phone", navData.phone);
        formData.append("instagram", navData.instagram);
        formData.append("customizeTheme", JSON.stringify(themes.custom));
        formData.append("menuType", menuStyle);
        formData.append("address", navData.address);
        formData.append("facebook", navData.facebook);
        formData.append("twitter", navData.twitter);
        formData.append("linkedin", navData.linkedin);
        formData.append("footerText", navData.footerText);

        if (navData.logoFile) formData.append("profilePicture", navData.logoFile);
        if (navData.bannerFile) formData.append("bannerPicture", navData.bannerFile);

        try {
            const { data } = await axios.put("http://localhost:5000/api/update", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMenuStyle(menuStyle)

        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        }
    };

    return {
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

        addressRef,
        footerRef,

    };
};

export default useRestroEditing;
