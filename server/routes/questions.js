const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // GET semua pertanyaan (dengan logika role-based)
    router.get('/', (req, res) => {
        if (req.user.role === 'admin') {
            // Admin mendapatkan semua data, termasuk jawaban
            const query = `
                SELECT q.id, q.question_text, c.name as category, q.question_type, q.options, q.correct_answer 
                FROM questions q 
                JOIN categories c ON q.category_id = c.id
            `;
            db.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error mengambil pertanyaan untuk admin.' });
                res.json(results);
            });
        } else {
            // User hanya mendapatkan soal pilihan ganda yang aktif dan ditugaskan, tanpa kunci jawaban
            const query = `
                SELECT q.id, q.question_text, c.name as category, q.question_type, q.options
                FROM questions q 
                JOIN categories c ON q.category_id = c.id 
                JOIN user_assignments ua ON q.id = ua.question_id 
                WHERE ua.user_id = ? AND q.status = 'Active' AND q.question_type = 'multiple_choice'
            `;
            db.query(query, [req.user.id], (err, results) => {
                if (err) return res.status(500).send({ message: 'Error mengambil pertanyaan untuk user.' });
                res.json(results);
            });
        }
    });

    // POST (buat) pertanyaan baru (khusus admin)
    router.post('/', (req, res) => {
        const { question_text, category_id, question_type, options, correct_answer } = req.body;
        const query = "INSERT INTO questions (question_text, category_id, question_type, options, correct_answer, status) VALUES (?, ?, ?, ?, ?, 'Active')";
        const params = [question_text, category_id, question_type, JSON.stringify(options), correct_answer];
        
        db.query(query, params, (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal membuat pertanyaan baru.', error: err });
            res.status(201).send({ message: 'Pertanyaan berhasil dibuat.', insertId: result.insertId });
        });
    });

    // PUT (edit) pertanyaan (khusus admin)
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { question_text, category_id, question_type, options, correct_answer } = req.body;
        const query = `
            UPDATE questions 
            SET question_text = ?, category_id = ?, question_type = ?, options = ?, correct_answer = ? 
            WHERE id = ?
        `;
        const params = [question_text, category_id, question_type, JSON.stringify(options), correct_answer, id];

        db.query(query, params, (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal memperbarui pertanyaan.', error: err });
            if (result.affectedRows === 0) return res.status(404).send({ message: 'Pertanyaan tidak ditemukan.' });
            res.send({ message: 'Pertanyaan berhasil diperbarui.' });
        });
    });

    // DELETE pertanyaan (khusus admin)
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        db.query("DELETE FROM questions WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal menghapus pertanyaan.', error: err });
            if (result.affectedRows === 0) return res.status(404).send({ message: 'Pertanyaan tidak ditemukan.' });
            res.send({ message: 'Pertanyaan berhasil dihapus.' });
        });
    });

    return router;
};