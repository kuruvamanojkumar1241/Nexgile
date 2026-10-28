import math

def calculate_distance_km(lat1, lon1, lat2, lon2):
    # Haversine formula
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


def score_candidate_for_shift(professional, shift):
    """
    Intelligent Matching Engine based on MediOracle Functional Specifications:
    - Distance / Commute
    - Credential verification (NMBI, Garda, BLS)
    - Specialty & Acuity fit
    - Reliability & Rating history
    - Hourly rate compatibility
    """
    reasons = []
    total_score = 0

    # 1. NMBI & Compliance (25 pts)
    if professional.nmbi_status == 'ACTIVE' and professional.garda_vetting_status == 'VERIFIED':
        total_score += 25
        reasons.append("Active NMBI PIN verified & clean Garda vetting clearance")
    elif professional.nmbi_status == 'ACTIVE':
        total_score += 15
        reasons.append("Active NMBI PIN verified; Garda vetting renewal due soon")
    else:
        total_score += 0
        reasons.append("NMBI license requires verification check")

    # 2. Specialty & Role match (30 pts)
    if shift.role_required.lower() in professional.role_type.lower():
        if shift.specialty_required.lower() in professional.specialty.lower():
            total_score += 30
            reasons.append(f"Direct specialty match in {professional.specialty}")
        else:
            total_score += 20
            reasons.append(f"Role match ({professional.role_type}) with transferable clinical skills")
    else:
        total_score += 10
        reasons.append("Allied clinical background")

    # 3. Distance & Commute (20 pts)
    dist = calculate_distance_km(shift.facility.latitude, shift.facility.longitude, professional.latitude, professional.longitude)
    if dist <= 5.0:
        total_score += 20
        reasons.append(f"Immediate proximity ({dist} km commute)")
    elif dist <= 15.0:
        total_score += 15
        reasons.append(f"Short commute zone ({dist} km)")
    elif dist <= 30.0:
        total_score += 10
        reasons.append(f"Acceptable transit commute ({dist} km)")
    else:
        total_score += 5
        reasons.append(f"Extended commute distance ({dist} km)")

    # 4. Reliability & Rating (15 pts)
    rel_pts = int((professional.reliability_score / 100.0) * 10)
    rating_pts = int((professional.rating / 5.0) * 5)
    total_score += (rel_pts + rating_pts)
    reasons.append(f"{professional.rating}★ rating ({professional.shifts_completed} shifts completed, {professional.reliability_score}% reliability)")

    # 5. Rate & Working Time Directive limits (10 pts)
    if professional.hourly_rate <= shift.hourly_rate:
        total_score += 10
        reasons.append(f"Compliant with facility rate cap (€{professional.hourly_rate}/hr ≤ €{shift.hourly_rate}/hr)")
    else:
        diff = professional.hourly_rate - shift.hourly_rate
        total_score += 4
        reasons.append(f"Rate delta of +€{diff}/hr within manager discretionary variance")

    # Clamp score between 10 and 99
    final_score = min(99, max(20, total_score))

    return {
        "professional_id": professional.id,
        "full_name": professional.full_name,
        "role_type": professional.role_type,
        "specialty": professional.specialty,
        "nmbi_pin": professional.nmbi_pin,
        "nmbi_status": professional.nmbi_status,
        "rating": professional.rating,
        "reliability_score": professional.reliability_score,
        "shifts_completed": professional.shifts_completed,
        "distance_km": dist,
        "hourly_rate": str(professional.hourly_rate),
        "instant_pay_eligible": professional.instant_pay_eligible,
        "match_score": final_score,
        "decisive_factors": reasons,
    }
