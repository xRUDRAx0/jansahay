'use client';

// ============================================================
// JANSAHAY — Demo Provider (Rohit Sharma persona)
// Only used when mode === 'demo'
// Uses shared AppContext so all pages work with both modes.
// ============================================================

import React, { useState, useCallback, useMemo, type ReactNode } from 'react';
import type {
  Profile,
  AgentMessage,
  AgentActivityStep,
  DocumentAnalysis,
  ScamAnalysis,
} from '@/types';
import type { CitizenProfile, RankedSchemeMatch } from '@/types/engine';
import { UNKNOWN } from '@/types/engine';
import {
  demoState as initialDemoState,
  demoAgentSteps,
  getGreeting,
} from './data';
import { getTopMatches } from '@/lib/engine/ranker';
import { extractProfileUpdates, generateFollowUpQuestion } from '@/lib/engine/extractor';
import { AppContext } from '@/lib/live/context';

// Demo persona — Rohit Sharma
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
  const [state, setState] = useState(initialDemoState);
  const [agentSteps, setAgentSteps] = useState<AgentActivityStep[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(initialCitizenProfile);

  const greeting = getGreeting();

  const rankedMatches = useMemo(() => {
    try { return getTopMatches(citizenProfile, 10); } catch { return []; }
  }, [citizenProfile]);

  const syncedState = useMemo(() => ({
    ...state,
    serviceMatches: rankedMatches as any,
  }), [state, rankedMatches]);

  const updateCitizenProfile = useCallback((updates: Partial<CitizenProfile>) => {
    setCitizenProfile(prev => ({ ...prev, ...updates, lastUpdated: new Date().toISOString() }));
  }, []);

  const simulateAgentActivity = useCallback(async (): Promise<AgentActivityStep[]> => {
    const steps = demoAgentSteps.map(s => ({ ...s, status: 'pending' as const }));
    setAgentSteps(steps);
    setIsAgentThinking(true);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s, status: idx <= i ? 'done' : idx === i + 1 ? 'active' : 'pending',
      })));
    }
    const doneSteps = steps.map(s => ({ ...s, status: 'done' as const }));
    setAgentSteps(doneSteps);
    setIsAgentThinking(false);
    return doneSteps;
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`, role: 'user', content,
      timestamp: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, conversations: [...prev.conversations, userMsg] }));

    const profileUpdates = extractProfileUpdates(content, citizenProfile);
    if (Object.keys(profileUpdates).length > 0) updateCitizenProfile(profileUpdates);

    const activitySteps = await simulateAgentActivity();
    const responseText = generateDemoResponse(content, citizenProfile, rankedMatches);

    const agentResponse: AgentMessage = {
      id: `msg-${Date.now() + 1}`, role: 'agent', content: responseText,
      timestamp: new Date().toISOString(),
      actions: [
        { id: 'act-view', label: 'View Matches', type: 'primary', action: 'navigate', data: { url: '/discover/results' } },
        { id: 'act-journey', label: 'Start Journey', type: 'secondary', action: 'journey', data: { serviceId: 'svc-001' } },
      ],
      activitySteps,
    };
    setState(prev => ({ ...prev, conversations: [...prev.conversations, agentResponse] }));
  }, [simulateAgentActivity, citizenProfile, rankedMatches, updateCitizenProfile]);

  const uploadDocument = useCallback(async (_file: File): Promise<DocumentAnalysis> => {
    await new Promise(r => setTimeout(r, 2000));
    return {
      documentId: `doc-upload-${Date.now()}`,
      documentType: 'income_certificate',
      extractedFields: [
        { field: 'Name', value: citizenProfile.name !== UNKNOWN ? citizenProfile.name as string : 'Rohit Sharma', confidence: 'high', verified: true },
        { field: 'Income', value: '₹2,00,000', confidence: 'high', verified: true },
        { field: 'Issuing Authority', value: 'Tehsildar', confidence: 'high', verified: true },
        { field: 'Date', value: '2023-10-12', confidence: 'high', verified: true },
      ],
      matchedServices: [
        { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms income eligibility' },
      ],
      warnings: ['Digital signature not found. Manual verification may be required.'],
      confidence: 'high',
      verificationNote: 'Demo mode — extracted fields are simulated.',
    };
  }, [citizenProfile]);

  const startJourney = useCallback((serviceId: string) => {
    console.log('[Demo] startJourney:', serviceId);
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
    await new Promise(r => setTimeout(r, 1500));
    const lower = text.toLowerCase();
    const hasPayment = /pay|₹|upi|neft|transfer|send money|deposit/.test(lower);
    const hasUrgency = /urgent|immediately|expire|last chance|hurry|today only|deadline/.test(lower);
    const hasSuspiciousLink = /bit\.ly|tinyurl|t\.co/.test(lower);
    const hasOTP = /otp|one time password|verification code/.test(lower);
    const hasGovtImpersonation = /government|govt|ministry|officer/.test(lower) && hasPayment;
    const indicators: import('@/types').ScamIndicator[] = [
      { type: 'Payment Request', description: hasPayment ? 'Requests payment — government schemes never charge upfront fees.' : 'No payment request.', severity: hasPayment ? 'high' : 'low', found: hasPayment },
      { type: 'Urgency Tactics', description: hasUrgency ? 'Uses urgency language — classic scam tactic.' : 'No urgency.', severity: hasUrgency ? 'high' : 'low', found: hasUrgency },
      { type: 'Suspicious Links', description: hasSuspiciousLink ? 'Contains shortened links.' : 'No suspicious links.', severity: hasSuspiciousLink ? 'medium' : 'low', found: hasSuspiciousLink },
      { type: 'OTP Request', description: hasOTP ? 'Requests OTP — government portals never do this via SMS.' : 'No OTP request.', severity: hasOTP ? 'high' : 'low', found: hasOTP },
      { type: 'Government Impersonation', description: hasGovtImpersonation ? 'Claims to be government while requesting payment.' : 'No impersonation.', severity: hasGovtImpersonation ? 'high' : 'low', found: hasGovtImpersonation },
    ];
    const foundCount = indicators.filter(i => i.found).length;
    const riskScore = Math.round((foundCount / indicators.length) * 100);
    const riskLevel: 'high' | 'medium' | 'low' = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    return {
      inputText: text, riskLevel, riskScore, indicators,
      recommendation: riskLevel === 'high' ? 'HIGH RISK: Do not respond. Report to cybercrime.gov.in or call 1930.' : riskLevel === 'medium' ? 'CAUTION: Verify via official portal.' : 'LOW RISK: No obvious indicators.',
      disclaimer: 'Pattern-based analysis. JANSAHAY cannot guarantee accuracy.',
    };
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...updates } }));
  }, []);

  return (
    <AppContext.Provider value={{
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Keep useDemo as the hook name for backward compat with existing page imports
export { useApp as useDemo } from '@/lib/live/context';

// Demo response generator
function generateDemoResponse(
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
    return `As a student from ${profile.state !== UNKNOWN ? profile.state : 'your state'} with ₹${profile.annualIncome !== UNKNOWN ? ((profile.annualIncome as number) / 100000).toFixed(1) + 'L' : '2L'} income, I found **${eduMatches.length} education schemes** you may qualify for. ${highMatches.length > 0 ? `${highMatches.length} show high eligibility.` : ''}`;
  }
  if (lower.includes('farmer') || lower.includes('crop') || lower.includes('kisan')) {
    const farmMatches = matches.filter(m => m.scheme.category === 'Agriculture' && m.tier !== 'not_eligible');
    return `I found **${farmMatches.length} agriculture schemes**. ${farmMatches[0] ? `"${farmMatches[0].scheme.name}" looks promising.` : ''}`;
  }
  if (topMatch) {
    return `Based on your profile, I found **${totalMatches} relevant schemes**. Top match: **"${topMatch.scheme.name}"** (${topMatch.displayScore}% readiness — ${topMatch.whyShown}).`;
  }
  return `I'm checking schemes for ${profile.occupation !== UNKNOWN ? profile.occupation + 's' : 'you'} in ${profile.state !== UNKNOWN ? profile.state : 'India'}. What specific help are you looking for?`;
}
