import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import './TasksPage.css';

const FILTERS = [
  { key: 'all', label: 'All Tasks' },
  { key: 'today', label: "Today" },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'pending', label: 'Pending' },
];

const CATEGORIES = [
  { key: '', label: 'All Categories' },
  { key: 'personal', label: 'Personal' },
  { key: 'work', label: 'Work' },
  { key: 'health', label: 'Health' },
  { key: 'learning', label: 'Learning' },
  { key: 'finance', label: 'Finance' },
  { key: 'other', label: 'Other' },
];

function SortableTaskCard({ task, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} dragging={isDragging} />
    </div>
  );
}

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get('filter') || 'all';
  const activeCategory = searchParams.get('category') || '';

  const { tasks, setTasks, loading, fetchTasks, reorderTasks } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const load = useCallback(() => {
    fetchTasks(activeFilter, activeCategory || null);
  }, [fetchTasks, activeFilter, activeCategory]);

  useEffect(() => { load(); }, [load]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);
    await reorderTasks(reordered.map(t => t.id));
  };

  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (task) => { setEditTask(task); setShowForm(true); };
  const handleSuccess = () => {
    load();
    setToast({ message: editTask ? 'Task updated!' : 'Task created!', type: 'success' });
  };

  return (
    <div className="tasks-page animate-fade-in">
      <div className="tasks-page__top">
        <div className="tasks-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={"tasks-filter-btn " + (activeFilter === f.key ? "tasks-filter-btn--active" : "")}
              onClick={() => setSearchParams(p => { p.set('filter', f.key); return p; })}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button onClick={() => { setEditTask(null); setShowForm(true); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Task
        </Button>
      </div>

      <div className="tasks-page__controls">
        <div className="cmd-search">
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

        <div className="tasks-cats">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={"tasks-cat-btn " + (activeCategory === c.key ? "tasks-cat-btn--active" : "")}
              onClick={() => setSearchParams(p => { c.key ? p.set('category', c.key) : p.delete('category'); return p; })}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tasks-count">
        {loading ? '...' : filtered.length + " task" + (filtered.length !== 1 ? 's' : '')}
      </div>

      {loading ? (
        <div className="tasks-list">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="tasks-empty">
          <div className="tasks-empty__icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {search ? (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            ) : (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            )}
          </div>
          <p className="tasks-empty__title">{search ? 'No matching tasks' : 'No tasks here'}</p>
          <p className="tasks-empty__sub">{search ? 'Try a different search term' : 'Create your first task to get started'}</p>
          {!search && <Button size="sm" onClick={() => { setEditTask(null); setShowForm(true); }}>+ Create Task</Button>}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="tasks-list">
              {filtered.map(task => (
                <SortableTaskCard key={task.id} task={task} onEdit={handleEdit} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <TaskForm isOpen={showForm} onClose={() => { setShowForm(false); setEditTask(null); }}
        task={editTask} onSuccess={handleSuccess} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
