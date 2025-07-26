from rest_framework import viewsets
from .models import Client
from .serializers import ClientSerializer
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['full_name', 'contact_number', 'lots__lot_number']
