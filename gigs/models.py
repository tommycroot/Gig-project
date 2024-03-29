from django.db import models
from django.core.validators import URLValidator

# Create your models here.
class Gig(models.Model):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='gig')
    date = models.DateField()
    band = models.CharField(max_length=1000)
    venue = models.CharField(max_length=500)
    image = models.URLField(validators=[URLValidator()], max_length=1000, default='https://w7.pngwing.com/pngs/104/393/png-transparent-musical-ensemble-musician-rock-band-angle-animals-logo-thumbnail.png')
    
    setlist = models.CharField(max_length=800, default='', blank=True)
    notes = models.CharField(max_length=300, default='', blank=True)
    support = models.CharField(max_length=300, default='', blank=True) 
    currency = models.CharField(max_length=50, default='$', blank=True)
    price = models.DecimalField(max_digits=10, default='0', decimal_places=2, blank=True)
    
    

    def __str__(self):
        return f'{self.band} - {self.venue} - {self.date}'