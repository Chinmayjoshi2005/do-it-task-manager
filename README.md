# TaskFlow — Production-Ready Task Manager

A full-stack task management application with React frontend and Django REST Framework backend.

## Features

- **Authentication**: JWT-based with register, login, logout, forgot/reset/change password
- **Security Questions**: Used for password recovery
- **Task Management**: Create, edit, delete, toggle, filter, search, drag-and-drop reorder
- **Categories**: Personal, Work, Health, Learning, Finance, Other
- **Filters**: All, Today, Upcoming, Pending, Completed
- **Streak Heatmap**: GitHub-style 365-day activity visualization
- **Profile**: Stats, completion metrics, streak data
- **UI**: Dark/Light/System theme, responsive, animated

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router + Axios |
| Styling | CSS Modules + CSS Variables |
| Drag & Drop | @dnd-kit |
| Backend | Django 5 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite3 |
| CORS | django-cors-headers |

---

## Project Structure

```
taskmanager/
├── backend/
│   ├── apps/
│   │   ├── authentication/    # User model, JWT auth, password reset
│   │   └── tasks/             # Task CRUD, streak, stats
│   ├── taskmanager/           # Django settings, urls, wsgi
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── api/               # Axios instance with JWT interceptor
        ├── components/
        │   ├── auth/
        │   ├── layout/        # Sidebar, Header, Layout
        │   ├── streak/        # GitHub-style heatmap
        │   ├── tasks/         # TaskCard, TaskForm
        │   └── ui/            # Button, Input, Modal, Toast, etc.
        ├── context/           # AuthContext, ThemeContext, TaskContext
        ├── pages/             # All route pages
        └── styles/            # Global CSS variables
```

---

## Setup — Backend

### Prerequisites
- Python 3.10+

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env: set SECRET_KEY, DEBUG, CORS_ALLOWED_ORIGINS

# Run migrations
python manage.py makemigrations authentication tasks
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start dev server
python manage.py runserver
```

Backend runs at: http://localhost:8000

---

## Setup — Frontend

### Prerequisites
- Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
# REACT_APP_API_URL defaults to /api (proxied)

# Start dev server
npm start
```

Frontend runs at: http://localhost:3000

> The `"proxy": "http://localhost:8000"` in package.json handles API routing automatically.

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register/ | No | Create account |
| POST | /api/login/ | No | Login, get JWT tokens |
| POST | /api/logout/ | Yes | Invalidate refresh token |
| GET | /api/profile/ | Yes | Get current user |
| POST | /api/token/refresh/ | No | Refresh access token |
| POST | /api/forgot-password/ | No | Verify username + security answer |
| POST | /api/reset-password/ | No | Reset password |
| POST | /api/change-password/ | Yes | Change password |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/tasks/ | Yes | List tasks (filter, category query params) |
| POST | /api/tasks/ | Yes | Create task |
| PUT | /api/tasks/{id}/ | Yes | Update task |
| DELETE | /api/tasks/{id}/ | Yes | Delete task |
| POST | /api/tasks/{id}/toggle/ | Yes | Toggle complete/incomplete |
| POST | /api/tasks/reorder/ | Yes | Reorder tasks (drag & drop) |
| GET | /api/tasks/completed/ | Yes | List completed tasks |
| GET | /api/streak-data/ | Yes | 365-day heatmap data |
| GET | /api/task-stats/ | Yes | Task statistics |

### Query Parameters for GET /api/tasks/
- `filter`: `all` | `today` | `upcoming` | `pending` | `completed`
- `category`: `personal` | `work` | `health` | `learning` | `finance` | `other`

---

## Database Schema

### Users Table
```
id, username (unique), email (unique), password (hashed),
security_question, security_answer_hash (SHA-256),
date_joined, last_login
```

### Tasks Table
```
id, user_id (FK), title, description, category,
status (pending/in_progress/completed), completed (bool),
due_date, order, created_at, updated_at, completed_at
```

---

## Production Deployment

### Backend (Render / Railway)

1. Set environment variables:
   ```
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.com
   ```

2. Run:
   ```bash
   gunicorn taskmanager.wsgi:application
   ```

3. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```

### Frontend (Vercel / Netlify)

1. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-api.com/api
   ```

2. Build command: `npm run build`
3. Output directory: `build`

---

## Environment Variables

### Backend `.env`
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:8000/api
```

---

## Security Notes

- Passwords are hashed using Django's PBKDF2 (never stored plain text)
- Security answers are SHA-256 hashed
- JWT access tokens expire in 24 hours
- JWT refresh tokens expire in 7 days
- CORS restricted to configured origins
- In production: DEBUG=False, HTTPS headers enforced
