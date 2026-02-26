# Quick Start: Event Questions & Criteria Feature

## 🎯 In 60 Seconds

### What's New?
Admins can now add **questions** that users answer during event registration, and define **evaluation criteria** for scoring participants.

---

## 📌 Quick Actions

### Admin: Create Event with Questions
```
1. Admin Dashboard → Events Manager → Create New Event
2. Fill event Details
3. Scroll to "Event Questions" section
4. Add questions (or choose from suggestions)
5. Scroll to "Evaluation Criteria" section
6. Add criteria (or choose from suggestions)
7. Click "Create Event"
✅ Done!
```

### User: Register & Answer Questions
```
1. Browse → Select Event → Click Register
2. Step 1: Fill project info → Next
3. Step 2: Answer event questions → Next
4. Step 3: AI Pitch & team → Next
5. Step 4: Review & Submit
✅ Application submitted with answers!
```

### Admin: Review Answers
```
1. Events Manager → Select Event → Click applicant → View
   OR
2. Event Cards show badges: "X Questions" | "X Criteria"
✅ See all answers by question type!
```

---

## 📋 Question Types

| Type | Used For | Answer Format |
|------|----------|---------------|
| **Long Text** | Detailed responses | Multi-line text area |
| **Short Text** | Quick facts | Single-line input |
| **URL** | Links | Paste https:// links |
| **File Upload** | Documents | Upload PDF, docs, etc. |
| **Yes/No** | Quick decisions | Two button choice |
| **Multiple Choice** | Categories | Select one option |

---

## 🏆 Evaluation Criteria Examples

**Technical Depth**
- Quality of technology and innovation

**Business Model**
- Revenue strategy and market fit

**Team Capability**
- Skills, experience, and team dynamics

**Market Potential**
- Size of opportunity and growth potential

**Innovation**
- Uniqueness of approach and solution

*...and 3 more pre-built options!*

---

## 🎨 Features Overview

✅ **Add Questions**
- Type custom questions
- Choose from 16+ suggestions
- 6 different answer types
- Mark as required

✅ **Add Criteria**
- Type custom criteria
- Choose from 8 pre-built criteria
- Automatic color coding
- Clear descriptions

✅ **Track Questions & Criteria**
- Event cards show badges
- See how many questions/criteria per event
- Instant visual indicators

✅ **User Registration Enhanced**
- Questions step added automatically
- Only shows if questions exist
- All answers validated before submit
- Progress bar updates accordingly

✅ **Answer Viewing**
- Admin can view all user answers
- Organized by question type
- File uploads downloadable
- URLs clickable

---

## 💡 Pro Tips

### For Question Design
- **Long Text** for innovation/problems
- **Short Text** for numbers/facts
- **URL** for portfolios/GitHub/demos
- **File** for resumes/pitch decks
- **Yes/No** for eligibility checks

### For Criteria Design
- Use 5-8 criteria per event
- Make descriptions measurable
- Use consistent naming

### Best Practices
1. Test registration flow as a user
2. Review all answers before evaluation
3. Use criteria consistently across evaluators
4. Save evaluation notes with scores

---

## 🔢 Example Setup

### AI Hackathon Event
**Questions:**
1. Describe your AI innovation (Long Text)
2. Have you used LLMs? (Yes/No)
3. GitHub repository (URL)
4. Pitch deck (File)

**Criteria:**
1. Technical Innovation (rate 1-10)
2. Code Quality (rate 1-10)
3. Presentation (rate 1-10)

**User Flow:**
- Step 1: Project info ✓
- Step 2: Answer 4 questions ✓
- Step 3: AI pitch & team ✓
- Step 4: Submit ✓

---

## 🚨 Important

⚠️ **Required Questions**: Users can't submit without answering required questions

⚠️ **File Uploads**: Currently stores file names (not files themselves)

⚠️ **Answer Storage**: Uses browser localStorage (local to device)

✅ **Production Ready**: For live use, integrate with backend database

---

## 📍 Where to Find Everything

| What | Where |
|------|-------|
| Read Full Guide | `FEATURE_GUIDE.md` |
| Technical Docs | `TECHNICAL_IMPLEMENTATION.md` |
| Complete Summary | `IMPLEMENTATION_SUMMARY.md` |
| Create Event | Admin Dashboard → Events Manager |
| View Questions | Event Details → Applicant Details |
| Evaluate | Pitch Evaluation |

