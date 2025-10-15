import React, { useState } from 'react';

const LoginPage = ({ onLogin, showToast }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        // --- PERBAIKAN DI SINI ---
        // event.preventDefault() mencegah browser me-refresh halaman.
        event.preventDefault(); 
        
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Panggil fungsi onLogin dari App.jsx jika berhasil
            if (typeof onLogin === 'function') {
                onLogin(data);
            }

        } catch (error) {
            if (typeof showToast === 'function') {
                showToast(error.message, 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                    Sign In
                </h1>
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Welcome back to PsikologiApp
                </p>

                {/* Pastikan form memanggil handleSubmit */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label 
                            htmlFor="username" 
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;