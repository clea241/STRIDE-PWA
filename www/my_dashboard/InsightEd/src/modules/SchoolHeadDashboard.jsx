import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import BottomNav from './BottomNav';
import PageTransition from '../components/PageTransition'; // Import Transition
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const SchoolHeadDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('School Head'); // Default

    // Non-blocking fetch
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().firstName);
                }
            }
        };
        fetchUserData();
    }, []);

    const goToSchoolForms = () => {
        navigate('/school-forms');
    };

    const sliderContent = [
        { 
            id: 1, 
            title: "School Metrics", 
            emoji: "📊", 
            description: "Enrollment stats are up by 5% this semester. Keep it up!" 
        },
        { 
            id: 2, 
            title: "Pending Approvals", 
            emoji: "📝", 
            description: "You have 3 facility requests waiting for your review." 
        },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#FFFBEA] p-5 pb-24 md:p-10 font-sans">
                <div className="max-w-4xl mx-auto">
                    {/* Dynamic Greeting */}
                    <div className="mb-6">
                        <h1 className="text-[#004A99] text-3xl font-bold">
                            Hello, {userName}! 👋
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Here's what's happening at your school today.
                        </p>
                    </div>
                    
                    {/* Slider */}
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
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

                    {/* Action Button */}
                    <button 
                        onClick={goToSchoolForms} 
                        className="w-full bg-[#CC0000] text-white font-bold py-4 px-4 rounded-xl text-lg shadow-md hover:bg-[#A30000] transition duration-200 flex items-center justify-center gap-2"
                    >
                        <span>📋</span> Manage School Forms
                    </button>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                            <span className="text-2xl font-bold text-[#004A99]">12</span>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Active Teachers</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                            <span className="text-2xl font-bold text-[#CC0000]">340</span>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Students</p>
                        </div>
                    </div>
                </div>

                <BottomNav homeRoute="/schoolhead-dashboard" />
            </div>
        </PageTransition>
    );
};

export default SchoolHeadDashboard;