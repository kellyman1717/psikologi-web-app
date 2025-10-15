import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestPage = ({ showToast }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/questions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Gagal memuat soal tes.');
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            showToast('Harap jawab semua pertanyaan sebelum mengirim.', 'warning');
            return;
        }

        setIsSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
            question_id: parseInt(question_id, 10),
            answer,
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/test/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers: formattedAnswers })
            });
            
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal mengirim jawaban.');
            
            showToast(`Tes Selesai! Skor Anda: ${result.score}`, 'success');
            navigate('/test-results'); // Arahkan ke halaman hasil
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            setIsSubmitting(false);
        }
    };

    if (loading) return <p className="text-center dark:text-white">Memuat soal tes...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Kerjakan Tes</h2>
            {questions.length > 0 ? (
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-4">{index + 1}. {q.question_text}</p>
                            <div className="space-y-3">
                                {q.options && Object.entries(q.options).map(([key, value]) => (
                                    <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={key}
                                            checked={answers[q.id] === key}
                                            onChange={() => handleAnswerChange(q.id, key)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Selesai & Kirim Jawaban'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada soal tes yang ditugaskan untuk Anda saat ini.</p>
            )}
        </div>
    );
};

export default TestPage;