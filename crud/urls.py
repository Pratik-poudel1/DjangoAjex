from django.urls import path, include
from . import views 
from rest_framework import routers

router=routers.DefaultRouter()
router.register(r'students', views.StudentViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('insert/', views.insert, name='insert'),
    path('all/', views.all, name='all'),
    path('delete/<int:id>/', views.delete, name='delete'),
    path("get/<int:id>/", views.get_student, name="get_student"),
    path("update/<int:id>/", views.update_student, name="update_student"),
    path('api/', include(router.urls)),
]
