from django.urls import path

from .views import google_logout, authenticate_user_login, register_user, google_login
urlpatterns = [
    path('register', register_user, name='register-user'),
    path('google/signin', google_login, name='google-login'),
    path('logout', google_logout, name='google-logout'),
    path('login', authenticate_user_login, name="user-login"),
]