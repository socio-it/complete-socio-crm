import requests
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
            client_id="7bd1de24-1092-4dda-9d3e-fdac2f98456c",
            authority="https://login.microsoftonline.com/23d269ba-73b5-4a22-9cb5-66178f7dde6b",
            client_credential="ABp8Q~whxwuKma6DhcacwXPLXIi6XmdYBwXUab6D"
        )
        
        token_response = app.acquire_token_for_client(scopes=["https://org0ad31ef7.crm2.dynamics.com/.default"])
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
            print(f"User info fetched successfully: {response.json()}")
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