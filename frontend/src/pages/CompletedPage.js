import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Target } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';
import ProgressBar from '../components/ui/ProgressBar';
import './TasksPage.css';

export default function CompletedPage() {
  const { tasks, loading, fetchTasks, stats, fetchStats } = useTasks();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks('completed');
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tasks-page animate-fade-in">
      <div className="tasks-page__top">
        <div>
          <h2 className="gradient-text" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Completed Tasks</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>All tasks you have accomplished</p>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="cmd-search" style={{ maxWidth: 280 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="cmd-search-keys">
              <div className="cmd-key">⌘</div>
              <div className="cmd-key">K</div>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <ProgressBar value={stats.completion_percentage} label={"Overall Completion — " + stats.completed_tasks + " of " + stats.total_tasks + " tasks"} />
        </div>
      )}

      <div className="tasks-count">
        {loading ? '...' : filtered.length + " completed task" + (filtered.length !== 1 ? 's' : '')}
      </div>

      {loading ? (
        <div className="tasks-list">
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="tasks-empty">
          <div className="tasks-empty__icon" style={{ color: 'var(--accent-1)' }}>
            <Target size={48} />
          </div>
          <p className="tasks-empty__title">{search ? 'No matching tasks' : 'No completed tasks yet'}</p>
          <p className="tasks-empty__sub">{search ? 'Try a different search term' : 'Complete your first task to see it here'}</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filtered.map(task => <TaskCard key={task.id} task={task} onEdit={() => { }} />)}
        </div>
      )}
    </div>
  );
}
