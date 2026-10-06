import { PreferredLanguage } from '../context/AuthContext';

export interface TranslationDictionary {
  // Navigation & General
  features: string;
  dashboard: string;
  profile: string;
  whatif?: string;
  planners: string;
  termopedia: string;
  flashcards: string;
  quiz: string;
  explainer: string;
  health: string;
  mythfact: string;
  mentor: string;
  overview: string;
  signIn: string;
  signUp: string;
  login: string;
  logout: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  cancel: string;
  save: string;
  saving: string;
  submitting: string;
  retry: string;
  loading: string;
  disclaimerNote: string;
  copyrightText: string;
  platformIntro: string;

  // Landing & Hero
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  openDashboard: string;
  videoExplainerCta: string;
  landingCardInfo: string;
  languagesStat: string;
  taxSlabsStat: string;
  termsStat: string;

  // Auth / Login / Signup
  welcomeBack: string;
  createAccount: string;
  loginSubtext: string;
  signupSubtext: string;
  fillDemo: string;
  forgotPassword: string;
  passwordHelp: string;
  emailLabel: string;
  passwordLabel: string;
  fullNameLabel: string;
  ageLabel: string;
  locationLabel: string;
  preferredLanguageLabel: string;
  registeredEmail: string;
  savedAccountTheme: string;
  noAccountPrompt: string;
  haveAccountPrompt: string;
  authErrorGeneric: string;

  // Profile Form Page
  profileStepTitle: string;
  profileSettingsTitle: string;
  profileWelcomeBaseline: string;
  profileEditTitle: string;
  profileDatabaseSyncNote: string;
  coreFinancialProfileTitle: string;
  dreamJobLabel: string;
  dreamJobPlaceholder: string;
  annualCtcLabel: string;
  annualCtcPlaceholder: string;
  estMonthlyInHand: string;
  monthlyExpensesLabel: string;
  monthlyExpensesPlaceholder: string;
  currentSavingsLabel: string;
  currentSavingsPlaceholder: string;
  monthlyInvestmentsLabel: string;
  monthlyInvestmentsPlaceholder: string;
  riskAppetiteLabel: string;
  riskConservative: string;
  riskBalanced: string;
  riskAggressive: string;
  personalInfoTitle: string;
  locationPlaceholder: string;
  saveProfileAndDashboard: string;
  saveChangesAndRefresh: string;
  profileSavedSuccess: string;
  profileSaveError: string;
  validationNameError: string;
  validationAgeError: string;
  validationLocationError: string;
  validationJobError: string;
  validationCtcError: string;
  validationExpensesError: string;
  validationSavingsError: string;
  validationInvestmentsError: string;

  // Income Type & Privacy Mode Keys
  incomeTypeQuestion: string;
  incomeTypeSalaried: string;
  incomeTypeSelfEmployed: string;
  incomeTypeFarmer: string;
  incomeTypeDailyWage: string;
  incomeTypeHomemaker: string;
  incomeTypeStudent: string;
  incomeTypeOther: string;
  avgMonthlyIncomeLabel: string;
  avgMonthlyIncomePlaceholder: string;
  workDoYouDoLabel: string;
  workDoYouDoPlaceholder: string;
  privacyModeLabel: string;
  privacyModeTooltip: string;
  docPrivacyNotice: string;
  monthlyTakeHomeLabel: string;
  safetyTargetMonthsLabel: string;

  // Dashboard
  financialVisionGreeting: string;
  computedLiveNote: string;
  editCtcProfileBtn: string;
  runWhatIfBtn?: string;
  kpiAnnualCtc: string;
  kpiMonthlyExpenses: string;
  kpiMonthlySurplus: string;
  kpiCurrentSavings: string;
  kpiEmergencyTarget: string;
  kpiTenYearNetWorth: string;
  kpiWithStepUpSip: string;
  chartCompoundingTrajectory: string;
  chartStartingFrom: string;
  emergencyFundCashflowTitle: string;
  sixMonthSafetyTarget: string;
  emergencyAchieved: string;
  emergencyCoveredProgress: string;
  compareTaxRegimeBtn: string;
  askAiMentorBtn: string;
  allocationBreakdownTitle: string;
  livingExpensesLabel: string;
  sipInvestmentsLabel: string;
  emergencyBufferLabel: string;
  baselinePathLabel: string;
  whatIfScenarioLabel?: string;
  principalInvestedLabel: string;
  finalYearLabel: string;

  // What-If Simulator
  whatIfTitle?: string;
  whatIfSubtitle?: string;
  resetToBaseline: string;
  incrementHikeLabel: string;
  stepUpSipLabel: string;
  majorExpenseLabel: string;
  timeHorizonLabel: string;
  baselineWealthLabel: string;
  scenarioWealthLabel: string;
  wealthDeltaLabel: string;
  monthlySurplusDeltaLabel: string;

  // Planners & Calculators
  calculatorsTitle: string;
  calculatorsSubtitle: string;
  sipWealthTitle: string;
  monthlySipInput: string;
  expectedReturnInput: string;
  durationYearsInput: string;
  totalInvested: string;
  estimatedReturns: string;
  totalFutureValue: string;
  viewYearlySipTable: string;
  hideYearlySipTable: string;
  loanEmiTitle: string;
  loanPrincipalInput: string;
  interestRateInput: string;
  tenureInput: string;
  monthlyEmiResult: string;
  totalInterestResult: string;
  totalPaymentResult: string;
  viewYearlyEmiTable: string;
  hideYearlyEmiTable: string;
  switchToYears: string;
  switchToMonths: string;
  ctcToTakeHomeTitle: string;
  annualCtcInput: string;
  sec80cInput: string;
  hraOtherDeductionsInput: string;
  newTaxRegimeBtn: string;
  oldTaxRegimeBtn: string;
  includeEpfGratuity: string;
  taxableIncomeLabel: string;
  annualTaxLabel: string;
  recommendedTaxRegime: string;
  goalSipPlannerTitle: string;
  goalNameInput: string;
  costTodayInput: string;
  yearsAwayInput: string;
  inflationInput: string;
  futureCostResult: string;
  requiredMonthlySipResult: string;
  saveCalcBtn: string;
  savingCalcBtn: string;
  savedCalculationsHistory: string;

  // Term-O-Pedia, Flashcards, Quiz
  termopediaLexiconTitle: string;
  searchTermsPlaceholder: string;
  catAll: string;
  catTax: string;
  catInvesting: string;
  catIncome: string;
  catCredit: string;
  catBusiness: string;
  catBasics: string;
  meaningLabel: string;
  rememberThisLabel: string;
  commonMistakeLabel: string;
  realWorldExampleLabel: string;
  flipCardPrompt: string;
  nextCardBtn: string;
  prevCardBtn: string;
  shuffleBtn: string;
  flashcardsTitle: string;
  quizTitle: string;
  questionWord: string;
  ofWord: string;
  checkAnswerBtn: string;
  nextQuestionBtn: string;
  viewFinalResultsBtn: string;
  quizCompletedTitle: string;
  quizScoreText: string;

  // Video Explainers & Documents
  videoLessonsTitle: string;
  videoLessonsSubtitle: string;
  allTopicsFilter: string;
  allLanguagesFilter: string;
  watchVideoBtn: string;
  documentExplainerTitle: string;
  documentExplainerSubtitle: string;
  uploadDocumentBtn: string;
  documentSummaryTitle: string;
  keyFieldsTitle: string;
  importantTermsTitle: string;
  thingsToWatchOutTitle: string;

  // Health Assessment & MythFact
  healthDiagnosticTitle: string;
  healthDiagnosticSubtitle: string;
  healthOverallScore: string;
  mythFactTitle: string;
  mythFactSubtitle: string;
  searchMythFactPlaceholder: string;
  verdictMyth: string;
  verdictFact: string;
  verdictDepends: string;
  factExplanationTitle: string;

  // AI Mentor
  mentorTitle: string;
  mentorSubtitle: string;
  mentorGreeting: string;
  askMentorPlaceholder: string;
  askButton: string;
  mentorThinking: string;
}

