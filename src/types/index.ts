// ============================================================
// JANSAHAY - Complete Type Definitions
// ============================================================

// --- User & Profile ---
export interface User {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Profile {
  userId: string;
  name: string;
  age: number;
  location: string;
  state: string;
  occupation: string;
  education: string;
  income: number;
  incomeFormatted: string;
  gender?: string;
  category?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'hi';
  notifications: boolean;
  voiceInput: boolean;
  dataConsent: boolean;
}

// --- Services ---
export type ServiceCategory =
  | 'Education'
  | 'Employment'
  | 'Documents'
  | 'Healthcare'
  | 'Housing'
  | 'Senior Support'
  | 'Accessibility'
  | 'Family Support'
  | 'Financial Assistance';

export type MatchLevel = 'high' | 'medium' | 'low' | 'needs-verification' | 'not-eligible';

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  eligibility: ServiceRequirement[];
  requiredDocuments: string[];
  applicationSteps: ApplicationStep[];
  jurisdiction: string;
  source: Source;
  isDemo: boolean;
  tags: string[];
}

export interface ServiceRequirement {
  id: string;
  field: string;
  operator: 'equals' | 'less_than' | 'greater_than' | 'in' | 'contains' | 'between';
  value: string | number | string[] | number[];
  label: string;
  description: string;
}

export interface ApplicationStep {
  id: string;
  order: number;
  title: string;
  description: string;
  estimatedTime?: string;
}

export interface ServiceMatch {
  service: Service;
  matchLevel: MatchLevel;
  matchScore: number;
  matchReasons: MatchReason[];
  missingRequirements: EligibilityResult[];
  metRequirements: EligibilityResult[];
}

export interface MatchReason {
  field: string;
  reason: string;
  matched: boolean;
}

// --- Eligibility ---
export type EligibilityStatus = 'met' | 'not-met' | 'missing' | 'needs-verification';

export interface EligibilityResult {
  requirement: string;
  userValue: string | null;
  requiredValue: string;
  status: EligibilityStatus;
  explanation: string;
}

export interface EligibilityCheck {
  serviceId: string;
  serviceName: string;
  results: EligibilityResult[];
  overallScore: number;
  readyCount: number;
  totalCount: number;
  readinessPercentage: number;
  disclaimer: string;
}

// --- Documents ---
export type DocumentType =
  | 'income_certificate'
  | 'student_id'
  | 'marksheet'
  | 'aadhaar'
  | 'domicile_certificate'
  | 'pan_card'
  | 'passport'
  | 'birth_certificate'
  | 'caste_certificate'
  | 'other';

export type DocumentStatus = 'available' | 'missing' | 'expired' | 'needs-verification';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
  extractedFields: DocumentField[];
  matchedServices: DocumentServiceMatch[];
  verificationNote: string;
}

export interface DocumentField {
  field: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  verified: boolean;
}

export interface DocumentServiceMatch {
  serviceId: string;
  serviceName: string;
  matchLevel: 'high' | 'medium' | 'needs-verification';
  relevance: string;
}

export interface DocumentAnalysis {
  documentId: string;
  documentType: DocumentType;
  extractedFields: DocumentField[];
  matchedServices: DocumentServiceMatch[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
  verificationNote: string;
}

// --- Journey ---
export type JourneyStageId =
  | 'discover'
  | 'eligibility'
  | 'documents'
  | 'application'
  | 'verification'
  | 'tracking';

export type JourneyStageStatus = 'completed' | 'active' | 'warning' | 'pending';

export interface JourneyStage {
  id: JourneyStageId;
  label: string;
  status: JourneyStageStatus;
  subtitle: string;
}

export interface Journey {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  targetService: string;
  compatibility: number;
  stages: JourneyStage[];
  currentStage: JourneyStageId;
  readinessScore: number;
  readyCount: number;
  totalCount: number;
  requiredDocuments: string[];
  availableDocuments: string[];
  missingDocuments: string[];
  actionItems: ActionItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Applications ---
export type ApplicationStatus =
  | 'not-started'
  | 'preparing'
  | 'submitted'
  | 'under-review'
  | 'action-required'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface Application {
  id: string;
  journeyId: string;
  serviceId: string;
  serviceName: string;
  applicationId?: string;
  status: ApplicationStatus;
  submittedAt?: string;
  lastUpdated: string;
  nextAction?: string;
  isDemo: boolean;
  statusNote: string;
}

// --- Action Plan ---
export type ActionPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'blocked';

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: ActionPriority;
  dependencies: string[];
  relatedDocuments: string[];
  source?: string;
  dueDate?: string;
  journeyId?: string;
}

// --- Notifications ---
export type NotificationType =
  | 'action-required'
  | 'deadline'
  | 'missing-document'
  | 'journey-update'
  | 'ai-insight'
  | 'security-alert'
  | 'application-update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
}

// --- Reminders ---
export interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  relatedTo?: string;
  createdAt: string;
}

// --- Source & Trust ---
export type VerificationStatus = 'verified' | 'unverified' | 'demo' | 'unable-to-verify';

export interface Source {
  name: string;
  type: 'official' | 'semi-official' | 'community' | 'demo';
  officialUrl?: string;
  lastVerified?: string;
  verificationStatus: VerificationStatus;
  description?: string;
}

// --- Scam Detection ---
export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

export interface ScamAnalysis {
  inputText: string;
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: ScamIndicator[];
  recommendation: string;
  officialSourceCheck?: Source;
  disclaimer: string;
}

export interface ScamIndicator {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  found: boolean;
}

// --- Agent & Chat ---
export type MessageRole = 'user' | 'agent' | 'system';

export interface AgentMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  actions?: AgentMessageAction[];
  activitySteps?: AgentActivityStep[];
  serviceMatches?: ServiceMatch[];
  metadata?: Record<string, unknown>;
}

export interface AgentMessageAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary';
  action: string;
  data?: Record<string, unknown>;
}

export interface AgentActivityStep {
  id: string;
  label: string;
  status: 'done' | 'active' | 'pending';
}

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

export interface ExtractedUserInfo {
  age?: number;
  location?: string;
  state?: string;
  occupation?: string;
  education?: string;
  income?: number;
  intent?: string;
  category?: ServiceCategory;
}

// --- Knowledge Base / RAG ---
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: ServiceCategory;
  source: Source;
  metadata: Record<string, string>;
  chunks?: KnowledgeChunk[];
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, string>;
}

// --- Demo Data ---
export interface DemoState {
  user: User;
  profile: Profile;
  services: Service[];
  serviceMatches: ServiceMatch[];
  documents: Document[];
  journeys: Journey[];
  applications: Application[];
  actionItems: ActionItem[];
  notifications: Notification[];
  reminders: Reminder[];
  conversations: AgentMessage[];
  suspiciousMessage: string;
}

// --- i18n ---
export type Language = 'en' | 'hi';

export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}

// --- API Responses ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
