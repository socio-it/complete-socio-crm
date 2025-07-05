from datetime import datetime
from .clients import MicrosoftClient
from django.http import JsonResponse
from rest_framework.views import APIView
from apps.manage_email.models import PartnerRole
from apps.manage_email.serializers import PartnersSerializer

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

        emails = []
        for i in emails_yesterday:
            body = i.get('body','not found')
            complete_from = i.get('from','none')
            complete_from = complete_from.get('emailAddress','none')
            if complete_from:
                emails.append({
                    "subject":i.get('subject','not subject'),
                    "body":body.get('content'),
                    "email":complete_from.get('address','No email identified'),
                    "name":complete_from.get('name','No name identified'),
                    "date": i.get("receivedDateTime","")
                })

        return JsonResponse({"meetings": emails}, status=200)

class JWTGetEmailsAuth(APIView, GetEmails):
    authentication_classes = []
    permission_classes = ()



class SendersViews:
    def get(self, request):
        try:
            client = MicrosoftClient()
            user_guid = client.get_user_info("it@socio.it.com")

            senders = client.sync_unique_senders(
                user_id=user_guid,
                top=50
            )

            partners = PartnerRole()
            current_partners = partners.bring_records()
            emails = []
            registered_emails = []
            for i in senders:
                email = i.get("from", {}).get("emailAddress", {}).get("address")
                if email not in current_partners and email not in registered_emails:
                    emails.append({
                        "email": email,
                        "name":i.get("from", {}).get("emailAddress", {}).get("name")
                    })
                    registered_emails.append(email)
            partners = partners.get_partners()
            return JsonResponse({"data": list(emails),"current_users":PartnersSerializer(partners,many=True).data}, status=200)
        except:
            return JsonResponse({"data": "Error en base de datos!"}, status=500)
    
    def post(self, request):
        data = request.data
        try:
            if data:
                partners = PartnerRole()        
                partners = partners.create_partner_role(data=data)
                return JsonResponse({"data": PartnersSerializer(partners).data}, status=200)
            return JsonResponse({"data": "Elemento no econtrado!"}, status=404)
        except:
            return JsonResponse({"data": "Error en base de datos!"}, status=500)

    def put(self, request, pk):
        data = request.data
        try:
            if data:
                partners = PartnerRole()        
                partners = partners.update_partner_role(data=data,pk=pk)
                return JsonResponse({"data": PartnersSerializer(partners).data}, status=200)
            return JsonResponse({"data": "Elemento no econtrado!"}, status=404)
        except:
            return JsonResponse({"data": "Error en base de datos!"}, status=500)
        
    def delete(self, request, pk):
        data = request.data
        try:
            if data:
                partners = PartnerRole()
                delete = partners.delete_partner_role(pk=pk)
                return JsonResponse({"data": delete}, status=200)
            return JsonResponse({"data": "Elemento no econtrado!"}, status=404)
        except:
            return JsonResponse({"data": "Error en base de datos!"}, status=500)



class JWTSendersViewsAuth(APIView, SendersViews):
    authentication_classes = []
    permission_classes = ()