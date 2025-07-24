from django.urls import path
from .views import PaymentListView

urlpatterns = [
    path('', PaymentListView.as_view(), name='payments'),
]