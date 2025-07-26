from rest_framework import viewsets
from .models import Client
from .serializers import ClientSerializer
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.inventory.lots.models import Lot
from apps.inventory.payments.models import Payment
from apps.inventory.lots.serializers import LotSerializer
from apps.inventory.payments.serializers import PaymentSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['full_name', 'contact_number', 'lots__lot_number']

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None, **kwargs):
        client = self.get_object()
        lots = Lot.objects.filter(client=client)
        payments = Payment.objects.filter(client=client)

        lots_data = LotSerializer(lots, many=True, context={
                                  'request': request}).data
        payments_data = PaymentSerializer(
            payments, many=True, context={'request': request}).data

        return Response({
            'client_id': client.id,
            'full_name': client.full_name,
            'lots': lots_data,
            'payments': payments_data
        })
