from rest_framework.generics import ListAPIView
from .models import LotType
from .serializers import LotTypeSerializer

class LotTypeListView(ListAPIView):
    queryset = LotType.objects.all()
    serializer_class = LotTypeSerializer

