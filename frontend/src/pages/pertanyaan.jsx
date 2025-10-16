import React, { useState, useEffect, useMemo } from 'react';
import AddQuestionModal from '../components/tambahPertanyaan';
import EditQuestionModal from '../components/editPertanyaan';
// AddCategoryModal tidak perlu diimpor di sini lagi

// ===================================================================================
// 1. TAMPILAN UNTUK ADMIN
// ===================================================================================
const AdminQuestionView = ({ showToast }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedCategory, setExpandedCategory] = useState(null);
    
    // States for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    // State dan handler untuk modal kategori dihapus dari sini

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        // ... (logika fetchQuestions tetap sama)
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/questions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal memuat pertanyaan.');
            setQuestions(data);
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleQuestionAdded = () => {
        setIsAddModalOpen(false);
        fetchQuestions();
    };

    const handleQuestionUpdated = () => {
        setIsEditModalOpen(false);
        setEditingQuestion(null);
        fetchQuestions();
    };

    const handleOpenEditModal = (question) => {
        setEditingQuestion(question);
        setIsEditModalOpen(true);
    };

    const groupedQuestions = useMemo(() => {
        // ... (logika grouping tetap sama)
        return questions.reduce((acc, q) => {
            const category = q.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(q);
            return acc;
        }, {});
    }, [questions]);

    const handleToggleCategory = (category) => {
        setExpandedCategory(prev => (prev === category ? null : category));
    };

    if (loading) return <p className="text-center dark:text-white">Memuat daftar pertanyaan...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manajemen Pertanyaan</h2>
                {/* Tombol Tambah Kategori dihapus dari sini */}
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Tambah Pertanyaan
                </button>
            </div>
            
            {Object.keys(groupedQuestions).length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {Object.entries(groupedQuestions).map(([category, qs]) => (
                        <CategoryCard 
                            key={category} 
                            category={category} 
                            questions={qs}
                            isExpanded={expandedCategory === category}
                            onToggle={() => handleToggleCategory(category)}
                            onEditClick={handleOpenEditModal}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">Belum ada pertanyaan di database.</p>
            )}

            <AddQuestionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                showToast={showToast}
                onQuestionAdded={handleQuestionAdded}
            />

            <EditQuestionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                showToast={showToast}
                onQuestionUpdated={handleQuestionUpdated}
                question={editingQuestion}
            />
            
            {/* Instance AddCategoryModal dihapus dari sini */}
        </div>
    );
};

// ... (CategoryCard, UserTestView, dan komponen utama tetap sama)
const CategoryCard = ({ category, questions, isExpanded, onToggle, onEditClick }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-500 ease-in-out ${isExpanded ? 'scale-[1.02]' : 'hover:shadow-xl'}`}>
        <button onClick={onToggle} className="w-full flex justify-between items-center p-5 text-left">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{category}</h3>
            <svg className={`w-6 h-6 transform transition-transform duration-500 text-gray-500 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        <div className={`transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[40rem] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}>
            <div className="px-5 pb-5 divide-y dark:divide-gray-700">
                {questions.map((q, index) => (
                    <div key={q.id} className={`transition-opacity duration-500 ease-out ${isExpanded ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                        <div className="py-4">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800 dark:text-gray-300 mb-3 flex-1">{index + 1}. {q.question_text}</p>
                                <button onClick={() => onEditClick(q)} className="text-sm text-blue-500 hover:text-blue-700 ml-4 px-3 py-1 rounded-md bg-blue-50 dark:bg-gray-700 dark:hover:bg-gray-600">
                                    Edit
                                </button>
                            </div>
                            <div className="space-y-2 pl-4">
                                {q.options && typeof q.options === 'string' && JSON.parse(q.options).map((value, idx) => {
                                    const optionLetter = String.fromCharCode(65 + idx);
                                    const isCorrect = q.correct_answer === optionLetter;
                                    return (
                                        <p key={idx} className={`text-sm ${isCorrect ? 'text-green-500 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {optionLetter}. {value} {isCorrect && '✓'}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


// ===================================================================================
// 2. TAMPILAN UNTUK USER
// ===================================================================================
const UserTestView = ({ showToast, onNavClick }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssignedQuestions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3001/api/questions', { headers: { 'Authorization': `Bearer ${token}` } });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Gagal memuat soal.');
                setQuestions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignedQuestions();
    }, []);

    const handleAnswerChange = (questionId, answerKey) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerKey }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            return showToast('Harap jawab semua pertanyaan.', 'warning');
        }
        if (!window.confirm('Apakah Anda yakin ingin mengirim jawaban?')) return;

        setIsSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([qid, answer]) => ({
            question_id: parseInt(qid, 10),
            answer,
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/test/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ answers: formattedAnswers })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            
            showToast(`Tes Selesai! Skor Anda: ${result.score}`, 'success');
            onNavClick('test-results'); // Gunakan onNavClick untuk pindah halaman
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
            setIsSubmitting(false);
        }
    };
    
    const renderOptions = (question) => {
        if (!question.options || typeof question.options !== 'string') return null;
        try {
            const parsedOptions = JSON.parse(question.options);
            return Object.entries(parsedOptions).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input type="radio" name={`question-${question.id}`} value={key}
                        checked={answers[question.id] === key}
                        onChange={() => handleAnswerChange(question.id, key)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">{value}</span>
                </label>
            ));
        } catch { return null; }
    };

    if (loading) return <p className="text-center dark:text-white">Memuat pertanyaan Anda...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Kerjakan Soal Tes</h2>
            {questions.length > 0 ? (
                <div className="space-y-8">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-4">{index + 1}. {q.question_text}</p>
                            <div className="space-y-3 pl-2">{renderOptions(q)}</div>
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <button onClick={handleSubmit} disabled={isSubmitting}
                            className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? 'Mengirim...' : 'Selesai & Kirim'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada soal yang ditugaskan untuk Anda saat ini.</p>
                </div>
            )}
        </div>
    );
};

// ===================================================================================
// 3. KOMPONEN UTAMA (ROUTER BERDASARKAN ROLE)
// ===================================================================================
const QuestionManagementPage = ({ showToast, currentUser, onNavClick }) => {
    const userRole = currentUser?.role;

    if (userRole === 'admin') {
        return <AdminQuestionView showToast={showToast} />;
    }
    
    if (userRole === 'user') {
        return <UserTestView showToast={showToast} onNavClick={onNavClick} />;
    }

    // Tampilan default jika role belum terdeteksi
    return <p className="text-center dark:text-white">Memuat...</p>;
};

export default QuestionManagementPage;