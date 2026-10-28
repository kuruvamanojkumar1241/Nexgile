from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta, date

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('FACILITY_MANAGER', 'Facility / Ward Leader'),
        ('PROFESSIONAL', 'Healthcare Professional'),
        ('AGENCY_ADMIN', 'Agency Administrator'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='PROFESSIONAL')
    phone = models.CharField(max_length=30, blank=True, default='')
    organization = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


class Facility(models.Model):
    FACILITY_TYPES = [
        ('Hospital', 'Acute Hospital'),
        ('HSE Site', 'HSE Public Health Site'),
        ('Nursing Home', 'Nursing & Care Home'),
        ('Clinic', 'Outpatient Clinic'),
        ('Rehabilitation', 'Rehabilitation Center'),
    ]
    name = models.CharField(max_length=150)
    facility_type = models.CharField(max_length=50, choices=FACILITY_TYPES, default='Hospital')
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100, default='Dublin')
    contact_email = models.EmailField(blank=True, default='')
    contact_phone = models.CharField(max_length=50, blank=True, default='')
    latitude = models.FloatField(default=53.3498)
    longitude = models.FloatField(default=-6.2603)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.facility_type})"


class Department(models.Model):
    RISK_CHOICES = [
        ('GREEN', 'Fully Staffed (Low Risk)'),
        ('YELLOW', 'Staffing Deficit (Medium Risk)'),
        ('RED', 'Critical Shortage (High Risk)'),
    ]
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    ward_code = models.CharField(max_length=30, default='WARD-01')
    floor = models.CharField(max_length=30, default='Level 2')
    required_staffing = models.IntegerField(default=10)
    confirmed_staffing = models.IntegerField(default=8)
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES, default='YELLOW')
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=50000.00)
    monthly_spent = models.DecimalField(max_digits=10, decimal_places=2, default=38400.00)

    @property
    def fill_rate(self):
        if self.required_staffing <= 0:
            return 100
        return round((self.confirmed_staffing / self.required_staffing) * 100, 1)

    def __str__(self):
        return f"{self.facility.name} - {self.name}"


class Professional(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='professional_record')
    full_name = models.CharField(max_length=120)
    role_type = models.CharField(max_length=80, default='Registered General Nurse (RGN)')
    specialty = models.CharField(max_length=80, default='Critical Care & ICU')
    nmbi_pin = models.CharField(max_length=40, unique=True)
    nmbi_status = models.CharField(max_length=30, default='ACTIVE')
    garda_vetting_status = models.CharField(max_length=30, default='VERIFIED')
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=42.00)
    rating = models.FloatField(default=4.9)
    reliability_score = models.IntegerField(default=98)
    shifts_completed = models.IntegerField(default=64)
    latitude = models.FloatField(default=53.3331)
    longitude = models.FloatField(default=-6.2489)
    city = models.CharField(max_length=80, default='Dublin')
    instant_pay_eligible = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    phone = models.CharField(max_length=30, default='+353 87 123 4567')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.role_type} - NMBI: {self.nmbi_pin})"


class Credential(models.Model):
    CRED_TYPES = [
        ('NMBI', 'NMBI Nursing/Midwifery License'),
        ('GARDA', 'Garda National Vetting Bureau'),
        ('BLS_ACLS', 'BLS / ACLS / PALS Resuscitation'),
        ('MANDATORY_TRAINING', 'HSE Mandatory Modules'),
        ('INDEMNITY', 'Professional Indemnity Insurance'),
    ]
    STATUS_CHOICES = [
        ('VERIFIED', 'Verified & Active'),
        ('EXPIRING_SOON', 'Expiring Soon (<30 Days)'),
        ('EXPIRED', 'Expired / Action Required'),
        ('PENDING', 'Pending Document Review'),
    ]
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='credentials')
    cred_type = models.CharField(max_length=40, choices=CRED_TYPES)
    title = models.CharField(max_length=150)
    reference_number = models.CharField(max_length=80)
    issue_date = models.DateField(default=date.today)
    expiry_date = models.DateField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='VERIFIED')
    verifier_notes = models.CharField(max_length=200, blank=True, default='Verified against official registry')

    def __str__(self):
        return f"{self.professional.full_name} - {self.title} ({self.status})"


