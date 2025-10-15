import React from 'react';
import { IconUsers, IconQuestion } from '../components/icons/Icons';

const DashboardPage = () => (
    <div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">1,250</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                    <IconUsers className="h-6 w-6 text-blue-500" />
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
                     <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">580</p>
                 </div>
                 <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                     <IconQuestion className="h-6 w-6 text-green-500" />
                 </div>
             </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Tests Completed</p>
                     <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">2,345</p>
                 </div>
                 <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-500"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/></svg>
                 </div>
             </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
                 <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                     <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">85.6%</p>
                 </div>
                 <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                 </div>
             </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">User Activity (Last 7 Days)</h3>
                <div className="h-[340px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Chart will be displayed here</p>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200 mb-4">Test Results Summary</h2>
                 <div className="flex flex-col items-center justify-center">
                     <div className="relative w-32 h-32">
                         <svg className="w-full h-full" viewBox="0 0 36 36">
                             <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e6e6e6" className="dark:stroke-gray-700" strokeWidth="3" />
                             <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-2xl font-bold dark:text-gray-100">11</span>
                             <span className="text-xs text-gray-500 dark:text-gray-400">participants</span>
                         </div>
                     </div>
                     <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p><span className="text-blue-500">&#9632;</span> Participation</p>
                        <p><span className="text-green-500">&#9632;</span> Mean</p>
                     </div>
                 </div>
                 <div className="mt-4">
                     <div className="h-32 flex items-end space-x-2 sm:space-x-3">
                         <div className="flex-1 h-full flex flex-col justify-end items-center"><div className="flex items-end w-full h-full"><div className="w-1/2 bg-blue-500 rounded-t-md" style={{height: "60%"}}></div><div className="w-1/2 bg-green-400 rounded-t-md" style={{height: '80%'}}></div></div><span className="text-xs text-gray-500 dark:text-gray-400 mt-1">TestA</span></div>
                     </div>
                 </div>
            </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto">
            <h3 className="p-6 text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Test Results</h3>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr><th scope="col" className="px-6 py-3">Test Results</th><th scope="col" className="px-6 py-3">S02%</th><th scope="col" className="px-6 py-3">Porteu</th></tr>
                </thead>
                <tbody>
                    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"><td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Guentian</td><td className="px-6 py-4">1.18</td><td className="px-6 py-4">2.16</td></tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default DashboardPage;