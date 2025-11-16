"use client";

import React, { useState } from 'react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="space-y-2 mb-6">
            <h1 className="text-5xl lg:text-6xl font-bold">
              <span className="text-sky-400">Get in</span>
              <br />
              <span className="text-gray-900">Touch</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Section - Contact Form */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                      transition-all duration-300
                      text-gray-900
                    "
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                      transition-all duration-300
                      text-gray-900
                    "
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="
                      w-full
                      px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
                      transition-all duration-300
                      resize-none
                      text-gray-900
                    "
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="
                    w-full
                    inline-flex items-center justify-center gap-2
                    px-8 py-4 text-lg font-semibold
                    bg-sky-400 hover:bg-sky-500
                    text-white rounded-lg
                    shadow-lg shadow-sky-400/30
                    transition-all transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2
                    cursor-pointer
                  "
                >
                  Send Message
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Right Section - Contact Information & Visual */}
          <div className="flex flex-col space-y-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="
                    w-12 h-12
                    bg-gradient-to-br from-sky-400 to-purple-400
                    rounded-lg
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@flago.com</p>
                  </div>
                </div>
              </div>

              {/* Response Time Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="
                    w-12 h-12
                    bg-gradient-to-br from-purple-400 to-pink-400
                    rounded-lg
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="
                    w-12 h-12
                    bg-gradient-to-br from-pink-400 to-rose-400
                    rounded-lg
                    flex items-center justify-center
                    flex-shrink-0
                  ">
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Follow Us</h3>
                    <p className="text-gray-600">Stay connected on social media</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-purple-400/20 to-pink-400/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="
                    absolute inset-0
                    bg-gradient-to-br from-sky-400/30 via-purple-400/30 to-purple-400/30
                    rounded-full
                    blur-2xl
                    animate-pulse-slow
                  "></div>
                  <div className="
                    absolute inset-4
                    bg-gradient-to-br from-sky-400/40 to-purple-400/40
                    rounded-full
                    blur-xl
                  "></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
