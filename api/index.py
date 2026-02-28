import os
import sys
from pathlib import Path

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent / 'backend'
sys.path.append(str(BACKEND_DIR))

# Handle SQLite DB moving to /tmp for read/write on Vercel
if os.getenv('VERCEL') == '1':
    import shutil
    ORIGINAL_DB = BACKEND_DIR / 'db.sqlite3'
    TMP_DB = Path('/tmp/db.sqlite3')
    if ORIGINAL_DB.exists() and not TMP_DB.exists():
        try:
            shutil.copy2(ORIGINAL_DB, TMP_DB)
        except Exception:
            pass

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmanager.settings')
django.setup()

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
