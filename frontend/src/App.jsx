import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './components/layout/sidebarMenu';
import Header from './components/layout/Header';
import DashboardPage from './pages/Dashboard';
import QuestionManagementPage from './pages/pertanyaan';
import TestResultsPage from './pages/hasiltes';
import UserManagementPage from './pages/admindanuser';
import ReportsPage from './pages/Report';
import SettingsPage from './pages/setting';
import LoginPage from './pages/login';
import Toast from './components/popup';
import AssignQuestionsModal from './components/aturPertanyaan';
// --- Impor halaman edit yang baru ---
import EditTestResultPage from './pages/editHasilTes';

// Komponen UserModal sekarang didefinisikan di sini untuk memastikan ia selalu di atas
const UserModal = ({ isOpen, onClose, onSubmit, userToEdit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', date_of_birth: '' });
    const isEditMode = !!userToEdit;
    
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                const dob = userToEdit.date_of_birth ? userToEdit.date_of_birth.split('T')[0] : '';
                setFormData({ name: userToEdit.name, email: userToEdit.email, password: '', role: userToEdit.role, date_of_birth: dob });
            } else {
                setFormData({ name: '', email: '', password: '', role: 'user', date_of_birth: '' });
            }
        }
    }, [userToEdit, isOpen, isEditMode]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Kosongkan jika tidak ganti" : ""} required={!isEditMode} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label><select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"><option value="user">User</option><option value="admin">Admin</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label><input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" /></div>
                    <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Batal</button><button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">{isEditMode ? 'Simpan' : 'Tambah'}</button></div>
                </form>
            </div>
        </div>
    );
};

// Daftar Menu Navigasi
const adminNavItems = [ { id: 'dashboard', label: 'Dashboard' }, { id: 'user-management', label: 'User Management' }, { id: 'question-management', label: 'Question Management' }, { id: 'test-results', label: 'Test Results' }, { id: 'reports', label: 'Reports' }, { id: 'settings', label: 'Settings' }];
const userNavItems = [ { id: 'question-management', label: 'Take Test' }, { id: 'test-results', label: 'My Results' }];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeContent, setActiveContent] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [webTitle, setWebTitle] = useState('Psikologi Web App');

  // --- State untuk semua modal ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [userToAssign, setUserToAssign] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // --- State baru untuk menangani halaman edit ---
  const [editingTestResultId, setEditingTestResultId] = useState(null);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { const savedTitle = localStorage.getItem('webTitle'); if (savedTitle) { setWebTitle(savedTitle); document.title = savedTitle; } else { document.title = webTitle; } }, [webTitle]);
  useEffect(() => { const token = localStorage.getItem('token'); if (token) { try { const decodedUser = jwtDecode(token); if (decodedUser.exp * 1000 < Date.now()) { localStorage.clear(); } else { const userFromStorage = JSON.parse(localStorage.getItem('user')); if (userFromStorage) { setCurrentUser(userFromStorage); setActiveContent(userFromStorage.role === 'admin' ? 'dashboard' : 'question-management'); } } } catch (error) { console.error("Gagal memproses token:", error); localStorage.clear(); } } setLoading(false); }, []);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const handleLogin = (loginData) => { const { token, user } = loginData; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); setCurrentUser(user); setActiveContent(user.role === 'admin' ? 'dashboard' : 'question-management'); showToast('Login berhasil!', 'success'); };
  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); showToast('Anda telah berhasil logout.', 'info'); };
  const handleNavClick = (contentId) => { setActiveContent(contentId); if (window.innerWidth < 1024) setSidebarOpen(false); };
  const handleEditProfile = () => setActiveContent('settings');
  const handleTitleChange = (newTitle) => setWebTitle(newTitle);

  // --- Fungsi untuk mengontrol modal ---
  const handleOpenUserModal = (user = null) => { setUserToEdit(user); setIsUserModalOpen(true); };
  const handleCloseUserModal = () => { setUserToEdit(null); setIsUserModalOpen(false); };
  const handleOpenAssignModal = (user) => { setUserToAssign(user); setIsAssignModalOpen(true); };
  const handleCloseAssignModal = () => { setUserToAssign(null); setIsAssignModalOpen(false); };
  
  // --- Fungsi baru untuk navigasi ke halaman edit ---
  const handleEditTestResult = (id) => setEditingTestResultId(id);
  const handleFinishEditingTestResult = () => setEditingTestResultId(null);


  // --- Logika submit form ---
  const handleUserFormSubmit = async (formData) => {
    const url = userToEdit ? `http://localhost:3001/api/users/${userToEdit.id}` : 'http://localhost:3001/api/users';
    const method = userToEdit ? 'PUT' : 'POST';
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(formData) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request gagal.');
        showToast(userToEdit ? 'Pengguna berhasil diperbarui!' : 'Pengguna berhasil ditambahkan!');
        handleCloseUserModal();
        setForceUpdate(val => val + 1);
    } catch (err) {
        showToast(`Error: ${err.message}`, 'error');
    }
  };

  const renderContent = () => {
    // --- Prioritaskan render halaman edit jika ID-nya ada ---
    if (editingTestResultId) {
        return <EditTestResultPage 
            id={editingTestResultId}
            onFinishEditing={handleFinishEditingTestResult}
            showToast={showToast}
        />;
    }

    if (!currentUser) return null;
    const props = { 
        showToast, 
        currentUser, 
        onNavClick: handleNavClick,
        onOpenUserModal: handleOpenUserModal,
        onOpenAssignModal: handleOpenAssignModal,
        forceUpdate
    };
    switch (activeContent) {
      case 'dashboard': return <DashboardPage />;
      case 'question-management': return <QuestionManagementPage {...props} />;
      // --- Kirim fungsi 'handleEditTestResult' sebagai prop ---
      case 'test-results': return <TestResultsPage {...props} onEditTestResult={handleEditTestResult} />;
      case 'user-management': return currentUser.role === 'admin' ? <UserManagementPage {...props} /> : null;
      case 'reports': return currentUser.role === 'admin' ? <ReportsPage /> : null;
      case 'settings': return <SettingsPage {...props} webTitle={webTitle} onTitleChange={handleTitleChange} />;
      default: return currentUser.role === 'admin' ? <DashboardPage /> : <QuestionManagementPage {...props} />;
    }
  };

  if (loading) { return <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900"><p className="dark:text-white">Loading...</p></div>; }
  if (!currentUser) { return <LoginPage onLogin={handleLogin} showToast={showToast} />; }

  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;
  const activeTitle = navItems.find(item => item.id === activeContent)?.label || 'Settings';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <UserModal isOpen={isUserModalOpen} onClose={handleCloseUserModal} onSubmit={handleUserFormSubmit} userToEdit={userToEdit}/>
      <AssignQuestionsModal isOpen={isAssignModalOpen} onClose={handleCloseAssignModal} user={userToAssign} showToast={showToast} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} activeContent={activeContent} onNavClick={handleNavClick} navItems={navItems} currentUser={currentUser} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} title={editingTestResultId ? 'Edit Hasil Tes' : activeTitle} onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} theme={theme} onLogout={handleLogout} onEditProfile={handleEditProfile} currentUser={currentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, show: false })} />}
    </div>
  );
}

export default App;