export const UI_TRANSLATIONS: Record<PreferredLanguage, TranslationDictionary> = {
  English: {
    features: 'Features',
    dashboard: 'Dashboard',
    profile: 'Executive Profile',
    whatif: 'What-If Simulation',
    planners: '10-Year Roadmap',
    termopedia: 'Term-O-Pedia',
    flashcards: 'Flashcard Decks',
    quiz: 'Self-Check Quiz',
    explainer: 'Video Explainers',
    health: 'Health Diagnostic',
    mythfact: 'Myth vs Fact',
    mentor: 'AI Financial Advisor',
    overview: 'Platform Overview',
    signIn: 'Sign In / Register',
    signUp: 'Sign Up',
    login: 'Log In',
    logout: 'Log Out',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    submitting: 'Submitting...',
    retry: 'Retry',
    loading: 'Loading...',
    disclaimerNote: 'Educational financial awareness suite. Estimates are for guidance only.',
    copyrightText: 'DhanaDrishti. All rights reserved.',
    platformIntro: 'Empowering Indian households with clarity on CTC, SIPs, Taxes & Long-Term Wealth.',

    heroKicker: 'YOUR AI FINANCIAL COMPANION',
    heroTitle: 'Clarity on Every Rupee — Empowering Your Finances.',
    heroSubtitle: 'Simulate career increments, compare Old vs New Tax Regimes, master 60+ Indian financial terms in English, Hindi & Marathi, and achieve true financial freedom.',
    openDashboard: 'Open Dashboard',
    videoExplainerCta: 'Video Lessons',
    landingCardInfo: 'Your financial profile, CTC scenarios, language preference, and theme follow you securely across every session.',
    languagesStat: 'Languages',
    taxSlabsStat: 'Tax Slabs',
    termsStat: 'Terms',

    welcomeBack: 'Welcome Back to DhanaDrishti',
    createAccount: 'Create Your DhanaDrishti Account',
    loginSubtext: 'Sign in to access your personalized Indian financial roadmap, tax calculations, and AI mentor.',
    signupSubtext: 'Create your DhanaDrishti account — your financial scenarios stay saved securely.',
    fillDemo: 'Fill Demo Credentials',
    forgotPassword: 'Forgot Password?',
    passwordHelp: 'Demo Account: demo@dhanadrishti.in / Password: Demo@123',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    fullNameLabel: 'Full Name',
    ageLabel: 'Age (Years)',
    locationLabel: 'Location (City, State)',
    preferredLanguageLabel: 'Preferred Language',
    registeredEmail: 'Registered Email (Account ID)',
    savedAccountTheme: 'Saved Account Theme',
    noAccountPrompt: 'Don’t have an account?',
    haveAccountPrompt: 'Already have an account?',
    authErrorGeneric: 'Unable to authenticate. Please check your credentials.',

    profileStepTitle: 'Step 2 of 2 · Complete Your Financial Profile',
    profileSettingsTitle: 'Account & Financial Profile Settings',
    profileWelcomeBaseline: 'Let’s set your Financial Baseline',
    profileEditTitle: 'Edit Personal & Financial Profile',
    profileDatabaseSyncNote: 'Saved securely to your account database so your Dashboard and 10-Year Roadmap stay synced across every login.',
    coreFinancialProfileTitle: 'Core Financial Profile',
    dreamJobLabel: 'Dream Job / Current Job Title',
    dreamJobPlaceholder: 'e.g., Full-Stack Software Engineer, Product Manager',
    annualCtcLabel: 'Annual CTC / Salary (₹ per year)',
    annualCtcPlaceholder: 'e.g., 1200000',
    estMonthlyInHand: 'Est. Monthly In-Hand',
    monthlyExpensesLabel: 'Monthly Living Expenses (₹ per month)',
    monthlyExpensesPlaceholder: 'e.g., 35000',
    currentSavingsLabel: 'Current Total Savings / Corpus (₹)',
    currentSavingsPlaceholder: 'e.g., 250000',
    monthlyInvestmentsLabel: 'Monthly SIP / Investment Commitment (₹, optional)',
    monthlyInvestmentsPlaceholder: 'Auto-calculated from surplus if left blank',
    riskAppetiteLabel: 'Risk Appetite',
    riskConservative: 'Conservative (Debt & Large Cap Focus)',
    riskBalanced: 'Balanced (Index + Flexi-Cap + Debt Buffer)',
    riskAggressive: 'Aggressive (High Equity Growth & Step-Up SIP)',
    personalInfoTitle: 'Personal Information & Preferences',
    locationPlaceholder: 'e.g., Pune, Maharashtra',
    saveProfileAndDashboard: 'Save Profile & Open Dashboard',
    saveChangesAndRefresh: 'Save Changes & Refresh Views',
    profileSavedSuccess: 'Profile saved successfully! Updating your workspace...',
    profileSaveError: 'Failed to save profile. Your typed values have been preserved.',
    validationNameError: 'Please enter your full name (at least 2 characters).',
    validationAgeError: 'Age must be between 15 and 100.',
    validationLocationError: 'Please enter your City / State.',
    validationJobError: 'Please enter your Dream Job / Job Title.',
    validationCtcError: 'Annual CTC must be a positive number greater than ₹0.',
    validationExpensesError: 'Monthly Expenses cannot be negative.',
    validationSavingsError: 'Current Savings cannot be negative.',
    validationInvestmentsError: 'Monthly Investments cannot be negative.',

    incomeTypeQuestion: 'How do you earn your money?',
    incomeTypeSalaried: 'Salaried',
    incomeTypeSelfEmployed: 'Self-employed or business',
    incomeTypeFarmer: 'Farmer',
    incomeTypeDailyWage: 'Daily-wage worker',
    incomeTypeHomemaker: 'Homemaker',
    incomeTypeStudent: 'Student',
    incomeTypeOther: 'Other',
    avgMonthlyIncomeLabel: 'Average Monthly Income',
    avgMonthlyIncomePlaceholder: 'e.g. 25000',
    workDoYouDoLabel: 'What work do you do? (Optional)',
    workDoYouDoPlaceholder: 'e.g., Software Engineer, Farmer, Shop Owner',
    privacyModeLabel: 'Privacy Mode',
    privacyModeTooltip: 'Hide sensitive financial numbers on screen',
    docPrivacyNotice: 'Your Aadhaar, PAN, phone and account numbers are hidden before AI reads this.',
    monthlyTakeHomeLabel: 'Monthly Take-Home Income',
    safetyTargetMonthsLabel: 'Safety Target',

    financialVisionGreeting: 'Here is Your Financial Vision',
    computedLiveNote: 'All metrics below are computed live from your saved profile in the database.',
    editCtcProfileBtn: 'Edit CTC / Profile',
    runWhatIfBtn: 'Run What-If Simulator',
    kpiAnnualCtc: 'Annual CTC Package',
    kpiMonthlyExpenses: 'Monthly Living Expenses',
    kpiMonthlySurplus: 'Monthly Investable Surplus',
    kpiCurrentSavings: 'Current Saved Corpus',
    kpiEmergencyTarget: '6-Mo Emergency Target',
    kpiTenYearNetWorth: '10-Yr Projected Net Worth',
    kpiWithStepUpSip: 'With Step-Up SIP & Compounding',
    chartCompoundingTrajectory: '10-Year Compounding Trajectory',
    chartStartingFrom: 'Starting from',
    emergencyFundCashflowTitle: 'Emergency Fund & Cashflow',
    sixMonthSafetyTarget: '6-Month Safety Target',
    emergencyAchieved: 'Full 6-month emergency buffer achieved!',
    emergencyCoveredProgress: 'of your 6-month living expense buffer covered.',
    compareTaxRegimeBtn: 'Compare Old vs New Tax Regime',
    askAiMentorBtn: 'Ask AI Mentor',
    allocationBreakdownTitle: 'Monthly Income Allocation',
    livingExpensesLabel: 'Monthly Living Expenses',
    sipInvestmentsLabel: 'SIP & Wealth Investments',
    emergencyBufferLabel: 'Liquid Buffer / Emergency Savings',
    baselinePathLabel: 'Baseline Path',
    whatIfScenarioLabel: 'What-If Scenario',
    principalInvestedLabel: 'Total Principal Invested',
    finalYearLabel: 'Final Year',

    whatIfTitle: 'What-If Career & Wealth Simulator',
    whatIfSubtitle: 'Simulate how salary jumps, higher SIP allocations, or large planned purchases alter your 10-year wealth.',
    resetToBaseline: 'Reset to Baseline',
    incrementHikeLabel: 'Expected CTC Jump / Hike (%)',
    stepUpSipLabel: 'Annual Step-Up in SIP (%)',
    majorExpenseLabel: 'Major One-Time Expenditure (₹)',
    timeHorizonLabel: 'Time Horizon (Years)',
    baselineWealthLabel: 'Baseline 10-Yr Net Worth',
    scenarioWealthLabel: 'Simulated 10-Yr Net Worth',
    wealthDeltaLabel: 'Additional Wealth Generated',
    monthlySurplusDeltaLabel: 'Monthly Surplus Difference',

    calculatorsTitle: 'SIP, EMI, CTC & Tax Calculators',
    calculatorsSubtitle: 'Deterministic Indian financial calculators tailored for FY 2025-26.',
    sipWealthTitle: 'SIP Wealth Calculator',
    monthlySipInput: 'Monthly SIP (₹)',
    expectedReturnInput: 'Expected Return (% p.a.)',
    durationYearsInput: 'Duration (Years)',
    totalInvested: 'Total Invested',
    estimatedReturns: 'Estimated Returns',
    totalFutureValue: 'Total Future Value',
    viewYearlySipTable: 'View Year-by-Year SIP Table',
    hideYearlySipTable: 'Hide Year-by-Year SIP Table',
    loanEmiTitle: 'Loan EMI & Interest Calculator',
    loanPrincipalInput: 'Loan Principal (₹)',
    interestRateInput: 'Interest Rate (% p.a.)',
    tenureInput: 'Tenure',
    monthlyEmiResult: 'Monthly EMI',
    totalInterestResult: 'Total Interest Payable',
    totalPaymentResult: 'Total Payment (P + I)',
    viewYearlyEmiTable: 'View Amortization Schedule',
    hideYearlyEmiTable: 'Hide Amortization Schedule',
    switchToYears: 'Switch to Years',
    switchToMonths: 'Switch to Months',
    ctcToTakeHomeTitle: 'CTC to Take-Home & Tax Comparison (FY 25-26)',
    annualCtcInput: 'Annual CTC Package (₹)',
    sec80cInput: 'Sec 80C Investments (Max ₹1.5L)',
    hraOtherDeductionsInput: 'HRA + 80D + Other Deductions (₹)',
    newTaxRegimeBtn: 'New Tax Regime (Default)',
    oldTaxRegimeBtn: 'Old Tax Regime',
    includeEpfGratuity: 'Include Standard EPF & Gratuity in CTC',
    taxableIncomeLabel: 'Taxable Income',
    annualTaxLabel: 'Annual Income Tax (incl. 4% Cess)',
    recommendedTaxRegime: 'Recommended Tax Regime',
    goalSipPlannerTitle: 'Inflation-Adjusted Goal SIP Planner',
    goalNameInput: 'Financial Goal Name',
    costTodayInput: 'Cost in Today’s Rupees (₹)',
    yearsAwayInput: 'Years Away',
    inflationInput: 'Inflation Rate (% p.a.)',
    futureCostResult: 'Future Inflated Cost',
    requiredMonthlySipResult: 'Required Monthly SIP (at 12% Return)',
    saveCalcBtn: 'Save Calculation',
    savingCalcBtn: 'Saving...',
    savedCalculationsHistory: 'Saved Calculations History',

    termopediaLexiconTitle: 'Term-O-Pedia Indian Financial Lexicon',
    searchTermsPlaceholder: 'Search 60+ Indian financial terms (e.g. GST, SIP, TDS, PE Ratio)...',
    catAll: 'All',
    catTax: 'Tax',
    catInvesting: 'Investing',
    catIncome: 'Income',
    catCredit: 'Credit & Loans',
    catBusiness: 'Business',
    catBasics: 'Basics',
    meaningLabel: 'Simple Meaning',
    rememberThisLabel: 'Remember This',
    commonMistakeLabel: 'Common Mistake',
    realWorldExampleLabel: 'Real-World Example',
    flipCardPrompt: 'Click card to flip and view explanation',
    nextCardBtn: 'Next Card',
    prevCardBtn: 'Previous Card',
    shuffleBtn: 'Shuffle Deck',
    flashcardsTitle: 'Interactive Concept Flashcards',
    quizTitle: 'Financial Self-Check Quiz',
    questionWord: 'Question',
    ofWord: 'of',
    checkAnswerBtn: 'Submit Answer',
    nextQuestionBtn: 'Next Question',
    viewFinalResultsBtn: 'View Final Score',
    quizCompletedTitle: 'Quiz Completed!',
    quizScoreText: 'Your Score',

    videoLessonsTitle: 'Curated Financial Literacy Lessons',
    videoLessonsSubtitle: 'High-quality lessons from RBI, Zerodha Varsity, CA Rachana Ranade, and Pranjal Kamra.',
    allTopicsFilter: 'All Topics',
    allLanguagesFilter: 'All Languages',
    watchVideoBtn: 'Watch Lesson',
    documentExplainerTitle: 'Financial Document Scanner & Explainer',
    documentExplainerSubtitle: 'Upload salary slips, Form 16, or bank statements for plain-language breakdown.',
    uploadDocumentBtn: 'Upload Document / Slip',
    documentSummaryTitle: 'Document Summary',
    keyFieldsTitle: 'Key Visible Figures',
    importantTermsTitle: 'Terms Explained Simply',
    thingsToWatchOutTitle: 'Things to Watch Out For',

    healthDiagnosticTitle: 'Financial Health Diagnostic',
    healthDiagnosticSubtitle: 'Comprehensive evaluation of your emergency preparedness, savings rate, and tax balance.',
    healthOverallScore: 'Overall Financial Health Score',
    mythFactTitle: 'Indian Financial Myth vs Fact Checker',
    mythFactSubtitle: 'Debunking common Indian myths about mutual funds, credit cards, taxes, and real estate.',
    searchMythFactPlaceholder: 'Search financial statements or myths...',
    verdictMyth: 'Verdict: Myth',
    verdictFact: 'Verdict: Fact',
    verdictDepends: 'Verdict: Context Dependent',
    factExplanationTitle: 'Why This Matters',

    mentorTitle: 'AI Money Decision Mentor',
    mentorSubtitle: 'Test a money decision against your income, expenses, savings, and goals before you make it.',
    mentorGreeting: 'Namaste! I am your DhanaDrishti AI Money Decision Mentor. Test any financial decision—such as changing your SIP, salary increase, new EMI, or expense change—against your real numbers before you make it!',
    askMentorPlaceholder: 'Ask a what-if question (e.g., What if I invest ₹5,000 more every month?)... (Press Enter to send)',
    askButton: 'Ask',
    mentorThinking: 'DhanaDrishti AI Mentor is calculating and evaluating...',
  },

  Hindi: {
    features: 'सुविधाएं',
    dashboard: 'डैशबोर्ड',
    profile: 'व्यक्तिगत प्रोफाइल',
    whatif: 'वेतन परिदृश्य सिम्युलेटर',
    planners: '10-वर्षीय रोडमैप',
    termopedia: 'Term-O-Pedia शब्दावली',
    flashcards: 'फ्लैशकार्ड अभ्यास',
    quiz: 'स्वयं-जांच क्विज़',
    explainer: 'वीडियो मार्गदर्शक',
    health: 'वित्तीय स्वास्थ्य',
    mythfact: 'मिथक बनाम तथ्य',
    mentor: 'AI वित्तीय सलाहकार',
    overview: 'प्लेटफॉर्म परिचय',
    signIn: 'साइन इन / रजिस्टर',
    signUp: 'खाता बनाएं',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    language: 'भाषा',
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    saving: 'सहेजा जा रहा है...',
    submitting: 'प्रक्रिया जारी है...',
    retry: 'पुनः प्रयास करें',
    loading: 'लोड हो रहा है...',
    disclaimerNote: 'शैक्षणिक वित्तीय साक्षरता मंच। सभी गणनाएं केवल मार्गदर्शन के लिए हैं।',
    copyrightText: 'DhanaDrishti. सर्वाधिकार सुरक्षित।',
    platformIntro: 'वेतन, SIP, टैक्स और दीर्घकालिक वित्तीय योजना की स्पष्टता भारतीय परिवारों के लिए।',

    heroKicker: 'आपका AI वित्तीय मार्गदर्शक',
    heroTitle: 'हर रुपये की स्पष्टता — आपके वित्तीय भविष्य का सशक्तिकरण।',
    heroSubtitle: 'वेतन वृद्धि का अनुकरण करें, पुरानी बनाम नई कर व्यवस्था की तुलना करें, और 60+ आवश्यक भारतीय वित्तीय शब्दों में दक्षता प्राप्त करें।',
    openDashboard: 'डैशबोर्ड खोलें',
    videoExplainerCta: 'वीडियो पाठ',
    landingCardInfo: 'आपकी वित्तीय प्रोफाइल, CTC गणनाएं, भाषा और थीम प्राथमिकताएं सुरक्षित रूप से सहेजी जाती हैं।',
    languagesStat: 'भाषाएं',
    taxSlabsStat: 'टैक्स स्लैब',
    termsStat: 'शब्दावली',

    welcomeBack: 'DhanaDrishti में पुनः स्वागत है',
    createAccount: 'अपना DhanaDrishti खाता बनाएं',
    loginSubtext: 'अपने सहेजे गए 10-वर्षीय रोडमैप, टैक्स गणना और AI मेंटर तक पहुँचने के लिए लॉग इन करें।',
    signupSubtext: 'अपना खाता बनाएं — आपकी वित्तीय योजनाएं सुरक्षित रूप से सुरक्षित रहेंगी।',
    fillDemo: 'डेमो जानकारी भरें',
    forgotPassword: 'पासवर्ड भूल गए?',
    passwordHelp: 'डेमो खाता: demo@dhanadrishti.in / पासवर्ड: Demo@123',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूरा नाम',
    ageLabel: 'आयु (वर्ष)',
    locationLabel: 'स्थान (शहर, राज्य)',
    preferredLanguageLabel: 'पसंदीदा भाषा',
    registeredEmail: 'पंजीकृत ईमेल (खाता ID)',
    savedAccountTheme: 'सहेजी गई थीम',
    noAccountPrompt: 'खाता नहीं है?',
    haveAccountPrompt: 'पहले से खाता है?',
    authErrorGeneric: 'प्रमाणीकरण विफल रहा। कृपया अपनी जानकारी जांचें।',

    profileStepTitle: 'चरण 2 / 2 · अपनी वित्तीय प्रोफाइल पूर्ण करें',
    profileSettingsTitle: 'खाता और वित्तीय प्रोफाइल सेटिंग्स',
    profileWelcomeBaseline: 'आइए आपकी वित्तीय आधार रेखा निर्धारित करें',
    profileEditTitle: 'व्यक्तिगत और वित्तीय प्रोफाइल संपादित करें',
    profileDatabaseSyncNote: 'सुरक्षित रूप से डेटाबेस में सहेजा गया ताकि डैशबोर्ड, सिम्युलेटर और प्लानर हर सत्र में सिंक रहें।',
    coreFinancialProfileTitle: 'मूल वित्तीय प्रोफाइल',
    dreamJobLabel: 'लक्ष्य पद / वर्तमान पेशा',
    dreamJobPlaceholder: 'उदा. सॉफ्टवेयर इंजीनियर, प्रोडक्ट मैनेजर',
    annualCtcLabel: 'वार्षिक CTC वेतन (₹ प्रति वर्ष)',
    annualCtcPlaceholder: 'उदा. 1200000',
    estMonthlyInHand: 'अंदाजित मासिक इन-हैंड',
    monthlyExpensesLabel: 'मासिक घरेलू खर्च (₹ प्रति माह)',
    monthlyExpensesPlaceholder: 'उदा. 35000',
    currentSavingsLabel: 'वर्तमान कुल बचत (₹)',
    currentSavingsPlaceholder: 'उदा. 250000',
    monthlyInvestmentsLabel: 'मासिक SIP / निवेश (₹, वैकल्पिक)',
    monthlyInvestmentsPlaceholder: 'रिक्त रहने पर बचत से स्वतः गणना होगी',
    riskAppetiteLabel: 'जोखिम लेने की क्षमता',
    riskConservative: 'रूढ़िवादी (डेट और लार्ज कैप फंड्स)',
    riskBalanced: 'संतुलित (इंडेक्स + फ्लेक्सी-कैप + डेट)',
    riskAggressive: 'आक्रामक (इक्विटी ग्रोथ और स्टेप-अप SIP)',
    personalInfoTitle: 'व्यक्तिगत जानकारी और प्राथमिकताएं',
    locationPlaceholder: 'उदा. पुणे, महाराष्ट्र',
    saveProfileAndDashboard: 'प्रोफाइल सहेजें और डैशबोर्ड खोलें',
    saveChangesAndRefresh: 'बदलाव सहेजें और अपडेट करें',
    profileSavedSuccess: 'प्रोफाइल सफलतापूर्वक सहेजी गई! डैशबोर्ड लोड हो रहा है...',
    profileSaveError: 'प्रोफाइल सहेजने में विफल। दर्ज की गई जानकारी सुरक्षित है।',
    validationNameError: 'कृपया अपना पूरा नाम (कम से कम 2 अक्षर) दर्ज करें।',
    validationAgeError: 'आयु 15 से 100 वर्ष के बीच होनी चाहिए।',
    validationLocationError: 'कृपया अपना शहर / राज्य दर्ज करें।',
    validationJobError: 'कृपया अपना पेशा / पद दर्ज करें।',
    validationCtcError: 'वार्षिक CTC ₹0 से अधिक सकारात्मक संख्या होनी चाहिए।',
    validationExpensesError: 'मासिक खर्च नकारात्मक नहीं हो सकता।',
    validationSavingsError: 'वर्तमान बचत नकारात्मक नहीं हो सकती।',
    validationInvestmentsError: 'मासिक निवेश नकारात्मक नहीं हो सकता।',

    incomeTypeQuestion: 'आप अपनी आय कैसे अर्जित करते हैं?',
    incomeTypeSalaried: 'वेतनभोगी (Salaried)',
    incomeTypeSelfEmployed: 'स्व-रोजगार या व्यवसाय (Business)',
    incomeTypeFarmer: 'किसान (Farmer)',
    incomeTypeDailyWage: 'दैनिक वेतनभोगी श्रमिक (Daily-wage worker)',
    incomeTypeHomemaker: 'गृहिणी (Homemaker)',
    incomeTypeStudent: 'विद्यार्थी (Student)',
    incomeTypeOther: 'अन्य (Other)',
    avgMonthlyIncomeLabel: 'औसत मासिक आय',
    avgMonthlyIncomePlaceholder: 'उदा. 25000',
    workDoYouDoLabel: 'आप क्या कार्य करते हैं? (वैकल्पिक)',
    workDoYouDoPlaceholder: 'उदा. सॉफ्टवेयर इंजीनियर, किसान, दुकानदार',
    privacyModeLabel: 'प्राइवेसी मोड',
    privacyModeTooltip: 'स्क्रीन पर संवेदनशील वित्तीय आंकड़े छिपाएं',
    docPrivacyNotice: 'AI द्वारा पढ़े जाने से पहले आपका आधार, पैन, फोन और खाता नंबर सुरक्षित रूप से छिपा दिए जाते हैं।',
    monthlyTakeHomeLabel: 'मासिक इन-हैंड आय',
    safetyTargetMonthsLabel: 'सुरक्षा लक्ष्य',

    financialVisionGreeting: 'यह रहा आपका संपूर्ण वित्तीय दृष्टिकोण',
    computedLiveNote: 'नीचे दिए गए सभी आंकड़े आपकी सहेजी गई प्रोफाइल से गणना किए गए हैं।',
    editCtcProfileBtn: 'CTC / प्रोफाइल बदलें',
    runWhatIfBtn: 'What-If सिम्युलेटर चलाएं',
    kpiAnnualCtc: 'वार्षिक CTC पैकेज',
    kpiMonthlyExpenses: 'मासिक घरेलू खर्च',
    kpiMonthlySurplus: 'मासिक निवेश योग्य बचत',
    kpiCurrentSavings: 'वर्तमान कुल बचत',
    kpiEmergencyTarget: '6-माह का आपातकालीन फंड',
    kpiTenYearNetWorth: '10-वर्षीय अनुमानित संपत्ति',
    kpiWithStepUpSip: 'स्टेप-अप SIP और चक्रवाढ वृद्धि सहित',
    chartCompoundingTrajectory: '10-वर्षीय चक्रवाढ संपत्ति आलेख',
    chartStartingFrom: 'प्रारंभिक आधार',
    emergencyFundCashflowTitle: 'आपातकालीन फंड और कैशफ्लो',
    sixMonthSafetyTarget: '6-माह का सुरक्षा लक्ष्य',
    emergencyAchieved: 'पूर्ण 6-माह का आपातकालीन फंड तैयार है!',
    emergencyCoveredProgress: 'आपके 6-माह के खर्च का हिस्सा पूरा हो चुका है।',
    compareTaxRegimeBtn: 'पुरानी बनाम नई कर व्यवस्था तुलना',
    askAiMentorBtn: 'AI मेंटर से पूछें',
    allocationBreakdownTitle: 'मासिक आय आवंटन विभाजन',
    livingExpensesLabel: 'मासिक जीवनयापन खर्च',
    sipInvestmentsLabel: 'SIP व संपत्ति निवेश',
    emergencyBufferLabel: 'तरल बचत / आपातकालीन बफर',
    baselinePathLabel: 'मूल पथ (Baseline)',
    whatIfScenarioLabel: 'अनुकरण परिदृश्य (What-If)',
    principalInvestedLabel: 'कुल मूलधन निवेश',
    finalYearLabel: 'अंतिम वर्ष',

    whatIfTitle: 'What-If करियर और संपत्ति सिम्युलेटर',
    whatIfSubtitle: 'देखें कि वेतन वृद्धि, अधिक SIP या कोई बड़ा खर्च आपके 10-वर्षीय भविष्य को कैसे बदलता है।',
    resetToBaseline: 'मूल स्थिति पर रीसेट करें',
    incrementHikeLabel: 'अपेक्षित वेतन वृद्धि (%)',
    stepUpSipLabel: 'SIP में वार्षिक वृद्धि (%)',
    majorExpenseLabel: 'बड़ा एकमुश्त खर्च (₹)',
    timeHorizonLabel: 'समय अवधि (वर्ष)',
    baselineWealthLabel: 'मूल 10-वर्षीय संपत्ति',
    scenarioWealthLabel: 'सिम्युलेटेड 10-वर्षीय संपत्ति',
    wealthDeltaLabel: 'अतिरिक्त निर्मित संपत्ति',
    monthlySurplusDeltaLabel: 'मासिक बचत में अंतर',

    calculatorsTitle: 'SIP, EMI, CTC व टैक्स कैलकुलेटर',
    calculatorsSubtitle: 'FY 2025-26 के भारतीय नियमों पर आधारित सटीक वित्तीय कैलकुलेटर।',
    sipWealthTitle: 'SIP संपत्ति कैलकुलेटर',
    monthlySipInput: 'मासिक SIP राशि (₹)',
    expectedReturnInput: 'अपेक्षित वार्षिक रिटर्न (%)',
    durationYearsInput: 'अवधि (वर्ष)',
    totalInvested: 'कुल निवेशित राशि',
    estimatedReturns: 'अनुमानित कुल मुनाफा',
    totalFutureValue: 'परिपक्वता पर कुल मूल्य',
    viewYearlySipTable: 'वर्ष-वार SIP विवरण देखें',
    hideYearlySipTable: 'वर्ष-वार SIP विवरण छिपाएं',
    loanEmiTitle: 'लोन EMI व ब्याज कैलकुलेटर',
    loanPrincipalInput: 'मूलधन लोन राशि (₹)',
    interestRateInput: 'वार्षिक ब्याज दर (%)',
    tenureInput: 'अवधि',
    monthlyEmiResult: 'मासिक EMI किस्त',
    totalInterestResult: 'कुल देय ब्याज',
    totalPaymentResult: 'कुल भुगतान (मूलधन + ब्याज)',
    viewYearlyEmiTable: 'वार्षिक EMI तालिका देखें',
    hideYearlyEmiTable: 'वार्षिक EMI तालिका छिपाएं',
    switchToYears: 'वर्षों में बदलें',
    switchToMonths: 'महीनों में बदलें',
    ctcToTakeHomeTitle: 'CTC से इन-हैंड वेतन व टैक्स तुलना (FY 25-26)',
    annualCtcInput: 'वार्षिक CTC पैकेज (₹)',
    sec80cInput: 'धारा 80C निवेश (अधिकतम ₹1.5 लाख)',
    hraOtherDeductionsInput: 'HRA + 80D + अन्य छूट (₹)',
    newTaxRegimeBtn: 'नई कर व्यवस्था (डिफ़ॉल्ट)',
    oldTaxRegimeBtn: 'पुरानी कर व्यवस्था',
    includeEpfGratuity: 'CTC में EPF और ग्रेच्युटी शामिल करें',
    taxableIncomeLabel: 'कर योग्य आय',
    annualTaxLabel: 'वार्षिक आयकर (4% सेस सहित)',
    recommendedTaxRegime: 'सुझाई गई कर व्यवस्था',
    goalSipPlannerTitle: 'महंगाई-समायोजित लक्ष्य SIP प्लानर',
    goalNameInput: 'वित्तीय लक्ष्य का नाम',
    costTodayInput: 'आज के मूल्य में लागत (₹)',
    yearsAwayInput: 'कितने वर्ष बाद',
    inflationInput: 'अनुमानित महंगाई दर (% प्रति वर्ष)',
    futureCostResult: 'भविष्य की अनुमानित लागत',
    requiredMonthlySipResult: 'आवश्यक मासिक SIP (12% रिटर्न पर)',
    saveCalcBtn: 'गणना सहेजें',
    savingCalcBtn: 'सहेजा जा रहा है...',
    savedCalculationsHistory: 'सहेजी गई गणनाओं का इतिहास',

    termopediaLexiconTitle: 'Term-O-Pedia भारतीय वित्तीय शब्दावली',
    searchTermsPlaceholder: '60+ भारतीय वित्तीय शब्द खोजें (उदा. GST, SIP, TDS, PE Ratio)...',
    catAll: 'सभी',
    catTax: 'टैक्स (कर)',
    catInvesting: 'निवेश',
    catIncome: 'आय',
    catCredit: 'ऋण व क्रेडिट',
    catBusiness: 'व्यापार',
    catBasics: 'मूल बातें',
    meaningLabel: 'सरल अर्थ',
    rememberThisLabel: 'यह याद रखें',
    commonMistakeLabel: 'सामान्य गलती',
    realWorldExampleLabel: 'वास्तविक उदाहरण',
    flipCardPrompt: 'स्पष्टीकरण देखने के लिए कार्ड पर टैप करें',
    nextCardBtn: 'अगला कार्ड',
    prevCardBtn: 'पिछला कार्ड',
    shuffleBtn: 'कार्ड मिलाएं (Shuffle)',
    flashcardsTitle: 'इंटरैक्टिव फ्लैशकार्ड अभ्यास',
    quizTitle: 'वित्तीय स्वयं-जांच क्विज़',
    questionWord: 'प्रश्न',
    ofWord: 'का',
    checkAnswerBtn: 'उत्तर जांचें',
    nextQuestionBtn: 'अगला प्रश्न',
    viewFinalResultsBtn: 'अंतिम स्कोर देखें',
    quizCompletedTitle: 'क्विज़ पूरा हुआ!',
    quizScoreText: 'आपका स्कोर',

    videoLessonsTitle: 'चयनित वित्तीय साक्षरता वीडियो',
    videoLessonsSubtitle: 'RBI, Zerodha Varsity, CA रचना रानाडे और प्रांजल कामरा के सरल वीडियो।',
    allTopicsFilter: 'सभी विषय',
    allLanguagesFilter: 'सभी भाषाएं',
    watchVideoBtn: 'वीडियो देखें',
    documentExplainerTitle: 'वित्तीय दस्तावेज़ व्याख्याकार',
    documentExplainerSubtitle: 'सैलरी स्लिप, फॉर्म 16 या बैंक स्टेटमेंट अपलोड कर सरल भाषा में समझें।',
    uploadDocumentBtn: 'दस्तावेज़ / स्लिप अपलोड करें',
    documentSummaryTitle: 'दस्तावेज़ सारांश',
    keyFieldsTitle: 'मुख्य आंकड़े',
    importantTermsTitle: 'सरल शब्दों में शब्दावली',
    thingsToWatchOutTitle: 'सावधानी के बिंदु',

    healthDiagnosticTitle: 'वित्तीय स्वास्थ्य मूल्यांकन',
    healthDiagnosticSubtitle: 'आपातकालीन तैयारी, बचत दर और कर संतुलन का समग्र मूल्यांकन।',
    healthOverallScore: 'समग्र वित्तीय स्वास्थ्य स्कोर',
    mythFactTitle: 'भारतीय वित्तीय मिथक बनाम तथ्य',
    mythFactSubtitle: 'म्यूचुअल फंड, क्रेडिट कार्ड, टैक्स और रियल एस्टेट से जुड़े मिथकों का निवारण।',
    searchMythFactPlaceholder: 'वित्तीय दावे या मिथक खोजें...',
    verdictMyth: 'फैसला: मिथक (झूठ)',
    verdictFact: 'फैसला: तथ्य (सत्य)',
    verdictDepends: 'फैसला: संदर्भ पर निर्भर',
    factExplanationTitle: 'तथ्य का स्पष्टीकरण',

    mentorTitle: 'AI वित्तीय निर्णय मेंटर',
    mentorSubtitle: 'कोई भी वित्तीय निर्णय लेने से पहले उसे अपनी आय, खर्च, बचत और लक्ष्यों पर परखें।',
    mentorGreeting: 'नमस्ते! मैं धनदृष्टि का AI मनी डिसीजन मेंटर हूँ। कोई भी वित्तीय निर्णय लेने से पहले—जैसे SIP बढ़ाना, वेतन वृद्धि, नई EMI या खर्च में बदलाव—उसे अपने वास्तविक आंकड़ों पर परखें!',
    askMentorPlaceholder: 'कोई क्या-अगर प्रश्न पूछें (जैसे, अगर मैं हर महीने ₹5,000 अधिक निवेश करूँ तो?)... (Enter दबाएं)',
    askButton: 'पूछें',
    mentorThinking: 'DhanaDrishti AI मेंटर विश्लेषण और गणना कर रहा है...',
  },

  Marathi: {
    features: 'वैशिष्ट्ये',
    dashboard: 'डॅशबोर्ड',
    profile: 'वैयक्तिक प्रोफाइल',
    whatif: 'पगार अंदाज व वाढ सिम्युलेटर',
    planners: '१०-वर्षीय आराखडा',
    termopedia: 'Term-O-Pedia शब्दकोश',
    flashcards: 'फ्लॅशकार्ड सराव',
    quiz: 'मूल्यमापन क्विझ',
    explainer: 'व्हिडिओ मार्गदर्शक',
    health: 'आर्थिक आरोग्य',
    mythfact: 'गैरसमज की सत्य',
    mentor: 'AI आर्थिक मार्गदर्शक',
    overview: 'मुख्य पृष्ठ / परिचय',
    signIn: 'साइन इन / नोंदणी',
    signUp: 'खाते तयार करा',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    language: 'भाषा',
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    saving: 'जतन करत आहे...',
    submitting: 'प्रक्रिया सुरू आहे...',
    retry: 'पुन्हा प्रयत्न करा',
    loading: 'लोड होत आहे...',
    disclaimerNote: 'शैक्षणिक आर्थिक साक्षरता व्यासपीठ. सर्व आकडेवारी मार्गदर्शनासाठी आहे.',
    copyrightText: 'DhanaDrishti. सर्व हक्क राखीव.',
    platformIntro: 'पगार, SIP, कर आणि दीर्घकालीन संपत्ती नियोजनाची स्पष्टता भारतीय कुटुंबांसाठी.',

    heroKicker: 'आपला AI आर्थिक मार्गदर्शक',
    heroTitle: 'प्रत्येक रुपयाची स्पष्टता — आपल्या आर्थिक नियोजनाचे सक्षमीकरण.',
    heroSubtitle: 'पगारवाढीचा अंदाज घ्या, जुनी विरुद्ध नवीन कर रचना तपासा, आणि ६०+ भारतीय आर्थिक संकल्पना सोप्या भाषेत समजून घ्या.',
    openDashboard: 'डॅशबोर्ड उघडा',
    videoExplainerCta: 'व्हिडिओ धडे',
    landingCardInfo: 'आपली आर्थिक प्रोफाइल, CTC आकडेमोड, भाषा व थीम प्राधान्ये सुरक्षितपणे जतन केली जातात.',
    languagesStat: 'भाषा',
    taxSlabsStat: 'कर टप्पे',
    termsStat: 'संकल्पना',

    welcomeBack: 'DhanaDrishti मध्ये आपले स्वागत आहे',
    createAccount: 'आपले DhanaDrishti खाते तयार करा',
    loginSubtext: 'आपल्या जतन केलेल्या १०-वर्षीय आराखड्यास व AI मार्गदर्शकास भेट देण्यासाठी लॉग इन करा.',
    signupSubtext: 'आपले खाते तयार करा — आपले आर्थिक नियोजन कायम सुरक्षित राहील.',
    fillDemo: 'डेमो माहिती भरा',
    forgotPassword: 'पासवर्ड विसरलात?',
    passwordHelp: 'डेमो खाते: demo@dhanadrishti.in / पासवर्ड: Demo@123',
    emailLabel: 'ईमेल पत्ता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूर्ण नाव',
    ageLabel: 'वय (वर्षे)',
    locationLabel: 'स्थान (शहर, राज्य)',
    preferredLanguageLabel: 'पसंतीची भाषा',
    registeredEmail: 'नोंदणीकृत ईमेल (खाते ID)',
    savedAccountTheme: 'जतन केलेली थीम',
    noAccountPrompt: 'खाते नाही?',
    haveAccountPrompt: 'आधीच खाते आहे?',
    authErrorGeneric: 'प्रमाणीकरण अयशस्वी. कृपया आपली माहिती तपासा.',

    profileStepTitle: 'टप्पा २ / २ · आपली आर्थिक प्रोफाइल पूर्ण करा',
    profileSettingsTitle: 'खाते आणि आर्थिक प्रोफाइल सेटिंग्ज',
    profileWelcomeBaseline: 'आपली मूलभूत आर्थिक आकडेवारी निश्चित करूया',
    profileEditTitle: 'वैयक्तिक व आर्थिक प्रोफाइल संपादित करा',
    profileDatabaseSyncNote: 'डेटाबेसमध्ये सुरक्षित जतन केले आहे, जेणेकरून डॅशबोर्ड व सिम्युलेटर प्रत्येक सत्रात सिंक राहतील.',
    coreFinancialProfileTitle: 'मुख्य आर्थिक प्रोफाइल',
    dreamJobLabel: 'ध्येय पद / वर्तमान नोकरी',
    dreamJobPlaceholder: 'उदा. सॉफ्टवेअर इंजिनिअर, प्रॉडक्ट मॅनेजर',
    annualCtcLabel: 'वार्षिक CTC पगार (₹ प्रति वर्ष)',
    annualCtcPlaceholder: 'उदा. 1200000',
    estMonthlyInHand: 'अंदाजे मासिक इन-हँड पगार',
    monthlyExpensesLabel: 'मासिक घरखर्च (₹ प्रति महिना)',
    monthlyExpensesPlaceholder: 'उदा. 35000',
    currentSavingsLabel: 'सध्याची रोख बचत (₹)',
    currentSavingsPlaceholder: 'उदा. 250000',
    monthlyInvestmentsLabel: 'मासिक SIP / गुंतवणूक (₹, ऐच्छिक)',
    monthlyInvestmentsPlaceholder: 'रिकामे ठेवल्यास शिल्लक रकमेतून स्वतः मोजले जाईल',
    riskAppetiteLabel: 'जोखीम क्षमता',
    riskConservative: 'कमी जोखीम (डेट व लार्ज कॅप फंड्स)',
    riskBalanced: 'संतुलित (इंडेक्स + फ्लेक्सी-कॅप + डेट)',
    riskAggressive: 'अधिक जोखीम (इक्विटी वाढ व स्टेप-अप SIP)',
    personalInfoTitle: 'वैयक्तिक माहिती आणि प्राधान्ये',
    locationPlaceholder: 'उदा. पुणे, महाराष्ट्र',
    saveProfileAndDashboard: 'प्रोफाइल जतन करा आणि डॅशबोर्ड उघडा',
    saveChangesAndRefresh: 'बदल जतन करा आणि रीफ्रेश करा',
    profileSavedSuccess: 'प्रोफाइल यशस्वीरित्या जतन झाली! डॅशबोर्ड उघडत आहे...',
    profileSaveError: 'प्रोफाइल जतन करताना अडचण आली. नोंदवलेली माहिती सुरक्षित आहे.',
    validationNameError: 'कृपया आपले पूर्ण नाव (किमान २ अक्षरे) प्रविष्ट करा.',
    validationAgeError: 'वय १५ ते १०० दरम्यान असणे आवश्यक आहे.',
    validationLocationError: 'कृपया आपले शहर / राज्य प्रविष्ट करा.',
    validationJobError: 'कृपया आपली नोकरी / पद प्रविष्ट करा.',
    validationCtcError: 'वार्षिक CTC रक्कम ₹० पेक्षा जास्त असावी.',
    validationExpensesError: 'मासिक खर्च उणे (ऋण) असू शकत नाही.',
    validationSavingsError: 'सध्याची बचत उणे (ऋण) असू शकत नाही.',
    validationInvestmentsError: 'मासिक गुंतवणूक उणे असू शकत नाही.',

    incomeTypeQuestion: 'तुम्ही तुमचे उत्पन्न कसे कमवता?',
    incomeTypeSalaried: 'नोकरदार (Salaried)',
    incomeTypeSelfEmployed: 'स्वयंरोजगार किंवा व्यवसाय (Business)',
    incomeTypeFarmer: 'शेतकरी (Farmer)',
    incomeTypeDailyWage: 'रोजंदारी कामगार (Daily-wage worker)',
    incomeTypeHomemaker: 'गृहिणी (Homemaker)',
    incomeTypeStudent: 'विद्यार्थी (Student)',
    incomeTypeOther: 'इतर (Other)',
    avgMonthlyIncomeLabel: 'सरासरी मासिक उत्पन्न',
    avgMonthlyIncomePlaceholder: 'उदा. 25000',
    workDoYouDoLabel: 'तुम्ही काय काम करता? (ऐच्छिक)',
    workDoYouDoPlaceholder: 'उदा. सॉफ्टवेअर इंजिनिअर, शेतकरी, व्यावसायिक',
    privacyModeLabel: 'प्रायव्हसी मोड',
    privacyModeTooltip: 'स्क्रीनवरील संवेदनशील आर्थिक आकडे लपवा',
    docPrivacyNotice: 'AI वाचण्यापूर्वी तुमचा आधार, पॅन, फोन आणि बँक खाते क्रमांक सुरक्षितपणे लपवले जातात.',
    monthlyTakeHomeLabel: 'मासिक प्रत्यक्ष उत्पन्न',
    safetyTargetMonthsLabel: 'सुरक्षा उद्दिष्ट',

    financialVisionGreeting: 'आपले संपूर्ण आर्थिक नियोजन व उद्दिष्टे',
    computedLiveNote: 'खालील सर्व आकडेवारी आपल्या जतन केलेल्या प्रोफाइलवरून मोजली गेली आहे.',
    editCtcProfileBtn: 'CTC / प्रोफाइल बदला',
    runWhatIfBtn: 'What-If सिम्युलेटर चालवा',
    kpiAnnualCtc: 'वार्षिक CTC पॅकेज',
    kpiMonthlyExpenses: 'मासिक घरखर्च',
    kpiMonthlySurplus: 'मासिक गुंतवणूकयोग्य शिल्लक',
    kpiCurrentSavings: 'सध्याची रोख बचत',
    kpiEmergencyTarget: '६-महिन्यांचा आपत्कालीन निधी',
    kpiTenYearNetWorth: '१०-वर्षीय अंदाजित संपत्ती',
    kpiWithStepUpSip: 'स्टेप-अप SIP व चक्रवाढ वृद्धीसह',
    chartCompoundingTrajectory: '१०-वर्षीय चक्रवाढ संपत्ती आलेख',
    chartStartingFrom: 'सुरुवातीचा आधार',
    emergencyFundCashflowTitle: 'आपत्कालीन निधी व कॅशफ्लो',
    sixMonthSafetyTarget: '६-महिन्यांचे सुरक्षा उद्दिष्ट',
    emergencyAchieved: 'पूर्ण ६-महिन्यांचा आपत्कालीन निधी उपलब्ध आहे!',
    emergencyCoveredProgress: 'तुमच्या ६-महिन्यांच्या खर्चाचा भाग पूर्ण झाला आहे.',
    compareTaxRegimeBtn: 'जुनी विरुद्ध नवीन कर रचना तपासा',
    askAiMentorBtn: 'AI मार्गदर्शकास विचारा',
    allocationBreakdownTitle: 'मासिक उत्पन्न वाटप विभागणी',
    livingExpensesLabel: 'मासिक जीवनखर्च',
    sipInvestmentsLabel: 'SIP व संपत्ती गुंतवणूक',
    emergencyBufferLabel: 'तरल बचत / आपत्कालीन बफर',
    baselinePathLabel: 'मूळ मार्ग (Baseline)',
    whatIfScenarioLabel: 'अंदाज परिदृश्य (What-If)',
    principalInvestedLabel: 'एकूण गुंतवलेले मुद्दल',
    finalYearLabel: 'अंतिम वर्ष',

    whatIfTitle: 'What-If करिअर व संपत्ती सिम्युलेटर',
    whatIfSubtitle: 'पगारवाढ, अधिक SIP किंवा मोठा खर्च तुमच्या १०-वर्षीय संपत्तीवर कसा परिणाम करतो ते तपासा.',
    resetToBaseline: 'मूळ स्थितीवर आणा',
    incrementHikeLabel: 'अपेक्षित पगारवाढ (%)',
    stepUpSipLabel: 'SIP मधील वार्षिक वाढ (%)',
    majorExpenseLabel: 'मोठा एकरकमी खर्च (₹)',
    timeHorizonLabel: 'कालावधी (वर्षे)',
    baselineWealthLabel: 'मूळ १०-वर्षीय संपत्ती',
    scenarioWealthLabel: 'अंदाजित १०-वर्षीय संपत्ती',
    wealthDeltaLabel: 'अतिरिक्त निर्माण झालेली संपत्ती',
    monthlySurplusDeltaLabel: 'मासिक शिल्लक रकमेतील फरक',

    calculatorsTitle: 'SIP, EMI, CTC व कर कॅल्क्युलेटर',
    calculatorsSubtitle: 'FY 2025-26 च्या भारतीय नियमांवर आधारित अचूक आर्थिक कॅल्क्युलेटर.',
    sipWealthTitle: 'SIP संपत्ती चक्रवाढ कॅल्क्युलेटर',
    monthlySipInput: 'मासिक SIP रक्कम (₹)',
    expectedReturnInput: 'अपेक्षित वार्षिक परतावा (%)',
    durationYearsInput: 'कालावधी (वर्षे)',
    totalInvested: 'एकूण गुंतवलेले भांडवल',
    estimatedReturns: 'अंदाजित एकूण नफा',
    totalFutureValue: 'एकूण मुदतपूर्ती निधी',
    viewYearlySipTable: 'वर्षनिहाय SIP तपशील पहा',
    hideYearlySipTable: 'वर्षनिहाय SIP तपशील लपवा',
    loanEmiTitle: 'EMI व कर्ज परतफेड वेळापत्रक',
    loanPrincipalInput: 'मुद्दल कर्ज रक्कम (₹)',
    interestRateInput: 'वार्षिक व्याज दर (%)',
    tenureInput: 'कर्ज मुदत',
    monthlyEmiResult: 'मासिक EMI हप्ता',
    totalInterestResult: 'एकूण देय व्याज',
    totalPaymentResult: 'एकूण परतफेड (मुद्दल + व्याज)',
    viewYearlyEmiTable: 'वार्षिक परतफेड वेळापत्रक पहा',
    hideYearlyEmiTable: 'वार्षिक परतफेड वेळापत्रक लपवा',
    switchToYears: 'वर्षांमध्ये बदला',
    switchToMonths: 'महिन्यांमध्ये बदला',
    ctcToTakeHomeTitle: 'CTC ते इन-हँड व कर तुलना (FY 25-26)',
    annualCtcInput: 'वार्षिक CTC पगार (₹)',
    sec80cInput: 'कलम 80C गुंतवणूक (कमाल ₹१.५ लाख)',
    hraOtherDeductionsInput: 'HRA + 80D + इतर वजावटी (₹)',
    newTaxRegimeBtn: 'नवीन कर प्रणाली (डिफॉल्ट)',
    oldTaxRegimeBtn: 'जुनी कर प्रणाली',
    includeEpfGratuity: 'CTC मध्ये EPF व ग्रॅच्युइटी जोडा',
    taxableIncomeLabel: 'करपात्र उत्पन्न',
    annualTaxLabel: 'वार्षिक आयकर (४% सेससह)',
    recommendedTaxRegime: 'शिफारस केलेली कर प्रणाली',
    goalSipPlannerTitle: 'महागाई-समायोजित ध्येय SIP आराखडा',
    goalNameInput: 'ध्येयाचे नाव',
    costTodayInput: 'आजच्या किमतीत खर्च (₹)',
    yearsAwayInput: 'किती वर्षांनी',
    inflationInput: 'महागाई दर (% प्रति वर्ष)',
    futureCostResult: 'भविष्यातील अंदाजित खर्च',
    requiredMonthlySipResult: 'आवश्यक मासिक SIP (१२% परताव्यावर)',
    saveCalcBtn: 'ही गणना जतन करा',
    savingCalcBtn: 'जतन करत आहे...',
    savedCalculationsHistory: 'जतन केलेल्या गणितांचा इतिहास',

    termopediaLexiconTitle: 'Term-O-Pedia भारतीय आर्थिक शब्दकोश',
    searchTermsPlaceholder: '६०+ आर्थिक संकल्पनांमध्ये शोधा (उदा. GST, SIP, TDS, PE Ratio)...',
    catAll: 'सर्व',
    catTax: 'कर (Tax)',
    catInvesting: 'गुंतवणूक',
    catIncome: 'उत्पन्न',
    catCredit: 'कर्ज व पत',
    catBusiness: 'व्यवसाय',
    catBasics: 'मूलभूत गोष्टी',
    meaningLabel: 'सोपा अर्थ',
    rememberThisLabel: 'लक्षात ठेवा',
    commonMistakeLabel: 'सामान्य चूक',
    realWorldExampleLabel: 'वास्तविक उदाहरण',
    flipCardPrompt: 'स्पष्टीकरण पाहण्यासाठी कार्डवर टॅप करा',
    nextCardBtn: 'पुढील कार्ड',
    prevCardBtn: 'मागील कार्ड',
    shuffleBtn: 'क्रम बदला (Shuffle)',
    flashcardsTitle: 'इंटरॅक्टिव्ह फ्लॅशकार्ड सराव',
    quizTitle: 'आर्थिक स्वयं-चाचणी क्विझ',
    questionWord: 'प्रश्न',
    ofWord: 'पैकी',
    checkAnswerBtn: 'उत्तर तपासा',
    nextQuestionBtn: 'पुढील प्रश्न',
    viewFinalResultsBtn: 'अंतिम निकाल पहा',
    quizCompletedTitle: 'चाचणी पूर्ण झाली!',
    quizScoreText: 'तुमचे गुण',

    videoLessonsTitle: 'निवडक आर्थिक साक्षरता व्हिडिओ धडे',
    videoLessonsSubtitle: 'RBI, Zerodha Varsity, CA रचना रानाडे आणि प्रांजल कामरा यांचे दर्जेदार धडे.',
    allTopicsFilter: 'सर्व विषय',
    allLanguagesFilter: 'सर्व भाषा',
    watchVideoBtn: 'व्हिडिओ पहा',
    documentExplainerTitle: 'आर्थिक दस्तऐवज स्पष्टीकरण',
    documentExplainerSubtitle: 'पगार स्लिप, फॉर्म 16 किंवा बँक स्टेटमेंट अपलोड करून सोप्या भाषेत समजून घ्या.',
    uploadDocumentBtn: 'दस्तऐवज / स्लिप अपलोड करा',
    documentSummaryTitle: 'दस्तऐवज सारांश',
    keyFieldsTitle: 'प्रमुख आकडेवारी',
    importantTermsTitle: 'सोप्या भाषेत संज्ञा',
    thingsToWatchOutTitle: 'सावधगिरीच्या बाबी',

    healthDiagnosticTitle: 'आर्थिक आरोग्य तपासणी',
    healthDiagnosticSubtitle: 'आपत्कालीन निधी, बचत दर आणि कर व्यवस्थापनाचे सर्वसमावेशक मूल्यमापन.',
    healthOverallScore: 'एकूण आर्थिक आरोग्य गुण',
    mythFactTitle: 'भारतीय आर्थिक गैरसमज की सत्य',
    mythFactSubtitle: 'म्युच्युअल फंड, क्रेडिट कार्ड, कर आणि रिअल इस्टेटबद्दलचे गैरसमज दूर करा.',
    searchMythFactPlaceholder: 'आर्थिक विधाने किंवा गैरसमज शोधा...',
    verdictMyth: 'निकाल: गैरसमज (Myth)',
    verdictFact: 'निकाल: सत्य (Fact)',
    verdictDepends: 'निकाल: संदर्भावर अवलंबून',
    factExplanationTitle: 'हे महत्त्वाचे का आहे',

    mentorTitle: 'AI आर्थिक निर्णय मार्गदर्शक',
    mentorSubtitle: 'कोणताही आर्थिक निर्णय घेण्यापूर्वी तो तुमच्या उत्पन्न, खर्च, बचत आणि ध्येयांवर तपासून पहा.',
    mentorGreeting: 'नमस्ते! मी धनदृष्टीचा AI आर्थिक निर्णय मार्गदर्शक आहे. कोणताही पैशांचा निर्णय घेण्यापूर्वी—जसे की SIP वाढवणे, पगारवाढ, नवीन EMI किंवा खर्च बदल—तो तुमच्या प्रत्यक्ष आकडेवारीवर तपासून पहा!',
    askMentorPlaceholder: "'जर मी असे केले तर' असा प्रश्न विचारा (उदा. जर मी दरमहा ₹५,००० अधिक गुंतवले तर?)... (Enter दाबा)",
    askButton: 'विचारा',
    mentorThinking: 'DhanaDrishti AI मार्गदर्शक विश्लेषण आणि गणना करत आहे...',
  },
};

export function getTranslation(language: PreferredLanguage): TranslationDictionary {
  const selectedDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.English;
  // Always fall back to English for any missing keys to prevent raw key exposure
  return {
    ...UI_TRANSLATIONS.English,
    ...selectedDict,
  };
}
