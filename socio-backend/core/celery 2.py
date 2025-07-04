# socio-backend/apps/core/celery.py

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

celery_app = Celery('socio-backend')

# 1) Carga las vars CELERY_ desde settings.py
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
# 2) Carga beat_schedule, timezone, etc. desde celery_config.py
celery_app.config_from_object('core.celery_config')

# 3) Detecta tareas en INSTALLED_APPS
celery_app.autodiscover_tasks()
