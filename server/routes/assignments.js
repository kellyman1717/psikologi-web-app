const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // GET semua pertanyaan dan status assignment untuk user tertentu
    router.get('/user/:userId', (req, res) => {
        const { userId } = req.params;
        const query = `
            SELECT q.id, q.question_text, c.name as category, 
            (SELECT COUNT(*) FROM user_assignments ua WHERE ua.question_id = q.id AND ua.user_id = ?) > 0 AS is_assigned
            FROM questions q JOIN categories c ON q.category_id = c.id
        `;
        db.query(query, [userId], (err, results) => {
            if (err) return res.status(500).send({ message: 'Error mengambil data assignment.' });
            res.json(results);
        });
    });

    // POST untuk mengupdate assignment
    router.post('/user/:userId', (req, res) => {
        const { userId } = req.params;
        const { questionIds } = req.body; // Array berisi ID pertanyaan yang di-assign

        db.query("DELETE FROM user_assignments WHERE user_id = ?", [userId], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal menghapus assignment lama.' });

            if (questionIds && questionIds.length > 0) {
                const values = questionIds.map(qId => [userId, qId]);
                db.query("INSERT INTO user_assignments (user_id, question_id) VALUES ?", [values], (err, result) => {
                    if (err) return res.status(500).send({ message: 'Gagal menyimpan assignment baru.' });
                    res.send({ message: 'Assignment berhasil diperbarui.' });
                });
            } else {
                res.send({ message: 'Semua assignment untuk user ini telah dihapus.' });
            }
        });
    });
    return router;
};