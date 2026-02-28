import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!state?.username) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Invalid access. <Link to="/forgot-password">Start over</Link></p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/reset-password/', {
        username: state.username,
        security_answer: state.security_answer,
        ...form
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errs = err.response?.data?.errors || {};
      const msg = Object.values(errs)[0] || err.response?.data?.error || 'Reset failed.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <h2 className="auth-heading">New Password</h2>
        <p className="auth-sub">Choose a strong, memorable password</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">Password reset! Redirecting to login...</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input label="New Password" type="password" name="new_password" value={form.new_password}
            onChange={e => setForm(p => ({ ...p, new_password: e.target.value }))}
            placeholder="Min. 8 characters" required />
          <Input label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password}
            onChange={e => setForm(p => ({ ...p, confirm_password: e.target.value }))}
            placeholder="Repeat new password" required />
          <Button type="submit" fullWidth loading={loading} size="lg">Reset Password</Button>
        </form>
      </div>
    </div>
  );
}
