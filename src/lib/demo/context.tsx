'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
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
  ScamAnalysis,
  AgentActivityStep,
  DocumentAnalysis,
} from '@/types';
import type { CitizenProfile, RankedSchemeMatch } from '@/types/engine';
import { createEmptyProfile, UNKNOWN } from '@/types/engine';
import {
  demoState as initialDemoState,
  demoScamAnalysis,
  demoAgentSteps,
  getGreeting,
} from './data';
import { rankSchemes, getTopMatches } from '@/lib/engine/ranker';
import { extractProfileUpdates, generateFollowUpQuestion } from '@/lib/engine/extractor';

interface DemoContextValue {
  isDemo: boolean;
  state: DemoState;
  greeting: string;

  // Citizen Profile (new engine)
  citizenProfile: CitizenProfile;
  updateCitizenProfile: (updates: Partial<CitizenProfile>) => void;
  rankedMatches: RankedSchemeMatch[];

  // Agent
  sendMessage: (content: string) => Promise<void>;
  agentSteps: AgentActivityStep[];
  isAgentThinking: boolean;

  // Documents
  uploadDocument: (file: File) => Promise<DocumentAnalysis>;

  // Journey
  startJourney: (serviceId: string) => void;

  // Actions
  markActionComplete: (actionId: string) => void;

  // Notifications
  markNotificationRead: (notifId: string) => void;

  // Scam Detection
  analyzeMessage: (text: string) => Promise<ScamAnalysis>;

  // Profile (legacy)
  updateProfile: (updates: Partial<Profile>) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

// Build a CitizenProfile from the demo persona (Rohit Sharma)
const initialCitizenProfile: CitizenProfile = {
  name: 'Rohit Sharma',
  age: 19,
  gender: 'Male',
  state: 'Rajasthan',
  district: 'Jaipur',
  annualIncome: 200000,
  category: 'General',
  disability: 'None',
  maritalStatus: 'Single',
  occupation: 'Student',
  landHolding: UNKNOWN,
  education: 'B.Tech',
  course: 'B.Tech Computer Science',
  institution: UNKNOWN,
  familySize: UNKNOWN,
  familyMembers: [],
  lifeEvents: ['new_student'],
  availableDocuments: ['aadhaar', 'student_id', 'income_certificate', 'marksheet_12th'],
  rawContext: 'B.Tech student from Jaipur, Rajasthan. Annual family income ₹2 lakh. General category.',
  lastUpdated: new Date().toISOString(),
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDemoState);
  const [agentSteps, setAgentSteps] = useState<AgentActivityStep[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(initialCitizenProfile);

  const greeting = getGreeting();

  // Compute ranked matches whenever citizenProfile changes
  const rankedMatches = useMemo(() => {
    try {
      return getTopMatches(citizenProfile, 10);
    } catch (e) {
      console.error('Ranker error:', e);
      return [];
    }
  }, [citizenProfile]);

  // Sync rankedMatches back into DemoState.serviceMatches for legacy page compatibility
  const syncedState = useMemo(() => {
    if (rankedMatches.length === 0) return state;
    return {
      ...state,
      serviceMatches: rankedMatches as any,
    };
  }, [state, rankedMatches]);

  const updateCitizenProfile = useCallback((updates: Partial<CitizenProfile>) => {
    setCitizenProfile(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Simulate agent thinking with step-by-step activity
  const simulateAgentActivity = useCallback(async (): Promise<AgentActivityStep[]> => {
    const steps = demoAgentSteps.map(s => ({ ...s, status: 'pending' as const }));
    setAgentSteps(steps);
    setIsAgentThinking(true);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      setAgentSteps(prev =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'done' : idx === i ? 'active' : 'pending',
        }))
      );
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300));
      setAgentSteps(prev =>
        prev.map((s, idx) => ({
          ...s,
          status: idx <= i ? 'done' : idx === i + 1 ? 'active' : 'pending',
        }))
      );
    }

