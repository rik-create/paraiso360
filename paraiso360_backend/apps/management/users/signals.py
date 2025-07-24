from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.urls import reverse

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    reset_url = "{}?token={}".format(
        instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
        reset_password_token.key
    )

    send_mail(
        subject="Password Reset for Paraiso360",
        message=f"Click the link to reset your password: {reset_url}",
        from_email="no-reply@paraiso360.com",
        recipient_list=[reset_password_token.user.email],
    )
