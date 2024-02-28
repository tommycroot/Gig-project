from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers.common import ReviewSerializer
from .models import Review

from lib.exceptions import exceptions

class ReviewListView(APIView):
  @exceptions
  def get(self, request):
    print('GET /api/gigs/ endpoint hit')
    reviews = Review.objects.all()
    serialized_reviews = ReviewSerializer(reviews, many=True)
    return Response(serialized_reviews.data)
  
  @exceptions
  def post(self, request):
    print('POST REVIEW', request.data)

    review_to_create = ReviewSerializer(data=request.data)

    review_to_create.is_valid(raise_exception=True)
    review_to_create.save()
    print('CONTENT', review_to_create)
    return Response(review_to_create.data, status.HTTP_201_CREATED)

class DetailReviewListView(APIView):
  @exceptions
  def delete(self, request, id):
    print('DETAIL ROUTE HIT')

    review = Review.objects.get(id=id)
    review.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)
  
  @exceptions
  def get(self, request, id):
    print('GET SINGLE GIG WORKING')
    review = Review.objects.get(id=id)
    serialized_review = ReviewSerializer(review)
    return Response(serialized_review.data)

  @exceptions
  def put(self, request, id):
      review = Review.objects.get(id=id)
      serialized_review = ReviewSerializer(review, request.data, partial=True)
      serialized_review.is_valid(raise_exception=True)
      serialized_review.save()
      return Response(serialized_review.data)
