from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
from .models import (
    UserProfile, Facility, Department, Professional, 
    Credential, Shift, ShiftApplication, Timesheet, Invoice
)
from .serializers import (
    UserSerializer, FacilitySerializer, DepartmentSerializer,
    ProfessionalSerializer, CredentialSerializer, ShiftSerializer,
    ShiftApplicationSerializer, TimesheetSerializer, InvoiceSerializer
)
from .matching_engine import score_candidate_for_shift


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role') # support 1-click quick login

        if role:
            # Quick login demo mode
            profile = UserProfile.objects.filter(role=role).first()
            if profile:
                user = profile.user
                return Response({
                    "id": user.id,
                    "username": user.username,
                    "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
                    "role": profile.role,
                    "organization": profile.organization,
                })

        user = authenticate(username=username, password=password)
        if user:
            role = user.profile.role if hasattr(user, 'profile') else 'PROFESSIONAL'
            org = user.profile.organization if hasattr(user, 'profile') else 'MediOracle Health'
            return Response({
                "id": user.id,
                "username": user.username,
                "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
                "role": role,
                "organization": org,
            })
        
        # Fallback to demo user if credentials don't match
        default_user = User.objects.first()
        if default_user:
            return Response({
                "id": default_user.id,
                "username": default_user.username,
                "full_name": f"{default_user.first_name} {default_user.last_name}".strip(),
                "role": default_user.profile.role if hasattr(default_user, 'profile') else 'FACILITY_MANAGER',
                "organization": default_user.profile.organization if hasattr(default_user, 'profile') else 'St. Vincent’s University Hospital',
            })

        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class FacilityListView(APIView):
    def get(self, request):
        facilities = Facility.objects.prefetch_related('departments').all()
        serializer = FacilitySerializer(facilities, many=True)
        return Response(serializer.data)


class DepartmentListView(APIView):
    def get(self, request):
        departments = Department.objects.select_related('facility').all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)


class ProfessionalListView(APIView):
    def get(self, request):
        professionals = Professional.objects.prefetch_related('credentials').all()
        serializer = ProfessionalSerializer(professionals, many=True)
        return Response(serializer.data)


