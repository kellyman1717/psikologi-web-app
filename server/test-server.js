const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001; // Kita tetap gunakan port yang sama

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webapp_db'
});

db.connect(err => {
    if (err) {
        console.error('SERVER TES: GAGAL terhubung ke database.', err);
        return;
    }
    console.log('SERVER TES: Berhasil terhubung ke database.');
});

// Endpoint tes yang sangat sederhana, tanpa login, tanpa token
app.get('/test-users', (req, res) => {
    console.log("\n[LOG] Endpoint /test-users diakses!");
    const query = "SELECT id, name, email, role FROM users";

    db.query(query, (err, results) => {
        if (err) {
            console.error("[LOG] GAGAL menjalankan query:", err);
            return res.status(500).json({ message: "Query ke database gagal." });
        }
        console.log(`[LOG] SUKSES, ditemukan ${results.length} pengguna. Mengirim data...`);
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`SERVER TES berjalan di http://localhost:${PORT}`);
    console.log('Akses endpoint ini dari browser atau frontend: http://localhost:3001/test-users');
});