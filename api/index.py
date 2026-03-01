import os
import sys
from pathlib import Path

# Add backend directory to Python path
BACKEND_DIR = Path(__file__).resolve().parent.parent / 'backend'
sys.path.append(str(BACKEND_DIR))



import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'taskmanager.settings')
django.setup()

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
