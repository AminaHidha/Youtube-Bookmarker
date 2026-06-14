import uuid
from django.db import models
from django.contrib.auth.models import User


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    video_id = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    thumbnail = models.URLField()
    channel_title = models.CharField(max_length=255)
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'video_id')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.user.username})"


class Collection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    name = models.CharField(max_length=255)
    share_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class CollectionVideo(models.Model):
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='videos')
    video_id = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    thumbnail = models.URLField()
    channel_title = models.CharField(max_length=255)
    published_at = models.DateTimeField()
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('collection', 'video_id')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.title} in {self.collection.name}"