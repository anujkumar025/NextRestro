"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const sendOtp = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setSuccess("OTP sent successfully!");
                setStep(2);
            } else {
                setError("Failed to send OTP. Try again.");
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            if (response.ok) {
                setSuccess("Password changed successfully!");
                setTimeout(() => router.push("/account"), 2000);
            } else {
                setError("Failed to reset password. Try again.");
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-screen bg-[#800020] px-4">
            <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-[90%] max-w-[320px] text-white">
                <h2 className="text-2xl text-[#FFD700] font-bold text-center mb-4">Forgot Password</h2>

                {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mb-3">{success}</p>}

                {step === 1 && (
                    <>
                        <label className="block text-[#FFD700] mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                            required
                        />
                        <button
                            onClick={sendOtp}
                            className="w-full bg-[#FFD700] text-[#1a1a1a] font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div> : "Send OTP"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label className="block text-[#FFD700] mb-2">Enter OTP</label>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                            required
                        />
                        <label className="block text-[#FFD700] mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                            required
                        />
                        <label className="block text-[#FFD700] mb-2">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 mb-4 bg-white rounded-md focus:outline-none text-black"
                            required
                        />
                        <button
                            onClick={verifyOtpAndResetPassword}
                            className="w-full bg-[#FFD700] text-[#1a1a1a] font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div> : "Reset Password"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
