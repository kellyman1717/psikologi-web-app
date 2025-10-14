import React from 'react';

const SettingsPage = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Application Settings</h3>
        <div className="space-y-6 max-w-lg">
            <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site Name
                </label>
                <input 
                    type="text" 
                    id="site-name" 
                    defaultValue="Admin Dashboard" 
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked/>
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-focus:ring-4 peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Save Changes
            </button>
        </div>
    </div>
);

export default SettingsPage;