from django.urls import path
from rest_framework_nested import routers
from .views import (
    BookmarkViewSet,
    CollectionViewSet,
    CollectionVideoViewSet,
    SharedCollectionView,
    YouTubeSearchView,
)

router = routers.SimpleRouter()
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')
router.register(r'collections', CollectionViewSet, basename='collection')

collections_router = routers.NestedSimpleRouter(router, r'collections', lookup='collection')
collections_router.register(r'videos', CollectionVideoViewSet, basename='collection-videos')

urlpatterns = [
    path('share/<uuid:share_id>/', SharedCollectionView.as_view(), name='shared-collection'),
     path('search/', YouTubeSearchView.as_view(), name='youtube-search'),
]

urlpatterns += router.urls
urlpatterns += collections_router.urls