import React, { useState } from 'react';

const AddCategoryModal = ({ isOpen, onClose, showToast, onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (categoryName.trim() === '') {
            return showToast('Nama kategori tidak boleh kosong.', 'warning');
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: categoryName })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menambahkan kategori.');
            
            showToast('Kategori berhasil ditambahkan!', 'success');
            onCategoryAdded();
            handleClose();
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleClose = () => {
        setCategoryName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4">
                <div className="flex justify-between items-center border-b pb-3 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tambah Kategori Baru</h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-2xl font-bold">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Kategori</label>
                        <input id="categoryName" type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        />
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
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;