import os
import django
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medioracle_backend.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import (
    UserProfile, Facility, Department, Professional,
    Credential, Shift, ShiftApplication, Timesheet, Invoice
)

def run():
    print("Clearing old data...")
    User.objects.all().delete()
    Facility.objects.all().delete()
    Department.objects.all().delete()
    Professional.objects.all().delete()
    Credential.objects.all().delete()
    Shift.objects.all().delete()
    Timesheet.objects.all().delete()
    Invoice.objects.all().delete()

    print("Creating Demo Users...")
    u1, _ = User.objects.get_or_create(username='facility_manager', email='ward.leader@hospital.ie', first_name='Dr. Liam', last_name='O’Connor')
    u1.set_password('password123')
    u1.save()
    UserProfile.objects.create(user=u1, role='FACILITY_MANAGER', organization="St. Vincent's University Hospital", phone="+353 1 221 4000")

    u2, _ = User.objects.get_or_create(username='nurse_aoife', email='aoife.murphy@nursing.ie', first_name='Aoife', last_name='Murphy')
    u2.set_password('password123')
    u2.save()
    UserProfile.objects.create(user=u2, role='PROFESSIONAL', organization="Independent Specialist Healthcare", phone="+353 87 234 5678")

    u3, _ = User.objects.get_or_create(username='agency_admin', email='ops@medioracle.ie', first_name='Sarah', last_name='Brennan')
    u3.set_password('password123')
    u3.save()
    UserProfile.objects.create(user=u3, role='AGENCY_ADMIN', organization="MediOracle Agency Operations HQ", phone="+353 1 890 0000")

    print("Creating Facilities & Departments...")
    fac1 = Facility.objects.create(
        name="St. Vincent's University Hospital",
        facility_type="Hospital",
        address="Elm Park, Merrion Rd, Dublin 4",
        city="Dublin",
        contact_email="workforce@stvincents.ie",
        latitude=53.3168,
        longitude=-6.2136
    )

    fac2 = Facility.objects.create(
        name="Mater Misericordiae University Hospital",
        facility_type="Hospital",
        address="Eccles St, Dublin 7",
        city="Dublin",
        contact_email="clinical.staffing@mater.ie",
        latitude=53.3592,
        longitude=-6.2652
    )

    fac3 = Facility.objects.create(
        name="HSE Clontarf Community Nursing Unit",
        facility_type="HSE Site",
        address="Clontarf, Dublin 3",
        city="Dublin",
        contact_email="cnu.staffing@hse.ie",
        latitude=53.3642,
        longitude=-6.1950
    )

    dep1 = Department.objects.create(
        facility=fac1,
        name="Intensive Care Unit (ICU)",
        ward_code="ICU-Level2",
        floor="Level 2 West",
        required_staffing=14,
        confirmed_staffing=11,
        risk_level="RED",
        monthly_budget=75000.00,
        monthly_spent=54200.00
    )

    dep2 = Department.objects.create(
        facility=fac1,
        name="Emergency Department (ED)",
        ward_code="ED-Ground",
        floor="Ground Floor A",
        required_staffing=18,
        confirmed_staffing=16,
        risk_level="YELLOW",
        monthly_budget=95000.00,
        monthly_spent=81000.00
    )

    dep3 = Department.objects.create(
        facility=fac2,
        name="Cardiac & Coronary Care",
        ward_code="CCU-03",
        floor="Level 3",
        required_staffing=8,
        confirmed_staffing=8,
        risk_level="GREEN",
        monthly_budget=42000.00,
        monthly_spent=31200.00
    )

    print("Creating Healthcare Professionals...")
    prof1 = Professional.objects.create(
        user=u2,
        full_name="Aoife Murphy",
        role_type="Registered General Nurse (RGN)",
        specialty="Critical Care & ICU",
        nmbi_pin="948201",
        nmbi_status="ACTIVE",
        garda_vetting_status="VERIFIED",
        hourly_rate=45.00,
        rating=4.95,
        reliability_score=99,
        shifts_completed=82,
        latitude=53.3280,
        longitude=-6.2300,
        city="Dublin",
        instant_pay_eligible=True,
        phone="+353 87 234 5678"
    )

    prof2 = Professional.objects.create(
        full_name="Sean O'Connor",
        role_type="Registered General Nurse (RGN)",
        specialty="Emergency Medicine & Resus",
        nmbi_pin="820194",
        nmbi_status="ACTIVE",
        garda_vetting_status="VERIFIED",
        hourly_rate=44.00,
        rating=4.85,
        reliability_score=96,
        shifts_completed=58,
        latitude=53.3450,
        longitude=-6.2550,
        city="Dublin",
        instant_pay_eligible=True,
        phone="+353 86 987 6543"
    )

    prof3 = Professional.objects.create(
        full_name="Ciara Kelly",
        role_type="Health Care Assistant (HCA)",
        specialty="Elderly & Rehabilitation Care",
        nmbi_pin="HCA-7712",
        nmbi_status="ACTIVE",
        garda_vetting_status="VERIFIED",
        hourly_rate=26.50,
        rating=5.00,
        reliability_score=100,
        shifts_completed=114,
        latitude=53.3600,
        longitude=-6.2100,
        city="Dublin",
        instant_pay_eligible=True,
        phone="+353 85 432 1098"
    )

    prof4 = Professional.objects.create(
        full_name="David Ryan",
        role_type="Clinical Specialist Midwife",
        specialty="Labor, Delivery & Postnatal",
        nmbi_pin="739102",
        nmbi_status="ACTIVE",
        garda_vetting_status="VERIFIED",
        hourly_rate=48.00,
        rating=4.75,
        reliability_score=93,
        shifts_completed=41,
        latitude=53.3100,
        longitude=-6.2800,
        city="Dublin",
        instant_pay_eligible=False,
        phone="+353 89 112 3344"
    )

    print("Adding Credentials...")
    Credential.objects.create(
        professional=prof1,
        cred_type="NMBI",
        title="NMBI Registered Nurse License (General & Critical Care)",
        reference_number="NMBI-2026-948201",
        issue_date=date.today() - timedelta(days=300),
        expiry_date=date.today() + timedelta(days=65),
        status="VERIFIED",
        verifier_notes="Validated against NMBI live electronic register"
    )
    Credential.objects.create(
        professional=prof1,
        cred_type="GARDA",
        title="National Vetting Bureau Clearance Certificate",
        reference_number="NVB-REF-2026-883",
        issue_date=date.today() - timedelta(days=200),
        expiry_date=date.today() + timedelta(days=165),
        status="VERIFIED"
    )
    Credential.objects.create(
        professional=prof1,
        cred_type="BLS_ACLS",
        title="Advanced Cardiovascular Life Support (ACLS - AHA/IHF)",
        reference_number="ACLS-9941-CERT",
        issue_date=date.today() - timedelta(days=180),
        expiry_date=date.today() + timedelta(days=22),
        status="EXPIRING_SOON",
        verifier_notes="Refresher course booked with Irish Heart Foundation"
    )

    Credential.objects.create(
        professional=prof2,
        cred_type="NMBI",
        title="NMBI Registered General Nurse (Emergency)",
        reference_number="NMBI-2026-820194",
        issue_date=date.today() - timedelta(days=400),
        expiry_date=date.today() + timedelta(days=140),
        status="VERIFIED"
    )
    Credential.objects.create(
        professional=prof2,
        cred_type="GARDA",
        title="National Vetting Bureau Clearance",
        reference_number="NVB-REF-2026-112",
        issue_date=date.today() - timedelta(days=710),
        expiry_date=date.today() - timedelta(days=5),
        status="EXPIRED",
        verifier_notes="Renewal application pending processing"
    )

    print("Creating Shifts...")
    s1 = Shift.objects.create(
        facility=fac1,
        department=dep1,
        title="ICU Night Shift - Critical Care Staff Nurse",
        role_required="Registered General Nurse (RGN)",
        specialty_required="Critical Care & ICU",
        shift_date=date.today(),
        start_time="19:30",
        end_time="07:30",
        duration_hours=11.5,
        hourly_rate=47.50,
        incentive_bonus=60.00,
        acuity="Critical / Level 3 Ventilated Care",
        required_credentials="NMBI Active, Garda Vetting, ACLS Certified",
        status="POSTED"
    )

    s2 = Shift.objects.create(
        facility=fac1,
        department=dep2,
        title="Emergency Dept Rapid Assessment Day Shift",
        role_required="Registered General Nurse (RGN)",
        specialty_required="Emergency Medicine & Resus",
        shift_date=date.today() + timedelta(days=1),
        start_time="08:00",
        end_time="20:00",
        duration_hours=11.5,
        hourly_rate=46.00,
        incentive_bonus=40.00,
        acuity="High Acuity / Triage",
        required_credentials="NMBI Active, Garda Vetting, BLS",
        status="POSTED"
    )

    s3 = Shift.objects.create(
        facility=fac2,
        department=dep3,
        title="Coronary Care Step-Down Day Shift",
        role_required="Registered General Nurse (RGN)",
        specialty_required="Critical Care & ICU",
        shift_date=date.today(),
        start_time="07:30",
        end_time="19:30",
        duration_hours=11.5,
        hourly_rate=45.00,
        incentive_bonus=35.00,
        acuity="Step-Down Monitoring",
        required_credentials="NMBI Active, Garda Vetting",
        status="CONFIRMED",
        assigned_professional=prof1
    )

    s4 = Shift.objects.create(
        facility=fac1,
        department=dep1,
        title="Yesterday ICU Day Shift (Completed)",
        role_required="Registered General Nurse (RGN)",
        specialty_required="Critical Care & ICU",
        shift_date=date.today() - timedelta(days=1),
        start_time="07:30",
        end_time="19:30",
        duration_hours=11.5,
        hourly_rate=45.00,
        incentive_bonus=50.00,
        acuity="High Acuity",
        required_credentials="NMBI Active, Garda Vetting",
        status="COMPLETED",
        assigned_professional=prof1
    )

    print("Creating Timesheets...")
    Timesheet.objects.create(
        shift=s4,
        professional=prof1,
        clock_in_time="07:26",
        clock_out_time="19:34",
        break_duration_minutes=45,
        regular_hours=11.50,
        overtime_hours=0.50,
        hourly_rate=45.00,
        incentive_amount=50.00,
        total_pay=590.00,
        gps_verified=True,
        status="APPROVED",
        manager_signature="Dr. Liam O’Connor (Clinical Director)",
        manager_notes="Exemplary clinical handling during surge intake."
    )

    Timesheet.objects.create(
        shift=s3,
        professional=prof1,
        clock_in_time="07:30",
        clock_out_time="--:--",
        break_duration_minutes=30,
        regular_hours=11.50,
        overtime_hours=0.00,
        hourly_rate=45.00,
        incentive_amount=35.00,
        total_pay=552.50,
        gps_verified=True,
        status="SUBMITTED",
        manager_signature="Pending Ward Leader Sign-Off",
        manager_notes="Shift in progress"
    )

    print("Creating Invoices...")
    Invoice.objects.create(
        facility=fac1,
        invoice_number="INV-2026-0814",
        period_label="August 2026 Shift Cycle A",
        total_amount=28450.00,
        shifts_billed=48,
        issue_date=date.today() - timedelta(days=10),
        due_date=date.today() + timedelta(days=20),
        status="PENDING"
    )
    Invoice.objects.create(
        facility=fac2,
        invoice_number="INV-2026-0792",
        period_label="July 2026 Monthly Consolidated",
        total_amount=36120.00,
        shifts_billed=62,
        issue_date=date.today() - timedelta(days=35),
        due_date=date.today() - timedelta(days=5),
        status="PAID"
    )

    print("Seed complete! All tables populated with realistic MediOracle healthcare data.")

if __name__ == '__main__':
    run()
