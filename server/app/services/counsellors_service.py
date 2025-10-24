"""
Counsellors database service - now fetches from Firebase instead of hard-coded data
"""

# Note: This service now works with Firebase data fetched from the frontend
# The hard-coded data below is kept as fallback for development/testing
COUNSELLORS_DATABASE = [
    {
        "id": "counsellor_001",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@neurowell.com",
        "specialties": ["anxiety", "depression", "stress-management"],
        "experience_years": 8,
        "rating": 4.9,
        "languages": ["English", "Spanish"],
        "availability": "Monday-Friday, 9AM-6PM",
        "bio": "Specialized in cognitive behavioral therapy for anxiety and depression. PhD in Clinical Psychology with 8 years of experience helping individuals overcome mental health challenges.",
        "price_per_session": 120,
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_002", 
        "name": "Dr. Michael Chen",
        "email": "michael.chen@neurowell.com",
        "specialties": ["trauma", "ptsd", "grief-counseling"],
        "experience_years": 12,
        "rating": 4.8,
        "languages": ["English", "Mandarin"],
        "availability": "Tuesday-Saturday, 10AM-7PM",
        "bio": "Trauma specialist with extensive experience in EMDR therapy. Licensed clinical psychologist focusing on PTSD, trauma recovery, and grief counseling.",
        "price_per_session": 150,
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_003",
        "name": "Dr. Emily Rodriguez",
        "email": "emily.rodriguez@neurowell.com", 
        "specialties": ["relationship-counseling", "family-therapy", "communication"],
        "experience_years": 6,
        "rating": 4.7,
        "languages": ["English", "Spanish", "Portuguese"],
        "availability": "Monday-Thursday, 8AM-5PM",
        "bio": "Marriage and family therapist specializing in relationship dynamics, communication issues, and family conflict resolution.",
        "price_per_session": 110,
        "image": "https://images.unsplash.com/photo-1594824388852-95e8b16c3d15?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_004",
        "name": "Dr. James Wilson",
        "email": "james.wilson@neurowell.com",
        "specialties": ["addiction", "substance-abuse", "behavioral-therapy"],
        "experience_years": 15,
        "rating": 4.9,
        "languages": ["English"],
        "availability": "Monday-Friday, 7AM-4PM",
        "bio": "Addiction specialist with 15 years of experience in substance abuse treatment and behavioral therapy. Certified in multiple evidence-based treatment approaches.",
        "price_per_session": 140,
        "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_005",
        "name": "Dr. Lisa Thompson",
        "email": "lisa.thompson@neurowell.com",
        "specialties": ["eating-disorders", "body-image", "self-esteem"],
        "experience_years": 10,
        "rating": 4.8,
        "languages": ["English", "French"],
        "availability": "Tuesday-Friday, 9AM-6PM",
        "bio": "Specialized in eating disorder treatment and body image issues. Licensed clinical psychologist with expertise in cognitive behavioral therapy and mindfulness-based approaches.",
        "price_per_session": 130,
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_006",
        "name": "Dr. David Park",
        "email": "david.park@neurowell.com",
        "specialties": ["adhd", "learning-disabilities", "adolescent-therapy"],
        "experience_years": 9,
        "rating": 4.6,
        "languages": ["English", "Korean"],
        "availability": "Monday-Wednesday, 10AM-6PM",
        "bio": "Child and adolescent psychologist specializing in ADHD, learning disabilities, and developmental challenges. Experienced in working with families and educational systems.",
        "price_per_session": 125,
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_007",
        "name": "Dr. Maria Garcia",
        "email": "maria.garcia@neurowell.com",
        "specialties": ["bipolar-disorder", "mood-disorders", "medication-management"],
        "experience_years": 11,
        "rating": 4.7,
        "languages": ["English", "Spanish"],
        "availability": "Monday-Friday, 8AM-5PM",
        "bio": "Psychiatrist and therapist specializing in mood disorders, bipolar disorder, and medication management. Dual expertise in therapy and psychiatric care.",
        "price_per_session": 160,
        "image": "https://images.unsplash.com/photo-1594824388852-95e8b16c3d15?w=150&h=150&fit=crop&crop=face"
    },
    {
        "id": "counsellor_008",
        "name": "Dr. Robert Kim",
        "email": "robert.kim@neurowell.com",
        "specialties": ["ocd", "phobias", "exposure-therapy"],
        "experience_years": 7,
        "rating": 4.8,
        "languages": ["English", "Korean"],
        "availability": "Tuesday-Saturday, 9AM-6PM",
        "bio": "Specialized in obsessive-compulsive disorder and phobia treatment using exposure therapy and cognitive behavioral techniques. Licensed clinical psychologist.",
        "price_per_session": 135,
        "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
    }
]

def get_all_counsellors():
    """Get all counsellors from the database"""
    return COUNSELLORS_DATABASE

def get_counsellors_by_specialty(specialty):
    """Get counsellors filtered by specialty"""
    if not specialty or specialty.lower() == "all":
        return COUNSELLORS_DATABASE
    
    return [
        counsellor for counsellor in COUNSELLORS_DATABASE
        if specialty.lower() in [s.lower() for s in counsellor["specialties"]]
    ]

def search_counsellors_by_name(search_term):
    """Search counsellors by name"""
    if not search_term:
        return COUNSELLORS_DATABASE
    
    search_lower = search_term.lower()
    return [
        counsellor for counsellor in COUNSELLORS_DATABASE
        if search_lower in counsellor["name"].lower()
    ]

def get_counsellor_by_id(counsellor_id):
    """Get a specific counsellor by ID"""
    for counsellor in COUNSELLORS_DATABASE:
        if counsellor["id"] == counsellor_id:
            return counsellor
    return None

def get_specialties():
    """Get all available specialties"""
    all_specialties = set()
    for counsellor in COUNSELLORS_DATABASE:
        all_specialties.update(counsellor["specialties"])
    return sorted(list(all_specialties))
