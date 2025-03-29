"use client"
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here (e.g., sending to an API)
  };
  return (
    <div className="bg-[#F0F8FF] min-h-screen w-full flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold text-[#4CAF4F]">RestroGram</h1>
        <Link href="/register" className="flex gap-2" >

          <button className="bg-[#4CAF4F] text-white font-mono px-4 py-2 rounded-sm shadow-md cursor-pointer hover:opacity-90">
            Lets's talk
          </button>
          <button className="border-[#4CAF4F] border-2  text-[#4CAF4F] hover:text-white hover:bg-[#4CAF4F] cursor-pointer font-mono px-4 py-2 rounded-sm shadow-md hover:opacity-90">
            Get a Demo
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="w-full flex flex-col md:flex-row items-center justify-center text-center md:text-left py-14 bg-gray-100 px-6">
        <div className="md:w-1/2">
          <h1 className="text-2xl font-mono md:text-3xl font-bold text-gray-900">Take Control in Your hand</h1>
          <p className="text-gray-700 font-bold font mono mt-2">Serve Better Grow Better.</p>
          <p className="text-gray-700 font-lightbold font mono mt-2">Say goodbye to paper menus! Restrogram lets customers scan a QR code and instantly view a restaurant’s digital menu, offering a fast and interactive dining experience.

          </p>
          <button className="mt-4 bg-[#4CAF4F] cursor-pointer font-mono text-white py-2 px-6 rounded-sm hover:bg-green-700">
            Try For Free
          </button>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <video className="w-full max-w-md rounded-sm shadow-lg" autoPlay loop muted>
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 w-full bg-gray-50 border-2 border-[#4caf4f]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">What we do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-green-100 rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-700">Easy Customization</h3>
              <p className="text-gray-600 mt-2">Edit and manage your restaurant’s menu with a few clicks.
                Customize your website theme to match your brand.</p>

            </div>
            <div className="p-6 bg-purple-100 rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-700">Online Presence & SEO</h3>
              <p className="text-gray-600 mt-2">Boost your online presence with SEO-optimized pages.</p>
            </div>
            <div className="p-6 bg-yellow-100 rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-700">Seamless Order Management</h3>
              <p className="text-gray-600 mt-2">Streamline order tracking and improve efficiency.</p>
              <p className="text-gray-600 mt-2">Coming Soon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white w-full text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900">Let's Talk</h2>
          <p className="text-gray-600 mt-3">
            Have questions or want to see how Restrogram can help your restaurant? Get in touch with us today!
          </p>
          <form className="mt-6 flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full max-w-md p-3 border border-gray-300 rounded-md mb-3"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full max-w-md p-3 border border-gray-300 rounded-md mb-3"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full max-w-md p-3 border border-gray-300 rounded-md mb-3"
              rows="4"
              required
            ></textarea>
            <button type="submit" className="bg-[#4CAF4F] text-white py-3 px-6 rounded-md shadow-md hover:bg-green-700">
              Send Message
            </button>
          </form>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full text-center py-6 bg-gray-900 text-white mt-auto">
        <p>© {new Date().getFullYear()} Our Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}