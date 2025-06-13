import requests
from msal import ConfidentialClientApplication

class MicrosoftClient:
    
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

    def get_contacts(access_token):
        headers = {
            "Authorization": f"Bearer {access_token}",
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

    def create_contact(self, access_token: str, data: dict) -> dict | None:
        headers = {
            "Authorization": f"Bearer {access_token}",
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