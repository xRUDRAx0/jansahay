export type ResourceCategory = 'Government Services' | 'Schemes & Benefits' | 'Education' | 'Farmers' | 'Citizen Rights & Safety';

export interface ResourceData {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  isOfficial: boolean;
  whoIsItFor: string;
  benefits: string;
  eligibility: string;
  requiredDocuments: string[];
  howToApply: string;
  officialSource: string;
  lastVerified: string;
  targetKeywords: string[]; // For personalized matching
}

export const RESOURCES_DB: ResourceData[] = [
  {
    id: 'res-aadhaar',
    name: 'Aadhaar Card Update',
    description: 'Update your demographic or biometric details in Aadhaar.',
    category: 'Government Services',
    isOfficial: true,
    whoIsItFor: 'Any Indian citizen or resident needing to update their Aadhaar.',
    benefits: 'Maintains accurate identity records required for almost all government schemes.',
    eligibility: 'Must hold a valid Aadhaar number.',
    requiredDocuments: ['Proof of Identity (POI)', 'Proof of Address (POA)'],
    howToApply: '1. Visit myAadhaar portal. 2. Login with OTP. 3. Select Update Demographics. 4. Upload documents. 5. Pay ₹50 fee.',
    officialSource: 'https://myaadhaar.uidai.gov.in/',
    lastVerified: '2023-11-01',
    targetKeywords: ['all']
  },
  {
    id: 'res-income-cert',
    name: 'Income Certificate',
    description: 'Official document certifying the annual income of an individual or family.',
    category: 'Government Services',
    isOfficial: true,
    whoIsItFor: 'Students, farmers, and citizens applying for subsidies, EWS quota, or scholarships.',
    benefits: 'Required to prove eligibility for low-income schemes (like EWS, PM-KISAN, CSSS).',
    eligibility: 'Must be an Indian citizen. Income must be certified by local Tehsildar or Revenue Officer.',
    requiredDocuments: ['Aadhaar Card', 'Salary Slip / ITR / Affidavit', 'Recent Passport Photo'],
    howToApply: 'Apply via your State\'s e-District portal or visit the nearest CSC (Common Service Centre).',
    officialSource: 'State e-District Portals',
    lastVerified: '2023-10-15',
    targetKeywords: ['student', 'farmer', 'low income', 'scholarship']
  },
  {
    id: 'res-pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year for landholding farmer families.',
    category: 'Farmers',
    isOfficial: true,
    whoIsItFor: 'Small and marginal farmers holding cultivable land.',
    benefits: '₹6,000 per year transferred directly to the bank account in 3 equal installments.',
    eligibility: 'Must own cultivable land. Excludes institutional landholders, high-income earners, and taxpayers.',
    requiredDocuments: ['Aadhaar Card', 'Land holding papers (Khatauni)', 'Active Bank Account'],
    howToApply: '1. Visit PM-KISAN portal. 2. Click "New Farmer Registration". 3. Enter Aadhaar and details. 4. Submit.',
    officialSource: 'https://pmkisan.gov.in/',
    lastVerified: '2023-10-20',
    targetKeywords: ['farmer', 'agriculture']
  },
  {
    id: 'res-nsp',
    name: 'National Scholarship Portal (NSP)',
    description: 'One-stop portal for all government scholarships for students.',
    category: 'Education',
    isOfficial: true,
    whoIsItFor: 'School and college students seeking financial aid.',
    benefits: 'Direct benefit transfer of scholarship amounts.',
    eligibility: 'Varies by scheme (Pre-matric, Post-matric, Merit-cum-Means). Generally requires specific income/caste criteria.',
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Previous Year Marksheet'],
    howToApply: '1. Register on NSP. 2. Get OTR (One Time Registration). 3. Fill application. 4. Institute verifies it.',
    officialSource: 'https://scholarships.gov.in/',
    lastVerified: '2023-11-05',
    targetKeywords: ['student', 'education', 'scholarship']
  },
  {
    id: 'res-cybercrime',
    name: 'National Cyber Crime Reporting Portal',
    description: 'Report cyber crimes, financial frauds, and online scams.',
    category: 'Citizen Rights & Safety',
    isOfficial: true,
    whoIsItFor: 'Victims of online fraud, fake government scheme scams, or cyber harassment.',
    benefits: 'Immediate freezing of fraudulent transactions (if reported quickly via 1930) and police investigation.',
    eligibility: 'Any victim of a cybercrime.',
    requiredDocuments: ['Transaction Details', 'Screenshots of fraud', 'ID Proof'],
    howToApply: 'Call 1930 immediately for financial fraud, or file a complaint at cybercrime.gov.in.',
    officialSource: 'https://cybercrime.gov.in/',
    lastVerified: '2023-10-30',
    targetKeywords: ['fraud', 'scam', 'safety']
  },
  {
    id: 'res-ayushman',
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'Health insurance cover of up to ₹5 Lakh per family per year.',
    category: 'Schemes & Benefits',
    isOfficial: true,
    whoIsItFor: 'Poor, deprived rural families and identified occupational categories of urban workers.',
    benefits: 'Free cashless healthcare access up to ₹5 Lakh at empaneled hospitals.',
    eligibility: 'Must be listed in the SECC 2011 database or hold an active Antyodaya Anna Yojana (AAY) card.',
    requiredDocuments: ['Aadhaar Card', 'Ration Card'],
    howToApply: '1. Check eligibility on PMJAY portal. 2. Do eKYC. 3. Download Ayushman Card.',
    officialSource: 'https://pmjay.gov.in/',
    lastVerified: '2023-11-10',
    targetKeywords: ['healthcare', 'medical', 'senior', 'low income']
  }
];
