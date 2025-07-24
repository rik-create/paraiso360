# burials/models.py
from django.db import models

class Burial(models.Model):
    """
    Records a burial event that occurred in a specific lot.
    """
    class RemainsType(models.TextChoices):
        FRESH_BODY = 'Fresh Body', 'Fresh Body'
        SKELETAL = 'Skeletal', 'Skeletal'

    deceased_full_name = models.CharField(
        max_length=255,
        help_text="Full name of the deceased person."
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True,
        help_text="Date of birth of the deceased."
    )
    date_of_death = models.DateField(help_text="Date of death of the deceased.")
    date_of_burial = models.DateField(help_text="Date the burial took place.")

    remains_type = models.CharField(
        max_length=20,
        choices=RemainsType.choices,
        help_text="The type of remains that were interred."
    )

    lot = models.ForeignKey(
        'lots.Lot',
        on_delete=models.RESTRICT,
        related_name='burials',
        help_text="The lot where this burial took place."
    )

    class Meta:
        db_table = 'burial'
        verbose_name = "Burial"
        verbose_name_plural = "Burials"
        ordering = ['-date_of_burial']

    def __str__(self):
        return f"Burial of {self.deceased_full_name} in {self.lot}"