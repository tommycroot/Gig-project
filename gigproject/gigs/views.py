from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers.common import GigSerializer
from .models import Gig

class GigListView(APIView):
  #GET ALL GIGS
  #endpoint: /api/gigs/
  def get(self, request):
    print('GET /api/gigs/ endpoint hit')
    gigs = Gig.objects.all()
    serialized_gigs = GigSerializer(gigs, many=True)
    return Response(serialized_gigs.data)
  
  #POST NEW GIG
  #endpoint: /api/gigs/
  def post(self, request):
    print('POST /api/gigs endpoint hit')
    print('Request data =>', request.data)
    gig = GigSerializer(data=request.data)
    gig.is_valid(raise_exception=True)
    gig.save()
    return Response(gig.data, status.HTTP_201_CREATED)
  