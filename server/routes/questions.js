const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        let query;
        if (req.user.role === 'admin') {
            query = "SELECT q.id, q.question_text, c.name as category, q.status FROM questions q JOIN categories c ON q.category_id = c.id";
            db.query(query, (err, results) => {
                if (err) return res.status(500).send({ message: 'Error mengambil pertanyaan.' });
                res.json(results);
            });
        } else {
            query = "SELECT q.id, q.question_text, c.name as category FROM questions q JOIN categories c ON q.category_id = c.id JOIN user_assignments ua ON q.id = ua.question_id WHERE ua.user_id = ? AND q.status = 'Active'";
            db.query(query, [req.user.id], (err, results) => {
                if (err) return res.status(500).send({ message: 'Error mengambil pertanyaan.' });
                res.json(results);
            });
        }
    });
    return router;
};