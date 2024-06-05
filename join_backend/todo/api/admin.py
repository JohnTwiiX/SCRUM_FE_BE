from django.contrib import admin
from .models import Todo, Subtask, Contact

# Register your models here.
admin.site.register(Todo)
admin.site.register(Contact)
admin.site.register(Subtask)
