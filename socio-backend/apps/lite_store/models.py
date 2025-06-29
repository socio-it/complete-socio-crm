from django.db import models

#------------------------------------------------
# This is to manage Outlook Meetings Tasks Agents
#------------------------------------------------
class OnlineMeetingsAnalyzed(models.Model):
    meeting_id = models.CharField(max_length=255, unique=True)
    subject = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    summary = models.TextField(null=True)

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

class OnlineReminderTasks(models.Model):
    statuses = [
        ("Sent", "Sent"),
        ("Pending", "Pending")
    ]
    task_reminder = models.ForeignKey(OnlineMeetingTasks, on_delete=models.CASCADE, related_name='task_reminders')
    status  = models.CharField(max_length=20,choices=statuses,default="Pending",verbose_name="Status",help_text="Select the status",)
    notification_date = models.DateField()    
    email = models.EmailField(null=True)
    
    def __str__(self):
        return f"Task for Meeting ID: {self.task_reminder.task_description[:50]} - {self.id}"
    
#--------------------------------------
# This is to manage Consultant AI Agent
#--------------------------------------
class ConsultantResponses(models.Model):
    problem_situation = models.TextField(null=True)
    context = models.JSONField(null=True)
    needs = models.JSONField(null=True)
    proposal = models.TextField(null=True)
    