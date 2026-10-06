import { PreferredLanguage, IncomeType } from '../context/AuthContext';
import { maskSensitiveFinancialIdentifiers } from './calculators';
import { sanitizePii } from './piiSanitizer';

export interface DocumentExplanation {
  status?: 'success' | 'unreadable' | 'not_financial_document';
  document_type: string;
  detected_language?: 'English' | 'Hindi' | 'Marathi' | string;
  summary: string;
  key_fields: { label: string; value: string }[];
  important_terms_explained: { term: string; explanation: string }[];
  things_to_watch_out_for: string[];
  questions_you_may_want_to_ask: string[];
}

export interface DocumentExplainRequest {
  fileData?: string;
  mimeType?: string;
  fileName?: string;
  textContent?: string;
  language: PreferredLanguage;
}

export interface UserFinancialProfileContext {
  incomeType?: IncomeType;
  age?: number;
  location?: string;
  dreamJob?: string;
  annualCtc?: number | null;
  monthlyExpenses?: number | null;
  monthlyEmi?: number;
  currentSavings?: number | null;
  monthlyInvestments?: number;
  riskAppetite?: 'Conservative' | 'Balanced' | 'Aggressive';
  preferredLanguage?: PreferredLanguage;
}

export interface MentorChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'mentor'; text: string }>;
  userProfile?: UserFinancialProfileContext | null;
  language: PreferredLanguage;
}

/**
 * Shared AI Service Helper for DhanDrishti
 * Consolidates API calls, timeout handling, retries, and privacy masking for Document Explainer and AI Mentor.
 */
export const aiService = {
  /**
   * Explain an uploaded financial document (PDF/image) or pasted financial text
   */
  async explainFinancialDocument(req: DocumentExplainRequest): Promise<DocumentExplanation> {
    const attempt = async (): Promise<DocumentExplanation> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dhanadrishti_session_token') : null;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/document/explain', {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            fileData: req.fileData || '',
            mimeType: req.mimeType || 'text/plain',
            fileName: req.fileName || 'Financial Document',
            textContent: req.textContent ? sanitizePii(req.textContent) : '',
            language: req.language || 'English',
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${res.status}`);
        }

        const data = await res.json();
        if (!data || !data.explanation) {
          throw new Error('INVALID_EXPLANATION_RESPONSE');
        }

        const raw = data.explanation;
        return {
          status: raw.status || 'success',
          document_type: maskSensitiveFinancialIdentifiers(raw.document_type || 'Financial Document'),
          summary: maskSensitiveFinancialIdentifiers(raw.summary || ''),
          key_fields: Array.isArray(raw.key_fields)
            ? raw.key_fields.map((kf: { label: string; value: string }) => ({
                label: maskSensitiveFinancialIdentifiers(kf.label || ''),
                value: maskSensitiveFinancialIdentifiers(kf.value || ''),
              }))
            : [],
          important_terms_explained: Array.isArray(raw.important_terms_explained)
            ? raw.important_terms_explained.map((it: { term: string; explanation: string }) => ({
                term: maskSensitiveFinancialIdentifiers(it.term || ''),
                explanation: maskSensitiveFinancialIdentifiers(it.explanation || ''),
              }))
            : [],
          things_to_watch_out_for: Array.isArray(raw.things_to_watch_out_for)
            ? raw.things_to_watch_out_for.map((item: string) => maskSensitiveFinancialIdentifiers(item))
            : [],
          questions_you_may_want_to_ask: Array.isArray(raw.questions_you_may_want_to_ask)
            ? raw.questions_you_may_want_to_ask.map((item: string) => maskSensitiveFinancialIdentifiers(item))
            : [],
        };
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let lastError: unknown = null;
    for (let i = 0; i < 2; i++) {
      try {
        return await attempt();
      } catch (err) {
        lastError = err;
        if (i === 0) {
          await new Promise((r) => setTimeout(r, 800));
        }
      }
    }

    throw lastError || new Error('DOCUMENT_EXPLAIN_FAILED');
  },

  /**
   * Ask the AI Mentor with dynamic user dashboard context and chat history
   */
  async askAIMentor(req: MentorChatRequest): Promise<string> {
    const attempt = async (): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      try {
        // Strip out any personal identifiers like name/email/phone before sending
        const sanitizedContext = req.userProfile
          ? {
              incomeType: req.userProfile.incomeType || 'Salaried',
              age: req.userProfile.age,
              location: req.userProfile.location,
              dreamJob: req.userProfile.dreamJob ? sanitizePii(req.userProfile.dreamJob) : undefined,
              annualCtc: req.userProfile.annualCtc,
              monthlyExpenses: req.userProfile.monthlyExpenses,
              monthlyEmi: req.userProfile.monthlyEmi || 0,
              currentSavings: req.userProfile.currentSavings,
              monthlyInvestments: req.userProfile.monthlyInvestments,
              riskAppetite: req.userProfile.riskAppetite,
              preferredLanguage: req.language,
            }
          : {
              preferredLanguage: req.language,
            };

        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('dhanadrishti_session_token') : null;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/mentor/chat', {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            message: sanitizePii(req.message),
            history: req.history.slice(-8).map((m) => ({
              role: m.role,
              text: sanitizePii(m.text),
            })),
            userContext: sanitizedContext,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${res.status}`);
        }

        const data = await res.json();
        if (data && typeof data.reply === 'string' && data.reply.trim()) {
          return maskSensitiveFinancialIdentifiers(data.reply.trim());
        }

        throw new Error('EMPTY_MENTOR_RESPONSE');
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let lastError: unknown = null;
    for (let i = 0; i < 2; i++) {
      try {
        return await attempt();
      } catch (err) {
        lastError = err;
        if (i === 0) {
          await new Promise((r) => setTimeout(r, 700));
        }
      }
    }

    throw lastError || new Error('MENTOR_FAILED');
  },
};
