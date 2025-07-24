from django.urls import path
from .views import LotTypeListView

urlpatterns = [
    path('', LotTypeListView.as_view(), name='lot-types'),
]