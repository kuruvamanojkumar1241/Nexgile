from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Facility, Department, Professional, Credential, Shift, ShiftApplication, Timesheet, Invoice

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    organization = serializers.CharField(source='profile.organization', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'organization']


class CredentialSerializer(serializers.ModelSerializer):
    days_until_expiry = serializers.IntegerField(read_only=True)

    class Meta:
        model = Credential
        fields = '__all__'


class ProfessionalSerializer(serializers.ModelSerializer):
    credentials = CredentialSerializer(many=True, read_only=True)

    class Meta:
        model = Professional
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    fill_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = Department
        fields = '__all__'


class FacilitySerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Facility
        fields = '__all__'


class ShiftSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    facility_city = serializers.CharField(source='facility.city', read_only=True)
    assigned_professional_name = serializers.CharField(source='assigned_professional.full_name', read_only=True)

    class Meta:
        model = Shift
        fields = '__all__'


class ShiftApplicationSerializer(serializers.ModelSerializer):
    shift_title = serializers.CharField(source='shift.title', read_only=True)
    professional_name = serializers.CharField(source='professional.full_name', read_only=True)

    class Meta:
        model = ShiftApplication
        fields = '__all__'


class TimesheetSerializer(serializers.ModelSerializer):
    shift_title = serializers.CharField(source='shift.title', read_only=True)
    facility_name = serializers.CharField(source='shift.facility.name', read_only=True)
    department_name = serializers.CharField(source='shift.department.name', read_only=True)
    professional_name = serializers.CharField(source='professional.full_name', read_only=True)
    shift_date = serializers.DateField(source='shift.shift_date', read_only=True)

    class Meta:
        model = Timesheet
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'
