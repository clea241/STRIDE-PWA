// src/Login.jsx

import React, { useState } from 'react';
import logo from './assets/InsightEd1.png'; // Ensure this path is correct
import { auth, googleProvider, db } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';



const getDashboardPath = (role) => {
    const roleMap = {
        'Engineer': '/engineer-dashboard',
        'School Head': '/schoolhead-dashboard',
        'Human Resource': '/hr-dashboard',
        'Admin': '/admin-dashboard',
    };
    return roleMap[role] || '/';
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await checkUserRole(userCredential.user.uid);
        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await checkUserRole(result.user.uid);
        } catch (error) {
            alert(error.message);
        }
    };

    const checkUserRole = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const path = getDashboardPath(userData.role);
            navigate(path);
        } else {
            alert("Account not found. Redirecting you to finish registration...");
            navigate('/register'); 
        }
        setLoading(false);
    };

    return (
        /* MAIN CONTAINER */
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden p-5 font-sans"
             style={{
                 background: 'linear-gradient(-45deg, #ffffff, #cecdd3, #004A99, #004A99)',
                 backgroundSize: '400% 400%',
                 animation: 'gradientAnimation 12s ease infinite'
             }}
        >
            {/* INLINE STYLES FOR ANIMATIONS (Tailwind config replacement) */}
            <style>{`
                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes move-forever {
                    0% { transform: translate3d(-90px, 0, 0); }
                    100% { transform: translate3d(85px, 0, 0); }
                }
            `}</style>

            {/* LOGIN CARD */}
            <div className="bg-white/95 backdrop-blur-md w-[82%] max-w-[400px] px-[30px] py-[40px] rounded-[20px] flex flex-col gap-5 relative z-10 shadow-[0_10px_25px_rgba(0,74,153,0.2)] mb-[50px] md:mb-0">
                
                {/* HEADER */}
                <div className="text-center mb-2.5">
                    <img src={logo} alt="InsightEd Logo" className="w-full max-w-[170px] h-auto block mx-auto mb-[15px] object-contain shadow-sm" />
                    <p className="text-[#666] m-0 text-sm mt-[5px]">Log in to access your dashboard</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin} className="flex flex-col gap-[15px]">
                    <div className="relative">
                        <input 
                            type="email" 
                            className="w-full p-[14px_15px] border-[2px] border-[#e1e4e8] rounded-xl text-base transition-all outline-none focus:border-[#004A99] focus:bg-white focus:ring-4 focus:ring-[#004A99]/10"
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <input 
                            type="password" 
                            className="w-full p-[14px_15px] border-[2px] border-[#e1e4e8] rounded-xl text-base transition-all outline-none focus:border-[#004A99] focus:bg-white focus:ring-4 focus:ring-[#004A99]/10"
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full p-[14px] border-none rounded-xl text-base font-semibold cursor-pointer transition-transform flex justify-center items-center gap-[10px] bg-[#004A99] text-white shadow-[0_4px_12px_rgba(0,74,153,0.3)] active:scale-95 hover:brightness-110"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
                
                {/* DIVIDER */}
                <div className="flex items-center text-[#888] text-sm my-[10px]">
                    <div className="flex-1 h-[1px] bg-[#e1e4e8]"></div>
                    <span className="px-[10px]">OR</span>
                    <div className="flex-1 h-[1px] bg-[#e1e4e8]"></div>
                </div>
                
                {/* GOOGLE BUTTON */}
                <button 
                    onClick={handleGoogleLogin} 
                    className="w-full p-[14px] border-[2px] border-[#e1e4e8] rounded-xl text-base font-semibold cursor-pointer transition-transform flex justify-center items-center gap-[10px] bg-white text-[#444] active:scale-95 hover:bg-gray-50"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.032-3.716H.96v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.968 10.705A5.366 5.366 0 0 1 3.682 9c0-.593.102-1.17.286-1.705V4.962H.96A9.006 9.006 0 0 0 0 9c0 1.452.348 2.827.96 4.095l3.008-2.39z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .96 4.962l3.008 2.392C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>
                
                {/* FOOTER */}
                <div className="text-center text-sm text-[#666] mb-0 md:mb-[10px]">
                    Don't have an account? <Link to="/register" className="text-[#CC0000] no-underline font-semibold hover:underline">Register here</Link>
                </div>
            </div>

            {/* WAVES CONTAINER */}
            <div className="absolute bottom-0 left-0 w-full z-0 leading-none">
                <svg className="relative w-full h-[50vh] min-h-[250px] md:h-[50vh] max-h-none mb-[-7px]" 
                     xmlns="http://www.w3.org/2000/svg" 
                     xmlnsXlink="http://www.w3.org/1999/xlink"
                     viewBox="0 24 150 28" 
                     preserveAspectRatio="none" 
                     shapeRendering="auto"
                >
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="parallax">
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" style={{animation: 'move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-2s', animationDuration: '7s'}} />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" style={{animation: 'move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-3s', animationDuration: '10s'}} />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" style={{animation: 'move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-4s', animationDuration: '13s'}} />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" style={{animation: 'move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite', animationDelay: '-5s', animationDuration: '20s'}} />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default Login;