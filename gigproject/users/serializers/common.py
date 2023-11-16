from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation, hashers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    # default validation is run
    # custom validate method is executed second
    def validate(self, data):
        print('DATA BEFORE CUSTOM VALIDATION ->', data)
        # 1. remove password from data, and save a to a variable, later this will be hashed and added back to data
        password = data.pop('password')
        # 2. remove password_confirmation from data, we'll use this to validate against password but we won't add it back on
        password_confirmation = data.pop('password_confirmation')
        # 3. Validate password against password_confirmation, if they don't match, invalidate the request, otherwise move on
        if password != password_confirmation:
            raise serializers.ValidationError({ 'password_confirmation': 'Does not match password'})
        # 4. OPTIONAL: Password strength validation
        password_validation.validate_password(password)
        # 5. Hash the plain text password, adding it back onto the data dictionary to be run through default validation
        data['password'] = hashers.make_password(password)
        print('DATA AFTER CUSTOM VALIDATION ->', data)
        return data

    # Meta with selected fields
    class Meta:
        model = User
        fields = '__all__'

class UserGigs(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('gigs',)

class UserUpcoming(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('upcoming',)

class UserFollowing(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('following',)

class UserInfo(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'profile_image', 'gigs', 'upcoming', 'id',)

class Username(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'id')