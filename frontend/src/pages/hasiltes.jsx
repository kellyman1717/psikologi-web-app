import React, { useState, useEffect, useMemo } from 'react';

// Komponen untuk menampilkan satu baris hasil tes di dalam card (Tidak ada perubahan)
const CardResultRow = ({ result, onEdit, onDelete }) => (
    <li 
        onClick={(e) => e.stopPropagation()} 
        className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors duration-150"
    >
        <div className="flex items-center space-x-4">
            <span className={`w-12 text-center px-2 py-1 rounded-full text-xs font-semibold ${
                result.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                result.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
                {result.score}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(result.created_at).toLocaleString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })}
            </span>
        </div>
        <div>
            <button 
                onClick={() => onEdit(result.id)} 
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4 text-sm"
            >
                Edit
            </button>
            <button 
                onClick={() => onDelete(result.id)} 
                className="font-medium text-red-600 dark:text-red-500 hover:underline text-sm"
            >
                Hapus
            </button>
        </div>
    </li>
);

// --- AWAL PERUBAHAN ---

// Komponen Card untuk setiap pengguna (dengan fungsionalitas animasi)
const UserResultCard = ({ userName, userResults, onEdit, onDelete }) => {
    // 1. State awal diubah menjadi 'false' agar kartu tertutup secara default
    const [isOpen, setIsOpen] = useState(false); 
    const [isExpanded, setIsExpanded] = useState(false);
    
    const previewCount = 3;
    const resultsToShow = isExpanded ? userResults : userResults.slice(0, previewCount);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
            <div 
                className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{userName}</h3>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                        Total: {userResults.length} Tes
                    </span>
                    <button 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        aria-label="Toggle card content"
                    >
                        <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* 2. Wrapper untuk konten dengan kelas transisi */}
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-5 pb-5">
                    <ul className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                        {resultsToShow.map(result => (
                            <CardResultRow 
                                key={result.id} 
                                result={result} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        ))}
                         {resultsToShow.length === 0 && (
                            <li className="text-center py-4 text-gray-500 dark:text-gray-400">
                                Tidak ada hasil tes untuk pengguna ini.
                            </li>
                        )}
                    </ul>

                    {userResults.length > previewCount && (
                        <div className="mt-4 text-center">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }} 
                                className="text-sm font-semibold text-blue-600 dark:text-blue-500 hover:underline"
                            >
                                {isExpanded ? `Tampilkan lebih sedikit` : `Tampilkan ${userResults.length - previewCount} hasil lainnya...`}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- AKHIR PERUBAHAN ---


// Komponen Utama Halaman Hasil Tes (Tidak ada perubahan)
const TestResultsPage = ({ onEditTestResult, showToast }) => {
    // ... (sisa kodenya sama persis seperti sebelumnya)
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userRole = useMemo(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user ? user.role : 'user';
        } catch (e) {
            return 'user';
        }
    }, []);

    const isAdmin = userRole === 'admin';

    const fetchResults = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/test-results', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal memuat hasil tes.');
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchResults();
    }, []);

    const groupedResults = useMemo(() => {
        if (!isAdmin) return {};
        return results.reduce((acc, result) => {
            const key = result.user_name || 'Tanpa Nama';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(result);
            return acc;
        }, {});
    }, [results, isAdmin]);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus hasil tes ini?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/test-results/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Gagal menghapus hasil tes.');
                showToast('Hasil tes berhasil dihapus.', 'success');
                fetchResults();
            } catch (err) {
                showToast(err.message, 'error');
            }
        }
    };
    
    if (loading) return <p className="text-center dark:text-white">Memuat hasil tes...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                {isAdmin ? 'Semua Hasil Tes' : 'Riwayat Tes Anda'}
            </h2>

            {isAdmin ? (
                <div>
                    {Object.keys(groupedResults).length > 0 ? (
                       Object.entries(groupedResults).map(([userName, userResults]) => (
                           <UserResultCard 
                                key={userName}
                                userName={userName}
                                userResults={userResults}
                                onEdit={onEditTestResult}
                                onDelete={handleDelete}
                           />
                       ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
                            <p className="dark:text-gray-300">Belum ada data hasil tes dari pengguna manapun.</p>
                        </div>
                    )}
                </div>

            ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Skor</th>
                                    <th scope="col" className="px-6 py-3">Tanggal Tes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? (
                                    results.map(result => (
                                        <tr key={result.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
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
                                                    year: 'numeric', month: 'long', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 text-center">
                                            Anda belum pernah mengerjakan tes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestResultsPage;