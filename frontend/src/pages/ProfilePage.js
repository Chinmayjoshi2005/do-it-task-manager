import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import api from '../api/axios';
import { Flame, Trophy } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import StreakMap from '../components/streak/StreakMap';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { stats, streakData: streakStats, fetchStats, fetchStreakData } = useTasks();
  const navigate = useNavigate();
  const [showChangePass, setShowChangePass] = useState(false);
  const [passForm, setPassForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [passErrors, setPassErrors] = useState({});
  const [passLoading, setPassLoading] = useState(false);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', location: '', skills: '', avatar_base64: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchStreakData();
  }, [fetchStats, fetchStreakData]);

  const handlePassSubmit = async (e) => {
    e.preventDefault(); setPassErrors({}); setPassLoading(true);
    try {
      await api.post('/change-password/', passForm);
      setShowChangePass(false);
      setPassForm({ old_password: '', new_password: '', confirm_password: '' });
      setToast({ message: 'Password changed successfully!', type: 'success' });
    } catch (err) {
      const errs = err.response?.data?.errors || {};
      if (typeof errs === 'object') {
        const flat = {};
        for (const [k, v] of Object.entries(errs)) flat[k] = Array.isArray(v) ? v[0] : v;
        setPassErrors(flat);
      } else {
        setPassErrors({ general: err.response?.data?.error || 'Failed to change password.' });
      }
    } finally { setPassLoading(false); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openEditProfile = () => {
    setEditForm({
      bio: user?.bio || '',
      location: user?.location || '',
      skills: user?.skills || '',
      avatar_base64: user?.avatar_base64 || ''
    });
    setShowEditProfile(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put('/profile/', editForm);
      setShowEditProfile(false);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      // Reload page to get new context or update context if we had a method
      window.location.reload();
    } catch (err) {
      setToast({ message: 'Failed to update profile.', type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditForm(prev => ({ ...prev, avatar_base64: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-wrapper">
            <div className="profile-hero__avatar">
              {user?.avatar_base64 ? (
                <img src={user.avatar_base64} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user?.username?.[0]?.toUpperCase()
              )}
            </div>
          </div>
          <h2 className="profile-hero__name"><span className="gradient-text">{user?.username}</span></h2>
          <p className="profile-username">@{user?.username?.toLowerCase()}</p>
          <p className="profile-bio">{user?.bio || 'Software Engineer and ambitious learner exploring modern web development and algorithms. Focused on daily consistency.'}</p>

          <div className="profile-details">
            <div className="profile-detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>{user?.location || 'Earth'}</span>
            </div>
            <div className="profile-detail-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>{user?.email}</span>
            </div>
            <div className="profile-detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span>Joined {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</span>
            </div>
          </div>

          <div className="profile-skills">
            {(user?.skills || 'React,Django,Python,UI/UX,Algorithms').split(',').map((s, i) => s.trim() ? (
              <span key={i} className="profile-skill">{s.trim()}</span>
            ) : null)}
          </div>

          <div className="profile-actions">
            <Button variant="primary" onClick={openEditProfile}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              Edit Profile
            </Button>
            <Button variant="secondary" onClick={() => setShowChangePass(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Change Password
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </Button>
          </div>
        </div>

        <div className="profile-main">

          <div className="profile-stats-grid">
            <div className="profile-stat-box">
              <div className="stat-box-header">Rating & Rank</div>
              <div className="stat-box-body flex-row">
                <div className="stat-big-block">
                  <div className="stat-value gradient-text">{stats?.total_tasks || 0}</div>
                  <div className="stat-label">Total Assignments</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-sm-block">
                  <div className="sm-val gradient-text">Top {(stats && stats.total_tasks > 0) ? Math.max(1, Math.floor(100 - stats.completion_percentage)) : 100}%</div>
                  <div className="sm-label">Global Consistency</div>
                </div>
              </div>
            </div>

            <div className="profile-stat-box">
              <div className="stat-box-header">Focus Progress</div>
              <div className="stat-box-progress">
                <div className="prog-text">
                  <span className="prog-big gradient-text">{stats?.completed_tasks || 0}</span>
                  <span className="prog-slash">/</span>
                  <span className="prog-total">{stats?.total_tasks || 0}</span>
                  <span className="prog-label">Solved</span>
                </div>
                <ProgressBar value={stats?.completion_percentage || 0} label={`${stats?.completion_percentage || 0}% Completion Rate`} size="lg" />
              </div>
              <div className="stat-badges">
                <div className="badge-item">
                  <Flame size={14} className="text-rose-400" />
                  <span>{streakStats?.current_streak || 0} Day Streak</span>
                </div>
                <div className="badge-item">
                  <Trophy size={14} className="text-amber-400" />
                  <span>{streakStats?.longest_streak || 0} Best Streak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-heatmap-container">
            <h3 className="profile-section-title">{streakStats?.total_tasks_ever || stats?.completed_tasks || 0} submissions in the past year</h3>
            <StreakMap />
          </div>

        </div>
      </div>

      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profile">
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Profile Photo (Optional)</label>
            <label className="profile-file-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <span>Choose an image...</span>
            </label>
            {editForm.avatar_base64 && (
              <img src={editForm.avatar_base64} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginTop: 8 }} />
            )}
          </div>
          <Input label="Bio" value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself..." />
          <Input label="Location" value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Earth" />
          <Input label="Skills (comma separated)" value={editForm.skills} onChange={e => setEditForm(p => ({ ...p, skills: e.target.value }))} placeholder="React, Python, Design" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <Button type="button" variant="secondary" onClick={() => setShowEditProfile(false)}>Cancel</Button>
            <Button type="submit" loading={editLoading}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showChangePass} onClose={() => setShowChangePass(false)} title="Change Password">
        <form onSubmit={handlePassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {passErrors.general && <div className="auth-error">{passErrors.general}</div>}
          <Input label="Current Password" type="password" value={passForm.old_password}
            onChange={e => setPassForm(p => ({ ...p, old_password: e.target.value }))}
            error={passErrors.old_password} placeholder="Your current password" required />
          <Input label="New Password" type="password" value={passForm.new_password}
            onChange={e => setPassForm(p => ({ ...p, new_password: e.target.value }))}
            error={passErrors.new_password} placeholder="Min. 8 characters" required />
          <Input label="Confirm New Password" type="password" value={passForm.confirm_password}
            onChange={e => setPassForm(p => ({ ...p, confirm_password: e.target.value }))}
            error={passErrors.confirm_password} placeholder="Repeat new password" required />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button type="button" variant="secondary" onClick={() => setShowChangePass(false)}>Cancel</Button>
            <Button type="submit" loading={passLoading}>Update Password</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
