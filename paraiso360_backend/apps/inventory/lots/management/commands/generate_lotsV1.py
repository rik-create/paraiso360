# paraiso360_backend/apps/inventory/lots/management/commands/generate_lots.py

from django.core.management.base import BaseCommand
from shapely.geometry import shape, box
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.gdal import CoordTransform, SpatialReference
from django.contrib.gis.geos import Polygon as GEOSPolygon
from django.contrib.gis.geos import Point
from shapely.wkt import loads as load_wkt

from apps.inventory.lots.models import Lot
from apps.inventory.blocks.models import Block
from apps.inventory.lottypes.models import LotType  # import your LotType

# Settings in meters
LOT_WIDTH = 2.5
LOT_HEIGHT = 1
H_SPACING = 0.2
V_SPACING = 0.4


class Command(BaseCommand):
    help = 'Generate lots inside a block using grid packing'

    def add_arguments(self, parser):
        parser.add_argument('block_id', type=str,
                            help='Block ID to generate lots for')

    def handle(self, *args, **kwargs):
        block_id = kwargs['block_id']

        try:
            block = Block.objects.get(block_id=block_id)
        except Block.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f'Block with ID {block_id} does not exist.'))
            return

        try:
            default_lot_type = LotType.objects.first()
            if not default_lot_type:
                self.stdout.write(self.style.ERROR(
                    'No LotType found. Please create one first.'))
                return
        except Exception as e:
            self.stdout.write(self.style.ERROR(str(e)))
            return

        # Transform polygon to meters for correct spacing
        polygon_geom = block.location[0]
        polygon_3857 = polygon_geom.transform(3857, clone=True)
        polygon_shape = load_wkt(polygon_3857.wkt)

        minx, miny, maxx, maxy = polygon_shape.bounds
        y = miny
        lot_number = 1

        while y + LOT_HEIGHT <= maxy:
            x = minx
            while x + LOT_WIDTH <= maxx:
                lot_box = box(x, y, x + LOT_WIDTH, y + LOT_HEIGHT)

                if polygon_shape.contains(lot_box):
                    if lot_number > block.lot_count:
                        break  # Stop once lot_count is reached

                    # Create a polygon for the lot rectangle
                    lot_polygon = GEOSGeometry(lot_box.wkt, srid=3857)
                    lot_polygon.transform(4326)

                    Lot.objects.create(
                        lot_number=f"{block.block_id}-{lot_number:03d}",
                        block=block,
                        section="A",
                        status='Available',
                        location=lot_polygon,
                        lot_type=default_lot_type
                    )
                    lot_number += 1

                x += LOT_WIDTH + H_SPACING

            # Break outer loop if lot_count reached
            if lot_number > block.lot_count:
                break

            y += LOT_HEIGHT + V_SPACING

        self.stdout.write(self.style.SUCCESS(
            f'Successfully generated {lot_number - 1} lots for block {block.block_id}.'))
