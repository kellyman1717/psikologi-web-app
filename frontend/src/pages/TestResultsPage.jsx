import React from 'react';

const TestResultsPage = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">All Test Results</h3>
        <div className="flex items-center justify-between mb-4">
            <input 
                type="text" 
                placeholder="Search by name or test..." 
                className="w-full md:w-1/3 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">Participant</th>
                        <th scope="col" className="px-6 py-3">Test</th>
                        <th scope="col" className="px-6 py-3">Score</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">John Doe</td>
                        <td className="px-6 py-4">Psychology 101</td>
                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">95%</td>
                        <td className="px-6 py-4">2023-10-26</td>
                        <td className="px-6 py-4">
                            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">View</a>
                        </td>
                    </tr>
                    {/* Tambahkan baris data lain di sini */}
                </tbody>
            </table>
        </div>
    </div>
);

export default TestResultsPage;