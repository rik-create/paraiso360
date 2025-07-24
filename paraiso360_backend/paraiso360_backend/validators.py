# paraiso360_backend/paraiso360_backend/validators.py
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if len(password) < 8:
            raise ValidationError(_("This password is too short. It must contain at least 8 characters."), code='password_too_short')
        if not any(char.isdigit() for char in password):
            raise ValidationError(_("This password must contain at least one digit."), code='password_no_digit')
        if not any(char.isalpha() for char in password):
            raise ValidationError(_("This password must contain at least one letter."), code='password_no_letter')
        if not re.findall('[()[\]{}|\\`~!@#$%^&*_\-+=;:\'",<>./?]', password):
            raise ValidationError(_("This password must contain at least one symbol."), code='password_no_symbol')

    def get_help_text(self):
        return _("Your password must contain at least 8 characters, including at least one letter, one digit, and one symbol.")
