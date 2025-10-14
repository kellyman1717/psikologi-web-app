import React from 'react';
import { IconLogo, IconDashboard, IconQuestion, IconTestResults, IconUsers, IconReports, IconSettings } from '../icons/Icons';

// Objek untuk memetakan id ke ikon
const iconMap = {
    dashboard: IconDashboard,
    'question-management': IconQuestion,
    'test-results': IconTestResults,
    'user-management': IconUsers,
    reports: IconReports,
    settings: IconSettings,
};


const Sidebar = ({ isOpen, onClose, activeContent, onNavClick, navItems, currentUser }) => { // Tambahkan currentUser
    return (
        <aside className={`w-64 bg-gray-800 text-white p-6 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                    <IconLogo className="h-8 w-8 text-white" />
                    {/* Logika untuk menampilkan nama atau "Admin" */}
                    <h1 className="text-xl font-bold">
                        {currentUser && currentUser.role === 'admin' 
                            ? 'Admin Panel' 
                            : `Welcome, ${currentUser ? currentUser.name : ''}`
                        }
                    </h1>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map(item => {
                        const IconComponent = iconMap[item.id];
                        return (
                            <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick(item.id); }} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 ease-in-out ${activeContent === item.id ? 'bg-blue-500 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                    {IconComponent && <IconComponent className="h-5 w-5" />}
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;