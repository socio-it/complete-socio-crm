from typing import List
from django.db import models
from apps.accounts.models import UsersByTenant
from django.db import transaction, IntegrityError

class PartnerRole(models.Model):
    roles = [
        ("Partner", "Partner"),
        ("Client", "Client"),
        ("Supplier", "Supplier")
    ]
    user_email = models.EmailField(null=False,unique=True)
    username = models.CharField(null=True, max_length=150)
    user_role  = models.CharField(max_length=20,choices=roles,default="Bills",verbose_name="Role",help_text="Select the Role",)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Partners Role: {self.username} - {self.user_role}"
    

    @staticmethod
    def get_partners() -> list:
        partners = PartnerRole.objects.all()
        return partners

    @staticmethod
    def create_partner_role(data: dict) -> dict | None:
        user_email = data.get("user_email")
        username   = data.get("username","did not found")
        user_role  = data.get("user_role")

        if not all([user_email, user_role]):
            return None

        try:
            with transaction.atomic():
                partner, created = PartnerRole.objects.get_or_create(
                    user_email=user_email.lower().strip(),
                    defaults={
                        "username": username.strip(),
                        "user_role": user_role.strip(),
                    },
                )
                return partner
        except IntegrityError as exc:
            return None
    
    @staticmethod
    def bring_records() -> List:
        partner_email = PartnerRole.objects.values_list("user_email", flat=True)
        if partner_email:
            return partner_email
        return []
        
    @staticmethod
    def update_partner_role(data: dict, pk: int) -> dict | None:
        user_email = data.get("user_email")
        if not user_email:
            return None

        fields_to_update = {}
        if "username" in data:
            fields_to_update["username"] = data["username"].strip()
        if "user_role" in data:
            fields_to_update["user_role"] = data["user_role"].strip()

        if not fields_to_update:
            return None

        try:
            with transaction.atomic():
                try:
                    partner = PartnerRole.objects.get(id=pk)
                except PartnerRole.DoesNotExist:
                    return None

                for field, value in fields_to_update.items():
                    setattr(partner, field, value)
                partner.save(update_fields=list(fields_to_update.keys()))
                return partner

        except IntegrityError:
            return None

    @staticmethod
    def delete_partner_role(pk: int) -> bool:
        try:
            with transaction.atomic():
                deleted, _ = PartnerRole.objects.get(id=pk).delete()
                return bool(deleted)
        except IntegrityError:
            return False