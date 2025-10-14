import React, { useState } from 'react';
import { IconLogo } from '../components/icons/Icons';

const LoginPage = ({ onLogin }) => {
    // --- PERUBAHAN 1: State diganti menjadi 'username' ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // --- PERUBAHAN 2: Mengirim 'username' ke backend ---
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            onLogin(data.user);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg dark:bg-gray-800">
                <div className="flex justify-center"><IconLogo className="w-12 h-12 text-blue-500" /></div>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login to your account</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* --- PERUBAHAN 3: Input field diubah menjadi untuk Username --- */}
                    <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-t-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-b-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button type="submit" className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign in</button>
                </form>
                 <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {/* --- PERUBAHAN 4: Petunjuk diubah menjadi username --- */}
                    <p>Admin: Admin / admin123</p>
                    <p>User: John Doe / user123</p>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;