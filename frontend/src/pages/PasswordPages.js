import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [form, setForm] = useState({ username: '', security_answer: '' });
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    authAPI.getSecurityQuestions().then(r => setQuestions(r.data));
  }, []);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    if (!form.security_answer) errs.security_answer = 'Answer is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authAPI.forgotPassword(form);
      toast.success('Verified! Set your new password.');
      navigate('/reset-password', { state: { username: form.username, security_answer: form.security_answer } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const flat = {};
        Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(flat);
      } else {
        toast.error('Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, background: 'var(--bg-primary)' }}>
      <div className="auth-card page-fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">T</div>
          <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>DO IT</span>
        </div>
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">Verify your identity using your security question</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="your_username" value={form.username}
              onChange={e => set('username', e.target.value)} autoFocus />
            {errors.username && <div className="form-error">{errors.username}</div>}
          </div>

          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: 'text-bottom' }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            You'll be asked to answer the security question you set during registration.
          </div>

          <div className="form-group">
            <label className="form-label">Security Answer</label>
            <input className={`form-input ${errors.security_answer ? 'error' : ''}`}
              placeholder="Your answer" value={form.security_answer}
              onChange={e => set('security_answer', e.target.value)} />
            {errors.security_answer && <div className="form-error">{errors.security_answer}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          <Link to="/login">← Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [location] = useState(() => window.history.state?.usr || {});
  const [form, setForm] = useState({ new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.new_password || form.new_password.length < 8) errs.new_password = 'Password must be at least 8 characters';
    if (form.new_password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        username: location.username,
        security_answer: location.security_answer,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const flat = {};
        Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(flat);
      } else {
        toast.error('Reset failed. Please start over.');
        navigate('/forgot-password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, background: 'var(--bg-primary)' }}>
      <div className="auth-card page-fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">T</div>
          <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>DO IT</span>
        </div>
        <h1 className="auth-title">Set new password</h1>
        <p className="auth-subtitle">Choose a strong password for your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'}
                className={`form-input ${errors.new_password ? 'error' : ''}`}
                placeholder="At least 8 characters" value={form.new_password}
                onChange={e => set('new_password', e.target.value)}
                style={{ paddingRight: 40 }} autoFocus />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                {showPass ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {errors.new_password && <div className="form-error">{errors.new_password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className={`form-input ${errors.confirm_password ? 'error' : ''}`}
              placeholder="••••••••" value={form.confirm_password}
              onChange={e => set('confirm_password', e.target.value)} />
            {errors.confirm_password && <div className="form-error">{errors.confirm_password}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
