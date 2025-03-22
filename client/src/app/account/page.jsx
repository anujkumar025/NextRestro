"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";



import axios from "axios";
import Link from "next/link";
// import { RestaurantContexts } from "@/Contexts/RestaurantsContext";

const Register = () => {
    // const { restaurantId } = useContext(RestaurantContexts);
    const [newUser, setNewUser] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter(); // Next.js navigation hook

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data } = await axios.post("http://localhost:5001/api/register", formData);
            console.log(data);

            localStorage.setItem("authToken", data.token);
            setSuccess("Registration successful! 🎉");
            setFormData({ email: "", password: "" });

        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const { data } = await axios.post("http://localhost:5000/api/login", formData);
            console.log(data);

            localStorage.setItem("authToken", data.token);
            setSuccess("Login successful! 🎉");


            router.push("/restaurant-juned");

        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-screen bg-[#800020] px-4">
            <form
                onSubmit={handleRegister}
                className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-[90%] max-w-[320px] text-white"
            >
                <h2 className="text-2xl text-[#FFD700] font-bold text-center mb-4">DigiMenu</h2>

                {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-3">{success}</p>}

                <label className="block text-[#FFD700] mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                    required
                />

                <label className="block mb-2 text-[#FFD700]">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                    required
                />

                {newUser ? (
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full bg-[#FFD700] text-[#1a1a1a] font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 flex border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                        ) : (
                            "Log in"
                        )}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-[#FFD700] text-[#1a1a1a] font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                        ) : (
                            "Register"
                        )}
                    </button>
                )}

                <div className="flex items-center w-full my-4">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="px-3 text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                <div className="my-4 text-center">
                    <div>
                        {newUser ? "Don't have an account?" : "Have an account?"}
                        <span
                            onClick={() => setNewUser((prev) => !prev)}
                            className="text-[#FFD700] cursor-pointer px-1.5"
                        >
                            {newUser ? "Sign up" : "Log in"}
                        </span>
                    </div>
                    <Link href="/accounts/forgetPassword" className="cursor-pointer">
                        Forget Password?
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
