from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator

class User(AbstractUser):
  email = models.CharField(max_length=100)
  profile_image = models.URLField(validators=[URLValidator()])