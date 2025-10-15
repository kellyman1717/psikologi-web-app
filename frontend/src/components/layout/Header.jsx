import React, { useState, useEffect, useRef } from 'react';
import { IconUsers, IconLogout } from '../icons/Icons';

// Pastikan Anda juga sudah menambahkan IconSun dan IconMoon di Icons.jsx
// Jika belum, tambahkan dari jawaban saya sebelumnya.
import { IconSun, IconMoon } from '../icons/Icons';

const Header = ({ onMenuClick, title, onThemeToggle, theme, onLogout, onEditProfile, currentUser }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    return (
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center">
                {/* Tombol Hamburger */}
                <button onClick={onMenuClick} className="text-gray-600 dark:text-gray-300 mr-4 lg:hidden">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                {/* Tombol Dark/Light Mode dengan transisi */}
                <button onClick={onThemeToggle} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-300 transition-all duration-300">
                    {theme === 'dark' 
                        ? <IconSun className="w-6 h-6"/>
                        : <IconMoon className="w-6 h-6"/>}
                </button>
                <div className="relative" ref={profileRef}>
                    <button onClick={() => setProfileOpen(!isProfileOpen)} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                        <IconUsers className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                            {/* Tombol Edit Profil hanya untuk 'user' */}
                            {currentUser?.role === 'user' && (
                                <a href="#" onClick={(e) => { e.preventDefault(); onEditProfile(); setProfileOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit Profil</a>
                            )}
                            {/* Tombol Logout */}
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;