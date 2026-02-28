import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { ClipboardList, CheckCircle2, CalendarClock, Target, Flame, Trophy, Focus, Plus } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import StreakMap from '../components/streak/StreakMap';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, loading, fetchTasks, fetchStats, stats, streakData, fetchStreakData } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks('today');
    fetchStats();
    fetchStreakData();
  }, [fetchTasks, fetchStats, fetchStreakData]);

  const todayTasks = tasks;
  const completedToday = todayTasks.filter(t => t.completed).length;
  const progress = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const handleEdit = (task) => { setEditTask(task); setShowForm(true); };
  const handleSuccess = () => {
    fetchTasks('today');
    fetchStats();
    setToast({ message: editTask ? 'Task updated!' : 'Task created!', type: 'success' });
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__welcome">
        <div>
          <h2 className="dashboard__greeting">{greeting()}, <span className="gradient-text">{user?.username}</span></h2>
          <p className="dashboard__date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button onClick={() => { setEditTask(null); setShowForm(true); }}>
          <Plus size={16} strokeWidth={2.5} />
          New Task
        </Button>
      </div>

      <div className="dashboard__stats">
        <StatCard title="Total Tasks" value={stats?.total_tasks ?? '—'} icon={<ClipboardList size={22} />} color="indigo"
          sub={stats ? stats.pending_tasks + " pending" : ''} />
        <StatCard title="Completed" value={stats?.completed_tasks ?? '—'} icon={<CheckCircle2 size={22} />} color="emerald"
          sub={stats ? stats.completion_percentage + "% done" : ''} />
        <StatCard title="Pending Today" value={stats ? (stats.due_today - stats.completed_today) : '—'} icon={<CalendarClock size={22} />} color="amber"
          sub={stats ? stats.completed_today + " completed today" : ''} />
        <StatCard title="Completion Rate" value={stats ? stats.completion_percentage + "%" : '—'} icon={<Target size={22} />} color="violet" />
      </div>

      {todayTasks.length > 0 && (
        <div className="dashboard__card">
          <ProgressBar
            value={progress}
            label={"Today's Progress — " + completedToday + " of " + todayTasks.length + " tasks done"}
            animated={progress > 0 && progress < 100}
          />
        </div>
      )}

      <div className="dashboard__grid">
        <div className="dashboard__tasks-col">
          <div className="dashboard__section-header">
            <h3 className="dashboard__section-title">Today's Tasks</h3>
            <Link to="/tasks" className="dashboard__view-all">View all →</Link>
          </div>
          {loading ? (
            <div className="dashboard__loading">
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />)}
            </div>
          ) : todayTasks.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon" style={{ color: 'var(--accent-1)' }}>
                <Focus size={48} />
              </div>
              <p className="dashboard__empty-title">No tasks for today</p>
              <p className="dashboard__empty-sub">Create a task and assign it today's date</p>
              <Button size="sm" onClick={() => { setEditTask(null); setShowForm(true); }}>+ Add Task</Button>
            </div>
          ) : (
            <div className="dashboard__task-list">
              {todayTasks.slice(0, 6).map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
              {todayTasks.length > 6 && (
                <Link to="/tasks?filter=today" className="dashboard__more-link">
                  +{todayTasks.length - 6} more tasks →
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="dashboard__side-col">
          <CalendarWidget />

          <div className="dashboard__card">
            <h3 className="dashboard__section-title" style={{ marginBottom: 16 }}>Quick Stats</h3>
            <div className="dashboard__quick-stats">
              <div className="quick-stat">
                <span className="quick-stat__icon" style={{ color: '#f97316' }}>
                  <Flame size={20} />
                </span>
                <div>
                  <div className="quick-stat__value">{streakData?.current_streak ?? 0}</div>
                  <div className="quick-stat__label">Day streak</div>
                </div>
              </div>
              <div className="quick-stat">
                <span className="quick-stat__icon" style={{ color: '#eab308' }}>
                  <Trophy size={20} />
                </span>
                <div>
                  <div className="quick-stat__value">{streakData?.longest_streak ?? 0}</div>
                  <div className="quick-stat__label">Best streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StreakMap />

      <TaskForm isOpen={showForm} onClose={() => { setShowForm(false); setEditTask(null); }}
        task={editTask} onSuccess={handleSuccess} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
