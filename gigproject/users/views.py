import jwt
from datetime import date
from django.conf import settings
from django.contrib.auth.hashers import check_password
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers.common import UserSerializer

from .serializers.common import UserSerializer, UserGigs, UserUpcoming, UserFollowing, UserInfo
from .serializers.populated import PopulatedUserSerializer

from gigs.models import Gig
from gigs.serializers.common import GigSerializer


from lib.exceptions import exceptions

from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):

    # REGISTER ROUTE
    # Endpoint: POST /api/auth/register/
    @exceptions
    def post(self, request):
        print('REQUEST DATA =>', request.data)
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
    

class LoginView(APIView):
    @exceptions
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        
        if not user_to_login.check_password(password):
            print('PASSWORDS DONT MATCH')
            raise PermissionDenied('Unauthorized')
    
        dt = datetime.now() + timedelta(days=7)
        # timestamp = int(time.mktime(dt.timetuple()))

        exp_time = datetime.utcnow() + timedelta(days=7)  # Set expiration for 7 days from now
        exp_timestamp = int(exp_time.timestamp())
        token = jwt.encode({ 'sub': user_to_login.id, 'exp': exp_timestamp }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)
        
        return Response({ 'message': f"Welcome back, {user_to_login.username}", 'token': token })
    
class ProfileView(APIView):
    @exceptions
    def get(self, request, id):
        print('PROFILE ROUTE HIT')
        print('USER ID ->', id)
        user = User.objects.get(id=id)
        serialized_user = PopulatedUserSerializer(user)
        return Response(serialized_user.data)
    
    @exceptions
    def put(self, request, id):
        user = User.objects.get(id=id)
        serialized_user = UserInfo(user, request.data, partial=True)
        serialized_user.is_valid(raise_exception=True)
        serialized_user.save()
        return Response(serialized_user.data)
    


    @exceptions
    def delete(self, request, id):
        user = User.objects.get(id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AllProfiles(APIView):
    @exceptions
    def get(self, request):
        print('PROFILE ROUTE HIT')
        user = User.objects.all()
        serialized_user = UserInfo(user, many=True)
        return Response(serialized_user.data)
    
class AddGigToGigsView(APIView):
    def put(self, request, id1, id2):
        user = User.objects.get(id=id1)
        gig = Gig.objects.get(id=id2)
        serialized_gig = GigSerializer(gig)
        to_add = serialized_gig.data
        gig_date = datetime.strptime(to_add['date'], '%Y-%m-%d').date()

        # Check if the gig date is in the past
        if gig_date < datetime.now().date():
            serialize_user = UserGigs(user)
            to_update = serialize_user.data
            to_update['gigs'].append(to_add['id'])
            final = UserGigs(user, to_update, partial=True)
            final.is_valid(raise_exception=True)
            final.save()

            upcoming = UserUpcoming(user)
            upcoming_update = upcoming.data
            
            if to_add['id'] in upcoming_update['upcoming']:
                upcoming_update['upcoming'].remove(to_add['id'])
                final_upcoming_update = UserUpcoming(user, upcoming_update, partial=True)
                final_upcoming_update.is_valid(raise_exception=True)
                final_upcoming_update.save()

            return Response(final.data)
        else:
            return Response({'message': 'Cannot add a future gig to your gigs'})
    
class AddGigToUpcomingView(APIView):
    @exceptions
    def put(self, request, id1, id2):
        user = User.objects.get(id=id1)
        gig = Gig.objects.get(id=id2)
        
        serialized_gig = GigSerializer(gig)
        to_add = serialized_gig.data

        gig_date = datetime.strptime(to_add['date'], '%Y-%m-%d').date()

        # Check if the gig date is in the past
        if gig_date < datetime.now().date():
            return Response({'message': 'Cannot add a past gig to your upcoming'})

        serialized_user = UserUpcoming(user)
        upcoming_gigs = UserUpcoming(user)
        to_check = upcoming_gigs.data

        to_update = serialized_user.data

        # Check if gig to be added to upcoming is not already in the collection
        if not to_add['id'] in to_check['upcoming']:
            to_update['upcoming'].append(to_add['id'])

            final = UserUpcoming(user, to_update, partial=True)
            final.is_valid(raise_exception=True)
            final.save()
            return Response(final.data)
        
        else:
            return Response({'message': 'Gig already in your upcoming'})
    
class RemoveGigFromGigs(APIView):
    @exceptions
    def put(self, request, id1, id2):
        print('DELETE GIG FROM GIGS ROUTE')
        user = User.objects.get(id=id1)
        serialized_user = UserGigs(user)

        print('SERIALIZED USER ->', serialized_user.data['gigs'])

        if id2 in serialized_user.data['gigs']:
            serialized_user.data['gigs'].remove(id2)
            final = UserGigs(user, serialized_user.data, partial=True)
            final.is_valid(raise_exception=True)
            final.save()
            return Response(final.data)
        
        else:
            return Response({'message': 'This gig cannot be deleted because it is not in your gigs'})
        
class RemoveGigFromUpcoming(APIView):
    @exceptions
    def put(self, request, id1, id2):
        print('DELETE GIG FROM UPCOMING ROUTE')

        user = User.objects.get(id=id1)

        serialized_user = UserUpcoming(user)

        print('SERIALIZED USER ->', serialized_user.data['upcoming'])

        upcoming_list = serialized_user.data['upcoming']
        
        if id2 in upcoming_list:
            upcoming_list.remove(id2)  # Remove the gig ID from the list
            serialized_user.data['upcoming'] = upcoming_list  # Update the 'upcoming' field

            final = UserUpcoming(user, serialized_user.data, partial=True)
            final.is_valid(raise_exception=True)
            final.save()
            return Response(final.data)
        
        else:
            return Response({'message': 'This gig cannot be deleted because it is not in your upcoming'})
        
class FollowUser(APIView):

  @exceptions
  def put(self, request, id1, id2):
      print('FOLLOW USER ROUTE HIT')
      
      print(id2)
      
      user1 = User.objects.get(id=id1)

      serialized_user = UserFollowing(user1)

      print('USER INFO =>', serialized_user.data)

      info = serialized_user.data
      print('INFO VARIABLE', info)

      if not id2 in info['following']:
        info['following'].append(id2)
        print('UPDATED INFO', info)
        final = UserFollowing(user1, info, partial=True)
        final.is_valid(raise_exception=True)
        final.save()
        return Response(final.data)
      
      else:
          return Response({ 'message': 'You are already following this user.' }) 

class UnfollowUser(APIView):
    
    @exceptions
    def put(self, request, id1, id2):
        print('UNFOLLOW ROUTE HIT')

        user = User.objects.get(id=id1)

        serialized_user = UserFollowing(user)

        info = serialized_user.data

        print('USER FOLLOWING =>', info['following'])

        if id2 in info['following']:
            info['following'].remove(id2)
            final = UserFollowing(user, info, partial=True)
            final.is_valid(raise_exception=True)
            final.save()
            return Response(final.data)
        else:
            return Response({ 'message': 'You have to follow a user before you unfollow them.' })

