"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const router = useRouter();

    const sendOtp = async () => {
        const response = await fetch("http://localhost:5000/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (response.ok) setStep(2);
    };

    const verifyOtpAndResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const response = await fetch("http://localhost:5000/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword }),
        });
        if (response.ok){
            alert("Password changed successfully");
            router.push('/account')
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Forget Password</h2>
            {step === 1 && (
                <div>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button onClick={sendOtp}>Send OTP</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button onClick={verifyOtpAndResetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
}