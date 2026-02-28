import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import './TaskCard.css';

const CATEGORY_COLORS = {
  personal: 'rose', work: 'indigo', health: 'emerald',
  learning: 'amber', finance: 'cyan', other: 'violet'
};

const CATEGORY_LABELS = {
  personal: 'Personal', work: 'Work', health: 'Health',
  learning: 'Learning', finance: 'Finance', other: 'Other'
};

export default function TaskCard({ task, onEdit, dragging }) {
  const { toggleTask, deleteTask } = useTasks();
  const [toggling, setToggling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    setAnimating(true);
    await toggleTask(task.id);
    setToggling(false);
    setTimeout(() => setAnimating(false), 500);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTask(task.id);
    setDeleting(false);
    setShowConfirm(false);
  };

  const isOverdue = task.due_date && !task.completed &&
    new Date(task.due_date) < new Date(new Date().toDateString());

  const colorKey = CATEGORY_COLORS[task.category] || 'violet';

  return (
    <>
      <div className={"task-card " + (task.completed ? "task-card--done" : "") + " " + (dragging ? "task-card--dragging" : "") + " " + (animating ? "task-card--animating" : "")}>
        <div className="task-card__check-wrap">
          <button
            className={"task-card__check " + (task.completed ? "task-card__check--checked" : "")}
            onClick={!task.completed ? handleToggle : undefined}
            disabled={toggling || task.completed}
          >
            {task.completed && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        </div>

        <div className="task-card__body">
          <div className="task-card__top">
            <h4 className={"task-card__title " + (task.completed ? "task-card__title--done" : "")}>{task.title}</h4>
            <span className={"task-card__cat task-card__cat--" + colorKey}>{CATEGORY_LABELS[task.category]}</span>
          </div>
          {task.description && (
            <p className="task-card__desc">{task.description}</p>
          )}
          <div className="task-card__meta">
            {task.due_date && (
              <span className={"task-card__date " + (isOverdue ? "task-card__date--overdue" : "")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {isOverdue && <span className="task-card__overdue-tag">Overdue</span>}
              </span>
            )}
            {task.completed_at && (
              <span className="task-card__completed-at">
                ✓ Done {new Date(task.completed_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="task-card__actions">
          <button className="task-card__action task-card__action--edit" onClick={() => onEdit(task)} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="task-card__action task-card__action--delete" onClick={() => setShowConfirm(true)} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </button>
        </div>

        {!task.completed && (
          <div className="task-card__drag-handle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="6" r="1" fill="currentColor" />
              <circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" />
              <circle cx="9" cy="18" r="1" fill="currentColor" /><circle cx="15" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={"Are you sure you want to delete \"" + task.title + "\"? This action cannot be undone."}
        loading={deleting}
      />
    </>
  );
}
