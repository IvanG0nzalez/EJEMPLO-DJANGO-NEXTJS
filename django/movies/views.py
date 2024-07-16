from django.http import Http404
from rest_framework import generics
from movies.serializer import MovieSerializer, DirectorSerializer, GenreSerializer
from movies.models import Movie, Director, Genre

class ActiveObjectMixin:
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(state=True)
    
    def get_object(self):
        queryset = self.get_queryset()
        external_id = self.kwargs.get('external_id')
        obj = queryset.filter(external_id=external_id).first()
        if obj is None:
            raise Http404
        return obj


class GenreRetrieveUpdateView(ActiveObjectMixin, generics.RetrieveUpdateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    

class GenreListCreateView(ActiveObjectMixin, generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class DirectorRetrieveUpdateView(ActiveObjectMixin, generics.RetrieveUpdateAPIView):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    

class DirectorListCreateView(ActiveObjectMixin, generics.ListCreateAPIView):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer


class MovieRetrieveUpdateView(ActiveObjectMixin, generics.RetrieveUpdateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    
class MovieListCreateView(ActiveObjectMixin, generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
