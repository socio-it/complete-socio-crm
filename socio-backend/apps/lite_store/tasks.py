# socio-backend/apps/lite_store/tasks.py

from core.celery import celery_app

@celery_app.task
def imprimir_hola_mundo():
    print("¡hola mundo!")
