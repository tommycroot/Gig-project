from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Review(models.Model):
  gig = models.ForeignKey(
    'gigs.Gig',
    on_delete=models.CASCADE,
    related_name='reviews',
    default=1
  )
  
  owner = models.ForeignKey(
    'users.User',
    on_delete=models.CASCADE,
    related_name='reviews',
    default=1
  )

  review_text = models.CharField(default=0, max_length=280)
