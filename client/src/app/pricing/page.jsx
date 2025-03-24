"use client";

import { useRouter } from "next/navigation";

const PricingPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Plan</h1>
            <p className="text-gray-600 mb-8">Start with a 14-day free trial, no credit card required.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800">Basic Plan</h2>
                    <p className="text-gray-600 mt-2">$9.99/month</p>
                    <ul className="mt-4 text-gray-700 space-y-2">
                        <li>✅ DigiMenu</li>
                        <li>✅ Customizable Page</li>
                        <li>✅ SEO Optimized</li>
                    </ul>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => router.push("/account")}
                    >
                        Start Free Trial
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800">Premium Plan</h2>
                    <p className="text-gray-600 mt-2">$19.99/month</p>
                    <ul className="mt-4 text-gray-700 space-y-2">
                        <li>✅ POS System</li>
                        <li>✅ Analytics Dashboard</li>
                        <li>✅ Everything in Basic</li>
                    </ul>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => router.push("/account")}
                    >
                        Coming Soon...
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
