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

const menuItems = {
        admin: [
            { path: '/', icon: <IconDashboard />, name: 'Dashboard' },
            { path: '/user-management', icon: <IconUsers />, name: 'User Management' },
            { path: '/question-management', icon: <IconQuestion />, name: 'Question Management' },
            { path: '/test-results', icon: <IconTestResults />, name: 'Test Results' },
            { path: '/reports', icon: <IconReports />, name: 'Reports' },
            { path: '/settings', icon: <IconSettings />, name: 'Settings' }, // <-- DIKEMBALIKAN
        ],
        user: [
            { path: '/', icon: <IconDashboard />, name: 'Dashboard' },
            { path: '/question-management', icon: <IconQuestion />, name: 'Take Test' },
            { path: '/test-results', icon: <IconTestResults />, name: 'My Results' },
            // Menu settings untuk user tidak ada di sidebar, hanya di dropdown profil
        ]
    };

const Sidebar = ({ isOpen, onClose, activeContent, onNavClick, navItems, currentUser }) => {
    return (
        <>
            {/* Overlay untuk mobile (menutup sidebar saat diklik di luar) */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>

            <aside className={`w-64 bg-gray-800 text-white p-6 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 flex flex-col lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <IconLogo className="h-8 w-8 text-white" />
                        <h1 className="text-xl font-bold">Welcome, {currentUser.name}</h1>
                    </div>
                    {/* Tombol close untuk mobile */}
                    <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <nav className="flex-1">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {currentUser?.role === 'admin' ? 'Admin Menu' : 'User Menu'}
                    </p>
                    <ul className="space-y-2 mt-2">
                        {navItems.map(item => {
                            const IconComponent = iconMap[item.id];
                            return (
                                <li key={item.id}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onNavClick(item.id); }} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${activeContent === item.id ? 'bg-blue-500 text-white font-semibold shadow-inner' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                                        {IconComponent && <IconComponent className="h-5 w-5" />}
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                {/* Tombol Logout sudah dihapus dari sini */}
            </aside>
        </>
    );
};

export default Sidebar;