from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

class User(AbstractUser):
  email = models.CharField(max_length=100)
  profile_image = models.URLField(validators=[URLValidator()])
  gigs = models.ManyToManyField('gigs.Gig', related_name='all_gigs', blank=True)
  upcoming = models.ManyToManyField('gigs.Gig', related_name='upcoming_gigs', blank=True)
  following = models.ManyToManyField('users.User', related_name='follow_id', blank=True)