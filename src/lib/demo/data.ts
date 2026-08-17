// ============================================================
// JANSAHAY - Complete Demo Data
// All services are clearly marked as DEMO DATA
// ============================================================

import type {
  User,
  Profile,
  Service,
  ServiceMatch,
  Document,
  Journey,
  Application,
  ActionItem,
  Notification,
  Reminder,
  AgentMessage,
  DemoState,
  EligibilityResult,
  ScamAnalysis,
} from '@/types';

// --- Demo User ---
export const demoUser: User = {
  id: 'demo-user-001',
  name: 'Rohit Sharma',
  email: 'rohit.demo@jansahay.in',
  isDemo: true,
  createdAt: '2026-08-01T10:00:00Z',
};

export const demoProfile: Profile = {
  userId: 'demo-user-001',
  name: 'Rohit Sharma',
  age: 19,
  location: 'Jaipur, Rajasthan',
  state: 'Rajasthan',
  occupation: 'Student',
  education: 'B.Tech Computer Science (Pursuing)',
  income: 200000,
  incomeFormatted: '₹2,00,000/year',
  gender: 'Male',
  category: 'General',
  preferences: {
    language: 'en',
    notifications: true,
    voiceInput: true,
    dataConsent: true,
  },
};

// --- Demo Services (9 services, clearly marked as DEMO) ---
export const demoServices: Service[] = [
  {
    id: 'svc-001',
    title: 'Student Education Assistance Program',
    description:
      'DEMO DATA — Financial assistance for students from economically weaker sections pursuing higher education. This program aims to reduce the financial burden on students and their families.',
    category: 'Education',
    eligibility: [
      { id: 'req-001', field: 'age', operator: 'between', value: [17, 25], label: 'Age 17–25', description: 'Applicant must be between 17 and 25 years of age' },
      { id: 'req-002', field: 'occupation', operator: 'equals', value: 'Student', label: 'Currently enrolled student', description: 'Must be a currently enrolled student' },
      { id: 'req-003', field: 'income', operator: 'less_than', value: 250000, label: 'Annual family income below ₹2.5 lakh', description: 'Family income must be below ₹2,50,000 per year' },
      { id: 'req-004', field: 'state', operator: 'equals', value: 'Rajasthan', label: 'Resident of Rajasthan', description: 'Must be a domicile of Rajasthan' },
      { id: 'req-005', field: 'document', operator: 'contains', value: 'domicile_certificate', label: 'Domicile certificate required', description: 'Valid domicile certificate of Rajasthan is mandatory' },
    ],
    requiredDocuments: ['Student ID Card', 'Income Certificate', '12th Marksheet', 'Aadhaar Card', 'Domicile Certificate'],
    applicationSteps: [
      { id: 'step-1', order: 1, title: 'Gather required documents', description: 'Collect all required documents including student ID, income certificate, marksheet, Aadhaar, and domicile certificate.', estimatedTime: '1–2 days' },
      { id: 'step-2', order: 2, title: 'Verify eligibility criteria', description: 'Ensure all eligibility requirements are met before applying.', estimatedTime: '30 minutes' },
      { id: 'step-3', order: 3, title: 'Submit online application', description: 'Fill and submit the application form through the official portal.', estimatedTime: '1 hour' },
      { id: 'step-4', order: 4, title: 'Track application status', description: 'Monitor your application status regularly and respond to any queries.', estimatedTime: 'Ongoing' },
    ],
    jurisdiction: 'State — Rajasthan',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only. Not an actual government scheme.',
    },
    isDemo: true,
    tags: ['education', 'scholarship', 'financial-aid', 'students'],
  },
  {
    id: 'svc-002',
    title: 'EWS Scholarship Application',
    description:
      'DEMO DATA — Scholarship program for students belonging to Economically Weaker Sections. Provides financial support for tuition fees, books, and living expenses during higher education.',
    category: 'Education',
    eligibility: [
      { id: 'req-006', field: 'income', operator: 'less_than', value: 300000, label: 'Annual family income below ₹3 lakh', description: 'Family income must be below ₹3,00,000 per year' },
      { id: 'req-007', field: 'occupation', operator: 'equals', value: 'Student', label: 'Currently enrolled student', description: 'Must be a currently enrolled student' },
      { id: 'req-008', field: 'education', operator: 'contains', value: 'B.Tech', label: 'Pursuing technical education', description: 'Must be pursuing recognized technical education' },
      { id: 'req-009', field: 'document', operator: 'contains', value: 'income_certificate', label: 'Income certificate required', description: 'Valid income certificate is mandatory' },
    ],
    requiredDocuments: ['Income Certificate', 'Student ID Card', '12th Marksheet', 'Aadhaar Card', 'EWS Certificate'],
    applicationSteps: [
      { id: 'step-5', order: 1, title: 'Obtain EWS certificate', description: 'Get EWS certificate from the relevant authority.', estimatedTime: '3–5 days' },
      { id: 'step-6', order: 2, title: 'Prepare application documents', description: 'Collect and organize all required documents.', estimatedTime: '1–2 days' },
      { id: 'step-7', order: 3, title: 'Apply through institution', description: 'Submit scholarship application through your educational institution.', estimatedTime: '1 day' },
      { id: 'step-8', order: 4, title: 'Await verification', description: 'Wait for document verification and approval.', estimatedTime: '2–4 weeks' },
    ],
    jurisdiction: 'Central Government',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['education', 'scholarship', 'ews', 'financial-aid'],
  },
  {
    id: 'svc-003',
    title: 'Subsidized Health Insurance',
    description:
      'DEMO DATA — Government-subsidized health insurance for low-income families. Covers hospitalization, outpatient treatment, and preventive care.',
    category: 'Healthcare',
    eligibility: [
      { id: 'req-010', field: 'income', operator: 'less_than', value: 500000, label: 'Annual family income below ₹5 lakh', description: 'Family income must be below ₹5,00,000 per year' },
      { id: 'req-011', field: 'document', operator: 'contains', value: 'aadhaar', label: 'Aadhaar card required', description: 'Valid Aadhaar card is mandatory' },
      { id: 'req-012', field: 'document', operator: 'contains', value: 'income_certificate', label: 'Income proof required', description: 'Income certificate or BPL card required' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Ration Card', 'Family Photo'],
    applicationSteps: [
      { id: 'step-9', order: 1, title: 'Visit nearest enrollment center', description: 'Locate the nearest Common Service Center.', estimatedTime: '1 day' },
      { id: 'step-10', order: 2, title: 'Submit documents', description: 'Provide required documents for verification.', estimatedTime: '30 minutes' },
      { id: 'step-11', order: 3, title: 'Receive insurance card', description: 'Collect your health insurance card after approval.', estimatedTime: '1–2 weeks' },
    ],
    jurisdiction: 'Central Government',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['healthcare', 'insurance', 'health', 'family'],
  },
  {
    id: 'svc-004',
    title: 'Housing Subsidy Scheme',
    description:
      'DEMO DATA — Housing subsidy for economically weaker sections to assist in building or purchasing a home. Interest subsidies on home loans.',
    category: 'Housing',
    eligibility: [
      { id: 'req-013', field: 'income', operator: 'less_than', value: 600000, label: 'Annual family income below ₹6 lakh', description: 'Family income must be below ₹6,00,000 per year' },
      { id: 'req-014', field: 'age', operator: 'greater_than', value: 21, label: 'Age above 21', description: 'Applicant must be at least 21 years old' },
      { id: 'req-015', field: 'document', operator: 'contains', value: 'aadhaar', label: 'Aadhaar required', description: 'Valid Aadhaar is mandatory' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Property Documents', 'Bank Account Details'],
    applicationSteps: [
      { id: 'step-12', order: 1, title: 'Check eligibility criteria', description: 'Verify all conditions are met.', estimatedTime: '30 minutes' },
      { id: 'step-13', order: 2, title: 'Apply through housing board', description: 'Submit application through state housing board.', estimatedTime: '1 day' },
      { id: 'step-14', order: 3, title: 'Document verification', description: 'Attend verification process.', estimatedTime: '2–3 weeks' },
    ],
    jurisdiction: 'Central & State',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['housing', 'subsidy', 'home', 'loan'],
  },
  {
    id: 'svc-005',
    title: 'Digital Skills Training Program',
    description:
      'DEMO DATA — Free digital literacy and skills training for youth. Covers programming, data science, and digital marketing with certification.',
    category: 'Employment',
    eligibility: [
      { id: 'req-016', field: 'age', operator: 'between', value: [18, 35], label: 'Age 18–35', description: 'Applicant must be between 18 and 35 years' },
      { id: 'req-017', field: 'education', operator: 'contains', value: '12th', label: 'Minimum 12th pass', description: 'Must have completed 12th standard or equivalent' },
    ],
    requiredDocuments: ['Aadhaar Card', '12th Marksheet', 'Passport Photo'],
    applicationSteps: [
      { id: 'step-15', order: 1, title: 'Register online', description: 'Create an account on the training portal.', estimatedTime: '15 minutes' },
      { id: 'step-16', order: 2, title: 'Select training module', description: 'Choose from available courses.', estimatedTime: '30 minutes' },
      { id: 'step-17', order: 3, title: 'Complete training', description: 'Attend and complete the training program.', estimatedTime: '3–6 months' },
    ],
    jurisdiction: 'Central Government',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['employment', 'skills', 'training', 'digital'],
  },
  {
    id: 'svc-006',
    title: 'Women Entrepreneurship Support',
    description:
      'DEMO DATA — Financial and mentorship support for women starting or expanding small businesses. Includes subsidized loans and training.',
    category: 'Financial Assistance',
    eligibility: [
      { id: 'req-018', field: 'gender', operator: 'equals', value: 'Male', label: 'Women only', description: 'Only female applicants are eligible' },
      { id: 'req-019', field: 'age', operator: 'greater_than', value: 18, label: 'Age above 18', description: 'Must be at least 18 years old' },
      { id: 'req-020', field: 'intent', operator: 'equals', value: 'business', label: 'Business intent', description: 'Must have a business plan or existing business' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Business Plan', 'Bank Account Details', 'Address Proof'],
    applicationSteps: [
      { id: 'step-18', order: 1, title: 'Prepare business plan', description: 'Create a detailed business plan.', estimatedTime: '1–2 weeks' },
      { id: 'step-19', order: 2, title: 'Apply at district office', description: 'Submit application at District Industries Centre.', estimatedTime: '1 day' },
    ],
    jurisdiction: 'Central & State',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['women', 'entrepreneurship', 'business', 'loan'],
  },
  {
    id: 'svc-007',
    title: 'Senior Citizen Pension',
    description:
      'DEMO DATA — Monthly pension for senior citizens above 60 years who do not have regular income from employment or other sources.',
    category: 'Senior Support',
    eligibility: [
      { id: 'req-021', field: 'age', operator: 'greater_than', value: 60, label: 'Age above 60', description: 'Must be 60 years or older' },
      { id: 'req-022', field: 'income', operator: 'less_than', value: 200000, label: 'Low income', description: 'Must have minimal or no regular income' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Age Proof', 'Bank Account Details', 'Income Certificate'],
    applicationSteps: [
      { id: 'step-20', order: 1, title: 'Visit block/tehsil office', description: 'Submit application at nearest block office.', estimatedTime: '1 day' },
      { id: 'step-21', order: 2, title: 'Verification', description: 'Field verification by officials.', estimatedTime: '2–4 weeks' },
    ],
    jurisdiction: 'State — Rajasthan',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['senior', 'pension', 'elderly'],
  },
  {
    id: 'svc-008',
    title: 'Rural Employment Guarantee',
    description:
      'DEMO DATA — Employment guarantee program providing up to 100 days of wage employment per year to rural households.',
    category: 'Employment',
    eligibility: [
      { id: 'req-023', field: 'location', operator: 'contains', value: 'rural', label: 'Rural resident', description: 'Must reside in a rural area' },
      { id: 'req-024', field: 'age', operator: 'greater_than', value: 18, label: 'Age above 18', description: 'Must be at least 18 years old' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Job Card', 'Bank Account Details'],
    applicationSteps: [
      { id: 'step-22', order: 1, title: 'Apply at Gram Panchayat', description: 'Submit application at local Gram Panchayat.', estimatedTime: '1 day' },
      { id: 'step-23', order: 2, title: 'Get Job Card', description: 'Receive job card after verification.', estimatedTime: '15 days' },
    ],
    jurisdiction: 'Central Government',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['employment', 'rural', 'wage', 'guarantee'],
  },
  {
    id: 'svc-009',
    title: 'Family Welfare Program',
    description:
      'DEMO DATA — Comprehensive welfare program for families below poverty line. Includes food security, healthcare, and education support.',
    category: 'Family Support',
    eligibility: [
      { id: 'req-025', field: 'income', operator: 'less_than', value: 150000, label: 'BPL family', description: 'Must be from a Below Poverty Line family' },
      { id: 'req-026', field: 'document', operator: 'contains', value: 'aadhaar', label: 'Aadhaar required', description: 'Family Aadhaar cards required' },
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Family Photo'],
    applicationSteps: [
      { id: 'step-24', order: 1, title: 'Apply at district office', description: 'Submit application at District Social Welfare Office.', estimatedTime: '1 day' },
      { id: 'step-25', order: 2, title: 'Home verification', description: 'Officials will conduct home visit.', estimatedTime: '1–2 weeks' },
    ],
    jurisdiction: 'Central & State',
    source: {
      name: 'DEMO SOURCE',
      type: 'demo',
      verificationStatus: 'demo',
      description: 'This is demo data for demonstration purposes only.',
    },
    isDemo: true,
    tags: ['family', 'welfare', 'bpl', 'food-security'],
  },
];

// --- Service Matches for Ananya ---
export const demoServiceMatches: ServiceMatch[] = [
  {
    service: demoServices[0], // Student Education Assistance
    matchLevel: 'high',
    matchScore: 92,
    matchReasons: [
      { field: 'Age', reason: 'You are 19 years old, within the 17–25 age range', matched: true },
      { field: 'Occupation', reason: 'You are a currently enrolled student', matched: true },
      { field: 'Income', reason: 'Family income ₹2L is below the ₹2.5L threshold', matched: true },
      { field: 'State', reason: 'You reside in Rajasthan', matched: true },
      { field: 'Domicile', reason: 'Domicile certificate is required but not yet available', matched: false },
    ],
    metRequirements: [
      { requirement: 'Age 17–25', userValue: '19', requiredValue: '17–25', status: 'met', explanation: 'Your age meets this requirement' },
      { requirement: 'Student status', userValue: 'Student', requiredValue: 'Currently enrolled', status: 'met', explanation: 'You are a currently enrolled student' },
      { requirement: 'Family income', userValue: '₹2,00,000', requiredValue: 'Below ₹2,50,000', status: 'met', explanation: 'Your family income is within the limit' },
      { requirement: 'State residency', userValue: 'Rajasthan', requiredValue: 'Rajasthan', status: 'met', explanation: 'You are a resident of Rajasthan' },
    ],
    missingRequirements: [
      { requirement: 'Domicile certificate', userValue: null, requiredValue: 'Valid domicile certificate', status: 'missing', explanation: 'Domicile certificate is required but not uploaded' },
    ],
  },
  {
    service: demoServices[1], // EWS Scholarship
    matchLevel: 'high',
    matchScore: 85,
    matchReasons: [
      { field: 'Income', reason: 'Family income ₹2L is below the ₹3L threshold', matched: true },
      { field: 'Student', reason: 'You are a currently enrolled student', matched: true },
      { field: 'Education', reason: 'Pursuing B.Tech — qualifies as technical education', matched: true },
      { field: 'EWS Certificate', reason: 'EWS certificate status needs verification', matched: false },
    ],
    metRequirements: [
      { requirement: 'Family income', userValue: '₹2,00,000', requiredValue: 'Below ₹3,00,000', status: 'met', explanation: 'Your family income qualifies' },
      { requirement: 'Student status', userValue: 'Student', requiredValue: 'Currently enrolled', status: 'met', explanation: 'You are a currently enrolled student' },
      { requirement: 'Technical education', userValue: 'B.Tech CS', requiredValue: 'Technical education', status: 'met', explanation: 'B.Tech qualifies as technical education' },
    ],
    missingRequirements: [
      { requirement: 'Income certificate', userValue: 'Uploaded', requiredValue: 'Valid income certificate', status: 'needs-verification', explanation: 'Income certificate uploaded but needs verification' },
    ],
  },
  {
    service: demoServices[2], // Health Insurance
    matchLevel: 'medium',
    matchScore: 70,
    matchReasons: [
      { field: 'Income', reason: 'Family income ₹2L is below the ₹5L threshold', matched: true },
      { field: 'Aadhaar', reason: 'Aadhaar card is available', matched: true },
      { field: 'Ration Card', reason: 'Ration card status unknown', matched: false },
    ],
    metRequirements: [
      { requirement: 'Family income', userValue: '₹2,00,000', requiredValue: 'Below ₹5,00,000', status: 'met', explanation: 'Income is within the limit' },
      { requirement: 'Aadhaar card', userValue: 'Available', requiredValue: 'Valid Aadhaar', status: 'met', explanation: 'Aadhaar card is on file' },
    ],
    missingRequirements: [
      { requirement: 'Ration Card', userValue: null, requiredValue: 'Valid ration card', status: 'missing', explanation: 'Ration card has not been uploaded' },
    ],
  },
];

// --- Demo Documents ---
export const demoDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Student ID Card',
    type: 'student_id',
    status: 'available',
    fileName: 'Student_ID_2026.pdf',
    fileSize: 245000,
    uploadedAt: '2026-08-05T14:30:00Z',
    extractedFields: [
      { field: 'Name', value: 'Rohit Sharma', confidence: 'high', verified: true },
      { field: 'Student ID', value: 'NSUT2026CS042', confidence: 'high', verified: true },
      { field: 'Institution', value: 'NSUT Delhi', confidence: 'high', verified: true },
      { field: 'Program', value: 'B.Tech Computer Science', confidence: 'high', verified: true },
    ],
    matchedServices: [
      { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms student enrollment status' },
      { serviceId: 'svc-002', serviceName: 'EWS Scholarship', matchLevel: 'high', relevance: 'Confirms student enrollment status' },
    ],
    verificationNote: 'Information extracted from document. Validity requires independent verification.',
  },
  {
    id: 'doc-002',
    name: 'Income Certificate',
    type: 'income_certificate',
    status: 'available',
    fileName: 'Income_Cert_2023.pdf',
    fileSize: 312000,
    uploadedAt: '2026-08-10T09:15:00Z',
    extractedFields: [
      { field: 'Name', value: 'Rohit Sharma', confidence: 'high', verified: true },
      { field: 'Income', value: '₹2,00,000', confidence: 'high', verified: true },
      { field: 'Issuing Authority', value: 'Tehsildar', confidence: 'high', verified: true },
      { field: 'Date', value: '2023-10-12', confidence: 'high', verified: true },
    ],
    matchedServices: [
      { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms family income level' },
      { serviceId: 'svc-002', serviceName: 'EWS Scholarship', matchLevel: 'high', relevance: 'Confirms EWS eligibility' },
      { serviceId: 'svc-004', serviceName: 'Housing Subsidy Scheme', matchLevel: 'needs-verification', relevance: 'Income qualifies but age requirement not met' },
    ],
    verificationNote: 'Information extracted from document. Digital signature not found. Manual verification might be required for high-stakes services.',
  },
  {
    id: 'doc-003',
    name: '12th Marksheet',
    type: 'marksheet',
    status: 'available',
    fileName: '12th_Marksheet_2024.pdf',
    fileSize: 567000,
    uploadedAt: '2026-08-03T11:45:00Z',
    extractedFields: [
      { field: 'Name', value: 'Rohit Sharma', confidence: 'high', verified: true },
      { field: 'Board', value: 'CBSE', confidence: 'high', verified: true },
      { field: 'Percentage', value: '91.4%', confidence: 'high', verified: true },
      { field: 'Year', value: '2024', confidence: 'high', verified: true },
    ],
    matchedServices: [
      { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms academic qualification' },
      { serviceId: 'svc-005', serviceName: 'Digital Skills Training', matchLevel: 'medium', relevance: 'Confirms minimum education' },
    ],
    verificationNote: 'Information extracted from document. Validity requires independent verification.',
  },
  {
    id: 'doc-004',
    name: 'Aadhaar Card',
    type: 'aadhaar',
    status: 'available',
    fileName: 'Aadhaar_Card.pdf',
    fileSize: 189000,
    uploadedAt: '2026-08-01T16:00:00Z',
    extractedFields: [
      { field: 'Name', value: 'Rohit Sharma', confidence: 'high', verified: true },
      { field: 'Aadhaar Number', value: 'XXXX XXXX 4521', confidence: 'high', verified: true },
      { field: 'Address', value: 'Jaipur, Rajasthan', confidence: 'high', verified: true },
      { field: 'DOB', value: '2007-03-15', confidence: 'high', verified: true },
    ],
    matchedServices: [
      { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Identity and address verification' },
      { serviceId: 'svc-003', serviceName: 'Subsidized Health Insurance', matchLevel: 'high', relevance: 'Required identity document' },
    ],
    verificationNote: 'Information extracted from document. Aadhaar number partially masked for security.',
  },
  {
    id: 'doc-005',
    name: 'Domicile Certificate',
    type: 'domicile_certificate',
    status: 'missing',
    extractedFields: [],
    matchedServices: [
      { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Required to prove state residency' },
    ],
    verificationNote: 'Document not yet uploaded.',
  },
];

// --- Demo Journey ---
export const demoJourneys: Journey[] = [
  {
    id: 'journey-001',
    userId: 'demo-user-001',
    serviceId: 'svc-001',
    serviceName: 'Student Education Assistance Program',
    targetService: 'Education Assistance',
    compatibility: 92,
    stages: [
      { id: 'discover', label: 'DISCOVER', status: 'completed', subtitle: '3 services found' },
      { id: 'eligibility', label: 'ELIGIBILITY', status: 'completed', subtitle: '2 potential matches' },
      { id: 'documents', label: 'DOCUMENTS', status: 'warning', subtitle: '4 / 5 ready' },
      { id: 'application', label: 'APPLICATION', status: 'pending', subtitle: 'Not started' },
      { id: 'verification', label: 'VERIFICATION', status: 'pending', subtitle: 'Not started' },
      { id: 'tracking', label: 'TRACKING', status: 'pending', subtitle: 'Not started' },
    ],
    currentStage: 'documents',
    readinessScore: 78,
    readyCount: 4,
    totalCount: 5,
    requiredDocuments: ['Student ID Card', 'Income Certificate', '12th Marksheet', 'Aadhaar Card', 'Domicile Certificate'],
    availableDocuments: ['Student ID Card', 'Income Certificate', '12th Marksheet', 'Aadhaar Card'],
    missingDocuments: ['Domicile Certificate'],
    actionItems: [
      {
        id: 'action-001',
        title: 'Obtain Domicile Certificate',
        description: 'Apply for domicile certificate from the Tehsildar office or through e-Mitra portal. This document is required to prove Rajasthan residency.',
        status: 'pending',
        priority: 'urgent',
        dependencies: [],
        relatedDocuments: ['Aadhaar Card'],
        source: 'Required for Student Education Assistance Program',
        dueDate: '2026-09-01',
      },
      {
        id: 'action-002',
        title: 'Verify Income Certificate',
        description: 'Your income certificate was issued in 2023. Some services may require a certificate less than 6 months old. Consider obtaining an updated certificate.',
        status: 'pending',
        priority: 'high',
        dependencies: [],
        relatedDocuments: ['Income Certificate'],
        source: 'Recommended for application strength',
      },
      {
        id: 'action-003',
        title: 'Complete online application form',
        description: 'Once all documents are ready, fill the application form through the designated portal.',
        status: 'blocked',
        priority: 'medium',
        dependencies: ['action-001'],
        relatedDocuments: ['Student ID Card', 'Income Certificate', '12th Marksheet', 'Aadhaar Card', 'Domicile Certificate'],
      },
    ],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-17T08:00:00Z',
  },
];

// --- Demo Applications ---
export const demoApplications: Application[] = [
  {
    id: 'app-001',
    journeyId: 'journey-001',
    serviceId: 'svc-002',
    serviceName: 'EWS Scholarship Application',
    applicationId: 'EWS-2026-RJ-00421',
    status: 'under-review',
    submittedAt: '2026-08-12T14:30:00Z',
    lastUpdated: '2026-08-15T09:00:00Z',
    nextAction: 'Awaiting document verification',
    isDemo: true,
    statusNote: 'DEMO STATUS — This is simulated application tracking for demonstration purposes only. Not a real government application status.',
  },
];

// --- Demo Action Items ---
export const demoActionItems: ActionItem[] = [
  {
    id: 'action-001',
    title: 'Obtain Domicile Certificate',
    description: 'Apply for domicile certificate from the Tehsildar office or through e-Mitra portal. Required to prove Rajasthan residency for education assistance.',
    status: 'pending',
    priority: 'urgent',
    dependencies: [],
    relatedDocuments: ['Aadhaar Card'],
    source: 'Student Education Assistance Program',
    dueDate: '2026-09-01',
    journeyId: 'journey-001',
  },
  {
    id: 'action-002',
    title: 'Verify Income Certificate',
    description: 'Income certificate issued in 2023 may need renewal. Consider obtaining a fresh certificate for stronger application.',
    status: 'pending',
    priority: 'high',
    dependencies: [],
    relatedDocuments: ['Income Certificate'],
    source: 'General recommendation',
    journeyId: 'journey-001',
  },
  {
    id: 'action-003',
    title: 'Prepare application form',
    description: 'Complete the online application form for Student Education Assistance. Requires all documents to be ready.',
    status: 'blocked',
    priority: 'medium',
    dependencies: ['action-001', 'action-002'],
    relatedDocuments: ['Student ID Card', 'Income Certificate', '12th Marksheet', 'Aadhaar Card', 'Domicile Certificate'],
    journeyId: 'journey-001',
  },
  {
    id: 'action-004',
    title: 'Track EWS Scholarship status',
    description: 'Check the status of your EWS Scholarship application (EWS-2026-RJ-00421) submitted on Aug 12.',
    status: 'in-progress',
    priority: 'medium',
    dependencies: [],
    relatedDocuments: [],
    journeyId: 'journey-001',
  },
  {
    id: 'action-005',
    title: 'Explore Health Insurance options',
    description: 'You may be eligible for subsidized health insurance. Review the requirements and consider applying.',
    status: 'pending',
    priority: 'low',
    dependencies: [],
    relatedDocuments: ['Aadhaar Card', 'Income Certificate'],
  },
];

// --- Demo Notifications ---
export const demoNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'action-required',
    title: 'Action Required',
    description: 'One document is missing from your active journey. Obtain your Domicile Certificate to proceed.',
    read: false,
    createdAt: '2026-08-17T08:00:00Z',
    actionUrl: '/documents',
    actionLabel: 'View Documents',
  },
  {
    id: 'notif-002',
    type: 'application-update',
    title: 'Application Update',
    description: 'Your EWS Scholarship application (EWS-2026-RJ-00421) is under review. No action needed at this time.',
    read: false,
    createdAt: '2026-08-15T09:00:00Z',
    actionUrl: '/tracker',
    actionLabel: 'View Tracker',
  },
  {
    id: 'notif-003',
    type: 'ai-insight',
    title: 'Opportunity Identified',
    description: 'Your uploaded income certificate may be useful for 2 additional services. Review potential matches.',
    read: true,
    createdAt: '2026-08-14T11:30:00Z',
    actionUrl: '/discover',
    actionLabel: 'View Matches',
  },
  {
    id: 'notif-004',
    type: 'journey-update',
    title: 'Journey Progress',
    description: 'Your education assistance journey is 78% ready. Complete remaining steps to submit your application.',
    read: true,
    createdAt: '2026-08-12T15:00:00Z',
    actionUrl: '/journeys/journey-001',
    actionLabel: 'View Journey',
  },
];

// --- Demo Reminders ---
export const demoReminders: Reminder[] = [
  {
    id: 'reminder-001',
    title: 'Obtain Domicile Certificate',
    description: 'Visit Tehsildar office or e-Mitra portal',
    dueDate: '2026-09-01T00:00:00Z',
    completed: false,
    relatedTo: 'action-001',
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'reminder-002',
    title: 'Check EWS Scholarship status',
    description: 'Follow up on application EWS-2026-RJ-00421',
    dueDate: '2026-08-25T00:00:00Z',
    completed: false,
    relatedTo: 'action-004',
    createdAt: '2026-08-12T14:30:00Z',
  },
];

// --- Demo Agent Conversation ---
export const demoConversation: AgentMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: "I'm a student from Rajasthan. My family income is ₹2 lakh. I need help with education.",
    timestamp: '2026-08-17T10:00:00Z',
  },
  {
    id: 'msg-002',
    role: 'agent',
    content: "Based on your profile, I found 3 potential matches. I've analyzed your situation and identified education assistance programs you may be eligible for.",
    timestamp: '2026-08-17T10:00:30Z',
    actions: [
      { id: 'act-001', label: 'View Matches', type: 'primary', action: 'navigate', data: { url: '/discover/results' } },
      { id: 'act-002', label: 'Build Journey', type: 'secondary', action: 'journey', data: { serviceId: 'svc-001' } },
    ],
    activitySteps: [
      { id: 'step-1', label: 'Understanding situation', status: 'done' },
      { id: 'step-2', label: 'Searching knowledge base', status: 'done' },
      { id: 'step-3', label: 'Comparing requirements', status: 'done' },
      { id: 'step-4', label: 'Checking documents', status: 'done' },
      { id: 'step-5', label: 'Building recommendation', status: 'done' },
    ],
  },
];

// --- Demo Scam Analysis ---
export const demoScamAnalysis: ScamAnalysis = {
  inputText: 'Congratulations! Pay ₹500 to activate your government benefit. Send money to UPI: govt.benefit@paytm. Hurry, offer expires today!',
  riskLevel: 'high',
  riskScore: 95,
  indicators: [
    { type: 'Payment Request', description: 'Message requests payment (₹500) to "activate" a benefit. Legitimate government services never require advance payment for enrollment.', severity: 'high', found: true },
    { type: 'Urgency Tactics', description: 'Uses urgency language ("Hurry, offer expires today") to pressure immediate action. This is a common scam tactic.', severity: 'high', found: true },
    { type: 'Unofficial Payment Channel', description: 'Directs to UPI address (govt.benefit@paytm) which does not appear to be an official government payment channel.', severity: 'high', found: true },
    { type: 'Vague Benefit Claim', description: 'Does not specify which government benefit or scheme. Legitimate notifications always reference specific scheme names.', severity: 'medium', found: true },
    { type: 'Impersonation', description: 'May be impersonating a government authority. Official communications come through registered channels.', severity: 'medium', found: true },
    { type: 'Sensitive Information', description: 'No explicit request for passwords or OTPs detected.', severity: 'low', found: false },
  ],
  recommendation: 'DO NOT make any payment. DO NOT click any links. DO NOT share personal information. This message displays multiple characteristics of a financial scam. Report this message to the Cyber Crime Portal (cybercrime.gov.in) or call 1930.',
  officialSourceCheck: {
    name: 'Verification Attempted',
    type: 'official',
    verificationStatus: 'unable-to-verify',
    description: 'JANSAHAY could not find any official government scheme matching the description in this message.',
  },
  disclaimer: 'This analysis is based on pattern recognition and known scam indicators. JANSAHAY cannot guarantee absolute accuracy. When in doubt, always verify through official government channels.',
};

// --- Demo Suspicious Message ---
export const demoSuspiciousMessage = 'Congratulations! Pay ₹500 to activate your government benefit. Send money to UPI: govt.benefit@paytm. Hurry, offer expires today!';

// --- Demo Agent Activity Steps ---
export const demoAgentSteps = [
  { id: 'step-1', label: 'Understanding situation', status: 'done' as const },
  { id: 'step-2', label: 'Searching knowledge base', status: 'done' as const },
  { id: 'step-3', label: 'Comparing requirements', status: 'done' as const },
  { id: 'step-4', label: 'Checking documents', status: 'done' as const },
  { id: 'step-5', label: 'Building recommendation', status: 'done' as const },
];

// --- Complete Demo State ---
export const demoState: DemoState = {
  user: demoUser,
  profile: demoProfile,
  services: demoServices,
  serviceMatches: demoServiceMatches,
  documents: demoDocuments,
  journeys: demoJourneys,
  applications: demoApplications,
  actionItems: demoActionItems,
  notifications: demoNotifications,
  reminders: demoReminders,
  conversations: demoConversation,
  suspiciousMessage: demoSuspiciousMessage,
};

// --- Helper functions ---
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getAvailableDocuments(): Document[] {
  return demoDocuments.filter((d) => d.status === 'available');
}

export function getMissingDocuments(): Document[] {
  return demoDocuments.filter((d) => d.status === 'missing');
}

export function getUnreadNotifications(): Notification[] {
  return demoNotifications.filter((n) => !n.read);
}

export function calculateReadiness(journey: Journey): number {
  if (journey.totalCount === 0) return 0;
  return Math.round((journey.readyCount / journey.totalCount) * 100);
}
