from django.urls import path
from .views import ClientListView

urlpatterns = [
    path('', ClientListView.as_view(), name='clients'),
]