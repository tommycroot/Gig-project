import jwt
from django.conf import settings
import time
from datetime import datetime, timedelta
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers.common import UserSerializer


from lib.exceptions import exceptions

from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterView(APIView):

    # REGISTER ROUTE
    # Endpoint: POST /api/auth/register/
    @exceptions
    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        user_to_add.is_valid(raise_exception=True)
        user_to_add.save()
        return Response(user_to_add.data, status.HTTP_201_CREATED)
    

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user_to_login = User.objects.get(email=email)
        
        if not user_to_login.check_password(password):
            print('PASSWORDS DONT MATCH')
            raise PermissionDenied('Unauthorized')
    
        dt = datetime.now() + timedelta(days=7)
        timestamp = int(time.mktime(dt.timetuple()))

        token = jwt.encode({'sub': user_to_login.id, 'exp': timestamp }, settings.SECRET_KEY, algorithm='HS256')
        print('TOKEN ->', token)
        
        return Response({ 'message': f"Welcome back, {user_to_login.username}", 'token': token })






