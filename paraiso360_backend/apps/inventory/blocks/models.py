from django.contrib.gis.db import models


class Block(models.Model):
    id = models.AutoField(primary_key=True, db_column='id')
    block_id = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    lot_count = models.IntegerField()
    location = models.MultiPolygonField(srid=4326)

    class Meta:
        db_table = 'block'
        managed = False

    def __str__(self):
        return self.name
