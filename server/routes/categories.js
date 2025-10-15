const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // GET semua kategori
    router.get('/', (req, res) => {
        const query = "SELECT * FROM categories ORDER BY name";
        db.query(query, (err, results) => {
            if (err) return res.status(500).send({ message: 'Error mengambil daftar kategori.' });
            res.json(results);
        });
    });

    return router;
};