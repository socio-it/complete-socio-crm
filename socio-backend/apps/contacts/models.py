from django.db import models
from django.core.validators import RegexValidator
from django.db.models.functions import Lower


class Contact(models.Model):
    """Lightweight address-book entry for scraped or ad-hoc contacts."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    linkedin_url = models.URLField("LinkedIn URL", blank=True)
    name = models.CharField("Full name", max_length=255, blank=True)
    email = models.EmailField("Email address", max_length=255, blank=True, unique=True)

    phone_regex = RegexValidator(
        regex=r"^\+?\d{7,15}$",
        message="Enter a valid international phone number (7-15 digits, optional leading '+').",
    )
    phone_number = models.CharField(
        "Phone number", max_length=16, blank=True, validators=[phone_regex]
    )

    extra_data = models.JSONField("Additional information", blank=True, default=dict)

    class Meta:
        verbose_name = "contact"
        verbose_name_plural = "contacts"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                Lower("email"), name="unique_contact_email_ci"
            ),
        ]

    def __str__(self) -> str: 
        return self.name or self.email or f"Contacto #{self.pk}"

    def create_contact(data: dict) -> "Contact":
        """
        Create a new contact based on provided data.
        """
        print(data['name'])
        contact, created = Contact.objects.get_or_create(
            email=data.get("email", "").lower(),
            defaults={
                "name": data.get("name", ""),
                "linkedin_url": data.get("linkedin_url", ""),
                "phone_number": data.get("phone_number", ""),
                "extra_data": data.get("extra_data", {}),
            },
        )
        return contact

    def update_contact(data: dict) -> "Contact":
        """
        Update new contact based on provided data.
        """

        contact = Contact.objects.get(email=data.get("email", "").lower())
        contact.extra_data = data.get("extra_data", contact.extra_data)
        contact.save()

        return contact