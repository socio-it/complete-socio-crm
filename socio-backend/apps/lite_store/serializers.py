from rest_framework import serializers
from .models import *

class OutlookTasksSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        fields = '__all__'
        model = OnlineMeetingTasks

class OnlineReminderTasksSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 2
        fields = '__all__'
        model = OnlineReminderTasks