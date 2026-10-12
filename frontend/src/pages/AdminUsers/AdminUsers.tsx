import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { useAuthStore } from '../../store/authStore';
import './AdminUsers.css';

interface User {
    _id: string;
    userName: string;
    fullName?: string;
    email: string;
    role: string;
}

export const AdminUsers: React.FC = () => {
    const { currentUser } = useAuthStore();
    const { usersList, loading, error, fetchAllUsers, fetchUpdateUserRole, fetchDeleteUser } = useAdminApi();

    const [searchTerm, setSearchTerm] = useState('');
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        const res = await fetchUpdateUserRole(userId, newRole);
        if (res) {
            setActionMessage(`User role successfully changed to ${newRole}`);
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            const success = await fetchDeleteUser(userId);
            if (success) {
                setActionMessage(`User "${userName}" was deleted.`);
                setTimeout(() => setActionMessage(null), 3000);
            }
        }
    };

    const filteredUsers: User[] = (usersList as User[] || []).filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5 fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{
                        fontSize: '2rem',
                        background: 'linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        User Management & Permissions
                    </h2>
                    <p style={{ color: '#c4b5fd', margin: 0 }}>Control roles, inspect accounts, and manage students and staff.</p>
                </div>

                <div style={{ maxWidth: '320px', width: '100%' }}>
                    <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '9999px' }}
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {actionMessage && (
                <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    {actionMessage}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <div className="admin-table-card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Change Role</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#c4b5fd' }}>
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#8b7cb8' }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{user.fullName || user.userName}</div>
                                            <small style={{ color: '#a78bfa' }}>@{user.userName}</small>
                                        </td>
                                        <td style={{ color: '#c4b5fd' }}>{user.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.25)' : user.role === 'teacher' ? 'rgba(124, 58, 237, 0.35)' : 'rgba(59, 130, 246, 0.25)',
                                                color: user.role === 'admin' ? '#fca5a5' : user.role === 'teacher' ? '#c084fc' : '#93c5fd',
                                                border: '1px solid currentColor'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="admin-select"
                                                value={user.role}
                                                disabled={user._id === currentUser?._id}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="admin-delete-btn"
                                                disabled={user._id === currentUser?._id || user.role === 'admin'}
                                                onClick={() => handleDelete(user._id, user.userName)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AdminUsers;
