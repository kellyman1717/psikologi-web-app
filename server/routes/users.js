const express = require('express');
const router = express.Router();

module.exports = (db, bcrypt) => {
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
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal menambah pengguna.' });
            res.status(201).send({ message: 'Pengguna berhasil ditambah.' });
        });
    });

    // PUT (edit) pengguna
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { name, email, role, password } = req.body;
        let query, params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?";
            params = [name, email, role, hashedPassword, id];
        } else {
            query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
            params = [name, email, role, id];
        }
        db.query(query, params, (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal mengedit pengguna.' });
            res.send({ message: 'Pengguna berhasil diedit.' });
        });
    });

    // DELETE pengguna
    router.delete('/:id', (req, res) => {
        const { id } = req.params;
        if (req.user.id == id) { // Mencegah admin menghapus diri sendiri
            return res.status(400).send({ message: 'Tidak bisa menghapus diri sendiri.' });
        }
        db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).send({ message: 'Gagal menghapus pengguna.' });
            res.send({ message: 'Pengguna berhasil dihapus.' });
        });
    });

    return router;
};