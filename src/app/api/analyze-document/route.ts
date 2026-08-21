import { NextResponse } from 'next/server';

interface AnalysisResult {
  documentType: 'income_certificate' | 'domicile_certificate' | 'marksheet' | 'student_certificate' | 'aadhaar' | 'ration_card' | 'land_record' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  extractedFields: Array<{
    field: string;
    label: string;
    value: string;
    numericValue?: number;
    confidence: 'high' | 'medium' | 'low';
    sourceHint: string;
  }>;
  profileUpdates: Record<string, any>;
  warnings: string[];
  disclaimer: string;
  processingNote: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    let textContent = '';
    
    // Attempt to read text for text/plain
    if (mimeType.startsWith('text/')) {
       textContent = await file.text();
    }

    const textToAnalyze = `${fileName} ${textContent}`.toLowerCase();

    // Type detection
    let docType: AnalysisResult['documentType'] = 'unknown';
    if (/(income certificate|aamdani|आय प्रमाण)/.test(textToAnalyze)) {
      docType = 'income_certificate';
    } else if (/(domicile|residence|निवास)/.test(textToAnalyze)) {
      docType = 'domicile_certificate';
    } else if (/(marksheet|result|grade|percentage)/.test(textToAnalyze)) {
      docType = 'marksheet';
    } else if (/(student|college|bonafide)/.test(textToAnalyze)) {
      docType = 'student_certificate';
    } else if (/(aadhaar|uid|unique identification)/.test(textToAnalyze)) {
      docType = 'aadhaar';
    } else if (/(kisan|land|khata|khasra)/.test(textToAnalyze)) {
      docType = 'land_record';
    }

    const isImage = mimeType.startsWith('image/');
    const extractedFields: AnalysisResult['extractedFields'] = [];
    const profileUpdates: Record<string, any> = {};

    if (!isImage && textContent) {
        const incomeMatch = textToAnalyze.match(/(?:annual income|yearly income|income|aamdani)[^\d]*(\d[\d,]+)/i);
        if (incomeMatch) {
            const valStr = incomeMatch[1].replace(/,/g, '');
            const numVal = parseInt(valStr, 10);
            if (!isNaN(numVal)) {
                extractedFields.push({
                    field: 'annualIncome',
                    label: 'Annual Income',
                    value: incomeMatch[1],
                    numericValue: numVal,
                    confidence: 'medium',
                    sourceHint: 'Pattern matched'
                });
                profileUpdates.annualIncome = numVal;
            }
        }
        
        const nameMatch = textContent.match(/(?:name|naam)[^a-z]*([A-Z][a-z]+ (?:[A-Z][a-z]+ )*[A-Z][a-z]+)/);
        if (nameMatch) {
            extractedFields.push({
                field: 'name',
                label: 'Name',
                value: nameMatch[1],
                confidence: 'medium',
                sourceHint: 'Pattern matched'
            });
            profileUpdates.name = nameMatch[1];
        }

        const stateMatch = textContent.match(/(delhi|rajasthan|maharashtra|gujarat|up|uttar pradesh)/i);
        if (stateMatch) {
            extractedFields.push({
                field: 'state',
                label: 'State',
                value: stateMatch[1],
                confidence: 'medium',
                sourceHint: 'Pattern matched'
            });
            profileUpdates.state = stateMatch[1];
        }

        const districtMatch = textContent.match(/(?:district|tehsil)[^a-z]*([A-Z][a-z]+)/);
        if (districtMatch) {
            extractedFields.push({
                field: 'district',
                label: 'District',
                value: districtMatch[1],
                confidence: 'medium',
                sourceHint: 'Pattern matched'
            });
            profileUpdates.district = districtMatch[1];
        }

        const pctMatch = textContent.match(/(?:percentage|%|marks)[^\d]*(\d+(?:\.\d+)?)/i);
        if (pctMatch) {
            extractedFields.push({
                field: 'percentage',
                label: 'Percentage',
                value: pctMatch[1],
                numericValue: parseFloat(pctMatch[1]),
                confidence: 'medium',
                sourceHint: 'Pattern matched'
            });
        }
    }

    const confidence = isImage ? 'low' : (extractedFields.length > 0 ? 'medium' : 'low');
    const processingNote = isImage 
      ? 'Image document uploaded. For accurate extraction, type details manually below.' 
      : 'Document processed locally using text pattern matching.';

    const result: AnalysisResult = {
      documentType: docType,
      confidence,
      extractedFields,
      profileUpdates,
      warnings: isImage ? ['Image text extraction not fully supported locally'] : [],
      disclaimer: 'Extracted information is preliminary. This is NOT official verification.',
      processingNote
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error analyzing document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
