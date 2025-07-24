# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class AppUser(models.Model):
    """
    Stores login credentials and roles for system operators.
    This is a custom user model mapping to the 'management.app_user' table.
    """
    username = models.CharField(
        max_length=100,
        unique=True,
        help_text="The unique username for logging in."
    )
    password_hash = models.CharField(
        max_length=255,
        help_text="Stores the hashed password for the user."
    )
    full_name = models.CharField(
        max_length=255,
        help_text="The user's full name."
    )

    # Foreign Key using string notation to prevent circular imports
    role = models.ForeignKey(
        'roles.Role',
        on_delete=models.RESTRICT,
        related_name='users',
        help_text="The role assigned to this user."
    )

    class Meta:
        db_table = 'app_user'
        verbose_name = "Application User"
        verbose_name_plural = "Application Users"

    def __str__(self):
        return self.username