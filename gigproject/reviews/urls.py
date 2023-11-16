from django.urls import path
from .views import ReviewListView, DetailReviewListView

urlpatterns = [
  path('', ReviewListView.as_view()),
  path('<int:id>/', DetailReviewListView.as_view())
]