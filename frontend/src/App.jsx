import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import QuestionManagementPage from './pages/QuestionManagementPage';
import TestResultsPage from './pages/TestResultsPage';
import UserManagementPage from './pages/UserManagementPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import Toast from './components/Toast';

const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'question-management', label: 'Question Management' },
    { id: 'test-results', label: 'Test Results' },
    { id: 'user-management', label: 'User Management' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
];

const userNavItems = [
    { id: 'question-management', label: 'Question Management' },
    { id: 'test-results', label: 'Test Results' },
];

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeContent, setActiveContent] = useState('dashboard');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setCurrentUser({ name: decodedUser.name, role: decodedUser.role, id: decodedUser.id });
          if(decodedUser.role === 'user') setActiveContent('question-management');
          else setActiveContent('dashboard');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') setActiveContent('dashboard');
    else setActiveContent('question-management');
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('token');
  };

  const handleNavClick = (contentId) => {
    setActiveContent(contentId);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const renderContent = () => {
    if (!currentUser) return null;
    const props = { userRole: currentUser.role, showToast };

    switch(activeContent) {
      case 'dashboard': return <DashboardPage />;
      case 'question-management': return <QuestionManagementPage {...props} />;
      case 'test-results': return <TestResultsPage />;
      case 'user-management': return currentUser.role === 'admin' ? <UserManagementPage {...props} /> : null;
      case 'reports': return currentUser.role === 'admin' ? <ReportsPage /> : null;
      case 'settings': return currentUser.role === 'admin' ? <SettingsPage /> : null;
      default: return currentUser.role === 'admin' ? <DashboardPage /> : <QuestionManagementPage {...props} />;
    }
  };

  if (loading) {
      return <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">Loading...</div>;
  }

  if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
  }

  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;
  const activeTitle = navItems.find(item => item.id === activeContent)?.label || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeContent={activeContent}
        onNavClick={handleNavClick}
        navItems={navItems}
        currentUser={currentUser}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
          title={activeTitle}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          theme={theme}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
          {renderContent()}
        </main>
      </div>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onHide={() => setToast({ ...toast, show: false })} 
        />
      )}
    </div>
  );
}

export default App;