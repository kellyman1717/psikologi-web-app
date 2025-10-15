const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // POST /api/test/submit
    router.post('/submit', async (req, res) => {
        const { answers } = req.body; // Expects: [{ question_id: 1, answer: 'A' }, ...]
        const userId = req.user.id;

        if (!answers || answers.length === 0) {
            return res.status(400).send({ message: 'Tidak ada jawaban yang dikirim.' });
        }

        const questionIds = answers.map(a => a.question_id);
        const getAnswersQuery = "SELECT id, correct_answer FROM questions WHERE id IN (?)";

        db.query(getAnswersQuery, [questionIds], (err, correctAnswers) => {
            if (err) {
                return res.status(500).send({ message: 'Error saat mengambil kunci jawaban.' });
            }

            let score = 0;
            const answerLog = [];
            const answerMap = new Map(correctAnswers.map(a => [a.id, a.correct_answer]));

            for (const userAnswer of answers) {
                const isCorrect = userAnswer.answer === answerMap.get(userAnswer.question_id);
                if (isCorrect) {
                    score++;
                }
                answerLog.push({
                    question_id: userAnswer.question_id,
                    user_answer: userAnswer.answer,
                    is_correct: isCorrect,
                });
            }

            const finalScore = Math.round((score / answers.length) * 100);

            // Simpan ke database
            db.beginTransaction(err => {
                if (err) return res.status(500).send({ message: 'Gagal memulai transaksi.' });

                // 1. Buat sesi tes
                const sessionQuery = "INSERT INTO test_sessions (user_id, score) VALUES (?, ?)";
                db.query(sessionQuery, [userId, finalScore], (err, sessionResult) => {
                    if (err) {
                        return db.rollback(() => res.status(500).send({ message: 'Gagal menyimpan sesi tes.' }));
                    }

                    const sessionId = sessionResult.insertId;
                    const answerValues = answerLog.map(log => [sessionId, log.question_id, log.user_answer, log.is_correct]);
                    const answersQuery = "INSERT INTO test_answers (session_id, question_id, user_answer, is_correct) VALUES ?";

                    // 2. Simpan semua jawaban
                    db.query(answersQuery, [answerValues], (err, answersResult) => {
                        if (err) {
                            return db.rollback(() => res.status(500).send({ message: 'Gagal menyimpan jawaban tes.' }));
                        }

                        // 3. Commit transaksi
                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).send({ message: 'Gagal menyelesaikan transaksi.' }));
                            res.status(201).json({
                                message: 'Tes berhasil diselesaikan!',
                                score: finalScore,
                                totalQuestions: answers.length,
                                correctCount: score
                            });
                        });
                    });
                });
            });
        });
    });

    return router;
};