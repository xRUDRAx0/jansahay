import { Scheme, SchemeCategory } from '../../types/engine';

export const schemeDb: Scheme[] = [
  // --- EDUCATION ---
  {
    id: 'sch-001',
    name: 'PM Scholarships for Central Armed Police Forces (CAPF) children',
    ministry: 'Ministry of Home Affairs',
    scope: 'Central',
    category: 'Education',
    description: 'Scholarship scheme to encourage higher technical and professional education for the dependent wards and widows of CAPF and AR Personnel.',
    benefits: [
      'Scholarship of ₹36,000/- per annum for girls',
      'Scholarship of ₹30,000/- per annum for boys'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'lt',
        value: 600000,
        label: 'Annual Income < 6 Lakhs',
        description: 'Family annual income should be less than 6 lakhs.',
        critical: true
      },
      {
        id: 'r2',
        field: 'occupation',
        operator: 'eq',
        value: 'Student',
        label: 'Must be a student',
        description: 'Applicant must be currently enrolled in an educational institution.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Admission Proof', 'Dependent Certificate'],
    officialSource: 'https://scholarships.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['capf', 'scholarship', 'education', 'armed forces', 'students'],
    isDemo: true
  },
  {
    id: 'sch-002',
    name: 'Post-Matric Scholarship for SC Students',
    ministry: 'Ministry of Social Justice & Empowerment',
    scope: 'Central',
    category: 'Education',
    description: 'Financial assistance to Scheduled Caste students studying at post matriculation or post-secondary stage to enable them to complete their education.',
    benefits: [
      'Maintenance allowance',
      'Reimbursement of compulsory non-refundable fees',
      'Study tour charges'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'category',
        operator: 'in',
        value: ['SC'],
        label: 'Category is SC',
        description: 'Applicant must belong to the Scheduled Caste.',
        critical: true
      },
      {
        id: 'r2',
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        label: 'Annual Income <= 2.5 Lakhs',
        description: 'Family annual income must not exceed 2.5 Lakhs.',
        critical: true
      },
      {
        id: 'r3',
        field: 'occupation',
        operator: 'eq',
        value: 'Student',
        label: 'Must be a student',
        description: 'Applicant must be studying at post-matric level.',
        critical: true
      }
    ],
    requiredDocuments: ['Caste Certificate', 'Income Certificate', 'Aadhaar Card', 'Fee Receipt'],
    officialSource: 'https://scholarships.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['sc', 'scholarship', 'post-matric', 'education'],
    isDemo: true
  },
  {
    id: 'sch-003',
    name: 'National Means-cum-Merit Scholarship (NMMSS)',
    ministry: 'Ministry of Education',
    scope: 'Central',
    category: 'Education',
    description: 'Scholarships to meritorious students of economically weaker sections to arrest their drop out at class VIII and encourage them to continue study at secondary stage.',
    benefits: [
      'Scholarship of ₹12,000/- per annum'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'lte',
        value: 150000,
        label: 'Annual Income <= 1.5 Lakhs',
        description: 'Family annual income must not exceed 1.5 Lakhs.',
        critical: true
      },
      {
        id: 'r2',
        field: 'age',
        operator: 'between',
        value: [13, 17],
        label: 'Age between 13 and 17',
        description: 'Applicant must be in the age group relevant for classes IX to XII.',
        critical: true
      },
      {
        id: 'r3',
        field: 'occupation',
        operator: 'eq',
        value: 'Student',
        label: 'Must be a student',
        description: 'Applicant must be studying in a recognized school.',
        critical: true
      }
    ],
    requiredDocuments: ['Income Certificate', 'Aadhaar Card', 'School ID', 'Previous Year Marksheet'],
    officialSource: 'https://scholarships.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['nmmss', 'merit', 'scholarship', 'education', 'school'],
    isDemo: true
  },
  {
    id: 'sch-004',
    name: 'Central Sector Scheme of Scholarships (CSSS)',
    ministry: 'Ministry of Education',
    scope: 'Central',
    category: 'Education',
    description: 'Financial assistance to meritorious students from low income families to meet a part of their day-to-day expenses while pursuing higher studies.',
    benefits: [
      '₹10,000/- per annum at graduation level',
      '₹20,000/- per annum at post-graduation level'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'lte',
        value: 450000,
        label: 'Annual Income <= 4.5 Lakhs',
        description: 'Family income ceiling is Rs. 4.5 lakh per annum.',
        critical: true
      },
      {
        id: 'r2',
        field: 'occupation',
        operator: 'eq',
        value: 'Student',
        label: 'Must be a student',
        description: 'Must be pursuing higher education.',
        critical: true
      }
    ],
    requiredDocuments: ['Income Certificate', 'Aadhaar Card', 'Class 12 Marksheet', 'College Admission Proof'],
    officialSource: 'https://scholarships.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['csss', 'scholarship', 'higher education', 'merit'],
    isDemo: true
  },
  {
    id: 'sch-005',
    name: 'Rajasthan State Merit Scholarship',
    ministry: 'Department of Higher Education, Rajasthan',
    scope: 'State',
    state: 'Rajasthan',
    category: 'Education',
    description: 'State merit scholarship for meritorious students of Rajasthan pursuing higher education.',
    benefits: [
      'Financial assistance for higher studies',
      'Fee waivers'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'state',
        operator: 'eq',
        value: 'Rajasthan',
        label: 'Resident of Rajasthan',
        description: 'Applicant must be a domicile of Rajasthan.',
        critical: true
      },
      {
        id: 'r2',
        field: 'occupation',
        operator: 'eq',
        value: 'Student',
        label: 'Must be a student',
        description: 'Must be enrolled in a recognized institution.',
        critical: true
      },
      {
        id: 'r3',
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        label: 'Annual Income <= 2.5 Lakhs',
        description: 'Family income must not exceed 2.5 Lakhs.',
        critical: true
      }
    ],
    requiredDocuments: ['Domicile Certificate', 'Income Certificate', 'Marksheet', 'Aadhaar Card'],
    officialSource: 'https://hte.rajasthan.gov.in',
    officialApplicationUrl: 'https://hte.rajasthan.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['rajasthan', 'merit', 'scholarship', 'state education'],
    isDemo: true
  },

  // --- HEALTHCARE ---
  {
    id: 'sch-006',
    name: 'Ayushman Bharat PM-JAY',
    ministry: 'Ministry of Health and Family Welfare',
    scope: 'Central',
    category: 'Healthcare',
    description: 'Health insurance scheme providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.',
    benefits: [
      'Health cover of ₹5 lakhs per family per year',
      'Cashless access to health care services'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'any',
        value: true,
        label: 'Income or Category Check',
        description: 'Typically applies if annual income <= 600000 OR category is SC/ST/OBC (SECC 2011 data).',
        critical: false
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'PMJAY Card'],
    officialSource: 'https://pmjay.gov.in',
    officialApplicationUrl: 'https://pmjay.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['health', 'insurance', 'ayushman', 'pmjay', 'medical'],
    isDemo: true
  },
  {
    id: 'sch-007',
    name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Healthcare',
    description: 'An accident insurance scheme offering accidental death and disability cover for death or disability on account of an accident.',
    benefits: [
      '₹2 Lakh accidental death and full disability cover',
      '₹1 Lakh for partial disability'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'between',
        value: [18, 70],
        label: 'Age between 18 and 70',
        description: 'Individuals aged 18 to 70 years with a bank account.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Bank Account Details'],
    officialSource: 'https://jansuraksha.gov.in',
    officialApplicationUrl: 'https://jansuraksha.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['insurance', 'accident', 'pmsby', 'suraksha', 'bima'],
    isDemo: true
  },
  {
    id: 'sch-008',
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Healthcare',
    description: 'A one-year life insurance scheme renewable from year to year offering coverage for death due to any reason.',
    benefits: [
      '₹2 Lakh life cover for death due to any reason'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'between',
        value: [18, 50],
        label: 'Age between 18 and 50',
        description: 'Individuals aged 18 to 50 years with a bank account.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Bank Account Details'],
    officialSource: 'https://jansuraksha.gov.in',
    officialApplicationUrl: 'https://jansuraksha.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['life insurance', 'pmjjby', 'bima', 'jeevan jyoti'],
    isDemo: true
  },
  {
    id: 'sch-009',
    name: 'Janani Suraksha Yojana (JSY)',
    ministry: 'Ministry of Health and Family Welfare',
    scope: 'Central',
    category: 'Healthcare',
    description: 'A safe motherhood intervention scheme aiming to reduce maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.',
    benefits: [
      'Cash assistance for institutional delivery',
      'Post-delivery care benefits'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'gender',
        operator: 'eq',
        value: 'Female',
        label: 'Must be Female',
        description: 'Scheme is for pregnant women.',
        critical: true
      },
      {
        id: 'r2',
        field: 'annualIncome',
        operator: 'lte',
        value: 120000,
        label: 'Low Income Group',
        description: 'Targeted at BPL families.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'BPL Ration Card', 'MCP Card'],
    officialSource: 'https://nhm.gov.in',
    officialApplicationUrl: 'https://nhm.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['jsY', 'maternity', 'pregnancy', 'women health', 'delivery'],
    isDemo: true
  },

  // --- EMPLOYMENT / SOCIAL SECURITY ---
  {
    id: 'sch-010',
    name: 'PM Rozgar Protsahan Yojana (PMRPY)',
    ministry: 'Ministry of Labour and Employment',
    scope: 'Central',
    category: 'Employment',
    description: 'Scheme to incentivise employers for employment generation by paying their EPF and EPS contribution for new employees.',
    benefits: [
      'Government pays 12% EPF/EPS contribution for new employees'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Employed',
        label: 'Employment Check',
        description: 'Applies to employers hiring new employees, needs verification.',
        critical: false
      }
    ],
    requiredDocuments: ['LIN', 'PAN Card', 'Bank Account Details'],
    officialSource: 'https://pmrpy.gov.in',
    officialApplicationUrl: 'https://pmrpy.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['employment', 'employer', 'pf', 'epfo', 'rozgar'],
    isDemo: true
  },
  {
    id: 'sch-011',
    name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)',
    ministry: 'Ministry of Labour and Employment',
    scope: 'Central',
    category: 'Social Security',
    description: 'A voluntary and contributory pension scheme for unorganised workers for old age protection.',
    benefits: [
      'Assured minimum pension of ₹3,000/- per month after 60 years of age',
      'Matching contribution by the Government'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'between',
        value: [18, 40],
        label: 'Age between 18 and 40',
        description: 'Entry age must be between 18 and 40 years.',
        critical: true
      },
      {
        id: 'r2',
        field: 'annualIncome',
        operator: 'lte',
        value: 180000,
        label: 'Monthly income <= Rs 15000',
        description: 'Equivalent to annual income of 1,80,000.',
        critical: true
      },
      {
        id: 'r3',
        field: 'occupation',
        operator: 'in',
        value: ['Self-Employed', 'Employed'],
        label: 'Unorganised Worker',
        description: 'Must be an unorganised worker.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Savings Bank Account', 'IFSC Code'],
    officialSource: 'https://maandhan.in',
    officialApplicationUrl: 'https://maandhan.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['pension', 'unorganised', 'workers', 'shram yogi', 'old age'],
    isDemo: true
  },
  {
    id: 'sch-012',
    name: 'Atal Pension Yojana (APY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Social Security',
    description: 'Pension scheme primarily focused on the unorganized sector workers.',
    benefits: [
      'Guaranteed minimum pension of ₹1,000 to ₹5,000 per month',
      'Tax benefits'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'between',
        value: [18, 40],
        label: 'Age between 18 and 40',
        description: 'Applicant must be 18 to 40 years old.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Bank Account'],
    officialSource: 'https://npscra.nsdl.co.in',
    officialApplicationUrl: 'https://enps.nsdl.com',
    lastVerified: 'UNVERIFIED',
    keywords: ['apy', 'pension', 'atal', 'unorganized', 'retirement'],
    isDemo: true
  },
  {
    id: 'sch-013',
    name: 'PM Garib Kalyan Rozgar Abhiyaan',
    ministry: 'Ministry of Rural Development',
    scope: 'Central',
    category: 'Employment',
    description: 'A massive employment-cum-rural public works Campaign to empower and provide livelihood opportunities to the returnee migrant workers and rural citizens.',
    benefits: [
      'Employment provision in 25 categories of works',
      'Creation of rural infrastructure'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Unemployed',
        label: 'Currently Unemployed',
        description: 'Targeted at migrant workers and unemployed rural citizens.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Job Card (MGNREGA)'],
    officialSource: 'https://pmgkra.gov.in',
    officialApplicationUrl: 'https://pmgkra.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['garib kalyan', 'employment', 'rozgar', 'migrant workers'],
    isDemo: true
  },

  // --- AGRICULTURE / FARMERS ---
  {
    id: 'sch-014',
    name: 'PM-Kisan Samman Nidhi',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    scope: 'Central',
    category: 'Agriculture',
    description: 'Income support to all landholding farmer families in the country to supplement their financial needs.',
    benefits: [
      '₹6,000/- per year transferred in three equal installments'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Farmer',
        label: 'Must be a Farmer',
        description: 'Applicant must be a farmer.',
        critical: true
      },
      {
        id: 'r2',
        field: 'landHolding',
        operator: 'gt',
        value: 0,
        label: 'Must own land',
        description: 'Must have cultivable landholding.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Ownership Records', 'Bank Account Details'],
    officialSource: 'https://pmkisan.gov.in',
    officialApplicationUrl: 'https://pmkisan.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['kisan', 'farmer', 'pm-kisan', 'agriculture', 'income support'],
    isDemo: true
  },
  {
    id: 'sch-015',
    name: 'PM Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    scope: 'Central',
    category: 'Agriculture',
    description: 'Crop insurance scheme integrating multiple stakeholders on a single IT platform to provide a comprehensive insurance cover against failure of the crop.',
    benefits: [
      'Financial support to farmers suffering crop loss/damage arising out of unforeseen events'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Farmer',
        label: 'Must be a Farmer',
        description: 'All farmers growing notified crops are eligible.',
        critical: true
      }
    ],
    requiredDocuments: ['Land Records', 'Bank Passbook', 'Aadhaar Card', 'Sowing Certificate'],
    officialSource: 'https://pmfby.gov.in',
    officialApplicationUrl: 'https://pmfby.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['fasal bima', 'crop insurance', 'farmer', 'agriculture'],
    isDemo: true
  },
  {
    id: 'sch-016',
    name: 'Kisan Credit Card (KCC)',
    ministry: 'Ministry of Finance / NABARD',
    scope: 'Central',
    category: 'Agriculture',
    description: 'Scheme to meet the comprehensive credit requirements of the agriculture sector and by providing financial support to farmers.',
    benefits: [
      'Short term credit limit for crops and term loans',
      'Low interest rates'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Farmer',
        label: 'Must be a Farmer',
        description: 'Farmers, tenant farmers, and sharecroppers are eligible.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Passport Size Photo'],
    officialSource: 'https://nabard.org',
    officialApplicationUrl: 'https://nabard.org',
    lastVerified: 'UNVERIFIED',
    keywords: ['kcc', 'credit card', 'loan', 'farmer', 'agriculture'],
    isDemo: true
  },
  {
    id: 'sch-017',
    name: 'PM Kusum Yojana',
    ministry: 'Ministry of New and Renewable Energy',
    scope: 'Central',
    category: 'Agriculture',
    description: 'Scheme for farmers for installation of solar pumps and grid connected solar and other renewable power plants.',
    benefits: [
      'Subsidies for setting up standalone solar pumps',
      'Additional income by selling surplus power'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'occupation',
        operator: 'eq',
        value: 'Farmer',
        label: 'Must be a Farmer',
        description: 'Scheme is targeted at farmers.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Documents', 'Bank Account Details'],
    officialSource: 'https://mnre.gov.in',
    officialApplicationUrl: 'https://pmkusum.mnre.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['kusum', 'solar pump', 'renewable', 'farmer', 'agriculture'],
    isDemo: true
  },

  // --- HOUSING ---
  {
    id: 'sch-018',
    name: 'PM Awas Yojana (Urban) - PMAY-U',
    ministry: 'Ministry of Housing and Urban Affairs',
    scope: 'Central',
    category: 'Housing',
    description: 'Housing for All in urban areas by providing pucca houses to all eligible beneficiaries.',
    benefits: [
      'Interest subsidy on home loans',
      'Financial assistance for house construction/enhancement'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'lte',
        value: 1800000,
        label: 'Annual Income <= 18 Lakhs',
        description: 'MIG II max income limit is 18 Lakhs.',
        critical: true
      },
      {
        id: 'r2',
        field: 'maritalStatus',
        operator: 'any',
        value: true,
        label: 'Marital Status Checks',
        description: 'Unmarried individuals may apply, family definitions apply.',
        critical: false
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Property Documents'],
    officialSource: 'https://pmaymis.gov.in',
    officialApplicationUrl: 'https://pmaymis.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['pmay', 'housing', 'urban', 'home loan', 'awas'],
    isDemo: true
  },
  {
    id: 'sch-019',
    name: 'PM Awas Yojana (Gramin) - PMAY-G',
    ministry: 'Ministry of Rural Development',
    scope: 'Central',
    category: 'Housing',
    description: 'Providing pucca house with basic amenities to all houseless householder and those living in kutcha and dilapidated house.',
    benefits: [
      'Financial assistance for construction of a house',
      'Assistance for construction of toilets'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'lte',
        value: 120000,
        label: 'Low Income',
        description: 'Targeted at rural poor and deprived households.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Bank Account', 'Job Card (MGNREGA)', 'SBM Number'],
    officialSource: 'https://pmayg.nic.in',
    officialApplicationUrl: 'https://pmayg.nic.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['pmay-g', 'gramin', 'rural housing', 'awas', 'house'],
    isDemo: true
  },

  // --- SENIOR CITIZENS ---
  {
    id: 'sch-020',
    name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Senior Citizens',
    description: 'Pension scheme exclusively for senior citizens providing assured return.',
    benefits: [
      'Assured pension return based on investment',
      'Death benefit to nominee'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'gte',
        value: 60,
        label: 'Age >= 60',
        description: 'Must be a senior citizen.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Age Proof', 'Bank Account', 'PAN Card'],
    officialSource: 'https://licindia.in',
    officialApplicationUrl: 'https://licindia.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['pmvvy', 'senior citizen', 'pension', 'investment'],
    isDemo: true
  },
  {
    id: 'sch-021',
    name: 'Indira Gandhi National Old Age Pension (IGNOAPS)',
    ministry: 'Ministry of Rural Development',
    scope: 'Central',
    category: 'Senior Citizens',
    description: 'Pension to senior citizens belonging to BPL households.',
    benefits: [
      'Monthly pension for old age persons'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'age',
        operator: 'gte',
        value: 60,
        label: 'Age >= 60',
        description: 'Applicant must be 60 years or above.',
        critical: true
      },
      {
        id: 'r2',
        field: 'annualIncome',
        operator: 'lte',
        value: 120000,
        label: 'BPL Family',
        description: 'Must belong to a BPL family.',
        critical: true
      }
    ],
    requiredDocuments: ['Age Proof', 'BPL Card', 'Bank Account', 'Aadhaar Card'],
    officialSource: 'https://nsap.nic.in',
    officialApplicationUrl: 'https://nsap.nic.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['ignoaps', 'old age', 'pension', 'senior citizen', 'nsap'],
    isDemo: true
  },

  // --- WOMEN & CHILD ---
  {
    id: 'sch-022',
    name: 'Sukanya Samriddhi Yojana',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Women & Child',
    description: 'Small deposit scheme for the girl child launched as a part of the Beti Bachao Beti Padhao campaign.',
    benefits: [
      'High interest rate',
      'Tax benefits under Section 80C'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'gender',
        operator: 'eq',
        value: 'Female',
        label: 'Girl Child',
        description: 'Account can be opened in the name of a girl child.',
        critical: true
      },
      {
        id: 'r2',
        field: 'age',
        operator: 'lte',
        value: 10,
        label: 'Age <= 10',
        description: 'Girl child must be 10 years or younger at the time of account opening.',
        critical: true
      }
    ],
    requiredDocuments: ['Birth Certificate of Girl Child', 'Identity Proof of Parent', 'Address Proof'],
    officialSource: 'https://nsiindia.gov.in',
    officialApplicationUrl: 'https://indiapost.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['sukanya', 'girl child', 'savings', 'beti bachao'],
    isDemo: true
  },
  {
    id: 'sch-023',
    name: 'Beti Bachao Beti Padhao',
    ministry: 'Ministry of Women and Child Development',
    scope: 'Central',
    category: 'Women & Child',
    description: 'Campaign aiming to generate awareness and improve the efficiency of welfare services intended for girls.',
    benefits: [
      'Education and survival initiatives for girls',
      'Awareness programs'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'gender',
        operator: 'eq',
        value: 'Female',
        label: 'Female Focus',
        description: 'Initiatives targeted at girls.',
        critical: true
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Birth Certificate'],
    officialSource: 'https://wcd.nic.in',
    officialApplicationUrl: 'https://wcd.nic.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['bbbp', 'girl child', 'education', 'women empowerment'],
    isDemo: true
  },

  // --- DISABILITY ---
  {
    id: 'sch-024',
    name: 'Deen Dayal Disabled Rehabilitation Scheme (DDRS)',
    ministry: 'Ministry of Social Justice and Empowerment',
    scope: 'Central',
    category: 'Disability',
    description: 'Financial assistance to NGOs for providing various services to Persons with Disabilities.',
    benefits: [
      'Rehabilitation services',
      'Special schools and vocational training'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'disability',
        operator: 'neq',
        value: 'None',
        label: 'Must have a disability',
        description: 'Scheme is for Persons with Disabilities.',
        critical: true
      }
    ],
    requiredDocuments: ['Disability Certificate', 'Aadhaar Card'],
    officialSource: 'https://disabilityaffairs.gov.in',
    officialApplicationUrl: 'https://disabilityaffairs.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['ddrs', 'rehabilitation', 'disability', 'divyangjan'],
    isDemo: true
  },
  {
    id: 'sch-025',
    name: 'Accessible India Campaign (Sugamya Bharat)',
    ministry: 'Ministry of Social Justice and Empowerment',
    scope: 'Central',
    category: 'Disability',
    description: 'Nation-wide Campaign for achieving universal accessibility for Persons with Disabilities (PwDs).',
    benefits: [
      'Accessible built environment',
      'Accessible transport system'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'disability',
        operator: 'neq',
        value: 'None',
        label: 'Targeted at PwDs',
        description: 'Focuses on improving accessibility for PwDs.',
        critical: true
      }
    ],
    requiredDocuments: ['Disability Certificate'],
    officialSource: 'https://disabilityaffairs.gov.in',
    officialApplicationUrl: 'https://disabilityaffairs.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['accessible india', 'sugamya bharat', 'disability', 'accessibility'],
    isDemo: true
  },

  // --- FINANCIAL INCLUSION ---
  {
    id: 'sch-026',
    name: 'PM Jan Dhan Yojana (PMJDY)',
    ministry: 'Ministry of Finance',
    scope: 'Central',
    category: 'Financial Inclusion',
    description: 'National Mission for Financial Inclusion to ensure access to financial services in an affordable manner.',
    benefits: [
      'Basic savings bank account',
      'RuPay debit card with inbuilt accident insurance'
    ],
    eligibilityRules: [
      {
        id: 'r1',
        field: 'annualIncome',
        operator: 'any',
        value: true,
        label: 'All Citizens Eligible',
        description: 'Any Indian citizen is eligible to open an account.',
        critical: false
      }
    ],
    requiredDocuments: ['Aadhaar Card', 'Passport Size Photograph'],
    officialSource: 'https://pmjdy.gov.in',
    officialApplicationUrl: 'https://pmjdy.gov.in',
    lastVerified: 'UNVERIFIED',
    keywords: ['pmjdy', 'jan dhan', 'bank account', 'financial inclusion', 'savings'],
    isDemo: true
  }
];

export function getSchemeById(id: string): Scheme | undefined {
  return schemeDb.find((s) => s.id === id);
}

export function getSchemesByCategory(category: SchemeCategory): Scheme[] {
  return schemeDb.filter((s) => s.category === category);
}

export function searchSchemes(query: string): Scheme[] {
  const q = query.toLowerCase();
  return schemeDb.filter((s) =>
    s.name.toLowerCase().includes(q) ||
    s.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
