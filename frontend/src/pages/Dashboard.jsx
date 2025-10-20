import React, { useEffect, useMemo, useState } from 'react';
import { IconUsers, IconQuestion } from '../components/icons/Icons';

const numberFmt = (n) => new Intl.NumberFormat('id-ID').format(n || 0);

const DashboardPage = ({ currentUser, onNavClick, showToast }) => {
  const role = currentUser?.role || 'user';

  if (role === 'user') {
    return <UserDashboard onNavClick={onNavClick} showToast={showToast} />;
  }

  return <AdminDashboard showToast={showToast} />;
};

const UserDashboard = ({ onNavClick, showToast }) => {
  const [loading, setLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/api/test-results', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal memuat status tes.');
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        setHasCompleted(sorted.length > 0);
        setLatestResult(sorted[0] || null);
      } catch (e) {
        // Tidak fatal untuk dashboard user
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleStart = () => {
    setStarting(true);
    try {
      localStorage.setItem('test_started', 'true');
      onNavClick?.('question-management');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Silakan mulai tes Anda dengan tombol di bawah ini.
        </p>
        <button
          onClick={handleStart}
          disabled={hasCompleted || starting}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Mulai Tes Sekarang
        </button>
        {hasCompleted && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Anda sudah menyelesaikan tes. Pertanyaan tidak akan ditampilkan lagi.
          </p>)
        }
      </div>

      {loading ? (
        <div className="text-center dark:text-white">Memuat ringkasan...</div>
      ) : latestResult ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Ringkasan Hasil Terakhir</h3>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <div>Skor: <span className="font-bold">{latestResult.score}</span></div>
              <div>Tanggal: {new Date(latestResult.created_at).toLocaleString('id-ID')}</div>
            </div>
            <button
              onClick={() => onNavClick?.('test-results')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Lihat detail hasil
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center text-gray-500 dark:text-gray-400">
          Belum ada hasil tes.
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ showToast }) => {
  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [testsCount, setTestsCount] = useState(0);
  const [recentLogins, setRecentLogins] = useState([]);
  const [recentTests, setRecentTests] = useState([]);
  const [activityApiAvailable, setActivityApiAvailable] = useState(true);

  const token = useMemo(() => localStorage.getItem('token'), []);

  const fetchList = async (url) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const err = new Error(data.message || `Gagal memuat ${url}`);
      err.status = res.status;
      throw err;
    }
    return data;
  };

  const normalizeTest = (r) => ({
    id: r.id,
    user_name: r.user_name || r.userName || r.name || r.user || r.email || '-',
    score: r.score ?? r.total_score ?? r.result ?? r.nilai ?? r.score_value ?? null,
    created_at: r.created_at || r.createdAt || r.date || r.tanggal || r.created || null,
  });

  const load = async () => {
    setLoading(true);
    try {
      // Counts from existing endpoints
      const [users, categories, questions, tests] = await Promise.all([
        fetchList('http://localhost:3001/api/users'),
        fetchList('http://localhost:3001/api/categories'),
        fetchList('http://localhost:3001/api/questions'),
        fetchList('http://localhost:3001/api/test-results'),
      ]);
      setUsersCount(Array.isArray(users) ? users.length : 0);
      setCategoriesCount(Array.isArray(categories) ? categories.length : 0);
      setQuestionsCount(Array.isArray(questions) ? questions.length : 0);
      setTestsCount(Array.isArray(tests) ? tests.length : 0);

      const normalizedAllTests = (Array.isArray(tests) ? tests : []).map(normalizeTest);

      // Activity (new endpoints suggested below; fallback to simple derivation)
      if (activityApiAvailable) {
        try {
          const rl = await fetchList('http://localhost:3001/api/activity/recent-logins?limit=8');
          setRecentLogins(Array.isArray(rl) ? rl : []);
        } catch (e) {
          if (e.status === 404) setActivityApiAvailable(false);
          setRecentLogins([]);
        }
      }

      if (activityApiAvailable) {
        try {
          const rt = await fetchList('http://localhost:3001/api/activity/recent-tests?limit=8');
          const normalizedRt = (Array.isArray(rt) ? rt : []).map(normalizeTest);
          if (normalizedRt.length > 0) {
            setRecentTests(normalizedRt);
          } else {
            // Fallback when API returns empty
            setRecentTests(
              normalizedAllTests
                .slice()
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 8)
            );
          }
        } catch (e) {
          if (e.status === 404) setActivityApiAvailable(false);
          // Fallback: take from tests results list
          setRecentTests(
            normalizedAllTests
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 8)
          );
        }
      } else {
        // Fallback if API disabled
        setRecentTests(
          normalizedAllTests
            .slice()
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 8)
        );
      }
    } catch (e) {
      showToast?.(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000); // auto-refresh tiap 15 detik
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{numberFmt(usersCount)}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
            <IconUsers className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Categories</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{numberFmt(categoriesCount)}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
            <IconQuestion className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{numberFmt(questionsCount)}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tests Completed</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{numberFmt(testsCount)}</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-500"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"/></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">User Activity</h3>
            <button onClick={load} className="text-sm px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Waktu Login</th></tr>
              </thead>
              <tbody>
                {recentLogins.length > 0 ? (
                  recentLogins.map((log, idx) => (
                    <tr key={idx} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{log.user_name || log.email || '-'}</td>
                      <td className="px-6 py-3">{log.logged_in_at ? new Date(log.logged_in_at).toLocaleString('id-ID') : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-6 py-4" colSpan={2}>Belum ada data aktivitas login.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Skor</th><th className="px-6 py-3">Tanggal</th></tr>
              </thead>
              <tbody>
                {recentTests.length > 0 ? (
                  recentTests.map((r) => (
                    <tr key={r.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{r.user_name || '-'}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          (r.score || 0) >= 80 ? 'bg-green-100 text-green-800' :
                          (r.score || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>{r.score ?? '-'}</span>
                      </td>
                      <td className="px-6 py-3">{r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="px-6 py-4" colSpan={3}>Belum ada hasil tes terbaru.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
