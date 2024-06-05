# kanban/models.py
from django.db import models
import datetime

class Contact(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=70)
    phone_number = models.CharField(max_length=15) 
    badge_color = models.CharField(max_length=20)
    email = models.EmailField(max_length=70, blank=True, unique=True)

    def __str__(self):
        return self.first_name + " " + self.last_name

class Todo(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    due_date = models.DateField(default=datetime.date.today)
    category = models.CharField(max_length=50)
    prio = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(max_length=40)
    assigned_to = models.ManyToManyField(Contact, blank=True)

    def __str__(self):
        return self.title

class Subtask(models.Model):
    description = models.CharField(max_length=200)
    state = models.BooleanField(default=False)
    parent_task = models.ForeignKey(Todo, related_name='subtasks', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.description