    const doneSteps = steps.map(s => ({ ...s, status: 'done' as const }));
    setAgentSteps(doneSteps);
    setIsAgentThinking(false);
    return doneSteps;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      conversations: [...prev.conversations, userMsg],
    }));

    // Extract profile updates from the message
    const profileUpdates = extractProfileUpdates(content, citizenProfile);
    if (Object.keys(profileUpdates).length > 0) {
      updateCitizenProfile(profileUpdates);
    }

    // Simulate agent processing
    const activitySteps = await simulateAgentActivity();

    // Generate a context-aware response
    const responseText = generateContextualResponse(content, citizenProfile, rankedMatches);

    const agentResponse: AgentMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'agent',
      content: responseText,
      timestamp: new Date().toISOString(),
      actions: [
        { id: 'act-view', label: 'View Matches', type: 'primary', action: 'navigate', data: { url: '/discover/results' } },
        { id: 'act-journey', label: 'Start Journey', type: 'secondary', action: 'journey', data: { serviceId: 'svc-001' } },
      ],
      activitySteps,
    };

    setState(prev => ({
      ...prev,
      conversations: [...prev.conversations, agentResponse],
    }));
  }, [simulateAgentActivity, citizenProfile, rankedMatches, updateCitizenProfile]);

  const uploadDocument = useCallback(async (file: File): Promise<DocumentAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      documentId: `doc-upload-${Date.now()}`,
      documentType: 'income_certificate',
      extractedFields: [
        { field: 'Name', value: citizenProfile.name !== UNKNOWN ? citizenProfile.name : 'Rohit Sharma', confidence: 'high', verified: true },
        { field: 'Income', value: citizenProfile.annualIncome !== UNKNOWN ? `₹${(citizenProfile.annualIncome/100000).toFixed(1)}L` : '₹2,00,000', confidence: 'high', verified: true },
        { field: 'Issuing Authority', value: 'Tehsildar', confidence: 'high', verified: true },
        { field: 'Date', value: '2023-10-12', confidence: 'high', verified: true },
      ],
      matchedServices: [
        { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms income eligibility' },
        { serviceId: 'svc-002', serviceName: 'EWS Scholarship', matchLevel: 'high', relevance: 'Confirms EWS eligibility' },
      ],
      warnings: [
        'Digital signature not found. Manual verification might be required.',
      ],
      confidence: 'high',
      verificationNote: 'Information extracted from document. Validity requires verification.',
    };
  }, [citizenProfile]);

  const startJourney = useCallback((serviceId: string) => {
    console.log('Starting journey for service:', serviceId);
  }, []);

  const markActionComplete = useCallback((actionId: string) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(a =>
        a.id === actionId ? { ...a, status: 'completed' } : a
      ),
    }));
  }, []);

  const markNotificationRead = useCallback((notifId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notifId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const analyzeMessage = useCallback(async (text: string): Promise<ScamAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lower = text.toLowerCase();
    const hasPayment = /pay|₹|upi|neft|transfer|send money|deposit/.test(lower);
    const hasUrgency = /urgent|immediately|expire|last chance|hurry|today only|deadline/.test(lower);
    const hasSuspiciousLink = /bit\.ly|tinyurl|t\.co|click here|http(?!s:\/\/[a-z]+\.gov\.in)/.test(lower);
    const hasOTP = /otp|one time password|verification code/.test(lower);
    const hasGovtImpersonation = /government|govt|ministry|officer|pm|chief minister|nrega|pmkisan/.test(lower);

    const indicators: import('@/types').ScamIndicator[] = [
      {
        type: 'Payment Request',
        description: hasPayment ? 'Message requests payment/money transfer — government schemes never ask for fees upfront.' : 'No direct payment request detected.',
        severity: hasPayment ? 'high' : 'low',
        found: hasPayment,
      },
      {
        type: 'Urgency Tactics',
        description: hasUrgency ? 'Message uses urgency language to pressure you — a common scam tactic.' : 'No urgency tactics detected.',
        severity: hasUrgency ? 'high' : 'low',
        found: hasUrgency,
      },
      {
        type: 'Suspicious Links',
        description: hasSuspiciousLink ? 'Message contains shortened/suspicious links — avoid clicking.' : 'No suspicious links detected.',
        severity: hasSuspiciousLink ? 'medium' : 'low',
        found: hasSuspiciousLink,
      },
      {
        type: 'OTP Request',
        description: hasOTP ? 'Message asks for OTP — government portals never ask for OTPs via SMS/WhatsApp.' : 'No OTP request detected.',
        severity: hasOTP ? 'high' : 'low',
        found: hasOTP,
      },
      {
        type: 'Government Impersonation',
        description: hasGovtImpersonation && hasPayment ? 'Claims to be government while asking for payment — likely impersonation scam.' : 'Standard government mention without suspicious context.',
        severity: (hasGovtImpersonation && hasPayment) ? 'high' : 'low',
        found: hasGovtImpersonation && hasPayment,
      },
    ];

    const foundCount = indicators.filter(i => i.found).length;
    const riskScore = Math.round((foundCount / indicators.length) * 100);
    const riskLevel: 'high' | 'medium' | 'low' =
      riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

    return {
      inputText: text,
      riskLevel: riskLevel,
      riskScore,
      indicators,
      recommendation: riskLevel === 'high'
        ? 'HIGH RISK: Do not respond, click any links, or share personal/payment information. Report to cybercrime.gov.in or call 1930.'
        : riskLevel === 'medium'
        ? 'CAUTION: Verify this message through the official government portal before taking any action.'
        : 'LOW RISK: No obvious scam indicators detected. Always verify government communications through official channels (gov.in domains).',
      disclaimer: 'This analysis is based on pattern recognition. JANSAHAY cannot guarantee absolute accuracy. When in doubt, call the official helpline.',
    };
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  }, []);

  return (
    <DemoContext.Provider
      value={{
        isDemo: true,
        state: syncedState,
        greeting,
        citizenProfile,
        updateCitizenProfile,
        rankedMatches,
        sendMessage,
        agentSteps,
        isAgentThinking,
        uploadDocument,
        startJourney,
        markActionComplete,
        markNotificationRead,
        analyzeMessage,
        updateProfile,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

// --- Contextual Response Generator (uses real ranked results) ---
function generateContextualResponse(
  input: string,
  profile: CitizenProfile,
  matches: RankedSchemeMatch[]
): string {
  const lower = input.toLowerCase();
  const topMatch = matches[0];
  const highMatches = matches.filter(m => m.tier === 'high');
  const totalMatches = matches.filter(m => m.tier !== 'not_eligible').length;

  if (lower.includes('student') || lower.includes('education') || lower.includes('scholarship')) {
    const eduMatches = matches.filter(m => m.scheme.category === 'Education' && m.tier !== 'not_eligible');
    return `Based on your profile as a student from ${profile.state !== UNKNOWN ? profile.state : 'your state'} with ${profile.annualIncome !== UNKNOWN ? `₹${(profile.annualIncome as number / 100000).toFixed(1)}L income` : 'the income you mentioned'}, I found **${eduMatches.length} education-related schemes** you may qualify for${eduMatches[0] ? `, including "${eduMatches[0].scheme.name}"` : ''}. ${highMatches.length > 0 ? `${highMatches.length} scheme(s) show high eligibility.` : 'Some need more information to confirm eligibility.'}`;
  }

  if (lower.includes('farmer') || lower.includes('crop') || lower.includes('agriculture') || lower.includes('kisan')) {
    const farmMatches = matches.filter(m => m.scheme.category === 'Agriculture' && m.tier !== 'not_eligible');
    return `I found **${farmMatches.length} agriculture schemes** relevant to farmers. ${farmMatches[0] ? `"${farmMatches[0].scheme.name}" looks promising based on your profile.` : ''} Would you like me to check your eligibility for PM-Kisan and crop insurance schemes?`;
  }

  if (lower.includes('health') || lower.includes('medical') || lower.includes('hospital') || lower.includes('insurance')) {
    const healthMatches = matches.filter(m => m.scheme.category === 'Healthcare' && m.tier !== 'not_eligible');
    return `I found **${healthMatches.length} healthcare schemes**${healthMatches[0] ? `, including Ayushman Bharat PM-JAY which provides up to ₹5L health coverage` : ''}. Based on your income profile, you may be eligible for subsidized health insurance.`;
  }

  if (lower.includes('document') || lower.includes('certificate')) {
    const missingDocs = matches[0]?.eligibility?.missingDocuments ?? [];
    return `I've checked your document status. You have ${profile.availableDocuments.length} documents available.${missingDocs.length > 0 ? ` Missing: ${missingDocs.slice(0, 2).join(', ')}.` : ' Your documents look good!'} Would you like me to help with the next steps?`;
  }

  if (lower.includes('job') || lower.includes('unemployed') || lower.includes('employment')) {
    const empMatches = matches.filter(m => m.scheme.category === 'Employment' && m.tier !== 'not_eligible');
    return `I found **${empMatches.length} employment-related schemes**. Based on your situation, schemes like Atal Pension Yojana and PM Shram Yogi Maan-dhan may be relevant. What is your current employment status?`;
  }

  if (topMatch) {
    return `Based on your profile, I found **${totalMatches} potentially relevant schemes**. Your top match is **"${topMatch.scheme.name}"** (${topMatch.displayScore}% readiness — ${topMatch.whyShown}). ${topMatch.eligibility.missingDocuments.length > 0 ? `You're missing: ${topMatch.eligibility.missingDocuments.slice(0, 2).join(', ')}.` : 'Your documents look complete!'} Would you like to start a journey for this scheme?`;
  }

  return `I understand your situation. Let me search for relevant services. Based on what you've shared, I'm checking ${profile.state !== UNKNOWN ? profile.state : 'your state'}'s schemes for ${profile.occupation !== UNKNOWN ? profile.occupation.toLowerCase() : 'citizens'} with ${profile.annualIncome !== UNKNOWN ? `₹${((profile.annualIncome as number)/100000).toFixed(1)}L income` : 'your income level'}. What is your approximate annual family income?`;
}
