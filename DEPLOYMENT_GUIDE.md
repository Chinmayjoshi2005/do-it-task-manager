# Deployment Guide: Free Permanent Hosting Options

Because Vercel is a "Serverless" platform, it wipes out its temporary disk storage (like `/tmp/db.sqlite3`) every time a function finishes executing. To have a fully functional web app where users are never forgotten, you have two approaches:

## Approach 1 (Recommended & Easy): Keep Vercel for Frontend, use Render for Backend
This is the standard industry practice for modern web apps.

1. **Frontend**: Keep hosting your React frontend on **Vercel** (or Netlify). It's great for static files.
2. **Backend & Database**: Move your Django backend to **Render.com**. Render provides a free fully-fledged server environment that runs 24/7 without deleting files on a whim. 
   - Render also gives you a free, permanent **PostgreSQL** database built-in.
   - **Cost**: 100% Free.

## Approach 2: Move Everything to Render or Railway
If you want everything in a single place without a split frontend/backend:

1. **Render.com**: You can deploy your entire Django + React app together on Render using a standard Build Command. It comes with a free permanent PostgreSQL database.
2. **Railway.app**: Excellent developer experience. Gives you $5 free credits every month which is plenty to run a small Django backend and Postgres database permanently without ever going down. 
3. **PythonAnywhere**: Great for specifically Python/Django backends, completely free tier that gives you a permanent MySQL/SQLite database out-of-the-box. (Requires some manual configuration compared to Render).

## How to Set Up Render + PostgreSQL (The Best Route)
Since you already have `dj_database_url` installed in your backend, deploying on Render is seamless:

1. Go to **Render.com** and sign in.
2. Click **New +** -> **PostgreSQL**. Create the database (Free) and copy the "Internal Database URL".
3. Click **New +** -> **Web Service**. Connect this GitHub repository.
4. Set the Start Command to: `gunicorn taskmanager.wsgi`
5. Set your Environment Variables:
   - `DATABASE_URL` = paste the URL you copied earlier.
   - `SECRET_KEY` = create a random long string.
   - `DEBUG` = `False`
6. Click Deploy. Your backend and database will now live forever!
