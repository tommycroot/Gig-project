from .common import GigSerializer
from reviews.serializers.populated import PopulatedReviewSerializer

class PopulatedGigSerializer(GigSerializer):
  reviews = PopulatedReviewSerializer(many=True)
