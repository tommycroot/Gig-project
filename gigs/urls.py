from django.urls import path
from .views import GigListView, GigDetailView

urlpatterns = [
  path('', GigListView.as_view()),
  path('<int:id>/', GigDetailView.as_view())
] 