import requests
import datetime
import urllib.parse
from msal import ConfidentialClientApplication

tentant_id = "23d269ba-73b5-4a22-9cb5-66178f7dde6b"
client_id = "e05af3ec-4d85-4471-b639-059af3044b5d"
secret_id = "5Cy8Q~8IQOlgcNqpE66ARza_toi4uu_HmeN.mcfk"
    
def get_microsoft_access_token(client_id: str, client_secret: str, tenant_id: str) -> str:
    url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    #headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "https://graph.microsoft.com/.default"
    }
    
    response = requests.post(url, data=data)
    
    if response.status_code == 200:
        print(response.json().get("access_token"))
        return response.json().get("access_token")
    else:
        print(Exception(f"Error obtaining access token: {response.text}"))
        return None
    

class MicrosoftClient:
    def __init__(self):
        self.base_url = "https://graph.microsoft.com/v1.0"
        self.access_token = self.get_access_token()
        self.transcription_access_token = get_microsoft_access_token(client_id=client_id, client_secret=secret_id, tenant_id=tentant_id)


    def get_access_token(self):
        """
            Get an access token for Microsoft Graph API.
        """
        app = ConfidentialClientApplication(
            client_id="e05af3ec-4d85-4471-b639-059af3044b5d",
            authority="https://login.microsoftonline.com/23d269ba-73b5-4a22-9cb5-66178f7dde6b",
            client_credential="5Cy8Q~8IQOlgcNqpE66ARza_toi4uu_HmeN.mcfk"
        )
        
        token_response = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
        return token_response.get("access_token")
    

    def get_contacts(self):
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0"
        }
        
        url = "https://org0ad31ef7.crm2.dynamics.com/api/data/v9.2/crf02_crmcontactses"
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data.get("value", [])
        else:
            print("Error:", response.status_code, response.text)

    def create_contact(self, data: dict) -> dict | None:
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Prefer": "return=representation",
        }

        url = "https://org0ad31ef7.crm2.dynamics.com/api/data/v9.2/crf02_crmcontactses"
        response = requests.post(url, headers=headers, json=data)

        if response.status_code in (200, 201):
            return response.json()
        elif response.status_code == 204:
            return {"@odata.id": response.headers.get("OData-EntityId")}
        else:
            print("Error:", response.status_code, response.text)
            return None
        

    def get_user_info(self, user_id: str):
        url = f"{self.base_url}/users/{user_id}"
        headers = {
            "Authorization": f"Bearer {self.transcription_access_token}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json().get("id", None)
        else:
            print(f"Error fetching user info: {response.text}")
            return None
    
    def get_interviews(self, user_id: str):
        headers = {
            "Authorization": f"Bearer {self.transcription_access_token}",
            "Content-Type": "application/json",
        }
        url = f"{self.base_url}/users/{user_id}/calendar/events"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json().get("value", [])
        else:
            print(f"Error fetching interviews: {response.text}")
            return None
    
    def get_online_meetings(self, join_url: str, user_id: str):
        headers = {
            "Authorization": f"Bearer {self.transcription_access_token}",
            "Content-Type": "application/json"
        }
        
        url_ = f"{self.base_url}/users/c4b17935-09ab-4df1-9611-9e97677f1bac/onlineMeetings"
        filter = urllib.parse.quote(f"joinWebUrl eq '{join_url}'")
        url = f"{url_}?$filter={filter}"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json().get("value", [])
        else:
            print(f"Error fetching online meetings: {response.text}")
            return []
            
    def get_transcription(self, meeting_id: str, user_id: str):
        headers = {
            "Authorization": f"Bearer {self.transcription_access_token}",
            "Content-Type": "application/json"
        }
        url = f"{self.base_url}/users/{user_id}/onlineMeetings/{meeting_id}/transcripts"
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json().get("value", [])
        else:
            print(f"Error fetching transcription: {response.text}")
            return None
        
    def get_transcription_content(self, meeting_id: str, user_id: str, transcript_id: str):
        headers = {
            "Authorization": f"Bearer {self.transcription_access_token}",
            "Content-Type": "application/json"
        }
        url = (
            f"{self.base_url}/users/{user_id}/onlineMeetings/"
            f"{meeting_id}/transcripts/{transcript_id}/content?format=text/vtt"
        )
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.text
        else:
            print(f"Error fetching transcription: {response.text}")
            return None
        

    def schedule_event(self, subject, start_time, end_time, attendees, body="", location=""):
        """
        Schedule a calendar event via Microsoft Graph.

        :param subject: Title of the meeting
        :param start_time: ISO format start time (e.g., "2025-06-23T14:00:00")
        :param end_time: ISO format end time
        :param attendees: List of emails to invite
        :param body: Optional description
        :param location: Optional location
        :return: Response dict or error
        """
        url = f"{self.base_url}/users/c4b17935-09ab-4df1-9611-9e97677f1bac/events"  
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        event_data = {
            "subject": subject,
            "body": {
                "contentType": "HTML",
                "content": body or "Scheduled by MicrosoftClient"
            },
            "start": {
                "dateTime": start_time,
                "timeZone": "SA Pacific Standard Time"
            },
            "end": {
                "dateTime": end_time,
                "timeZone": "SA Pacific Standard Time"
            },
            "location": {
                "displayName": location or "Virtual"
            },
            "attendees": [
                {
                    "emailAddress": {
                        "address": email,
                        "name": email.split('@')[0]
                    },
                    "type": "required"
                } for email in attendees
            ],
            "allowNewTimeProposals": True,
            "isOnlineMeeting": True,
            "onlineMeetingProvider": "teamsForBusiness"
        }

        response = requests.post(url, headers=headers, json=event_data)

        if response.status_code in (200, 201):
            return response.json()
        else:
            print("Error scheduling event:", response.status_code, response.text)
            return {"error": response.json()}
        

    def create_draft_email(self, subject, body, to_recipients, cc_recipients=None, bcc_recipients=None):
        """
        Create a draft email in Outlook using Microsoft Graph API.

        :param subject: Subject of the email
        :param body: Body content of the email (HTML or plain text)
        :param to_recipients: List of email addresses to send to
        :param cc_recipients: Optional list of CC addresses
        :param bcc_recipients: Optional list of BCC addresses
        :return: The draft message object or error
        """
        url = f"{self.base_url}/users/c4b17935-09ab-4df1-9611-9e97677f1bac/messages"

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        def format_recipients(emails):
            return [{"emailAddress": {"address": email}} for email in emails]

        message_data = {
            "subject": subject,
            "body": {
                "contentType": "HTML",
                "content": body
            },
            "toRecipients": format_recipients(to_recipients),
            "ccRecipients": format_recipients(cc_recipients or []),
            "bccRecipients": format_recipients(bcc_recipients or [])
        }

        response = requests.post(url, headers=headers, json=message_data)

        if response.status_code in (200, 201):
            return response.json()
        else:
            print("Error creating draft email:", response.status_code, response.text)
            return {"error": response.json()}

    def send_email_now(self,
                   subject: str,
                   body: str,
                   to_recipients: list[str],
                   cc_recipients: list[str] | None = None,
                   bcc_recipients: list[str] | None = None) -> dict:
        """
        Send an email immediately with Microsoft Graph.

        :param subject: Subject line
        :param body: HTML or plain-text body
        :param to_recipients: List of main recipients
        :param cc_recipients: List of CC recipients (optional)
        :param bcc_recipients: List of BCC recipients (optional)
        :return: {"status": "sent"} or {"error": ...}
        """
        url = f"{self.base_url}/users/c4b17935-09ab-4df1-9611-9e97677f1bac/sendMail"

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }

        def fmt(addresses: list[str] | None):
            return [{"emailAddress": {"address": a}} for a in (addresses or [])]

        payload = {
            "message": {
                "subject": subject,
                "body": {"contentType": "HTML", "content": body},
                "toRecipients":  fmt(to_recipients),
                "ccRecipients":  fmt(cc_recipients),
                "bccRecipients": fmt(bcc_recipients)
            },
            "saveToSentItems": True          # lo verás en “Enviados”
        }

        r = requests.post(url, headers=headers, json=payload)

        if r.status_code == 202:             # 202 ≙ aceptado y en cola de envío
            return {"status": "sent"}
        else:
            print("❌ Error al enviar:", r.status_code, r.text)
            return {"error": r.json()}

"""
Agregar la politica para meetings 

New-DistributionGroup `
>>   -Name "GraphAPIAccessMailEnabled" `
>>   -DisplayName "Graph API Access Group" `
>>   -PrimarySmtpAddress "graphapiaccess@socio675.onmicrosoft.com" `
>>   -Type "Security"

Add-DistributionGroupMember `
>>   -Identity "GraphAPIAccessMailEnabled" `
>>   -Member it@socio.it.com

New-ApplicationAccessPolicy `
>>   -AppId "e05af3ec-4d85-4471-b639-059af3044b5d" `
>>   -PolicyScopeGroupId "graphapiaccess@socio675.onmicrosoft.com" `
>>   -AccessRight RestrictAccess

Get-ApplicationAccessPolicy

Get-DistributionGroupMember -Identity "GraphAPIAccessMailEnabled"
"""
