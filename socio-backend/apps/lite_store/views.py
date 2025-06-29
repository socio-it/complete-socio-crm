import os
import ast
import json
import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


import logging
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist


from .utils import take_information
from apps.contacts.models import Contact
from .clients import MicrosoftClient
from .models import OnlineMeetingsAnalyzed, OnlineMeetingTasks, ConsultantResponses, OnlineReminderTasks
from .serializers import *
from core import settings

logger = logging.getLogger(__name__)

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


class ManageTeamsMeetings:
    def get(self, request):
        transcription = """
WEBVTT

f84e4e30-5070-4d6d-bf8b-664e03bdf995/31-0
00:00:04.574 --> 00:00:12.635
<v IT Service>Hello guys this is just a short call I
want to do just 'cause we want to make an</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/31-1
00:00:12.635 --> 00:00:17.014
<v IT Service>AI agent who will help us in order to
have.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/33-0
00:00:17.324 --> 00:00:17.444
<v IT Service>Umm.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/54-0
00:00:19.674 --> 00:00:27.284
<v IT Service>Teams meetings after that we will be able
to analyze the transcription about the</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/54-1
00:00:27.284 --> 00:00:27.754
<v IT Service>part.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/61-0
00:00:28.354 --> 00:00:32.194
<v IT Service>The final idea is take that transcription.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/78-0
00:00:32.754 --> 00:00:39.978
<v IT Service>Analyze what task comes from that meeting
and that information or those tasks will</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/78-1
00:00:39.978 --> 00:00:42.154
<v IT Service>be created in a database.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/81-0
00:00:42.154 --> 00:00:44.314
<v IT Service>So this means we are going to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/93-0
00:00:45.054 --> 00:00:49.454
<v IT Service>Save the complete video in order to
change the transcription after that.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/98-0
00:00:49.844 --> 00:00:51.164
<v IT Service>We will be able to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/111-0
00:00:52.814 --> 00:00:59.454
<v IT Service>I'm not sure after that we will be able
to discriminate.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/120-0
00:01:01.054 --> 00:01:06.094
<v IT Service>If that task is, if that is a task.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/136-0
00:01:09.004 --> 00:01:13.557
<v IT Service>Oh well,
if we can create those tasks in our</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/136-1
00:01:13.557 --> 00:01:15.884
<v IT Service>system or our database.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/153-0
00:01:15.884 --> 00:01:25.679
<v IT Service>So first I think we should send an e-mail,
an e-mail to Juan to explain how we will</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/153-1
00:01:25.679 --> 00:01:28.244
<v IT Service>take that information.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/164-0
00:01:29.734 --> 00:01:35.694
<v IT Service>So the second part is have a meeting with
Juan Parra to now.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/170-0
00:01:37.454 --> 00:01:39.894
<v IT Service>What will be a step by step about?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/176-0
00:01:40.284 --> 00:01:44.524
<v IT Service>That after that.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/185-0
00:01:46.054 --> 00:01:49.534
<v IT Service>The IT team should be in charge of.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/196-0
00:01:51.494 --> 00:01:55.254
<v IT Service>Create the architecture of that task
finally.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/203-0
00:01:57.054 --> 00:01:58.134
<v IT Service>And well, finally now.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/217-0
00:01:58.134 --> 00:02:01.799
<v IT Service>Well,
next step will be take the information</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/217-1
00:02:01.799 --> 00:02:04.894
<v IT Service>about the meeting discriminative task.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/225-0
00:02:05.334 --> 00:02:08.614
<v IT Service>So for that I guess it is necessary to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/231-0
00:02:10.414 --> 00:02:11.134
<v IT Service>I'm not sure.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/234-0
00:02:11.134 --> 00:02:12.574
<v IT Service>I guess it is necessary to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/239-0
00:02:14.254 --> 00:02:15.374
<v IT Service>Fill PDF I have to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/242-0
00:02:17.454 --> 00:02:18.214
<v IT Service>To create.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/245-0
00:02:20.294 --> 00:02:20.854
<v IT Service>A format to.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/249-0
00:02:22.374 --> 00:02:23.334
<v IT Service>Feel with this information.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/252-0
00:02:24.004 --> 00:02:26.444
<v IT Service>Right. So.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/275-0
00:02:28.774 --> 00:02:35.016
<v IT Service>Well, finally, finally,
the Dia's we can create the task or we</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/275-1
00:02:35.016 --> 00:02:39.574
<v IT Service>can extract different tasks of that AI
agent.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/296-0
00:02:41.334 --> 00:02:46.073
<v IT Service>And well,
the last one will be create a different</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/296-1
00:02:46.073 --> 00:02:52.614
<v IT Service>name for reject our update different
tasks right about that meeting.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/304-0
00:02:54.444 --> 00:02:56.764
<v IT Service>Finally, I'm not sure.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/313-0
00:02:57.164 --> 00:03:01.724
<v IT Service>I guess finally we can and secure
different tasks, right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/322-0
00:03:01.724 --> 00:03:06.564
<v IT Service>We have to create the portfolio when we
can.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/328-0
00:03:08.134 --> 00:03:12.774
<v IT Service>When we where we can.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/339-0
00:03:14.654 --> 00:03:18.494
<v IT Service>Select those tasks to our AI agent.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/344-0
00:03:18.494 --> 00:03:23.534
<v IT Service>Execute that task so well that that's it.
I'm not sure if.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/358-0
00:03:25.034 --> 00:03:29.434
<v IT Service>We need something else or something
additional to that information, right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/364-0
00:03:29.434 --> 00:03:32.674
<v IT Service>But this is just what I what I wanna do
right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/373-0
00:03:34.194 --> 00:03:35.514
<v IT Service>And I consider it's great.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/378-0
00:03:35.514 --> 00:03:37.114
<v IT Service>It is super, super great.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/382-0
00:03:37.114 --> 00:03:40.034
<v IT Service>We are automating different things, right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/410-0
00:03:40.034 --> 00:03:43.858
<v IT Service>It is not necessary to use well for
example things.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/410-1
00:03:43.858 --> 00:03:49.373
<v IT Service>My answer could be or could work,
but more interest about will be that the</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/410-2
00:03:49.373 --> 00:03:51.874
<v IT Service>agent can create different things.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/419-0
00:03:52.614 --> 00:03:55.854
<v IT Service>Or different methods who will help us to?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/436-0
00:03:57.294 --> 00:04:01.646
<v IT Service>To manage different platforms,
you know for example,</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/436-1
00:04:01.646 --> 00:04:06.574
<v IT Service>the idea is we can create that AI engine
and not just work.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/459-0
00:04:08.054 --> 00:04:11.432
<v IT Service>In for a specific for any specific
company,</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/459-1
00:04:11.432 --> 00:04:17.574
<v IT Service>it is better if we can implement these
for company one. Company two, company 3.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/463-0
00:04:17.614 --> 00:04:20.494
<v IT Service>It would work better, right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/466-0
00:04:20.494 --> 00:04:22.574
<v IT Service>So let me think about it.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/478-0
00:04:22.814 --> 00:04:27.494
<v IT Service>I'm pretty sure we can create different
AEA agents, different automated tasks.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/486-0
00:04:28.394 --> 00:04:33.114
<v IT Service>For that, so I'm not sure what about.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/496-0
00:04:34.614 --> 00:04:38.374
<v IT Service>Having a meeting to make a follow up
about this idea.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/502-0
00:04:40.374 --> 00:04:41.494
<v IT Service>Next, next week, right.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/508-0
00:04:41.494 --> 00:04:47.294
<v IT Service>Right.
Like next Friday it it works for everyone.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/512-0
00:04:47.334 --> 00:04:49.334
<v IT Service>It it is amazing, right?</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/529-0
00:04:49.614 --> 00:04:54.534
<v IT Service>If it works for everyone, amazing,
we can implement those kind of things.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/532-0
00:04:54.734 --> 00:04:57.894
<v IT Service>So for today, that's all I think.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/536-0
00:04:58.674 --> 00:04:59.994
<v IT Service>We don't have any other point.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/540-0
00:05:00.554 --> 00:05:02.154
<v IT Service>OK. Bye bye.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/545-0
00:05:02.194 --> 00:05:04.234
<v IT Service>See you at next Friday, guys.</v>

f84e4e30-5070-4d6d-bf8b-664e03bdf995/546-0
00:05:04.474 --> 00:05:05.354
<v IT Service>Have a very good day.</v>

        """
        client = MicrosoftClient()
        user_guid = client.get_user_info("it@socio.it.com")
        events = client.get_interviews(user_guid)
        print(f"Events found: {len(events)}")
        for event in events:
            join_url = event.get("onlineMeeting", "")
            join_url = join_url.get("joinUrl", "")
            print(f"Join URL: {join_url}",event.get('subject'),user_guid)
            meetings = client.get_online_meetings(join_url, user_guid)
            print(meetings)
            if meetings:
                print(f"Meetings found: {len(meetings)}")
                for meeting in meetings:
                    meeting_id = meeting.get("id", "")
                    if meeting_id:
                        transcription = client.get_transcription(meeting_id, user_guid)
                        print(f"Transcription for meeting {meeting_id}: {transcription}")
                        if transcription:
                            for transcript in transcription:
                                transcript_it = transcript.get("id", "")
                                if transcript_it:
                                    transcription_text = client.get_transcription_content(meeting_id, user_guid, transcript_it)
                                    if transcription_text:
                                        print(transcription_text)
        url = settings.AGENTS_API_URL+"v2/v2/teams_task_builder_agent"
        params = {
            "message": transcription
        }

        headers = {
            "accept": "application/json"
        }

        response = requests.post(url, params=params, headers=headers, timeout=200)
        response.raise_for_status()  

        response_data = response.json() 
        
        meeting, created = OnlineMeetingsAnalyzed.objects.get_or_create(
            meeting_id=4,
            defaults={
                "subject": "New reunion",
                "created_by": "brian restrepo",
                "summary": response_data.get('summary', ''),
            }
        )

        if created:
            for task in response_data.get('tasks', []):
                OnlineMeetingTasks.objects.create(
                    meeting=meeting,
                    task_description=task
                )
        """"""
        return JsonResponse({"meetings": 'meetings were created'}, status=200)
    
    def patch(self,request, pk=None):
        try:
            if pk is None:
                return JsonResponse({"response": "No meeting ID provided"}, status=400)
            meeting = OnlineMeetingTasks.objects.get(id=pk)
            if not meeting:
                return JsonResponse({"response": "Meeting not found"}, status=404)
            meeting.status = request.data.get('status', 'Active')
            meeting.save()
            return JsonResponse({"response": True}, status=200)
        except Exception as ex:
            return JsonResponse({"response": "There is a problem when we tried to create the data","error":repr(ex)}, status=500)
    
    def delete(self, request, pk=None):
        try:
            if pk is None:
                return JsonResponse({"response": "No meeting ID provided"}, status=400)
            meeting = OnlineMeetingTasks.objects.get(id=pk)
            if not meeting:
                return JsonResponse({"response": "Meeting not found"}, status=404)
            meeting.delete()
            return JsonResponse({"response": True}, status=200)
        except Exception as ex:
            return JsonResponse({"response": "There is a problem when we tried to delete the data","error":repr(ex)}, status=500)

