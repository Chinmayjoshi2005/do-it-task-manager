import React from 'react';
import './Button.css';
import LoadingSpinner from './LoadingSpinner';

export default function Button({
  children, variant = 'primary', size = 'md',
  loading, disabled, className = '', fullWidth, ...props
}) {
  return (
    <button
      className={["btn", "btn--" + variant, "btn--" + size, fullWidth ? "btn--full" : "", className].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}
