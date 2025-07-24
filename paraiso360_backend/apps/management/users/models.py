from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class AppUser(AbstractUser):
    full_name = models.CharField(max_length=255)

    role = models.ForeignKey(
        'roles.Role',
        on_delete=models.RESTRICT,
        related_name='users',
        help_text="The role assigned to this user.",
        default=1

    )

    class Meta:
        db_table = 'app_user'
        verbose_name = "Application User"
        verbose_name_plural = "Application Users"
    def __str__(self):
        return self.username
    
#This connects one profile record to exactly one use
class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    bio = models.CharField(max_length=200, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

# This ensures a Profile is created whenever a user is created 
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()
