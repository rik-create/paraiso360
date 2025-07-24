

from rest_framework.generics import ListAPIView
from .models import Burial
from .serializers import BurialSerializer

class BurialListView(ListAPIView):
    queryset = Burial.objects.all()
    serializer_class = BurialSerializer

