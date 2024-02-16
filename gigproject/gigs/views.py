from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers.common import GigSerializer
from .serializers.populated import PopulatedGigSerializer
from .models import Gig
from django.http import JsonResponse

from lib.exceptions import exceptions

from rest_framework.permissions import BasePermission

class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Write permissions are only allowed to the owner of the gig.
        return obj.owner == request.user

class GigListView(APIView):
  permission_classes = (IsOwnerOrReadOnly,)
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
    gig_data = {**request.data}  # Add owner field with user's ID
    gig_serializer = GigSerializer(data=gig_data)
    gig_serializer.is_valid(raise_exception=True)
    gig_serializer.save()
    return Response(gig_serializer.data, status=status.HTTP_201_CREATED)

class GigDetailView(APIView):
  permission_classes = (IsOwnerOrReadOnly,)
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

