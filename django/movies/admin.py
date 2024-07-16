from django.contrib import admin

from movies.models import Movie, Director, Genre

class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'external_id')
    search_fields = ('name',)

class DirectorAdmin(admin.ModelAdmin):
    list_display = ('names', 'last_names', 'date_of_birth', 'nationality', 'state', 'external_id')
    search_fields = ('names', 'last_names')
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'duration', 'rating', 'state', 'external_id')
    search_fields = ('title',)
    list_filter = ('genres', 'directors')
    filter_horizontal = ('directors', 'genres')

admin.site.register(Genre, GenreAdmin)
admin.site.register(Director, DirectorAdmin)
admin.site.register(Movie, MovieAdmin)
