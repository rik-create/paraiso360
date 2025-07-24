from django.urls import path
from .views import BurialListView

urlpatterns = [
    path('', BurialListView.as_view(), name='burials'),
]