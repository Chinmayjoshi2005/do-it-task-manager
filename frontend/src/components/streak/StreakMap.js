import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTasks } from '../../context/TaskContext';
import './StreakMap.css';

function getColor(completed) {
  if (completed === 0) return 'none';
  if (completed <= 3) return 'low';
  if (completed <= 7) return 'mid';
  return 'high';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StreakMap() {
  const { streakData, fetchStreakData } = useTasks();
  const [tooltip, setTooltip] = useState(null);
  const [selectedYear, setSelectedYear] = useState('Recent');

  const currentYear = new Date().getFullYear();
  const yearOptions = ['Recent'];
  for (let i = 0; i < 5; i++) {
    yearOptions.push((currentYear - i).toString());
  }

  useEffect(() => {
    fetchStreakData(selectedYear);
  }, [fetchStreakData, selectedYear]);

  if (!streakData) return (
    <div className="streak-map">
      <div className="streak-map__title">Activity</div>
      <div className="streak-map__loading">
        {Array.from({ length: 52 * 7 }).map((_, i) => (
          <div key={i} className="streak-cell skeleton" style={{ animationDelay: (i * 0.001) + 's' }} />
        ))}
      </div>
    </div>
  );

  const data = streakData.streak_data;

  // Build week columns
  const weeks = [];
  let currentWeek = [];
  const firstDate = data[0] ? new Date(data[0].date + 'T00:00:00') : new Date();
  const startDayOfWeek = firstDate.getDay();
  for (let i = 0; i < startDayOfWeek; i++) currentWeek.push(null);

  data.forEach(item => {
    currentWeek.push(item);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstCell = week.find(c => c !== null);
    if (firstCell) {
      const m = new Date(firstCell.date + 'T00:00:00').getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ index: wi, label: MONTHS[m] });
        lastMonth = m;
      }
    }
  });

  return (
    <div className="streak-map">
      <div className="streak-map__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3 className="streak-map__title">Activity Heatmap</h3>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="streak-map__legend">
          <span className="streak-legend__label">Less</span>
          <div className="streak-cell streak-cell--none" />
          <div className="streak-cell streak-cell--low" />
          <div className="streak-cell streak-cell--mid" />
          <div className="streak-cell streak-cell--high" />
          <span className="streak-legend__label">More</span>
        </div>
      </div>

      <div className="streak-map__grid-wrap">
        <div className="streak-map__days">
          {DAYS.map((d, i) => (
            <div key={d} className={"streak-day-label " + (i % 2 === 0 ? '' : 'streak-day-label--visible')}>{d}</div>
          ))}
        </div>

        <div className="streak-map__scroll">
          <div className="streak-map__months">
            {monthLabels.map((ml, i) => (
              <div key={i} className="streak-month-label" style={{ left: ml.index * 14 + 'px' }}>{ml.label}</div>
            ))}
          </div>

          <div className="streak-map__grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="streak-week">
                {week.map((cell, di) => {
                  if (!cell) return <div key={di} className="streak-cell streak-cell--empty" />;
                  const colorClass = getColor(cell.completed);
                  return (
                    <div
                      key={di}
                      className={"streak-cell streak-cell--" + colorClass}
                      style={{ animationDelay: (wi * 7 + di) * 2 + 'ms' }}
                      onMouseEnter={e => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {tooltip && typeof document !== 'undefined' && createPortal(
        <div
          className={`streak-tooltip streak-tooltip--${getColor(tooltip.cell.completed)}`}
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 40, // Reduced offset so cursor is close
            position: 'fixed',
          }}
        >
          <strong>{tooltip.cell.completed} submissions</strong> on {new Date(tooltip.cell.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>,
        document.body
      )}
    </div>
  );
}
