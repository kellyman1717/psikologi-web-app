import React from 'react';

const ReportsPage = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Generate Report</h3>
        <div className="space-y-4 max-w-lg">
            <div>
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Report Type
                </label>
                <select 
                    id="report-type" 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option>User Activity Report</option>
                    <option>Test Performance Report</option>
                    <option>Login History</option>
                </select>
            </div>
            <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Range
                </label>
                <input 
                    type="date" 
                    id="date-range" 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Generate and Download
            </button>
        </div>
    </div>
);

export default ReportsPage;