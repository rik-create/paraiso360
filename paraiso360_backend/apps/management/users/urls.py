# paraiso360_backend/apps/management/users/urls.py
from django.urls import path
from .views import HelloEveryoneView, HelloStaffView, HelloAdminView
from .views import AppUserCreateView, AppUserDetailView, CurrentUserRetrieveUpdateView


urlpatterns = [
    path('hello/', HelloEveryoneView.as_view()),
    path('staff/', HelloStaffView.as_view()),
    path('admin/', HelloAdminView.as_view()),

    # 👇 This line adds the endpoint for creating users
    path('create-user/', AppUserCreateView.as_view(), name='user-create'),
    # 👈 this line handles GET /users/<id>/
    path('<int:pk>/', AppUserDetailView.as_view()),

    # 👇 This line adds the endpoint for retrieving/updating the current user
    path('me/', CurrentUserRetrieveUpdateView.as_view(), name='user-me'),

]
