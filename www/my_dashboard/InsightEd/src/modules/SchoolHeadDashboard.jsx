<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
>>>>>>> edb89b59280a86534d50e045c96c0d002c7e2cce
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

<<<<<<< HEAD
    // Mock Data for the "Quick Stats" row (Visual appeal)
    const stats = [
        { label: "Pending Forms", value: "3", color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Total Teachers", value: "42", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Enrolled", value: "1.2k", color: "text-green-600", bg: "bg-green-50" },
    ];

    // Data for the slider content
    const sliderContent = [
        { 
            id: 1, 
            title: "Mabuhay, School Head!", 
            emoji: "🇵🇭", 
            description: "Welcome to the new DepEd School Building Management System. Your dashboard is ready." 
        },
        { 
            id: 2, 
            title: "Report Submission", 
            emoji: "📅", 
            description: "The deadline for the Monthly Infrastructure Report is approaching on Friday." 
        },
        { 
            id: 3, 
            title: "Maintenance Check", 
            emoji: "🛠️", 
            description: "Review the recent repair requests submitted by your facilities coordinator." 
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            
            {/* --- TOP HEADER (DepEd Blue Brand) --- */}
            <div className="relative bg-[#004A99] pt-12 pb-20 px-6 rounded-b-[2.5rem] shadow-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-blue-100 text-sm font-medium tracking-wide uppercase">Department of Education</p>
                        <h1 className="text-3xl font-bold text-white mt-1">Dashboard</h1>
                        <p className="text-blue-200 mt-2 text-sm">Manage your school's data efficiently.</p>
                    </div>
                    {/* Profile Icon / Avatar Placeholder */}
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 text-white text-xl">
                        👤
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT CONTAINER --- */}
            <div className="px-6 -mt-10 relative z-10 space-y-6">

                {/* 1. Quick Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter mt-1">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* 2. Announcements Slider (Swiper) */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-gray-800 font-bold text-lg">Updates & Reminders</h2>
                        <span className="text-xs text-[#004A99] font-medium">View All</span>
                    </div>
                    
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={15}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000 }}
                        className="w-full"
                    >
                        {sliderContent.map((item) => (
                            <SwiperSlide key={item.id} className="pb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#FDB913] h-40 flex flex-col justify-center">
                                    <h3 className="text-[#004A99] font-bold text-lg flex items-center mb-2">
                                        <span className="text-2xl mr-3">{item.emoji}</span>
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* 3. Primary Action Card (Fill Forms) */}
                <div className="bg-gradient-to-br from-[#CC0000] to-[#990000] rounded-3xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
                    {/* Decorative Circle Background */}
                    <div className="absolute -right-5 -top-5 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <h2 className="text-2xl font-bold mb-2 relative z-10">School Forms</h2>
                    <p className="text-red-100 text-sm mb-6 relative z-10 max-w-[80%]">
                        Access, update, and submit your school's profile, infrastructure, and personnel data.
                    </p>

                    <button 
                        onClick={goToSchoolForms} 
                        className="w-full bg-white text-[#CC0000] font-bold py-3.5 px-4 rounded-xl shadow-sm hover:bg-gray-50 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>📝</span> Fill Up Forms Now
                    </button>
                </div>

                {/* 4. Secondary Description / Info */}
                <div className="bg-[#FFF8E1] border border-[#FFE082] p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">💡</span>
                        <div>
                            <h4 className="font-bold text-[#F57F17] text-sm">Did you know?</h4>
                            <p className="text-[#F57F17]/80 text-xs mt-1 leading-relaxed">
                                You can now save your progress on forms and return to them later. All data is automatically synced with the Division Office.
                            </p>
                        </div>
                    </div>
                </div>

=======
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
>>>>>>> edb89b59280a86534d50e045c96c0d002c7e2cce
            </div>
        </PageTransition>
    );
};

export default SchoolHeadDashboard;