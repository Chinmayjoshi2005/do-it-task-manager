import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, sub, icon, color = 'indigo', trend }) {
  return (
    <div className={"stat-card stat-card--" + color}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__title">{title}</div>
        {sub && <div className="stat-card__sub">{sub}</div>}
      </div>
      {trend !== undefined && (
        <div className={"stat-card__trend " + (trend >= 0 ? "stat-card__trend--up" : "stat-card__trend--down")}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
