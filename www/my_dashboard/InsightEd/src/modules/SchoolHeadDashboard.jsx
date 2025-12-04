// src/SchoolHeadDashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { Swiper, SwiperSlide } from 'swiper/react'; // For slider functionality
import 'swiper/css'; // Import swiper styles
// Optional: import modules if you need pagination, navigation, etc.
// import { Pagination, Navigation } from 'swiper/modules';
import BottomNav from './BottomNav';

const SchoolHeadDashboard = () => {
    const navigate = useNavigate();

    // Handler for the new button
    const goToSchoolForms = () => {
        // NOTE: Assuming '/school-forms' is the route for your school forms page
        navigate('/school-forms');
    };

    // Data for the slider content
    const sliderContent = [
        { 
            id: 1, 
            title: "Welcome Back!", 
            emoji: "👋", 
            description: "A quick summary of key performance indicators and school metrics will appear here soon." 
        },
        { 
            id: 2, 
            title: "Upcoming Deadlines", 
            emoji: "🗓️", 
            description: "Check required submissions, personnel evaluation schedules, and resource allocation reviews." 
        },
        { 
            id: 3, 
            title: "Resource Management", 
            emoji: "📚", 
            description: "View inventory, budget status, and facility maintenance requests." 
        }
    ];

    return (
        <div className="min-h-screen bg-[#FFFBEA] p-5 pb-24 md:p-10 font-sans">
            
            <div className="max-w-4xl mx-auto">
                {/* Blue Title */}
                <h1 className="text-[#004A99] text-2xl md:text-3xl font-bold mb-3">
                    🏫 Welcome to the School Head Dashboard!
                </h1>
                
                {/* --- Swipeable Welcome Content (The Slider) --- */}
                <Swiper
                    // modules={[Pagination]} // Uncomment if you use modules
                    spaceBetween={10}
                    slidesPerView={1}
                    // pagination={{ clickable: true }} // Uncomment for pagination dots
                    className="mb-6 rounded-xl shadow-lg border border-[#f0e6d2] bg-white overflow-hidden"
                >
                    {sliderContent.map((item) => (
                        <SwiperSlide key={item.id} className="p-6">
                            <h2 className="text-xl font-semibold mb-2 text-[#004A99] flex items-center">
                                <span className="mr-2 text-2xl">{item.emoji}</span> {item.title}
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {item.description}
                            </p>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- Action Button --- */}
                <button 
                    onClick={goToSchoolForms} 
                    className="w-full bg-[#CC0000] text-white font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:bg-[#A30000] transition duration-200 focus:outline-none focus:ring-4 focus:ring-[#CC0000]/50"
                >
                    📝 Fill Up School Forms
                </button>

                {/* Red Description Text (Re-purposed or Kept) */}
                <p className="text-[#CC0000] text-base md:text-lg bg-white p-5 rounded-xl shadow-sm border border-[#f0e6d2] leading-relaxed mt-6">
                    This is where you oversee school operations, resources, and educational programs.
                </p>
            </div>

            {/* Navigation Footer */}
            <BottomNav homeRoute="/schoolhead-dashboard" />
        </div>
    );
};

export default SchoolHeadDashboard;