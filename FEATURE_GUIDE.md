# Event Questions & Evaluation Criteria Feature Guide

## Overview
This feature allows admins to create custom questions that users must answer during event registration, and define evaluation criteria for assessing participants.

---

## 📝 For Admin: Creating Events with Questions & Criteria

### Step 1: Create a New Event
Navigate to **Admin Dashboard → Events Manager → Create New Event**

### Step 2: Set Basic Event Details
- Event Name
- Category (Hackathon, Bootcamp, Workshop, etc.)
- Description
- Date & Location
- Max Participants
- Other standard fields

### Step 3: Add Event Questions

The **Event Questions** section allows you to define registration questions:

#### Option A: Add Custom Questions
1. Enter your question text in the "Question Text" field
2. Select the **Question Type**:
   - **Long Text**: For detailed responses
   - **Short Text**: For brief answers
   - **URL**: For links to portfolios, repositories, etc.
   - **File Upload**: For resumes, pitch decks, presentations
   - **Yes/No**: For binary choices
   - **Multiple Choice**: For selecting from predefined options

3. Click "**Add Question**"
4. Questions added will appear below in an organized list

#### Option B: Use Suggested Questions
Click "**+ Use Suggestions**" to choose from pre-defined questions:
- Describe your innovation
- What problem does your startup solve?
- Business model questions
- Team experience questions
- Market opportunity questions
- And 11+ more suggestions

#### Managing Questions
- **View**: All added questions display with numbering and type
- **Remove**: Click the X button to delete a question
- **Order**: Questions appear in the order they were added

### Step 4: Add Evaluation Criteria

The **Evaluation Criteria** section defines how admins will score participants:

#### Option A: Create Custom Criteria
1. Enter a **Criteria Label** (e.g., "Technical Innovation")
2. Enter a **Description** (what admins will evaluate for)
3. Click "**Add Criteria**"

#### Option B: Use Suggested Criteria
Click "**+ Use Suggestions**" to select from pre-defined criteria:
- Technical Depth
- Business Model
- Oral Presentation
- Market Potential
- Team Capability
- Innovation & Originality
- Scalability
- Social Impact
- And more...

#### Managing Criteria
- **View**: All criteria display with color coding
- **Remove**: Click the X button to delete
- **Color**: Each criterion has an associated color for visual identification

### Step 5: Publish Event
Configure publishing status (Active/Draft/Closed) and click **"Create Event"**

---

## 👤 For Users: Answering Registration Questions

### Step 1: Start Application
User navigates to an event and clicks "Register" or "Apply"

### Step 2: Project Information (Step 1)
- Enter project details
- Upload logo
- Click "Next"

### Step 3: Answer Event Questions (Step 2)
If the event has questions configured:
- Questions appear with their type indicated
- Required questions are marked with *
- Answer based on question type:
  - **Text fields**: Type your answer
  - **URL fields**: Paste links
  - **File uploads**: Click to upload files
  - **Yes/No**: Select one option
  - **Multiple Choice**: Select from options
- Click "**Next**" to proceed (all required questions must be answered)

### Step 4: AI Pitch Enhancement & Team (Step 3)
- Continue with standard application flow
- Add team members if needed
- Click "Next"

### Step 5: Review & Submit (Step 4)
- Review application
- Accept terms
- Click "**Submit Application**"

---

## 🎯 For Admin: Evaluating Participants

### Accessing Evaluations
Go to **Admin Dashboard → Pitch Evaluation**

### Evaluation Process
1. Select an event with accepted applicants
2. Select a startup/team to evaluate
3. Score each evaluation criterion (1-10 scale)
4. Add notes about the performance
5. Use "**Generate AI Feedback**" for insights
6. Submit evaluation

The evaluation criteria you defined during event creation helps admins consistently assess all participants.

---

## 📊 Data Storage

### Questions & Answers
- Questions are stored with the event
- User answers are stored with their application
- Answer types support: text, URL, file names, yes/no responses

### Evaluation Criteria
- Criteria are defined per event
- Admins use these during startup evaluation
- Each criterion has a scoring scale (1-10)

### Answers Display
- Admin can view all user answers in the applicant details panel
- Questions and answers appear organized by question type
- File uploads show downloadable links

---

## 🎨 Customization Tips

### Question Types Selection
- Use **Long Text** for open-ended innovation questions
- Use **Short Text** for quick facts (team size, stage)
- Use **URL** for portfolio/GitHub/demo links
- Use **File Upload** for pitch decks and resumes
- Use **Yes/No** for eligibility/experience checks
- Use **Multiple Choice** for standardized categorization

### Evaluation Criteria Best Practices
- Define 5-8 criteria per event
- Make descriptions clear and measurable
- Use consistent categories across similar events
- Example: "Technical Depth: 5 points for novel approach + 5 for implementation quality"

---

## ✨ Workflow Example

### Example: AI Hackathon Event

**Questions to Add:**
1. "Describe your AI innovation" (Long Text)
2. "Have you used LLMs before?" (Yes/No)
3. "Link to your GitHub repository" (URL)
4. "Upload your pitch deck" (File Upload)
5. "What's your team size?" (Short Text)

**Criteria to Add:**
1. Technical Innovation - "How novel and innovative is the AI solution?"
2. Code Quality - "Is the code well-structured and documented?"
3. Presentation - "Clear explanation and demo capability?"

**User Journey:**
- User fills project info
- User answers 5 questions (required ones must be filled)
- User uploads files and provides links
- Admin reviews answers during evaluation
- Admin scores using the 3 criteria
- System stores all data for future reference

---

## 🔒 Important Notes

- **Questions are required**: Unless marked optional, users must answer all questions
- **File uploads**: Support common formats (PDF, images, docs)
- **Answers persist**: Once submitted, answers are stored and cannot be edited
- **Criteria scoring**: Each criterion can be scored 1-10
- **Suggestions**: Use provided suggestions as starting points and customize as needed

---

## 🐛 Troubleshooting

**Q: Questions not appearing during registration?**
- Ensure event has questions configured during creation
- Check that event status is "Active"
- Clear browser cache

**Q: Can't add a question?**
- Ensure question text is not empty
- Select a valid question type
- Check for duplicate questions

**Q: User skipped required questions?**
- System validates required questions on "Next" button
- Error message indicates which questions need answers
- User cannot proceed without completing required fields

**Q: Where to see user answers?**
- Go to Event Details → Applicants → Click "View"
- Answers display organized by question type
- Files available for download

---

## 📱 Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Create Event | Admin Dashboard → Events Manager | Set up new event with questions & criteria |
| Event Questions | CreateEventPage | Define registration questions |
| Evaluation Criteria | CreateEventPage | Define scoring criteria |
| Answer Questions | EventApplicationPage | Users answer during registration |
| View Answers | EventsManager → Event Detail | Admin reviews user answers |
| Evaluate | PitchEvaluation | Admin scores using criteria |

---

## 🚀 Next Steps

1. Create your first event with custom questions
2. Set meaningful evaluation criteria
3. Let users register and answer questions
4. Review answers before evaluation
5. Use criteria to fairly score participants

Enjoy the enhanced evaluation process! 🎉
