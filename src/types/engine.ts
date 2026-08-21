// ============================================================
// JANSAHAY — Engine Types
// CitizenProfile, Scheme, EligibilityResult, RankedMatch
// ============================================================

// ── Citizen Profile ──────────────────────────────────────────

export type KnownValue<T> = T;
export const UNKNOWN = 'UNKNOWN' as const;
export type MaybeKnown<T> = T | typeof UNKNOWN;

export type Gender = 'Male' | 'Female' | 'Other' | typeof UNKNOWN;
export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | typeof UNKNOWN;
export type DisabilityStatus = 'None' | 'Physical' | 'Visual' | 'Hearing' | 'Cognitive' | 'Multiple' | typeof UNKNOWN;
export type MaritalStatus = 'Single' | 'Married' | 'Widowed' | 'Divorced' | typeof UNKNOWN;
export type OccupationType = 'Student' | 'Employed' | 'Self-Employed' | 'Farmer' | 'Unemployed' | 'Retired' | 'Other' | typeof UNKNOWN;

export interface FamilyMember {
  relation: string;
  age?: number;
  occupation?: OccupationType;
  income?: number;
}

export interface CitizenProfile {
  // Identity
  name: MaybeKnown<string>;
  age: MaybeKnown<number>;
  gender: Gender;
  state: MaybeKnown<string>;
  district: MaybeKnown<string>;

  // Socioeconomic
  annualIncome: MaybeKnown<number>;      // family annual income in INR
  category: Category;
  disability: DisabilityStatus;
  maritalStatus: MaritalStatus;
  occupation: OccupationType;
  landHolding: MaybeKnown<number>;      // acres, for farmers

  // Education
  education: MaybeKnown<string>;        // e.g. 'B.Tech', '12th', '10th'
  course: MaybeKnown<string>;           // current course name
  institution: MaybeKnown<string>;

  // Family
  familySize: MaybeKnown<number>;
  familyMembers: FamilyMember[];

  // Life events (recent significant changes)
  lifeEvents: string[];                 // e.g. ['job_loss', 'new_student', 'crop_damage']

  // Documents available (document type IDs)
  availableDocuments: string[];

  // Free-form context from conversation
  rawContext: string;

  // Meta
  lastUpdated: string;
}

export function createEmptyProfile(): CitizenProfile {
  return {
    name: UNKNOWN,
    age: UNKNOWN,
    gender: UNKNOWN,
    state: UNKNOWN,
    district: UNKNOWN,
    annualIncome: UNKNOWN,
    category: UNKNOWN,
    disability: UNKNOWN,
    maritalStatus: UNKNOWN,
    occupation: UNKNOWN,
    landHolding: UNKNOWN,
    education: UNKNOWN,
    course: UNKNOWN,
    institution: UNKNOWN,
    familySize: UNKNOWN,
    familyMembers: [],
    lifeEvents: [],
    availableDocuments: [],
    rawContext: '',
    lastUpdated: new Date().toISOString(),
  };
}

// ── Scheme Model ─────────────────────────────────────────────

export type SchemeScope = 'Central' | 'State';
export type SchemeCategory =
  | 'Education'
  | 'Healthcare'
  | 'Employment'
  | 'Housing'
  | 'Agriculture'
  | 'Social Security'
  | 'Women & Child'
  | 'Senior Citizens'
  | 'Disability'
  | 'Financial Inclusion';

export type RuleOperator =
  | 'eq'          // equals
  | 'neq'         // not equals
  | 'lt'          // less than
  | 'lte'         // less than or equal
  | 'gt'          // greater than
  | 'gte'         // greater than or equal
  | 'between'     // between [min, max] inclusive
  | 'in'          // value in array
  | 'contains'    // array contains value
  | 'any';        // always passes (informational requirement only)

export interface EligibilityRule {
  id: string;
  field: keyof CitizenProfile | 'document';  // profile field or document check
  operator: RuleOperator;
  value: string | number | boolean | string[] | number[];
  label: string;            // Human-readable label, e.g. "Age 18–35"
  description: string;      // Detailed explanation
  documentId?: string;      // For document checks: which doc is needed
  critical: boolean;        // If false, missing info = NEEDS_VERIFICATION not NOT_ELIGIBLE
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  scope: SchemeScope;
  state?: string;           // Only for state-specific schemes
  category: SchemeCategory;
  description: string;
  benefits: string[];
  eligibilityRules: EligibilityRule[];
  requiredDocuments: string[];
  officialSource: string;
  officialApplicationUrl: string;
  lastVerified: string;     // ISO date or 'UNVERIFIED'
  keywords: string[];
  isDemo: boolean;          // true = seed data, not yet verified against live govt portal
}

// ── Eligibility Result ────────────────────────────────────────

export type CriterionStatus = 'PASS' | 'FAIL' | 'UNKNOWN' | 'NEEDS_VERIFICATION';

export interface CriterionResult {
  ruleId: string;
  label: string;
  description: string;
  status: CriterionStatus;
  profileValue: string;     // What we know about the citizen
  requiredValue: string;    // What the scheme requires
  explanation: string;      // Human-readable explanation of the result
}

export type EligibilityVerdict =
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'MISSING_INFORMATION'
  | 'NEEDS_VERIFICATION';

export interface EligibilityResult {
  schemeId: string;
  verdict: EligibilityVerdict;
  readinessScore: number;           // 0–100: % of criteria passing
  criteriaResults: CriterionResult[];
  passedCount: number;
  failedCount: number;
  unknownCount: number;
  verificationCount: number;
  missingDocuments: string[];
  availableDocuments: string[];
  explanation: string;              // One-line summary for UI
  disclaimer: string;
}

// ── Ranked Match ─────────────────────────────────────────────

export type MatchTier = 'high' | 'medium' | 'low' | 'missing_info' | 'not_eligible';

export interface RankedSchemeMatch {
  scheme: Scheme;
  eligibility: EligibilityResult;
  tier: MatchTier;
  displayScore: number;             // 0–100 for UI bar
  whyShown: string;                 // "Shown because you match 5 of 6 criteria"
}
