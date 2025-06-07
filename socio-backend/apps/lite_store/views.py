from django.http import JsonResponse
from rest_framework.views import APIView

from .utils import take_information
from apps.contacts.models import Contact

class TakeInformation:
    def post(self,request):
        #try:
            linkedin_url = request.data.get('url','')
            personal_information = take_information(url=linkedin_url)

            contact = {
                "linkedin_url": linkedin_url,
                "name": personal_information['nombre'],
                "email": request.data.get('email',''),
                "phone_number": request.data.get('phone_number',''),
                "extra_data": personal_information
            }
            Contact.create_contact(contact)
            return JsonResponse({"response": True}, status=200)
        #except Exception as ex:
                #return JsonResponse({"response": "There is a problem when we tried to create the data","error":repr(ex)}, status=500)
        
class JWTTakeInformationAuth(APIView, TakeInformation):
    authentication_classes = []
    permission_classes = ()