class JWTManageTeamsMeetingsAuth(APIView, ManageTeamsMeetings):
    authentication_classes = []
    permission_classes = ()


class MakeProblemAnalysis:
    def post(self, request):
        url = settings.AGENTS_API_URL + "v2/v2/agent_sales_consultant_invoaction"
        data = request.data

        headers = {
            "accept": "application/json"
        }
        ai_agent_response = requests.post(url, json=data, headers=headers, timeout=60)
        response = ai_agent_response.json()
        ConsultantResponses.objects.create(
            problem_situation=data.get('problemSituation'),
            context={
                'industry':  data.get('industry'),
                'product':   data.get('product'),
                'area':      data.get('area'),
            },
            needs={
                'functionality':  data.get('functionality'),
                'businessGoals':  data.get('businessGoals'),
                'restrictions':   data.get('restrictions'),
            },
            proposal=response
        )

        '"Estimado cliente,\n\nEntiendo que se encuentra buscando una solución para [mencionar brevemente la necesidad \"test\" si se conoce algo, ej: optimizar sus procesos de ventas].  Sin embargo, para poder ofrecerle una propuesta de valor verdaderamente efectiva y que se ajuste a sus necesidades específicas, necesito una comprensión más profunda de su situación.\n\nImaginemos, por ejemplo, que su objetivo es el mismo que el descrito en nuestro ejemplo previo: mejorar la eficiencia del equipo de ventas.  En ese caso, podríamos ofrecer una solución como la descrita en el JSON que le he proporcionado (ver ejemplo adjunto).  Esta solución, un Sistema de Gestión de Relaciones con Clientes (CRM) básico,  promete un aumento proyectado de ventas del 15-20% en 6 meses, gracias a una mejor gestión de contactos y oportunidades.\n\nSin embargo, la realidad es que \"test\" es demasiado general.  Para poder generar una propuesta de valor similarmente precisa y efectiva para *su* situación particular, necesito que me proporcione más detalles.  Necesitamos definir conjuntamente:\n\n* **Objetivos concretos:** ¿Qué busca lograr exactamente? ¿Aumentar las ventas en un porcentaje específico? ¿Reducir costos? ¿Mejorar la satisfacción del cliente?  Cuanto más específico sea, mejor podré adaptarme a sus necesidades.\n* **Restricciones:** ¿Tiene limitaciones presupuestarias? ¿Restricciones tecnológicas? ¿Limitaciones de tiempo?  Conocer sus limitaciones me permitirá ofrecer soluciones realistas y factibles.\n* **Descripción detallada de la necesidad:**  Describa el problema que está intentando solucionar con el máximo detalle posible. ¿Qué procesos son ineficientes? ¿Qué recursos están siendo mal utilizados? ¿Qué métricas se ven afectadas?\n\nUna vez que tenga esta información detallada, podré elaborar una propuesta de valor completa, incluyendo un resumen ejecutivo, un identificador de solución único, el nombre de la solución recomendada, las características que aborda, los objetivos que cumple, el valor estimado y los pasos recomendados para la implementación.  Además, podré incluir una estimación de costos y un análisis de la complejidad de la integración con sus sistemas existentes.\n\nEn resumen, la información que me proporcione determinará la calidad y la eficacia de la solución que le ofrezco.  Estoy ansioso por colaborar con usted y ayudarle a alcanzar sus objetivos de negocio.  Por favor, contácteme para programar una reunión donde podamos discutir sus necesidades con mayor detalle."'
        return JsonResponse({"proposal": response}, status=200)
    
