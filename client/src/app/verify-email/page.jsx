"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import URL from "@/lib/address";


const VerifyEmail = () => {
    const [message, setMessage] = useState("Verifying your email...");
    const searchParams = useSearchParams()
    const router = useRouter();
    
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${URL}/api/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                if (response.ok) {
                    setMessage(data.message);
                    router.push("/account");
                } else {
                    setMessage(data.message || "Failed to verify email.");
                }
            } catch (error) {
                setMessage("Something went wrong. Please try again later.");
                console.error("Error verifying email:", error);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;
