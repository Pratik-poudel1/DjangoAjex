from django.shortcuts import render
#csrf
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Students
from rest_framework import serializers, viewsets

# Create your views here.
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'name', 'email', 'address']

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all()
    serializer_class = StudentSerializer


def index(request):
    return render(request, 'index.html')


def all(request):
    data = Students.objects.all()
    data=list(data.values())
    return JsonResponse(data, safe=False)


@csrf_exempt
def insert(request):
    name= request.POST.get('name')
    email= request.POST.get('email')
    address= request.POST.get('address')
    Students.objects.create(name=name, email=email, address=address)
    return JsonResponse({'status': 'Data received successfully'})

def delete(request, id):
    try:
        student = Students.objects.get(id=id)
        student.delete()
        return JsonResponse({'message': 'Data deleted successfully'})
    except Students.DoesNotExist:
        return JsonResponse({'message': 'Data not found'}, status=404)
    

@csrf_exempt
def get_student(request, id):
    student = Students.objects.get(id=id)
    return JsonResponse({
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "address": student.address
    })




@csrf_exempt
def update_student(request, id):
    if request.method == "POST":
        try:
            # Fetch the existing student
            student = Students.objects.get(id=id)

            # Update fields from request.POST
            student.name = request.POST.get('name')
            student.email = request.POST.get('email')
            student.address = request.POST.get('address')
            student.save()  # This updates, does NOT create new row

            return JsonResponse({"message": "Student updated successfully"})
        except Students.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)
