import React, { useState, useEffect } from 'react';

const TestPage = () => {
    const [users, setUsers] = useState(null);
    const [status, setStatus] = useState('Memulai tes...');
    const [error, setError] = useState('');

    useEffect(() => {
        setStatus('Mencoba mengambil data dari http://localhost:3001/test-users ...');

        fetch('http://localhost:3001/test-users')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server merespons dengan status: ${response.status}`);
                }
                setStatus('Berhasil menerima respons dari server, memproses data...');
                return response.json();
            })
            .then(data => {
                setStatus(`SUKSES! Data diterima. Ditemukan ${data.length} pengguna.`);
                setUsers(data);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setStatus('GAGAL mengambil data dari server.');
                setError(err.message);
            });
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-gray-800 dark:text-gray-200">
            <h1 className="text-xl font-bold mb-4 border-b pb-2">Halaman Tes Koneksi User Management</h1>
            <p className="font-semibold">Status Tes: <span className="text-blue-400">{status}</span></p>

            {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-md">
                    <p className="font-bold text-red-400">Terjadi Error:</p>
                    <pre className="text-white whitespace-pre-wrap">{error}</pre>
                </div>
            )}

            {users && (
                <div className="mt-4">
                    <h2 className="font-bold">Data Pengguna yang Diterima (Raw JSON):</h2>
                    <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-md text-sm whitespace-pre-wrap">
                        {JSON.stringify(users, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TestPage;