class JWTMakeProblemAnalysisAuth(APIView, MakeProblemAnalysis):
    authentication_classes = []
    permission_classes = ()





def build_response(success=True, message=None, error=None, data=None, status_code=status.HTTP_200_OK):
    return Response({
        "success": success,
        "message": message,
        "error": error,
        "data": data
    }, status=status_code)


class PerformanceEvaluationTemplateCreate(ListCreateAPIView):
    queryset = OnlineMeetingTasks.objects.all()
    serializer_class = OutlookTasksSerializer
    authentication_classes = []
    permission_classes = []
    
    def post(self, request, *args, **kwargs):
        return build_response(False, error="The employee wasn't sent, it is required!", status_code=status.HTTP_400_BAD_REQUEST)


def schedule_meeting():
    client = MicrosoftClient()
    client.schedule_event(
        subject="Team Sync Meeting",
        start_time="2025-06-23T14:00:00",
        end_time="2025-06-23T15:00:00",
        attendees=["JuanParraGomez@Socio675.onmicrosoft.com"],
        body="Let’s sync on project progress.",
        location="Conference Room B"
    )
    return True

def create_draft_email():
    client = MicrosoftClient()
    client.create_draft_email(
        subject="Seguimiento proyecto",
        body="<p>Hola equipo,<br>Adjunto resumen de avances.<br>Saludos.</p>",
        to_recipients=["JuanParraGomez@Socio675.onmicrosoft.com"]
    )

