import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trophy } from 'lucide-react';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/leaderboard/')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to load leaderboard", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="leaderboard-page animate-fade-in">
            <div className="leaderboard-header">
                <h2 className="leaderboard-header__title gradient-text">Global Leaderboard</h2>
                <p className="leaderboard-header__subtitle">Top 50 most productive users on TaskFlow based on tasks completed.</p>
            </div>

            {loading ? (
                <div className="leaderboard-list">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="leaderboard-item skeleton" style={{ height: 80 }} />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="tasks-empty">
                    <div className="tasks-empty__icon" style={{ color: 'var(--accent-warning)' }}>
                        <Trophy size={48} />
                    </div>
                    <p className="tasks-empty__title">Leaderboard Empty</p>
                    <p className="tasks-empty__sub">No users have completed any tasks yet.</p>
                </div>
            ) : (
                <div className="leaderboard-list">
                    {users.map((u, i) => (
                        <div key={i} className={`leaderboard-item ${u.rank <= 3 ? `top-${u.rank}-card` : 'top-other-card'}`}>
                            <div className={`leaderboard-rank ${u.rank <= 3 ? `top-${u.rank}` : 'top-other'}`}>
                                #{u.rank}
                            </div>
                            <div className="leaderboard-user">
                                <div className="leaderboard-avatar">
                                    {u.avatar_base64 ? (
                                        <img src={u.avatar_base64} alt={`${u.username} avatar`} />
                                    ) : (
                                        u.username?.[0]?.toUpperCase()
                                    )}
                                </div>
                                <div className="leaderboard-info">
                                    <div className="leaderboard-name">{u.username}</div>
                                    <div className="leaderboard-bio">{u.bio || 'Completed their tasks with style.'}</div>
                                </div>
                            </div>
                            <div className="leaderboard-stats">
                                <div className="leaderboard-score">{u.completed_tasks}</div>
                                <div className="leaderboard-score-label">Solved</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
