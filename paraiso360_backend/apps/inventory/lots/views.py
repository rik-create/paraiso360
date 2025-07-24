from rest_framework.generics import ListAPIView
from .models import Lot
from .serializers import LotSerializer

class LotListView(ListAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer

