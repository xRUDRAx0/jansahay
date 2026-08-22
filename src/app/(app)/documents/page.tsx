'use client';

// ============================================================
// Document Doctor — Real upload, extraction, profile update
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { useDemo } from '@/lib/demo/context';
import { UNKNOWN } from '@/types/engine';
import {
  Upload, FileText, CheckCircle2, AlertTriangle, X, RefreshCw,
  ArrowRight, Info, Shield, Zap, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────
type UploadState = 'idle' | 'uploading' | 'analyzing' | 'confirmation' | 'confirmed' | 'error';

interface ExtractedField {
  field: string;
  label: string;
  value: string;
  numericValue?: number;
  confidence: 'high' | 'medium' | 'low';
  sourceHint: string;
  profileKey?: string; // which CitizenProfile key this updates
}

interface AnalysisResult {
  documentType: string;
  confidence: 'high' | 'medium' | 'low';
  extractedFields: ExtractedField[];
  profileUpdates: Record<string, any>;
  warnings: string[];
  disclaimer: string;
  processingNote: string;
}

// ── Document type labels ──────────────────────────────────
const DOC_TYPE_LABELS: Record<string, string> = {
  income_certificate: '📄 Income Certificate',
  domicile_certificate: '🏠 Domicile/Residence Certificate',
  marksheet: '📊 Marksheet / Result',
  student_certificate: '🎓 Student / Bonafide Certificate',
  aadhaar: '🪪 Aadhaar Card',
  ration_card: '🗂️ Ration Card',
  land_record: '🌾 Land / Kisan Record',
  unknown: '📎 Document',
};

const CONFIDENCE_COLORS = {
  high: 'text-green-700 bg-green-50 border-green-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-red-700 bg-red-50 border-red-200',
};

// ── Allowed file types ────────────────────────────────────
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_SIZE_MB = 10;

export default function DocumentDoctorPage() {
  const { citizenProfile, updateCitizenProfile, rankedMatches, isDemo } = useDemo();

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedFields, setConfirmedFields] = useState<Set<string>>(new Set());
  const [eligibilityImpact, setEligibilityImpact] = useState<{ gained: string[]; blocked: string[]; stillMissing: string[] } | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File validation ───────────────────────────────────
  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only PDF, JPG, PNG files are supported.';
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File must be under ${MAX_SIZE_MB}MB.`;
    return null;
  }

  // ── Handle file selection ─────────────────────────────
  const handleFileSelect = useCallback(async (file: File) => {
    const err = validateFile(file);
    if (err) { setErrorMessage(err); setUploadState('error'); return; }

    setSelectedFile(file);
    setUploadState('uploading');
    setErrorMessage('');
    setAnalysisResult(null);
    setEligibilityImpact(null);
    setConfirmedFields(new Set());

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Short delay then analyze
    await new Promise(r => setTimeout(r, 600));
    setUploadState('analyzing');

    try {
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
      // Pre-select all high-confidence fields
      const preSelected = new Set<string>(
        result.extractedFields.filter(f => f.confidence === 'high').map(f => f.field)
      );
      setConfirmedFields(preSelected);
      setUploadState('confirmation');
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Analysis failed. Please try again or enter details manually.');
      setUploadState('error');
    }
  }, []);

  // ── Hackathon Instant Demo ────────────────────────────
  function loadDemoAadhaar() {
    const mockFile = new File(["dummy"], "aadhaar_card_alka.jpg", { type: "image/jpeg" });
    setSelectedFile(mockFile);
    
    // Fallback UI preview using inline SVG to exactly match the screenshot
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" style="background:white;font-family:sans-serif;">
      <rect width="100%" height="100%" fill="white"/>
      <rect x="20" y="20" width="360" height="10" fill="#146c36"/>
      <text x="30" y="60" font-size="18" font-weight="bold" fill="#000">Name</text>
      <text x="90" y="60" font-size="18" fill="#000">Alka</text>
      <text x="30" y="90" font-size="18" font-weight="bold" fill="#000">Female</text>
      <text x="110" y="90" font-size="18" fill="#000">Female</text>
      <text x="30" y="120" font-size="18" font-weight="bold" fill="#000">Date of Birth</text>
      <text x="150" y="120" font-size="18" fill="#000">01/05/1996</text>
      <text x="30" y="150" font-size="18" font-weight="bold" fill="#000">Address</text>
      <text x="110" y="150" font-size="18" fill="#000">Shalimar Bagh,</text>
      <text x="30" y="175" font-size="18" fill="#000">New Delhi, 110025</text>
      <rect x="20" y="190" width="360" height="4" fill="#d9241b"/>
    </svg>`;
    const base64Svg = "data:image/svg+xml;base64," + btoa(svgContent);
    setPreviewUrl(base64Svg); 
    
    const mockResult: AnalysisResult = {
      documentType: 'aadhaar',
      confidence: 'high',
      extractedFields: [
        { field: 'name', label: 'Name', value: 'Alka', confidence: 'high', sourceHint: 'Demo Mock', profileKey: 'name' },
        { field: 'gender', label: 'Gender', value: 'Female', confidence: 'high', sourceHint: 'Demo Mock', profileKey: 'gender' },
        { field: 'dob', label: 'Date of Birth', value: '01/05/1996', confidence: 'high', sourceHint: 'Demo Mock' },
        { field: 'address', label: 'Address', value: 'Shalimar Bagh, New Delhi, 110025', confidence: 'high', sourceHint: 'Demo Mock' },
        { field: 'state', label: 'State', value: 'Delhi', confidence: 'high', sourceHint: 'Demo Mock', profileKey: 'state' },
        { field: 'district', label: 'District', value: 'New Delhi', confidence: 'high', sourceHint: 'Demo Mock', profileKey: 'district' }
      ],
      profileUpdates: {
        name: 'Alka',
        gender: 'Female',
        age: 28,
        state: 'Delhi',
        district: 'New Delhi'
      },
      warnings: [],
      disclaimer: 'Simulated for presentation purposes.',
      processingNote: 'Demo mode active. Extraction simulated perfectly.'
    };
    
    setAnalysisResult(mockResult);
    const preSelected = new Set(mockResult.extractedFields.map(f => f.field));
    setConfirmedFields(preSelected);
    setUploadState('confirmation');
  }

  // ── Call server analysis API ──────────────────────────
  async function analyzeDocument(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/analyze-document', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Server error' }));
      throw new Error(err.error ?? 'Analysis failed');
    }

    const data = await res.json();

    // Normalize the response to ensure extractedFields always has the expected shape
    return {
      documentType: data.documentType || 'unknown',
      confidence: data.confidence || 'low',
      extractedFields: (data.extractedFields || []).map((f: any) => ({
        field: f.field || 'unknown',
        label: f.label || f.field || 'Unknown',
        value: String(f.value ?? ''),
        numericValue: f.numericValue ?? undefined,
        confidence: f.confidence || 'medium',
        sourceHint: f.sourceHint || 'Extracted',
        profileKey: f.field, // map field name as profile key
      })),
      profileUpdates: data.profileUpdates || {},
      warnings: data.warnings || [],
      disclaimer: data.disclaimer || 'Extracted information is preliminary.',
      processingNote: data.processingNote || 'Document processed.',
    };
  }

  // ── Confirm selected fields → update CitizenProfile ──
  function handleConfirm() {
    if (!analysisResult) return;

    const updates: Record<string, any> = {};
    for (const field of analysisResult.extractedFields) {
      if (confirmedFields.has(field.field) && field.profileKey) {
        const key = field.profileKey;
        const val = field.numericValue !== undefined ? field.numericValue : field.value;
        updates[key] = val;
      }
    }

    if (Object.keys(updates).length > 0) {
      updateCitizenProfile(updates);
    }

    // Add document to availableDocuments
    const docKey = analysisResult.documentType.replace('_', '');
    updateCitizenProfile({
      availableDocuments: [
        ...(citizenProfile.availableDocuments ?? []),
        analysisResult.documentType,
      ],
    });

    // Compute eligibility impact (which new schemes become accessible)
    const gained: string[] = [];
    const blocked: string[] = [];
    const stillMissing: string[] = [];

    for (const match of rankedMatches.slice(0, 8)) {
      const missingDocs = match.eligibility.criteriaResults.filter(r => r.status === 'UNKNOWN');
      if (missingDocs.length === 0 && match.tier !== 'not_eligible') {
        gained.push(match.scheme.name);
      } else if (match.tier === 'not_eligible') {
        blocked.push(match.scheme.name);
      } else if (missingDocs.length > 0) {
        stillMissing.push(match.scheme.name);
      }
    }

    setEligibilityImpact({ gained, blocked, stillMissing });
    setUploadState('confirmed');
  }

  // ── Drag & Drop handlers ──────────────────────────────
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function reset() {
    setUploadState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage('');
    setEligibilityImpact(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Doctor</h1>
          <p className="text-gray-600 mt-1">Upload a government document to extract information and check scheme eligibility.</p>
        </div>
        {isDemo && (
          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            🧪 Demo Mode
          </span>
        )}
      </div>

      {/* Disclaimer banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Privacy Notice:</strong> Your document is processed locally and is never permanently stored or transmitted to third-party servers. Extracted information is preliminary — it is <strong>NOT</strong> official verification.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT: Upload Zone */}
        <div className="space-y-4">

          {/* Drop Zone */}
          {(uploadState === 'idle' || uploadState === 'error') && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">Drop your document here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['PDF', 'JPG', 'PNG'].map(ext => (
                  <span key={ext} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{ext}</span>
                ))}
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">Max {MAX_SIZE_MB}MB</span>
              </div>
            </div>
          )}

          {/* Hackathon Demo Button */}
          {(uploadState === 'idle' || uploadState === 'error') && isDemo && (
             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
               <p className="text-sm font-medium text-blue-800 mb-2">Hackathon Presentation Mode</p>
               <button
                 onClick={loadDemoAadhaar}
                 className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
               >
                 ✨ Auto-load Demo Aadhaar
               </button>
             </div>
          )}

          {/* Supported document types */}
          {uploadState === 'idle' && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">Supported Documents</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(DOC_TYPE_LABELS).filter(([k]) => k !== 'unknown').map(([, label]) => (
                  <div key={label} className="text-sm text-gray-600 flex items-center gap-1.5">
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {uploadState === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Upload Failed</p>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                <button onClick={reset} className="mt-3 text-sm text-red-600 hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Try again
                </button>
              </div>
            </div>
          )}

          {/* Uploading / Analyzing */}
          {(uploadState === 'uploading' || uploadState === 'analyzing') && (
            <div className="border-2 border-blue-200 bg-blue-50 rounded-2xl p-10 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
              />
              <p className="font-semibold text-blue-800">
                {uploadState === 'uploading' ? 'Uploading document…' : 'Analyzing content…'}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {uploadState === 'analyzing' ? 'Extracting fields using pattern recognition' : 'Preparing for analysis'}
              </p>
            </div>
          )}

          {/* File preview */}
          {(uploadState === 'confirmation' || uploadState === 'confirmed') && selectedFile && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                {uploadState !== 'confirmed' && (
                  <button onClick={reset} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {previewUrl && (
                <img src={previewUrl} alt="Document preview" className="w-full rounded-xl border border-gray-100 max-h-64 object-contain" />
              )}
              {!previewUrl && (
                <div className="bg-gray-50 rounded-xl border border-gray-100 h-32 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">PDF — text preview not available</span>
                </div>
              )}
            </div>
          )}

          {/* Upload another after confirmed */}
          {uploadState === 'confirmed' && (
            <button
              onClick={reset}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload another document
            </button>
          )}
        </div>

        {/* RIGHT: Extraction & Confirmation */}
        <div className="space-y-4">

          {/* Waiting state */}
          {uploadState === 'idle' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 h-full flex flex-col items-center justify-center">
              <Shield className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">Upload a document to begin extraction</p>
              <p className="text-sm mt-1 text-gray-400">Extracted fields will appear here for your confirmation</p>
            </div>
          )}

          {/* Extraction Results + Confirmation */}
          {uploadState === 'confirmation' && analysisResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* Doc type header */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold">
                    {DOC_TYPE_LABELS[analysisResult.documentType] ?? '📎 Document'}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${CONFIDENCE_COLORS[analysisResult.confidence]}`}>
                    {analysisResult.confidence === 'high' ? 'High confidence' : analysisResult.confidence === 'medium' ? 'Medium confidence' : 'Low confidence'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{analysisResult.processingNote}</p>
              </div>

              {/* Extracted Fields — confirm each */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">Extracted Information</h4>
                  <span className="text-xs text-amber-600 font-medium">⚠ Not official verification</span>
                </div>

                {analysisResult.extractedFields.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No fields could be automatically extracted. Please update your profile manually.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analysisResult.extractedFields.map(field => (
                      <label key={field.field} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        confirmedFields.has(field.field) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                      }`}>
                        <input
                          type="checkbox"
                          checked={confirmedFields.has(field.field)}
                          onChange={e => {
                            const next = new Set(confirmedFields);
                            if (e.target.checked) next.add(field.field);
                            else next.delete(field.field);
                            setConfirmedFields(next);
                          }}
                          className="mt-0.5 accent-green-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{field.label}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${CONFIDENCE_COLORS[field.confidence]}`}>
                              {field.confidence}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 mt-0.5">{field.value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{field.sourceHint}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {analysisResult.warnings.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {analysisResult.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-amber-700">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
                  {analysisResult.disclaimer}
                </p>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirm & Update Profile
                {confirmedFields.size > 0 && (
                  <span className="ml-1 bg-white/20 rounded px-1.5 text-sm">{confirmedFields.size} fields</span>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Only checked fields will be added to your profile. You can uncheck any you want to skip.
              </p>
            </motion.div>
          )}

          {/* Confirmed — Eligibility Impact */}
          {uploadState === 'confirmed' && eligibilityImpact && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Profile Updated</p>
                  <p className="text-sm text-green-700">Document information added. Eligibility recalculated.</p>
                </div>
              </div>

              {/* Impact on schemes */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" /> Eligibility Impact
                </h4>

                {eligibilityImpact.gained.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">✅ Now Eligible / High Match</p>
                    {eligibilityImpact.gained.slice(0, 4).map(name => (
                      <div key={name} className="text-sm text-gray-700 py-1 border-b border-gray-50 last:border-0">{name}</div>
                    ))}
                  </div>
                )}

                {eligibilityImpact.stillMissing.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">⚠ Missing Info Remaining</p>
                    {eligibilityImpact.stillMissing.slice(0, 3).map(name => (
                      <div key={name} className="text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0">{name}</div>
                    ))}
                  </div>
                )}

                {eligibilityImpact.blocked.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">❌ Not Eligible</p>
                    {eligibilityImpact.blocked.slice(0, 3).map(name => (
                      <div key={name} className="text-sm text-gray-500 py-1 border-b border-gray-50 last:border-0">{name}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Link href="/discover/results" className="flex-1">
                  <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    View Updated Matches <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/eligibility" className="flex-1">
                  <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    Check Eligibility
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
