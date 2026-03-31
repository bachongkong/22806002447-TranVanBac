# Database Schema Reference

## Collections

### users
```js
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String (hidden),
  role: 'candidate' | 'hr' | 'admin',
  isEmailVerified: Boolean,
  status: 'active' | 'blocked',
  profile: {
    fullName: String,
    avatar: String,
    phone: String,
    address: String,
    // Candidate
    skills: [String],
    education: [{ school, degree, field, from, to }],
    experience: [{ company, position, from, to, description }],
    portfolioLinks: [String],
    expectedSalary: Number,
    preferredLocation: String,
    // HR
    roleTitle: String,
  },
  companyId: ObjectId -> Company (null neu candidate),
  refreshToken: String (hidden),
  createdAt, updatedAt
}
```

### companies
```js
{
  _id: ObjectId,
  name: String,
  logo: String,
  description: String,
  website: String,
  industry: String,
  companySize: String,
  location: String,
  socialLinks: { linkedin, facebook },
  status: 'pending' | 'approved' | 'rejected',
  hrMembers: [ObjectId -> User],
  createdBy: ObjectId -> User,
  createdAt, updatedAt
}
```

### jobs
```js
{
  _id: ObjectId,
  companyId: ObjectId -> Company,
  createdByHR: ObjectId -> User,
  title: String,
  description: String,
  requirements: String,
  benefits: String,
  salaryRange: { min, max },
  location: String,
  employmentType: String,
  experienceLevel: String,
  skills: [String],
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'closed',
  expiresAt: Date,
  createdAt, updatedAt
}
// Indexes: text(title, description, skills), compound(status, createdAt)
```

### applications
```js
{
  _id: ObjectId,
  candidateId: ObjectId -> User,
  jobId: ObjectId -> Job,
  companyId: ObjectId -> Company,
  cvId: ObjectId -> CV,
  coverLetter: String,
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'offered' | 'hired' | 'rejected' | 'withdrawn',
  statusHistory: [            // EMBEDDED
    { status, changedBy, changedAt, note }
  ],
  appliedAt: Date,
  createdAt, updatedAt
}
// Indexes: unique(candidateId, jobId)
```

### cvs
```js
{
  _id: ObjectId,
  candidateId: ObjectId -> User,
  title: String,
  fileUrl: String,
  isDefault: Boolean,
  sourceType: 'upload' | 'builder',
  parsedData: {               // EMBEDDED (from OCR)
    summary, skills, education, experience, projects
  },
  createdAt, updatedAt
}
```

### interviews
```js
{
  _id: ObjectId,
  applicationId: ObjectId -> Application,
  roundNumber: Number,
  scheduledAt: Date,
  interviewerIds: [ObjectId -> User],
  type: 'online' | 'offline',
  meetingLink: String,
  location: String,
  notes: String,
  result: String,
  createdAt, updatedAt
}
```

### notifications
```js
{
  _id: ObjectId,
  userId: ObjectId -> User,
  type: String,
  title: String,
  message: String,
  isRead: Boolean,
  data: Mixed,
  createdAt, updatedAt
}
// Indexes: compound(userId, isRead, createdAt)
```

### conversations & messages
```js
// conversations
{ _id, participants: [ObjectId -> User], lastMessage, lastMessageAt, createdAt, updatedAt }

// messages
{ _id, conversationId -> Conversation, senderId -> User, content, isRead, createdAt, updatedAt }
// Indexes: compound(conversationId, createdAt)
```

## Chien luoc Reference vs Embed

| Quan he | Chien luoc | Ly do |
|---------|-----------|-------|
| Application -> Job/User/CV | **Reference** | Du lieu lon, can query rieng |
| Job -> Company | **Reference** | Company co nhieu jobs |
| HR -> Company | **Reference** | Company co nhieu HR |
| Application.statusHistory | **Embed** | Gan chat, chi doc cung application |
| CV.parsedData | **Embed** | Gan chat, khong query rieng |
| User.profile | **Embed** | Luon doc cung user |
