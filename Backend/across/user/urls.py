from django.urls import path
from .views import user_profile, save_completed_modules_by_user, fetch_completed_modules_by_user, select_university_after_signup, fetch_university_uri

urlpatterns = [ 
    path('profile', user_profile, name='user-profile'),
    path('saveCompletedModulesofUser', save_completed_modules_by_user, name="save-completed-modules-by-user"),
    path('fetchCompletedModulesofUser', fetch_completed_modules_by_user, name="get-completed-modules-by-user"),
    path('selectUniversity', select_university_after_signup, name="select-university"),
    path('fetchUniversityUri', fetch_university_uri, name="fetch-university-uri"),
]