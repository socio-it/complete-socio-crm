import json
from django.http import JsonResponse
from rest_framework.views import APIView


from .utils import take_information
from apps.contacts.models import Contact
from .clients import MicrosoftClient

class TakeInformation:
    def post(self,request):
        #try:
            linkedin_url = request.data.get('url','')
            personal_information = take_information(url=linkedin_url)

            contact = {
                "linkedin_url": linkedin_url,
                "name": personal_information.get('nombre',''),
                "email": request.data.get('email',''),
                "phone_number": request.data.get('phone_number',''),
                "extra_data": personal_information
            }
            Contact.create_contact(contact)
            
            mcsf = MicrosoftClient()
            access_token = mcsf.get_access_token()
            json_string = json.dumps(personal_information, ensure_ascii=False, separators=(",", ":"))
            data = {
                "crf02_name": personal_information['nombre'],
                "crf02_jsondata": json_string,
                "crf02_linkedinurl": linkedin_url,
                "crf02_phonenumber": request.data.get('phone_number',''),
                "crf02_email": request.data.get('email','')
            }
            creation=mcsf.create_contact(access_token, data)
            
            
            return JsonResponse({"response": True}, status=200)
        #except Exception as ex:
                #return JsonResponse({"response": "There is a problem when we tried to create the data","error":repr(ex)}, status=500)
        
class JWTTakeInformationAuth(APIView, TakeInformation):
    authentication_classes = []
    permission_classes = ()

