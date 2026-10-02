import { PreferredLanguage } from '../context/AuthContext';

export interface TranslationDictionary {
  features: string;
  dashboard: string;
  profile: string;
  whatif: string;
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
  welcomeBack: string;
  createAccount: string;
  fillDemo: string;
  forgotPassword: string;
  passwordHelp: string;
  emailLabel: string;
  passwordLabel: string;
  fullNameLabel: string;
  ageLabel: string;
  locationLabel: string;
  preferredLanguageLabel: string;
  dreamJobLabel: string;
  annualCtcLabel: string;
  monthlyExpensesLabel: string;
  currentSavingsLabel: string;
  monthlyInvestmentsLabel: string;
  riskAppetiteLabel: string;
  saveProfile: string;
  saving: string;
  submitting: string;
  searchPlaceholder: string;
  allCategories: string;
  flipCard: string;
  nextCard: string;
  prevCard: string;
  shuffle: string;
  question: string;
  of: string;
  submitAnswer: string;
  nextQuestion: string;
  retry: string;
  seeResults: string;
  disclaimerNote: string;
  screenshotBlocked: string;
  screenshotNotice: string;
  // Categories
  catAll: string;
  catTax: string;
  catInvesting: string;
  catIncome: string;
  catCredit: string;
  catBusiness: string;
  catBasics: string;
  // Dashboard & Metrics
  financialVision: string;
  computedLive: string;
  editCtcProfile: string;
  runWhatIf: string;
  monthlyInHand: string;
  monthlySurplus: string;
  savingsRate: string;
  emergencyFund: string;
  tenYearProjectedWealth: string;
  wealthTrajectoryTitle: string;
  allocationBreakdownTitle: string;
  // Planners & Calculators
  sipCalculator: string;
  emiCalculator: string;
  taxRegimeCalculator: string;
  goalPlanner: string;
  monthlyInvestment: string;
  expectedReturn: string;
  timePeriodYears: string;
  totalInvested: string;
  estimatedReturns: string;
  totalValue: string;
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  monthlyEmi: string;
  totalInterest: string;
  totalPayment: string;
  saveCalculation: string;
  savedCalculations: string;
  // What-If
  incrementHike: string;
  stepUpSip: string;
  majorPurchase: string;
  simulateWealthTrajectory: string;
  baselineVsScenario: string;
  // Mentor
  mentorGreeting: string;
  askMentorPlaceholder: string;
  askButton: string;
  mentorThinking: string;
  // Explainer & MythFact
  documentExplainerTitle: string;
  uploadDocument: string;
  takePhoto: string;
  videoLessonsTitle: string;
  allTopics: string;
  mythFactCheckTitle: string;
  checkStatementPlaceholder: string;
  checkStatementButton: string;
  verdictMyth: string;
  verdictFact: string;
  verdictDepends: string;
  rememberThis: string;
  commonMistake: string;
}

