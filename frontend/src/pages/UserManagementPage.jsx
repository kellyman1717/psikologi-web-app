import React, { useState, useEffect } from 'react';
import AssignQuestionsModal from '../components/AssignQuestionsModal';

// --- Komponen Modal (Tidak ada perubahan) ---
const UserModal = ({ isOpen, onClose, onSubmit, userToEdit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const isEditMode = !!userToEdit;
    useEffect(() => {
        if (isOpen) {
            if (isEditMode) setFormData({ name: userToEdit.name, email: userToEdit.email, password: '', role: userToEdit.role });
            else setFormData({ name: '', email: '', password: '', role: 'user' });
        }
    }, [userToEdit, isOpen]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">{isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={isEditMode ? "Kosongkan jika tidak ganti" : ""} required={!isEditMode} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Batal</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">{isEditMode ? 'Simpan' : 'Tambah'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
const UserManagementPage = ({ showToast }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [userToAssign, setUserToAssign] = useState(null);
    
    const fetchUsers = async () => { /* ... kode sama ... */ };
    useEffect(() => { fetchUsers(); }, []);
    
    const handleOpenModal = (user = null) => { setUserToEdit(user); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setUserToEdit(null); };
    const handleOpenAssignModal = (user) => { setUserToAssign(user); setIsAssignModalOpen(true); };
    const handleCloseAssignModal = () => { setIsAssignModalOpen(false); setUserToAssign(null); };
    
    // --- FUNGSI INI TELAH DIPERBARUI DENGAN LOGGING DETAIL ---
    const handleFormSubmit = async (formData) => {
        console.log("DEBUG: [1] handleFormSubmit dipanggil dengan data:", formData);
        const url = userToEdit ? `http://localhost:3001/api/users/${userToEdit.id}` : 'http://localhost:3001/api/users';
        const method = userToEdit ? 'PUT' : 'POST';
        
        try {
            const token = localStorage.getItem('token');
            console.log("DEBUG: [2] Token ditemukan:", token ? "Ya" : "Tidak");
            console.log(`DEBUG: [3] Mencoba mengirim request ${method} ke ${url}`);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            console.log("DEBUG: [4] Menerima respons dari server dengan status:", response.status);
            const data = await response.json();
            
            if (!response.ok) {
                console.error("DEBUG: [5] Respons server tidak OK:", data.message);
                throw new Error(data.message);
            }
            
            console.log("DEBUG: [6] Request berhasil!");
            showToast(userToEdit ? 'Pengguna berhasil diperbarui!' : 'Pengguna berhasil ditambahkan!');
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            console.error("DEBUG: [CATCH] Terjadi error:", err);
            showToast(`Error: ${err.message}`, 'error');
        }
    };
    
    const handleDeleteUser = async (userId, userName) => { /* ... kode sama ... */ };
    
    if (loading) return <p className="text-center dark:text-white">Memuat data pengguna...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    
    const adminUsers = users.filter(user => user.role === 'admin');
    const regularUsers = users.filter(user => user.role === 'user');
    
    return (
        <>
            <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} userToEdit={userToEdit} />
            <AssignQuestionsModal isOpen={isAssignModalOpen} onClose={handleCloseAssignModal} user={userToAssign} showToast={showToast} />
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pengguna Admin</h3>
                        <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Tambah Pengguna</button>
                    </div>
                    <UserTable users={adminUsers} onEdit={handleOpenModal} onDelete={handleDeleteUser} onAssign={handleOpenAssignModal} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pengguna Penjawab</h3>
                    </div>
                    <UserTable users={regularUsers} onEdit={handleOpenModal} onDelete={handleDeleteUser} onAssign={handleOpenAssignModal} />
                </div>
            </div>
        </>
    );
};

// Salin fungsi yang tidak berubah ke sini
const fetchUsers = async () => {};
const handleDeleteUser = async (userId, userName) => {};

export default UserManagementPage;