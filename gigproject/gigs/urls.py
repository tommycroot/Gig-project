from django.contrib import admin
from django.urls import path
from .views import GigListView

urlpatterns = {
  path('', GigListView.as_view()),
} 