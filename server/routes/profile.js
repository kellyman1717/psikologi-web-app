const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // GET /api/profile - Mendapatkan data profil user yang sedang login
    router.get('/', (req, res) => {
        // Ambil data user, KECUALI password
        const query = "SELECT id, name, email, role, date_of_birth FROM users WHERE id = ?";
        db.query(query, [req.user.id], (err, results) => {
            if (err) return res.status(500).send({ message: 'Gagal mengambil data profil.' });
            if (results.length === 0) return res.status(404).send({ message: 'User tidak ditemukan.' });
            res.json(results[0]);
        });
    });

    // PUT /api/profile - Memperbarui profil user yang sedang login
    router.put('/', (req, res) => {
        const { name, date_of_birth } = req.body;
        const userId = req.user.id;

        // User hanya bisa mengubah nama dan tanggal lahir mereka sendiri
        const query = "UPDATE users SET name = ?, date_of_birth = ? WHERE id = ?";
        db.query(query, [name, date_of_birth, userId], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal memperbarui profil.' });
            res.send({ message: 'Profil berhasil diperbarui.' });
        });
    });

    return router;
};