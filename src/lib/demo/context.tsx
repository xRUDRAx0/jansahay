'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
import {
  demoState as initialDemoState,
  demoScamAnalysis,
  demoAgentSteps,
  getGreeting,
} from './data';

interface DemoContextValue {
  isDemo: boolean;
  state: DemoState;
  greeting: string;
  
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
  
  // Profile
  updateProfile: (updates: Partial<Profile>) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialDemoState);
  const [agentSteps, setAgentSteps] = useState<AgentActivityStep[]>([]);
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  const greeting = getGreeting();

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

    // Simulate agent processing
    const activitySteps = await simulateAgentActivity();

    // Generate agent response based on content
    const agentResponse: AgentMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'agent',
      content: generateDemoResponse(content),
      timestamp: new Date().toISOString(),
      actions: [
        { id: 'act-view', label: 'View Matches', type: 'primary', action: 'navigate', data: { url: '/discover/results' } },
        { id: 'act-journey', label: 'Build Journey', type: 'secondary', action: 'journey', data: { serviceId: 'svc-001' } },
      ],
      activitySteps,
    };

    setState(prev => ({
      ...prev,
      conversations: [...prev.conversations, agentResponse],
    }));
  }, [simulateAgentActivity]);

  const uploadDocument = useCallback(async (file: File): Promise<DocumentAnalysis> => {
    // Simulate document processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      documentId: `doc-upload-${Date.now()}`,
      documentType: 'income_certificate',
      extractedFields: [
        { field: 'Name', value: 'Ananya Sharma', confidence: 'high', verified: true },
        { field: 'Income', value: '₹2,00,000', confidence: 'high', verified: true },
        { field: 'Issuing Authority', value: 'Tehsildar', confidence: 'high', verified: true },
        { field: 'Date', value: '2023-10-12', confidence: 'high', verified: true },
      ],
      matchedServices: [
        { serviceId: 'svc-001', serviceName: 'Student Education Assistance', matchLevel: 'high', relevance: 'Confirms income eligibility' },
        { serviceId: 'svc-002', serviceName: 'EWS Scholarship', matchLevel: 'high', relevance: 'Confirms EWS eligibility' },
        { serviceId: 'svc-004', serviceName: 'Housing Subsidy Scheme', matchLevel: 'needs-verification', relevance: 'Income qualifies but other criteria need check' },
      ],
      warnings: [
        'Digital signature not found. Manual verification might be required for high-stakes services.',
      ],
      confidence: 'high',
      verificationNote: 'Information extracted from document. Validity requires verification.',
    };
  }, []);

  const startJourney = useCallback((serviceId: string) => {
    // Demo: journey already exists
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
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (text.toLowerCase().includes('pay') || text.toLowerCase().includes('₹') || text.toLowerCase().includes('upi')) {
      return { ...demoScamAnalysis, inputText: text };
    }
    
    return {
      inputText: text,
      riskLevel: 'low',
      riskScore: 15,
      indicators: [
        { type: 'Payment Request', description: 'No payment request detected.', severity: 'low', found: false },
        { type: 'Urgency Tactics', description: 'No urgency language detected.', severity: 'low', found: false },
        { type: 'Suspicious Links', description: 'No suspicious links detected.', severity: 'low', found: false },
      ],
      recommendation: 'No obvious risk indicators detected. However, always verify information through official government channels before taking action.',
      disclaimer: 'This analysis is based on pattern recognition. JANSAHAY cannot guarantee absolute accuracy.',
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
        state,
        greeting,
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

// --- Demo Response Generator ---
function generateDemoResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('student') || lower.includes('education') || lower.includes('scholarship')) {
    return "Based on your profile, I found 3 potential matches. I've analyzed your situation and identified education assistance programs you may be eligible for.";
  }
  if (lower.includes('document') || lower.includes('certificate')) {
    return "I've checked your document status. You have 4 out of 5 required documents ready. The missing document is your Domicile Certificate, which is needed for the Student Education Assistance Program.";
  }
  if (lower.includes('journey') || lower.includes('progress')) {
    return "Your current journey for Education Assistance is 78% ready. The main blocker is the missing Domicile Certificate. Would you like me to help you plan the next steps?";
  }
  if (lower.includes('scam') || lower.includes('verify') || lower.includes('suspicious')) {
    return "I can help you verify suspicious messages. Please paste the message you'd like me to analyze, or navigate to the Verify section.";
  }
  if (lower.includes('help') || lower.includes('what can')) {
    return "I can help you discover public services you may be eligible for, check your documents, build a personalized journey, track applications, and verify suspicious messages. Just tell me about your situation!";
  }
  
  return "I understand your situation. Let me search for relevant services and build a personalized recommendation. Based on your profile as a 19-year-old student from Rajasthan with family income of ₹2 lakh, I've found several potential matches.";
}
