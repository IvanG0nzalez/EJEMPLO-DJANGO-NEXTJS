from django.urls import path
from rest_framework.documentation import include_docs_urls
from movies.views import *

urlpatterns = [
    path('api/v1/movies/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('api/v1/movies/<uuid:external_id>/', MovieRetrieveUpdateView.as_view(), name='movie-retrieve-update'),
    path('api/v1/directors/', DirectorListCreateView.as_view(), name='director-list-create'),
    path('api/v1/directors/<uuid:external_id>/', DirectorRetrieveUpdateView.as_view(), name='director-retrieve-update'),
    path('api/v1/genres/', GenreListCreateView.as_view(), name='genre-list-create'),
    path('api/v1/genres/<uuid:external_id>/', GenreRetrieveUpdateView.as_view(), name='genre-retrieve-update'),
    path('docs/', include_docs_urls(title="Movies API"))
]
