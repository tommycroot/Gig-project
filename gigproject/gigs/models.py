from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Gig(models.Model):
    date = models.DateField()
    band = models.CharField(max_length=1000)
    image = models.URLField(validators=[URLValidator()], default='https://png.pngtree.com/png-clipart/20190517/original/pngtree-cartoon-kids-band-singing-elements-element-png-image_4074731.jpg')
    venue = models.CharField(max_length=500)
    setlist = models.CharField(max_length=1000, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.band} - {self.venue} - {self.date}'