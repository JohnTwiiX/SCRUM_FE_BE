from rest_framework import serializers
from .models import Todo, Contact, Subtask

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'description', 'state']

class TodoSerializer(serializers.ModelSerializer):
    subtasks_data = SubtaskSerializer(many=True, write_only=True)
    assigned_to_ids = serializers.PrimaryKeyRelatedField(queryset=Contact.objects.all(), source='assigned_to', many=True, write_only=True)
    assigned_to = ContactSerializer(many=True, read_only=True)
    subtasks = SubtaskSerializer(many=True, read_only=True)

    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'due_date', 'category', 'prio', 'status', 'assigned_to', 'assigned_to_ids', 'subtasks', 'subtasks_data']

    def create(self, validated_data):
        subtasks_data = validated_data.pop('subtasks_data', [])
        assigned_to_data = validated_data.pop('assigned_to', [])
        todo = Todo.objects.create(**validated_data)
        todo.assigned_to.set(assigned_to_data)
        for subtask_data in subtasks_data:
            Subtask.objects.create(parent_task=todo, **subtask_data)
        return todo

    def update(self, instance, validated_data):
        subtasks_data = validated_data.pop('subtasks_data', [])
        assigned_to_data = validated_data.pop('assigned_to', [])
        instance = super().update(instance, validated_data)
        instance.assigned_to.set(assigned_to_data)
        Subtask.objects.filter(parent_task=instance).delete()
        for subtask_data in subtasks_data:
            Subtask.objects.create(parent_task=instance, **subtask_data)
        return instance
