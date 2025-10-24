# Counsellors Collection Structure

Your Firebase `counsellors` collection should have documents with the following structure:

## Document Structure

```json
{
	"name": "Dr. Sarah Johnson",
	"emailid": "sarah.johnson@neurowell.com",
	"speciality": "anxiety",
	"experience_years": 8,
	"rating": 4.9,
	"languages": ["English", "Spanish"],
	"availability": "Monday-Friday, 9AM-6PM",
	"bio": "Specialized in cognitive behavioral therapy for anxiety and depression. PhD in Clinical Psychology with 8 years of experience helping individuals overcome mental health challenges.",
	"price_per_session": 120,
	"image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
}
```

## Required Fields

- `name` (string): Counsellor's full name
- `emailid` (string): Counsellor's email address
- `speciality` (string): Primary specialty (e.g., "anxiety", "depression", "trauma")

## Optional Fields

- `experience_years` (number): Years of experience (defaults to 0)
- `rating` (number): Rating out of 5 (defaults to 4.5)
- `languages` (array): Languages spoken (defaults to ["English"])
- `availability` (string): Working hours (defaults to "Contact for availability")
- `bio` (string): Professional bio (defaults to generic description)
- `price_per_session` (number): Cost per session (defaults to 100)
- `image` (string): Profile image URL (defaults to placeholder)

## Example Documents

### Document 1

```json
{
	"name": "Dr. Michael Chen",
	"emailid": "michael.chen@neurowell.com",
	"speciality": "trauma",
	"experience_years": 12,
	"rating": 4.8,
	"languages": ["English", "Mandarin"],
	"availability": "Tuesday-Saturday, 10AM-7PM",
	"bio": "Trauma specialist with extensive experience in EMDR therapy. Licensed clinical psychologist focusing on PTSD, trauma recovery, and grief counseling.",
	"price_per_session": 150
}
```

### Document 2

```json
{
	"name": "Dr. Emily Rodriguez",
	"emailid": "emily.rodriguez@neurowell.com",
	"speciality": "relationship-counseling",
	"experience_years": 6,
	"rating": 4.7,
	"languages": ["English", "Spanish", "Portuguese"],
	"availability": "Monday-Thursday, 8AM-5PM",
	"bio": "Marriage and family therapist specializing in relationship dynamics, communication issues, and family conflict resolution.",
	"price_per_session": 110
}
```

## Notes

1. The `speciality` field is used for filtering and AI recommendations
2. The system will automatically handle missing fields with sensible defaults
3. Multiple counsellors can have the same specialty
4. The AI recommendation system will work with whatever specialties you have in your collection
5. The frontend will automatically fetch and display all counsellors from this collection

## Integration

The system is now fully integrated with your Firebase collection:

- ✅ Frontend fetches data directly from Firebase
- ✅ Search and filtering work with your data
- ✅ AI recommendations use your counsellors
- ✅ No more hard-coded data dependency
