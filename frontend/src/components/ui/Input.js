import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ label, error, hint, icon, className = '', ...props }, ref) => (
  <div className={"field " + (error ? "field--error" : "")}>
    {label && <label className="field__label">{label}</label>}
    <div className="field__wrap">
      {icon && <span className="field__icon">{icon}</span>}
      <input ref={ref} className={"field__input " + (icon ? "field__input--icon" : "") + " " + className} {...props} />
    </div>
    {error && <span className="field__error">{error}</span>}
    {hint && !error && <span className="field__hint">{hint}</span>}
  </div>
));

export const Textarea = forwardRef(({ label, error, hint, className = '', ...props }, ref) => (
  <div className={"field " + (error ? "field--error" : "")}>
    {label && <label className="field__label">{label}</label>}
    <textarea ref={ref} className={"field__input field__textarea " + className} {...props} />
    {error && <span className="field__error">{error}</span>}
    {hint && !error && <span className="field__hint">{hint}</span>}
  </div>
));

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className={"field " + (error ? "field--error" : "")}>
    {label && <label className="field__label">{label}</label>}
    <select ref={ref} className={"field__input field__select " + className} {...props}>{children}</select>
    {error && <span className="field__error">{error}</span>}
  </div>
));

export default Input;
