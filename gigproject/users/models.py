from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

class User(AbstractUser):
  email = models.CharField(max_length=300)
  profile_image = models.URLField(validators=[URLValidator()], default='https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg')
  gigs = models.ManyToManyField('gigs.Gig', related_name='all_gigs', blank=True)
  upcoming = models.ManyToManyField('gigs.Gig', related_name='upcoming_gigs', blank=True)
  following = models.ManyToManyField('users.User', related_name='follow_id', blank=True)