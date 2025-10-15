import React, { useState, useEffect, useCallback } from 'react';
import AddCategoryModal from './tambahKategori'; // Impor modal kategori

const AddQuestionModal = ({ isOpen, onClose, showToast, onQuestionAdded }) => {
    const [categories, setCategories] = useState([]);
    const [questionText, setQuestionText] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false); // State untuk modal kategori

    // Mengambil daftar kategori
    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal memuat kategori.');
            setCategories(data);
            // Set default category if not already set
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id);
            }
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast, categoryId]);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, fetchCategories]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Handler setelah kategori baru berhasil ditambahkan
    const handleCategoryAdded = () => {
        setIsAddCategoryModalOpen(false);
        fetchCategories(); // Muat ulang daftar kategori
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!questionText || !categoryId || options.some(opt => opt.trim() === '') || !correctAnswer) {
            return showToast('Harap isi semua kolom yang diperlukan.', 'warning');
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    question_text: questionText,
                    category_id: parseInt(categoryId, 10),
                    question_type: 'multiple_choice',
                    options: options,
                    correct_answer: correctAnswer
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menambahkan pertanyaan.');
            
            showToast('Pertanyaan berhasil ditambahkan!', 'success');
            onQuestionAdded(); // Callback untuk refresh daftar pertanyaan utama
            handleClose();
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleClose = () => {
        setQuestionText('');
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b pb-3 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tambah Pertanyaan Baru</h3>
                        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl font-bold">&times;</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                            <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teks Pertanyaan</label>
                            <textarea id="questionText" value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows="3" required
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                            <div className="flex items-center space-x-2">
                                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => setIsAddCategoryModalOpen(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-lg font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Opsi Jawaban</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {options.map((option, index) => {
                                    const optionLetter = String.fromCharCode(65 + index);
                                    return (
                                        <div key={index} className="flex items-center">
                                            <span className="mr-3 text-gray-500 dark:text-gray-400">{optionLetter}.</span>
                                            <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder={`Teks untuk opsi ${optionLetter}`} required
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jawaban Benar</label>
                            <select id="correctAnswer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            >
                                <option value="" disabled>Pilih jawaban yang benar</option>
                                {options.map((opt, index) => {
                                    if (opt.trim() === '') return null;
                                    const optionLetter = String.fromCharCode(65 + index);
                                    return <option key={optionLetter} value={optionLetter}>{optionLetter}</option>;
                                })}
                            </select>
                        </div>

                        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
                            <button type="button" onClick={handleClose}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md mr-3 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                            >
                                Batal
                            </button>
                            <button type="submit" disabled={isSubmitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Pertanyaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Modal Tambah Kategori, dirender di atas modal utama */}
            <AddCategoryModal 
                isOpen={isAddCategoryModalOpen}
                onClose={() => setIsAddCategoryModalOpen(false)}
                showToast={showToast}
                onCategoryAdded={handleCategoryAdded}
            />
        </>
    );
};

export default AddQuestionModal;