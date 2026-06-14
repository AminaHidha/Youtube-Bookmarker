from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
import requests
from django.conf import settings
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError




from .models import Bookmark, Collection, CollectionVideo
from .serializers import (
    BookmarkSerializer,
    CollectionSerializer,
    CollectionListSerializer,
    CollectionVideoSerializer,
)


# ---------------------------------------------------------
# Bookmarks
# ---------------------------------------------------------
class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError({'detail': 'This video is already bookmarked.'})


# ---------------------------------------------------------
# Collections
# ---------------------------------------------------------
class CollectionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return CollectionListSerializer
        return CollectionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ---------------------------------------------------------
# Videos inside a Collection
# ---------------------------------------------------------
class CollectionVideoViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionVideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CollectionVideo.objects.filter(
            collection_id=self.kwargs['collection_pk'],
            collection__user=self.request.user
        )

    def perform_create(self, serializer):
        collection = Collection.objects.get(
            pk=self.kwargs['collection_pk'],
            user=self.request.user
        )
        serializer.save(collection=collection)


# ---------------------------------------------------------
# Public Share endpoint
# ---------------------------------------------------------
class SharedCollectionView(generics.RetrieveAPIView):
    serializer_class = CollectionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'share_id'
    queryset = Collection.objects.all()


class YouTubeSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q')
        if not query:
            return Response({'detail': 'Query parameter "q" is required'}, status=status.HTTP_400_BAD_REQUEST)

        url = 'https://www.googleapis.com/youtube/v3/search'
        params = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': 12,
            'key': settings.YOUTUBE_API_KEY,
        }

        try:
            res = requests.get(url, params=params, timeout=5)
            res.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response({'detail': 'YouTube API request failed', 'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        data = res.json()
        results = []
        for item in data.get('items', []):
            snippet = item.get('snippet', {})
            results.append({
                'video_id': item.get('id', {}).get('videoId'),
                'title': snippet.get('title'),
                'thumbnail': snippet.get('thumbnails', {}).get('default', {}).get('url'),
                'channel_title': snippet.get('channelTitle'),
                'published_at': snippet.get('publishedAt'),
            })

        return Response(results)