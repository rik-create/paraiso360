# notifications/models.py
from django.db import models

class Notification(models.Model):
    """
    Represents a system-generated alert or message for a specific user.
    Maps to the 'management.notification' table.
    """
    message = models.TextField(help_text="The content of the notification message.")
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the notification was created."
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Indicates whether the user has read the notification."
    )

    # Foreign Key to the user who should receive the notification
    user = models.ForeignKey(
        'users.AppUser',
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The user this notification is for."
    )

    # Generic-like relationship to link to other records (e.g., a specific payment)
    related_entity_type = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        help_text="The type of entity this notification relates to (e.g., 'Payment')."
    )
    related_entity_id = models.IntegerField(
        null=True,
        blank=True,
        help_text="The ID of the related entity."
    )

    class Meta:
        db_table = 'notification'
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username} at {self.created_at}"