---

## 🎬 Step-by-Step Examples

### Example 1: Creating a Bootcamp Event

```
CREATE EVENT
│
├─ Basic Info
│  ├─ Name: "AI Intensive Bootcamp"
│  ├─ Dates: March 15-20, 2026
│  ├─ Location: Q-AI Hub
│  └─ Max: 50 participants
│
├─ EVENT QUESTIONS
│  ├─ Question 1: "Experience level?" (Use suggestion)
│  ├─ Question 2: "Upload resume" (File Upload type)
│  ├─ Question 3: "GitHub profile" (URL type)
│  └─ Question 4: "Available full-time?" (Yes/No)
│
├─ EVALUATION CRITERIA
│  ├─ Criteria 1: "Technical Background" (suggested)
│  ├─ Criteria 2: "Learning Potential" (suggested)
│  └─ Criteria 3: "Commitment Level" (custom)
│
└─ CREATE ✓
```

---

### Example 2: User Registration Flow

```
REGISTER FOR EVENT
│
├─ STEP 1: Project Info
│  ├─ Project name: "AI Assistant"
│  ├─ Sector: "HealthTech"
│  └─ Logo: [uploaded] → NEXT
│
├─ STEP 2: Event Questions ⭐ NEW!
│  ├─ Q1 "Experience level?" → Junior
│  ├─ Q2 "Resume" → [file uploaded]
│  ├─ Q3 "GitHub" → github.com/user/project
│  ├─ Q4 "Full-time?" → Yes
│  └─ All required answered → NEXT
│
├─ STEP 3: AI Pitch & Team
│  ├─ Original pitch: [entered]
│  ├─ Team size: 2
│  ├─ Teammates: [invited]
│  └─ Tech stack: React, Python
│
├─ STEP 4: Review & Submit
│  ├─ Review all info
│  ├─ Accept terms
│  └─ SUBMIT ✓
│
└─ Application includes all answers!
```

---

### Example 3: Admin Reviewing Answers

```
EVENTS MANAGER
│
├─ Event Cards show:
│  ├─ 🔷 "4 Questions" badge
│  └─ 🟣 "3 Criteria" badge
│
├─ Click Event
│  ├─ Applicants list
│  └─ Click Applicant "View"
│
├─ APPLICANT DETAILS
│  ├─ Application Answers ⭐
│  │  ├─ Q1: "Experience level?" → Junior
│  │  ├─ Q2: "Resume" → [📎 Download resume.pdf]
│  │  ├─ Q3: "GitHub" → [🔗 github.com/user/project]
│  │  └─ Q4: "Full-time?" → Yes
│  │
│  └─ AI Insight: "Strong technical foundation..."
│
└─ Go to Pitch Evaluation to score!
```

---

## ❓ FAQs

**Q: Can users skip questions?**
A: Only if they're marked optional. Required questions must be answered.

**Q: Can I edit questions after creating the event?**
A: Current version: No. Future enhancement to add edit capability.

**Q: Where are answers stored?**
A: Currently in browser localStorage. For production, use backend database.

**Q: Can I upload files?**
A: Yes! File Upload question type supports documents.

**Q: What if I make a mistake?**
A: Questions/criteria can be removed when creating event. After creation, create a new event.

---

## 📞 Need Help?

1. **User Guide**: Read `FEATURE_GUIDE.md` for detailed instructions
2. **Technical Issues**: Check `TECHNICAL_IMPLEMENTATION.md`
3. **Error Messages**: Look at troubleshooting section in Feature Guide
4. **Code Changes**: Review comments in modified files

---

## ✅ Verification Checklist

After implementation, verify:

- [ ] Can create event with questions ✓
- [ ] Can add suggested questions ✓
- [ ] Can add custom questions ✓
- [ ] Can create event with criteria ✓
- [ ] User sees questions during registration ✓
- [ ] User can answer different question types ✓
- [ ] Required questions validated ✓
- [ ] Answers saved with application ✓
- [ ] Admin can view answers ✓
- [ ] Event cards show badges ✓

---

**Ready to use! 🚀**

Start by creating an event with questions and watching users register and answer them!
