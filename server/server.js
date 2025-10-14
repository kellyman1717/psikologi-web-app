const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webapp_db'
});

db.connect(err => {
    if (err) {
        console.error('ERROR: Gagal terhubung ke database XAMPP.', err);
        return;
    }
    console.log('Berhasil terhubung ke database.');
});

const JWT_SECRET = 'kunci_rahasia_untuk_aplikasi_anda';

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
    }
    next();
};

// --- ENDPOINT OTENTIKASI ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE name = ?';

    db.query(query, [username.trim()], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) return res.status(401).json({ message: 'Username atau password salah' });

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: 'Username atau password salah' });

        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { name: user.name, role: user.role } });
    });
});

// --- ENDPOINT MANAJEMEN PENGGUNA ---
app.get('/api/users', authenticateToken, isAdmin, (req, res) => {
    const query = "SELECT id, name, email, role, created_at FROM users";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Server error saat mengambil pengguna." });
        res.json(results);
    });
});

app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: "Semua field harus diisi." });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        db.query(query, [name, email, hashedPassword, role], (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal membuat pengguna." });
            res.status(201).json({ message: "Pengguna berhasil dibuat." });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

app.put('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
    // ... (kode untuk edit pengguna)
});

app.delete('/api/users/:id', authenticateToken, isAdmin, (req, res) => {
    // ... (kode untuk hapus pengguna)
});

// --- ENDPOINT PERTANYAAN ---
app.get('/api/questions', authenticateToken, (req, res) => {
    // ... (kode untuk mengambil pertanyaan)
});

// --- ENDPOINT PENUGASAN ---
app.get('/api/users/:userId/assignments', authenticateToken, isAdmin, (req, res) => {
    // ... (kode untuk mengambil assignment)
});

app.post('/api/users/:userId/assignments', authenticateToken, isAdmin, (req, res) => {
    // ... (kode untuk menyimpan assignment)
});


// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server utama berjalan di http://localhost:${PORT}`);
});