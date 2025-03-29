import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-[#F0F8FF] min-h-screen w-full flex flex-col items-center">
            {/* Navbar */}
            <nav className="bg-white shadow-md py-4 px-6 flex justify-between w-full items-center">
                <h1 className="text-2xl font-bold text-[#4CAF4F]">RestroGram</h1>
                <Link href="/register">
                    <button className="bg-[#4CAF4F] text-white px-4 py-2 rounded-md shadow-md hover:opacity-90">
                        Register
                    </button>
                </Link>
            </nav>
            {/* Hero Section */}
            <header className="w-full text-center py-12 bg-gray-100">
                <div>

                    <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Platform</h1>
                    <p className="text-gray-700 mt-2">The best place to achieve your goals.</p>
                    <button className="mt-4 bg-[#4CAF4F] text-white py-2 px-6 rounded-lg hover:bg-green-700">
                        Get Started
                    </button>
                </div>

            </header>

            {/* Features Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-medium text-gray-700">Easy Menu Customization</h3>
                            <p className="text-gray-500 mt-2">Edit and manage your restaurant’s menu with a few clicks.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-medium text-gray-700">Theme Personalization</h3>
                            <p className="text-gray-500 mt-2">Customize your website theme to match your brand.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-medium text-gray-700">Seamless Order Management</h3>
                            <p className="text-gray-500 mt-2">Streamline order tracking and improve efficiency.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center py-12 bg-gray-100 w-full">
                <h2 className="text-2xl font-semibold text-gray-900">Join Us Today!</h2>
                <button className="mt-4 bg-[#4CAF4F] text-white py-2 px-6 rounded-lg hover:bg-green-700">
                    Sign Up Now
                </button>
            </section>

            {/* Footer */}
            <footer className="w-full text-center py-6 bg-gray-900 text-white mt-auto">
                <p>© {new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
