from datetime import timedelta

beat_schedule = {
    'imprimir-hola-mundo-cada-segundo': {
        'task': 'apps.lite_store.tasks.imprimir_hola_mundo',
        'schedule': timedelta(seconds=1),
        'args': (),
    },
}

timezone = 'America/Bogota'
enable_utc = True
