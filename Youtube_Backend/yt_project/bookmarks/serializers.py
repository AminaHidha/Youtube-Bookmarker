from rest_framework import serializers
from .models import Bookmark, Collection, CollectionVideo


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'video_id', 'title', 'thumbnail', 'channel_title', 'published_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class CollectionVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionVideo
        fields = ['id', 'video_id', 'title', 'thumbnail', 'channel_title', 'published_at', 'added_at']
        read_only_fields = ['id', 'added_at']


class CollectionSerializer(serializers.ModelSerializer):
    videos = CollectionVideoSerializer(many=True, read_only=True)
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'share_id', 'created_at', 'videos', 'video_count']
        read_only_fields = ['id', 'share_id', 'created_at', 'videos']

    def get_video_count(self, obj):
        return obj.videos.count()


class CollectionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing collections (no nested videos)."""
    video_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['id', 'name', 'share_id', 'created_at', 'video_count']

    def get_video_count(self, obj):
        return obj.videos.count()