from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from StudentApp.serializers import StudentSerializer
from StudentApp.models import Student


@csrf_exempt
def studentApi(request, id=0):

    # GET all students
    if request.method == "GET":
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return JsonResponse(serializer.data, safe=False)

    # POST create student
    elif request.method == "POST":
        student_data = JSONParser().parse(request)
        serializer = StudentSerializer(data=student_data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Added Successfully", safe=False)

        return JsonResponse("Failed to Add", safe=False)

    # PUT update student
    elif request.method == "PUT":
        student_data = JSONParser().parse(request)
        student = Student.objects.get(id=id)

        serializer = StudentSerializer(student, data=student_data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse("Updated Successfully", safe=False)

        return JsonResponse("Failed to Update", safe=False)

    # DELETE student
    elif request.method == "DELETE":
        student = Student.objects.get(id=id)
        student.delete()
        return JsonResponse("Deleted Successfully", safe=False)