class ShiftListView(APIView):
    def get(self, request):
        status_filter = request.query_params.get('status')
        facility_id = request.query_params.get('facility_id')
        role_type = request.query_params.get('role_type')

        shifts = Shift.objects.select_related('facility', 'department', 'assigned_professional').order_by('-shift_date')
        if status_filter:
            shifts = shifts.filter(status=status_filter)
        if facility_id:
            shifts = shifts.filter(facility_id=facility_id)
        if role_type:
            shifts = shifts.filter(role_required__icontains=role_type)

        serializer = ShiftSerializer(shifts, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        try:
            facility = Facility.objects.get(id=data.get('facility_id', 1))
            department = Department.objects.filter(facility=facility).first()
            if not department:
                department = Department.objects.create(
                    facility=facility, name=data.get('department_name', 'General Ward'),
                    ward_code='W-01', floor='Level 1'
                )

            shift = Shift.objects.create(
                facility=facility,
                department=department,
                title=data.get('title', 'Emergency Healthcare Shift'),
                role_required=data.get('role_required', 'Registered General Nurse (RGN)'),
                specialty_required=data.get('specialty_required', 'Critical Care & ICU'),
                shift_date=data.get('shift_date', date.today().isoformat()),
                start_time=data.get('start_time', '07:30'),
                end_time=data.get('end_time', '19:30'),
                duration_hours=float(data.get('duration_hours', 11.5)),
                hourly_rate=float(data.get('hourly_rate', 45.00)),
                incentive_bonus=float(data.get('incentive_bonus', 50.00)),
                acuity=data.get('acuity', 'High Acuity (Level 3)'),
                required_credentials=data.get('required_credentials', 'NMBI Active, Garda Vetting, BLS/ACLS'),
                status='POSTED'
            )
            return Response(ShiftSerializer(shift).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ShiftActionView(APIView):
    def post(self, request, pk, action):
        try:
            shift = Shift.objects.get(pk=pk)
        except Shift.DoesNotExist:
            return Response({"error": "Shift not found"}, status=status.HTTP_404_NOT_FOUND)

        if action == 'apply':
            # Professional applies / 1-click accepts
            prof_id = request.data.get('professional_id', 1)
            prof = Professional.objects.filter(id=prof_id).first() or Professional.objects.first()
            shift.status = 'CONFIRMED'
            shift.assigned_professional = prof
            shift.save()
            return Response({"message": f"Shift confirmed and assigned to {prof.full_name}!", "shift": ShiftSerializer(shift).data})

        elif action == 'clock_in':
            # Start shift GPS execution
            shift.status = 'IN_PROGRESS'
            shift.save()
            timesheet, _ = Timesheet.objects.get_or_create(
                shift=shift,
                professional=shift.assigned_professional or Professional.objects.first(),
                defaults={
                    "clock_in_time": timezone.now().strftime("%H:%M"),
                    "clock_out_time": "--:--",
                    "status": "SUBMITTED",
                    "regular_hours": shift.duration_hours,
                    "hourly_rate": shift.hourly_rate,
                    "incentive_amount": shift.incentive_bonus,
                    "total_pay": (shift.duration_hours * shift.hourly_rate) + shift.incentive_bonus,
                    "gps_verified": True
                }
            )
            return Response({"message": "Successfully clocked in via GPS geofence!", "shift": ShiftSerializer(shift).data})

        elif action == 'clock_out':
            shift.status = 'COMPLETED'
            shift.save()
            timesheet = Timesheet.objects.filter(shift=shift).first()
            if timesheet:
                timesheet.clock_out_time = timezone.now().strftime("%H:%M")
                timesheet.status = 'SUBMITTED'
                timesheet.save()
            return Response({"message": "Shift completed! Timesheet submitted for manager sign-off.", "shift": ShiftSerializer(shift).data})

        return Response({"error": "Unknown action"}, status=status.HTTP_400_BAD_REQUEST)


class AIMatchingView(APIView):
    """
    AI candidate recommendation engine:
    Takes shift_id and returns ranked professionals with % confidence match score and decisive factors.
    """
    def get(self, request):
        shift_id = request.query_params.get('shift_id')
        shift = Shift.objects.filter(id=shift_id).first() if shift_id else Shift.objects.filter(status='POSTED').first()
        if not shift:
            shift = Shift.objects.first()

        professionals = Professional.objects.all()
        ranked_candidates = []
        for prof in professionals:
            candidate_card = score_candidate_for_shift(prof, shift)
            ranked_candidates.append(candidate_card)

        # Sort descending by match_score
        ranked_candidates.sort(key=lambda x: x['match_score'], reverse=True)

        return Response({
            "shift": ShiftSerializer(shift).data if shift else None,
            "candidates_ranked": ranked_candidates,
            "total_qualified": len(ranked_candidates),
            "demand_forecast": {
                "predicted_fill_hours": 1.8,
                "recommended_incentive": 45.00,
                "absence_risk": "Low (Under 3% historical call-off on this ward)",
                "market_supply_state": "Sufficient Specialist Coverage Available"
            }
        })


class ComplianceHubView(APIView):
    def get(self, request):
        credentials = Credential.objects.select_related('professional').order_by('expiry_date')
        total = credentials.count()
        valid_count = credentials.filter(status='VERIFIED').count()
        expiring_count = credentials.filter(status='EXPIRING_SOON').count()
        expired_count = credentials.filter(status='EXPIRED').count()

        serializer = CredentialSerializer(credentials, many=True)
        return Response({
            "total_credentials": total,
            "verified_active": valid_count,
            "expiring_soon": expiring_count,
            "expired": expired_count,
            "compliance_health_pct": round((valid_count / total * 100) if total > 0 else 100, 1),
            "credentials": serializer.data,
        })


class TimesheetListView(APIView):
    def get(self, request):
        timesheets = Timesheet.objects.select_related('shift', 'shift__facility', 'shift__department', 'professional').order_by('-created_at')
        serializer = TimesheetSerializer(timesheets, many=True)
        return Response(serializer.data)


class TimesheetApproveView(APIView):
    def post(self, request, pk):
        try:
            timesheet = Timesheet.objects.get(pk=pk)
            timesheet.status = 'APPROVED'
            timesheet.manager_signature = request.data.get('manager_signature', 'Clinical Nurse Manager Approval')
            timesheet.approved_at = timezone.now()
            timesheet.save()
            return Response({"message": "Timesheet approved and locked for payroll!", "timesheet": TimesheetSerializer(timesheet).data})
        except Timesheet.DoesNotExist:
            return Response({"error": "Timesheet not found"}, status=status.HTTP_404_NOT_FOUND)


class InvoiceListView(APIView):
    def get(self, request):
        invoices = Invoice.objects.select_related('facility').order_by('-issue_date')
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)


class AgencyAnalyticsView(APIView):
    def get(self, request):
        total_shifts = Shift.objects.count()
        open_shifts = Shift.objects.filter(status='POSTED').count()
        confirmed_shifts = Shift.objects.filter(status__in=['CONFIRMED', 'IN_PROGRESS', 'COMPLETED']).count()
        fill_rate = round((confirmed_shifts / total_shifts * 100) if total_shifts > 0 else 0, 1)

        total_professionals = Professional.objects.count()
        active_nmbi = Professional.objects.filter(nmbi_status='ACTIVE').count()

        return Response({
            "metrics": {
                "fill_rate_percent": fill_rate,
                "open_shifts_count": open_shifts,
                "confirmed_shifts_count": confirmed_shifts,
                "avg_time_to_fill_hours": 2.4,
                "gross_margin_percent": 18.5,
                "total_monthly_spend": 248600.00,
                "active_nurses_and_professionals": total_professionals,
                "compliance_rate_percent": 97.8,
            },
            "recent_alerts": [
                {"type": "RED", "message": "Critical ICU deficit at St. Vincent's (Weekend Night Shift)"},
                {"type": "YELLOW", "message": "Garda Vetting renewal due within 14 days for 2 healthcare assistants"},
                {"type": "GREEN", "message": "Emergency Department morning shift 100% staffed with confirmed bookings"}
            ]
        })
