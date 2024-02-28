from django.urls import path
from .views import GooglePlacesProxy, RegisterView, LoginView, ProfileView, AddGigToGigsView, AddGigToUpcomingView, RemoveGigFromGigs, RemoveGigFromUpcoming, FollowUser, UnfollowUser, AllProfiles

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('<int:id>/', ProfileView.as_view()),
    path('<int:id1>/gigs/<int:id2>/', AddGigToGigsView.as_view()),
    path('<int:id1>/upcoming/<int:id2>/', AddGigToUpcomingView.as_view()),
    path('<int:id1>/delete-gigs/<int:id2>/', RemoveGigFromGigs.as_view()),
    path('<int:id1>/delete-upcoming/<int:id2>/', RemoveGigFromUpcoming.as_view()),
    path('<int:id1>/follow/<int:id2>/', FollowUser.as_view()),
    path('<int:id1>/unfollow/<int:id2>/', UnfollowUser.as_view()),
    path('', AllProfiles.as_view()),
    path('google-places-proxy/', GooglePlacesProxy.as_view(), name='google-places-proxy')
]