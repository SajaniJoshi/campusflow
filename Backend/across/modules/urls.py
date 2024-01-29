from django.urls import path
from .views import get_similar_module_against_given_module_uri, list_similar_modules, get_modules_from_course_and_university, get_all_modules

urlpatterns = [ 
    path('', get_modules_from_course_and_university, name='get-modules'),
    path('listSimilarModules', list_similar_modules, name='list-similar-modules'),
    path('similarModules', get_similar_module_against_given_module_uri, name='get-similar-modules'),
    path('getAllModules', get_all_modules, name='get-all-modules'),
]