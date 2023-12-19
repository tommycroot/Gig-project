from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Gig(models.Model):
    date = models.DateField()
    band = models.CharField(max_length=1000)
    image = models.URLField(validators=[URLValidator()], default='https://a0.anyrgb.com/pngimg/374/226/anirudh-ravichander-phil-lesh-concert-crowd-free-music-concert-music-download-singer-sky-music-silhouette.png')
    venue = models.CharField(max_length=500)
    setlist = models.CharField(max_length=1000, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.band} - {self.venue} - {self.date}'