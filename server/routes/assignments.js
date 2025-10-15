const express = require('express');
const router = express.Router({ mergeParams: true }); // Pastikan mergeParams: true

module.exports = (db) => {
    // GET /api/users/:userId/assignments
    router.get('/', (req, res) => {
        const { userId } = req.params;
        const query = "SELECT question_id FROM user_assignments WHERE user_id = ?";
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching assignments:", err);
                return res.status(500).send({ message: 'Error fetching assignments.' });
            }
            res.json(results);
        });
    });

    // POST /api/users/:userId/assignments
    router.post('/', (req, res) => {
        const { userId } = req.params;
        const { questionIds } = req.body; // Array of IDs from frontend

        db.beginTransaction(err => {
            if (err) return res.status(500).send({ message: 'Transaction start error.' });

            // 1. Hapus semua assignment lama untuk user ini
            db.query("DELETE FROM user_assignments WHERE user_id = ?", [userId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).send({ message: 'Failed to clear old assignments.' });
                    });
                }

                // Jika tidak ada pertanyaan baru yang dipilih, proses selesai di sini
                if (!questionIds || questionIds.length === 0) {
                    return db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).send({ message: 'Commit error.' }));
                        res.status(200).send({ message: 'Assignments cleared successfully.' });
                    });
                }

                // 2. Siapkan dan masukkan assignment yang baru
                const values = questionIds.map(id => [userId, id]);
                const insertQuery = "INSERT INTO user_assignments (user_id, question_id) VALUES ?";

                db.query(insertQuery, [values], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send({ message: 'Failed to insert new assignments.' });
                        });
                    }

                    // 3. Commit transaksi jika semua berhasil
                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).send({ message: 'Commit transaction error.' }));
                        res.status(200).send({ message: 'Assignments updated successfully.' });
                    });
                });
            });
        });
    });

    return router;
};