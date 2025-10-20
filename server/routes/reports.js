const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const reportQueries = {
        users: {
            query: `SELECT id, name, email, role, date_of_birth, created_at FROM users ORDER BY created_at DESC`,
            transform: (rows) => rows.map(row => ({
                id: row.id,
                name: row.name,
                email: row.email,
                role: row.role,
                date_of_birth: row.date_of_birth,
                created_at: row.created_at
            }))
        },
        questions: {
            query: `SELECT q.id, c.name AS category, q.question_text, q.question_type, q.options, q.correct_answer, q.status
                     FROM questions q
                     LEFT JOIN categories c ON q.category_id = c.id
                     ORDER BY c.name, q.id`,
            transform: (rows) => rows.map(row => ({
                id: row.id,
                category: row.category,
                question_text: row.question_text,
                question_type: row.question_type,
                options: (() => {
                    try {
                        return row.options ? JSON.parse(row.options) : [];
                    } catch (err) {
                        return row.options;
                    }
                })(),
                correct_answer: row.correct_answer,
                status: row.status
            }))
        },
        'test-results': {
            query: `SELECT ts.id, u.name AS user_name, u.email AS user_email, ts.score, ts.created_at
                     FROM test_sessions ts
                     INNER JOIN users u ON u.id = ts.user_id
                     ORDER BY ts.created_at DESC`,
            transform: (rows) => rows.map(row => ({
                id: row.id,
                user_name: row.user_name,
                user_email: row.user_email,
                score: row.score,
                created_at: row.created_at
            }))
        },
        assignments: {
            query: `SELECT ua.id, u.name AS user_name, u.email AS user_email, q.id AS question_id, q.question_text, c.name AS category
                     FROM user_assignments ua
                     INNER JOIN users u ON ua.user_id = u.id
                     INNER JOIN questions q ON ua.question_id = q.id
                     LEFT JOIN categories c ON q.category_id = c.id
                     ORDER BY u.name, q.id`,
            transform: (rows) => rows.map(row => ({
                id: row.id,
                user_name: row.user_name,
                user_email: row.user_email,
                question_id: row.question_id,
                question_text: row.question_text,
                category: row.category
            }))
        }
    };

    router.get('/', (req, res) => {
        const { type } = req.query;
        if (!type) {
            return res.status(400).json({ message: 'Parameter "type" wajib diisi.' });
        }

        const reportConfig = reportQueries[type];
        if (!reportConfig) {
            return res.status(400).json({ message: 'Tipe report tidak dikenali.' });
        }

        db.query(reportConfig.query, (err, rows) => {
            if (err) {
                console.error('Gagal membuat report:', err);
                return res.status(500).json({ message: 'Gagal mengambil data report.' });
            }

            const data = reportConfig.transform(rows);
            res.json({
                type,
                generated_at: new Date().toISOString(),
                record_count: data.length,
                data
            });
        });
    });

    return router;
};
