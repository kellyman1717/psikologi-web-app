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

// --- ROUTE IMPORTS ---
const usersRoutes = require('./routes/users')(db, bcrypt);
const questionsRoutes = require('./routes/questions')(db);
const testResultsRoutes = require('./routes/testResults')(db);
const testRoutes = require('./routes/test')(db);
const profileRoutes = require('./routes/profile')(db);
const categoryRoutes = require('./routes/categories')(db);
const reportsRoutes = require('./routes/reports')(db);
const activityRoutes = require('./routes/activity')(db);

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

        // Generate JWT token
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        // Log login activity
        const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '')
            .toString()
            .split(',')[0]
            .trim() || null;

        const ua = req.headers['user-agent'] || null;

        db.query(
            'INSERT INTO login_activity (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
            [user.id, ip, ua],
            () => {}
        );


        res.json({ token, user: { name: user.name, role: user.role } });
    });
});

// --- GUNAKAN ROUTER UNTUK MANAJEMEN PENGGUNA ---
app.use('/api/users', authenticateToken, isAdmin, usersRoutes);

// --- GUNAKAN ROUTER UNTUK PERTANYAAN ---
app.use('/api/questions', authenticateToken, questionsRoutes);

app.use('/api/test', authenticateToken, testRoutes);

app.use('/api/test-results', authenticateToken, testResultsRoutes);

app.use('/api/profile', authenticateToken, profileRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/reports', authenticateToken, isAdmin, reportsRoutes);
app.use('/api/activity', authenticateToken, isAdmin, activityRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server utama berjalan di http://localhost:${PORT}`);
});
