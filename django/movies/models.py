import uuid
from django.db import models
from django.core.exceptions import ValidationError

class Genre(models.Model):
    name = models.CharField(max_length=50)
    state = models.BooleanField(default=True)
    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.name

class Director(models.Model):
    names = models.CharField(max_length=50)
    last_names = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=100, blank=True, null=True)
    state = models.BooleanField(default=True)
    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"{self.names} {self.last_names}"

class Movie(models.Model):
    title = models.CharField(max_length=200)
    directors = models.ManyToManyField(Director)
    genres = models.ManyToManyField(Genre)
    release_date = models.DateField()
    duration = models.IntegerField()
    rating = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    state = models.BooleanField(default=True)
    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.title

    def clean(self):
        if self.duration <= 0:
            raise ValidationError('Duration must be positive integer')
        
        if self.rating is not None and (self.rating < 0 or self.rating > 100):
            raise ValidationError('Rating must be between 0 and 100')
        