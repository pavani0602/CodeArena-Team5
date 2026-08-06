import { useState, useEffect } from 'react';
import './Admin.css';
import { FaList, FaUser } from 'react-icons/fa';
import { fetchApi } from '../../services/api';
import { useTranslation } from 'react-i18next';

function AdminUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetchApi('/api/admin/users');
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
                setError(t('errors.adminUsersError'));
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-dashboard-container animate-fade-in">
            <div className="admin-page-header">
                <h2>{t('admin.users.title')}</h2>
                <p>{t('admin.users.subtitle')}</p>
            </div>

            <div className="admin-panel-card animate-fade-in">
                <div className="card-header-accent">
                    <FaList /> <span>User Index</span>
                </div>
                
                {loading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>{t('admin.users.loading')}</div>
                ) : error ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-problems-table">
                            <thead>
                                <tr>
                                    <th>{t('admin.users.headers.id')}</th>
                                    <th>{t('admin.users.headers.username')}</th>
                                    <th>{t('admin.users.headers.email')}</th>
                                    <th>{t('admin.users.headers.role')}</th>
                                    <th>{t('admin.users.headers.joined')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((user) => (
                                    <tr key={user.id} className="admin-table-row">
                                        <td>#{user.id}</td>
                                        <td className="prob-title-cell">
                                            <FaUser style={{marginRight: '8px', color: 'var(--accent-primary)'}}/> 
                                            {user.username}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
                                            {t('admin.users.empty')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;
