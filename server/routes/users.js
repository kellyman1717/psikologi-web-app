const express = require('express');
const router = express.Router();

// Router untuk assignment akan diimpor di dalam fungsi agar `db` tersedia
module.exports = (db, bcrypt) => {
    
    // 1. Impor dan inisialisasi router assignment DI SINI
    const assignmentsRouter = require('./assignments')(db);

    // 2. Gunakan router assignment untuk rute bersarang
    router.use('/:userId/assignments', assignmentsRouter);

    // GET semua pengguna
    router.get('/', (req, res) => {
        db.query("SELECT id, name, email, role FROM users", (err, results) => {
            if (err) return res.status(500).send({ message: 'Error mengambil data pengguna.' });
            res.json(results);
        });
    });

    // POST (tambah) pengguna baru
    router.post('/', async (req, res) => {
        const { name, email, password, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role], (err, result) => {
                if (err) return res.status(500).send({ message: 'Gagal menambah pengguna.' });
                res.status(201).send({ message: 'Pengguna berhasil ditambah.' });
            });
        } catch (error) {
            res.status(500).json({ message: "Server error saat hashing password." });
        }
    });

    // PUT (edit) pengguna
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { name, email, role, password, date_of_birth } = req.body;
        let query, params;
        
        try {
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                query = "UPDATE users SET name = ?, email = ?, role = ?, password = ?, date_of_birth = ? WHERE id = ?";
                params = [name, email, role, hashedPassword, date_of_birth, id];
            } else {
                query = "UPDATE users SET name = ?, email = ?, role = ?, date_of_birth = ? WHERE id = ?";
                params = [name, email, role, date_of_birth, id];
            }
            db.query(query, params, (err, result) => {
                if (err) return res.status(500).send({ message: 'Gagal mengedit pengguna.' });
                res.send({ message: 'Pengguna berhasil diedit.' });
            });
        } catch (error) {
            res.status(500).json({ message: "Server error saat mengedit pengguna." });
        }
    });

    // DELETE pengguna
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        if (req.user.id == id) { // Mencegah admin menghapus diri sendiri
            return res.status(400).send({ message: 'Tidak bisa menghapus diri sendiri.' });
        }
        db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal menghapus pengguna.' });
            if (result.affectedRows === 0) return res.status(404).send({ message: 'Pengguna tidak ditemukan.'});
            res.send({ message: 'Pengguna berhasil dihapus.' });
        });
    });

    return router;
};