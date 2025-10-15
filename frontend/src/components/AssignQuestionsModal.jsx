import React, { useState, useEffect, useCallback } from 'react';

// --- Komponen Checkbox Kategori ---
const CategoryCheckbox = ({ category, questions, assignedIds, onToggle }) => (
    <div className="mb-4">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{category}</h4>
        <ul className="space-y-2">
            {questions.map(q => (
                <li key={q.id}>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={assignedIds.has(q.id)}
                            onChange={() => onToggle(q.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-600 dark:text-gray-400">{q.question_text}</span>
                    </label>
                </li>
            ))}
        </ul>
    </div>
);

// --- Komponen Utama Modal ---
const AssignQuestionsModal = ({ isOpen, onClose, user, showToast }) => {
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [assignedQuestionIds, setAssignedQuestionIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isOpen || !user) return;

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Ambil SEMUA pertanyaan yang ada
            const questionsResponse = await fetch('http://localhost:3001/api/questions', { headers });
            const questionsData = await questionsResponse.json();
            if (!questionsResponse.ok) {
                throw new Error(questionsData.message || 'Gagal memuat daftar pertanyaan.');
            }

            // 2. Ambil pertanyaan yang SUDAH ditugaskan ke user ini
            const assignmentsResponse = await fetch(`http://localhost:3001/api/users/${user.id}/assignments`, { headers });
            const assignmentsData = await assignmentsResponse.json();
            if (!assignmentsResponse.ok) {
                throw new Error(assignmentsData.message || 'Gagal memuat penugasan user.');
            }
            
            // Proses dan atur state
            const assignedIds = new Set(assignmentsData.map(a => a.question_id));
            setAssignedQuestionIds(assignedIds);

            const grouped = questionsData.reduce((acc, q) => {
                acc[q.category] = acc[q.category] || [];
                acc[q.category].push(q);
                return acc;
            }, {});
            setGroupedQuestions(grouped);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [isOpen, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleQuestion = (questionId) => {
        setAssignedQuestionIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(questionId)) {
                newIds.delete(questionId);
            } else {
                newIds.add(questionId);
            }
            return newIds;
        });
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/users/${user.id}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ questionIds: Array.from(assignedQuestionIds) }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Gagal menyimpan penugasan.');
            }

            showToast('Penugasan berhasil diperbarui!');
            onClose();
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Tugaskan Pertanyaan untuk <span className="text-blue-500">{user?.name}</span>
                </h3>

                <div className="flex-grow overflow-y-auto pr-4">
                    {loading && <p className="text-center dark:text-white">Memuat pertanyaan...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    
                    {!loading && !error && Object.keys(groupedQuestions).length > 0 ? (
                        Object.entries(groupedQuestions).map(([category, questions]) => (
                            <CategoryCheckbox
                                key={category}
                                category={category}
                                questions={questions}
                                assignedIds={assignedQuestionIds}
                                onToggle={handleToggleQuestion}
                            />
                        ))
                    ) : (
                        !loading && <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada pertanyaan yang tersedia.</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50" disabled={isSaving}>
                        Batal
                    </button>
                    <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50" disabled={isSaving || loading}>
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignQuestionsModal;