from django.contrib import admin
from .models import Bookmark, Collection, CollectionVideo

admin.site.register(Bookmark)
admin.site.register(Collection)
admin.site.register(CollectionVideo)