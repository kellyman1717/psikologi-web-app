import React, { useState, useEffect, useCallback } from 'react';

// --- Komponen Tabel Pengguna (Tidak ada perubahan) ---
const UserTable = ({ users, onEdit, onDelete, onAssign }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr><th scope="col" className="px-6 py-3">Name</th><th scope="col" className="px-6 py-3">Email</th><th scope="col" className="px-6 py-3">Role</th><th scope="col" className="px-6 py-3">Actions</th></tr>
            </thead>
            <tbody>
                {users.length > 0 ? users.map(user => (
                    <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4 flex space-x-2">
                            <button onClick={() => onEdit(user)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                            <button onClick={() => onDelete(user.id, user.name)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
                            {user.role === 'user' && (<button onClick={() => onAssign(user)} className="text-green-600 dark:text-green-400 hover:underline">Assign</button>)}
                        </td>
                    </tr>
                )) : <tr><td colSpan="4" className="px-6 py-4 text-center">Tidak ada data pengguna.</td></tr>}
            </tbody>
        </table>
    </div>
);

// --- Komponen Utama Halaman ---
const UserManagementPage = ({ showToast, onOpenUserModal, onOpenAssignModal, forceUpdate }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal memuat data pengguna.');
            setUsers(data);
        } catch (err) {
            setError(err.message);
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    // `useEffect` sekarang juga bergantung pada `forceUpdate` untuk memuat ulang data
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, forceUpdate]);
    
    // Logika delete tetap di sini
    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"?`)) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Gagal menghapus pengguna.');
                showToast('Pengguna berhasil dihapus!');
                fetchUsers(); // Muat ulang data
            } catch (err) {
                showToast(`Error: ${err.message}`, 'error');
            }
        }
    };
    
    if (loading) return <p className="text-center dark:text-white">Memuat data pengguna...</p>;
    if (error && users.length === 0) return <p className="text-center text-red-500">{error}</p>;
    
    const adminUsers = users.filter(user => user.role === 'admin');
    const regularUsers = users.filter(user => user.role === 'user');
    
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pengguna Admin</h3>
                    <button onClick={() => onOpenUserModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Tambah Pengguna
                    </button>
                </div>
                <UserTable users={adminUsers} onEdit={onOpenUserModal} onDelete={handleDeleteUser} onAssign={onOpenAssignModal} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pengguna Penjawab</h3>
                </div>
                <UserTable users={regularUsers} onEdit={onOpenUserModal} onDelete={handleDeleteUser} onAssign={onOpenAssignModal} />
            </div>
        </div>
    );
};

export default UserManagementPage;