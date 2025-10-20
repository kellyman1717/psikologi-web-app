const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // GET /api/activity/recent-logins?limit=8
  router.get('/recent-logins', (req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 100);
    const sql = `
      SELECT 
        la.id, 
        la.user_id, 
        u.name AS user_name, 
        u.email AS email, 
        la.logged_in_at, 
        la.ip_address 
      FROM login_activity la
      JOIN users u ON u.id = la.user_id
      ORDER BY la.logged_in_at DESC
      LIMIT ?;
    `;
    db.query(sql, [limit], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal memuat recent logins' });
      return res.json(rows);
    });
  });

  // GET /api/activity/recent-tests?limit=8
  router.get('/recent-tests', (req, res) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 100);
    const sql = `
      SELECT 
        tr.id, 
        tr.user_id, 
        u.name AS user_name, 
        tr.score, 
        tr.created_at 
      FROM test_results tr
      JOIN users u ON u.id = tr.user_id
      ORDER BY tr.created_at DESC
      LIMIT ?;
    `;
    db.query(sql, [limit], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal memuat recent tests' });
      return res.json(rows);
    });
  });

  return router;
};
