from django.urls import path
from .views import LotListView

urlpatterns = [
    path('', LotListView.as_view(), name='lots'),
]