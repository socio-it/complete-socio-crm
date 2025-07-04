from django.http import JsonResponse
from rest_framework.views import APIView
from .clients import MicrosoftClient
from datetime import datetime

class GetEmails:
    def get(self, request, date_from, date_to):
        client = MicrosoftClient()
        user_guid = client.get_user_info("it@socio.it.com")
        date_from = datetime.strptime(date_from, "%Y-%m-%d").date()
        date_to = datetime.strptime(date_to, "%Y-%m-%d").date()

        emails_yesterday = client.get_messages_between(
            user_id=user_guid,
            start_utc=date_from,
            end_utc=date_to
        )
        print(emails_yesterday)
        emails = []
        for i in emails_yesterday:
            body = i.get('body','not found')
            body = body.get('content') 
            subject = i.get('subject','not subject')
            complete_from = i.get('from','none')
            complete_from = complete_from.get('emailAddress','none')
            if complete_from:
                email = complete_from.get('address','No email identified')
                name = complete_from.get('name','No name identified')
                emails.append({
                    "subject":subject,
                    "body":body,
                    "email":email,
                    "name":name
                })

        return JsonResponse({"meetings": emails}, status=200)

class JWTGetEmailsAuth(APIView, GetEmails):
    authentication_classes = []
    permission_classes = ()