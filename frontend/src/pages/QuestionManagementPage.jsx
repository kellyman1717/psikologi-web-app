import React, { useState, useEffect } from 'react';

// --- Komponen Card Kategori yang Bisa Dibuka-Tutup ---
const CategoryCard = ({ category, questions }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{category}</h3>
                <svg className={`w-6 h-6 transform transition-transform dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t dark:border-gray-700">
                    <ul className="space-y-2">
                        {questions.map(q => (
                            <li key={q.id} className="text-gray-600 dark:text-gray-400">{q.question_text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Komponen Utama Halaman ---
const QuestionManagementPage = () => {
    const [groupedQuestions, setGroupedQuestions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignedQuestions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/questions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch questions.');
                
                const data = await response.json();
                const grouped = data.reduce((acc, q) => {
                    acc[q.category] = acc[q.category] || [];
                    acc[q.category].push(q);
                    return acc;
                }, {});
                setGroupedQuestions(grouped);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedQuestions();
    }, []);
    
    if (loading) return <p className="text-center dark:text-white">Loading your questions...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">My Assigned Questions</h2>
            {Object.keys(groupedQuestions).length > 0 ? (
                Object.entries(groupedQuestions).map(([category, questions]) => (
                    <CategoryCard key={category} category={category} questions={questions} />
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No questions have been assigned to you yet.</p>
            )}
        </div>
    );
};

export default QuestionManagementPage;