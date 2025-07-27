from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Burial
from .serializers import BurialSerializer
from ..lots.models import LotOccupancyHistory


class BurialViewSet(viewsets.ModelViewSet):
    queryset = Burial.objects.all()
    serializer_class = BurialSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        lot = instance.lot
        remains_type = instance.remains_type

        # Step 1: Decrease occupancy
        if remains_type == 'Fresh':
            lot.fresh_body_count = max(0, lot.fresh_body_count - 1)
        elif remains_type == 'Skeletal':
            lot.skeletal_remains_count = max(0, lot.skeletal_remains_count - 1)

        # Step 2: Re-evaluate status
        fresh_full = lot.fresh_body_count >= lot.lot_type.max_fresh_body_capacity
        skeletal_full = lot.skeletal_remains_count >= lot.lot_type.max_skeletal_remains_capacity
        if not (fresh_full and skeletal_full) and lot.status == 'Full':
            lot.status = 'Available'  # or restore previous status if you track it

        lot.save()

        # Step 3: Log the history
        LotOccupancyHistory.objects.create(
            lot=lot,
            burial=instance,
            remains_type=remains_type,
            change=-1
        )

        # Step 4: Delete the burial
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
