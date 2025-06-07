from django.http import JsonResponse
from rest_framework.views import APIView

from .utils import take_information

class TakeInformation:
    def post(self,request):
        try:
            url = request.data.get('url','')
            personal_information = take_information(url=url)
            print(personal_information)
            return JsonResponse({"response": True}, status=200)
        except Exception as ex:
                return JsonResponse({"response": "There is a problem when we tried to create the data","error":repr(ex)}, status=500)
        
class JWTTakeInformationAuth(APIView, TakeInformation):
    authentication_classes = []
    permission_classes = ()