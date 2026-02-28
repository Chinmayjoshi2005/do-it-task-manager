import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const [streakData, setStreakData] = useState(null);

  const fetchTasks = useCallback(async (filter = 'all', category = null) => {
    setLoading(true);
    try {
      const params = { filter };
      if (category) params.category = category;
      const res = await api.get('/tasks/', { params });
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await api.get('/task-stats/');
    setStats(res.data);
  }, []);

  const fetchStreakData = useCallback(async () => {
    const res = await api.get('/streak-data/');
    setStreakData(res.data);
  }, []);

  const createTask = async (data) => {
    const res = await api.post('/tasks/', data);
    setTasks(prev => [res.data, ...prev]);
    fetchStats();
    fetchStreakData();
    return res.data;
  };

  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}/`, data);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    fetchStats();
    fetchStreakData();
    return res.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}/`);
    setTasks(prev => prev.filter(t => t.id !== id));
    fetchStats();
    fetchStreakData();
  };

  const toggleTask = async (id) => {
    const res = await api.post(`/tasks/${id}/toggle/`);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    fetchStats();
    fetchStreakData();
    return res.data;
  };

  const reorderTasks = async (taskIds) => {
    await api.post('/tasks/reorder/', { task_ids: taskIds });
  };

  return (
    <TaskContext.Provider value={{
      tasks, setTasks, loading, stats, streakData,
      fetchTasks, fetchStats, fetchStreakData, createTask, updateTask, deleteTask, toggleTask, reorderTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
