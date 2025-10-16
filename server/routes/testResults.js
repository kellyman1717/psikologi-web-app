const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // Middleware untuk memeriksa apakah pengguna adalah admin
    const isAdmin = (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ message: 'Akses ditolak. Hanya untuk admin.' });
        }
        next();
    };

    // GET /api/test-results
    router.get('/', (req, res) => {
        let query;
        const params = [];

        if (req.user.role === 'admin') {
            // Admin: Ambil semua hasil tes dari semua pengguna, gabungkan dengan nama pengguna
            query = `
                SELECT 
                    ts.id, 
                    u.name AS user_name, 
                    ts.score, 
                    ts.created_at
                FROM test_sessions ts
                JOIN users u ON ts.user_id = u.id
                ORDER BY ts.created_at DESC
            `;
        } else {
            // User biasa: Ambil hanya hasil tes milik sendiri
            query = `
                SELECT 
                    id, 
                    score, 
                    created_at 
                FROM test_sessions 
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;
            params.push(req.user.id);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Error fetching test results:", err);
                return res.status(500).send({ message: 'Gagal mengambil data hasil tes.' });
            }
            res.json(results);
        });
    });

    // GET /api/test-results/:id - Ambil hasil tes tunggal
    router.get('/:id', isAdmin, (req, res) => {
        const { id } = req.params;
        const query = 'SELECT id, score FROM test_sessions WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error("Error fetching test result:", err);
                return res.status(500).send({ message: 'Gagal mengambil data hasil tes.' });
            }
            if (results.length === 0) {
                return res.status(404).send({ message: 'Hasil tes tidak ditemukan.' });
            }
            res.json(results[0]);
        });
    });


    // PUT /api/test-results/:id - Update hasil tes
    router.put('/:id', isAdmin, (req, res) => {
        const { id } = req.params;
        const { score } = req.body;
        const query = 'UPDATE test_sessions SET score = ? WHERE id = ?';
        db.query(query, [score, id], (err, result) => {
            if (err) {
                console.error("Error updating test result:", err);
                return res.status(500).send({ message: 'Gagal memperbarui hasil tes.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'Hasil tes tidak ditemukan.' });
            }
            res.send({ message: 'Hasil tes berhasil diperbarui.' });
        });
    });

    // DELETE /api/test-results/:id - Hapus hasil tes
    router.delete('/:id', isAdmin, (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM test_sessions WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                console.error("Error deleting test result:", err);
                return res.status(500).send({ message: 'Gagal menghapus hasil tes.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'Hasil tes tidak ditemukan.' });
            }
            res.send({ message: 'Hasil tes berhasil dihapus.' });
        });
    });

    return router;
};