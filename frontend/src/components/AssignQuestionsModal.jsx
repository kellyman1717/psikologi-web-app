import React, { useState, useEffect } from 'react';

const AssignQuestionsModal = ({ isOpen, onClose, user, showToast }) => {
    const [questions, setQuestions] = useState({});
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState(new Set());

    useEffect(() => {
        if (isOpen && user) {
            setLoading(true);
            const token = localStorage.getItem('token');
            fetch(`http://localhost:3001/api/users/${user.id}/assignments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((acc, q) => {
                    acc[q.category] = acc[q.category] || [];
                    acc[q.category].push(q);
                    return acc;
                }, {});
                setQuestions(grouped);

                const initialAssignments = new Set(data.filter(q => q.is_assigned).map(q => q.id));
                setAssignments(initialAssignments);
            })
            .finally(() => setLoading(false));
        }
    }, [isOpen, user]);

    const handleToggleAssign = (questionId) => {
        setAssignments(prev => {
            const newAssignments = new Set(prev);
            if (newAssignments.has(questionId)) {
                newAssignments.delete(questionId);
            } else {
                newAssignments.add(questionId);
            }
            return newAssignments;
        });
    };
    
    const handleSave = () => {
        const assignedIds = Array.from(assignments);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/api/users/${user.id}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ questionIds: assignedIds })
        })
        .then(res => {
            if (res.ok) {
                showToast('Penugasan berhasil disimpan!');
                onClose();
            } else {
                throw new Error('Gagal menyimpan penugasan.');
            }
        })
        .catch(err => showToast(err.message, 'error'));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl h-[80vh] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    Assign Questions for <span className="text-blue-500">{user?.name}</span>
                </h3>
                <div className="flex-grow overflow-y-auto pr-4">
                    {loading ? <p>Loading questions...</p> : Object.entries(questions).map(([category, qs]) => (
                        <div key={category} className="mb-4">
                            <h4 className="font-bold text-gray-600 dark:text-gray-300 mb-2 border-b dark:border-gray-600 pb-1">{category}</h4>
                            {qs.map(q => (
                                <div key={q.id} className="flex items-center space-x-2 py-1">
                                    <input 
                                        type="checkbox" 
                                        id={`q-${q.id}`} 
                                        checked={assignments.has(q.id)}
                                        onChange={() => handleToggleAssign(q.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`q-${q.id}`} className="text-sm text-gray-700 dark:text-gray-400">{q.question_text}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-600 mt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Batal</button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Simpan Penugasan</button>
                </div>
            </div>
        </div>
    );
};

export default AssignQuestionsModal;