export const UI_TRANSLATIONS: Record<PreferredLanguage, TranslationDictionary> = {
  English: {
    features: 'Features',
    dashboard: 'Executive Dashboard',
    profile: 'Financial Profile',
    whatif: 'What-If Wealth Simulator',
    planners: '10-Year Roadmap & Planners',
    termopedia: 'Term-O-Pedia Lexicon',
    flashcards: 'Interactive Flashcards',
    quiz: 'Self-Check Quiz',
    explainer: 'Video Explainers Hub',
    health: 'Financial Health Diagnostic',
    mythfact: 'Myth vs Fact Checker',
    mentor: 'AI Financial Advisor',
    overview: 'Platform Overview',
    signIn: 'Sign In / Register',
    signUp: 'Create Account',
    login: 'Log In',
    logout: 'Log Out',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    welcomeBack: 'Welcome Back to DhanaDrishti',
    createAccount: 'Create Your DhanaDrishti Account',
    fillDemo: 'Fill Demo Credentials',
    forgotPassword: 'Forgot Password?',
    passwordHelp: 'Demo or test credentials: use demo@dhanadrishti.in with password Demo@123.',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    fullNameLabel: 'Full Name',
    ageLabel: 'Age',
    locationLabel: 'Location (City, State)',
    preferredLanguageLabel: 'Preferred Language',
    dreamJobLabel: 'Dream Career / Target Role',
    annualCtcLabel: 'Annual CTC Package (₹)',
    monthlyExpensesLabel: 'Monthly Living Expenses (₹)',
    currentSavingsLabel: 'Current Liquid Savings (₹)',
    monthlyInvestmentsLabel: 'Current Monthly SIP / Investments (₹)',
    riskAppetiteLabel: 'Risk Appetite',
    saveProfile: 'Save Financial Profile',
    saving: 'Saving Changes...',
    submitting: 'Processing...',
    searchPlaceholder: 'Search across 60+ financial terms...',
    allCategories: 'All Categories',
    flipCard: 'Click card to flip definition',
    nextCard: 'Next Card',
    prevCard: 'Previous Card',
    shuffle: 'Shuffle Deck',
    question: 'Question',
    of: 'of',
    submitAnswer: 'Check Answer',
    nextQuestion: 'Next Question',
    retry: 'Try Another Set',
    seeResults: 'See Final Results',
    disclaimerNote: 'Educational financial literacy platform. Projections are illustrative and not certified investment advice.',
    screenshotBlocked: 'Screenshots are not allowed on this website.',
    screenshotNotice: 'Your personal financial numbers and private data are protected against capture.',
    catAll: 'All',
    catTax: 'Tax',
    catInvesting: 'Investing',
    catIncome: 'Income',
    catCredit: 'Credit',
    catBusiness: 'Business',
    catBasics: 'Basics',
    financialVision: 'Here is Your Financial Vision',
    computedLive: 'All metrics below are computed live from your saved profile in the database.',
    editCtcProfile: 'Edit CTC / Profile',
    runWhatIf: 'Run What-If Simulator',
    monthlyInHand: 'Estimated Monthly Take-Home',
    monthlySurplus: 'Monthly Investable Surplus',
    savingsRate: 'Savings Rate',
    emergencyFund: '6-Month Emergency Fund',
    tenYearProjectedWealth: '10-Year Projected Wealth',
    wealthTrajectoryTitle: '10-Year Wealth Compounding Trajectory',
    allocationBreakdownTitle: 'Monthly Income Allocation Breakdown',
    sipCalculator: 'SIP Wealth Compounding Calculator',
    emiCalculator: 'EMI & Loan Amortization Schedule',
    taxRegimeCalculator: 'CTC to Take-Home & FY 2025-26 Tax Comparison',
    goalPlanner: 'Inflation-Adjusted Goal SIP Roadmap',
    monthlyInvestment: 'Monthly Investment (₹)',
    expectedReturn: 'Expected Annual Return (%)',
    timePeriodYears: 'Time Horizon (Years)',
    totalInvested: 'Total Invested Capital',
    estimatedReturns: 'Estimated Wealth Gains',
    totalValue: 'Total Maturity Corpus',
    loanAmount: 'Principal Loan Amount (₹)',
    interestRate: 'Annual Interest Rate (%)',
    loanTenure: 'Loan Tenure',
    monthlyEmi: 'Monthly EMI Payment',
    totalInterest: 'Total Interest Payable',
    totalPayment: 'Total Principal + Interest',
    saveCalculation: 'Save This Calculation',
    savedCalculations: 'Saved Calculations History',
    incrementHike: 'Simulate Career Salary Hike (%)',
    stepUpSip: 'Annual Step-Up in SIP (%)',
    majorPurchase: 'Simulate Major One-Time Expenditure (₹)',
    simulateWealthTrajectory: 'Simulate Wealth Trajectory',
    baselineVsScenario: 'Baseline vs Scenario Comparison',
    mentorGreeting: 'I am your DhanaDrishti AI Financial Mentor. Ask me anything about SIPs, taxes, or wealth planning!',
    askMentorPlaceholder: 'Ask a question about SIPs, taxes, emergency funds, or your CTC...',
    askButton: 'Ask Mentor',
    mentorThinking: 'DhanaDrishti AI Mentor is thinking...',
    documentExplainerTitle: 'Financial Document Explainer',
    uploadDocument: 'Upload Salary Slip, Form 16 or Statement',
    takePhoto: 'Take Photo of Document',
    videoLessonsTitle: 'Curated Financial Education Video Lessons',
    allTopics: 'All Topics',
    mythFactCheckTitle: 'Financial Reality Checker (Myth vs Fact)',
    checkStatementPlaceholder: 'Type any financial advice, loan rule, or tax tip you heard...',
    checkStatementButton: 'Verify Statement',
    verdictMyth: 'VERDICT: MYTH',
    verdictFact: 'VERDICT: FACT',
    verdictDepends: 'VERDICT: PARTLY TRUE / DEPENDS',
    rememberThis: 'Remember This',
    commonMistake: 'Common Mistake',
  },
  Hindi: {
    features: 'मुख्य सुविधाएँ',
    dashboard: 'कार्यकारी डैशबोर्ड',
    profile: 'वित्तीय प्रोफाइल',
    whatif: 'What-If संपत्ति सिम्युलेटर',
    planners: '10-वर्षीय रोडमैप व प्लानर',
    termopedia: 'Term-O-Pedia शब्दावली',
    flashcards: 'अभ्यास फ्लैशकार्ड',
    quiz: 'स्वयं-जांच क्विज़',
    explainer: 'वीडियो मार्गदर्शक केंद्र',
    health: 'वित्तीय स्वास्थ्य निदान',
    mythfact: 'मिथक बनाम तथ्य परीक्षक',
    mentor: 'AI वित्तीय सलाहकार',
    overview: 'प्लेटफॉर्म परिचय',
    signIn: 'साइन इन / रजिस्टर',
    signUp: 'नया खाता बनाएं',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    language: 'भाषा',
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    welcomeBack: 'DhanaDrishti में पुनः स्वागत है',
    createAccount: 'अपना DhanaDrishti खाता बनाएं',
    fillDemo: 'डेमो विवरण भरें',
    forgotPassword: 'पासवर्ड भूल गए?',
    passwordHelp: 'डेमो क्रेडेंशियल: demo@dhanadrishti.in और पासवर्ड Demo@123 का उपयोग करें।',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूरा नाम',
    ageLabel: 'आयु',
    locationLabel: 'स्थान (शहर, राज्य)',
    preferredLanguageLabel: 'पसंदीदा भाषा',
    dreamJobLabel: 'लक्ष्य करियर / पद',
    annualCtcLabel: 'वार्षिक CTC पैकेज (₹)',
    monthlyExpensesLabel: 'मासिक घरखर्च (₹)',
    currentSavingsLabel: 'वर्तमान तरल बचत (₹)',
    monthlyInvestmentsLabel: 'मासिक SIP / निवेश (₹)',
    riskAppetiteLabel: 'जोखिम लेने की क्षमता',
    saveProfile: 'वित्तीय प्रोफाइल सहेजें',
    saving: 'सहेजा जा रहा है...',
    submitting: 'प्रक्रिया जारी है...',
    searchPlaceholder: '60+ वित्तीय शब्दों में खोजें...',
    allCategories: 'सभी श्रेणियां',
    flipCard: 'परिभाषा देखने के लिए कार्ड पर क्लिक करें',
    nextCard: 'अगला कार्ड',
    prevCard: 'पिछला कार्ड',
    shuffle: 'शफ़ल करें',
    question: 'प्रश्न',
    of: 'का',
    submitAnswer: 'उत्तर जांचें',
    nextQuestion: 'अगला प्रश्न',
    retry: 'अन्य सेट का अभ्यास करें',
    seeResults: 'अंतिम परिणाम देखें',
    disclaimerNote: 'शैक्षणिक वित्तीय साक्षरता मंच। गणना केवल मार्गदर्शन हेतु है।',
    screenshotBlocked: 'Screenshots are not allowed on this website.',
    screenshotNotice: 'आपकी वित्तीय और व्यक्तिगत जानकारी को सुरक्षित रखा गया है।',
    catAll: 'सभी',
    catTax: 'कर (Tax)',
    catInvesting: 'निवेश (Investing)',
    catIncome: 'आय (Income)',
    catCredit: 'ऋण (Credit)',
    catBusiness: 'व्यापार (Business)',
    catBasics: 'मूलभूत (Basics)',
    financialVision: 'यहाँ आपका वित्तीय परिदृश्य है',
    computedLive: 'नीचे दिए गए सभी आंकड़े आपकी सहेजी गई प्रोफाइल से गणना किए गए हैं।',
    editCtcProfile: 'CTC / प्रोफाइल बदलें',
    runWhatIf: 'What-If सिम्युलेटर चलाएं',
    monthlyInHand: 'अनुमानित मासिक इन-हैंड वेतन',
    monthlySurplus: 'मासिक निवेश योग्य अधिशेष',
    savingsRate: 'बचत दर',
    emergencyFund: '6-महीने का आपातकालीन फंड',
    tenYearProjectedWealth: '10-वर्षीय अनुमानित संपत्ति',
    wealthTrajectoryTitle: '10-वर्षीय चक्रवृद्धि संपत्ति प्रक्षेपवक्र',
    allocationBreakdownTitle: 'मासिक आय विभाजन विवरण',
    sipCalculator: 'SIP संपत्ति चक्रवृद्धि कैलकुलेटर',
    emiCalculator: 'EMI व ऋण भुगतान अनुसूची',
    taxRegimeCalculator: 'CTC से इन-हैंड व FY 2025-26 कर तुलना',
    goalPlanner: 'मुद्रास्फीति-समायोजित लक्ष्य SIP रोडमैप',
    monthlyInvestment: 'मासिक निवेश (₹)',
    expectedReturn: 'अपेक्षित वार्षिक रिटर्न (%)',
    timePeriodYears: 'समय अवधि (वर्ष)',
    totalInvested: 'कुल निवेशित पूंजी',
    estimatedReturns: 'अनुमानित कुल लाभ',
    totalValue: 'कुल परिपक्वता कोष',
    loanAmount: 'मूल ऋण राशि (₹)',
    interestRate: 'वार्षिक ब्याज दर (%)',
    loanTenure: 'ऋण अवधि',
    monthlyEmi: 'मासिक EMI किस्त',
    totalInterest: 'कुल देय ब्याज',
    totalPayment: 'कुल मूलधन + ब्याज',
    saveCalculation: 'यह गणना सहेजें',
    savedCalculations: 'सहेजी गई गणनाओं का इतिहास',
    incrementHike: 'करियर वेतन वृद्धि अनुकरण (%)',
    stepUpSip: 'SIP में वार्षिक स्टेप-अप (%)',
    majorPurchase: 'बड़ा एकमुश्त खर्च अनुकरण (₹)',
    simulateWealthTrajectory: 'संपत्ति वृद्धि का अनुकरण करें',
    baselineVsScenario: 'मूल बनाम परिदृश्य तुलना',
    mentorGreeting: 'मैं आपका DhanaDrishti AI वित्तीय सलाहकार हूँ। SIP, टैक्स या वित्तीय योजना पर कुछ भी पूछें!',
    askMentorPlaceholder: 'SIP, टैक्स, आपातकालीन फंड या वेतन संबंधी प्रश्न पूछें...',
    askButton: 'सलाहकार से पूछें',
    mentorThinking: 'DhanaDrishti AI मेंटर विचार कर रहा है...',
    documentExplainerTitle: 'वित्तीय दस्तावेज़ व्याख्याकार',
    uploadDocument: 'वेतन पर्ची, फॉर्म 16 या बैंक विवरण अपलोड करें',
    takePhoto: 'दस्तावेज़ की तस्वीर लें',
    videoLessonsTitle: 'चयनित वित्तीय शिक्षा वीडियो पाठ',
    allTopics: 'सभी विषय',
    mythFactCheckTitle: 'वित्तीय वास्तविकता परीक्षक (मिथक बनाम तथ्य)',
    checkStatementPlaceholder: 'कोई भी वित्तीय सलाह, लोन नियम या टैक्स टिप दर्ज करें...',
    checkStatementButton: 'कथन की सत्यता जांचें',
    verdictMyth: 'निर्णय: मिथक (Myth)',
    verdictFact: 'निर्णय: तथ्य (Fact)',
    verdictDepends: 'निर्णय: आंशिक सत्य / संदर्भ पर निर्भर',
    rememberThis: 'याद रखें',
    commonMistake: 'आम गलती',
  },
  Marathi: {
    features: 'मुख्य वैशिष्ट्ये',
    dashboard: 'कार्यकारी डॅशबोर्ड',
    profile: 'आर्थिक प्रोफाइल',
    whatif: 'What-If संपत्ती सिम्युलेटर',
    planners: '१०-वर्षीय आराखडा व नियोजन',
    termopedia: 'Term-O-Pedia शब्दकोश',
    flashcards: 'सराव फ्लॅशकार्ड्स',
    quiz: 'स्वयं-मूल्यमापन क्विझ',
    explainer: 'व्हिडिओ मार्गदर्शक केंद्र',
    health: 'आर्थिक आरोग्य तपासणी',
    mythfact: 'गैरसमज की सत्य पडताळणी',
    mentor: 'AI आर्थिक मार्गदर्शक',
    overview: 'मुख्य पृष्ठ / परिचय',
    signIn: 'साइन इन / नोंदणी',
    signUp: 'नवीन खाते तयार करा',
    login: 'लॉग इन करा',
    logout: 'लॉग आउट',
    language: 'भाषा',
    theme: 'थीम',
    light: 'लाइट',
    dark: 'डार्क',
    welcomeBack: 'DhanaDrishti मध्ये आपले स्वागत आहे',
    createAccount: 'आपले DhanaDrishti खाते तयार करा',
    fillDemo: 'डेमो माहिती भरा',
    forgotPassword: 'पासवर्ड विसरलात?',
    passwordHelp: 'डेमो माहिती: demo@dhanadrishti.in व पासवर्ड Demo@123 वापरा.',
    emailLabel: 'ईमेल पत्ता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूर्ण नाव',
    ageLabel: 'वय',
    locationLabel: 'स्थान (शहर, राज्य)',
    preferredLanguageLabel: 'पसंतीची भाषा',
    dreamJobLabel: 'ध्येय करिअर / पद',
    annualCtcLabel: 'वार्षिक CTC पगार (₹)',
    monthlyExpensesLabel: 'मासिक घरखर्च (₹)',
    currentSavingsLabel: 'सध्याची रोख बचत (₹)',
    monthlyInvestmentsLabel: 'मासिक SIP / गुंतवणूक (₹)',
    riskAppetiteLabel: 'जोखीम क्षमता',
    saveProfile: 'आर्थिक प्रोफाइल जतन करा',
    saving: 'जतन करत आहे...',
    submitting: 'प्रक्रिया सुरू आहे...',
    searchPlaceholder: '६०+ आर्थिक संकल्पनांमध्ये शोधा...',
    allCategories: 'सर्व विभाग',
    flipCard: 'अर्थ पाहण्यासाठी कार्डवर क्लिक करा',
    nextCard: 'पुढील कार्ड',
    prevCard: 'मागील कार्ड',
    shuffle: 'क्रम बदला (Shuffle)',
    question: 'प्रश्न',
    of: 'पैकी',
    submitAnswer: 'उत्तर तपासा',
    nextQuestion: 'पुढील प्रश्न',
    retry: 'नवीन संच सोडवा',
    seeResults: 'अंतिम निकाल पहा',
    disclaimerNote: 'शैक्षणिक आर्थिक साक्षरता व्यासपीठ. अंदाज केवळ मार्गदर्शनासाठी आहेत.',
    screenshotBlocked: 'Screenshots are not allowed on this website.',
    screenshotNotice: 'आपली खाजगी आर्थिक आकडेवारी सुरक्षित ठेवण्यात आली आहे.',
    catAll: 'सर्व',
    catTax: 'कर (Tax)',
    catInvesting: 'गुंतवणूक (Investing)',
    catIncome: 'उत्पन्न (Income)',
    catCredit: 'कर्ज व पत (Credit)',
    catBusiness: 'व्यवसाय (Business)',
    catBasics: 'मूलभूत संकल्पना (Basics)',
    financialVision: 'आपले आर्थिक नियोजन व उद्दिष्टे',
    computedLive: 'खालील सर्व आकडेवारी आपल्या जतन केलेल्या प्रोफाइलवरून मोजली गेली आहे.',
    editCtcProfile: 'CTC / प्रोफाइल बदला',
    runWhatIf: 'What-If सिम्युलेटर चालवा',
    monthlyInHand: 'अंदाजे मासिक इन-हँड पगार',
    monthlySurplus: 'मासिक गुंतवणूकयोग्य शिल्लक',
    savingsRate: 'बचत दर',
    emergencyFund: '६-महिन्यांचा आपत्कालीन निधी',
    tenYearProjectedWealth: '१०-वर्षीय अंदाजित संपत्ती',
    wealthTrajectoryTitle: '१०-वर्षीय चक्रवाढ संपत्ती आलेख',
    allocationBreakdownTitle: 'मासिक उत्पन्न वाटप विभागणी',
    sipCalculator: 'SIP संपत्ती चक्रवाढ कॅल्क्युलेटर',
    emiCalculator: 'EMI व कर्ज परतफेड वेळापत्रक',
    taxRegimeCalculator: 'CTC ते इन-हँड व FY 2025-26 कर तुलना',
    goalPlanner: 'महागाई-समायोजित ध्येय SIP आराखडा',
    monthlyInvestment: 'मासिक गुंतवणूक (₹)',
    expectedReturn: 'अपेक्षित वार्षिक परतावा (%)',
    timePeriodYears: 'कालावधी (वर्षे)',
    totalInvested: 'एकूण गुंतवलेले भांडवल',
    estimatedReturns: 'अंदाजित एकूण नफा',
    totalValue: 'एकूण मुदतपूर्ती निधी',
    loanAmount: 'मुद्दल कर्ज रक्कम (₹)',
    interestRate: 'वार्षिक व्याज दर (%)',
    loanTenure: 'कर्ज कालावधी',
    monthlyEmi: 'मासिक EMI हप्ता',
    totalInterest: 'एकूण देय व्याज',
    totalPayment: 'एकूण मुद्दल + व्याज',
    saveCalculation: 'ही गणना जतन करा',
    savedCalculations: 'जतन केलेल्या गणितांचा इतिहास',
    incrementHike: 'पगारवाढ अंदाज (%)',
    stepUpSip: 'SIP मधील वार्षिक वाढ (%)',
    majorPurchase: 'मोठा एकरकमी खर्च अंदाज (₹)',
    simulateWealthTrajectory: 'संपत्ती वाढीचा अंदाज घ्या',
    baselineVsScenario: 'मूळ विरुद्ध परिदृश्य तुलना',
    mentorGreeting: 'मी आपला DhanaDrishti AI आर्थिक मार्गदर्शक आहे. SIP, कर किंवा आर्थिक नियोजनाबद्दल काहीही विचारा!',
    askMentorPlaceholder: 'SIP, कर, आपत्कालीन निधी किंवा पगार यासंबंधी प्रश्न विचारा...',
    askButton: 'मार्गदर्शकास विचारा',
    mentorThinking: 'DhanaDrishti AI मार्गदर्शक विचार करत आहे...',
    documentExplainerTitle: 'आर्थिक दस्तऐवज स्पष्टीकरण',
    uploadDocument: 'पगार स्लिप, फॉर्म 16 किंवा बँक स्टेटमेंट अपलोड करा',
    takePhoto: 'दस्तऐवजाचा फोटो काढा',
    videoLessonsTitle: 'निवडक आर्थिक साक्षरता व्हिडिओ धडे',
    allTopics: 'सर्व विषय',
    mythFactCheckTitle: 'आर्थिक वास्तव पडताळणी (गैरसमज की सत्य)',
    checkStatementPlaceholder: 'आपण ऐकलेला कोणताही आर्थिक सल्ला किंवा कर नियम येथे लिहा...',
    checkStatementButton: 'सत्यता तपासा',
    verdictMyth: 'निकाल: गैरसमज (Myth)',
    verdictFact: 'निकाल: सत्य (Fact)',
    verdictDepends: 'निकाल: अंशतः सत्य / संदर्भावर अवलंबून',
    rememberThis: 'लक्षात ठेवा',
    commonMistake: 'सामान्य चूक',
  },
};

export function getTranslation(language: PreferredLanguage): TranslationDictionary {
  return UI_TRANSLATIONS[language] || UI_TRANSLATIONS.English;
}
