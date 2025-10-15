import React, { useState, useEffect } from 'react';

// Terima props: showToast, currentUser, webTitle (baru), onTitleChange (baru)
const SettingsPage = ({ showToast, currentUser, webTitle, onTitleChange }) => {
    const [profile, setProfile] = useState({ name: '', date_of_birth: '' });
    const [newTitle, setNewTitle] = useState(webTitle || 'Psikologi App');
    const [loading, setLoading] = useState(true);

    const userRole = currentUser?.role;

    useEffect(() => {
        const fetchProfile = async () => {
            if (userRole === 'user') {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3001/api/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message);
                    
                    const dob = data.date_of_birth ? data.date_of_birth.split('T')[0] : '';
                    setProfile({ name: data.name, date_of_birth: dob });
                } catch (error) {
                    showToast(error.message, 'error');
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [userRole, showToast]);
    
    // --- FUNGSI BARU UNTUK ADMIN ---
    const handleTitleSubmit = (e) => {
        e.preventDefault();
        if (typeof onTitleChange === 'function') {
            onTitleChange(newTitle);
            showToast('Judul website berhasil diperbarui!', 'success');
        }
    };

    // --- FUNGSI UNTUK USER ---
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(profile)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            showToast('Profil berhasil diperbarui!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    if (loading) {
        return <p className="dark:text-white text-center">Memuat...</p>;
    }

    // ================== TAMPILAN UNTUK ADMIN ==================
    if (userRole === 'admin') {
        return (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Pengaturan Website</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm max-w-lg">
                    <form onSubmit={handleTitleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="webTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Website</label>
                            <input 
                                id="webTitle"
                                type="text" 
                                value={newTitle} 
                                onChange={(e) => setNewTitle(e.target.value)} 
                                required 
                                className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Judul ini akan tampil di tab browser.</p>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                Simpan Judul
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
    
    // ================== TAMPILAN UNTUK USER ==================
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Profil</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm max-w-lg">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
                        <input type="text" name="name" value={profile.name} onChange={handleProfileChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                        <input type="date" name="date_of_birth" value={profile.date_of_birth} onChange={handleProfileChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;