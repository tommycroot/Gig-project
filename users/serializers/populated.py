from .common import UserSerializer
from gigs.serializers.common import GigSerializer
from reviews.serializers.common import ReviewSerializer

class PopulatedUserSerializer(UserSerializer):
    gigs = GigSerializer(many=True)
    upcoming = GigSerializer(many=True)
    following = UserSerializer(many=True)
    reviews = ReviewSerializer(many=True, default=0)
