const express = require('express');
const router = express.Router();

module.exports = (db, bcrypt, jwt, JWT_SECRET) => {
    router.post('/', (req, res) => {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE name = ?';

        db.query(query, [username.trim()], async (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).send({ message: 'Username atau password salah.' });
            }
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).send({ message: 'Username atau password salah.' });
            }
            const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { name: user.name, role: user.role } });
        });
    });
    return router;
};