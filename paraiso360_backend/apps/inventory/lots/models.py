# lots/models.py

# To use GIS fields like PointField, you must import from django.contrib.gis
from django.contrib.gis.db import models

class Lot(models.Model):
    """
    Represents an individual lot within the memorial park, now with
    GIS capabilities.
    """
    class Status(models.TextChoices):
        AVAILABLE = 'Available', 'Available'
        RESERVED = 'Reserved', 'Reserved'
        SOLD = 'Sold', 'Sold'

    lot_number = models.CharField(max_length=20)
    block = models.CharField(max_length=20)
    section = models.CharField(max_length=20)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE,
        help_text="The current availability status of the lot."
    )


    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # --- NEW GIS FIELD ---
    # This PointField replaces the old latitude and longitude fields.
    # It directly maps to a PostGIS geometry(Point, 4326) column.
    location = models.PointField(
        srid=4326,
        null=True,
        blank=True,
        help_text="The geographic location (Point) of the lot."
    )

    # --- Foreign Keys ---
    lot_type = models.ForeignKey(
        'lottypes.LotType',
        on_delete=models.RESTRICT,
        related_name='lots',
        help_text="The type of this lot."
    )
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lots',
        help_text="The client who owns this lot. Can be empty if available."
    )

    class Meta:
        db_table = 'lot'
        verbose_name = "Lot"
        verbose_name_plural = "Lots"
        unique_together = ('block', 'section', 'lot_number')

    def __str__(self):
        return f"Block {self.block}, Section {self.section}, Lot {self.lot_number}"