'use client';

import { useState, useEffect } from 'react';
import { FaRegWindowClose } from 'react-icons/fa';

const AddFood = ({ flag, setFlag }) => {
    const [foodData, setFoodData] = useState(() => {
        const storedItem = localStorage.getItem("menuItem");
        return storedItem
            ? JSON.parse(storedItem)
            : {
                name: "",
                category: "",
                price: "",
                image: null,
                imageFile: null,
            };
    });

    console.log(flag)

    const [animate, setAnimate] = useState(false);
    const [slideIn, setSlideIn] = useState(false);

    useEffect(() => {
        if (flag) {
            setAnimate(true);
            setTimeout(() => setSlideIn(true), 100);
        } else {
            setSlideIn(false);
            setTimeout(() => setAnimate(false), 500);
        }
    }, [flag]);

    const handleChange = (e) => {
        setFoodData({ ...foodData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFoodData({ ...foodData, image: imageUrl, imageFile: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!foodData.name || !foodData.category || !foodData.price) {
            alert('Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', foodData.name);
        formData.append('category', foodData.category);
        formData.append('price', foodData.price);

        if (foodData.imageFile) {
            formData.append('image', foodData.imageFile);
        }

        try {
            const response = await fetch('http://localhost:5000/api/additem', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: formData,
            });

            const text = await response.text();
            const result = text ? JSON.parse(text) : null;

            if (response.ok) {
                setFoodData({ name: '', category: '', price: '', image: null, imageFile: null });
                setFlag(false);
            } else {
                alert(result?.message || 'Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Something went wrong!');
        }
    };

    useEffect(() => {
        localStorage.setItem("menuItem", JSON.stringify(foodData));
    }, [foodData]);
    if (!animate) return null;

    return (
        <div
            className={`fixed bottom-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out ${slideIn ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="bg-gray-900 text-white p-6 shadow-lg w-full max-w-full rounded-t-lg relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-yellow-500">Add New Food Item</h2>
                    <FaRegWindowClose
                        className="text-yellow-500 cursor-pointer hover:text-red-500 transition-colors duration-300"
                        onClick={() => setFlag(false)}
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Food Name"
                        value={foodData.name}
                        onChange={handleChange}
                        className="px-4 py-2 bg-gray-800 rounded-md"
                    />
                    <select
                        name="category"
                        value={foodData.category}
                        onChange={handleChange}
                        className="px-4 py-2 bg-gray-800 rounded-md text-white"
                    >
                        <option value="" disabled>
                            Select Category
                        </option>
                        <option value="Starter">Starter</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Fast Food">Fast Food</option>
                    </select>

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={foodData.price}
                        onChange={handleChange}
                        className="px-4 py-2 bg-gray-800 rounded-md appearance-none"
                        style={{ MozAppearance: 'textfield' }}
                    />

                    <div className="flex flex-col items-center">
                        <label htmlFor="imageUpload" className="cursor-pointer bg-yellow-500 text-black px-4 py-2 rounded-md">
                            Upload Image
                        </label>
                        <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        {foodData.image && (
                            <img src={foodData.image} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-md border" />
                        )}
                    </div>

                    <button type="submit" className="bg-yellow-500 px-4 py-2 rounded-md">
                        Add Food
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFood;
