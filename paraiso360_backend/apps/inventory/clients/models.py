# clients/models.py
from django.db import models

class Client(models.Model):
    """
    Represents a client or lot owner in the system.
    """
    full_name = models.CharField(
        max_length=255,
        help_text="The client's full name."
    )
    contact_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
        help_text="The client's primary contact number."
    )
    email_address = models.EmailField(
        max_length=255,
        unique=True,
        blank=True,
        null=True,
        help_text="The client's email address."
    )
    mailing_address = models.TextField(
        blank=True,
        null=True,
        help_text="The client's physical mailing address."
    )

    class Meta:
        db_table = 'client'
        verbose_name = "Client"
        verbose_name_plural = "Clients"

    def __str__(self):
        return self.full_name