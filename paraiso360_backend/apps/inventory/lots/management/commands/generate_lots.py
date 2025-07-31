# paraiso360_backend/apps/inventory/lots/management/commands/generate_lots.py

from django.core.management.base import BaseCommand
from shapely.geometry import shape, box
from django.contrib.gis.geos import GEOSGeometry
from shapely.wkt import loads as load_wkt
from apps.inventory.lots.models import Lot
from apps.inventory.blocks.models import Block
from apps.inventory.lottypes.models import LotType

# Fixed lot size in meters
LOT_WIDTH = 1.0
LOT_HEIGHT = 2.5


class Command(BaseCommand):
    help = 'Generate lots inside a block using grid packing'

    def add_arguments(self, parser):
        parser.add_argument('block_id', type=str,
                            help='Block ID to generate lots for')

    def handle(self, *args, **kwargs):
        block_id = kwargs['block_id']

        # fetch block and default lot type
        try:
            block = Block.objects.get(block_id=block_id)
        except Block.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f'Block with ID {block_id} does not exist.'))
            return

        default_lot_type = LotType.objects.first()
        if not default_lot_type:
            self.stdout.write(self.style.ERROR(
                'No LotType found. Please create one first.'))
            return

        # convert block polygon to EPSG:3857 for meter units
        poly_4326 = block.location[0]
        poly_3857 = poly_4326.transform(3857, clone=True)
        shapely_poly = load_wkt(poly_3857.wkt)

        minx, miny, maxx, maxy = shapely_poly.bounds
        total_width = maxx - minx
        total_height = maxy - miny
        count = block.lot_count

        # pick grid dimensions that best match block aspect ratio
        # cols ~= sqrt(count * (width/height))
        import math
        estimated_slots = int(count * 1.5)  # try 50% more grid cells
        cols = math.ceil(math.sqrt(estimated_slots *
                         total_width / total_height))
        rows = math.ceil(estimated_slots / cols)

        # compute spacing so that lots sit away from border
        h_space = (total_width - cols * LOT_WIDTH) / (cols + 1)
        v_space = (total_height - rows * LOT_HEIGHT) / (rows + 1)

        # if spacing is negative, fall back to small fixed gap
        if h_space < 0:
            h_space = 0.2
        if v_space < 0:
            v_space = 0.3

        lot_number = 1

        # loop through rows and columns
        for r in range(rows):
            y = miny + v_space + r * (LOT_HEIGHT + v_space)
            for c in range(cols):
                if lot_number > count:
                    break

                x = minx + h_space + c * (LOT_WIDTH + h_space)
                lot_box = box(x, y, x + LOT_WIDTH, y + LOT_HEIGHT)

                # only create if fully inside the block
                if shapely_poly.contains(lot_box):
                    # transform back to WGS84
                    lot_geom = GEOSGeometry(lot_box.wkt, srid=3857)
                    lot_geom.transform(4326)

                    Lot.objects.create(
                        lot_number=f"{block.block_id}-{lot_number:03d}",
                        block=block,
                        section="A",
                        status="Available",
                        location=lot_geom,
                        lot_type=default_lot_type
                    )
                    lot_number += 1

            if lot_number > count:
                break

        created = lot_number - 1
        self.stdout.write(self.style.SUCCESS(
            f"Successfully generated {created} lots for block {block.block_id}."))
