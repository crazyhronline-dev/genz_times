'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { EditorialUser, UserRole } from '@/types/user';
import { ROLE_CONFIG, ROLE_PERMISSIONS, hasModuleAccess } from '@/lib/auth';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Mail, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User, 
  Sparkles, 
  RefreshCw, 
  X, 
  Check, 
  Eye, 
  EyeOff,
  Briefcase
} from 'lucide-react';

interface AdminTeamModuleProps {
  currentUserRole?: UserRole;
  onRefresh?: () => void;
}

const ALL_MODULES_LIST = [
  { id: 'overview', label: 'Command Center' },
  { id: 'articles', label: 'All Articles' },
  { id: 'publish', label: 'Publish Studio' },
  { id: 'deals', label: 'Deals & Coupons' },
  { id: 'reviews', label: 'Reviews & Lab Matrix' },
  { id: 'enquiries', label: 'Contact Inquiries' },
  { id: 'categories', label: 'Category Manager' },
  { id: 'team', label: 'Editorial Team' },
  { id: 'system', label: 'System Diagnostics' },
];

export default function AdminTeamModule({
  currentUserRole = 'admin',
  onRefresh,
}: AdminTeamModuleProps) {
  const [users, setUsers] = useState<EditorialUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EditorialUser | null>(null);

  // Form states for Add
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'editor' as UserRole,
    designation: '',
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Form states for Edit
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'editor' as UserRole,
    designation: '',
    active: true,
    newPassword: '',
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      showNotification('error', 'Failed to fetch editorial team roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    fetchUsers();
    if (onRefresh) onRefresh();
  };

  // Filtered list
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.designation && u.designation.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  // Counts
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const editorCount = users.filter((u) => u.role === 'editor').length;
  const authorCount = users.filter((u) => u.role === 'author').length;

  // Generate random strong password
  const generatePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // Handle Add Member
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAdd(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create user');
      }

      showNotification('success', `Team member @${formData.username} added successfully!`);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'editor',
        designation: '',
      });
      handleRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to add team member');
    } finally {
      setSubmittingAdd(false);
    }
  };

  // Handle Edit Member
  const handleOpenEdit = (user: EditorialUser) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      designation: user.designation || '',
      active: user.active,
      newPassword: '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmittingEdit(true);

    try {
      const payload: any = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        designation: editFormData.designation,
        active: editFormData.active,
      };

      if (editFormData.newPassword.trim()) {
        payload.password = editFormData.newPassword.trim();
      }

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user');
      }

      showNotification('success', `User @${editingUser.username} updated successfully!`);
      setIsEditModalOpen(false);
      setEditingUser(null);
      handleRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Handle Delete Member
  const handleDeleteUser = async (user: EditorialUser) => {
    if (user.username === 'admin') {
      alert('The primary Super Admin account is protected and cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to remove @${user.username} (${user.name}) from the editorial team?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }
      showNotification('success', `User @${user.username} removed.`);
      handleRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-tech-900 via-tech-950 to-slate-900 border border-slate-800 shadow-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Editorial Team & RBAC Management</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Staff Members & Access Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Create independent credentials for Super Admins, Senior Hardware Reviewers, and Staff Writers with granular module permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-xl bg-tech-900/80 hover:bg-tech-900 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-tech-cyan' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-mono flex items-center gap-2.5 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-tech-emerald/15 border-tech-emerald/40 text-tech-emerald'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-tech-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {users.length}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Active logins</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Super Admins</span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
            {adminCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Full 8-module access</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Senior Editors</span>
            <Edit3 className="w-4 h-4 text-tech-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-tech-cyan">
            {editorCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Articles & reviews</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Staff Writers</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            {authorCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Publish Studio only</span>
        </div>
      </div>

      {/* Role Access Guide Matrix */}
      <div className="p-5 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-tech-cyan" />
          <span>Role Permissions & Access Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">👑 Super Admin</span>
              <span className="text-[10px] text-rose-300 font-semibold">ALL 8 MODULES</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full control over Articles, Publish Studio, Categories, Reviews, Enquiries, Team Roster, and 1-second LiteSpeed Cache Purging.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-tech-cyan/10 border border-tech-cyan/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-tech-cyan">✒️ Senior Editor</span>
              <span className="text-[10px] text-tech-cyan font-semibold">5 MODULES</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Can write, publish, and edit all Articles and Reviews, modify verdict scores, and reply to Contact Enquiries. Cannot manage categories, team, or server cache.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300">📝 Staff Writer</span>
              <span className="text-[10px] text-amber-300 font-semibold">3 MODULES</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Publish Studio drafting access. Can create articles, use AI SEO tools, and view published articles. Restricted from Enquiries, Categories, Team, and System.
            </p>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-3xl bg-tech-900/40 border border-slate-800 overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-tech-cyan" />
              <span>Editorial Roster ({filteredUsers.length})</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Authorized credentials with assigned role permissions
            </p>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, email..."
            className="px-3.5 py-1.5 text-xs font-mono rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Team Member</th>
                <th className="pb-3 font-semibold">Login Username</th>
                <th className="pb-3 font-semibold">Role & Permissions</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Added Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                const roleMeta = ROLE_CONFIG[user.role] || ROLE_CONFIG.author;
                const isSuperAdmin = user.username === 'admin';

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-white font-mono shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {user.designation || 'Staff Member'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      <span className="text-tech-cyan font-bold block">
                        @{user.username}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {user.email}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${roleMeta.badgeColor}`}>
                          {roleMeta.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {ROLE_PERMISSIONS[user.role]?.length || 3} of 8 Modules Active
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-4">
                      {user.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tech-emerald/10 text-tech-emerald text-[10px] font-bold border border-tech-emerald/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-tech-emerald"></span>
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold border border-slate-700">
                          <span>SUSPENDED</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 pr-4 text-slate-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-slate-700"
                        title="Edit User & Credentials"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline mr-1 text-tech-cyan" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={isSuperAdmin}
                        className={`p-1.5 rounded-lg border transition ${
                          isSuperAdmin
                            ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                            : 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border-slate-700'
                        }`}
                        title={isSuperAdmin ? 'Super Admin Protected' : 'Delete Member'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD TEAM MEMBER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-tech-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-tech-cyan" />
                  <span>Add Editorial Team Member</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Set specific credentials and access permissions
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Login Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. marcus_tech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@genztime.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="uppercase text-slate-400">Password / Key *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generatePassword();
                      setFormData({ ...formData, password: p });
                      setShowAddPassword(true);
                    }}
                    className="text-tech-cyan hover:underline text-[10px]"
                  >
                    ⚡ Generate Password
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Access Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  >
                    <option value="author">Staff Writer (Publish Studio)</option>
                    <option value="editor">Senior Editor (Reviews & Enquiries)</option>
                    <option value="admin">Super Admin (All 8 Modules)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Mobile Tech Reviewer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-tech-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold block">Assigned Role Clearance:</span>
                  <span className="font-mono text-tech-cyan text-[10px] font-bold">
                    {ROLE_PERMISSIONS[formData.role]?.length || 3} of 8 Modules Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ROLE_CONFIG[formData.role]?.description}</p>
                
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80">
                  {ALL_MODULES_LIST.map((mod) => {
                    const isAllowed = hasModuleAccess(formData.role, mod.id);
                    return (
                      <div
                        key={mod.id}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono ${
                          isAllowed
                            ? 'bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/25 font-bold'
                            : 'bg-rose-500/5 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {isAllowed ? (
                          <Check className="w-3 h-3 text-tech-emerald shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-rose-500/50 shrink-0" />
                        )}
                        <span className="truncate">{mod.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="px-5 py-2 rounded-xl font-bold text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingAdd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Team Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER & RESET CREDENTIALS */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-tech-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-tech-cyan" />
                  <span>Edit Member: @{editingUser.username}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Update role permissions, designation, or reset password
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block uppercase text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                />
              </div>

              <div>
                <label className="block uppercase text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-slate-400 mb-1">Access Role *</label>
                  <select
                    disabled={editingUser.username === 'admin'}
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan disabled:opacity-50"
                  >
                    <option value="author">Staff Writer</option>
                    <option value="editor">Senior Editor</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editFormData.designation}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-tech-900 border border-slate-700 text-white focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-tech-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold block">Assigned Role Clearance:</span>
                  <span className="font-mono text-tech-cyan text-[10px] font-bold">
                    {ROLE_PERMISSIONS[editFormData.role]?.length || 3} of 8 Modules Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{ROLE_CONFIG[editFormData.role]?.description}</p>
                
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/80">
                  {ALL_MODULES_LIST.map((mod) => {
                    const isAllowed = hasModuleAccess(editFormData.role, mod.id);
                    return (
                      <div
                        key={mod.id}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono ${
                          isAllowed
                            ? 'bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/25 font-bold'
                            : 'bg-rose-500/5 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {isAllowed ? (
                          <Check className="w-3 h-3 text-tech-emerald shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-rose-500/50 shrink-0" />
                        )}
                        <span className="truncate">{mod.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset Password */}
              <div className="p-3.5 rounded-2xl bg-tech-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="uppercase text-slate-300 font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-tech-cyan" />
                    <span>Reset Password (Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generatePassword();
                      setEditFormData({ ...editFormData, newPassword: p });
                      setShowEditPassword(true);
                    }}
                    className="text-tech-cyan hover:underline text-[10px]"
                  >
                    ⚡ Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editFormData.newPassword}
                    onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                    placeholder="Leave empty to keep current password"
                    className="w-full pr-10 pl-3.5 py-2 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Active Toggle */}
              {editingUser.username !== 'admin' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-slate-800">
                  <div>
                    <span className="text-white font-bold block">Account Status</span>
                    <span className="text-[10px] text-slate-400">Suspended users cannot log in</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, active: !editFormData.active })}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                      editFormData.active
                        ? 'bg-tech-emerald/20 text-tech-emerald border border-tech-emerald/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {editFormData.active ? 'ACTIVE' : 'SUSPENDED'}
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2 rounded-xl font-bold text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
