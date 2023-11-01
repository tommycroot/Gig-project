from functools import wraps
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from django.core.exceptions import ImproperlyConfigured
from rest_framework import status
from gigs.models import Gig
from django.contrib.auth import get_user_model
User = get_user_model()

# A decorator function is a predefined function that wraps around an existing function, executing it, and will execute generic code that has been defined inside of the wrapper function itself

# The top level function can be called anything
# The top level function of our decorator takes 1 argument, which is a function
# This function argument will eventually be the function that this this decorator wraps, for example the post function in the view
def exceptions(func):
    # the below line tells python to see this function (exceptions) as a decorator function
    # It takes in the func as an argument, and when applied to another function later on, whichever function we apply it to will become the func in the argument
    @wraps(func)

    # This function is essentially our wrapper function
    # It will be executed in place of the function that the decorator has been applied to
    # Inside the wrapper function however, we will execute the original function as part of the wrapper's functionality
    def wrapper(*args, **kwargs):
        try:
            # print('WRAPPER FUNCTION EXECUTED, TRYING TO EXECUTE CONTROLLER')
            return func(*args, **kwargs)
        except (User.DoesNotExist, PermissionDenied) as e:
            print(e.__class__.__name__)
            print(e)
            return Response({ 'detail': 'Unauthorized' }, status.HTTP_403_FORBIDDEN)
        except (NotFound, Gig.DoesNotExist) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_404_NOT_FOUND)
        except (ValidationError, ImproperlyConfigured) as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e.__class__.__name__)
            print(e)
            return Response(e.__dict__ if e.__dict__ else { 'detail': str(e) }, status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper