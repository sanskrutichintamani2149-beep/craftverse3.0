export type VideoLanguage = 'English' | 'Hindi' | 'Marathi';

export type VideoTopic =
  | 'Financial Literacy & RBI'
  | 'Mutual Funds & SIP'
  | 'Personal Finance & Budgeting'
  | 'Stock Market Basics'
  | 'Emergency Fund & Wealth';

export interface CuratedVideo {
  id: string;
  videoId: string;
  title: string;
  topic: VideoTopic;
  language: VideoLanguage;
  channel: string;
  duration: string;
  description: string;
}

/**
 * Centralized list of verified, embeddable Indian financial education YouTube videos.
 * All video IDs have been verified via YouTube oEmbed API for active availability and embedding support.
 */
export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'rbi-paisa-bolta-hai',
    videoId: '_xglqWq_VNg',
    title: "Paisa Bolta Hai - Official Financial Literacy Film by Reserve Bank of India",
    topic: 'Financial Literacy & RBI',
    language: 'Hindi',
    channel: 'Reserve Bank of India (RBI)',
    duration: '05:12',
    description:
      'Official Reserve Bank of India (RBI) awareness film on smart banking habits, safe currency practices, and foundational financial literacy for Indian citizens.',
  },
  {
    id: 'rachana-lumpsum-or-sip-en',
    videoId: 't6BQ1Wle8c4',
    title: 'Lumpsum or SIP, Which is Better? Complete Mutual Fund Guide',
    topic: 'Mutual Funds & SIP',
    language: 'English',
    channel: 'CA Rachana Phadke Ranade',
    duration: '14:28',
    description:
      'Clear breakdown of Systematic Investment Plans (SIP) vs Lumpsum investing, rupee-cost averaging, and how salaried professionals should deploy monthly savings.',
  },
  {
    id: 'rachana-9-financial-lessons-en',
    videoId: 'q7Zj1uH742Y',
    title: '9 Timeless Personal Finance & Wealth Creation Lessons',
    topic: 'Personal Finance & Budgeting',
    language: 'English',
    channel: 'CA Rachana Phadke Ranade',
    duration: '16:40',
    description:
      'Actionable personal finance rules covering discipline, asset allocation, emergency preparedness, and long-term compounding for Indian households.',
  },
  {
    id: 'pranjal-mint-your-money-en',
    videoId: 'RkAFvjgL4KA',
    title: 'Mint Your Money — Indian Personal Finance Blueprint (English Summary)',
    topic: 'Personal Finance & Budgeting',
    language: 'English',
    channel: 'Pranjal Kamra / Audiobook 101',
    duration: '18:15',
    description:
      'Comprehensive English guide based on Pranjal Kamra’s Mint Your Money covering budgeting, zero-debt habits, health & term insurance, and mutual fund selection.',
  },
  {
    id: 'zerodha-varsity-algo-en',
    videoId: 'V9Ra8klDzrM',
    title: 'Systematic Market Strategies & Financial Rules Explained',
    topic: 'Stock Market Basics',
    language: 'English',
    channel: 'Zerodha Varsity',
    duration: '12:50',
    description:
      'Zerodha Varsity educational module on rule-based market participation, removing emotional bias from investing, and disciplined execution.',
  },
  {
    id: 'bajaj-sip-beginners-hi',
    videoId: 'fLqdzG7vtps',
    title: 'SIP for Beginners — What Is SIP & How to Start Investing in Mutual Funds',
    topic: 'Mutual Funds & SIP',
    language: 'Hindi',
    channel: 'Bajaj Finserv Mutual Fund',
    duration: '06:45',
    description:
      'Step-by-step Hindi explainer on how Systematic Investment Plans (SIP) work, the power of compounding, and starting your wealth journey with ₹500/month.',
  },
  {
    id: 'emergency-fund-planning-hi',
    videoId: 'J2DqyY_XTt4',
    title: 'Emergency Fund क्या होता है और कैसे बनाएं? (Emergency Fund Planning)',
    topic: 'Emergency Fund & Wealth',
    language: 'Hindi',
    channel: 'Financial Education India',
    duration: '09:30',
    description:
      'Why every salaried professional needs 6 months of living expenses in an Emergency Fund and where to park it safely for instant liquidity.',
  },
  {
    id: 'pranjal-stock-market-lesson1-hi',
    videoId: 'RieqxXMds64',
    title: 'Stock Market Classes Lesson 1 — Stock Market Basics for Beginners in Hindi',
    topic: 'Stock Market Basics',
    language: 'Hindi',
    channel: 'Pranjal Kamra',
    duration: '22:18',
    description:
      'Foundational Hindi masterclass on how the Indian stock market (NSE & BSE) works, SEBI regulation, inflation-beating returns, and fundamental investing.',
  },
  {
    id: 'pranjal-beginners-share-market-hi',
    videoId: '3UF0ymVdYLA',
    title: 'How Beginners Can Start Investing in the Indian Share Market',
    topic: 'Stock Market Basics',
    language: 'Hindi',
    channel: 'Pranjal Kamra',
    duration: '15:42',
    description:
      'Practical roadmap for first-time Indian investors to avoid common mistakes, choose between direct stocks and mutual funds, and build long-term wealth.',
  },
  {
    id: 'rachana-mutual-funds-mr',
    videoId: '5Ls-mm01SdA',
    title: 'What are Mutual Funds? | म्युच्युअल फंडस् म्हणजे काय? (Marathi)',
    topic: 'Mutual Funds & SIP',
    language: 'Marathi',
    channel: 'CA Rachana Ranade (Marathi)',
    duration: '11:20',
    description:
      'सोप्या मराठी भाषेत म्युच्युअल फंड्स म्हणजे काय, त्याचे प्रकार (Equity, Debt, Hybrid) आणि सामान्य गुंतवणूकदारांसाठी त्याचे महत्त्व.',
  },
  {
    id: 'rachana-gold-property-sip-mr',
    videoId: 'nnj3GFOJeKM',
    title: 'Gold, Property or SIP? Best Investment for Middle Class Indians (Marathi)',
    topic: 'Emergency Fund & Wealth',
    language: 'Marathi',
    channel: 'CA Rachana Ranade / Sarva Kaahi',
    duration: '24:10',
    description:
      'सोनं, प्रॉपर्टी की SIP? मध्यमवर्गीय भारतीयांसाठी संपत्ती निर्मितीचा सर्वोत्तम मार्ग कोणता यावर सखोल मराठी चर्चा.',
  },
  {
    id: 'groww-8-golden-rules-mr',
    videoId: 'X5GLhIbKM0w',
    title: '8 Golden Personal Finance Rules to Manage Your Money in Marathi | वैयक्तिक वित्त नियम',
    topic: 'Personal Finance & Budgeting',
    language: 'Marathi',
    channel: 'Groww Marathi',
    duration: '10:15',
    description:
      'पैशांचे योग्य नियोजन, ५०-३०-२० बजेट नियम, आपत्कालीन निधी आणि गुंतवणुकीचे ८ सुवर्ण नियम मराठीमध्ये.',
  },
  {
    id: 'rbi-monetary-policy-mr',
    videoId: 'VqI5ufwmy-E',
    title: 'RBI Monetary Policy, Repo Rate & Inflation Explained in Marathi',
    topic: 'Financial Literacy & RBI',
    language: 'Marathi',
    channel: 'Adda247 Marathi',
    duration: '19:05',
    description:
      'भारतीय रिझर्व्ह बँकेचे (RBI) पतधोरण, रेपो रेट, महागाई नियंत्रण आणि तुमच्या कर्जाच्या EMI वर होणारा परिणाम मराठीतून समजून घ्या.',
  },
];
