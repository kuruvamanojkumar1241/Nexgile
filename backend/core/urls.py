from django.urls import path
from .views import (
    LoginView, FacilityListView, DepartmentListView,
    ProfessionalListView, ShiftListView, ShiftActionView,
    AIMatchingView, ComplianceHubView, TimesheetListView,
    TimesheetApproveView, InvoiceListView, AgencyAnalyticsView
)

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('facilities/', FacilityListView.as_view(), name='facilities'),
    path('departments/', DepartmentListView.as_view(), name='departments'),
    path('professionals/', ProfessionalListView.as_view(), name='professionals'),
    path('shifts/', ShiftListView.as_view(), name='shifts'),
    path('shifts/<int:pk>/<str:action>/', ShiftActionView.as_view(), name='shift-action'),
    path('match/', AIMatchingView.as_view(), name='ai-matching'),
    path('compliance/', ComplianceHubView.as_view(), name='compliance'),
    path('timesheets/', TimesheetListView.as_view(), name='timesheets'),
    path('timesheets/<int:pk>/approve/', TimesheetApproveView.as_view(), name='timesheet-approve'),
    path('invoices/', InvoiceListView.as_view(), name='invoices'),
    path('analytics/', AgencyAnalyticsView.as_view(), name='analytics'),
]
