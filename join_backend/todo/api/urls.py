# kanban/urls.py
from django.urls import path
from .views import TodoList, TodoDetail, ContactList, ContactDetail, SubtaskList, SubtaskDetail

urlpatterns = [
    path('todos/', TodoList.as_view()),
    path('todos/<int:pk>/', TodoDetail.as_view()),
    path('contacts/', ContactList.as_view()),
    path('contacts/<int:pk>/', ContactDetail.as_view()),
    path('subtasks/', SubtaskList.as_view()),
    path('subtasks/<int:pk>/', SubtaskDetail.as_view()),
]
