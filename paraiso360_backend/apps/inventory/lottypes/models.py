# lottypes/models.py
from django.db import models

class LotType(models.Model):
    """
    Defines the different categories of lots available in the park,
    along with their pricing and capacity rules.
    """
    type_name = models.CharField(
        max_length=50,
        unique=True,
        help_text="The unique name of the lot type (e.g., Gold, Platinum)."
    )
    base_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="The base purchase price for a lot of this type."
    )
    max_fresh_body_capacity = models.IntegerField(
        help_text="Maximum number of fresh body remains allowed."
    )
    max_skeletal_remains_capacity = models.IntegerField(
        help_text="Maximum number of skeletal remains allowed."
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text="A detailed description of the lot type."
    )

    class Meta:
        # Correctly defines the table name without schema.
        # Assumes the 'inventory' schema is in PostgreSQL's search_path.
        db_table = 'lot_type'
        verbose_name = "Lot Type"
        verbose_name_plural = "Lot Types"

    def __str__(self):
        return self.type_name