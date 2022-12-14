from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField('email address', unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    designation = models.CharField(max_length=30)

    class GenderChoice(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'
        OTHER = 'O', 'Other'

    gender = models.CharField(max_length=1, choices=GenderChoice.choices)
    dob = models.DateField(null=True)
    date_of_joining = models.DateField(null=True)

    class RoleChoice(models.TextChoices):
        MANAGER = 'manager', 'Manager',
        EMPLOYEE = 'employee', 'Employee'

    role = models.CharField(max_length=10, choices=RoleChoice.choices)
    education_10th_percentage = models.IntegerField(null=True)
    education_12th_percentage = models.IntegerField(null=True)
    education_grad_percentage = models.IntegerField(null=True)
    mobile = models.CharField(max_length=10, unique=True)
    address = models.TextField(null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50, default="India")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"<Id:{self.id}><Email:{self.email}><Name:{self.first_name} {self.last_name}>"


class Bill(models.Model):
    project_name = models.CharField(max_length=40)
    date_of_issue = models.DateField()
    bill_document = models.FileField(
        upload_to='bill_documents/', null=True, blank=True)
    bill_status = models.BooleanField(default=False)
    amount = models.IntegerField(null=True)
    comments = models.TextField()
    approved_by = models.ForeignKey(
        "CustomUser", on_delete=models.CASCADE, related_name='approved_by')
    approved_on = models.DateField(null=True)
    issued_by = models.ForeignKey(
        "CustomUser", on_delete=models.CASCADE, related_name='issued_by')

    def __str__(self):
        return f"<BillId:{self.id}> <{self.project_name}> <{self.issued_by}>"


class Notification(models.Model):
    notification_text = models.TextField()
    notification_by = models.ForeignKey(
        "CustomUser", on_delete=models.CASCADE, related_name='notification_by')
    notification_for = models.ForeignKey(
        "CustomUser", on_delete=models.CASCADE, related_name='notification_for')

    def __str__(self):
        return f"<NotificationId:{self.id}> <{self.notification_by}>"
