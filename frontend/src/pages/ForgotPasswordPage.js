import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './AuthPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ username: '', security_answer: '' });
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleStep1 = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/forgot-password/', form);
      setQuestion(res.data.security_question);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed.');
    } finally { setLoading(false); }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    navigate('/reset-password', { state: { username: form.username, security_answer: form.security_answer } });
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-scale-in">
        <Link to="/login" className="auth-back">← Back to Login</Link>
        <h2 className="auth-heading">Reset Password</h2>
        <p className="auth-sub">{step === 1 ? "Enter your username to get started" : "Answer your security question"}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={step === 1 ? handleStep1 : handleStep2} className="auth-form">
          <Input label="Username" name="username" value={form.username} onChange={handleChange}
            placeholder="Enter your username" required disabled={step === 2} />

          {step === 2 && (
            <>
              <div className="auth-question-box">
                <p className="auth-question-label">Security Question:</p>
                <p className="auth-question-text">{question}</p>
              </div>
              <Input label="Your Answer" name="security_answer" value={form.security_answer}
                onChange={handleChange} placeholder="Enter your answer" required autoFocus />
            </>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg">
            {step === 1 ? 'Verify Username' : 'Continue to Reset'}
          </Button>
        </form>
      </div>
    </div>
  );
}
