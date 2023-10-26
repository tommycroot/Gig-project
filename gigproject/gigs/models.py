from django.db import models

# Create your models here.
class Gig(models.Model):
  date = models.DateField()
  band = models.CharField()
  venue = models.CharField()
  price = models.DecimalField(max_digits=10, decimal_places=2)

  def __str__(self):
    return f'{self.band} - {self.venue} - {self.date}'