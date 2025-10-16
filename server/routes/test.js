const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // GET /api/test/questions - (Tidak ada perubahan di sini)
    router.get('/questions', (req, res) => {
        const userId = req.user.id;
        const query = `
            SELECT q.id, q.question_text, q.options
            FROM questions q
            JOIN user_assignments ua ON q.id = ua.question_id
            WHERE ua.user_id = ?
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching assigned questions:", err);
                return res.status(500).send({ message: 'Gagal mengambil pertanyaan tes.' });
            }
            const questions = results.map(q => ({
                ...q,
                options: JSON.parse(q.options)
            }));
            res.json(questions);
        });
    });

    // POST /api/test/submit - (PERBAIKAN TOTAL DI SINI)
    router.post('/submit', (req, res) => {
        const userId = req.user.id;
        // 'answers' adalah ARRAY: [ { question_id: 25, answer: '0' }, ... ]
        const answers = req.body.answers;

        // --- AWAL PERBAIKAN ---

        // Validasi jika jawaban yang dikirim bukan array atau kosong
        if (!Array.isArray(answers) || answers.length === 0) {
            const score = 0;
            const insertQuery = 'INSERT INTO test_sessions (user_id, score) VALUES (?, ?)';
            db.query(insertQuery, [userId, score], (err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'Gagal menyimpan hasil tes.' });
                }
                return res.status(201).json({ message: 'Hasil tes berhasil disimpan.', score, sessionId: result.insertId });
            });
            return;
        }

        // 1. Ubah array jawaban menjadi object/map agar mudah dicari: { '25': '0', '26': '0' }
        const userAnswersMap = answers.reduce((acc, curr) => {
            acc[curr.question_id] = curr.answer;
            return acc;
        }, {});

        // 2. Ambil semua ID pertanyaan DARI JAWABAN YANG DIKIRIM
        const questionIds = answers.map(a => a.question_id);
        
        // 3. Ambil kunci jawaban yang BENAR dari database
        const correctAnswersQuery = `
            SELECT id, correct_answer 
            FROM questions 
            WHERE id IN (?)
        `;

        db.query(correctAnswersQuery, [questionIds], (err, correctAnswers) => {
            if (err) {
                console.error("Error fetching correct answers:", err);
                return res.status(500).send({ message: 'Gagal memproses jawaban.' });
            }

            let correctCount = 0;
            correctAnswers.forEach(correctAnswerRow => {
                const questionId = correctAnswerRow.id;
                
                // Ambil jawaban user dari map yang sudah kita buat
                const userChoiceIndex = parseInt(userAnswersMap[questionId], 10);
                
                // Konversi huruf jawaban (A, B, C) ke index (0, 1, 2)
                const correctAnswerLetter = correctAnswerRow.correct_answer.trim().toUpperCase();
                const correctChoiceIndex = correctAnswerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
                
                if (userChoiceIndex === correctChoiceIndex) {
                    correctCount++;
                }
            });

            const totalQuestions = questionIds.length;
            const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
            const finalScore = Math.round(score);

            // Simpan sesi tes ke database
            const insertQuery = 'INSERT INTO test_sessions (user_id, score) VALUES (?, ?)';
            db.query(insertQuery, [userId, finalScore], (err, result) => {
                if (err) {
                    console.error("Error saat menyimpan sesi tes:", err);
                    return res.status(500).send({ message: 'Gagal menyimpan hasil tes.' });
                }
                res.status(201).json({ message: 'Hasil tes berhasil disimpan.', score: finalScore, sessionId: result.insertId });
            });
        });
        
        // --- AKHIR PERBAIKAN ---
    });

    return router;
};