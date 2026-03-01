import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your primary school?",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm_password: '',
    security_question: SECURITY_QUESTIONS[0], security_answer: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const errData = err.response?.data;
      const errs = errData?.errors || {};
      if (typeof errs === 'object' && Object.keys(errs).length > 0) {
        const flat = {};
        for (const [k, v] of Object.entries(errs)) {
          flat[k] = Array.isArray(v) ? v[0] : v;
        }
        setErrors(flat);
      } else if (errData?.error) {
        setErrors({ general: errData.error });
      } else if (err.message) {
        setErrors({ general: 'Server Error: Database may be misconfigured. ' + err.message });
      } else {
        setErrors({ general: 'Registration failed.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo__mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#6366f1" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#a5b4fc" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <span className="auth-logo__text">DO IT</span>
        </div>

        <h2 className="auth-heading">Create your account</h2>
        <p className="auth-sub">Start organizing your life today</p>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <Input label="Username" name="username" value={form.username} onChange={handleChange}
              placeholder="Choose a username" error={errors.username} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="your@email.com" error={errors.email} required />
          </div>
          <div className="auth-row">
            <Input label="Password" type="password" name="password" value={form.password}
              onChange={handleChange} placeholder="Min. 8 characters" error={errors.password} required />
            <Input label="Confirm Password" type="password" name="confirm_password"
              value={form.confirm_password} onChange={handleChange} placeholder="Repeat password"
              error={errors.confirm_password} required />
          </div>
          <Select label="Security Question" name="security_question" value={form.security_question} onChange={handleChange}>
            {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </Select>
          <Input label="Security Answer" name="security_answer" value={form.security_answer}
            onChange={handleChange} placeholder="Your answer" error={errors.security_answer} required />
          <Button type="submit" fullWidth loading={loading} size="lg">Create Account</Button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
