from django.db import models

class OnlineMeetingsAnalyzed(models.Model):
    meeting_id = models.CharField(max_length=255, unique=True)
    subject = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Meeting ID: {self.meeting_id}"
    
class OnlineMeetingTasks(models.Model):
    statuses = [
        ("Canceled", "Baja"),
        ("Pending", "Alta"),
        ("Completed", "Media"),
    ]
    meeting = models.ForeignKey(OnlineMeetingsAnalyzed, on_delete=models.CASCADE, related_name='tasks')
    task_description = models.TextField()
    status  = models.CharField(max_length=20,choices=statuses,default="Canceled",verbose_name="Status",help_text="Select the status",)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Task for Meeting ID: {self.meeting.meeting_id} - {self.task_description[:50]}"