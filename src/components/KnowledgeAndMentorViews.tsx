import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  PlayCircle,
  HeartPulse,
  HelpCircle,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Camera,
  FileText,
  Clock,
  RefreshCw,
  ShieldCheck,
  Save,
  Calculator,
  Layers,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useAuth, PreferredLanguage } from '../context/AuthContext';
import {
  TERM_O_PEDIA_ITEMS,
  TermItem,
  MYTH_FACT_ITEMS,
  formatINR,
  estimateMonthlyInHand,
} from '../config/financialData';
import { CURATED_VIDEOS, VideoLanguage, VideoTopic } from '../config/videos';
import { YouTubeEmbed } from './YouTubeEmbed';
import { maskSensitiveFinancialIdentifiers } from '../utils/calculators';
import { PlannersView } from './DashboardAndSimulators';
import { TermOPediaTab } from './Navbar';
import { getTranslation } from '../config/translations';
import { aiService, DocumentExplanation } from '../utils/aiService';

/**
 * CHANGE 11: AI Response Highlighting
 * Visually highlights important parts (key terms, figures/amounts/percentages, key actions, warnings)
 * without shortening or removing anything from the AI responses.
 * Highlights follow the active theme (light highlight on dark mode, dark highlight on light mode).
 */
export function renderHighlightedAIResponse(content: string): React.ReactNode {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const boldRegex = /\*\*(.*?)\*\*/g;
        const segments: { text: string; isBold: boolean }[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            segments.push({ text: line.substring(lastIndex, match.index), isBold: false });
          }
          segments.push({ text: match[1], isBold: true });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) {
          segments.push({ text: line.substring(lastIndex), isBold: false });
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {segments.map((seg, segIdx) => {
              if (seg.isBold) {
                return (
                  <strong key={segIdx} className="ai-strong-highlight">
                    {seg.text}
                  </strong>
                );
              }

              const highlightRegex = /(₹\s*[\d,]+(?:\.\d+)?|Rs\.?\s*[\d,]+|\d+(?:\.\d+)?%|Warning:|Caution:|Note:|Important:|महत्वपूर्ण:|सावधानी:|सूचना:|टीप:|लक्षात ठेवा:)/g;
              const subParts = seg.text.split(highlightRegex);

              return (
                <React.Fragment key={segIdx}>
                  {subParts.map((part, partIdx) => {
                    if (highlightRegex.test(part)) {
                      return (
                        <span key={partIdx} className="ai-key-highlight font-semibold">
                          {part}
                        </span>
                      );
                    }
                    return <span key={partIdx}>{part}</span>;
                  })}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

interface SavedDocumentExplanationItem extends DocumentExplanation {
  id: string;
  fileName: string;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

interface MythFactStructuredResult {
  verdict: 'Myth' | 'Fact' | 'Partly true / depends' | 'Cannot verify';
  short_answer: string;
  why: string;
  what_is_factual: string;
  what_depends_on_context: string;
  real_world_example: string;
  remember_this: string;
  common_mistake: string;
}

interface MythFactHistoryItem {
  id: string;
  statement: string;
  verdict: MythFactStructuredResult['verdict'];
  response: MythFactStructuredResult;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

interface QuizQuestion {
  id: string;
  termItem: TermItem;
  type: 'mcq' | 'mythfact';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanationLines: string[];
}

function buildQuizRound(
  items: TermItem[],
  language: 'English' | 'Hindi' | 'Marathi',
  seedOffset = 0
): QuizQuestion[] {
  if (items.length === 0) return [];
  const pool = [...items];
  // Deterministic or shuffled ordering
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (i * 7 + seedOffset * 13 + 3) % (i + 1);
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  const selected = pool.slice(0, Math.min(8, pool.length));
  return selected.map((termItem, idx) => {
    const useMythFact = idx % 2 === 1;
    if (useMythFact) {
      const promptPrefix =
        language === 'Hindi'
          ? `मिथक या तथ्य (${termItem.term}):`
          : language === 'Marathi'
          ? `गैरसमज की सत्य (${termItem.term}):`
          : `Myth or Fact (${termItem.term}):`;
      const options =
        language === 'Hindi'
          ? ['मिथक (Myth)', 'तथ्य (Fact)']
          : language === 'Marathi'
          ? ['गैरसमज (Myth)', 'सत्य (Fact)']
          : ['Myth', 'Fact'];
      return {
        id: `${termItem.id}-mf-${seedOffset}`,
        termItem,
        type: 'mythfact',
        prompt: `${promptPrefix} “${termItem.mythStatement[language]}”`,
        options,
        correctIndex: 0, // All mythStatements are common financial myths
        explanationLines: [
          termItem.shortDef[language],
          `${language === 'Hindi' ? 'याद रखें' : language === 'Marathi' ? 'लक्षात ठेवा' : 'Remember This'}: ${termItem.rememberThis[language]}`,
          `${language === 'Hindi' ? 'आम गलती' : language === 'Marathi' ? 'सामान्य चूक' : 'Common Mistake'}: ${termItem.commonMistake[language]}`,
        ],
      };
    }

    // Multiple-choice question using 3 distractors from TERM_O_PEDIA_ITEMS
    const distractors = TERM_O_PEDIA_ITEMS.filter((other) => other.id !== termItem.id)
      .slice(0, 3)
      .map((other) => other.shortDef[language]);
    const rawOptions = [termItem.shortDef[language], ...distractors];
    const rotateBy = (idx + seedOffset) % rawOptions.length;
    const rotatedOptions = [
      ...rawOptions.slice(rotateBy),
      ...rawOptions.slice(0, rotateBy),
    ];
    const correctIndex = rotatedOptions.indexOf(termItem.shortDef[language]);

    const promptText =
      language === 'Hindi'
        ? `“${termItem.term}” का सबसे सटीक अर्थ क्या है?`
        : language === 'Marathi'
        ? `“${termItem.term}” चे अचूक वर्णन कोणते आहे?`
        : `Which statement accurately explains “${termItem.term}”?`;

    return {
      id: `${termItem.id}-mcq-${seedOffset}`,
      termItem,
      type: 'mcq',
      prompt: promptText,
      options: rotatedOptions,
      correctIndex,
      explanationLines: [
        termItem.shortDef[language],
        `${language === 'Hindi' ? 'याद रखें' : language === 'Marathi' ? 'लक्षात ठेवा' : 'Remember This'}: ${termItem.rememberThis[language]}`,
        `${language === 'Hindi' ? 'उदाहरण' : language === 'Marathi' ? 'उदाहरण' : 'Indian Example'}: ${termItem.indianExample}`,
      ],
    };
  });
}

export const TermOPediaView: React.FC<{
  initialTab?: TermOPediaTab;
  onTabChange?: (tab: TermOPediaTab) => void;
}> = ({ initialTab = 'terms', onTabChange }) => {
  const { language } = useAuth();
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<TermOPediaTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Flashcards State (CHANGE 4)
  const [flashcardCategory, setFlashcardCategory] = useState<string>('All');
  const [flashcardDeck, setFlashcardDeck] = useState<TermItem[]>(TERM_O_PEDIA_ITEMS);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Simple Quiz State (CHANGE 4)
  const [quizCategory, setQuizCategory] = useState<string>('All');
  const [quizSeed, setQuizSeed] = useState<number>(1);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<
    { termItem: TermItem; isCorrect: boolean; chosenIndex: number }[]
  >([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSelectTab = (tab: TermOPediaTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const categories = ['All', 'Tax', 'Investing', 'Income', 'Credit', 'Business', 'Basics'];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All':
        return t.catAll;
      case 'Tax':
        return t.catTax;
      case 'Investing':
        return t.catInvesting;
      case 'Income':
        return t.catIncome;
      case 'Credit':
        return t.catCredit;
      case 'Business':
        return t.catBusiness;
      case 'Basics':
        return t.catBasics;
      default:
        return cat;
    }
  };

  // Update Flashcard deck when category changes
  useEffect(() => {
    const filtered =
      flashcardCategory === 'All'
        ? TERM_O_PEDIA_ITEMS
        : TERM_O_PEDIA_ITEMS.filter((item) => item.category === flashcardCategory);
    setFlashcardDeck(filtered);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
  }, [flashcardCategory]);

  const handleShuffleFlashcards = () => {
    setFlashcardDeck((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy;
    });
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
  };

  // Quiz pool & questions
  const quizPool =
    quizCategory === 'All'
      ? TERM_O_PEDIA_ITEMS
      : TERM_O_PEDIA_ITEMS.filter((item) => item.category === quizCategory);
  const quizQuestions = buildQuizRound(quizPool, language, quizSeed);
  const activeQuestion = quizQuestions[currentQuizIndex] || null;

  const handleResetQuiz = (nextSeed?: number) => {
    setQuizSeed((prev) => (nextSeed !== undefined ? nextSeed : prev + 1));
    setCurrentQuizIndex(0);
    setSelectedOptionIndex(null);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  const handleSelectQuizOption = (optionIndex: number) => {
    if (selectedOptionIndex !== null || !activeQuestion) return;
    setSelectedOptionIndex(optionIndex);
    const isCorrect = optionIndex === activeQuestion.correctIndex;
    setQuizAnswers((prev) => [
      ...prev,
      {
        termItem: activeQuestion.termItem,
        isCorrect,
        chosenIndex: optionIndex,
      },
    ]);
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const filteredTerms = TERM_O_PEDIA_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.term.toLowerCase().includes(q) ||
      item.shortDef[language].toLowerCase().includes(q) ||
      item.analogy.toLowerCase().includes(q) ||
      item.rememberThis[language].toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const currentFlashcard = flashcardDeck[currentCardIndex] || TERM_O_PEDIA_ITEMS[0];

  const subTabs: {
    id: TermOPediaTab;
    icon: React.ComponentType<{ className?: string }>;
    label: { English: string; Hindi: string; Marathi: string };
  }[] = [
    {
      id: 'terms',
      icon: BookOpen,
      label: { English: 'Terms', Hindi: 'शब्दावली (Terms)', Marathi: 'संज्ञा (Terms)' },
    },
    {
      id: 'flashcards',
      icon: Layers,
      label: { English: 'Flashcards', Hindi: 'फ्लैशकार्ड्स', Marathi: 'फ्लॅशकार्ड्स' },
    },
    {
      id: 'quiz',
      icon: HelpCircle,
      label: { English: 'Simple Quiz', Hindi: 'त्वरित प्रश्नोत्तरी (Quiz)', Marathi: 'सोपी प्रश्नमंजुषा (Quiz)' },
    },
    {
      id: 'planner',
      icon: Calculator,
      label: { English: 'Planner', Hindi: 'प्लानर और कैलकुलेटर', Marathi: 'प्लॅनर आणि कॅल्क्युलेटर' },
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Term-O-Pedia Hub Header & Sub-Navigation Tabs (CHANGE 3 & CHANGE 4) */}
      <div className="theme-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Comprehensive Indian Financial Lexicon & Knowledge Repository · Displaying {language}
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-feature-heading">
              Term-O-Pedia Financial Encyclopedia
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Review authoritative definitions, institutional Indian examples, practical analogies, interactive flashcard decks, and conceptual evaluation quizzes across all 6 core categories.
            </p>
          </div>

          {activeTab === 'terms' && (
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchTermsPlaceholder}
                className="w-full pl-10 pr-4 py-2 rounded-xl theme-input text-sm"
              />
            </div>
          )}
        </div>

        {/* Sub-navigation Tabs: Terms | Flashcards | Simple Quiz | Planner */}
        <div
          role="tablist"
          aria-label="Term-O-Pedia Sub-sections"
          className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-subtle)]"
        >
          {subTabs.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-emerald-500/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Category Filter for Terms Tab */}
        {activeTab === 'terms' && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-semibold'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUB-TAB 1: TERMS LIST */}
      {activeTab === 'terms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((item) => (
            <div key={item.id} className="theme-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.category}</span>
                  </span>
                  {item.professionTracks && item.professionTracks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.professionTracks.slice(0, 2).map((track) => (
                        <span
                          key={track}
                          className="px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-secondary)] font-medium"
                        >
                          {track}
                        </span>
                      ))}
                      {item.professionTracks.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[10px] text-[var(--text-muted)] font-medium">
                          +{item.professionTracks.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
                  {item.term}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.shortDef[language]}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-[var(--border-subtle)] text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">Everyday Analogy: </strong>
                  {item.analogy}
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-[var(--text-primary)]">
                  <strong className="text-emerald-600 dark:text-emerald-400">Indian Example: </strong>
                  {item.indianExample}
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[var(--text-primary)] callout-emphasis">
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {language === 'Hindi' ? 'याद रखें (Remember This): ' : language === 'Marathi' ? 'लक्षात ठेवा (Remember This): ' : 'Remember This: '}
                  </strong>
                  {item.rememberThis[language]}
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-[var(--text-primary)] callout-emphasis">
                  <strong className="text-rose-600 dark:text-rose-400">
                    {language === 'Hindi' ? 'आम गलती (Common Mistake): ' : language === 'Marathi' ? 'सामान्य चूक (Common Mistake): ' : 'Common Mistake: '}
                  </strong>
                  {item.commonMistake[language]}
                </div>

                {item.video && item.video[language] && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]/60">
                    <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[180px]">
                      {item.video[language].channel || 'Financial Guide'}
                    </span>
                    <a
                      href={
                        item.video[language].videoId
                          ? `https://www.youtube.com/watch?v=${item.video[language].videoId}`
                          : item.video[language].searchFallback
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="truncate max-w-[220px]">{item.video[language].title}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: FLASHCARDS (CHANGE 4) */}
      {activeTab === 'flashcards' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="theme-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFlashcardCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    flashcardCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
                Card {currentCardIndex + 1} of {flashcardDeck.length}
              </span>
              <button
                type="button"
                onClick={handleShuffleFlashcards}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {currentFlashcard && (
            <div
              role="button"
              tabIndex={0}
              aria-label={`Flashcard for ${currentFlashcard.term}. Click or press Enter to flip.`}
              onClick={() => setIsCardFlipped((f) => !f)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsCardFlipped((f) => !f);
                } else if (e.key === 'ArrowRight') {
                  setCurrentCardIndex((idx) => (idx + 1) % flashcardDeck.length);
                  setIsCardFlipped(false);
                } else if (e.key === 'ArrowLeft') {
                  setCurrentCardIndex((idx) => (idx - 1 + flashcardDeck.length) % flashcardDeck.length);
                  setIsCardFlipped(false);
                }
              }}
              className="theme-card rounded-3xl p-8 sm:p-10 min-h-[340px] flex flex-col justify-between cursor-pointer hover:border-emerald-500/50 transition-all select-none"
            >
              {!isCardFlipped ? (
                /* FRONT OF FLASHCARD */
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-6">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {currentFlashcard.category} · {language}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] max-w-xl">
                    {currentFlashcard.term}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] pt-2">
                    {language === 'Hindi'
                      ? 'परिभाषा, भारतीय उदाहरण, "याद रखें" और "आम गलती" देखने के लिए कार्ड पर क्लिक करें'
                      : language === 'Marathi'
                      ? 'व्याख्या, भारतीय उदाहरण, "लक्षात ठेवा" आणि "सामान्य चूक" पाहण्यासाठी कार्डवर क्लिक करा'
                      : 'Click card or press Flip to reveal plain-language definition, Indian example, Remember This & Common Mistake'}
                  </p>
                </div>
              ) : (
                /* BACK OF FLASHCARD */
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {currentFlashcard.term} ({language})
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">Back of Card</span>
                  </div>

                  <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed font-medium">
                    {currentFlashcard.shortDef[language]}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Real-Life Indian Example: </strong>
                    {currentFlashcard.indianExample}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 callout-emphasis text-[var(--text-primary)]">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {language === 'Hindi' ? 'याद रखें (REMEMBER THIS)' : language === 'Marathi' ? 'लक्षात ठेवा (REMEMBER THIS)' : 'REMEMBER THIS'}
                      </div>
                      <p>{currentFlashcard.rememberThis[language]}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 callout-emphasis text-[var(--text-primary)]">
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                        {language === 'Hindi' ? 'आम गलती (COMMON MISTAKE)' : language === 'Marathi' ? 'सामान्य चूक (COMMON MISTAKE)' : 'COMMON MISTAKE'}
                      </div>
                      <p>{currentFlashcard.commonMistake[language]}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-5 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{isCardFlipped ? 'Showing Answer & Key Takeaways' : 'Showing Term Front'}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {isCardFlipped ? 'Click to Flip to Front' : 'Click to Flip to Back'}
                </span>
              </div>
            </div>
          )}

          {/* Flashcard Controls: Previous, Flip, Next, Shuffle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((idx) => (idx - 1 + flashcardDeck.length) % flashcardDeck.length);
                setIsCardFlipped(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCardFlipped((f) => !f)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isCardFlipped ? 'Show Front' : 'Flip Card'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentCardIndex((idx) => (idx + 1) % flashcardDeck.length);
                setIsCardFlipped(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SIMPLE QUIZ (CHANGE 4) */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="theme-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setQuizCategory(cat);
                    handleResetQuiz(quizSeed + 1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    quizCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleResetQuiz()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Try another set</span>
            </button>
          </div>

          {!quizCompleted && activeQuestion && (
            <div className="theme-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {activeQuestion.termItem.category} · {activeQuestion.termItem.term}
                </span>
                <span className="font-mono font-semibold">
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text-primary)] leading-snug">
                {activeQuestion.prompt}
              </h2>

              <div className="space-y-3">
                {activeQuestion.options.map((opt, idx) => {
                  const isAnswered = selectedOptionIndex !== null;
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrectOption = idx === activeQuestion.correctIndex;

                  let btnStyle =
                    'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-emerald-500/50';
                  if (isAnswered) {
                    if (isCorrectOption) {
                      btnStyle =
                        'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 font-semibold';
                    } else if (isSelected) {
                      btnStyle =
                        'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/50 font-semibold';
                    } else {
                      btnStyle = 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)] opacity-75';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectQuizOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all cursor-pointer flex items-start justify-between gap-3 ${btnStyle}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {isAnswered && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Answer Feedback + 2-3 Line Why Explanation */}
              {selectedOptionIndex !== null && (
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {selectedOptionIndex === activeQuestion.correctIndex ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 verdict-badge">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {language === 'Hindi' ? 'सही उत्तर (Correct)' : language === 'Marathi' ? 'बरोबर उत्तर (Correct)' : 'Correct'}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 verdict-badge">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          {language === 'Hindi' ? 'पूरी तरह सही नहीं (Not quite)' : language === 'Marathi' ? 'अगदी बरोबर नाही (Not quite)' : 'Not quite'}
                        </span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                    {activeQuestion.explanationLines.map((line, lIdx) => (
                      <p key={lIdx} className={lIdx === 1 ? 'callout-emphasis text-emerald-600 dark:text-emerald-400' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuizQuestion}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                      <span>
                        {currentQuizIndex + 1 < quizQuestions.length
                          ? 'Next Question'
                          : 'View Summary'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz End Summary: Terms Got Right & Terms to Review */}
          {quizCompleted && (
            <div className="theme-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Self-Check Summary
                  </p>
                  <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
                    Quiz Round Complete
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Here is a summary of the concepts you answered accurately and any terms to review.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleResetQuiz()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try another set</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Terms You Got Right */}
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      TERMS YOU GOT RIGHT ({quizAnswers.filter((a) => a.isCorrect).length})
                    </span>
                  </div>
                  {quizAnswers.filter((a) => a.isCorrect).length === 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">
                      No terms in this column yet — review the explanations on the right and try another set.
                    </p>
                  ) : (
                    <ul className="space-y-2.5">
                      {quizAnswers
                        .filter((a) => a.isCorrect)
                        .map((a, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1"
                          >
                            <div className="text-sm font-semibold text-[var(--text-primary)]">
                              {a.termItem.term}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {a.termItem.rememberThis[language]}
                            </p>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                {/* Terms to Review */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      TERMS TO REVIEW ({quizAnswers.filter((a) => !a.isCorrect).length})
                    </span>
                  </div>
                  {quizAnswers.filter((a) => !a.isCorrect).length === 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">
                      You answered every term in this set accurately! Click “Try another set” to practice more concepts.
                    </p>
                  ) : (
                    <ul className="space-y-2.5">
                      {quizAnswers
                        .filter((a) => !a.isCorrect)
                        .map((a, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {a.termItem.term}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery(a.termItem.term);
                                  setSelectedCategory('All');
                                  handleSelectTab('terms');
                                }}
                                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                              >
                                Review Term
                              </button>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {a.termItem.shortDef[language]}
                            </p>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PLANNER (Calculators & Planning Roadmap) */}
      {activeTab === 'planner' && <PlannersView embedded />}
    </div>
  );
};

export const ExplainerView: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { user, token, language } = useAuth();
  const [selectedLang, setSelectedLang] = useState<'All' | VideoLanguage>('All');
  const [selectedTopic, setSelectedTopic] = useState<'All' | VideoTopic>('All');

  // Financial Document Explainer state (ITEM 2 & ITEM 3)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeBytes: number;
    mimeType: string;
    base64Data: string;
    previewUrl: string | null;
    pageCount: number | null;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isExplainingDoc, setIsExplainingDoc] = useState(false);
  const [docExplainError, setDocExplainError] = useState<string | null>(null);
  const [docExplanation, setDocExplanation] = useState<DocumentExplanation | null>(null);
  const [savedDocExplanations, setSavedDocExplanations] = useState<SavedDocumentExplanationItem[]>([]);
  const [isSavingDocExplanation, setIsSavingDocExplanation] = useState(false);
  const [docSaveFeedback, setDocSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      setSavedDocExplanations([]);
      return;
    }
    fetch('/api/document/saved', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.savedExplanations)) {
          setSavedDocExplanations(d.savedExplanations);
        }
      })
      .catch(() => {});
  }, [user, token]);

  const handleSaveDocExplanation = async () => {
    if (!user || !token || !docExplanation || isSavingDocExplanation) return;
    setIsSavingDocExplanation(true);
    setDocSaveFeedback(null);
    try {
      const res = await fetch('/api/document/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: selectedFile?.name || (inputMode === 'text' ? 'Pasted Financial Text' : docExplanation.document_type) || 'Financial Document',
          explanation: docExplanation,
          language,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      if (data && data.savedEntry) {
        setSavedDocExplanations((prev) => [
          data.savedEntry,
          ...prev.filter((item) => item.id !== data.savedEntry.id),
        ]);
        setDocSaveFeedback('Explanation text saved to your account (the uploaded file itself was not stored).');
      }
    } catch {
      setDocSaveFeedback('Could not save the explanation right now. Please try again.');
    } finally {
      setIsSavingDocExplanation(false);
    }
  };

  const ALLOWED_MIMES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelection = (file: File | undefined | null) => {
    if (!file) return;
    setFileError(null);
    setDocExplainError(null);
    setDocExplanation(null);
    setInputMode('file');

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const inferredMime =
      file.type ||
      (ext === 'pdf'
        ? 'application/pdf'
        : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
        ? 'image/webp'
        : ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : '');

    if (!ALLOWED_MIMES.includes(inferredMime.toLowerCase())) {
      setSelectedFile(null);
      setFileError(
        'Unsupported file format. Please upload a PDF, JPG, JPEG, PNG, or WEBP document.'
      );
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setSelectedFile(null);
      setFileError(
        `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`
      );
      return;
    }

    if (file.size === 0) {
      setSelectedFile(null);
      setFileError('The selected file is empty. Please choose a valid document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, '');
      const isPdf = inferredMime.toLowerCase() === 'application/pdf';

      if (isPdf) {
        try {
          const binaryStr = atob(base64Data);
          const matches = binaryStr.match(/\/Type\s*\/Page\b/g);
          const detectedPages = matches && matches.length > 0 ? matches.length : 1;
          setSelectedFile({
            name: file.name,
            sizeBytes: file.size,
            mimeType: 'application/pdf',
            base64Data,
            previewUrl: null,
            pageCount: detectedPages,
          });
        } catch {
          setSelectedFile({
            name: file.name,
            sizeBytes: file.size,
            mimeType: 'application/pdf',
            base64Data,
            previewUrl: null,
            pageCount: 1,
          });
        }
      } else {
        setSelectedFile({
          name: file.name,
          sizeBytes: file.size,
          mimeType: inferredMime.toLowerCase(),
          base64Data,
          previewUrl: dataUrl,
          pageCount: null,
        });
      }
    };
    reader.onerror = () => {
      setFileError('Could not read the selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const explainSelectedDocument = async () => {
    if (isExplainingDoc) return;
    if (inputMode === 'file' && !selectedFile) return;
    if (inputMode === 'text' && !pastedText.trim()) {
      setFileError('Please paste or type some financial text to explain.');
      return;
    }

    setIsExplainingDoc(true);
    setDocExplainError(null);
    setFileError(null);

    try {
      const result = await aiService.explainFinancialDocument(
        inputMode === 'text'
          ? {
              textContent: pastedText.trim(),
              mimeType: 'text/plain',
              fileName: 'Pasted Financial Text',
              language,
            }
          : {
              fileData: selectedFile!.base64Data,
              mimeType: selectedFile!.mimeType,
              fileName: selectedFile!.name,
              language,
            }
      );
      setDocExplanation(result);
    } catch {
      setDocExplainError(
        language === 'Hindi'
          ? 'अभी दस्तावेज़ का विश्लेषण करने में समस्या आ रही है। कृपया पुनः प्रयास करें।'
          : language === 'Marathi'
          ? 'सध्या कागदपत्राचे विश्लेषण करताना अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.'
          : 'We could not analyze this document right now. Please verify your Gemini API key and tap Retry.'
      );
    } finally {
      setIsExplainingDoc(false);
    }
  };

  const topics: ('All' | VideoTopic)[] = [
    'All',
    'Financial Literacy & RBI',
    'Mutual Funds & SIP',
    'Personal Finance & Budgeting',
    'Stock Market Basics',
    'Emergency Fund & Wealth',
  ];

  const filteredVideos = CURATED_VIDEOS.filter((v) => {
    const langMatch = selectedLang === 'All' || v.language === selectedLang;
    const topicMatch = selectedTopic === 'All' || v.topic === selectedTopic;
    return langMatch && topicMatch;
  });

  return (
    <div className={embedded ? 'space-y-8' : 'max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8'}>
      {/* Financial Document Explainer (ITEM 2) */}
      <div className="theme-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              AI OCR & Financial Jargon Decoder · Explaining in {language}
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              Financial Document Explainer
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Upload a salary slip, Form 16, bank statement, loan agreement, insurance policy, credit card bill, or GST invoice (PDF, JPG, PNG, WEBP up to 10 MB), or paste financial text.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setInputMode('file');
                setFileError(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                inputMode === 'file'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              Upload Document
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('text');
                setFileError(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                inputMode === 'text'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Privacy & Identifier Masking Notice (ITEM 3) */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs text-[var(--text-primary)]">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-600 dark:text-emerald-400">Privacy & Data Protection: </strong>
            Your input is processed in memory for this single request only and is never stored on our servers. Sensitive numbers (PAN, Aadhaar, Bank Account, Phone, Email, and Card numbers) are automatically masked.
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => {
            handleFileSelection(e.target.files?.[0]);
            e.target.value = '';
          }}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            handleFileSelection(e.target.files?.[0]);
            e.target.value = '';
          }}
          className="hidden"
        />

        {/* Input Option 1: Drag and Drop Upload Area */}
        {inputMode === 'file' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelection(e.dataTransfer.files?.[0]);
            }}
            className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-[var(--border-strong)] bg-[var(--bg-secondary)]'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Drag and drop your financial document here
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Supported formats: PDF, JPG, JPEG, PNG, WEBP · Maximum file size: 10 MB
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={isExplainingDoc}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Choose file</span>
                </button>
                <button
                  type="button"
                  disabled={isExplainingDoc}
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-card)] hover:border-emerald-500/50 disabled:opacity-60 text-xs sm:text-sm font-medium text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>Use Camera</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Option 2: Pasted Text Area */}
        {inputMode === 'text' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
            <label className="block text-xs font-semibold text-[var(--text-primary)]">
              Paste Financial Text (SMS alert, bank notice, loan terms, salary details, or invoice text)
            </label>
            <textarea
              rows={5}
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setFileError(null);
              }}
              placeholder="e.g., Dear customer, your loan EMI of ₹14,500 is due on 05-Nov. Outstanding principal is ₹4,20,000 at 9.5% p.a. Late fee of ₹500 applies after due date..."
              className="w-full px-4 py-3 rounded-xl theme-input text-xs sm:text-sm focus:outline-none resize-y"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--text-muted)]">
                {pastedText.length} characters
              </span>
              <div className="flex items-center gap-2">
                {pastedText && (
                  <button
                    type="button"
                    onClick={() => {
                      setPastedText('');
                      setDocExplanation(null);
                      setDocExplainError(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  disabled={isExplainingDoc || !pastedText.trim()}
                  onClick={explainSelectedDocument}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isExplainingDoc ? 'Explaining...' : 'Explain this text'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Client Validation Error */}
        {fileError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Selected File Preview & Action Button */}
        {inputMode === 'file' && selectedFile && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {selectedFile.previewUrl ? (
                <img
                  src={selectedFile.previewUrl}
                  alt={selectedFile.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-[var(--border-subtle)] shrink-0 bg-slate-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FileText className="w-6 h-6" />
                  <span className="text-xs font-mono font-semibold mt-0.5">PDF</span>
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <span>{formatFileSize(selectedFile.sizeBytes)}</span>
                  {selectedFile.pageCount !== null && (
                    <>
                      <span>·</span>
                      <span>
                        {selectedFile.pageCount} {selectedFile.pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isExplainingDoc}
                onClick={() => {
                  setSelectedFile(null);
                  setDocExplanation(null);
                  setDocExplainError(null);
                }}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-60 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={isExplainingDoc}
                onClick={explainSelectedDocument}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isExplainingDoc ? 'Scanning & Explaining...' : 'Explain this document'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isExplainingDoc && (
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
            <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0" />
            <span>
              Reading visible fields, translating financial jargon, and preparing your structured summary in {language}...
            </span>
          </div>
        )}

        {/* Friendly Error State with Retry Button */}
        {docExplainError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-rose-600 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{docExplainError}</span>
            </div>
            <button
              type="button"
              disabled={isExplainingDoc}
              onClick={explainSelectedDocument}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Structured Document Explanation Result */}
        {docExplanation && (
          <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
            {(docExplanation.status === 'unreadable' ||
              docExplanation.status === 'not_financial_document') && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs sm:text-sm text-amber-600 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {docExplanation.status === 'unreadable'
                    ? 'Notice: This image or document appears blurry or partially unreadable. Only clearly legible text (if any) is shown below.'
                    : 'Notice: This file does not appear to be a standard financial document. Please upload a salary slip, Form 16, bank statement, loan agreement, insurance policy, or invoice.'}
                </span>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Detected Document Type: {maskSensitiveFinancialIdentifiers(docExplanation.document_type)}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[var(--text-muted)]">
                    Extracted strictly from visible content · Sensitive IDs masked
                  </span>
                  {user && (
                    <button
                      type="button"
                      disabled={isSavingDocExplanation}
                      onClick={handleSaveDocExplanation}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>
                        {isSavingDocExplanation ? 'Saving...' : 'Save explanation to my account'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {maskSensitiveFinancialIdentifiers(docExplanation.summary)}
              </p>
              {docSaveFeedback && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  {docSaveFeedback}
                </p>
              )}
            </div>

            {/* Key Fields Extracted */}
            {docExplanation.key_fields && docExplanation.key_fields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-display font-bold text-[var(--text-primary)]">
                  Key Fields Found in Document
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {docExplanation.key_fields.map((kf, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col justify-between gap-1"
                    >
                      <span className="text-xs text-[var(--text-muted)]">
                        {maskSensitiveFinancialIdentifiers(kf.label)}
                      </span>
                      <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                        {maskSensitiveFinancialIdentifiers(kf.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Terms Explained */}
            {docExplanation.important_terms_explained &&
              docExplanation.important_terms_explained.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-display font-bold text-[var(--text-primary)]">
                    Important Terms Explained Simply
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docExplanation.important_terms_explained.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1"
                      >
                        <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {maskSensitiveFinancialIdentifiers(item.term)}
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {maskSensitiveFinancialIdentifiers(item.explanation)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Things to Watch Out For & Questions to Ask */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docExplanation.things_to_watch_out_for &&
                docExplanation.things_to_watch_out_for.length > 0 && (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>THINGS TO WATCH OUT FOR</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] list-disc list-inside">
                      {docExplanation.things_to_watch_out_for.map((watchItem, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {maskSensitiveFinancialIdentifiers(watchItem)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {docExplanation.questions_you_may_want_to_ask &&
                docExplanation.questions_you_may_want_to_ask.length > 0 && (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <HelpCircle className="w-4 h-4" />
                      <span>QUESTIONS YOU MAY WANT TO ASK</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)] list-disc list-inside">
                      {docExplanation.questions_you_may_want_to_ask.map((qItem, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {maskSensitiveFinancialIdentifiers(qItem)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Saved Document Explanations for Logged-In User */}
        {user && savedDocExplanations.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your Saved Document Explanations (Text Only · Files Never Stored)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedDocExplanations.slice(0, 6).map((saved) => (
                <button
                  key={saved.id}
                  type="button"
                  onClick={() => {
                    setDocExplanation(saved);
                    setDocSaveFeedback(null);
                  }}
                  className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-emerald-500/50 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {saved.fileName} · {saved.document_type}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {saved.summary}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {saved.language}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="theme-card rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Verified Indian Financial Literacy Videos · RBI, Zerodha Varsity, CA Rachana Ranade & Pranjal Kamra
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              Video Explainer Hub
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Privacy-enhanced embeds (youtube-nocookie.com) with instant fallback cards and multilingual filters (Preferred: {language}).
            </p>
          </div>

          {/* Language Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] self-start">
            {(['All', 'English', 'Hindi', 'Marathi'] as const).map((langOpt) => (
              <button
                key={langOpt}
                type="button"
                onClick={() => setSelectedLang(langOpt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedLang === langOpt
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {langOpt}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedTopic === t
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="theme-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <PlayCircle className="w-3.5 h-3.5" />
                  {video.channel}
                </span>
                <span>
                  {video.topic} · {video.language} · {video.duration}
                </span>
              </div>
              <h2 className="text-lg font-display font-bold text-[var(--text-primary)] leading-snug">
                {video.title}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {video.description}
              </p>
            </div>

            <YouTubeEmbed
              videoId={video.videoId}
              title={video.title}
              description={video.description}
              channel={video.channel}
              language={video.language}
              topic={video.topic}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const HealthAssessmentView: React.FC = () => {
  const { user } = useAuth();
  const [hasTermInsurance, setHasTermInsurance] = useState(true);
  const [hasHealthInsurance, setHasHealthInsurance] = useState(true);
  const [zeroHighInterestDebt, setZeroHighInterestDebt] = useState(true);

  const ctc = user?.annualCtc ?? 1200000;
  const expenses = user?.monthlyExpenses ?? 35000;
  const savings = user?.currentSavings ?? 200000;
  const inHand = estimateMonthlyInHand(ctc);
  const surplus = Math.max(0, inHand - expenses);
  const savingsRatio = inHand > 0 ? (surplus / inHand) * 100 : 0;
  const emergencyMonths = expenses > 0 ? savings / expenses : 6;

  // Score calculation out of 100
  const savingsPoints = Math.min(30, Math.round((savingsRatio / 30) * 30));
  const emergencyPoints = Math.min(25, Math.round((Math.min(6, emergencyMonths) / 6) * 25));
  const termPoints = hasTermInsurance ? 15 : 0;
  const healthPoints = hasHealthInsurance ? 15 : 0;
  const debtPoints = zeroHighInterestDebt ? 15 : 0;
  const totalScore = savingsPoints + emergencyPoints + termPoints + healthPoints + debtPoints;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="theme-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Diagnostic Assessment Based on Your Saved Profile
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              6-Pillar Financial Health Score
            </h1>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <HeartPulse className="w-7 h-7 text-emerald-500" />
            <div>
              <div className="text-xs text-[var(--text-muted)]">Overall Score</div>
              <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {totalScore} / 100
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-base font-display font-bold text-[var(--text-primary)]">
              Automated Profile Metrics
            </h2>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">Monthly Savings Rate ({Math.round(savingsRatio)}%)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{savingsPoints} / 30 pts</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Monthly Surplus: {formatINR(surplus)} out of {formatINR(inHand)} est. in-hand.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)]">
                  Emergency Buffer ({emergencyMonths.toFixed(1)} months covered)
                </span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">{emergencyPoints} / 25 pts</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Current Savings: {formatINR(savings)} vs 6-month target {formatINR(expenses * 6)}.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-display font-bold text-[var(--text-primary)]">
              Protection & Liability Checklist
            </h2>

            {[
              {
                label: 'Pure Term Life Insurance (10–15× Annual Income)',
                checked: hasTermInsurance,
                toggle: () => setHasTermInsurance(!hasTermInsurance),
                pts: 15,
              },
              {
                label: 'Independent Family Floater Health Insurance (₹10L+ Cover)',
                checked: hasHealthInsurance,
                toggle: () => setHasHealthInsurance(!hasHealthInsurance),
                pts: 15,
              },
              {
                label: 'Zero Revolving Credit Card / Personal Loan Debt (>14% APR)',
                checked: zeroHighInterestDebt,
                toggle: () => setZeroHighInterestDebt(!zeroHighInterestDebt),
                pts: 15,
              },
            ].map((item, idx) => (
              <label
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={item.toggle}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-[var(--text-primary)] font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                  +{item.pts} pts
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MythFactView: React.FC = () => {
  const { user, token, language } = useAuth();
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Custom statement checker state (ITEM 1)
  const [statementInput, setStatementInput] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [lastSubmittedStatement, setLastSubmittedStatement] = useState<string>('');
  const [checkedResult, setCheckedResult] = useState<{
    statement: string;
    data: MythFactStructuredResult;
  } | null>(null);
  const [history, setHistory] = useState<MythFactHistoryItem[]>([]);

  useEffect(() => {
    if (!user || !token) {
      setHistory([]);
      return;
    }
    fetch('/api/mythfact/history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.history)) {
          setHistory(d.history);
        }
      })
      .catch(() => {});
  }, [user, token]);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getVerdictStyle = (verdict: MythFactStructuredResult['verdict']) => {
    switch (verdict) {
      case 'Myth':
        return {
          container: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
          icon: XCircle,
          label: 'VERDICT: MYTH',
        };
      case 'Fact':
        return {
          container: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          icon: CheckCircle2,
          label: 'VERDICT: FACT',
        };
      case 'Partly true / depends':
        return {
          container: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          icon: AlertTriangle,
          label: 'VERDICT: PARTLY TRUE / DEPENDS',
        };
      default:
        return {
          container: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
          icon: HelpCircle,
          label: 'VERDICT: CANNOT VERIFY',
        };
    }
  };

  const runStatementCheck = async (rawStatement: string) => {
    if (isChecking) return;
    setValidationMessage(null);
    setCheckError(null);

    const trimmed = rawStatement.trim();
    if (!trimmed || trimmed.length < 5) {
      setValidationMessage(
        language === 'Hindi'
          ? 'कृपया जांचने के लिए कम से कम 5 अक्षरों का वित्तीय कथन लिखें।'
          : language === 'Marathi'
          ? 'कृपया तपासण्यासाठी किमान ५ अक्षरांचे आर्थिक विधान लिहा.'
          : 'Please enter a complete financial statement (at least 5 characters) to check.'
      );
      return;
    }

    if (trimmed.length > 500) {
      setValidationMessage(
        language === 'Hindi'
          ? 'कथन बहुत लंबा है। कृपया इसे 500 अक्षरों के भीतर रखें।'
          : language === 'Marathi'
          ? 'विधान खूप मोठे आहे. कृपया ५०० अक्षरांच्या आत ठेवा.'
          : 'Your statement is a bit too long. Please keep it under 500 characters.'
      );
      return;
    }

    setLastSubmittedStatement(trimmed);
    setIsChecking(true);

    const fetchWithTimeout = async (): Promise<{
      result: MythFactStructuredResult;
      savedEntry?: MythFactHistoryItem | null;
    }> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 22000);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch('/api/mythfact/check', {
          method: 'POST',
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            statement: trimmed,
            language,
          }),
        });
        if (!res.ok) {
          throw new Error('Myth/Fact check failed');
        }
        const data = await res.json();
        if (!data || !data.result || typeof data.result.short_answer !== 'string') {
          throw new Error('Invalid response');
        }
        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    let responseData: {
      result: MythFactStructuredResult;
      savedEntry?: MythFactHistoryItem | null;
    } | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        responseData = await fetchWithTimeout();
        break;
      } catch {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }

    if (responseData) {
      setCheckedResult({
        statement: trimmed,
        data: responseData.result,
      });
      if (responseData.savedEntry) {
        setHistory((prev) => [responseData!.savedEntry!, ...prev.filter((h) => h.id !== responseData!.savedEntry!.id)]);
      }
    } else {
      setCheckError(
        language === 'Hindi'
          ? 'अभी इस कथन की जांच करने में थोड़ा समय लग रहा है। कृपया पुनः प्रयास करें।'
          : language === 'Marathi'
          ? 'सध्या हे विधान तपासताना अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.'
          : 'We could not verify this statement right now. Please tap Retry to try again.'
      );
    }

    setIsChecking(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="theme-card rounded-2xl p-6 space-y-1.5">
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Busting Popular Indian Money Misconceptions · Responding in {language}
        </p>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
          Personal Finance Myth vs Fact
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Check your own financial statement below or click any curated card to compare street myths with RBI/SEBI-backed reality.
        </p>
      </div>

      {/* ITEM 1: "Check If Myth or Fact" — User Statement Evaluator */}
      <div className="theme-card rounded-2xl p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Check If Myth or Fact · English, Hindi & Marathi Supported</span>
          </div>
          <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
            Test Any Financial Belief or Claim
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Type any money rule, WhatsApp forward, or belief (e.g., “SIP is guaranteed to give 12% returns” or “You should never take a loan”) for a structured RBI/SEBI-grounded fact check.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runStatementCheck(statementInput);
          }}
          className="space-y-3"
          noValidate
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={statementInput}
              onChange={(e) => {
                setStatementInput(e.target.value);
                if (validationMessage) setValidationMessage(null);
              }}
              placeholder="e.g., SIP is guaranteed to give 12% returns..."
              className="flex-1 px-4 py-2.5 rounded-xl theme-input text-sm"
            />
            <button
              type="submit"
              disabled={isChecking}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isChecking ? 'Checking...' : 'Check Statement'}</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-2">
              <span>Try:</span>
              {[
                'SIP is guaranteed to give 12% returns',
                'You should never take a loan',
                'Checking my own CIBIL score lowers it',
              ].map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isChecking}
                  onClick={() => {
                    setStatementInput(sample);
                    runStatementCheck(sample);
                  }}
                  className="underline hover:text-[var(--text-primary)] cursor-pointer"
                >
                  “{sample}”
                </button>
              ))}
            </div>
            <span className={`font-mono ${statementInput.length > 500 ? 'text-rose-500 font-semibold' : ''}`}>
              {statementInput.length}/500
            </span>
          </div>
        </form>

        {validationMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationMessage}</span>
          </div>
        )}

        {isChecking && (
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3 text-xs sm:text-sm text-[var(--text-secondary)]">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0" />
            <span>Evaluating statement against Indian financial regulations (RBI, SEBI, Income Tax)...</span>
          </div>
        )}

        {checkError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-rose-600 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{checkError}</span>
            </div>
            <button
              type="button"
              disabled={isChecking}
              onClick={() => runStatementCheck(lastSubmittedStatement || statementInput)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Structured Result Card matching existing Myth/Fact design */}
        {checkedResult && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
            {(() => {
              const badge = getVerdictStyle(checkedResult.data.verdict);
              const VerdictIcon = badge.icon;
              return (
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--text-muted)]">Statement: </span>
                      <strong className="text-[var(--text-primary)]">“{checkedResult.statement}”</strong>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border verdict-badge ${badge.container}`}
                    >
                      <VerdictIcon className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                    <p className="callout-emphasis font-semibold text-[var(--text-primary)]">
                      {checkedResult.data.short_answer}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <strong>Why: </strong>
                      {checkedResult.data.why}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        WHAT IS FACTUAL
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">
                        {checkedResult.data.what_is_factual}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        WHAT DEPENDS ON CONTEXT
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">
                        {checkedResult.data.what_depends_on_context}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
                      <div className="text-xs font-bold text-[var(--text-secondary)]">
                        REAL-WORLD INDIAN EXAMPLE
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {checkedResult.data.real_world_example}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1 callout-emphasis">
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        COMMON MISTAKE TO AVOID
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">
                        {checkedResult.data.common_mistake}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 callout-emphasis text-[var(--text-primary)]">
                    <strong className="text-emerald-600 dark:text-emerald-400">Remember This: </strong>
                    {checkedResult.data.remember_this}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Logged-in User Saved History */}
        {user && history.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Your Recent Checked Statements (Saved to Account)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {history.slice(0, 6).map((h) => {
                const badge = getVerdictStyle(h.verdict);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() =>
                      setCheckedResult({
                        statement: h.statement,
                        data: h.response,
                      })
                    }
                    className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-emerald-500/50 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        “{h.statement}”
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                        {h.response.short_answer}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md border text-xs font-bold shrink-0 ${badge.container}`}
                    >
                      {h.verdict}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Existing Pre-Written Myth/Fact Statements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MYTH_FACT_ITEMS.map((item) => {
          const isRevealed = Boolean(revealedIds[item.id]);
          return (
            <div
              key={item.id}
              onClick={() => toggleReveal(item.id)}
              className="theme-card rounded-2xl p-6 space-y-4 cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{item.category}</span>
                <span className="underline">
                  {isRevealed ? 'Showing Verified Fact' : 'Click to Reveal Fact'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>COMMON MYTH</span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.myth}</p>
              </div>

              <div
                className={`p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 transition-all ${
                  isRevealed ? 'opacity-100' : 'opacity-85'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>REALITY & FACT</span>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.fact}</p>
                <p className="text-xs text-[var(--text-secondary)] pt-1 border-t border-emerald-500/20">
                  <strong>Why: </strong>
                  {item.proof}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AIMentorView: React.FC = () => {
  const { user, language } = useAuth();
  const t = getTranslation(language);
  const [messages, setMessages] = useState<
    { role: 'user' | 'mentor'; text: string; isError?: boolean; failedQuestion?: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize welcoming greeting per language
  useEffect(() => {
    const greetingText =
      language === 'Hindi'
        ? `नमस्ते ${user?.fullName || 'निवेशक'}! मैं धनदृष्टि का AI वित्तीय मेंटर हूँ। मुझसे SIP, इमरजेंसी फंड, टैक्स बचत या वित्तीय लक्ष्यों के बारे में कोई भी प्रश्न पूछें!`
        : language === 'Marathi'
        ? `नमस्ते ${user?.fullName || 'गुंतवणूकदार'}! मी धनदृष्टीचा AI आर्थिक मार्गदर्शक आहे. मला SIP, इमर्जन्सी फंड, कर बचत किंवा आर्थिक उद्दिष्टांबद्दल कोणताही प्रश्न विचारा!`
        : `Namaste ${user?.fullName || 'Investor'}! I am DhanaDrishti's AI Mentor. Ask me any question about SIP, emergency funds, tax optimization, inflation, or smart money management!`;

    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ role: 'mentor', text: greetingText }];
      }
      return prev;
    });
  }, [language, user?.fullName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const suggestedQuestions: Record<PreferredLanguage, string[]> = {
    English: [
      'What is SIP?',
      'How do I build an emergency fund?',
      'Explain inflation simply',
    ],
    Hindi: [
      'SIP क्या है?',
      'इमरजेंसी फंड कैसे बनाएं?',
      'मुद्रास्फीति (महंगाई) को सरल भाषा में समझाएं',
    ],
    Marathi: [
      'SIP म्हणजे काय?',
      'इमर्जन्सी फंड कसा तयार करावा?',
      'महागाई म्हणजे काय ते सोप्या भाषेत सांगा',
    ],
  };

  const getFriendlyErrorMessage = () => {
    if (language === 'Hindi') {
      return 'क्षमा करें, AI मेंटर से जुड़ने में समस्या हुई। कृपया API कुंजी जांचें और "पुनः प्रयास करें" पर टैप करें।';
    }
    if (language === 'Marathi') {
      return 'क्षमस्व, AI मार्गदर्शकाशी संपर्क करताना समस्या आली. कृपया API की तपासा आणि "पुन्हा प्रयत्न करा" टॅप करा.';
    }
    return 'Unable to reach the AI Mentor right now. Please verify the Gemini API key and tap Retry to try again.';
  };

  const sendQuestion = async (questionText: string, isRetry = false) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const cleanHistory = messages.filter((m) => !m.isError);
    const updatedHistory = isRetry
      ? cleanHistory
      : [...cleanHistory, { role: 'user' as const, text: trimmed }];

    setMessages(updatedHistory);
    if (!isRetry) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const reply = await aiService.askAIMentor({
        message: trimmed,
        history: updatedHistory.slice(0, -1),
        userProfile: user,
        language,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'mentor',
          text: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'mentor',
          text: getFriendlyErrorMessage(),
          isError: true,
          failedQuestion: trimmed,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(input);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="theme-card rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Personalized Financial Awareness · Responding in {language}</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-feature-heading">
          {t.mentor}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Ask questions about Indian investing, SIPs, tax planning, emergency liquidity, or financial terms.
        </p>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions[language]?.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => sendQuestion(q)}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-emerald-500/50 disabled:opacity-60 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 inline mr-1.5 text-emerald-500" />
            {q}
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="theme-card rounded-2xl p-6 space-y-4">
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white whitespace-pre-line'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                <div>{m.role === 'mentor' ? renderHighlightedAIResponse(m.text) : m.text}</div>
                {m.isError && m.failedQuestion && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendQuestion(m.failedQuestion!, true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.retry || 'Retry'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{t.mentorThinking || 'DhanaDrishti AI Mentor is thinking...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar with Enter-to-send */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={t.askMentorPlaceholder || 'Ask a question about mutual funds, SIPs, taxes, or budgeting... (Press Enter to send)'}
            className="flex-1 px-4 py-2.5 rounded-xl theme-input text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.askButton || 'Ask'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
