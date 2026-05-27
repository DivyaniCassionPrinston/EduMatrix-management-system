from django.contrib import admin
from django.urls import path, re_path
from StudentApp import views

urlpatterns = [
    path('admin/', admin.site.urls),

    re_path(r'^students/?$', views.studentApi),
    re_path(r'^student/(?P<id>[0-9]+)/?$', views.studentApi),
]