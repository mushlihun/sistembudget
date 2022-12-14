from django.http import HttpResponse
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from django.http.response import JsonResponse
from datetime import datetime
from .models import CustomUser, Bill
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from bms.settings import EMAIL_HOST_USER, EMAIL_HOST_PASSWORD
from django.core.mail import send_mail
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage
from rest_framework.decorators import parser_classes
from rest_framework.parsers import FileUploadParser


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def employee_detail(request, id):
    if request.method == 'GET':
        if CustomUser.objects.filter(id=id).exists():
            query = CustomUser.objects.get(id=id)
            serializer = UserSerializer(query)
            return JsonResponse(serializer.data, safe=False)
        return JsonResponse([], safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def manager_all(request):
    query = CustomUser.objects.filter(role="manager")
    if request.method == 'GET':
        serializer = ManagerSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        email = request.data.get("email", None)
        password = request.data.get("password", None)
        user = authenticate(email=email, password=password)
        if user is not None:
            id = user.id
            email = user.email
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)
        return JsonResponse({"id": id, "email": email, "access": access}, safe=False)
    return JsonResponse([], safe=False, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def employee_only_all(request):
    query = CustomUser.objects.filter(role="employee")
    if request.method == 'GET':
        serializer = ManagerSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['GET', 'POST', 'PUT'])
# @permission_classes([IsAuthenticated])
def employee_bill(request, emp_id):
    if request.method == 'GET':
        query = Bill.objects.filter(issued_by__id=emp_id)
        serializer = BillSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        bill_data = JSONParser().parse(request)
        bill_serializer = BillSerializerPost(data=bill_data)
        if bill_serializer.is_valid():
            q = Bill.objects.filter(issued_by=emp_id).count()
            if q < 4:
                bill_serializer.save()
                return JsonResponse(bill_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse({"msg": "You have reached your limit for bill apply"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def approve_bill(request, bill_id):
    if request.method == 'POST':
        q = Bill.objects.get(id=bill_id)
        q.bill_status = True
        q.save()
        serializer = BillSerializer(q)
        # ctx = {
        #     'name': CustomUser.objects.get(id=q.issued_by.id).first_name,
        #     'manager': CustomUser.objects.get(id=q.approved_by.id).first_name,
        # }
        # email = CustomUser.objects.get(id=q.issued_by.id).email
        # subject = 'Bill is Approved'
        # message = get_template('email.html').render(ctx)
        # email_from = EMAIL_HOST_USER
        # recipient_list = [email, ]
        # mail = EmailMessage(
        #     subject=subject,
        #     body=message,
        #     from_email=email_from,
        #     to=recipient_list,
        # )
        # mail.content_subtype = "html"
        # mail.send()
        return JsonResponse(serializer.data, safe=False)
    return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
def employee_bill_detail(request, emp_id, bill_id):
    if request.method == 'GET':
        query = Bill.objects.filter(issued_by__id=emp_id, id=bill_id)
        serializer = BillSerializer(query, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'PUT':
        bill_data = JSONParser().parse(request)
        bill_serializer = BillSerializerPost(data=bill_data)
        if bill_serializer.is_valid():
            q = Bill.objects.get(id=bill_id)
            q.amount = bill_data["amount"]
            q.project_name = bill_data["project_name"]
            q.comments = bill_data["comments"]
            q.save()
            return JsonResponse(bill_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse({}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
def notification(request, emp_id):
    if request.method == 'GET':
        query = Notification.objects.filter(notification_for=emp_id)
        serializers = NotificationSerializer(query, many=True)
        return JsonResponse(serializers.data, safe=False)
    elif request.method == 'POST':
        notification_data = JSONParser().parse(request)
        notification_serializer = NotificationSerializerPost(
            data=notification_data)
        if notification_serializer.is_valid():
            notification_serializer.save()
            return JsonResponse(notification_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
def notification_delete(request, notification_id):
    if request.method == 'DELETE':
        q = Notification.objects.get(id=notification_id)
        q.delete()
        return JsonResponse({"msg": "Deleted"}, status=status.HTTP_200_OK)
    return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def email_check(request):
    if request.method == 'POST':
        email = request.data.get("email", None)
        q = CustomUser.objects.filter(email=email).first()
        if q is None:
            return JsonResponse({"msg": "Email not found"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"msg": "Email found", "id": q.id}, status=status.HTTP_200_OK)
    return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def mobile_check(request):
    if request.method == 'POST':
        mobile = request.data.get("mobile", None)
        q = CustomUser.objects.filter(mobile=mobile).first()
        if q is None:
            return JsonResponse({"msg": "Mobile not found"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"msg": "Mobile found", "id": q.id}, status=status.HTTP_200_OK)
    return JsonResponse([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_bills_info(request, mgr_id):
    if mgr_id:
        query = Bill.objects.filter(approved_by=mgr_id).all()
        serializers = BillSerializer(query, many=True)
    return JsonResponse(serializers.data, safe=False)

# @api_view(['POST'])
# @parser_classes([FileUploadParser])
# def upload_pdf(request, bill_id, filename, format=None):
#     if request.method == 'POST':
#         filee = request.FILES['file']
#         query = Bill.objects.filter(id=bill_id).first()
#         # query.bill_document = file
#         # print(query.bill_document)
#         print(filee)
#         # file_serializer = FileSerializer(data=request.data)
#         # if file_serializer.is_valid():
#         # file_serializer.save()
#         # return Response(file_serializer.data, status=status.HTTP_201_CREATED)
#     # return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response({"x": "yy"}, status=status.HTTP_400_BAD_REQUEST)
