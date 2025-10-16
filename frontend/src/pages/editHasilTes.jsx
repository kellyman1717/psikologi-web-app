import React, { useState, useEffect } from 'react';

const EditTestResultPage = ({ id, onFinishEditing, showToast }) => {
    const [score, setScore] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/test-results/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Gagal memuat hasil tes.');
                }
                setScore(data.score);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/test-results/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ score: parseInt(score, 10) })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal memperbarui hasil tes.');
            }
            
            showToast('Hasil tes berhasil diperbarui.', 'success');
            onFinishEditing(); // Panggil fungsi ini untuk kembali ke halaman daftar
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center dark:text-white">Memuat...</p>;

    return (
        <div>
            {/* Judul sudah dihandle di Header App.jsx, jadi ini bisa dihapus jika mau */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Edit Hasil Tes
            </h2>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="score" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Skor
                        </label>
                        <input
                            type="number"
                            id="score"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            required
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Simpan Perubahan
                        </button>
                        <button
                            type="button"
                            onClick={onFinishEditing}
                            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTestResultPage;