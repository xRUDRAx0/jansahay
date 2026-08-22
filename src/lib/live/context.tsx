'use client';

// ============================================================
// JANSAHAY — Live Citizen Provider
// Fresh empty profile, no demo data, localStorage persistence
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type {
  User,
  Profile,
  Document,
  Journey,
  Application,
  ActionItem,
  Notification,
  AgentMessage,
  DemoState,
  ScamAnalysis,
  AgentActivityStep,
  DocumentAnalysis,
} from '@/types';
import type { CitizenProfile, RankedSchemeMatch } from '@/types/engine';
import { createEmptyProfile, UNKNOWN } from '@/types/engine';
import { getTopMatches } from '@/lib/engine/ranker';
import { extractProfileUpdates, generateFollowUpQuestion } from '@/lib/engine/extractor';
import { getGreeting } from '@/lib/demo/data';
import { LIVE_PROFILE_KEY, LIVE_CONVERSATIONS_KEY } from '@/lib/app/mode';

// ── Shared Context Interface ──────────────────────────────────
// (same shape as DemoProvider so all pages work with both)

export interface AppContextValue {
  isDemo: boolean;
  state: DemoState;
  greeting: string;

  // Citizen Profile (new engine)
  citizenProfile: CitizenProfile;
  updateCitizenProfile: (updates: Partial<CitizenProfile>) => void;
  rankedMatches: RankedSchemeMatch[];

  // Clear session (live mode only)
  clearSession?: () => void;

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

// ── Shared Context ────────────────────────────────────────────
// Both LiveProvider and DemoProvider write to this same context.
export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Alias for backwards compat with existing pages using useDemo()
export const useDemo = useApp;

// ── Guest User ────────────────────────────────────────────────
const guestUser: User = {
  id: 'guest-' + Math.random().toString(36).slice(2, 10),
  name: 'Guest',
  email: '',
  isDemo: false,
  createdAt: new Date().toISOString(),
};

// ── Convert CitizenProfile → Legacy Profile type ───────────────
function citizenToProfile(cp: CitizenProfile): Profile {
  return {
    userId: guestUser.id,
    name: cp.name !== UNKNOWN ? (cp.name as string) : 'Guest',
    age: cp.age !== UNKNOWN ? (cp.age as number) : 0,
    location: cp.district !== UNKNOWN
      ? `${cp.district}, ${cp.state !== UNKNOWN ? cp.state : ''}`
      : cp.state !== UNKNOWN ? (cp.state as string) : '',
    state: cp.state !== UNKNOWN ? (cp.state as string) : '',
    occupation: cp.occupation !== UNKNOWN ? (cp.occupation as string) : '',
    education: cp.education !== UNKNOWN ? (cp.education as string) : '',
    income: cp.annualIncome !== UNKNOWN ? (cp.annualIncome as number) : 0,
    incomeFormatted: cp.annualIncome !== UNKNOWN
      ? `₹${((cp.annualIncome as number) / 100000).toFixed(1)}L/year`
      : '',
    gender: cp.gender !== UNKNOWN ? (cp.gender as string) : undefined,
    category: cp.category !== UNKNOWN ? (cp.category as string) : undefined,
    preferences: {
      language: 'en',
      notifications: true,
      voiceInput: true,
      dataConsent: true,
    },
  };
}

// ── Build empty DemoState for Live Mode ───────────────────────
function buildLiveState(
  cp: CitizenProfile,
  conversations: AgentMessage[],
  rankedMatches: RankedSchemeMatch[],
  actionItems: ActionItem[],
): DemoState {
  return {
    user: guestUser,
    profile: citizenToProfile(cp),
    services: [],
    serviceMatches: rankedMatches as any,
    documents: [],
    journeys: [],
    applications: [],
    actionItems,
    notifications: [],
    reminders: [],
    conversations,
    suspiciousMessage: '',
  };
}

// ── Activity Steps ─────────────────────────────────────────────
const LIVE_STEPS: AgentActivityStep[] = [
  { id: 'step-1', label: 'Understanding situation', status: 'pending' },
  { id: 'step-2', label: 'Searching knowledge base', status: 'pending' },
  { id: 'step-3', label: 'Comparing requirements', status: 'pending' },
  { id: 'step-4', label: 'Checking documents', status: 'pending' },
  { id: 'step-5', label: 'Building recommendation', status: 'pending' },
];

// ── LiveProvider ───────────────────────────────────────────────
export function LiveProvider({ children }: { children: ReactNode }) {
  // Load profile from localStorage
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(() => {
    if (typeof window === 'undefined') return createEmptyProfile();
    try {
      const stored = localStorage.getItem(LIVE_PROFILE_KEY);
      if (stored) return { ...createEmptyProfile(), ...JSON.parse(stored) };
    } catch {}
    return createEmptyProfile();
  });

  // Load conversations from localStorage
  const [conversations, setConversations] = useState<AgentMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LIVE_CONVERSATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [agentSteps, setAgentSteps] = useState<AgentActivityStep[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  // ── Key fix: always-fresh ref to citizenProfile ──────────────
  // useCallback deps on citizenProfile would still be stale during async ops.
  // A ref is updated synchronously on every render, so async fns always read
  // the actual latest profile value — not the closure snapshot.
  const profileRef = useRef<CitizenProfile>(citizenProfile);
  useEffect(() => {
    profileRef.current = citizenProfile;
  }); // no dep array → runs after every render, keeps ref in sync

  // Persist profile to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(LIVE_PROFILE_KEY, JSON.stringify(citizenProfile));
    } catch {}
  }, [citizenProfile]);

  // Persist conversations (keep last 50)
  useEffect(() => {
    try {
      const recent = conversations.slice(-50);
      localStorage.setItem(LIVE_CONVERSATIONS_KEY, JSON.stringify(recent));
    } catch {}
  }, [conversations]);

  const greeting = getGreeting();

  // ── Ranked matches — recompute when profile changes ───────────
  const rankedMatches = useMemo(() => {
    // Only run engine if user has provided at least ONE meaningful field
    const hasInfo = (
      citizenProfile.age !== UNKNOWN ||
      citizenProfile.state !== UNKNOWN ||
      citizenProfile.annualIncome !== UNKNOWN ||
      citizenProfile.occupation !== UNKNOWN ||
      citizenProfile.category !== UNKNOWN
    );
    if (!hasInfo) return [];
    try {
      return getTopMatches(citizenProfile, 15);
    } catch (e) {
      console.error('[JANSAHAY] Ranker error:', e);
      return [];
    }
  }, [citizenProfile]);

  // Build derived state
  const state = useMemo(
    () => buildLiveState(citizenProfile, conversations, rankedMatches, actionItems),
    [citizenProfile, conversations, rankedMatches, actionItems]
  );

  // ── Profile update ────────────────────────────────────────────
  const updateCitizenProfile = useCallback((updates: Partial<CitizenProfile>) => {
    setCitizenProfile(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // ── Clear session ─────────────────────────────────────────────
  const clearSession = useCallback(() => {
    const fresh = createEmptyProfile();
    setCitizenProfile(fresh);
    setConversations([]);
    setActionItems([]);
    setAgentSteps([]);
    try {
      localStorage.removeItem(LIVE_PROFILE_KEY);
      localStorage.removeItem(LIVE_CONVERSATIONS_KEY);
    } catch {}
  }, []);

  // ── Agent activity simulation (reflects real steps) ───────────
  const runAgentActivity = useCallback(async (
    steps: { label: string; fn?: () => void | Promise<void> }[]
  ): Promise<AgentActivityStep[]> => {
    setIsAgentThinking(true);
    const result: AgentActivityStep[] = steps.map((s, i) => ({
      id: `step-${i + 1}`,
      label: s.label,
      status: 'pending' as const,
    }));
    setAgentSteps(result);

    for (let i = 0; i < steps.length; i++) {
      // Mark current as active
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx < i ? 'done' : idx === i ? 'active' : 'pending',
      })));
      // Run the actual step if provided
      if (steps[i].fn) await steps[i].fn!();
      // Small delay for UX
      await new Promise(r => setTimeout(r, 300 + Math.random() * 200));
      // Mark current as done
      setAgentSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx <= i ? 'done' : 'pending',
      })));
    }

    setIsAgentThinking(false);
    return result.map(s => ({ ...s, status: 'done' as const }));
  }, []);

  // ── Send message ──────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    // 1. Add user message immediately
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setConversations(prev => [...prev, userMsg]);

    // 2. Read the LATEST profile from the ref (never stale)
    const currentProfile = profileRef.current;

    let extractedUpdates: Partial<CitizenProfile> = {};
    let updatedProfile = currentProfile;
    let matches: RankedSchemeMatch[] = [];

    const doneSteps = await runAgentActivity([
      {
        label: 'Understanding situation',
        fn: async () => {
          // Attempt Gemini extraction first
          try {
            const res = await fetch('/api/extract-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: content, currentProfile: profileRef.current })
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.updates && Object.keys(data.updates).length > 0) {
                extractedUpdates = data.updates;
                return; // Successfully extracted using Gemini
              }
            } else if (res.status === 501) {
              console.log('Gemini API key missing, falling back to local extractor');
            } else {
              console.warn('Gemini extraction failed, falling back...', await res.text());
            }
          } catch (e) {
            console.warn('Gemini extraction network error, falling back...', e);
          }
          
          // Graceful fallback if Gemini fails or returns empty/nothing
          const localUpdates = extractProfileUpdates(content, profileRef.current);
          if (Object.keys(localUpdates).length > 0) {
            extractedUpdates = localUpdates;
          }
        },
      },
      {
        label: 'Updating your profile',
        fn: () => {
          if (Object.keys(extractedUpdates).length > 0) {
            // Compute directly from the always-fresh ref — no side-effect inside setter
            const newProfile: CitizenProfile = {
              ...profileRef.current,
              ...extractedUpdates,
              lastUpdated: new Date().toISOString(),
            };
            updatedProfile = newProfile;
            setCitizenProfile(newProfile); // plain value, not functional updater
          } else {
            updatedProfile = profileRef.current;
          }
        },
      },
      {
        label: 'Searching knowledge base',
        fn: async () => {
          await new Promise(r => setTimeout(r, 100));
        },
      },
      {
        label: 'Comparing requirements',
        fn: () => {
          try {
            const profileToUse = updatedProfile;
            const hasInfo = (
              profileToUse.age !== UNKNOWN ||
              profileToUse.state !== UNKNOWN ||
              profileToUse.annualIncome !== UNKNOWN ||
              profileToUse.occupation !== UNKNOWN
            );
            if (hasInfo) {
              matches = getTopMatches(profileToUse, 15);
            }
          } catch {}
        },
      },
      {
        label: 'Building recommendation',
      },
    ]);

    // 3. Build the response
    const responseText = buildLiveResponse(content, extractedUpdates, updatedProfile, matches);

    const agentMsg: AgentMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'agent',
      content: responseText,
      timestamp: new Date().toISOString(),
      actions: matches.length > 0 ? [
        { id: 'act-view', label: 'View Matches', type: 'primary', action: 'navigate', data: { url: '/discover/results' } },
        { id: 'act-eligibility', label: 'Check Eligibility', type: 'secondary', action: 'navigate', data: { url: '/eligibility' } },
      ] : [],
      activitySteps: doneSteps,
    };

    setConversations(prev => [...prev, agentMsg]);

  // profileRef is a ref — not needed in deps; rankedMatches removed (we recompute inside)
  }, [runAgentActivity]);

  // ── Upload document ───────────────────────────────────────────
  const uploadDocument = useCallback(async (file: File): Promise<DocumentAnalysis> => {
    await new Promise(r => setTimeout(r, 1500));
    // In live mode, we can't do real OCR without a server API.
    // Return a clean abstraction asking user to confirm fields.
    return {
      documentId: `doc-${Date.now()}`,
      documentType: 'other',
      extractedFields: [
        { field: 'Document Name', value: file.name, confidence: 'high', verified: false },
        { field: 'File Size', value: `${(file.size / 1024).toFixed(1)} KB`, confidence: 'high', verified: false },
      ],
      matchedServices: [],
      warnings: [
        'Automatic text extraction requires server-side processing. Please confirm your document details manually.',
      ],
      confidence: 'low',
      verificationNote: 'Manual confirmation required. JANSAHAY does not store or transmit your documents.',
    };
  }, []);

  const startJourney = useCallback((serviceId: string) => {
    console.log('[Live] Starting journey for:', serviceId);
  }, []);

  const markActionComplete = useCallback((actionId: string) => {
    setActionItems(prev =>
      prev.map(a => a.id === actionId ? { ...a, status: 'completed' } : a)
    );
  }, []);

  const markNotificationRead = useCallback((notifId: string) => {
    // No notifications in live mode yet
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
      { type: 'Payment Request', description: hasPayment ? 'Requests payment — government schemes never charge upfront fees.' : 'No payment request detected.', severity: hasPayment ? 'high' : 'low', found: hasPayment },
      { type: 'Urgency Tactics', description: hasUrgency ? 'Uses urgency language — a classic scam pressure tactic.' : 'No urgency detected.', severity: hasUrgency ? 'high' : 'low', found: hasUrgency },
      { type: 'Suspicious Links', description: hasSuspiciousLink ? 'Contains shortened/suspicious links.' : 'No suspicious links.', severity: hasSuspiciousLink ? 'medium' : 'low', found: hasSuspiciousLink },
      { type: 'OTP Request', description: hasOTP ? 'Requests OTP — government portals never ask for OTPs via SMS/WhatsApp.' : 'No OTP request.', severity: hasOTP ? 'high' : 'low', found: hasOTP },
      { type: 'Government Impersonation', description: hasGovtImpersonation ? 'Claims to be government while requesting payment.' : 'No impersonation detected.', severity: hasGovtImpersonation ? 'high' : 'low', found: hasGovtImpersonation },
    ];

    const foundCount = indicators.filter(i => i.found).length;
    const riskScore = Math.round((foundCount / indicators.length) * 100);
    const riskLevel: 'high' | 'medium' | 'low' = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

    return {
      inputText: text,
      riskLevel,
      riskScore,
      indicators,
      recommendation: riskLevel === 'high'
        ? 'HIGH RISK: Do not respond or make any payment. Report to cybercrime.gov.in or call 1930.'
        : riskLevel === 'medium'
        ? 'CAUTION: Verify through official government portals before taking action.'
        : 'LOW RISK: No obvious indicators detected. Always verify through official channels.',
      disclaimer: 'Pattern-based analysis only. JANSAHAY cannot guarantee accuracy.',
    };
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    // Bridge: partial profile update → CitizenProfile update
    const cpUpdates: Partial<CitizenProfile> = {};
    if (updates.age) cpUpdates.age = updates.age;
    if (updates.state) cpUpdates.state = updates.state;
    if (updates.occupation) cpUpdates.occupation = updates.occupation as any;
    if (updates.income) cpUpdates.annualIncome = updates.income;
    if (updates.education) cpUpdates.education = updates.education;
    if (Object.keys(cpUpdates).length > 0) updateCitizenProfile(cpUpdates);
  }, [updateCitizenProfile]);

  return (
    <AppContext.Provider value={{
      isDemo: false,
      state,
      greeting,
      citizenProfile,
      updateCitizenProfile,
      rankedMatches,
      clearSession,
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

// ── Response Builder (Live Mode) ──────────────────────────────
function buildLiveResponse(
  input: string,
  extracted: Partial<CitizenProfile>,
  profile: CitizenProfile,
  matches: RankedSchemeMatch[]
): string {
  const parts: string[] = [];

  // Show what was understood
  const understood: string[] = [];
  if (extracted.age !== undefined) understood.push(`Age: ${extracted.age}`);
  if (extracted.state !== undefined) understood.push(`State: ${extracted.state}`);
  if (extracted.occupation !== undefined) understood.push(`Occupation: ${extracted.occupation}`);
  if (extracted.annualIncome !== undefined) understood.push(`Annual income: ₹${((extracted.annualIncome as number) / 100000).toFixed(1)}L`);
  if (extracted.education !== undefined) understood.push(`Education: ${extracted.education}`);
  if (extracted.gender !== undefined) understood.push(`Gender: ${extracted.gender}`);
  if (extracted.category !== undefined) understood.push(`Category: ${extracted.category}`);
  if (extracted.disability !== undefined && extracted.disability !== 'None') understood.push(`Disability: ${extracted.disability}`);

  if (understood.length > 0) {
    parts.push(`I understood:\n${understood.map(u => `• ${u}`).join('\n')}\n\n_Is this correct? You can correct any detail by typing it._`);
  }

  // Show matches
  const topMatches = matches.filter(m => m.tier !== 'not_eligible').slice(0, 3);
  if (topMatches.length > 0) {
    const highCount = matches.filter(m => m.tier === 'high').length;
    const totalRelevant = matches.filter(m => m.tier !== 'not_eligible').length;
    parts.push(`\nBased on your profile, I found **${totalRelevant} potentially relevant schemes**${highCount > 0 ? `, including **${highCount} high-confidence match${highCount > 1 ? 'es' : ''}**` : ''}:\n`);
    topMatches.forEach(m => {
      parts.push(`• **${m.scheme.name}** — ${m.displayScore}% readiness (${m.whyShown})`);
    });
  } else if (Object.keys(extracted).length > 0) {
    // We got profile updates but no matches yet
    const hasEnoughForMatching = (
      profile.age !== UNKNOWN ||
      profile.annualIncome !== UNKNOWN ||
      profile.occupation !== UNKNOWN
    );
    if (!hasEnoughForMatching) {
      parts.push(`\nTo find relevant schemes, I need a bit more information.`);
    }
  } else if (matches.length === 0 && profile.occupation === UNKNOWN && profile.state === UNKNOWN) {
    parts.push(`I can help you discover government schemes you may be eligible for. Please tell me:\n• Your age\n• Your state\n• Your occupation (student, farmer, employed, etc.)\n• Your approximate annual family income`);
  }

  // Generate follow-up question if needed
  if (matches.length > 0) {
    const followUp = generateFollowUpQuestion(profile, matches);
    if (followUp) {
      parts.push(`\n**${followUp}**`);
    }
  }

  // Disclaimer
  if (topMatches.length > 0) {
    parts.push(`\n_Preliminary assessment only. Final eligibility determined by the concerned government authority._`);
  }

  return parts.join('\n') || `Tell me about your situation — your age, state, occupation, and income — and I'll find government schemes you may be eligible for.`;
}
