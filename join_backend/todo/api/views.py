# kanban/views.py
from rest_framework import generics
from .models import Todo, Contact, Subtask
from .serializers import TodoSerializer, ContactSerializer, SubtaskSerializer
from rest_framework import status
from rest_framework.response import Response

class TodoList(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

class TodoDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class ContactList(generics.ListCreateAPIView):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Request data:", request.data)
            print("Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()

class SubtaskList(generics.ListCreateAPIView):
    serializer_class = SubtaskSerializer
    queryset = Subtask.objects.all()

    def perform_create(self, serializer):
        parent_task_id = self.request.data.get('parent_task')
        parent_task = Todo.objects.get(id=parent_task_id)
        serializer.save(parent_task=parent_task)

class SubtaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubtaskSerializer
    queryset = Subtask.objects.all()
