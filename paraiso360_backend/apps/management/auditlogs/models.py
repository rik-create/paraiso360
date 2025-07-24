# auditlogs/models.py
from django.db import models

class AuditLog(models.Model):
    """
    Logs all data modifications within the system for tracking and security.
    Maps to the 'management.audit_log' table.
    """
    class ActionType(models.TextChoices):
        CREATE = 'CREATE', 'Create'
        UPDATE = 'UPDATE', 'Update'
        DELETE = 'DELETE', 'Delete'

    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="The exact time the action occurred."
    )
    action_type = models.CharField(
        max_length=20,
        choices=ActionType.choices,
        help_text="The type of action performed (Create, Update, Delete)."
    )
    entity_affected = models.CharField(
        max_length=50,
        help_text="The model or table that was affected by the action."
    )
    record_id = models.IntegerField(
        null=True,
        blank=True,
        help_text="The primary key of the record that was affected."
    )
    # JSONField is the correct mapping for PostgreSQL's JSONB type
    change_details = models.JSONField(
        null=True,
        blank=True,
        help_text="A JSON object detailing the changes (e.g., old and new values)."
    )

    # Foreign Key to the user who performed the action
    user = models.ForeignKey(
        'users.AppUser',
        on_delete=models.SET_NULL,
        null=True, # Allows keeping the log even if the user is deleted
        related_name='audit_logs',
        help_text="The user who performed the action."
    )

    class Meta:
        db_table = 'audit_log'
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action_type} on {self.entity_affected} by {self.user} at {self.timestamp}"