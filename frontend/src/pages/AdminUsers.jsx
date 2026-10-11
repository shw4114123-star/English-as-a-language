import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../hooks/useAdminApi';
import { useAuthStore } from '../store/authStore';

export const AdminUsers = () => {
    const { currentUser } = useAuthStore();
    const { usersList, loading, error, fetchAllUsers, fetchUpdateUserRole, fetchDeleteUser } = useAdminApi();

    const [searchTerm, setSearchTerm] = useState('');
    const [actionMessage, setActionMessage] = useState(null);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const res = await fetchUpdateUserRole(userId, newRole);
        if (res) {
            setActionMessage(`User role successfully changed to ${newRole}`);
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            const success = await fetchDeleteUser(userId);
            if (success) {
                setActionMessage(`User "${userName}" was deleted.`);
                setTimeout(() => setActionMessage(null), 3000);
            }
        }
    };

    const filteredUsers = usersList.filter(u =>
        u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5 fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">User Management & Permissions</h2>
                    <p className="text-muted mb-0">Control roles, inspect accounts, and manage students and staff.</p>
                </div>

                <div className="max-w-xs w-full">
                    <input
                        type="text"
                        className="form-control rounded-pill"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {actionMessage && (
                <div className="alert alert-success py-2 mb-4">{actionMessage}</div>
            )}

            {error && (
                <div className="alert alert-danger py-2 mb-4">{error}</div>
            )}

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="px-4 py-3">User</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Current Role</th>
                                <th className="py-3">Change Role</th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold text-dark">{user.fullName || user.userName}</div>
                                            <small className="text-muted">@{user.userName}</small>
                                        </td>
                                        <td className="py-3 text-secondary">{user.email}</td>
                                        <td className="py-3">
                                            <span className={`badge ${
                                                user.role === 'admin' ? 'bg-danger' :
                                                user.role === 'teacher' ? 'bg-primary' : 'bg-secondary'
                                            } px-3 py-2 rounded-pill`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <select
                                                className="form-select form-select-sm w-auto rounded-3"
                                                value={user.role}
                                                disabled={user._id === currentUser?._id}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
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
