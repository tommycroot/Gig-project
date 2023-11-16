from .common import ReviewSerializer
from users.serializers.common import UserInfo, UserSerializer, Username

class PopulatedReviewSerializer(ReviewSerializer):
  owner = Username()