def create_scheduled_email():
    client = MicrosoftClient()
    client.send_email_now(
        subject="Reminder: revisar base de datos",
        body="<p>Recuerda revisar lo pendiente para la entrega de mañana.</p>",
        to_recipients=["it@socio.it.com"]
    )

class PerformanceEvaluationTemplateDetail(RetrieveUpdateDestroyAPIView):
    queryset = OnlineMeetingTasks.objects.all()
    serializer_class = OutlookTasksSerializer
    authentication_classes = []
    permission_classes = []

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.task_description = request.data.get('task_description', instance.task_description)
            instance.status = request.data.get('status', instance.status)
            instance.save()
            serializer = self.get_serializer(instance)
            #create_draft_email()
            #schedule_meeting()
            #create_scheduled_email()
            return build_response(data=serializer.data,message='The task was updated successfully', error=None, status_code=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return build_response(False, error="The employee was not found!", status_code=status.HTTP_404_NOT_FOUND)


class ExecuteTaskViews(APIView):
    queryset = OnlineMeetingTasks.objects.all()
    serializer_class = OutlookTasksSerializer
    authentication_classes = []
    permission_classes = []

    def get(self, request, pk, *args, **kwargs):
        try:
            instance = get_object_or_404(self.queryset, pk=pk)
            serializer = self.serializer_class(instance)
            agents_url = f"{settings.AGENTS_API_URL}v2/v2/task_clasifier"
            params = {
                "message": instance.task_description,
                "context": instance.meeting.summary
            }

            headers = {
                "accept": "application/json"
            }
            
            response = requests.post(agents_url, params=params, headers=headers, timeout=10)
            json_response = response.json()
            task = json_response.get('task_payload', None)

            if task:
                if task.get('action') == 'create_email_draft':
                    client = MicrosoftClient()
                    client.create_draft_email(
                        subject=task.get('subject', 'No Subject'),
                        body=task.get('message', ''),
                        to_recipients=[]
                    )
                elif task.get('action') == 'schedule_meeting':
                    client = MicrosoftClient()
                    client.schedule_event(
                        subject=task.get('meeting_subject', 'No Subject'),
                        start_time=task.get('meeting_start'),
                        end_time=task.get('meeting_end'),
                        attendees=[],
                        body=task.get('meeting_body', ''),
                        location='remote'
                    )
                elif task.get('action') == 'simple_task':
                    print(task)
                    task = OnlineReminderTasks.objects.create(
                        task_reminder=instance,
                        notification_date=task.get('reminder_time', ''),
                        status='Pending',
                        email='it@socio.it.com'
                    )
                    
                else:
                    return build_response(
                        data=False,
                        error="Unknown task type.",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )

            return build_response(
                data=serializer.data,
                message="The tasks was executed successfully!.",
                error=None,
                status_code=status.HTTP_200_OK
            )

        except ObjectDoesNotExist:
            return build_response(
                data=False,
                error="Task wasn't found.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except requests.RequestException as e:
            return build_response(
                data=False,
                error=f"Error while the task was executed!: {str(e)}",
                status_code=status.HTTP_502_BAD_GATEWAY
            )

