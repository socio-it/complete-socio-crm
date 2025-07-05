import requests
import datetime
import urllib.parse
from msal import ConfidentialClientApplication
from datetime import datetime, timedelta, timezone

tentant_id = "23d269ba-73b5-4a22-9cb5-66178f7dde6b"
client_id = "e05af3ec-4d85-4471-b639-059af3044b5d"
secret_id = "5Cy8Q~8IQOlgcNqpE66ARza_toi4uu_HmeN.mcfk"
    
def get_microsoft_access_token(client_id: str, client_secret: str, tenant_id: str) -> str:
    url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
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
            client_id="e05af3ec-4d85-4471-b639-059af3044b5d",
            authority="https://login.microsoftonline.com/23d269ba-73b5-4a22-9cb5-66178f7dde6b",
            client_credential="5Cy8Q~8IQOlgcNqpE66ARza_toi4uu_HmeN.mcfk"
        )
        
        token_response = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
        return token_response.get("access_token")
    

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
        
    
    def get_messages_between(self,user_id: str,start_utc: datetime,end_utc: datetime,top: int = 50,select: str = "subject,from,receivedDateTime") -> list[dict]:
        endpoint = (
            f"{self.base_url}/users/{user_id}/mailFolders/inbox/messages"
        )

        filtro = (
            f"receivedDateTime ge {start_utc.strftime('%Y-%m-%dT%H:%M:%SZ')}"
            f" and receivedDateTime lt {end_utc.strftime('%Y-%m-%dT%H:%M:%SZ')}"
        )

        params = {
            "$filter": filtro,
            "$select": "subject,from,receivedDateTime,body,bodyPreview",
            "$orderby": "receivedDateTime desc",
            "$top": top
        }

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Prefer": 'outlook.body-content-type="text"'
        }

        all_messages = []
        url = endpoint
        while url:
            res = requests.get(url, headers=headers, params=params)
            res.raise_for_status()
            data = res.json()
            all_messages.extend(data.get("value", []))
            url = data.get("@odata.nextLink")
            params = None
        return all_messages


    def sync_unique_senders(
            self,
            user_id: str,
            top: int = 50
    ) -> tuple[set[str], str]:

        endpoint = (
            f"{self.base_url}/users/{user_id}/mailFolders/inbox/messages"
        )

        params = {
            "$select": "subject,from,receivedDateTime,body,bodyPreview",
            "$orderby": "receivedDateTime desc",
            "$top": top
        }

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Prefer": 'outlook.body-content-type="text"'
        }

        all_messages = []
        url = endpoint
        while url:
            res = requests.get(url, headers=headers, params=params)
            res.raise_for_status()
            data = res.json()
            all_messages.extend(data.get("value", []))
            url = data.get("@odata.nextLink")
            params = None
        return all_messages


#cheazil beani


"""
POLITICA QUE EXCLUIRA A LOS DEMAS USUARIOS
# Crea un grupo (o usa uno existente) con los buzones permitidos
New-DistributionGroup -Name "App-Mail-Allowed"

# Limita la app a ese grupo
New-ApplicationAccessPolicy `
    -AppId <appObjectId> `
    -PolicyScopeGroupId "App-Mail-Allowed@contoso.com" `
    -AccessRight RestrictAccess `
    -Description "App sólo lee buzones del grupo"

# Comprueba
Test-ApplicationAccessPolicy -Identity usuario@contoso.com -AppId <appObjectId>
"""