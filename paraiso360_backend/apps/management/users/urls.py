# paraiso360_backend/apps/management/users/urls.py
from django.urls import path
from .views import HelloEveryoneView, HelloStaffView, HelloAdminView
from .views import AppUserCreateView, AppUserDetailView, CurrentUserRetrieveUpdateView


urlpatterns = [
    path('hello/', HelloEveryoneView.as_view()),
    path('hello/staff/', HelloStaffView.as_view()),
    path('hello/admin/', HelloAdminView.as_view()),

    # 👇 This line adds the endpoint for creating users
    path('create-user/', AppUserCreateView.as_view(), name='user-create'),
    path('<int:pk>/', AppUserDetailView.as_view()),  # 👈 this line handles GET /users/<id>/

    # 👇 This line adds the endpoint for retrieving/updating the current user
    path('me/', CurrentUserRetrieveUpdateView.as_view(), name='user-me'),

]
