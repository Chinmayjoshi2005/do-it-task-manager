import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ value = 0, label, size = 'md', color = 'indigo', animated }) {
  return (
    <div className={"progress progress--" + size}>
      {label && (
        <div className="progress__header">
          <span className="progress__label">{label}</span>
          <span className="progress__value">{Math.round(value)}%</span>
        </div>
      )}
      <div className="progress__track">
        <div
          className={"progress__bar progress__bar--" + color + (animated ? " progress__bar--animated" : "")}
          style={{ width: Math.min(100, Math.max(0, value)) + '%' }}
        />
      </div>
    </div>
  );
}
