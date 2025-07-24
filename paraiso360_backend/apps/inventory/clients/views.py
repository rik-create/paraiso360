from rest_framework.generics import ListAPIView
from .models import Client
from .serializers import ClientSerializer

class ClientListView(ListAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

