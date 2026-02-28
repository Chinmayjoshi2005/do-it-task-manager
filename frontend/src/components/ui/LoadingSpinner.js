import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ fullPage, size = 'md' }) {
  const spinner = (
    <div className={"spinner spinner--" + size}>
      <div className="spinner__ring" />
    </div>
  );
  if (fullPage) return <div className="spinner-fullpage">{spinner}</div>;
  return spinner;
}
