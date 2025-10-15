const express = require('express');
const router = express.Router();

module.exports = (db) => {
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

    return router;
};