# roles/models.py
from django.db import models

class Role(models.Model):
    """
    Defines user roles within the system, such as 'Admin' or 'Staff'.
    Maps to the 'management.role' table.
    """
    role_name = models.CharField(
        max_length=50,
        unique=True,
        help_text="The unique name of the role."
    )

    class Meta:
        # Assumes the 'management' schema is in PostgreSQL's search_path.
        db_table = 'role'
        verbose_name = "Role"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.role_name