from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers.common import GigSerializer
from .serializers.populated import PopulatedGigSerializer
from .models import Gig

from lib.exceptions import exceptions

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
  @exceptions
  def post(self, request):
    print('POST /api/gigs endpoint hit')
    print('Request data =>', request.data)
    gig = GigSerializer(data=request.data)
    gig.is_valid(raise_exception=True)
    gig.save()
    return Response(gig.data, status.HTTP_201_CREATED)

class GigDetailView(APIView):
  #GET A SPECIFIC GIG
  #endpoint: /api/gigs/:id
  @exceptions
  def get(self, request, id):
    print('GET SINGLE GIG WORKING')
    gig = Gig.objects.get(id=id)
    serialized_gig = PopulatedGigSerializer(gig)
    return Response(serialized_gig.data)
  
  #UPDATE RECORD
  #endpoint: /api/gigs/:id
  @exceptions
  def put(self, request, id):
    gig = Gig.objects.get(id=id)
    serialized_gig = GigSerializer(gig, request.data, partial=True)
    serialized_gig.is_valid(raise_exception=True)
    serialized_gig.save()
    return Response(serialized_gig.data)
  
  #DELETE RECORD
  #endpoint: /api/gigs/:id

  @exceptions
  def delete(self, request, id):
    gig = Gig.objects.get(id=id)
    gig.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)