class Shift(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('POSTED', 'Open / Accepting Candidates'),
        ('OFFERED', 'Offered to Candidate'),
        ('CONFIRMED', 'Confirmed & Booked'),
        ('IN_PROGRESS', 'Active / Clocked In'),
        ('COMPLETED', 'Completed & Shift Finished'),
        ('CANCELLED', 'Cancelled'),
    ]
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='shifts')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='shifts')
    title = models.CharField(max_length=150)
    role_required = models.CharField(max_length=80, default='Registered General Nurse (RGN)')
    specialty_required = models.CharField(max_length=80, default='Critical Care & ICU')
    shift_date = models.DateField(default=date.today)
    start_time = models.CharField(max_length=20, default='07:30')
    end_time = models.CharField(max_length=20, default='19:30')
    duration_hours = models.DecimalField(max_digits=4, decimal_places=1, default=11.5)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=45.00)
    incentive_bonus = models.DecimalField(max_digits=6, decimal_places=2, default=50.00)
    acuity = models.CharField(max_length=50, default='High Acuity (Level 3)')
    required_credentials = models.CharField(max_length=200, default='NMBI Active, Garda Vetting, BLS/ACLS')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='POSTED')
    assigned_professional = models.ForeignKey(Professional, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_shifts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} @ {self.facility.name} ({self.shift_date})"


class ShiftApplication(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('MATCHED', 'AI Recommended'),
        ('OFFERED', 'Offered'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Declined'),
    ]
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='applications')
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='applications')
    match_score = models.IntegerField(default=95)
    match_reasons = models.TextField(blank=True, default='Close commute distance, active NMBI license, previous 5-star ICU shifts')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='APPLIED')
    created_at = models.DateTimeField(auto_now_add=True)


class Timesheet(models.Model):
    STATUS_CHOICES = [
        ('SUBMITTED', 'Submitted / Pending Approval'),
        ('APPROVED', 'Approved & Signed Off'),
        ('DISPUTED', 'Dispute Raised'),
    ]
    shift = models.OneToOneField(Shift, on_delete=models.CASCADE, related_name='timesheet')
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='timesheets')
    clock_in_time = models.CharField(max_length=30, default='07:28')
    clock_out_time = models.CharField(max_length=30, default='19:32')
    break_duration_minutes = models.IntegerField(default=45)
    regular_hours = models.DecimalField(max_digits=4, decimal_places=2, default=11.50)
    overtime_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.50)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=45.00)
    incentive_amount = models.DecimalField(max_digits=6, decimal_places=2, default=50.00)
    total_pay = models.DecimalField(max_digits=8, decimal_places=2, default=590.00)
    gps_verified = models.BooleanField(default=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='APPROVED')
    manager_signature = models.CharField(max_length=100, default='Dr. Liam O’Connor (Clinical Director)')
    manager_notes = models.TextField(blank=True, default='Excellent clinical support in ICU floor today.')
    approved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Timesheet #{self.id} - {self.professional.full_name} (€{self.total_pay})"


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('PAID', 'Paid in Full'),
        ('PENDING', 'Pending Payment (Net 30)'),
        ('OVERDUE', 'Overdue'),
    ]
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    period_label = models.CharField(max_length=80, default='August 2026 Shift Cycle')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=14250.00)
    shifts_billed = models.IntegerField(default=24)
    issue_date = models.DateField(default=date.today)
    due_date = models.DateField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')

    def __str__(self):
        return f"{self.invoice_number} - {self.facility.name} (€{self.total_amount})"
