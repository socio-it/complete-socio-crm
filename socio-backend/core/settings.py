
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = ['*']
SECURE_PROXY_SSL_HEADER=("HTTP_X_FORWARDED_PROTO","https")

CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True
CORS_ORIGIN_WHITELIST = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CLIENT_ID=os.getenv('CLIENT_ID')
TENANT_ID=os.getenv('TENANT_ID')
SECRET_ID=os.getenv('SECRET_ID')

SPA_CLIENT_ID = os.getenv('SPA_CLIENT_ID')
SPA_TENANT_ID = os.getenv('SPA_TENANT_ID')

AD_URL=os.getenv('AD_URL')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django_auth_adfs',
    'corsheaders',

    # REST y auth
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.microsoft',
    'apps.accounts',
    'apps.lite_store',
    'apps.contacts',
]
"""
AUTH_ADFS = {
    "TENANT_ID": "23d269ba-73b5-4a22-9cb5-66178f7dde6b",
    "CLIENT_ID": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
    "AUDIENCE": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
    "ISSUER":  "https://login.microsoftonline.com/23d269ba-73b5-4a22-9cb5-66178f7dde6b/v2.0",
    "CLAIM_MAPPING": {
        "first_name": "given_name",
        "last_name": "family_name",
        "username": "upn"
    },
    "CA_BUNDLE": True,
    "RELYING_PARTY_ID": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
}"""

AUTH_ADFS = {
    "TENANT_ID": "23d269ba-73b5-4a22-9cb5-66178f7dde6b",
    "CLIENT_ID": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
    "AUDIENCE": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
    "RELYING_PARTY_ID": "87512db1-e64b-4ebb-936b-d116f2f6ab9c",
    "ISSUER": "https://login.microsoftonline.com/23d269ba-73b5-4a22-9cb5-66178f7dde6b/v2.0",

    "USERNAME_CLAIM": "upn",
    "CLAIM_MAPPING": {
        "first_name": "given_name",
        "last_name":  "family_name"
    },
    "CA_BUNDLE": True,
}






LOGIN_URL = "django_auth_adfs:login"
LOGIN_REDIRECT_URL = "/"




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'django_auth_adfs.rest_framework.AdfsAccessTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "loggers": {
        "django_auth_adfs": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    },
}



AUTHENTICATION_BACKENDS = (
    'django_auth_adfs.backend.AdfsAuthCodeBackend',
    'django_auth_adfs.backend.AdfsAccessTokenBackend',
    'django.contrib.auth.backends.ModelBackend',
)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware'
]

CUSTOM_FAILED_RESPONSE_VIEW = 'dot.path.to.custom.views.login_failed'

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = os.getenv('WSGI_APPLICATION')


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB'),
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'accounts.UsersByTenant'

AGENTS_API_URL = os.getenv('AGENTS_API_URL')

# Celery
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1')

CELERY_BEAT_SCHEDULE = {
    'imprimir-hola-mundo-cada-segundo': {
        'task': 'apps.lite_store.tasks.imprimir_hola_mundo',
        'schedule': timedelta(seconds=1),
        'args': (),
    },
}

# Opcional: zona horaria
CELERY_TIMEZONE = 'America/Bogota'
CELERY_ENABLE_UTC = True    