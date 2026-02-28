import React, { useState } from 'react';
import './CalendarWidget.css';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="calendar-widget">
            <div className="calendar-widget__header">
                <div className="calendar-widget__month">
                    {currentDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                </div>
                <div className="calendar-widget__nav">
                    <button onClick={prevMonth}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button onClick={nextMonth}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                </div>
            </div>
            <div className="calendar-widget__grid">
                {days.map(d => (
                    <div key={d} className="calendar-widget__day-name">{d}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-widget__day empty" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = i + 1;
                    const isToday = isCurrentMonth && date === today.getDate();
                    return (
                        <div key={date} className={`calendar-widget__day ${isToday ? 'today' : ''}`}>
                            <div className="calendar-widget__day-inner">
                                {date}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
