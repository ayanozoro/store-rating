import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import {
  Shield,
  Users,
  Store,
  Star,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Mail,
  Award
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'users' | 'stores'
  const [activeTab, setActiveTab] = useState('users');

  // User Filter & Search
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [userSortField, setUserSortField] = useState('createdAt');
  const [userSortOrder, setUserSortOrder] = useState('desc');

  // Store Filter & Search
  const [storeSearch, setStoreSearch] = useState('');
  const [storeSortField, setStoreSortField] = useState('createdAt');
  const [storeSortOrder, setStoreSortOrder] = useState('desc');

  // Modals
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // New Store Form State
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'STORE_OWNER',
  });

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await api.get('/admin/dashboard');
      if (statsRes.data?.success) {
        setStats(statsRes.data.data.stats || statsRes.data.data);
      }

      // 2. Fetch Users & Stores in parallel
      await Promise.all([fetchUsers(), fetchStores()]);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = {
        sortBy: userSortField,
        order: userSortOrder,
      };
      if (userSearch.trim()) params.search = userSearch.trim();
      if (roleFilter) params.role = roleFilter;

      const usersRes = await api.get('/admin/users', { params });
      if (usersRes.data?.success) {
        setUsers(usersRes.data.data.users || usersRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const params = { limit: 100 };
      if (storeSearch.trim()) params.search = storeSearch.trim();
      params.sortBy = storeSortField === 'rating' ? 'createdAt' : storeSortField;
      params.order = storeSortOrder;

      const storesRes = await api.get('/stores', { params });
      if (storesRes.data?.success) {
        const storeList = Array.isArray(storesRes.data.data) ? storesRes.data.data : (storesRes.data.data?.stores || []);
        setStores(storeList);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, userSortField, userSortOrder]);

  useEffect(() => {
    fetchStores();
  }, [storeSortField, storeSortOrder]);

  const handleSearchUsers = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSearchStores = (e) => {
    e.preventDefault();
    fetchStores();
  };

  // Toggle user sorting
  const handleUserSort = (field) => {
    if (userSortField === field) {
      setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortOrder('asc');
    }
  };

  // Toggle store sorting
  const handleStoreSort = (field) => {
    if (storeSortField === field) {
      setStoreSortOrder(storeSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortOrder('asc');
    }
  };

  // Render Sort indicator
  const renderSortIndicator = (currentField, activeField, activeOrder) => {
    if (currentField !== activeField) {
      return <ArrowUpDown size={13} style={{ opacity: 0.35, marginLeft: 4, verticalAlign: 'middle' }} />;
    }
    return activeOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--brand-forest)', marginLeft: 4, verticalAlign: 'middle' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--brand-forest)', marginLeft: 4, verticalAlign: 'middle' }} />
    );
  };

  // Client-side sort for stores rating (since backend sorts by averageRating via memory)
  const sortedStores = useMemo(() => {
    let list = [...stores];
    if (storeSortField === 'rating') {
      list.sort((a, b) => {
        const rA = Number(a.averageRating || 0);
        const rB = Number(b.averageRating || 0);
        return storeSortOrder === 'asc' ? rA - rB : rB - rA;
      });
    }
    return list;
  }, [stores, storeSortField, storeSortOrder]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
      };
      if (newStore.ownerId.trim()) {
        payload.ownerId = newStore.ownerId.trim();
      }

      const res = await api.post('/stores', payload);
      if (res.data?.success) {
        setShowAddStoreModal(false);
        setNewStore({ name: '', email: '', address: '', ownerId: '' });
        setActionSuccess('New bookstore registered successfully in the platform directory!');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchDashboardData();
      } else {
        const errorData = res.data?.data;
        setFormError(Array.isArray(errorData) ? errorData.join(' • ') : (res.data?.message || 'Failed to create store.'));
      }
    } catch (err) {
      const errorData = err.response?.data?.data;
      setFormError(Array.isArray(errorData) ? errorData.join(' • ') : (err.response?.data?.message || 'Failed to create store.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await api.post('/admin/users', newUser);
      if (res.data?.success) {
        setShowAddUserModal(false);
        setNewUser({ name: '', email: '', password: '', address: '', role: 'STORE_OWNER' });
        setActionSuccess('New user account created successfully with designated permissions!');
        setTimeout(() => setActionSuccess(null), 4000);
        fetchDashboardData();
      } else {
        const errorData = res.data?.data;
        setFormError(Array.isArray(errorData) ? errorData.join(' • ') : (res.data?.message || 'Failed to create user.'));
      }
    } catch (err) {
      const errorData = err.response?.data?.data;
      setFormError(Array.isArray(errorData) ? errorData.join(' • ') : (err.response?.data?.message || 'Failed to create user.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-container">
      {/* Top Header */}
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#FEF3C7', color: '#92400E', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
              <Shield size={14} />
              <span>Administrator Portal</span>
            </div>
            <h1 className="dashboard-title">System Administration Console</h1>
            <p className="dashboard-subtitle">
              Comprehensive directory ledger, user access roles, and registered store ratings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setFormError(null); setShowAddUserModal(true); }}
              className="btn-signin"
              style={{ border: '1px solid var(--border-card)' }}
            >
              <Plus size={16} style={{ display: 'inline', marginRight: 4 }} />
              <span>Create User</span>
            </button>
            <button
              onClick={() => { setFormError(null); setShowAddStoreModal(true); }}
              className="btn-register"
            >
              <Plus size={16} style={{ display: 'inline', marginRight: 4 }} />
              <span>Add New Store</span>
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="auth-alert success" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3 Core Stat Cards (Total Users, Total Stores, Total Ratings) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Registered Users</div>
          <div className="stat-value">{stats?.totalUsers ?? users.length}</div>
          <div className="stat-breakdown">
            <span className="stat-chip" style={{ background: '#FEF3C7', color: '#92400E' }}>
              {stats?.roleBreakdown?.SYSTEM_ADMIN || 1} Admins
            </span>
            <span className="stat-chip" style={{ background: '#E0E7FF', color: '#3730A3' }}>
              {stats?.roleBreakdown?.STORE_OWNER || 0} Owners
            </span>
            <span className="stat-chip" style={{ background: 'var(--tag-forest-bg)', color: 'var(--tag-forest-text)' }}>
              {stats?.roleBreakdown?.NORMAL_USER || 0} Readers
            </span>
          </div>
        </div>

        <div className="stat-card gold">
          <div className="stat-title">Total Bookstores</div>
          <div className="stat-value">{stats?.totalStores ?? stores.length}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Active literary establishments registered
          </div>
        </div>

        <div className="stat-card espresso">
          <div className="stat-title">Total Submitted Ratings</div>
          <div className="stat-value">{stats?.totalRatings ?? 0}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Aggregated reader reviews (1 to 5 stars)
          </div>
        </div>
      </div>

      {/* Tab Switcher: Users vs Stores */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'users' ? 'var(--brand-forest)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'users' ? '2px solid var(--brand-forest)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Users size={17} />
          <span>Platform Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 18px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'stores' ? 'var(--brand-forest)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'stores' ? '2px solid var(--brand-forest)' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Store size={17} />
          <span>Bookstore Directory &amp; Ratings ({stores.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="data-table-card">
          <div className="table-toolbar">
            <div>
              <h3 className="table-title">Platform Members &amp; Directory Roles</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                Click table headers to sort ascending or descending. Store owner ratings are calculated automatically.
              </p>
            </div>

            <div className="table-actions">
              {/* Multi-field search */}
              <form onSubmit={handleSearchUsers} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '6px 12px', fontSize: 13, width: 230 }}
                  placeholder="Filter by Name, Email, Address..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <button type="submit" className="btn-signin" style={{ border: '1px solid var(--border-card)', padding: '6px 10px' }} title="Search">
                  <Search size={14} />
                </button>
              </form>

              {/* Role Filter */}
              <select
                className="form-select"
                style={{ padding: '6px 12px', fontSize: 13, width: 150 }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="SYSTEM_ADMIN">Admins Only</option>
                <option value="STORE_OWNER">Store Owners</option>
                <option value="NORMAL_USER">Normal Readers</option>
              </select>

              <button onClick={fetchUsers} className="btn-signin" style={{ border: '1px solid var(--border-card)', padding: '6px 10px' }} title="Refresh Users">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th onClick={() => handleUserSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Member Name {renderSortIndicator('name', userSortField, userSortOrder)}
                  </th>
                  <th onClick={() => handleUserSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Email Address {renderSortIndicator('email', userSortField, userSortOrder)}
                  </th>
                  <th onClick={() => handleUserSort('role')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Platform Role {renderSortIndicator('role', userSortField, userSortOrder)}
                  </th>
                  <th onClick={() => handleUserSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Physical Address {renderSortIndicator('address', userSortField, userSortOrder)}
                  </th>
                  <th>Store Owner Rating</th>
                  <th onClick={() => handleUserSort('createdAt')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Joined Date {renderSortIndicator('createdAt', userSortField, userSortOrder)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td>
                        <span className={`role-badge-pill ${u.role?.toLowerCase()}`}>
                          {u.role === 'SYSTEM_ADMIN'
                            ? 'Admin'
                            : u.role === 'STORE_OWNER'
                            ? 'Store Owner'
                            : 'Normal Reader'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {u.address || '—'}
                      </td>
                      <td>
                        {/* Requirement: If the user is a Store Owner, their Rating should also be displayed */}
                        {u.role === 'STORE_OWNER' ? (
                          u.storeName ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--brand-espresso)' }}>
                                {u.storeName}
                              </span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-gold-stars)', fontSize: 12, fontWeight: 700 }}>
                                <Star size={13} fill="currentColor" />
                                {u.storeRating ? `${u.storeRating} / 5.0` : 'No ratings yet'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Unassigned</span>
                          )
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STORES DIRECTORY (Name, Email, Address, Rating) */}
      {activeTab === 'stores' && (
        <div className="data-table-card">
          <div className="table-toolbar">
            <div>
              <h3 className="table-title">Registered Bookstore Directory</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                Details: Name, Email, Address, Overall Rating. Click headers to sort.
              </p>
            </div>

            <div className="table-actions">
              {/* Multi-field search */}
              <form onSubmit={handleSearchStores} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '6px 12px', fontSize: 13, width: 230 }}
                  placeholder="Filter by Name, Address..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                />
                <button type="submit" className="btn-signin" style={{ border: '1px solid var(--border-card)', padding: '6px 10px' }} title="Search">
                  <Search size={14} />
                </button>
              </form>

              <button onClick={fetchStores} className="btn-signin" style={{ border: '1px solid var(--border-card)', padding: '6px 10px' }} title="Refresh Stores">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th onClick={() => handleStoreSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Store Name {renderSortIndicator('name', storeSortField, storeSortOrder)}
                  </th>
                  <th onClick={() => handleStoreSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Email Address {renderSortIndicator('email', storeSortField, storeSortOrder)}
                  </th>
                  <th onClick={() => handleStoreSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Physical Address {renderSortIndicator('address', storeSortField, storeSortOrder)}
                  </th>
                  <th onClick={() => handleStoreSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Overall Rating {renderSortIndicator('rating', storeSortField, storeSortOrder)}
                  </th>
                  <th>Designated Owner</th>
                  <th onClick={() => handleStoreSort('createdAt')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Date Added {renderSortIndicator('createdAt', storeSortField, storeSortOrder)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStores.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No stores found matching current filters.
                    </td>
                  </tr>
                ) : (
                  sortedStores.map((s) => {
                    const avg = Number(s.averageRating || 0);
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.email}</td>
                        <td style={{ color: 'var(--text-secondary)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.address}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ display: 'flex', color: 'var(--accent-gold-stars)' }}>
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  fill={i < Math.round(avg) ? 'currentColor' : 'none'}
                                  color={i < Math.round(avg) ? 'var(--accent-gold-stars)' : '#D1D5DB'}
                                />
                              ))}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--brand-espresso)' }}>
                              {avg > 0 ? avg.toFixed(1) : 'New'}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              ({s.totalRatings || 0})
                            </span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {s.owner?.name ? (
                            <span style={{ fontWeight: 500 }}>{s.owner.name}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add New Store */}
      {showAddStoreModal && (
        <div className="modal-backdrop" onClick={() => setShowAddStoreModal(false)}>
          <div className="rating-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-header-title">Add New Store to Directory</h3>
              <button className="btn-close-modal" onClick={() => setShowAddStoreModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateStore} style={{ padding: 24 }}>
              {formError && (
                <div className="auth-alert error" style={{ marginBottom: 16 }}>{formError}</div>
              )}
              <div className="form-group">
                <label className="form-label">
                  Store Name (max 60 chars)
                  <span style={{ float: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                    {newStore.name.length}/60 chars
                  </span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Shakespeare and Company Paris"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="contact@shakespeareandcompany.com"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Physical Street Address (max 400 chars)
                  <span style={{ float: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                    {newStore.address.length}/400 chars
                  </span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="37 Rue de la Bûcherie, Paris"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign Store Owner (Optional User ID)</label>
                <select
                  className="form-select"
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                >
                  <option value="">Leave Unassigned</option>
                  {users
                    .filter((u) => u.role === 'STORE_OWNER')
                    .map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn-cancel" onClick={() => setShowAddStoreModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-submit-rating">
                  {submitting ? 'Creating...' : 'Register Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {showAddUserModal && (
        <div className="modal-backdrop" onClick={() => setShowAddUserModal(false)}>
          <div className="rating-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-header-title">Create Admin or Member User</h3>
              <button className="btn-close-modal" onClick={() => setShowAddUserModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser} style={{ padding: 24 }}>
              {formError && (
                <div className="auth-alert error" style={{ marginBottom: 16 }}>{formError}</div>
              )}
              <div className="form-group">
                <label className="form-label">
                  Full Name (20–60 characters)
                  <span style={{ float: 'right', fontSize: 11, color: newUser.name.length >= 20 && newUser.name.length <= 60 ? 'var(--brand-forest)' : 'var(--text-muted)' }}>
                    {newUser.name.length}/60 chars
                  </span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Sylvia Beach Founder Proprietor"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="owner@bookshop.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special symbol)</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="AdminPassword@2026"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Physical Street Address (Optional, max 400 chars)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="12 High Street, Oxford"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="STORE_OWNER">STORE_OWNER</option>
                  <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                  <option value="NORMAL_USER">NORMAL_USER</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-submit-rating">
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
