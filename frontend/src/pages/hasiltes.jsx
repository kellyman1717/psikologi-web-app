import React, { useState, useEffect, useMemo } from 'react';

// Komponen untuk baris tabel
const ResultRow = ({ result, isAdmin }) => (
    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        {isAdmin && (
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {result.user_name}
            </td>
        )}
        <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                result.score >= 80 ? 'bg-green-100 text-green-800' :
                result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {result.score}
            </span>
        </td>
        <td className="px-6 py-4">
            {new Date(result.created_at).toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}
        </td>
    </tr>
);

// Komponen utama halaman
const TestResultsPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ambil role user dari localStorage
    const userRole = useMemo(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.role : 'user';
        } catch (e) {
            return 'user';
        }
    }, []);

    const isAdmin = userRole === 'admin';

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/test-results', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Gagal memuat hasil tes.');
                }
                setResults(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) return <p className="text-center dark:text-white">Memuat hasil tes...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {isAdmin ? 'Semua Hasil Tes' : 'Hasil Tes Anda'}
            </h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {isAdmin && <th scope="col" className="px-6 py-3">Pengguna</th>}
                                <th scope="col" className="px-6 py-3">Skor</th>
                                <th scope="col" className="px-6 py-3">Tanggal Tes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length > 0 ? (
                                results.map(result => (
                                    <ResultRow key={result.id} result={result} isAdmin={isAdmin} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 3 : 2} className="px-6 py-4 text-center">
                                        Belum ada data hasil tes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;