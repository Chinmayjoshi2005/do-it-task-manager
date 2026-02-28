import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className={"toast toast--" + type}>
      <span className="toast__icon">{icons[type]}</span>
      <span className="toast__msg">{message}</span>
      <button className="toast__close" onClick={onClose}>✕</button>
    </div>
  );
}
