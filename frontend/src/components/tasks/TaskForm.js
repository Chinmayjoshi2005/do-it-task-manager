import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import { useTasks } from '../../context/TaskContext';

const CATEGORIES = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'health', label: 'Health' },
  { value: 'learning', label: 'Learning' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
];

export default function TaskForm({ isOpen, onClose, task, onSuccess }) {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState({ title: '', description: '', category: 'personal', due_date: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'personal',
        due_date: task.due_date || '',
      });
    } else {
      setForm({ title: '', description: '', category: 'personal', due_date: '' });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErrors({ title: 'Title is required.' }); return; }
    setLoading(true);
    try {
      if (task) {
        await updateTask(task.id, form);
      } else {
        await createTask(form);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const errs = err.response?.data?.errors || {};
      const flat = {};
      for (const [k, v] of Object.entries(errs)) flat[k] = Array.isArray(v) ? v[0] : v;
      setErrors(flat);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input label="Title *" name="title" value={form.title} onChange={handleChange}
          placeholder="What needs to be done?" error={errors.title} autoFocus />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange}
          placeholder="Add more details..." rows={3} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select label="Category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
          <Input label="Due Date" type="date" name="due_date" value={form.due_date} onChange={handleChange} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{task ? 'Update Task' : 'Create Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
