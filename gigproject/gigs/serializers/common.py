from rest_framework.serializers import ModelSerializer
from ..models import Gig

class GigSerializer(ModelSerializer):
  class Meta:
    model = Gig
    fields = '__all__'