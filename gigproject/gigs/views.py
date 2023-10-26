from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers.common import GigSerializer
from .models import Gig

class GigListView(APIView):
  def get(self, request):
    print('GET /api/gigs/ endpoint hit')
    return Response('Get /api/gigs endpoint hit')
  
  def post(self, request):
    print('POST /api/gigs endpoint hit')
    return Response('POST /api/gigs/ endpoint hit')