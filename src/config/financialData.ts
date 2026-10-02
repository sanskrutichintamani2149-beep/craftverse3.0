export type TermCategory = 'Tax' | 'Investing' | 'Income' | 'Credit' | 'Business' | 'Basics';

export interface TermVideoInfo {
  videoId?: string;
  searchFallback: string;
  title: string;
  channel?: string;
}

export interface TermItem {
  id: string;
  term: string;
  category: TermCategory;
  shortDef: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  analogy: string;
  indianExample: string;
  rememberThis: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  commonMistake: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  mythStatement: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  professionTracks?: string[];
  video: {
    English: TermVideoInfo;
    Hindi: TermVideoInfo;
    Marathi: TermVideoInfo;
  };
}

export interface MythFactItem {
  id: string;
  category: string;
  myth: string;
  fact: string;
  proof: string;
}

export const TERM_O_PEDIA_ITEMS: TermItem[] = [
  {
    "id": "gst",
    "term": "GST (Goods and Services Tax)",
    "category": "Tax",
    "shortDef": {
      "English": "A unified destination-based indirect tax levied on the supply of goods and services across India, consolidating multiple cascading state and central levies.",
      "Hindi": "वस्तु एवं सेवा कर (GST) भारत में वस्तुओं और सेवाओं की आपूर्ति पर लगने वाला एक एकीकृत अप्रत्यक्ष कर है, जिसने कई पुराने राज्य और केंद्रीय करों को समाप्त किया है।",
      "Marathi": "वस्तू आणि सेवा कर (GST) हा देशभरातील वस्तू आणि सेवांच्या पुरवठ्यावर आकारला जाणारा एकसंध अप्रत्यक्ष कर असून त्याने जुने विविध राज्य आणि केंद्रीय कर एकत्र केले आहेत."
    },
    "analogy": "Like an all-inclusive single check at a restaurant replacing separate billing slips for state, municipal, and central service charges.",
    "indianExample": "Standard GST slabs in India are 0%, 5%, 12%, 18%, and 28%, governed by the GST Council under the Central and State GST Acts.",
    "rememberThis": {
      "English": "Businesses with annual aggregate turnover exceeding ₹40 Lakh (₹20 Lakh for services) must mandate GST registration and file regular monthly returns.",
      "Hindi": "₹40 लाख (सेवाओं के लिए ₹20 लाख) से अधिक वार्षिक टर्नओवर वाले व्यवसायों के लिए GST पंजीकरण और मासिक रिटर्न दाखिल करना अनिवार्य है।",
      "Marathi": "वार्षिक उलाढाल ₹४० लाखांपेक्षा जास्त (सेवा क्षेत्रासाठी ₹२० लाख) असणाऱ्या व्यवसायांसाठी GST नोंदणी कायद्याने बंधनकारक आहे."
    },
    "commonMistake": {
      "English": "Treating collected GST as business revenue rather than a statutory liability owed directly to the Government of India.",
      "Hindi": "ग्राहकों से वसूले गए GST को अपनी व्यावसायिक आय समझ लेना, जबकि यह सरकार को देय वैधानिक कर देनदारी है।",
      "Marathi": "ग्राहकांकडून गोळा केलेल्या GST ला स्वतःचे उत्पन्न मानणे, ही रक्कम शासनाकडे जमा करावी लागणारी देणी असते."
    },
    "mythStatement": {
      "English": "GST is a direct tax deducted directly from your personal monthly salary slip like Income Tax.",
      "Hindi": "GST एक प्रत्यक्ष कर है जो आयकर की तरह आपके व्यक्तिगत वेतन से सीधे काटा जाता है।",
      "Marathi": "GST हा प्राप्तिकराप्रमाणे तुमच्या पगारातून थेट कापला जाणारा प्रत्यक्ष कर आहे."
    },
    "professionTracks": [
      "Freelancers & Creators",
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "videoId": "V9Ra8klDzrM",
        "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+English+for+beginners",
        "title": "Goods & Services Tax Structure Explained",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "videoId": "_xglqWq_VNg",
        "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+Hindi",
        "title": "GST क्या है - सम्पूर्ण मार्गदर्शन",
        "channel": "Financial Awareness India"
      },
      "Marathi": {
        "videoId": "5Ls-mm01SdA",
        "searchFallback": "https://www.youtube.com/results?search_query=GST+mhanje+kay+Marathi",
        "title": "GST म्हणजे काय? संपूर्ण माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "tds",
    "term": "TDS (Tax Deducted at Source)",
    "category": "Tax",
    "shortDef": {
      "English": "A statutory mechanism under the Income Tax Act where the payer deducts tax at specified rates before making payments such as salary, professional fees, or bank interest.",
      "Hindi": "आयकर अधिनियम के तहत भुगतानकर्ता द्वारा वेतन, पेशेवर शुल्क या बैंक ब्याज का भुगतान करते समय स्रोत पर ही काटा जाने वाला अग्रिम कर।",
      "Marathi": "पगार, व्यावसायिक शुल्क किंवा बँक व्याज देताना रक्कम देणाऱ्या संस्थेने मूळ स्रोतावरच नियमानुसार कापून घेतलेला प्राप्तिकर."
    },
    "analogy": "Like an automated toll booth collecting a portion of the tax upfront along the highway to ensure continuous, disciplined revenue collection.",
    "indianExample": "Banks deduct 10% TDS under Section 194A on FD interest if annual earnings exceed ₹40,000 (₹50,000 for senior citizens).",
    "rememberThis": {
      "English": "Always verify that your deducted TDS reflects accurately in your Annual Information Statement (AIS) and Form 26AS before filing your ITR.",
      "Hindi": "अपना ITR दाखिल करने से पहले हमेशा जांच लें कि काटा गया TDS आपके Form 26AS और AIS में सही दिखाई दे रहा है।",
      "Marathi": "ITR भरण्यापूर्वी कापला गेलेला सर्व TDS तुमच्या Form 26AS आणि AIS मध्ये योग्यरित्या नोंदवला गेला आहे का याची खात्री करा."
    },
    "commonMistake": {
      "English": "Assuming that because TDS was deducted from salary or interest, there is no need to file an Income Tax Return.",
      "Hindi": "यह मान लेना कि TDS कट जाने के बाद आयकर रिटर्न (ITR) दाखिल करने की कोई आवश्यकता नहीं रहती।",
      "Marathi": "TDS कापला गेल्यामुळे आता प्राप्तिकर विवरणपत्र (ITR) भरण्याची आवश्यकता नाही असा चुकीचा समज करून घेणे."
    },
    "mythStatement": {
      "English": "TDS is an additional punitive surcharge over and above your final calculated income tax liability.",
      "Hindi": "TDS आपकी अंतिम आयकर देनदारी के अतिरिक्त लगाया जाने वाला एक अलग दंडात्मक शुल्क है।",
      "Marathi": "TDS हा तुमच्या अंतिम प्राप्तिकराव्यतिरिक्त आकारला जाणारा वेगळा जाचक दंड आहे."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=TDS+Tax+Deducted+at+Source+explained+English",
        "title": "Understanding TDS and Form 26AS",
        "channel": "ClearTax India"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=TDS+kya+hota+hai+Hindi+guide",
        "title": "TDS क्या होता है और Form 26AS कैसे चेक करें",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=TDS+mhanje+kay+Marathi",
        "title": "TDS म्हणजे काय आणि परतावा कसा मिळवावा",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "income-tax",
    "term": "Income Tax",
    "category": "Tax",
    "shortDef": {
      "English": "A constitutional direct tax levied annually by the Central Government on the total net taxable income earned by individuals, HUFs, and corporate entities.",
      "Hindi": "व्यक्तियों, अविभाजित हिंदू परिवारों (HUF) और कंपनियों की वार्षिक शुद्ध करयोग्य आय पर केंद्र सरकार द्वारा लगाया जाने वाला प्रत्यक्ष कर।",
      "Marathi": "व्यक्ती, हिंदू अविभक्त कुटुंबे आणि कंपन्यांच्या वार्षिक निव्वळ करपात्र उत्पन्नावर केंद्र सरकारद्वारे आकारला जाणारा प्रत्यक्ष कर."
    },
    "analogy": "A mandatory annual civic contribution paid to finance sovereign defense, expressways, healthcare, and national public infrastructure.",
    "indianExample": "Governed by the Income Tax Act 1961, with tax slabs revised annually in the Union Budget presented to Parliament.",
    "rememberThis": {
      "English": "Income Tax is computed on taxable income after legal deductions and statutory exemptions, not on total gross salary.",
      "Hindi": "आयकर की गणना कुल सकल वेतन पर नहीं, बल्कि अनुमेय छूट और कटौतियों के बाद बची शुद्ध करयोग्य आय पर की जाती है।",
      "Marathi": "प्राप्तिकराची आकारणी एकूण वेतनावर न होता, कायदेशीर वजावटींनंतर उरणाऱ्या निव्वळ करपात्र उत्पन्नावर केली जाते."
    },
    "commonMistake": {
      "English": "Failing to disclose interest earned on savings bank accounts or capital gains from mutual fund switches on your annual ITR.",
      "Hindi": "सेविंग्स अकाउंट पर मिले ब्याज या म्यूचुअल फंड स्विच से हुए कैपिटल गेन्स को ITR में घोषित न करना।",
      "Marathi": "बचत खात्यावरील व्याज किंवा म्युच्युअल फंड युनिट्सच्या बदल्यातून झालेला नफा ITR मध्ये दाखवण्यास विसरणे."
    },
    "mythStatement": {
      "English": "If your total annual salary is under ₹7 Lakh, you do not even need to file an ITR.",
      "Hindi": "यदि आपकी कुल वार्षिक आय ₹7 लाख से कम है, तो ITR फाइल करने का कोई औचित्य या लाभ नहीं होता।",
      "Marathi": "वार्षिक उत्पन्न ₹७ लाखांच्या आत असल्यास ITR भरण्याची कसलीही गरज नसते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+basics+India+English",
        "title": "Indian Income Tax System Explained",
        "channel": "Pranjal Kamra"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+slabs+guide+Hindi",
        "title": "Income Tax Slabs & Rules Explained",
        "channel": "CA Rachana Ranade"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+niyam+Marathi",
        "title": "इन्कम टॅक्स नियम आणि स्लॅब मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "itr",
    "term": "ITR (Income Tax Return)",
    "category": "Tax",
    "shortDef": {
      "English": "The prescribed electronic statutory declaration submitted to the Income Tax Department stating gross earnings, deductions, taxes paid, and refund claims for a financial year.",
      "Hindi": "आयकर विभाग के पोर्टल पर जमा किया जाने वाला वार्षिक वैधानिक प्रपत्र, जिसमें आपकी कुल आय, कटौतियां, चुकाया गया कर और रिफंड का पूर्ण विवरण होता है।",
      "Marathi": "आर्थिक वर्षातील एकूण उत्पन्न, वजावटी, भरलेला कर आणि परताव्याचा दावा दर्शवणारे प्राप्तिकर विभागाकडे सादर केले जाणारे अधिकृत विवरणपत्र."
    },
    "analogy": "Your official annual financial passport stamped by the sovereign government certifying your declared legitimate earnings.",
    "indianExample": "ITR-1 (Sahaj) applies to salaried individuals with total income up to ₹50 Lakh, whereas ITR-4 (Sugam) covers presumptive business/freelance income under Section 44ADA.",
    "rememberThis": {
      "English": "Filing ITR on or before the statutory July 31 deadline is critical to carry forward capital losses and ensure smooth visa approvals and Home Loan underwriting.",
      "Hindi": "पूंजीगत हानियों (Capital Losses) को आगे ले जाने और होम लोन की त्वरित स्वीकृति के लिए 31 जुलाई से पहले ITR दाखिल करना आवश्यक है।",
      "Marathi": "भांडवली तोटा पुढील वर्षांसाठी वर्ग करण्यासाठी आणि गृहकर्ज मंजुरीसाठी ३१ जुलैपूर्वी ITR भरणे अत्यावश्यक आहे."
    },
    "commonMistake": {
      "English": "Selecting the incorrect ITR form (e.g. filing ITR-1 when holding unlisted equity shares or direct capital gains).",
      "Hindi": "गलत ITR फॉर्म चुन लेना (जैसे अनलिस्टेड शेयर या कैपिटल गेन्स होने पर भी ITR-1 दाखिल कर देना)।",
      "Marathi": "चुकीचा ITR फॉर्म निवडणे (उदा. भांडवली नफा किंवा खाजगी शेअर्स असताना ITR-1 भरणे)."
    },
    "mythStatement": {
      "English": "Filing an Income Tax Return automatically triggers a tax audit or assessment notice from the department.",
      "Hindi": "ITR दाखिल करने से आयकर विभाग द्वारा जांच या स्क्रूटनी का नोटिस अनिवार्य रूप से आ जाता है।",
      "Marathi": "ITR सादर केल्यास प्राप्तिकर विभागाकडून तपासणीची नोटीस हमखास येते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=how+to+file+ITR+step+by+step+English",
        "title": "Filing Your Income Tax Return Step-by-Step",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ITR+file+kaise+kare+Hindi",
        "title": "ITR कैसे फाइल करें - पूरी प्रक्रिया",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ITR+file+karne+paddhat+Marathi",
        "title": "ITR कसा भरावा - सोपी मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "tax-regime",
    "term": "Tax Regime (Old vs New)",
    "category": "Tax",
    "shortDef": {
      "English": "The dual taxation framework in India: the New Regime offering lower tax slab rates without deductions, versus the Old Regime permitting exemptions like Section 80C, 80D, and HRA.",
      "Hindi": "भारत में दोहरी कर व्यवस्था: नई कर व्यवस्था (कम टैक्स दरें बिना किसी छूट के) बनाम पुरानी कर व्यवस्था (धारा 80C, 80D और HRA जैसी छूटों के साथ)।",
      "Marathi": "भारतातील दुहेरी कर प्रणाली: वजावटींशिवाय कमी करदर असणारी नवीन प्रणाली विरुद्ध कलम 80C, 80D आणि HRA अशा सवलती देणारी जुनी प्रणाली."
    },
    "analogy": "Choosing between a flat-rate buffet with all items included, versus an à la carte menu where itemized coupons lower the final tally.",
    "indianExample": "Under the New Tax Regime (FY 2025-26), individuals with taxable income up to ₹12 Lakh effectively pay zero tax after Section 87A rebate and ₹75,000 standard deduction.",
    "rememberThis": {
      "English": "The New Tax Regime is the default regime; salaried taxpayers may switch between regimes annually at the time of filing their return.",
      "Hindi": "नई कर व्यवस्था डिफॉल्ट व्यवस्था है; वेतनभोगी कर्मचारी हर वित्तीय वर्ष में अपनी सुविधानुसार पुरानी या नई व्यवस्था चुन सकते हैं।",
      "Marathi": "नवीन कर प्रणाली ही मूळ (Default) प्रणाली आहे; नोकरदार व्यक्ती दरवर्षी ITR भरताना योग्य त्या प्रणालीची निवड करू शकतात."
    },
    "commonMistake": {
      "English": "Locking ₹1.5 Lakh into tax-saving schemes without calculating whether the New Regime provides a lower tax liability with zero investments.",
      "Hindi": "बिना तुलना किए केवल टैक्स बचाने के लिए ₹1.5 लाख निवेश कर देना, जबकि नई व्यवस्था में बिना निवेश ही टैक्स शून्य हो सकता था।",
      "Marathi": "दोन्ही प्रणालींची तुलना न करता घाईघाईने गुंतवणूक करणे, ज्यामुळे कर कमी न होता भांडवल अडकून पडते."
    },
    "mythStatement": {
      "English": "The Old Tax Regime has been abolished and is no longer legally available to Indian taxpayers.",
      "Hindi": "पुरानी कर व्यवस्था को पूरी तरह समाप्त कर दिया गया है और अब यह कानूनी रूप से उपलब्ध नहीं है।",
      "Marathi": "जुनी कर प्रणाली पूर्णपणे रद्द करण्यात आली असून ती आता करदात्यांना उपलब्ध नाही."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+Tax+regime+comparison+English",
        "title": "New vs Old Tax Regime Detailed Analysis",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Old+vs+New+tax+regime+kon+sa+chune+Hindi",
        "title": "Old vs New Tax Regime: कौन सा चुनें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+tax+regime+Marathi",
        "title": "नवीन की जुनी कर प्रणाली? सविस्तर मार्गदर्शन",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "capital-gains",
    "term": "Capital Gains",
    "category": "Tax",
    "shortDef": {
      "English": "The net taxable profit realized when a capital asset—such as listed shares, equity mutual funds, commercial property, or gold—is transferred or sold above its acquisition cost.",
      "Hindi": "किसी पूंजीगत संपत्ति (जैसे शेयर, म्यूचुअल फंड, अचल संपत्ति या सोना) को उसके खरीद मूल्य से अधिक कीमत पर बेचने पर प्राप्त शुद्ध लाभ।",
      "Marathi": "शेअर्स, म्युच्युअल फंड, स्थावर मालमत्ता किंवा सोने यांसारख्या भांडवली मालमत्तांची खरेदी किमतीपेक्षा जास्त भावाने विक्री केल्यावर होणारा निव्वळ नफा."
    },
    "analogy": "The harvested profit when selling an antique car or commercial plot at an appreciated market valuation.",
    "indianExample": "Regulated under Sections 45 to 55 of the Income Tax Act with differentiated rates for short-term and long-term holding tenures.",
    "rememberThis": {
      "English": "Capital gains taxes are only triggered upon actual sale (realization); unrealized paper gains remain completely untaxed.",
      "Hindi": "पूंजीगत लाभ कर केवल संपत्ति की वास्तविक बिक्री पर लगता है; पोर्टफोलियो में दिख रहे अनरियलाइज्ड मुनाफे पर कोई टैक्स नहीं लगता।",
      "Marathi": "भांडवली नफा कर केवळ प्रत्यक्ष विक्री झाल्यानंतरच आकारला जातो; पोर्टफोलिओतील न विकलेल्या नफ्यावर कर लागत नाही."
    },
    "commonMistake": {
      "English": "Failing to index the acquisition cost when calculating long-term capital gains on unlisted real estate transactions.",
      "Hindi": "अचल संपत्ति की बिक्री पर दीर्घकालिक पूंजीगत लाभ की गणना करते समय इंडेक्सेशन लाभ को नजरअंदाज करना।",
      "Marathi": "स्थावर मालमत्तेच्या दीर्घकालीन विक्रीवर भांडवली नफ्याची आकारणी करताना नियमांनुसार इंडेक्सेशन न तपासणे."
    },
    "mythStatement": {
      "English": "Capital gains tax must be paid every financial year even if you have not sold any shares or mutual fund units.",
      "Hindi": "यदि आपने कोई शेयर या म्यूचुअल फंड नहीं बेचा है, तब भी हर साल पूंजीगत लाभ कर चुकाना अनिवार्य होता है।",
      "Marathi": "शेअर्स किंवा म्युच्युअल फंड युनिट्स विकले नसले तरी दरवर्षी भांडवली नफा कर भरावा लागतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Capital+Gains+Tax+India+Explained+English",
        "title": "Capital Gains Taxation in India",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+kya+hota+hai+Hindi",
        "title": "Capital Gains Tax क्या है? सरल हिंदी में",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+Marathi",
        "title": "कॅपिटल गेन्स टॅक्स म्हणजे काय? मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "stcg",
    "term": "Short-Term Capital Gains (STCG)",
    "category": "Tax",
    "shortDef": {
      "English": "Taxable profits earned on listed equities or equity mutual funds held for 12 months or less, taxed under Section 111A at a flat statutory rate of 20%.",
      "Hindi": "12 महीने या उससे कम समय के लिए रखे गए लिस्टेड शेयरों या इक्विटी फंडों की बिक्री से अर्जित लाभ, जिस पर धारा 111A के तहत फ्लैट 20% टैक्स लगता है।",
      "Marathi": "१२ महिने किंवा त्यापेक्षा कमी कालावधीत विकलेल्या समभागांवर होणारा नफा, ज्यावर कलम 111A अंतर्गत २०% निश्चित दराने कर आकारला जातो."
    },
    "analogy": "A fast-lane exit toll applied to rapid investments liquidated before completing one full calendar year.",
    "indianExample": "Following Union Budget 2024 revisions, Section 111A STCG on listed equity securities was standardized at 20% plus applicable cess.",
    "rememberThis": {
      "English": "Short-term capital losses can only be set off against short-term or long-term capital gains, not against regular salary income.",
      "Hindi": "शॉर्ट-टर्म कैपिटल लॉस की भरपाई केवल कैपिटल गेन्स से की जा सकती है, इसे अपनी नियमित वेतन आय से नहीं घटाया जा सकता।",
      "Marathi": "अल्पकालीन भांडवली तोटा केवळ भांडवली नफ्यातूनच वजा करता येतो, वेतनाच्या उत्पन्नातून नाही."
    },
    "commonMistake": {
      "English": "Switching between equity mutual fund schemes within 12 months and ignoring the resulting 20% STCG liability.",
      "Hindi": "एक साल के भीतर एक म्यूचुअल फंड से दूसरे में स्विच करना और उस पर लगने वाले 20% STCG टैक्स को भूल जाना।",
      "Marathi": "एका वर्षाच्या आत म्युच्युअल फंड योजना बदलणे आणि त्यावर २०% STCG कर देय असल्याचे विसरणे."
    },
    "mythStatement": {
      "English": "Short-term capital gains are added to your salary and taxed at your personal slab rate of 30%.",
      "Hindi": "लिस्टेड इक्विटी का शॉर्ट-टर्म कैपिटल गेन आपके वेतन में जुड़कर 30% स्लैब रेट पर टैक्स होता है।",
      "Marathi": "इक्विटीवरील अल्पकालीन भांडवली नफा तुमच्या वेतनात मिळवून ३०% च्या सर्वोच्च दराने करपात्र होतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=STCG+Short+term+capital+gains+tax+explained+English",
        "title": "STCG Rules & Calculations",
        "channel": "Groww"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+kya+hai+Hindi",
        "title": "शॉर्ट टर्म कैपिटल गेन टैक्स की पूरी जानकारी",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+rules+Marathi",
        "title": "STCG कर नियम आणि आकारणी मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "ltcg",
    "term": "Long-Term Capital Gains (LTCG)",
    "category": "Tax",
    "shortDef": {
      "English": "Profits realized on equity investments held over 12 months, taxed under Section 112A at 12.5% on annual cumulative gains exceeding the statutory ₹1.25 Lakh exemption limit.",
      "Hindi": "12 महीने से अधिक समय तक रखे गए इक्विटी निवेश की बिक्री पर अर्जित लाभ, जहां वार्षिक ₹1.25 लाख से अधिक के लाभ पर 12.5% की दर से टैक्स लगता है।",
      "Marathi": "१२ महिन्यांपेक्षा जास्त काळ ठेवलेल्या समभाग गुंतवणुकीवरील नफा; आर्थिक वर्षात ₹१.२५ लाखांवरील नफ्यावर १२.५% दराने कर लागू होतो."
    },
    "analogy": "A concessionary reward toll for patient investors who nurture enterprise capital over multiannual horizons.",
    "indianExample": "If your listed equity mutual fund gains after 3 years total ₹2,00,000, the first ₹1,25,000 is tax-free and the remaining ₹75,000 is taxed at 12.5% (₹9,375 plus cess).",
    "rememberThis": {
      "English": "Take advantage of annual tax-harvesting by booking up to ₹1.25 Lakh in long-term capital gains tax-free before March 31 each financial year.",
      "Hindi": "हर साल 31 मार्च से पहले ₹1.25 लाख तक का लॉन्ग-टर्म कैपिटल गेन बुक करके कानूनी रूप से टैक्स बचाने (Tax Harvesting) की रणनीति अपनाएं।",
      "Marathi": "दरवर्षी ३१ मार्चपूर्वी ₹१.२५ लाखांपर्यंतचा भांडवली नफा बुक करून करमुक्त पुनर्गंतवणूक (Tax Harvesting) करण्याची संधी वापरा."
    },
    "commonMistake": {
      "English": "Assuming all equity gains held for more than 1 year are 100% tax-exempt as was the case prior to 2018.",
      "Hindi": "यह समझना कि 1 साल से पुराने सभी इक्विटी मुनाफे पूरी तरह करमुक्त हैं (जैसा 2018 से पहले हुआ करता था)।",
      "Marathi": "१ वर्षापेक्षा जुना सर्व इक्विटी नफा १००% करमुक्त असतो असा जुना गैरसमज बाळगणे."
    },
    "mythStatement": {
      "English": "LTCG tax of 12.5% is charged on the entire sale consideration rather than purely on the net profit.",
      "Hindi": "LTCG टैक्स पूरी बिक्री राशि पर लगता है, न कि केवल अर्जित शुद्ध लाभ पर।",
      "Marathi": "LTCG कर एकूण विक्री रकमेवर आकारला जातो, निव्वळ नफ्यावर नाही."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=LTCG+Long+Term+Capital+Gains+tax+12.5+percent+English",
        "title": "LTCG Tax Rules and ₹1.25L Exemption",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+kya+hota+hai+budget+rules+Hindi",
        "title": "LTCG टैक्स और टैक्स हार्वेस्टिंग की तकनीक",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+Marathi+explanation",
        "title": "दीर्घकालीन भांडवली नफा कर (LTCG) मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "tax-deductible",
    "term": "Tax Deductible (Section 80C & 80D)",
    "category": "Tax",
    "shortDef": {
      "English": "Eligible statutory outflows and investments—such as EPF, PPF, ELSS (80C up to ₹1.5L) and health insurance premiums (80D up to ₹25k–₹50k)—that reduce gross taxable income under the Old Regime.",
      "Hindi": "वे वैध खर्च और निवेश (जैसे EPF, PPF, ELSS एवं स्वास्थ्य बीमा प्रीमियम) जो पुरानी कर व्यवस्था में आपकी कुल करयोग्य आय को घटाते हैं।",
      "Marathi": "कायदेशीरदृष्ट्या अनुज्ञेय खर्च आणि गुंतवणूक (उदा. EPF, PPF, ELSS आणि आरोग्य विमा हप्ता) ज्यामुळे जुन्या कर प्रणालीत करपात्र उत्पन्न कमी होते."
    },
    "analogy": "Official discount vouchers recognized by the tax code that deduct directly from the taxable weight of your salary.",
    "indianExample": "Section 80D provides up to ₹25,000 deduction for self/family health insurance and an additional ₹50,000 for senior citizen parents.",
    "rememberThis": {
      "English": "Deductions under Chapter VI-A (80C, 80D, 80E) are strictly unavailable under the default New Tax Regime.",
      "Hindi": "अध्याय VI-A की अधिकांश कटौतियां (80C, 80D) डिफॉल्ट नई कर व्यवस्था में स्वीकार्य नहीं हैं।",
      "Marathi": "कलम 80C आणि 80D अंतर्गत मिळणाऱ्या वजावटी नवीन कर प्रणालीत उपलब्ध नसतात."
    },
    "commonMistake": {
      "English": "Buying expensive traditional insurance endowment plans in March solely to exhaust the ₹1.5 Lakh 80C limit.",
      "Hindi": "केवल धारा 80C की सीमा समाप्त करने के लिए मार्च के महीने में कम रिटर्न वाली एंडोमेंट पॉलिसियां खरीद लेना।",
      "Marathi": "केवळ कलम 80C ची मर्यादा संपवण्यासाठी मार्च महिन्यात निकृष्ट परतावा देणाऱ्या विमा पॉलिसी खरेदी करणे."
    },
    "mythStatement": {
      "English": "A ₹1,50,000 deduction under Section 80C means the government transfers ₹1,50,000 cash back to your bank account.",
      "Hindi": "धारा 80C में ₹1.5 लाख की छूट का मतलब है कि सरकार ₹1.5 लाख आपके बैंक खाते में सीधे वापस भेज देती है।",
      "Marathi": "कलम 80C खाली ₹१.५ लाखांची वजावट म्हणजे सरकार तेवढी रोकड थेट तुमच्या खात्यात जमा करते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Section+80C+and+80D+deductions+explained+English",
        "title": "How Tax Deductions Work under Chapter VI-A",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Section+80C+80D+tax+deductions+Hindi",
        "title": "80C और 80D से टैक्स कैसे बचाएं",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Kalam+80C+80D+Marathi",
        "title": "कलम 80C आणि 80D वजावटी मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "tax-exemption",
    "term": "Tax Exemption (HRA & LTA)",
    "category": "Tax",
    "shortDef": {
      "English": "Specific statutory components of income—such as House Rent Allowance under Section 10(13A) or Leave Travel Allowance—that are legally excluded from total taxable income upon meeting conditions.",
      "Hindi": "वेतन के विशिष्ट घटक (जैसे धारा 10(13A) के तहत HRA या LTA) जो वैध किराया रसीदें या यात्रा बिल प्रस्तुत करने पर करयोग्य आय की गणना से बाहर कर दिए जाते हैं।",
      "Marathi": "वेतनाचे असे विशिष्ट भाग (उदा. कलम 10(13A) खाली HRA किंवा LTA) जे घरभाडे पावत्या किंवा प्रवास पुरावे दिल्यावर करपात्र उत्पन्नातून पूर्णपणे वगळले जातात."
    },
    "analogy": "A diplomatic tax-free zone inside your compensation contract designated for essential living and transit expenses.",
    "indianExample": "HRA exemption is the least of: actual HRA received, 50% of basic salary (metro) / 40% (non-metro), or actual rent paid minus 10% of basic salary.",
    "rememberThis": {
      "English": "HRA and LTA exemptions can only be claimed under the Old Tax Regime and require landlord PAN details if annual rent exceeds ₹1,00,000.",
      "Hindi": "HRA छूट केवल पुरानी कर व्यवस्था में मिलती है और यदि वार्षिक किराया ₹1 लाख से अधिक है तो मकान मालिक का PAN अनिवार्य है।",
      "Marathi": "HRA सवलत केवळ जुन्या कर प्रणालीत मिळते आणि वार्षिक भाडे ₹१ लाखांपेक्षा जास्त असल्यास घरमालकाचा PAN आवश्यक असतो."
    },
    "commonMistake": {
      "English": "Attempting to claim HRA while owning and residing in your own residential home in the same municipality.",
      "Hindi": "उसी शहर में अपने स्वयं के मकान में रहते हुए भी कंपनी से प्राप्त HRA पर कर छूट का दावा करना।",
      "Marathi": "स्वतःच्या मालकीच्या घरात राहूनही कंपनीकडून मिळणाऱ्या HRA वर करसवलतीचा दावा करणे."
    },
    "mythStatement": {
      "English": "Whatever full HRA amount is credited on your monthly salary slip is automatically 100% tax-free without calculations.",
      "Hindi": "सैलरी स्लिप में दिखने वाला पूरा HRA बिना किसी गणना या किराए की रसीद के पूरी तरह टैक्स-फ्री होता है।",
      "Marathi": "पगारपत्रकात दिसणारा संपूर्ण HRA कसल्याही भाड्याच्या पावत्यांशिवाय आपोआप १००% करमुक्त असतो."
    },
    "professionTracks": [
      "Salaried Employees"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+HRA+tax+exemption+calculated+English",
        "title": "HRA Tax Exemption Calculation Formula",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=HRA+calculation+Hindi+guide",
        "title": "HRA कैलकुलेशन और टैक्स छूट के नियम",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=HRA+exemption+calculation+Marathi",
        "title": "HRA करसवलत कशी मोजावी? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "tax-rebate",
    "term": "Tax Rebate (Section 87A)",
    "category": "Tax",
    "shortDef": {
      "English": "A statutory relief credited directly against calculated income tax for resident individuals whose net taxable income stays below specified legal thresholds.",
      "Hindi": "निवासी भारतीय व्यक्तियों को देय कर में मिलने वाली सीधी राहत, जिससे निर्धारित आय सीमा के भीतर कर देनदारी घटकर शून्य हो जाती है।",
      "Marathi": "विहित उत्पन्न मर्यादेच्या आत असणाऱ्या भारतीय रहिवासी करदात्यांच्या अंतिम प्राप्तिकरातून मिळणारी थेट कायदेशीर सूट, ज्यामुळे कर शून्य होतो."
    },
    "analogy": "A government waiver voucher applied at the cashier desk that cancels out the total tax bill if your income remains below the middle-income benchmark.",
    "indianExample": "In the New Tax Regime, Section 87A rebate provides relief up to ₹25,000 (effectively zero tax up to ₹7L under FY24 rules, expanded to ₹12L in revised budget framework).",
    "rememberThis": {
      "English": "Section 87A is an end-of-calculation tax credit against tax liability, not an income deduction that lowers gross income.",
      "Hindi": "धारा 87A एक टैक्स रिबेट (कर छूट) है जो अंतिम कर राशि से घटती है, यह कोई आय कटौती (Deduction) नहीं है।",
      "Marathi": "कलम 87A ही कर रकमेवर मिळणारी थेट सूट (Tax Credit) आहे, ती उत्पन्नातून वजा होणारी कपात नाही."
    },
    "commonMistake": {
      "English": "Assuming non-resident Indians (NRIs) are eligible for Section 87A rebate (it is restricted exclusively to resident individuals).",
      "Hindi": "यह मान लेना कि अनिवासी भारतीय (NRI) भी धारा 87A की कर छूट के पात्र हैं (यह केवल निवासी भारतीयों के लिए है)।",
      "Marathi": "अनिवासी भारतीयांनाही (NRI) कलम 87A ची करसवलत मिळते असा चुकीचा समज करून घेणे."
    },
    "mythStatement": {
      "English": "Section 87A can be claimed on special-rate incomes like Short-Term Capital Gains under Section 111A.",
      "Hindi": "धारा 111A के तहत शॉर्ट-टर्म कैपिटल गेन्स पर भी धारा 87A का रिबेट आसानी से लिया जा सकता है।",
      "Marathi": "इक्विटीवरील विशेष STCG करावरही कलम 87A ची सवलत विनाअडथळा लागू होते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Section+87A+Rebate+explained+English",
        "title": "Section 87A Tax Rebate Rules & Slabs",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Section+87A+kya+hai+Hindi",
        "title": "धारा 87A का पूरा सच और टैक्स छूट",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Section+87A+rebate+Marathi",
        "title": "कलम 87A कर सवलत नियम मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "advance-tax",
    "term": "Advance Tax",
    "category": "Tax",
    "shortDef": {
      "English": "The 'pay-as-you-earn' statutory schedule requiring individuals and businesses with estimated annual tax liability over ₹10,000 to pay tax in quarterly installments.",
      "Hindi": "कमाई के साथ कर चुकाने की वैधानिक प्रणाली, जिसके तहत यदि आपकी अनुमानित वार्षिक कर देनदारी ₹10,000 से अधिक है, तो 4 किस्तों में अग्रिम कर भरना होता है।",
      "Marathi": "आर्थिक वर्षात देय प्राप्तिकर ₹१०,००० पेक्षा जास्त असल्यास तो वर्षाअखेरीस न भरता दर तिमाहीला ४ हप्त्यांमध्ये भरण्याची वैधानिक पद्धत."
    },
    "analogy": "Paying your utility dues in quarterly progress tranches rather than receiving a giant penal bill at the close of March.",
    "indianExample": "Quarterly deadlines: 15% by June 15, 45% by Sept 15, 75% by Dec 15, and 100% by March 15; failure triggers interest under Sections 234B and 234C.",
    "rememberThis": {
      "English": "Freelancers, business owners, and salaried professionals with substantial capital gains or interest income must compute and remit Advance Tax quarterly.",
      "Hindi": "फ्रीलांसरों और शेयर बाजार से लाभ कमाने वालों को ब्याज दंड से बचने के लिए तिमाही अग्रिम कर जमा करना आवश्यक है।",
      "Marathi": "फ्रीलान्सर्स आणि भांडवली नफा मिळवणाऱ्या करदात्यांनी दंड टाळण्यासाठी दर तिमाहीला आगाऊ कर भरणे बंधनकारक आहे."
    },
    "commonMistake": {
      "English": "Waiting until July ITR filing to pay tax on heavy stock market capital gains, incurring mandatory interest penalties under Sections 234B & 234C.",
      "Hindi": "शेयर बाजार के बड़े मुनाफे का टैक्स जुलाई में ITR भरते समय देना, जिससे 234B और 234C का ब्याज जुर्माना लग जाता है।",
      "Marathi": "शेअर बाजारातील नफ्याचा कर थेट जुलैमध्ये भरल्यामुळे २३४B आणि २३४C कलमांखाली होणारा व्याज दंड."
    },
    "mythStatement": {
      "English": "Advance tax only applies to registered corporate companies, never to individuals or professionals.",
      "Hindi": "अग्रिम कर केवल बड़ी प्राइवेट लिमिटेड कंपनियों पर लागू होता है, व्यक्तिगत करदाताओं पर नहीं।",
      "Marathi": "आगाऊ कर केवळ मोठ्या कंपन्यांसाठी असतो, नोकरदार किंवा व्यावसायिकांसाठी नसतो."
    },
    "professionTracks": [
      "Freelancers & Creators",
      "Startup Founders",
      "Civil Engineering & Builders",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Advance+Tax+calculation+and+due+dates+English",
        "title": "Advance Tax Rules, Due Dates & Penalties",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+kaise+bhare+Hindi",
        "title": "Advance Tax क्या है और कैसे भरें?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+niyam+Marathi",
        "title": "आगाऊ कर (Advance Tax) नियम मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "tax-refund",
    "term": "Tax Refund",
    "category": "Tax",
    "shortDef": {
      "English": "The statutory repayment remitted directly by the Income Tax Department to your verified bank account when total taxes paid (TDS/Advance Tax) exceed final assessed tax liability.",
      "Hindi": "आयकर विभाग द्वारा आपके बैंक खाते में भेजा जाने वाला अतिरिक्त कर का पैसा, जब चुकाया गया TDS या अग्रिम कर आपकी वास्तविक देनदारी से अधिक हो।",
      "Marathi": "प्राप्तिकर विभागाकडून करदात्याच्या बँक खात्यात थेट जमा होणारा परतावा, जेव्हा कापलेला TDS किंवा आगाऊ कर प्रत्यक्ष देय करापेक्षा जास्त असतो."
    },
    "analogy": "Change returned by a cashier when the currency note you handed over exceeded the price of the purchase.",
    "indianExample": "If an employer deducted ₹90,000 TDS but your finalized net tax liability after regime choice is ₹55,000, you receive a ₹35,000 refund plus 0.5% monthly interest under Section 244A.",
    "rememberThis": {
      "English": "To receive your tax refund smoothly, ensure your bank account is pre-validated with matching PAN and active name on the e-filing portal.",
      "Hindi": "रिफंड निर्बाध रूप से प्राप्त करने के लिए आयकर पोर्टल पर अपना बैंक खाता पूर्व-सत्यापित (Pre-Validated) और PAN से लिंक रखें।",
      "Marathi": "प्राप्तिकर परतावा वेळेत मिळण्यासाठी आयकर पोर्टलवर तुमचे बँक खाते पूर्व-सत्यापित (Pre-validated) आणि पॅनशी जोडलेले असावे."
    },
    "commonMistake": {
      "English": "Failing to e-verify your ITR within 30 days of submission, which invalidates the return and halts all refund disbursements.",
      "Hindi": "ITR फाइल करने के बाद 30 दिनों के भीतर ई-सत्यापन (e-Verify) न करना, जिससे रिटर्न अमान्य हो जाता है और रिफंड रुक जाता है।",
      "Marathi": "ITR भरल्यानंतर ३० दिवसांच्या आत ई-व्हेरिफिकेशन न करणे, ज्यामुळे विवरणपत्र अवैध ठरून परतावा थांबतो."
    },
    "mythStatement": {
      "English": "The Income Tax Department charges a processing fee deduction before crediting your legitimate tax refund.",
      "Hindi": "आयकर विभाग आपके रिफंड की राशि खाते में भेजने से पहले उसमें से प्रोसेसिंग फीस काट लेता है।",
      "Marathi": "प्राप्तिकर विभाग तुमचा परतावा खात्यात जमा करण्यापूर्वी त्यातून प्रक्रिया शुल्क कापून घेतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+process+and+status+English",
        "title": "Tracking & Claiming Income Tax Refund",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+kab+aata+hai+Hindi",
        "title": "Income Tax Refund कब और कैसे आता है?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+Marathi+process",
        "title": "प्राप्तिकर परतावा (Refund) कसा मिळवावा?",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "gross-vs-net-salary",
    "term": "Gross Salary vs Net Salary",
    "category": "Income",
    "shortDef": {
      "English": "Gross Salary is the aggregate compensation before statutory withholdings, while Net Salary is the actual disposable income credited to your bank account.",
      "Hindi": "सकल वेतन (Gross Salary) कटौतियों से पहले की कुल वेतन राशि है, जबकि शुद्ध वेतन (Net Salary) टैक्स और PF कटने के बाद बैंक खाते में जमा होने वाली वास्तविक राशि है।",
      "Marathi": "स्थूल वेतन (Gross Salary) म्हणजे सर्व कपातींपूर्वीचा एकूण पगार, तर निव्वळ वेतन (Net Salary) म्हणजे कर आणि PF कपातीनंतर प्रत्यक्ष बँक खात्यात जमा होणारी रक्कम."
    },
    "analogy": "Gross is the total restaurant bill printout; Net is the remaining cash in your wallet after settling all mandatory taxes and service charges.",
    "indianExample": "On a ₹10,00,000 Gross Salary, mandatory deductions (EPF ₹43,200, Professional Tax ₹2,500, TDS ₹40,000) yield a Net take-home of ~₹9,14,300 (~₹76,190/month).",
    "rememberThis": {
      "English": "Always negotiate salary revisions and structure your household budget based on monthly Net Salary, not the annual Gross figure.",
      "Hindi": "अपनी मासिक EMI और जीवनशैली का बजट हमेशा शुद्ध वेतन (Net Salary) के आधार पर बनाएं, न कि ग्रॉस सैलरी पर।",
      "Marathi": "घरखर्च आणि मासिक EMI चे नियोजन नेहमी निव्वळ (Net) पगारावर करावे, ग्रॉस पगारावर नव्हे."
    },
    "commonMistake": {
      "English": "Committing to apartment rent or vehicle loans based on Gross Salary before accounting for employee provident fund and tax withholdings.",
      "Hindi": "ग्रॉस सैलरी देखकर अधिक किराए का मकान या महंगी कार लोन लेना और फिर इन-हैंड सैलरी कम पड़ने पर कर्ज में फंसना।",
      "Marathi": "ग्रॉस पगाराच्या आकड्यावर भुलून मोठे कर्ज घेणे आणि प्रत्यक्षात हातात कमी पगार आल्यावर अडचणीत येणे."
    },
    "mythStatement": {
      "English": "Gross Salary is the guaranteed amount that the employer must credit to your savings bank account each month.",
      "Hindi": "ग्रॉस सैलरी वह निश्चित राशि है जो नियोक्ता को हर महीने कर्मचारी के बैंक खाते में जमा करनी ही होती है।",
      "Marathi": "ग्रॉस पगार म्हणजे दरमहा बँक खात्यात जमा होणारी निश्चित हमीची रक्कम."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+vs+Net+Salary+explained+English",
        "title": "Gross Salary vs Net In-Hand Salary Breakdown",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+Salary+aur+Net+Salary+me+antar+Hindi",
        "title": "Gross vs Net Salary में क्या अंतर है?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+ani+Net+salary+Marathi",
        "title": "ग्रॉस पगार आणि नेट पगार यातील फरक",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "ctc",
    "term": "CTC (Cost to Company)",
    "category": "Income",
    "shortDef": {
      "English": "The total annual expense an enterprise incurs to employ an individual, encompassing direct salary, employer PF contribution, gratuity provision, medical insurance, and variable incentives.",
      "Hindi": "कंपनी द्वारा किसी कर्मचारी पर किया जाने वाला कुल वार्षिक वित्तीय व्यय, जिसमें मूल वेतन, भत्ते, नियोक्ता का PF अंशदान, ग्रेच्युटी और स्वास्थ्य बीमा शामिल होते हैं।",
      "Marathi": "कंपनीने एका कर्मचाऱ्यासाठी केलेला एकूण वार्षिक आर्थिक खर्च; यात मूळ पगार, भत्ते, कंपनीचा PF हिस्सा, ग्रॅच्युइटी आणि आरोग्य विम्याचा समावेश असतो."
    },
    "analogy": "The total ticket price paid for a chartered flight including fuel, runway taxes, baggage handling, and maintenance—not just the seat.",
    "indianExample": "A ₹15 LPA CTC job offer typically results in ~₹95,000–₹1,02,000 monthly in-hand credit after deducting statutory EPF, gratuity reserves, and monthly TDS.",
    "rememberThis": {
      "English": "Deconstruct every job offer letter by isolating Fixed Basic Salary from Variable Pay, Retention Bonuses, and Employer Retirement Provisions.",
      "Hindi": "जॉब ऑफर स्वीकारते समय हमेशा फिक्स्ड बेसिक सैलरी और वैरिएबल पे व ग्रेच्युटी प्रोविजन को अलग-अलग करके वास्तविक इन-हैंड की गणना करें।",
      "Marathi": "नोकरीची ऑफर स्वीकारताना व्हेरिएबल पे आणि ग्रॅच्युइटी वेगळी करून दरमहा प्रत्यक्ष किती रक्कम खात्यात येईल ते आधी तपासा."
    },
    "commonMistake": {
      "English": "Dividing annual CTC by 12 and expecting that exact rupee amount to be credited to your bank account at the end of the month.",
      "Hindi": "वार्षिक CTC को 12 से भाग देकर यह मान लेना कि हर महीने के अंत में उतनी पूरी नकदी खाते में जमा होगी।",
      "Marathi": "वार्षिक CTC ला १२ ने भागून तेवढाच पगार दरमहा खात्यात येईल अशी भाबडी अपेक्षा ठेवणे."
    },
    "mythStatement": {
      "English": "CTC represents pure monthly cash in hand that you are free to spend or invest immediately upon receipt.",
      "Hindi": "CTC पूरी तरह से नकद वेतन है जिसे कर्मचारी अपनी इच्छानुसार तुरंत खर्च या निवेश कर सकता है।",
      "Marathi": "CTC म्हणजे दरमहा हातात मिळणारी रोख रक्कम असून ती लगेच हवी तशी खर्च करता येते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Cost+to+Company+CTC+breakup+explained+English",
        "title": "How CTC Breakup Works in Indian Companies",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=CTC+kya+hota+hai+salary+breakup+Hindi",
        "title": "CTC क्या होता है? Salary Slip का सच",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=CTC+mhanje+kay+Marathi",
        "title": "CTC म्हणजे काय? पगार कसा ठरतो?",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "take-home-salary",
    "term": "Take-Home Salary & Perquisites",
    "category": "Income",
    "shortDef": {
      "English": "The net liquid compensation disbursed into an employee's bank account after all statutory obligations, employer retirement deductions, and tax withholdings have been satisfied.",
      "Hindi": "सभी वैधानिक कटौतियों, भविष्य निधि अंशदान और आयकर (TDS) के समायोजन के बाद कर्मचारी के बैंक खाते में जमा होने वाला वास्तविक शुद्ध नकद वेतन।",
      "Marathi": "सर्व वैधानिक कपाती, भविष्य निर्वाह निधी आणि प्राप्तिकर वजा केल्यानंतर कर्मचाऱ्याच्या बँक खात्यात प्रत्यक्ष जमा होणारा निव्वळ पगार."
    },
    "analogy": "The net harvest grains delivered into your home granary after paying field rent, seed reserves, and statutory grain levies.",
    "indianExample": "Includes non-monetary perquisites under Section 17(2) such as company car leases, subsidized accommodation, or stock options, taxed according to prescribed valuation rules.",
    "rememberThis": {
      "English": "Calculate your savings rate (e.g. 20%–30%) strictly against your actual monthly Take-Home Salary rather than your gross CTC.",
      "Hindi": "अपनी मासिक बचत और निवेश दर (20%-30%) की गणना हमेशा वास्तविक टेक-होम सैलरी के आधार पर करें।",
      "Marathi": "गुंतवणुकीचे आणि बचतीचे प्रमाण (२०%-३०%) नेहमी प्रत्यक्ष टेक-होम पगारावर ठरवावे."
    },
    "commonMistake": {
      "English": "Including non-cash company perquisites (like health insurance coverage or gym allowances) in your liquid monthly budget calculations.",
      "Hindi": "कंपनी द्वारा दी जाने वाली गैर-नकद सुविधाओं को अपने मासिक नकदी बजट में जोड़कर अधिक खर्च की योजना बनाना।",
      "Marathi": "कंपनीच्या बिगर-रोख सवलतींचा विचार करून रोख पैशांचे अवाजवी बजेट आखणे."
    },
    "mythStatement": {
      "English": "Your Take-Home Salary remains completely fixed and identical under both the Old and New Tax Regimes.",
      "Hindi": "पुरानी और नई दोनों कर व्यवस्थाओं में आपकी टेक-होम सैलरी हमेशा बिल्कुल समान रहती है।",
      "Marathi": "जुनी आणि नवीन कर प्रणालीत प्रत्यक्ष मिळणारा टेक-होम पगार नेहमी अगदी सारखाच राहतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Take+home+salary+calculator+India+English",
        "title": "Calculating True Take-Home Salary in India",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=In+hand+salary+kaise+nikale+Hindi",
        "title": "इन-हैंड सैलरी कैसे निकालें? आसान तरीका",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Take+home+salary+Marathi",
        "title": "हातात येणारा पगार (Take-Home) कसा मोजायचा?",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "hra",
    "term": "HRA (House Rent Allowance)",
    "category": "Income",
    "shortDef": {
      "English": "A designated component of salary compensation provided by employers to meet expenditure incurred on rented residential accommodation, eligible for tax exemption under Section 10(13A).",
      "Hindi": "नियोक्ता द्वारा आवासीय किराए के खर्च की भरपाई के लिए दिया जाने वाला वेतन घटक, जिस पर आयकर अधिनियम की धारा 10(13A) के तहत वैध कर छूट प्राप्त होती है।",
      "Marathi": "भाड्याच्या घरात राहणाऱ्या कर्मचाऱ्यांना घरभाड्याच्या खर्चासाठी मिळणारा पगार घटक, ज्यावर कलम 10(13A) अंतर्गत कायदेशीर करसवलत मिळते."
    },
    "analogy": "A corporate housing stipend designed to offset metropolitan living costs without artificially inflating your base taxable compensation.",
    "indianExample": "Exemption is computed as the minimum of: 1) Actual HRA received; 2) 50% of Basic (Metros: Mumbai, Delhi, Kolkata, Chennai) or 40% (Non-metros); 3) Rent paid minus 10% of Basic salary.",
    "rememberThis": {
      "English": "If annual rent paid exceeds ₹1,00,000, quoting the landlord's Permanent Account Number (PAN) on your declaration is a mandatory statutory requirement.",
      "Hindi": "यदि वार्षिक किराया ₹1 लाख से अधिक है, तो मकान मालिक का PAN देना अनिवार्य है; फर्जी किराए की रसीदें आयकर नोटिस का कारण बन सकती हैं।",
      "Marathi": "वार्षिक भाडे ₹१ लाखांपेक्षा जास्त असल्यास घरमालकाचा पॅन देणे कायद्याने बंधनकारक आहे."
    },
    "commonMistake": {
      "English": "Paying rent in untraceable cash without bank transfer proof, rent agreements, or rent receipts, making the claim indefensible during income tax scrutiny.",
      "Hindi": "बिना बैंक ट्रांसफर, रेंट एग्रीमेंट या पक्की रसीद के नकद में किराया देना, जिससे जांच के समय छूट रद्द हो सकती है।",
      "Marathi": "बँक खात्यातून भाडे न देता रोखीने देणे आणि भाडेकरार किंवा अधिकृत पावत्या नसणे, ज्यामुळे करसवलत नाकारली जाऊ शकते."
    },
    "mythStatement": {
      "English": "Employees can claim HRA tax exemption while simultaneous claiming interest deduction on a self-occupied home loan in the same city without justification.",
      "Hindi": "कर्मचारी एक ही शहर में अपने खुद के घर पर होम लोन छूट और HRA छूट दोनों बिना किसी ठोस कारण के एक साथ ले सकते हैं।",
      "Marathi": "एकाच शहरात स्वतःचे घर असताना आणि त्यात राहत असतानाही HRA वर करसवलत मिळवता येते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=House+Rent+Allowance+HRA+rules+English",
        "title": "HRA Exemption Formula and Rules",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=HRA+tax+saving+Hindi+video",
        "title": "HRA से टैक्स कैसे बचाएं? पूरे नियम",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=HRA+Marathi+mahiti",
        "title": "HRA घरभाडे भत्ता सवलत मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "pf-epf",
    "term": "PF / EPF (Employee Provident Fund)",
    "category": "Income",
    "shortDef": {
      "English": "A statutory retirement savings scheme governed by the Employees' Provident Fund Organisation (EPFO), where employee and employer each contribute 12% of basic wages monthly.",
      "Hindi": "कर्मचारी भविष्य निधि संगठन (EPFO) द्वारा संचालित एक अनिवार्य सेवानिवृत्ति बचत योजना, जिसमें कर्मचारी और नियोक्ता प्रत्येक मूल वेतन का 12% मासिक योगदान करते हैं।",
      "Marathi": "कर्मचारी भविष्य निर्वाह निधी संघटना (EPFO) द्वारे चालवली जाणारी वैधानिक निवृत्ती बचत योजना, ज्यात कर्मचारी आणि कंपनी दोघेही मूळ पगाराच्या १२% रक्कम दरमहा जमा करतात."
    },
    "analogy": "A government-guaranteed automated vault where a portion of every paycheck is matched by your employer and sealed to compound for your twilight years.",
    "indianExample": "Backed by a sovereign guarantee, EPF currently delivers an attractive ~8.25% annual interest rate, with interest credited tax-free up to ₹2.5 Lakh annual employee contribution.",
    "rememberThis": {
      "English": "Always link and transfer your EPF account using your Universal Account Number (UAN) across job changes instead of closing the account early.",
      "Hindi": "नौकरी बदलते समय अपना EPF पैसा निकालने के बजाय UAN के माध्यम से नई कंपनी में ट्रांसफर करें ताकि चक्रवृद्धि ब्याज जारी रहे।",
      "Marathi": "नोकरी बदलताना EPF ची रक्कम काढून न घेता UAN द्वारे ती नवीन कंपनीत वर्ग करावी, ज्यामुळे चक्रवाढीचा फायदा टिकून राहतो."
    },
    "commonMistake": {
      "English": "Withdrawing EPF balance before completing 5 years of continuous service, which renders the entire withdrawal taxable as salary income.",
      "Hindi": "5 साल की निरंतर सेवा पूरी होने से पहले EPF निकाल लेना, जिससे पूरी राशि पर टैक्स लग जाता है।",
      "Marathi": "५ वर्षांची सलग सेवा पूर्ण होण्यापूर्वी EPF मधून पैसे काढणे, ज्यामुळे संपूर्ण रकमेवर पूर्वलक्ष्यी प्रभावाने कर आकारला जातो."
    },
    "mythStatement": {
      "English": "The entire 12% employer contribution goes directly and solely into your EPF account balance.",
      "Hindi": "नियोक्ता का पूरा 12% अंशदान सीधे आपके EPF खाते में जमा होता है (जबकि 8.33% EPS पेंशन में जाता है)।",
      "Marathi": "कंपनीचा संपूर्ण १२% हिस्सा केवळ तुमच्या EPF खात्यात जमा होतो (८.३३% हिस्सा EPS पेन्शन योजनेत जातो)."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=EPF+PF+rules+and+interest+rate+English",
        "title": "EPF Complete Guide: Interest, UAN & Rules",
        "channel": "Labor Law Advisor"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=PF+ka+paisa+kaise+check+kare+Hindi",
        "title": "PF क्या है और UAN से कैसे ट्रांसफर करें",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=EPF+passbook+UAN+Marathi",
        "title": "EPF आणि UAN संपूर्ण मराठी मार्गदर्शक",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "nps",
    "term": "NPS (National Pension System)",
    "category": "Income",
    "shortDef": {
      "English": "A voluntary, market-linked, defined-contribution retirement platform regulated by PFRDA, offering low-cost fund management across equity, corporate bonds, and government debt.",
      "Hindi": "PFRDA द्वारा विनियमित एक स्वैच्छिक, बाजार-आधारित पेंशन योजना, जो इक्विटी, कॉर्पोरेट बॉन्ड और सरकारी प्रतिभूतियों में न्यूनतम लागत पर निवेश की सुविधा देती है।",
      "Marathi": "PFRDA द्वारे नियंत्रित एक ऐच्छिक आणि बाजारपेठेशी जोडलेली निवृत्ती योजना, जी अत्यंत कमी खर्चात समभाग, कॉर्पोरेट रोखे आणि सरकारी कर्जरोख्यांमध्ये गुंतवणूक करते."
    },
    "analogy": "A multi-lane pension expressway allowing you to dial your preferred mix of equity horsepower and government bond stability until age 60.",
    "indianExample": "Offers exclusive additional tax deduction of up to ₹50,000 under Section 80CCD(1B) under the Old Regime, plus up to 14% employer contribution deduction under 80CCD(2) in both regimes.",
    "rememberThis": {
      "English": "At retirement (age 60), 60% of the accumulated corpus can be withdrawn completely tax-free, while the remaining 40% must be used to purchase a monthly annuity.",
      "Hindi": "60 वर्ष की आयु में कुल जमा राशि का 60% पूरी तरह से टैक्स-फ्री निकाला जा सकता है, जबकि 40% से नियमित पेंशन (Annuity) खरीदी जाती है।",
      "Marathi": "वयाच्या ६० व्या वर्षी जमा झालेल्या रकमेतील ६०% रक्कम पूर्णपणे करमुक्त काढता येते, तर उरलेल्या ४०% रकमेतून दरमहा पेन्शन देणारी अ‍ॅन्युइटी खरेदी करावी लागते."
    },
    "commonMistake": {
      "English": "Opting for 100% government debt in your 20s and missing out on equity compounding during your prime working decades.",
      "Hindi": "20-25 वर्ष की उम्र में NPS में केवल सरकारी बॉन्ड चुनना और इक्विटी के लंबे समय के चक्रवृद्धि विकास से वंचित रह जाना।",
      "Marathi": "तरुण वयात NPS मध्ये केवळ सरकारी रोखे निवडणे आणि समभागांच्या दीर्घकालीन चक्रवाढ परताव्याला मुकणे."
    },
    "mythStatement": {
      "English": "NPS investments are locked until age 60 with zero provisions for partial withdrawals for emergencies or higher education.",
      "Hindi": "NPS का पैसा 60 साल तक पूरी तरह से ब्लॉक रहता है और बच्चों की पढ़ाई या मेडिकल इमरजेंसी के लिए भी नहीं निकाला जा सकता।",
      "Marathi": "NPS मधील निधी वयाच्या ६० वर्षांपर्यंत पूर्णपणे बंदिस्त असतो आणि गंभीर कारणांसाठीही त्यातून रक्कम काढता येत नाही."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=National+Pension+System+NPS+guide+English",
        "title": "National Pension System (NPS) Explained",
        "channel": "Pranjal Kamra"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=NPS+kya+hai+pension+yojana+Hindi",
        "title": "NPS में निवेश के नियम और टैक्स लाभ",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=NPS+pension+Marathi+mahiti",
        "title": "NPS राष्ट्रीय पेन्शन योजना मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "gratuity",
    "term": "Gratuity",
    "category": "Income",
    "shortDef": {
      "English": "A statutory statutory retirement benefit payable by employers under the Payment of Gratuity Act 1972 to employees rendering five or more years of continuous service.",
      "Hindi": "ग्रेच्युटी भुगतान अधिनियम 1972 के तहत 5 वर्ष या उससे अधिक की निरंतर सेवा पूरी करने वाले कर्मचारियों को नियोक्ता द्वारा दिया जाने वाला एकमुश्त वैधानिक सेवानिवृत्ति लाभ।",
      "Marathi": "ग्रॅच्युइटी कायदा १९७२ अंतर्गत सलग ५ किंवा त्यापेक्षा जास्त वर्षे सेवा पूर्ण केलेल्या कर्मचाऱ्यांना कंपनीकडून दिला जाणारा एकरकमी वैधानिक कृतज्ञता लाभ."
    },
    "analogy": "An employer loyalty bonus mandated by Parliament to honor five or more years of dedicated tenure at the organization.",
    "indianExample": "Formula: (15 × Last Drawn Basic Salary + DA × Completed Years of Service) ÷ 26. Cumulative gratuity up to ₹20 Lakh is completely exempt from income tax under Section 10(10).",
    "rememberThis": {
      "English": "Ensure you complete at least 4 years and 240 working days in a company to legally qualify for the mandatory gratuity benefit upon resignation.",
      "Hindi": "कंपनी छोड़ने से पहले सुनिश्चित करें कि आपने 5 वर्ष (या 4 साल 240 दिन) की सेवा पूरी कर ली है ताकि ग्रेच्युटी का कानूनी अधिकार सुरक्षित रहे।",
      "Marathi": "राजीनामा देण्यापूर्वी सलग ५ वर्षे (किंवा ४ वर्षे २४० दिवस) सेवा पूर्ण झाली आहे का ते तपासा, जेणेकरून ग्रॅच्युइटीचा कायदेशीर हक्क अबाधित राहील."
    },
    "commonMistake": {
      "English": "Allowing an employer to withhold gratuity due to routine resignation or general business economic slowdowns.",
      "Hindi": "यह मान लेना कि सामान्य त्यागपत्र देने पर कंपनी ग्रेच्युटी की वैधानिक राशि रोकने का अधिकार रखती है।",
      "Marathi": "राजीनामा दिल्यामुळे कंपनी ग्रॅच्युइटी रोखून धरू शकते असा चुकीचा समज करून घेणे."
    },
    "mythStatement": {
      "English": "Gratuity is paid out of regular monthly deductions from the employee's net take-home salary each month.",
      "Hindi": "ग्रेच्युटी कर्मचारी के मासिक वेतन से काटी जाने वाली राशि से दी जाती है (जबकि यह 100% नियोक्ता द्वारा वहन किया जाने वाला खर्च है)।",
      "Marathi": "ग्रॅच्युइटी ही कर्मचाऱ्याच्या दरमहा पगारातून कापून गोळा केली जाणारी रक्कम असते."
    },
    "professionTracks": [
      "Salaried Employees"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Payment+of+Gratuity+Act+rules+calculation+English",
        "title": "Gratuity Calculation Formula and Tax Rules",
        "channel": "Labor Law Advisor"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gratuity+kaise+calculate+kare+Hindi",
        "title": "ग्रेच्युटी कैसे मिलती है और कब मिलती है?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gratuity+calculation+Marathi",
        "title": "ग्रॅच्युइटी नियम आणि कॅल्क्युलेशन मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "esops",
    "term": "ESOPs (Employee Stock Ownership Plans)",
    "category": "Income",
    "shortDef": {
      "English": "Equity compensation granting employees the legal right to purchase shares of the employer company at a predetermined exercise price after completing a defined vesting schedule.",
      "Hindi": "कर्मचारियों को एक निर्धारित वेस्टिंग अवधि के बाद पूर्व-निश्चित रियायती मूल्य पर कंपनी के शेयर खरीदने का कानूनी अधिकार देने वाली इक्विटी प्रोत्साहन योजना।",
      "Marathi": "विहित सेवा कालावधी पूर्ण केल्यावर कर्मचाऱ्यांना पूर्व-निश्चित सवलतीच्या दरात कंपनीचे समभाग खरेदी करण्याचा कायदेशीर अधिकार देणारी इक्विटी योजना."
    },
    "analogy": "Holding a VIP golden key to ownership in the venture that grows exponentially in value as the enterprise succeeds.",
    "indianExample": "Subject to dual taxation in India: Perquisite tax at exercise on the spread (FMV minus Exercise Price), and Capital Gains tax upon ultimate share sale.",
    "rememberThis": {
      "English": "Always analyze the company's realistic path to liquidity (IPO or secondary buyback) and exercise tax obligations before investing personal funds into unlisted ESOPs.",
      "Hindi": "अनलिस्टेड स्टार्टअप्स में ESOPs एक्सरसाइज करने से पहले कंपनी की लिक्विडिटी योजना और उस पर लगने वाले पर्क्विजिट टैक्स का आकलन अवश्य करें।",
      "Marathi": "खाजगी स्टार्टअप्सचे ESOPs खरेदी करण्यापूर्वी कंपनीच्या IPO किंवा शेअर्स विक्रीच्या संधी आणि देय प्राप्तिकराचा नीट विचार करा."
    },
    "commonMistake": {
      "English": "Failing to account for the heavy upfront perquisite income tax liability due at the time of exercising options before any actual cash is realized.",
      "Hindi": "शेयर एक्सरसाइज करते समय लगने वाले भारी पर्क्विजिट टैक्स की अनदेखी करना, भले ही शेयर अभी बाजार में बिके न हों।",
      "Marathi": "शेअर्स प्रत्यक्ष विकण्यापूर्वी केवळ खरेदी केल्यावर द्याव्या लागणाऱ्या मोठ्या पर्क्विझिट कराची तरतूद न ठेवणे."
    },
    "mythStatement": {
      "English": "ESOP grants represent immediate free shares credited directly into your personal Demat account on day one of employment.",
      "Hindi": "ESOP का मतलब है कि नौकरी के पहले ही दिन कंपनी के शेयर आपके डीमैट खाते में मुफ्त में ट्रांसफर हो जाते हैं।",
      "Marathi": "ESOP म्हणजे नोकरीच्या पहिल्याच दिवशी कंपनीचे मोफत शेअर्स तुमच्या डिमॅट खात्यात जमा होतात."
    },
    "professionTracks": [
      "Salaried Employees",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=ESOPs+explained+vesting+exercise+taxation+English",
        "title": "ESOPs Explained: Vesting, Exercise & Tax",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ESOP+kya+hota+hai+Hindi+guide",
        "title": "ESOPs क्या हैं? स्टार्टअप शेयर्स का सच",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ESOP+Marathi+mahiti",
        "title": "ESOP शेअर्स म्हणजे काय? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "compounding",
    "term": "Compounding",
    "category": "Investing",
    "shortDef": {
      "English": "The exponential growth process where investment returns generate their own subsequent earnings over multiannual holding horizons.",
      "Hindi": "धन वृद्धि की वह घातांकीय प्रक्रिया जिसमें निवेश से मिला मुनाफा आगे चलकर और अधिक मुनाफा पैदा करता है।",
      "Marathi": "गुंतवणुकीतून मिळालेला नफा पुन्हा गुंतवून त्यावरही नफा मिळवण्याची घातांकी (Exponential) संपत्ती वाढ प्रक्रिया."
    },
    "analogy": "Planting a single mango sapling that yields fruit, whose seeds sprout into an entire thriving orchard over three decades.",
    "indianExample": "A monthly investment of ₹10,000 compounding at 12% CAGR yields ~₹23.2 Lakh in 10 years, jumping exponentially to ~₹99.9 Lakh in 20 years and ~₹3.5 Crore in 30 years.",
    "rememberThis": {
      "English": "Time in the market is vastly more powerful than timing the market; starting 5 years earlier can double your ultimate retirement corpus.",
      "Hindi": "चक्रवृद्धि में समय सबसे महत्वपूर्ण घटक है; 5 साल पहले निवेश शुरू करना आपके रिटायरमेंट फंड को दोगुना कर सकता है।",
      "Marathi": "चक्रवाढीच्या जादूमध्ये वेळेला सर्वात जास्त महत्त्व असते; ५ वर्षे आधी सुरू केल्यास निवृत्तीचा निधी दुप्पट होऊ शकतो."
    },
    "commonMistake": {
      "English": "Interrupting compound growth by redeeming equity portfolios during routine market corrections rather than staying invested.",
      "Hindi": "बाजार के सामान्य उतार-चढ़ाव में घबराकर इक्विटी निवेश को बार-बार बेचना और कंपाउंडिंग की प्रक्रिया को तोड़ना।",
      "Marathi": "बाजारातील तात्पुरत्या घसरणीला घाबरून गुंतवणूक काढून घेणे आणि चक्रवाढीची साखळी खंडित करणे."
    },
    "mythStatement": {
      "English": "Compounding delivers massive dramatic wealth gains in the very first 12 to 24 months of starting an investment.",
      "Hindi": "चक्रवृद्धि का जादुई असर निवेश शुरू करने के पहले ही 1-2 वर्षों में भारी मुनाफे के रूप में दिखने लगता है।",
      "Marathi": "गुंतवणूक सुरू केल्यावर पहिल्याच वर्षात चक्रवाढ व्याजाचा प्रचंड मोठा परतावा दिसू लागतो."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Power+of+Compounding+wealth+creation+English",
        "title": "The Eighth Wonder: Power of Compounding",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Compounding+ki+shakti+Hindi+video",
        "title": "कंपाउंडिंग की शक्ति: 10,000 से करोड़ों का सफर",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Chakravadh+gupt+shakti+Marathi",
        "title": "चक्रवाढ व्याजाची खरी ताकद मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "sip",
    "term": "SIP (Systematic Investment Plan)",
    "category": "Investing",
    "shortDef": {
      "English": "A disciplined automated investment mechanism allocating a fixed rupee installment periodically into a mutual fund scheme, harnessing Rupee Cost Averaging.",
      "Hindi": "म्यूचुअल फंड में निश्चित अंतराल पर एक तय राशि निवेश करने की अनुशासित स्वचालित प्रणाली, जो बाजार में औसत खरीद लागत का लाभ देती है।",
      "Marathi": "म्युच्युअल फंडामध्ये दरमहा ठराविक रक्कम शिस्तबद्ध पद्धतीने गुंतवण्याची स्वयंचलित पद्धत, ज्यामुळे सरासरी खरेदी किमतीचा (Rupee Cost Averaging) मोठा फायदा मिळतो."
    },
    "analogy": "An automated savings deposit paid to your future self every month before lifestyle spending commences.",
    "indianExample": "Investing ₹5,000 monthly through an automated SIP in a Nifty 50 Index Fund buys more units during market corrections and fewer during peaks.",
    "rememberThis": {
      "English": "Never pause or cancel active SIPs during bear markets; market downturns are precisely when your SIP accumulates maximum units at discounted valuations.",
      "Hindi": "शेयर बाजार गिरने पर कभी भी अपनी SIP बंद न करें; मंदी के समय ही SIP सबसे सस्ती कीमत पर अधिकतम यूनिट्स खरीदती है।",
      "Marathi": "बाजार घसरल्यावर कधीही SIP थांबवू नका; बाजार खाली असतानाच SIP द्वारे सर्वात जास्त युनिट्स स्वस्तात जमा होतात."
    },
    "commonMistake": {
      "English": "Attempting to manually time the market by stopping SIPs at market peaks and trying to restart at market bottoms.",
      "Hindi": "बाजार का अनुमान लगाने की कोशिश में SIP रोकना और फिर बाजार भाग जाने पर ऊंचे स्तर पर दोबारा निवेश करना।",
      "Marathi": "बाजार खाली पडल्यावर घाबरून SIP बंद करणे आणि तेजी आल्यावर पुन्हा महाग भावात सुरू करणे."
    },
    "mythStatement": {
      "English": "SIP is a separate, government-guaranteed asset class that guarantees fixed positive annual returns regardless of market performance.",
      "Hindi": "SIP एक अलग सरकारी गारंटी वाली संपत्ति है जो बाजार गिरने पर भी निश्चित सकारात्मक रिटर्न की गारंटी देती है।",
      "Marathi": "SIP हा एक स्वतंत्र सरकारी योजना असून बाजारातील चढ-उतारांशी त्याचा कसलाही संबंध नसतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "videoId": "t6BQ1Wle8c4",
        "searchFallback": "https://www.youtube.com/results?search_query=SIP+Systematic+Investment+Plan+guide+English",
        "title": "Lumpsum or SIP, Which is Better?",
        "channel": "CA Rachana Phadke Ranade"
      },
      "Hindi": {
        "videoId": "fLqdzG7vtps",
        "searchFallback": "https://www.youtube.com/results?search_query=SIP+kya+hai+kaise+shuru+kare+Hindi",
        "title": "SIP for Beginners: What Is SIP",
        "channel": "Bajaj Finserv Mutual Fund"
      },
      "Marathi": {
        "videoId": "nnj3GFOJeKM",
        "searchFallback": "https://www.youtube.com/results?search_query=SIP+Marathi+margdarshan",
        "title": "SIP मध्ये गुंतवणूक करण्याचे नियम मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "mutual-funds",
    "term": "Mutual Funds",
    "category": "Investing",
    "shortDef": {
      "English": "A collective investment vehicle pooling capital from retail and institutional investors to construct a professionally managed diversified portfolio of securities.",
      "Hindi": "कई निवेशकों से पूंजी एकत्र कर पेशेवर फंड मैनेजरों द्वारा शेयरों, बॉन्डों और प्रतिभूतियों के विविधीकृत पोर्टफोलियो में निवेश करने का माध्यम।",
      "Marathi": "अनेक गुंतवणूकदारांचे पैसे एकत्र करून व्यावसायिक फंड मॅनेजरद्वारे समभाग आणि रोख्यांच्या विविधीकृत पोर्टफोलिओमध्ये केलेली गुंतवणूक."
    },
    "analogy": "Hiring a seasoned ship captain with a professional crew to navigate the turbulent ocean of markets rather than rowing a fragile solo boat.",
    "indianExample": "Regulated stringently by SEBI under the Mutual Fund Regulations 1996, with assets held by independent statutory custodians.",
    "rememberThis": {
      "English": "Select Direct Plans of mutual funds instead of Regular Plans to eliminate distributor commissions and save 0.5%–1.2% in annual expense ratios.",
      "Hindi": "म्यूचुअल फंड में हमेशा 'Direct Plan' चुनें ताकि एजेंट कमीशन न लगे और आपका वार्षिक रिटर्न 1% तक बढ़ सके।",
      "Marathi": "म्युच्युअल फंडामध्ये नेहमी 'Direct Plan' ची निवड करा, ज्यामुळे कमिशन वाचून वार्षिक परतावा वाढतो."
    },
    "commonMistake": {
      "English": "Investing in dozens of overlapping mutual funds holding the exact same underlying large-cap equities.",
      "Hindi": "एक ही श्रेणी के 10-15 म्यूचुअल फंड खरीद लेना जिनमें अंदरूनी तौर पर वही समान शेयर शामिल होते हैं।",
      "Marathi": "एकाच प्रकारच्या अनेक म्युच्युअल फंडात गुंतवणूक करणे, ज्यामुळे विविधीकरण न होता केवळ गोंधळ वाढतो."
    },
    "mythStatement": {
      "English": "Investing in mutual funds is equivalent to gambling in speculative lottery tickets with zero regulatory oversight.",
      "Hindi": "म्यूचुअल फंड में निवेश करना सट्टेबाजी जैसा है और इस पर सरकार या सेबी का कोई नियंत्रण नहीं होता।",
      "Marathi": "म्युच्युअल फंडात गुंतवणूक करणे म्हणजे कसलेही नियम नसलेला जुगार खेळण्यासारखे आहे."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Mutual+Funds+complete+guide+for+beginners+English",
        "title": "Mutual Funds Complete Beginner's Guide",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Mutual+fund+kya+hai+Hindi+video",
        "title": "म्यूचुअल फंड क्या है और सही फंड कैसे चुनें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "videoId": "5Ls-mm01SdA",
        "searchFallback": "https://www.youtube.com/results?search_query=Mutual+funds+Marathi+mahiti",
        "title": "What are Mutual Funds? म्युच्युअल फंडस् म्हणजे काय?",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "equity",
    "term": "Equity (Stock Ownership)",
    "category": "Investing",
    "shortDef": {
      "English": "A fractional ownership share in the capital of a corporation, entitling the shareholder to voting rights, corporate earnings, and long-term capital appreciation.",
      "Hindi": "किसी कंपनी के पूंजीगत स्वामित्व का आनुपातिक हिस्सा, जो शेयरधारक को कंपनी के मुनाफे (डिविडेंड) और दीर्घकालिक पूंजीगत वृद्धि का अधिकार देता है।",
      "Marathi": "एखाद्या कंपनीच्या भांडवलातील प्रत्यक्ष मालकीचा हिस्सा (शेअर); जो नफ्यातील लाभांश आणि भांडवली मूल्याच्या वाढीचा हक्क प्रदान करतो."
    },
    "analogy": "Holding a registered ownership title deed to a percentage of a commercial shopping complex that earns rental distributions and appreciates in market value.",
    "indianExample": "Historical Nifty 50 and S&P BSE Sensex indices have compounded at ~12%–14% annualized over multi-decade intervals, outperforming inflation and fixed income.",
    "rememberThis": {
      "English": "Equity represents real ownership in productive business enterprises, not an arbitrary fluctuating ticker on a smartphone screen.",
      "Hindi": "इक्विटी को फोन स्क्रीन पर नाचते हुए अंकों के रूप में नहीं, बल्कि वास्तविक व्यवसायों की आंशिक साझेदारी के रूप में देखें।",
      "Marathi": "इक्विटी म्हणजे फोनवरील आकडे नसून देशातील नफा कमावणाऱ्या खऱ्याखुऱ्या व्यवसायांमधील मालकी हक्क आहे."
    },
    "commonMistake": {
      "English": "Treating equity markets like a fast-paced day-trading casino rather than taking a 5-to-10 year ownership perspective.",
      "Hindi": "शेयर बाजार को लॉटरी समझकर इंट्राडे ट्रेडिंग करना और कुछ ही हफ्तों में अपनी गाढ़ी कमाई गंवा बैठना।",
      "Marathi": "शेअर बाजारात जलद नफा मिळवण्याच्या हव्यासापोटी ट्रेडिंग करणे आणि मूळ भांडवल गमावून बसणे."
    },
    "mythStatement": {
      "English": "Equities are guaranteed to decline in purchasing power over any arbitrary 20-year horizon in modern economies.",
      "Hindi": "लंबी अवधि (15-20 साल) में भी शेयर बाजार हमेशा सोने या एफडी से कम ही रिटर्न देता है।",
      "Marathi": "दीर्घकालीन विचार केल्यास समभाग नेहमी बँक ठेवींपेक्षा कमी परतावा देतात असा समज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Startup Founders",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=What+is+Equity+stock+market+basics+English",
        "title": "Equity & Stock Market Fundamentals",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "videoId": "RieqxXMds64",
        "searchFallback": "https://www.youtube.com/results?search_query=Share+market+basics+Hindi",
        "title": "Stock Market Basics for Beginners",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Share+market+Marathi+margdarshan",
        "title": "शेअर मार्केट म्हणजे काय? सोपी मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "diversification",
    "term": "Diversification",
    "category": "Investing",
    "shortDef": {
      "English": "The risk-management technique of allocating capital across diverse asset classes, industrial sectors, and geographical markets to minimize unsystematic volatility.",
      "Hindi": "पूंजी को विभिन्न परिसंपत्तियों (शेयर, डेट, सोना, रियल एस्टेट) और उद्योगों में बांटने की रणनीति, ताकि किसी एक क्षेत्र के नुकसान से पूरा पोर्टफोलियो सुरक्षित रहे।",
      "Marathi": "आपले भांडवल केवळ एकाच ठिकाणी न ठेवता समभाग, रोखे, सोने आणि स्थावर मालमत्ता अशा विविध पर्यायांमध्ये विभागून जोखीम कमी करण्याचे तंत्र."
    },
    "analogy": "Carrying your farm harvest in multiple sturdy baskets so dropping one container does not destroy your entire year's crop.",
    "indianExample": "A classic multi-asset allocation comprising 60% Domestic Equity, 20% Debt/Fixed Income, 10% Gold, and 10% International Equity cushions severe drawdown shocks.",
    "rememberThis": {
      "English": "Diversification is the only genuine 'free lunch' in modern finance, enabling higher risk-adjusted returns with significantly lower drawdown anxiety.",
      "Hindi": "विविधीकरण (Diversification) वित्तीय जगत का एकमात्र 'मुफ्त उपहार' है जो जोखिम को घटाते हुए पोर्टफोलियो के रिटर्न को स्थिर बनाता है।",
      "Marathi": "विविधीकरण हे गुंतवणुकीतील सर्वात मोठे सुरक्षा कवच आहे, ज्यामुळे बाजारातील घसरणीतही संपत्ती सुरक्षित राहते."
    },
    "commonMistake": {
      "English": "Over-diversification across 50 different equity mutual funds holding identical underlying stocks, creating administrative confusion with zero extra benefit.",
      "Hindi": "50 अलग-अलग म्यूचुअल फंड खरीद लेना जिससे वास्तविक विविधीकरण नहीं बल्कि केवल अव्यवस्था और शुल्क बढ़ते हैं।",
      "Marathi": "अवाजवी विविधीकरण करून ५० वेगवेगळ्या फंडांमध्ये पैसे गुंतवणे, ज्यामुळे कसलाही अतिरिक्त लाभ मिळत नाही."
    },
    "mythStatement": {
      "English": "True diversification means buying 10 different banking stocks listed within the identical domestic financial sub-sector.",
      "Hindi": "केवल 10 अलग-अलग बैंकों के शेयर खरीद लेना संपूर्ण पोर्टफोलियो विविधीकरण कहलाता है।",
      "Marathi": "केवळ एकाच क्षेत्रातील (उदा. बँक) ५-६ कंपन्यांचे शेअर्स घेणे म्हणजे संपूर्ण विविधीकरण नव्हे."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Asset+allocation+and+diversification+rules+English",
        "title": "The Art of Portfolio Diversification",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Diversification+kaise+kare+Hindi",
        "title": "पोर्टफोलियो विविधीकरण कैसे करें? सही तरीका",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Vividhikaran+guntavnuk+Marathi",
        "title": "गुंतवणुकीचे योग्य विविधीकरण कसे करावे? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "risk-return",
    "term": "Risk-Return Tradeoff",
    "category": "Investing",
    "shortDef": {
      "English": "The fundamental financial principle stating that the potential reward on an investment scales in direct proportion to the level of capital risk accepted.",
      "Hindi": "वित्तीय बाजार का मूल सिद्धांत कि किसी निवेश में अधिक मुनाफे की संभावना के साथ मूलधन खोने का संभावित जोखिम भी सीधे अनुपात में बढ़ता है।",
      "Marathi": "गुंतवणुकीतील मूलभूत तत्त्व: संभाव्य परतावा जितका जास्त असेल, तितकीच भांडवली नुकसानीची जोखीमही जास्त असते."
    },
    "analogy": "Driving at 140 km/h reaches your destination faster, but demands superior braking reflexes and carries greater accident severity than cruising at 60 km/h.",
    "indianExample": "Equities offer 12%–15% long-term return potential but carry 20%–30% interim drawdown risk; Bank FDs offer 7% fixed return with zero nominal drawdown risk.",
    "rememberThis": {
      "English": "Any unregulated investment scheme offering 'guaranteed 20%–30% monthly returns' is statistically guaranteed to be an illegal Ponzi fraud.",
      "Hindi": "कोई भी योजना जो 'गारंटीड 20%-30% रिटर्न' का वादा करे, वह निश्चित रूप से एक अवैध पोंजी घोटाला है; लालच से बचें।",
      "Marathi": "दरमहा 'निश्चित २०%-३०% परतावा' देण्याचा दावा करणारी कोणतीही योजना हमखास फसवणूक (Ponzi Scam) असते; अशा भूलथापांना बळी पडू नका."
    },
    "commonMistake": {
      "English": "Assuming that low risk equates to zero risk, ignoring how inflation silently destroys the real purchasing power of 'safe' cash under the mattress.",
      "Hindi": "यह मान लेना कि सुरक्षित बचत में कोई जोखिम नहीं है, जबकि महंगाई चुपचाप पैसे की क्रय शक्ति को खा जाती है।",
      "Marathi": "पैसा केवळ बचत खात्यात ठेवून सुरक्षित राहू शकतो असा समज, महागाई हळूहळू पैशाचे मूल्य संपवते याकडे दुर्लक्ष करणे."
    },
    "mythStatement": {
      "English": "There exist special secret financial instruments that consistently yield 25% annual risk-free returns backed by sovereign guarantees.",
      "Hindi": "बाजार में ऐसे जादुई वित्तीय प्रोडक्ट मौजूद हैं जो बिना किसी जोखिम के 25% का निश्चित वार्षिक रिटर्न देते हैं।",
      "Marathi": "बाजारात कसलीही जोखीम नसताना निश्चित २५% परतावा देणारी गुप्त सरकारी योजना अस्तित्वात असते असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Risk+Return+Tradeoff+in+investing+English",
        "title": "Understanding the Risk-Return Spectrum",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Risk+aur+return+ka+khel+Hindi",
        "title": "Risk और Return का असली खेल समझें",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Jokhim+ani+partava+Marathi",
        "title": "गुंतवणुकीतील जोखीम आणि परतावा मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "index-fund",
    "term": "Index Fund (Passive Investing)",
    "category": "Investing",
    "shortDef": {
      "English": "A passive mutual fund designed to replicate the composition and match the performance of a financial benchmark index like the Nifty 50 or S&P BSE Sensex.",
      "Hindi": "एक निष्क्रिय म्यूचुअल फंड जो निफ्टी 50 या सेंसेक्स जैसे बेंचमार्क इंडेक्स के शेयरों और उनके अनुपात की हूबहू नकल करता है।",
      "Marathi": "निफ्टी ५० किंवा सेन्सेक्स यांसारख्या निर्देशांकांची हुबेहूब नक्कल करून अत्यंत कमी खर्चात परतावा देणारा पॅसिव्ह म्युच्युअल फंड."
    },
    "analogy": "Buying a basket containing all 50 premiere players on the national cricket leaderboard instead of gambling on betting who will score a century today.",
    "indianExample": "Nifty 50 Index funds feature rock-bottom expense ratios (0.05%–0.20%) and zero fund manager bias, beating over 75% of actively managed funds over 10-year periods.",
    "rememberThis": {
      "English": "For the vast majority of retail investors, an automated low-cost Nifty 50 Index Fund SIP is the single most reliable path to multi-decade wealth creation.",
      "Hindi": "अधिकांश सामान्य निवेशकों के लिए निफ्टी 50 इंडेक्स फंड में निरंतर SIP वेल्थ क्रिएशन का सबसे सुरक्षित और प्रभावी मार्ग है।",
      "Marathi": "सामान्य नोकरदार गुंतवणूकदारांसाठी निफ्टी ५० इंडेक्स फंडामधील मासिक SIP हा संपत्ती निर्मितीचा सर्वात सोपा आणि खात्रीशीर मार्ग आहे."
    },
    "commonMistake": {
      "English": "Switching out of index funds after a short-term market dip in search of fashionable 'hot' thematic sector funds that subsequently crash.",
      "Hindi": "अस्थायी मंदी में इंडेक्स फंड बंद करके किसी ट्रेंडिंग सेक्टोरल फंड में भागना और फिर उसमें भारी नुकसान उठाना।",
      "Marathi": "बाजार खाली आल्यावर इंडेक्स फंडातून पैसे काढून धोकादायक सेक्टरल फंडात टाकणे आणि नुकसान करून घेणे."
    },
    "mythStatement": {
      "English": "Index funds carry active fund manager intervention to sell declining stocks and pick upcoming multi-baggers manually.",
      "Hindi": "इंडेक्स फंड के मैनेजर हर हफ्ते अपनी मर्जी से खराब शेयर हटाते हैं और नए शेयर जोड़ते हैं।",
      "Marathi": "इंडेक्स फंड मॅनेजर स्वतःच्या मर्जीने शेअर्सची खरेदी-विक्री करतो."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Index+funds+passive+investing+guide+India+English",
        "title": "Why Index Funds Win Over the Long Term",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Index+funds+kya+hote+hai+Hindi",
        "title": "Index Fund क्या है और इसमें निवेश कैसे करें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Index+fund+Marathi+mahiti",
        "title": "इंडेक्स फंड म्हणजे काय? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "etf",
    "term": "ETF (Exchange Traded Fund)",
    "category": "Investing",
    "shortDef": {
      "English": "An investment fund holding an underlying basket of securities traded intraday on stock exchanges (NSE/BSE) at live real-time market prices.",
      "Hindi": "स्टॉक एक्सचेंजों (NSE/BSE) पर शेयरों की तरह दिन के दौरान लाइव कीमतों पर खरीदे और बेचे जाने वाले इंडेक्स फंड।",
      "Marathi": "शेअर बाजारात (NSE/BSE) नियमित समभागांप्रमाणे थेट आणि चालू भावात खरेदी-विक्री करता येणारा ओपन-एंडेड फंड."
    },
    "analogy": "Buying an entire pre-packaged fruit platter on the supermarket shelf with one swipe at live spot prices rather than waiting for evening delivery.",
    "indianExample": "Popular Indian ETFs include NIFTYBEES (Nifty 50), GOLDBEES (Sovereign Gold), and LIQUIDBEES, accessible directly via Demat accounts with sub-0.10% expense ratios.",
    "rememberThis": {
      "English": "When trading ETFs, always verify market depth and use limit orders to avoid paying unexpected tracking error spreads against fair NAV.",
      "Hindi": "ETF खरीदते समय हमेशा 'Limit Order' लगाएं ताकि मार्केट की बिड-आस्क स्प्रेड के कारण अधिक कीमत न चुकानी पड़े।",
      "Marathi": "ETF खरेदी करताना नेहमी 'Limit Order' चा वापर करा जेणेकरून अनाठायी जास्त भाव दिला जाणार नाही."
    },
    "commonMistake": {
      "English": "Confusing the ETF market trading price on the stock terminal with the actual intraday Net Asset Value (iNAV).",
      "Hindi": "ट्रेडिंग स्क्रीन पर दिख रहे भाव को ही वास्तविक NAV मान लेना और लिक्विडिटी कम होने पर प्रीमियम चुका देना।",
      "Marathi": "ETF चा प्रत्यक्ष NAV न तपासता केवळ स्क्रीनवरील भावावर खरेदी करणे आणि अवाजवी प्रीमियम भरणे."
    },
    "mythStatement": {
      "English": "ETFs require you to commit to a mandatory 3-year lock-in period before selling units on the exchange.",
      "Hindi": "ETF में खरीदे गए यूनिट्स को बेचने से पहले 3 साल तक रखना कानूनी रूप से अनिवार्य होता है।",
      "Marathi": "ETF शेअर्स विकण्यापूर्वी किमान ३ वर्षे थांबावेच लागते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=ETF+vs+Mutual+Fund+differences+English",
        "title": "Exchange Traded Funds (ETFs) vs Mutual Funds",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ETF+kya+hota+hai+Hindi+video",
        "title": "ETF क्या है? NIFTYBEES और Gold ETF का सच",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=ETF+mhanje+kay+Marathi",
        "title": "ETF म्हणजे काय? शेअर्सप्रमाणे गुंतवणूक मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "bonds",
    "term": "Bonds & Sovereign Debt",
    "category": "Investing",
    "shortDef": {
      "English": "Fixed-income debt instruments where an investor loans capital to a government entity or corporation in exchange for periodic coupon interest and principal return at maturity.",
      "Hindi": "एक निश्चित आय साधन जिसके तहत निवेशक सरकार या कंपनी को ऋण देता है और बदले में नियमित कूपन ब्याज और परिपक्वता पर मूलधन प्राप्त करता है।",
      "Marathi": "गुंतवणूकदाराने सरकारला किंवा नामांकित कंपनीला दिलेले कर्ज; ज्यावर ठराविक मुदतीत नियमित व्याज (Coupon) आणि शेवटी मुद्दल परत मिळते."
    },
    "analogy": "An official promissory IOU issued by an enterprise or the sovereign republic promising to service your capital with disciplined interest.",
    "indianExample": "Government of India Dated Securities (G-Secs) and State Development Loans (SDLs) carry zero sovereign credit risk and can be bought directly on RBI Retail Direct.",
    "rememberThis": {
      "English": "Bonds provide essential stability and steady cash flow to counterbalance equity market volatility in retirement portfolios.",
      "Hindi": "बॉन्ड आपके पोर्टफोलियो को स्थिरता प्रदान करते हैं और रिटायरमेंट के बाद सुरक्षित नियमित आय का साधन बनते हैं।",
      "Marathi": "रोखे (Bonds) तुमच्या पोर्टफोलिओला स्थिरता देतात आणि निवृत्तीनंतर नियमित उत्पन्न मिळवून देण्यास मदत करतात."
    },
    "commonMistake": {
      "English": "Investing in unrated or junk-rated corporate bonds offering 14% yield without assessing the severe risk of corporate default.",
      "Hindi": "अत्यधिक ब्याज के लालच में कमजोर रेटिंग वाले असुरक्षित कॉरपोरेट बॉन्ड्स में पैसा लगाना और मूलधन गंवा देना।",
      "Marathi": "जास्त व्याजाच्या मोहापायी निकृष्ट रेटिंग असणाऱ्या खाजगी बॉण्ड्समध्ये पैसे गुंतवणे आणि मुद्दल बुडवून घेणे."
    },
    "mythStatement": {
      "English": "Corporate company bonds carry the identical 100% sovereign default guarantee as Government of India treasury bills.",
      "Hindi": "निजी कंपनियों के बॉन्ड्स पर भी भारत सरकार की 100% संप्रभु गारंटी लागू होती है।",
      "Marathi": "खाजगी कंपन्यांच्या रोख्यांनाही भारत सरकारची संपूर्ण हमी असते असा समज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bonds+and+G+Secs+RBI+Retail+direct+English",
        "title": "How to Invest in Government Bonds & G-Secs",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bonds+kya+hote+hai+Hindi+guide",
        "title": "Bonds क्या हैं और RBI Retail Direct से कैसे खरीदें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Sarkari+bonds+guntavnuk+Marathi",
        "title": "सरकारी रोखे (Bonds) मध्ये गुंतवणूक कशी करावी? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "fixed-deposit",
    "term": "Fixed Deposit (FD)",
    "category": "Investing",
    "shortDef": {
      "English": "A term deposit held with a banking institution for a predetermined duration at a guaranteed nominal rate of interest, protected up to ₹5 Lakh under DICGC insurance.",
      "Hindi": "एक निश्चित अवधि के लिए बैंक में जमा की गई राशि, जिस पर निश्चित ब्याज मिलता है और जो DICGC द्वारा ₹5 लाख तक कानूनी रूप से बीमित होती है।",
      "Marathi": "बँकेत ठराविक मुदतीसाठी ठेवलेली रक्कम; ज्यावर निश्चित व्याज मिळते आणि DICGC कायद्यानुसार ₹५ लाखांपर्यंत पूर्ण सरकारी विमा संरक्षण असते."
    },
    "analogy": "A locked personal safe deposit inside a scheduled commercial bank guaranteeing your principal returns intact on the specified date.",
    "indianExample": "Deposit Insurance and Credit Guarantee Corporation (DICGC) insures bank deposits up to ₹5,00,000 per depositor per bank across principal and interest.",
    "rememberThis": {
      "English": "Fixed deposits are superior instruments for short-term liquidity goals (under 3 years) and emergency buffers, but suboptimal for multi-decade retirement compounding.",
      "Hindi": "FD का उपयोग 1 से 3 साल के छोटे लक्ष्यों और आपातकालीन निधि के लिए करें, 20 साल के रिटायरमेंट फंड के लिए नहीं।",
      "Marathi": "FD चा वापर केवळ पुढील १ ते ३ वर्षांच्या लहान उद्दिष्टांसाठी आणि आणीबाणीच्या निधीसाठी करावा, २० वर्षांच्या निवृत्ती निधीसाठी नव्हे."
    },
    "commonMistake": {
      "English": "Accumulating all multi-decade savings in FDs while in the 30% tax slab, where a 7% nominal return yields just ~4.9% post-tax, trailing Indian inflation.",
      "Hindi": "30% टैक्स स्लैब में रहकर 20 साल के लिए सारा पैसा FD में रखना, जहां टैक्स के बाद रिटर्न महंगाई से भी कम रह जाता है।",
      "Marathi": "सर्व पैसे अनेक वर्षांसाठी केवळ FD मध्ये ठेवणे, जिथे कर वजा जाता मिळणारा परतावा महागाईपेक्षाही कमी पडतो."
    },
    "mythStatement": {
      "English": "If a commercial bank fails, all deposits exceeding ₹5 Lakh are automatically settled by the RBI within 48 hours without limit.",
      "Hindi": "बैंक दिवालिया होने पर ₹5 लाख से अधिक की पूरी जमा राशि भी RBI द्वारा 48 घंटे में तुरंत चुका दी जाती है।",
      "Marathi": "बँक बुडाली तरी ₹५ लाखांच्या वरील संपूर्ण रक्कम RBI कडून लगेच दिली जाते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bank+FD+vs+Debt+Mutual+Funds+taxation+English",
        "title": "Bank Fixed Deposits vs Inflation Reality",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bank+FD+me+kitna+risk+hai+Hindi",
        "title": "Bank FD का सच: ₹5 लाख बीमा और टैक्स",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bank+FD+fayde+tote+Marathi",
        "title": "बँक FD आणि DICGC ५ लाख विमा संरक्षण मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "ppf",
    "term": "PPF (Public Provident Fund)",
    "category": "Investing",
    "shortDef": {
      "English": "A 15-year statutory central government savings scheme offering complete Exempt-Exempt-Exempt (EEE) tax-free status on contributions, interest, and maturity proceeds.",
      "Hindi": "15-वर्षीय केंद्रीय सरकारी बचत योजना, जो निवेश, ब्याज और परिपक्वता तीनों चरणों पर पूर्ण कर-मुक्त (EEE) लाभ प्रदान करती है।",
      "Marathi": "केंद्र सरकारची १५ वर्षांची सुरक्षित बचत योजना; ज्यावर गुंतवणूक, मिळालेले व्याज आणि अंतिम मुदतपूर्ती रक्कम हे तिन्ही टप्पे पूर्णपणे करमुक्त (EEE) असतात."
    },
    "analogy": "A sovereign titanium vault that shields your family capital from income tax levies, economic volatility, and even legal attachment.",
    "indianExample": "Currently offers ~7.1% government-set interest compounding annually. Balances in a PPF account cannot be attached by any court decree under the PPF Act.",
    "rememberThis": {
      "English": "Deposit your annual PPF contribution between the 1st and 5th of April each year to maximize full 12 months of compounded interest for that financial year.",
      "Hindi": "अधिकतम ब्याज कमाने के लिए हर वित्तीय वर्ष में अपना PPF अंशदान हमेशा 1 से 5 अप्रैल के बीच जमा करें।",
      "Marathi": "वर्षाचे जास्तीत जास्त व्याज मिळवण्यासाठी दरवर्षी १ ते ५ एप्रिलच्या दरम्यानच PPF चे पैसे खात्यात भरावेत."
    },
    "commonMistake": {
      "English": "Depositing funds into PPF after the 5th of the month and losing that entire month's interest calculation.",
      "Hindi": "महीने की 5 तारीख के बाद पैसा जमा करना, जिससे उस पूरे महीने का ब्याज शून्य हो जाता है।",
      "Marathi": "महिन्याच्या ५ तारखेनंतर पैसे जमा करणे, ज्यामुळे त्या संपूर्ण महिन्याचे व्याज मिळत नाही."
    },
    "mythStatement": {
      "English": "You are legally permitted to open multiple personal PPF accounts in different bank branches across India.",
      "Hindi": "एक व्यक्ति भारत भर में विभिन्न बैंकों में अपने नाम से कई अलग-अलग PPF खाते खोल सकता है।",
      "Marathi": "एका व्यक्तीला स्वतःच्या नावे वेगवेगळ्या बँकांमध्ये अनेक PPF खाती उघडण्याची परवानगी असते."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Public+Provident+Fund+PPF+rules+and+interest+English",
        "title": "Public Provident Fund (PPF) Mastery Guide",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=PPF+account+ke+fayde+Hindi",
        "title": "PPF Account के नियम और 5 अप्रैल की ट्रिक",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=PPF+yojana+Marathi+mahiti",
        "title": "PPF सार्वजनिक भविष्य निर्वाह निधी मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "dividend",
    "term": "Dividend (Corporate Profit Sharing)",
    "category": "Investing",
    "shortDef": {
      "English": "The distribution of a portion of an enterprise's net profits directly to shareholders, approved by the company's board of directors.",
      "Hindi": "कंपनी द्वारा अपने शुद्ध मुनाफे का एक हिस्सा शेयरधारकों को नकद रूप में वितरित करना, जो कंपनी के निदेशक मंडल द्वारा अनुमोदित होता है।",
      "Marathi": "कंपनीने कमावलेल्या निव्वळ नफ्यातील काही हिस्सा भागधारकांना थेट रोख स्वरूपात वाटणे (लाभांश)."
    },
    "analogy": "A commercial fruit harvest payout delivered to every co-owner of the farm at the close of every fiscal quarter.",
    "indianExample": "Under current Indian tax provisions, dividends are added directly to your taxable income and taxed at your regular personal slab rate, with 10% TDS under Section 194 if exceeding ₹5,000.",
    "rememberThis": {
      "English": "Reinvest dividend distributions back into the market during your wealth accumulation years to keep the compounding engine firing at peak capacity.",
      "Hindi": "युवावस्था में मिलने वाले सभी डिविडेंड को दोबारा निवेश करें ताकि कंपाउंडिंग की रफ्तार धीमी न पड़े।",
      "Marathi": "तरुण वयात मिळणारा लाभांश खर्च न करता पुन्हा बाजारात गुंतवावा, ज्यामुळे चक्रवाढ वृद्धी सुरू राहते."
    },
    "commonMistake": {
      "English": "Selecting stocks solely based on a high headline dividend yield while ignoring collapsing company fundamentals or depleting capital value.",
      "Hindi": "केवल ऊंचे डिविडेंड यील्ड के चक्कर में डूबती हुई कंपनियों के शेयर खरीदना और पूंजी का भारी नुकसान कराना।",
      "Marathi": "केवळ जास्त लाभांश मिळतो म्हणून तोट्यात जाणाऱ्या कंपन्यांचे शेअर्स खरेदी करणे."
    },
    "mythStatement": {
      "English": "Dividends received from listed Indian corporations are completely 100% tax-free in the hands of all retail investors.",
      "Hindi": "भारतीय कंपनियों से मिलने वाला डिविडेंड सभी निवेशकों के लिए पूरी तरह से कर-मुक्त होता है (2020 के बाद यह स्लैब रेट पर टैक्स होता है)।",
      "Marathi": "भारतीय कंपन्यांकडून मिळणारा लाभांश पूर्णपणे करमुक्त असतो असा जुना गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Dividend+investing+and+taxation+India+English",
        "title": "Dividend Investing Strategy & Taxation",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Dividend+kya+hota+hai+Hindi+guide",
        "title": "डिविडेंड क्या है और इस पर टैक्स कैसे लगता है?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Labhansh+dividend+Marathi",
        "title": "लाभांश (Dividend) म्हणजे काय? मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "market-cap",
    "term": "Market Capitalization",
    "category": "Investing",
    "shortDef": {
      "English": "The aggregate valuation of a publicly traded company, calculated by multiplying its total outstanding shares by the prevailing market price per share.",
      "Hindi": "शेयर बाजार में सूचीबद्ध कंपनी का कुल बाजार मूल्य, जो उसके कुल बकाया शेयरों को प्रति शेयर मौजूदा बाजार मूल्य से गुणा करके निकाला जाता है।",
      "Marathi": "शेअर बाजारात नोंदणीकृत कंपनीचे एकूण बाजार भांडवल; हे एकूण शेअर्सच्या संख्येला चालू बाजारभावाने गुणून काढले जाते."
    },
    "analogy": "The total purchase price required to buy 100% of all apartments in a massive residential skyscraper complex at current market rates.",
    "indianExample": "SEBI categorizes Indian stocks into: Large Cap (Top 100 companies by market cap), Mid Cap (101st to 250th), and Small Cap (251st onwards).",
    "rememberThis": {
      "English": "Large caps provide portfolio resilience during bear markets, whereas mid and small caps offer higher growth potential with sharp interim volatility.",
      "Hindi": "स्थिरता के लिए लार्ज कैप और तेज विकास के लिए मिड व स्मॉल कैप का संतुलित मिश्रण पोर्टफोलियो में रखें।",
      "Marathi": "पोर्टफोलिओच्या सुरक्षिततेसाठी लार्ज कॅप आणि जलद वाढीसाठी मिड व स्मॉल कॅप शेअर्सचा योग्य समतोल ठेवावा."
    },
    "commonMistake": {
      "English": "Assuming that a stock priced at ₹10 is 'cheap' compared to a stock priced at ₹3,000 without looking at the total market capitalization and shares outstanding.",
      "Hindi": "₹10 के शेयर को 'सस्ता' और ₹3000 के शेयर को 'महंगा' मान लेना, बिना कंपनी का कुल मार्केट कैप देखे।",
      "Marathi": "शेअरचा भाव ₹१० आहे म्हणून तो स्वस्त आणि ₹३००० आहे म्हणून महाग असा भाबडा हिशोब करणे."
    },
    "mythStatement": {
      "English": "Small-cap companies carry identical business stability and downside protection as established blue-chip large-cap corporations.",
      "Hindi": "स्मॉल-कैप कंपनियों में भी लार्ज-कैप कंपनियों जैसी ही आर्थिक स्थिरता और सुरक्षा होती है।",
      "Marathi": "लहान कंपन्यांमध्ये (Small Cap) मोठ्या कंपन्यांइतकीच आर्थिक स्थिरता असते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Large+Cap+Mid+Cap+Small+Cap+explained+English",
        "title": "Market Capitalization: Large vs Mid vs Small Cap",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Market+cap+kya+hota+hai+Hindi",
        "title": "Market Cap क्या है? सही शेयर कैसे चुनें?",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bajar+bhandval+market+cap+Marathi",
        "title": "मार्केट कॅपिटलायझेशन म्हणजे काय? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "ipo",
    "term": "IPO (Initial Public Offering)",
    "category": "Investing",
    "shortDef": {
      "English": "The formal statutory process by which a privately held enterprise issues new or existing equity shares to the public for the first time on stock exchanges.",
      "Hindi": "वह प्रक्रिया जिसके तहत कोई निजी कंपनी पहली बार आम जनता को शेयर जारी कर स्टॉक एक्सचेंजों पर सूचीबद्ध होती है।",
      "Marathi": "एखादी खाजगी कंपनी पहिल्यांदाच सर्वसामान्य जनतेला आपले शेअर्स विक्रीसाठी उपलब्ध करून शेअर बाजारात नोंदणीकृत होण्याची अधिकृत प्रक्रिया."
    },
    "analogy": "A private boutique bakery opening its doors to public franchise co-owners nationwide for the first time.",
    "indianExample": "Governed by SEBI Issue of Capital and Disclosure Requirements (ICDR) Regulations, with retail investors applying via UPI ASBA mandates through their bank or broker.",
    "rememberThis": {
      "English": "Do not apply for IPOs solely based on unverified grey market premium (GMP) hype; scrutinize the company's valuation, debt levels, and promoter governance in the Red Herring Prospectus (RHP).",
      "Hindi": "केवल ग्रे मार्केट प्रीमियम (GMP) के झांसे में आकर IPO में पैसा न लगाएं; कंपनी का वास्तविक वित्तीय विवरण और मूल्यांकन जांचें।",
      "Marathi": "केवळ ग्रे मार्केटच्या (GMP) अफवांवर विश्वास ठेवून IPO मध्ये पैसे गुंतवू नका; कंपनीचा ताळेबंद आणि नफा नीट तपासा."
    },
    "commonMistake": {
      "English": "Flipping for one-day listing gains and borrowing money at high interest to apply for oversubscribed retail tranches.",
      "Hindi": "लिस्टिंग गेन के लालच में भारी ब्याज पर कर्ज लेकर IPO में बोली लगाना और घाटा उठाना।",
      "Marathi": "लिस्टिंगच्या दिवशी नफा कमावण्याच्या हव्यासापोटी व्याजाने उसने पैसे काढून IPO मध्ये अर्ज करणे."
    },
    "mythStatement": {
      "English": "Every IPO that lists on the NSE or BSE is guaranteed to open at a positive premium above its issue price.",
      "Hindi": "शेयर बाजार में आने वाला हर IPO अनिवार्य रूप से अपने निर्गम मूल्य से ऊपर प्रीमियम पर ही लिस्ट होता है।",
      "Marathi": "शेअर बाजारात येणारा प्रत्येक IPO हा निश्चितपणे नफ्यातच लिस्ट होतो असा समज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+IPOs+work+how+to+apply+ASBA+English",
        "title": "How IPOs Work: Red Herring Prospectus to Listing",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=IPO+kya+hota+hai+Hindi+video",
        "title": "IPO क्या होता है और इसमें अप्लाई कैसे करें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=IPO+mhanje+kay+Marathi+mahiti",
        "title": "IPO म्हणजे काय? अर्ज कसा करावा? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "bull-market",
    "term": "Bull Market",
    "category": "Investing",
    "shortDef": {
      "English": "A sustained financial market cycle characterized by rising asset prices, buoyant corporate earnings, investor optimism, and sustained economic expansion.",
      "Hindi": "वित्तीय बाजार का वह दौर जिसमें शेयरों की कीमतें लगातार बढ़ती हैं, निवेशकों में आशावाद होता है और अर्थव्यवस्था में तेज विस्तार दिखाई देता है।",
      "Marathi": "शेअर बाजारातील अशी तेजीची स्थिती ज्यामध्ये शेअर्सचे भाव सातत्याने वाढत असतात, गुंतवणूकदारांमध्ये प्रचंड उत्साह असतो आणि आर्थिक वाढ वेगाने होते."
    },
    "analogy": "An ascending high tide that lifts nearly all vessels in the harbor while investor optimism runs high.",
    "indianExample": "The multi-year bull market in India following major structural economic reforms has witnessed the Nifty 50 compound aggressively over cyclical decades.",
    "rememberThis": {
      "English": "Maintain emotional discipline during roaring bull markets; rebalance asset allocation periodically rather than abandoning risk management.",
      "Hindi": "तेजी के बाजार में जरूरत से ज्यादा उत्साहित होकर अपनी पूरी पूंजी एक ही जगह न झोंकें; रीबैलेंसिंग का पालन करें।",
      "Marathi": "बाजारात प्रचंड तेजी असताना हुरळून न जाता नियमितपणे नफा काढून योग्य विविधीकरण राखणे आवश्यक असते."
    },
    "commonMistake": {
      "English": "Assuming every speculative micro-cap stock you bought during a bull run was due to your personal genius rather than the systemic rising tide.",
      "Hindi": "तेजी के दौर में खराब कंपनियों के शेयरों से मिले मुनाफे को अपनी व्यक्तिगत बुद्धिमत्ता मान लेना और जोखिम भरा जुआ खेलना।",
      "Marathi": "तेजीच्या लाटेत निकृष्ट शेअर्स वाढले तरी स्वतःला बाजाराचा तज्ज्ञ समजून अतिजोखीम पत्करणे."
    },
    "mythStatement": {
      "English": "A bull market can continue ascending endlessly without any cyclical corrections or macro consolidations.",
      "Hindi": "बुल मार्केट कभी समाप्त नहीं होता और इसमें कभी भी 10%-20% की सामान्य गिरावट नहीं आ सकती।",
      "Marathi": "तेजीचा बाजार कधीच संपत नाही आणि त्यात कधीही मोठी घसरण होत नाही असा भ्रम."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bull+vs+Bear+market+cycles+explained+English",
        "title": "Surviving and Profiting in Bull Markets",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bull+market+kya+hota+hai+Hindi",
        "title": "बुल मार्केट में क्या गलतियां न करें?",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Teji+mandee+bajar+Marathi",
        "title": "शेअर बाजारातील तेजी आणि मंदी मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "bear-market",
    "term": "Bear Market",
    "category": "Investing",
    "shortDef": {
      "English": "A protracted market decline where major stock indices drop by 20% or more from recent cyclical peaks, accompanied by widespread fear and pessimism.",
      "Hindi": "शेयर बाजार का वह मंदी का दौर जब प्रमुख सूचकांक अपने उच्चतम स्तर से 20% या उससे अधिक गिर जाते हैं और बाजार में निराशा का माहौल होता है।",
      "Marathi": "शेअर बाजारातील अशी मोठी मंदीची स्थिती ज्यामध्ये प्रमुख निर्देशांक आपल्या उच्चांकावरून २०% किंवा त्यापेक्षा जास्त घसरतात आणि भीतीचे वातावरण असते."
    },
    "analogy": "A harsh winter season that clears dead underbrush, testing the resilience of your long-term financial shelter.",
    "indianExample": "Notable Indian bear markets occurred during the 2008 Global Financial Crisis (-50%+) and the March 2020 pandemic crash (-38%), followed by violent recoveries.",
    "rememberThis": {
      "English": "Bear markets are wealth creation sales; disciplined investors who aggressively continue SIPs through bear cycles build generational wealth.",
      "Hindi": "मंदी का दौर वेल्थ क्रिएशन की सबसे बड़ी सेल (डिस्काउंट) होती है; इस समय SIP चालू रखने वाले ही भविष्य में अमीर बनते हैं।",
      "Marathi": "मंदीचा काळ म्हणजे सर्वोत्तम कंपन्यांचे शेअर्स स्वस्तात मिळण्याची सुवर्णसंधी; या काळात SIP सुरू ठेवणारेच मोठी संपत्ती कमावतात."
    },
    "commonMistake": {
      "English": "Panic-selling quality equity portfolios at the absolute bottom of a bear market crash, locking in permanent capital losses.",
      "Hindi": "मंदी के चरम पर डरकर अपने बेहतरीन म्यूचुअल फंड और शेयर औने-पौने दाम पर बेच देना और वास्तविक नुकसान उठाना।",
      "Marathi": "घबराून बाजाराच्या तळाला उत्तम शेअर्स विकून कायमस्वरूपी आर्थिक नुकसान करून घेणे."
    },
    "mythStatement": {
      "English": "A bear market crash means the entire national enterprise economy will permanently collapse to zero value.",
      "Hindi": "शेयर बाजार गिरने का मतलब है कि देश की पूरी अर्थव्यवस्था स्थायी रूप से बर्बाद हो चुकी है और अब कभी नहीं सुधरेगी।",
      "Marathi": "बाजार कोसळल्याने देशाची अर्थव्यवस्था पूर्णपणे नष्ट होणार आहे असा टोकाचा भीतीपोटी विचार करणे."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+to+invest+during+a+bear+market+crash+English",
        "title": "Bear Market Survival Guide for Investors",
        "channel": "Pranjal Kamra"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Bear+market+me+kya+kare+Hindi",
        "title": "Bear Market में SIP चालू रखें या बंद करें?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Mandi+madhe+guntavnuk+Marathi",
        "title": "मंदीच्या काळात गुंतवणूक कशी हाताळावी? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "real-return",
    "term": "Real Return (Inflation-Adjusted Yield)",
    "category": "Investing",
    "shortDef": {
      "English": "The true economic gain realized on an investment after subtracting the eroding effects of inflation and income taxation from the nominal yield.",
      "Hindi": "मुद्रास्फीति (महंगाई) और आयकर की कटौती के बाद किसी निवेश पर प्राप्त होने वाला वास्तविक शुद्ध लाभ।",
      "Marathi": "नाममात्र परताव्यामधून महागाईचा दर आणि देय कर वजा केल्यानंतर हातात उरणारा खराखुरा निव्वळ नफा."
    },
    "analogy": "The actual speed a boat moves upstream against a strong counter-current of inflation.",
    "indianExample": "If a bank FD yields 7% nominal, taxation takes away 2.1% (30% slab), leaving 4.9%. If lifestyle inflation is 6%, your Real Return is negative (-1.1%).",
    "rememberThis": {
      "English": "Always demand a positive post-tax real return from your long-term multi-decade retirement capital.",
      "Hindi": "अपने रिटायरमेंट पोर्टफोलियो का आकलन हमेशा महंगाई और टैक्स घटाने के बाद बचे 'Real Return' से ही करें।",
      "Marathi": "दीर्घकालीन बचतीचा विचार करताना नेहमी कर आणि महागाई वजा जाता मिळणाऱ्या खऱ्या परताव्याची (Real Return) खात्री करा."
    },
    "commonMistake": {
      "English": "Celebrating a 7% nominal return on an investment while ignoring that the cost of living escalated by 8% over the exact same period.",
      "Hindi": "7% के नाममात्र रिटर्न पर खुश होना, जबकि उसी दौरान आवश्यक जीवनयापन खर्च 8% बढ़ चुका है।",
      "Marathi": "केवळ ७% चे व्याज मिळाले म्हणून आनंद मानणे, प्रत्यक्षात महागाई ८% ने वाढल्यामुळे भांडवलाचे मूल्य कमी झालेले असते."
    },
    "mythStatement": {
      "English": "Nominal headline return and real inflation-adjusted return always yield the exact identical purchasing power value.",
      "Hindi": "हेडलाइन नाममात्र रिटर्न और महंगाई घटाकर बचा वास्तविक रिटर्न हमेशा एक समान क्रय शक्ति प्रदान करते हैं।",
      "Marathi": "नाममात्र परतावा आणि महागाई वजा जाता उरणारा परतावा हे दोन्ही पैशांची समान खरेदी क्षमता दर्शवतात."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Students & Freshers"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Real+rate+of+return+inflation+adjusted+English",
        "title": "Nominal vs Real Rate of Return Explained",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Real+return+kya+hota+hai+Hindi",
        "title": "Real Return क्या है? महंगाई से पैसा कैसे बचाएं",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Khara+partava+real+return+Marathi",
        "title": "खरा परतावा (Real Return) कसा मोजावा? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "liquidity",
    "term": "Liquidity (Capital Accessibility)",
    "category": "Investing",
    "shortDef": {
      "English": "The speed, ease, and efficiency with which an asset can be converted into ready cash without causing a material concession in its market price.",
      "Hindi": "किसी संपत्ति को उसके उचित बाजार मूल्य में बिना किसी बड़े नुकसान के कितनी जल्दी नकदी (Cash) में बदला जा सकता है, उसका पैमाना।",
      "Marathi": "कोणतीही मालमत्ता तिचे बाजारमूल्य न गमावता किती तत्परतेने आणि सहजतेने रोख पैशात रूपांतरित करता येते याचे प्रमाण."
    },
    "analogy": "The ease of turning an ice cube in your freezer into drinkable water when you are thirsty.",
    "indianExample": "Savings bank deposits and overnight liquid mutual funds offer T+0/T+1 instant liquidity; physical real estate can take 6 to 18 months to liquidate.",
    "rememberThis": {
      "English": "Maintain at least 6 months of living expenses in ultra-liquid accounts before committing surplus funds to illiquid property or startup investments.",
      "Hindi": "दीर्घकालिक अचल संपत्ति में पैसा लगाने से पहले कम से कम 6 महीने के खर्च के बराबर तरल (Liquid) आपातकालीन निधि रखें।",
      "Marathi": "दीर्घकालीन मालमत्तांमध्ये पैसे गुंतवण्यापूर्वी किमान ६ महिन्यांचा घरखर्च सहज उपलब्ध होणाऱ्या लिक्विड खात्यात ठेवावा."
    },
    "commonMistake": {
      "English": "Locking up emergency reserve capital in illiquid agricultural land or long-lock-in endowment insurance policies.",
      "Hindi": "आपातकालीन पैसे को ऐसी जगह फंसा देना जहां से जरूरत पड़ने पर महीनों तक पैसा न निकाला जा सके।",
      "Marathi": "आणीबाणीच्या पैशांची अशी ठिकाणी गुंतवणूक करणे जिथून गरजेच्या वेळी तातडीने पैसे काढणे अशक्य असते."
    },
    "mythStatement": {
      "English": "Physical land and real estate apartments in India can always be sold at full market value within 24 hours of an emergency.",
      "Hindi": "जरूरत पड़ने पर जमीन या मकान को 24 घंटे के भीतर पूरे बाजार भाव पर तुरंत नकदी में बदला जा सकता है।",
      "Marathi": "कोणतीही स्थावर मालमत्ता किंवा जमीन आणीबाणीच्या वेळी २४ तासांत पूर्ण भावात विकून लगेच रोख रक्कम मिळू शकते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Liquidity+in+investments+liquid+funds+English",
        "title": "Liquidity in Personal Finance: What Assets to Keep Liquid",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Liquidity+kya+hoti+hai+Hindi",
        "title": "Liquidity क्या है? इमरजेंसी में इसकी जरूरत क्यों?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Taralta+liquidity+Marathi",
        "title": "तरलता (Liquidity) म्हणजे काय? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "xirr",
    "term": "XIRR (Extended Internal Rate of Return)",
    "category": "Investing",
    "shortDef": {
      "English": "The accurate annualized return metric for investments characterized by irregular, recurring cash inflows and outflows on different historical dates.",
      "Hindi": "विभिन्न तारीखों पर किए गए कई निवेशों (जैसे मासिक SIP या आंशिक निकासी) का वास्तविक वार्षिक रिटर्न निकालने का सबसे सटीक गणितीय पैमाना।",
      "Marathi": "वेगवेगळ्या तारखांना केलेल्या गुंतवणुकीचा (उदा. मासिक SIP किंवा टप्प्याटप्प्याने पैसे काढणे) अचूक वार्षिक परतावा मोजणारे अधिकृत सूत्र."
    },
    "analogy": "Evaluating the average speed of 60 individual train journeys started on 60 different monthly dates rather than measuring a single non-stop trip.",
    "indianExample": "Used universally across Zerodha Coin, Groww, INDmoney, and CAMS/KFintech statements to show the true performance of recurring SIP portfolios.",
    "rememberThis": {
      "English": "Always evaluate recurring SIP portfolios using XIRR rather than simple point-to-point absolute return percentages.",
      "Hindi": "मासिक SIP का प्रदर्शन देखते समय हमेशा XIRR देखें, न कि केवल सामान्य कुल प्रतिशत मुनाफा।",
      "Marathi": "मासिक SIP चा खरा परतावा तपासण्यासाठी नेहमी XIRR पहावे, साधा टक्केवारी नफा नव्हे."
    },
    "commonMistake": {
      "English": "Using simple point-to-point CAGR to judge a 5-year monthly SIP where each installment was invested for a completely different length of time.",
      "Hindi": "मासिक SIP के लिए साधारण CAGR का उपयोग करना, जबकि हर किस्त अलग-अलग समय तक बाजार में रही है।",
      "Marathi": "SIP चा परतावा मोजण्यासाठी साध्या CAGR चा चुकीचा वापर करणे."
    },
    "mythStatement": {
      "English": "Simple CAGR and XIRR always calculate the exact identical percentage return on any recurring monthly SIP portfolio.",
      "Hindi": "मासिक SIP पोर्टफोलियो पर साधारण CAGR और XIRR हमेशा एक ही समान प्रतिशत संख्या दिखाते हैं।",
      "Marathi": "मासिक SIP पोर्टफोलिओसाठी साधा CAGR आणि XIRR हे दोन्ही नेहमी एकच आकडा दाखवतात."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=CAGR+vs+XIRR+explained+mutual+funds+English",
        "title": "CAGR vs XIRR: How SIP Returns Are Truly Calculated",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=XIRR+kya+hota+hai+Hindi+video",
        "title": "XIRR क्या होता है? SIP का सही रिटर्न कैसे निकालें",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=XIRR+calculation+Marathi",
        "title": "XIRR म्हणजे काय? SIP परतावा मोजण्याची पद्धत मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "how-gst-impacts-business",
    "term": "How GST Impacts Business",
    "category": "Business",
    "shortDef": {
      "English": "The operational, compliance, and supply chain transformation driven by Input Tax Credit (ITC) and electronic invoicing under the unified GST regime.",
      "Hindi": "एकीकृत GST व्यवस्था के तहत इनपुट टैक्स क्रेडिट (ITC) और ई-इनवॉइसिंग द्वारा व्यवसाय की कार्यप्रणाली, टैक्स लागत और आपूर्ति श्रृंखला पर पड़ने वाला समग्र प्रभाव।",
      "Marathi": "GST कर प्रणालीमुळे इनपुट टॅक्स क्रेडिट (ITC) आणि ई-इनव्हॉइसिंगच्या माध्यमातून व्यवसायाचा नफा, कार्यपद्धती आणि पुरवठा साखळीवर होणारा सकारात्मक परिणाम."
    },
    "analogy": "A seamless interstate transport green corridor that unlocks input tax refunds at every checkpoint, ending double taxation on raw materials.",
    "indianExample": "Input Tax Credit (ITC) prevents tax-on-tax cascading by allowing businesses to offset GST paid on raw materials and vendor services against GST collected on sales.",
    "rememberThis": {
      "English": "Regularly reconcile your Input Tax Credit against GSTR-2B before making vendor payments to avoid blocked working capital and penal interest.",
      "Hindi": "सप्लायर को भुगतान करने से पहले हमेशा GSTR-2B में ITC का मिलान करें ताकि अमान्य इनपुट क्रेडिट के कारण कार्यशील पूंजी न फंसे।",
      "Marathi": "व्हेंडर्सना पैसे देण्यापूर्वी नेहमी GSTR-2B तपासून ITC ची खात्री करा, जेणेकरून भांडवल अडकणार नाही आणि दंड होणार नाही."
    },
    "commonMistake": {
      "English": "Purchasing goods from non-compliant vendors who fail to upload sales invoices into GSTR-1, causing complete forfeiture of your legitimate Input Tax Credit.",
      "Hindi": "ऐसे अनौपचारिक डीलरों से माल खरीदना जो समय पर रिटर्न नहीं भरते, जिससे आपका वैध इनपुट टैक्स क्रेडिट रद्द हो जाता है।",
      "Marathi": "जीएसटी विवरणपत्र न भरणाऱ्या बेजबाबदार पुरवठादारांकडून खरेदी करणे, ज्यामुळे वैध ITC चा हक्क गमवावा लागतो."
    },
    "mythStatement": {
      "English": "GST increases the total manufacturing cost of finished products because all taxes paid on inputs are permanently lost to the business.",
      "Hindi": "GST से उत्पादों की लागत हमेशा बढ़ जाती है क्योंकि कच्चे माल पर चुकाया गया टैक्स कभी वापस नहीं मिलता।",
      "Marathi": "GST मुळे उत्पादनाचा खर्च कायमचा वाढतो कारण कच्च्या मालावर भरलेला कर कधीही परत मिळत नाही असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+GST+impacts+business+Input+tax+credit+English",
        "title": "How GST and Input Tax Credit (ITC) Drive Business",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=GST+Input+tax+credit+business+ke+liye+Hindi",
        "title": "GST से बिजनेस को कैसे फायदा होता है? ITC का नियम",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=GST+vyavsayavar+parinama+Marathi",
        "title": "GST चा व्यवसायावर होणारा परिणाम आणि ITC मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "equity-dilution",
    "term": "Equity Dilution",
    "category": "Business",
    "shortDef": {
      "English": "The reduction in existing shareholders' fractional ownership percentage resulting from a company issuing new equity shares to new investors or employee option pools.",
      "Hindi": "कंपनी द्वारा नए निवेशकों या कर्मचारियों (ESOPs) को नए शेयर जारी करने के कारण मौजूदा शेयरधारकों के स्वामित्व प्रतिशत में होने वाली आनुपातिक कमी।",
      "Marathi": "नवीन गुंतवणूकदारांना किंवा कर्मचाऱ्यांना नवे शेअर्स दिल्याने जुन्या संस्थापकांच्या आणि भागधारकांच्या मालकी हक्काच्या टक्केवारीत होणारी घट."
    },
    "analogy": "Baking an existing pizza into a larger pie, but slicing it into more total pieces so your percentage share of the pie decreases while total calories may increase.",
    "indianExample": "If founders hold 100% of 10,00,000 shares and issue 2,50,000 fresh shares to venture capital investors, their ownership percentage dilutes from 100% to 80% (10L ÷ 12.5L).",
    "rememberThis": {
      "English": "Focus on total enterprise valuation growth rather than obsessing over raw ownership percentage; holding 40% of a ₹100 Crore enterprise is vastly superior to 100% of a ₹1 Crore firm.",
      "Hindi": "स्वामित्व प्रतिशत के बजाय कंपनी के कुल मूल्यांकन (Valuation) पर ध्यान दें; ₹100 करोड़ की कंपनी में 40% हिस्सा, ₹1 करोड़ की कंपनी में 100% से कहीं बड़ा है।",
      "Marathi": "केवळ मालकीच्या टक्केवारीचा हव्यास न धरता कंपनीच्या एकूण मूल्यांकनावर भर द्या; ₹१०० कोटींच्या कंपनीत ४०% असणे हे ₹१ कोटींच्या कंपनीत १००% असण्यापेक्षा श्रेष्ठ आहे."
    },
    "commonMistake": {
      "English": "Diluting excessive equity (e.g. 40%–50%) in an early seed round at depressed valuations, leaving founders demotivated for subsequent growth rounds.",
      "Hindi": "शुरुआती दौर में ही कम मूल्यांकन पर 40%-50% हिस्सेदारी बेच देना, जिससे बाद के राउंड के लिए संस्थापकों के पास पर्याप्त इक्विटी नहीं बचती।",
      "Marathi": "सुरुवातीच्या टप्प्यातच कवडीमोलाच्या भावात जास्त शेअर्स विकून स्वतःची मालकी संपवून टाकणे."
    },
    "mythStatement": {
      "English": "Equity dilution means your existing shares are confiscated and destroyed by the new incoming institutional investors.",
      "Hindi": "इक्विटी डाइल्यूशन का मतलब है कि नए निवेशक पुराने संस्थापकों के शेयरों को छीनकर पूरी तरह नष्ट कर देते हैं।",
      "Marathi": "डाइल्युशन म्हणजे जुन्या संस्थापकांचे शेअर्स काढून घेऊन ते नष्ट केले जातात असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Equity+dilution+explained+startups+fundraising+English",
        "title": "Equity Dilution & Cap Table Mechanics for Founders",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Equity+dilution+kya+hota+hai+startup+Hindi",
        "title": "Equity Dilution क्या है? स्टार्टअप्स में शेयर कैसे घटते हैं",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Equity+dilution+Marathi+mahiti",
        "title": "इक्विटी डाइल्युशन म्हणजे काय? स्टार्टअप्स मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "valuation",
    "term": "Company Valuation",
    "category": "Business",
    "shortDef": {
      "English": "The analytical process of establishing the fair economic value of an enterprise using methodologies such as Discounted Cash Flow (DCF), Comparable Multiples, and asset valuation.",
      "Hindi": "किसी व्यवसाय या स्टार्टअप के वास्तविक आर्थिक मूल्य का निर्धारण करने की प्रक्रिया, जिसमें भविष्य के नकदी प्रवाह और बाजार तुलना का उपयोग किया जाता है।",
      "Marathi": "एखाद्या व्यवसायाचे किंवा कंपनीचे आर्थिक मूल्य निश्चित करण्याची पद्धत; यात भविष्यातील नफा क्षमता आणि बाजारपेठेतील समपदस्थ कंपन्यांचा आधार घेतला जातो."
    },
    "analogy": "An expert appraisal by master surveyors determining the certified auction benchmark price of an entire operating industrial factory.",
    "indianExample": "Pre-money Valuation refers to enterprise value before new funding injection; Post-money Valuation equals Pre-money plus the incoming cash investment.",
    "rememberThis": {
      "English": "Distinguish between vanity headline valuations and real operational profitability; cash flow pays employee salaries, not paper valuations.",
      "Hindi": "दिखावटी वैल्यूएशन के बजाय वास्तविक नकदी प्रवाह (Cash Flow) पर ध्यान दें; कर्मचारियों का वेतन वास्तविक नकद लाभ से मिलता है, कागजी वैल्यूएशन से नहीं।",
      "Marathi": "केवळ दिखाऊ मूल्यांकनाच्या मागे न धावता प्रत्यक्ष नफा आणि रोख पैशांच्या प्रवाहावर भर द्या; पगार रोख पैशातून होतो, कागदी मूल्यांकनातून नाही."
    },
    "commonMistake": {
      "English": "Accepting punitive liquidation preferences and ratchets from venture funds solely to announce an artificially inflated headline valuation.",
      "Hindi": "केवल ऊंची वैल्यूएशन की घोषणा करने के लिए कठोर कानूनी शर्तों पर हस्ताक्षर करना जो भविष्य में संस्थापकों के लिए नुकसानदेह साबित हों।",
      "Marathi": "केवळ जाहिरातीसाठी अवास्तव मोठे मूल्यांकन दाखवून जाचक अटींचे भांडवल स्वीकारणे."
    },
    "mythStatement": {
      "English": "A company's valuation represents the exact liquid cash sitting in its current business bank account today.",
      "Hindi": "कंपनी के वैल्यूएशन का मतलब है कि उसके बैंक खाते में आज उतनी ही पूरी नकदी तुरंत खर्च के लिए उपलब्ध है।",
      "Marathi": "कंपनीचे मूल्यांकन म्हणजे तेवढी रोख रक्कम कंपनीच्या बँक खात्यात प्रत्यक्ष पडून असते असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Startup+valuation+methods+DCF+EBITDA+English",
        "title": "Startup Valuation Methods: DCF vs Market Multiples",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Company+valuation+kaise+nikalte+hai+Hindi",
        "title": "कंपनी का Valuation कैसे निकाला जाता है?",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Company+valuation+Marathi",
        "title": "कंपनीचे मूल्यांकन (Valuation) कसे करतात? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "depreciation",
    "term": "Depreciation (Asset Value Write-Down)",
    "category": "Business",
    "shortDef": {
      "English": "The systematic accounting allocation of the cost of a tangible fixed asset over its estimated useful economic life, reflecting wear, tear, and obsolescence.",
      "Hindi": "किसी भौतिक संपत्ति (जैसे मशीनरी, वाहन, कंप्यूटर) के मूल्य में घिसावट और उपयोग के कारण समय के साथ आने वाली व्यवस्थित मूल्य कमी का लेखांकन।",
      "Marathi": "मशिनरी, वाहने किंवा संगणक यांसारख्या भौतिक मालमत्तांच्या झीज आणि वापरामुळे त्यांच्या मूल्यात दरवर्षी होणारी पद्धतशीर घट (घसारा)."
    },
    "analogy": "Writing off a proportional fraction of your commercial delivery van's purchase ticket every year as its odometer racks up mileage.",
    "indianExample": "Under the Income Tax Act 1961, Section 32 allows block depreciation (e.g. 15% on general plant & machinery, 40% on computers), providing valuable tax shield benefits.",
    "rememberThis": {
      "English": "Depreciation is a non-cash expense; it reduces taxable net profits on the P&L statement while leaving physical bank cash unaffected, creating a vital tax shield.",
      "Hindi": "डेप्रिसिएशन एक गैर-नकद खर्च है; यह टैक्स देनदारी को कम करता है जबकि बैंक में मौजूद वास्तविक नकद राशि सुरक्षित रहती है (Tax Shield)।",
      "Marathi": "घसारा (Depreciation) हा कागदी खर्च असल्याने तो ताळेबंदातील करपात्र नफा कमी करतो आणि कराची बचत घडवून आणतो."
    },
    "commonMistake": {
      "English": "Failing to maintain a formal asset register and missing out on legitimate statutory depreciation tax deductions on business equipment.",
      "Hindi": "व्यावसायिक उपकरणों पर आयकर के तहत मिलने वाली कानूनी डेप्रिसिएशन छूट का दावा न करना और अतिरिक्त टैक्स भर देना।",
      "Marathi": "व्यावसायिक उपकरणांवर नियमानुसार मिळणाऱ्या घसाऱ्याची करसवलत न घेणे आणि जास्तीचा कर भरणे."
    },
    "mythStatement": {
      "English": "Depreciation requires writing a physical monthly check out of the company's operating bank account to the equipment manufacturer.",
      "Hindi": "डेप्रिसिएशन का मतलब है कि कंपनी को हर महीने बैंक से नकद पैसा निकालकर मशीन निर्माता को भेजना होता है।",
      "Marathi": "घसारा म्हणजे दरमहा बँकेतून रोख पैसे काढून कोणाला तरी द्यावे लागतात असा चुकीचा समज."
    },
    "professionTracks": [
      "Startup Founders",
      "Civil Engineering & Builders",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Depreciation+accounting+methods+tax+shield+English",
        "title": "Depreciation Accounting & Tax Shield Explained",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Depreciation+kya+hota+hai+Hindi",
        "title": "Depreciation क्या है और इससे टैक्स कैसे बचता है?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Ghasara+depreciation+Marathi",
        "title": "घसारा (Depreciation) म्हणजे काय? सोपी मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "cash-flow",
    "term": "Cash Flow (Operating Liquidity)",
    "category": "Business",
    "shortDef": {
      "English": "The net aggregate volume of cash and cash equivalents transferring into and out of an enterprise across operating, investing, and financing activities.",
      "Hindi": "किसी व्यवसाय में आने वाली और बाहर जाने वाली नकद राशि का शुद्ध प्रवाह; यह व्यवसाय की तात्कालिक वित्तीय तरलता और जीवित रहने की क्षमता का पैमाना है।",
      "Marathi": "व्यवसायामध्ये प्रत्यक्ष येणाऱ्या आणि बाहेर जाणाऱ्या रोख पैशांचा निव्वळ प्रवाह; हा कंपनीच्या दैनंदिन सक्षमतेचे आणि आर्थिक आरोग्याचे खरे प्रतीक असतो."
    },
    "analogy": "The vital oxygen and blood circulating through an organism; without continuous circulation, the body suffocates regardless of how muscular the frame is.",
    "indianExample": "Measured across three statutory components: Operating Cash Flow (core sales less vendor cash costs), Investing Cash Flow (capex), and Financing Cash Flow (equity & debt).",
    "rememberThis": {
      "English": "Profit is an accounting opinion, but Cash is an undisputed fact; businesses collapse not from lack of booked accounting profit, but from running out of cash.",
      "Hindi": "लाभ (Profit) केवल बहीखाते का एक अनुमान हो सकता है, लेकिन नकदी (Cash) एक ठोस सत्य है; व्यवसाय नकदी खत्म होने से बंद होते हैं।",
      "Marathi": "नफा हा पुस्तकी हिशोब असू शकतो, पण रोख रक्कम हे अंतिम सत्य आहे; कंपन्या तोट्यामुळे नव्हे तर रोख पैसे संपल्यामुळे बंद पडतात."
    },
    "commonMistake": {
      "English": "Celebrating massive paper sales on 180-day uncollected credit while starving for cash to meet monthly worker payroll and rent dues.",
      "Hindi": "उधार पर भारी बिक्री करके खुश होना जबकि कर्मचारियों का वेतन और दुकान का किराया देने के लिए खाते में नकद न बचा हो।",
      "Marathi": "उधारीवर माल विकून कागदावर नफा दाखवणे, पण प्रत्यक्षात कामगारांचा पगार देण्यासाठी बँकेत रोख पैसे नसणे."
    },
    "mythStatement": {
      "English": "A company showing strong net accounting profits on its annual income statement is completely immune to insolvency bankruptcy.",
      "Hindi": "जिस कंपनी के P&L में मुनाफा दिख रहा है, वह कभी भी दिवालिया नहीं हो सकती (जबकि कैश खत्म होने पर लाभदायक कंपनी भी बंद हो जाती है)।",
      "Marathi": "नफ्यात चालणारी कंपनी कधीही दिवाळखोरीत निघू शकत नाही असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Cash+flow+statement+analysis+operating+cash+flow+English",
        "title": "Cash Flow vs Profit: The Blood of Business",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Cash+flow+kya+hota+hai+Hindi+business",
        "title": "Cash Flow क्या है? बिजनेस फेल होने का असली कारण",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Rokh+pravah+cash+flow+Marathi",
        "title": "कॅश फ्लो म्हणजे काय? व्यवसायातील महत्त्व मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "profit-and-loss",
    "term": "Profit & Loss (P&L Statement)",
    "category": "Business",
    "shortDef": {
      "English": "A primary statutory financial statement summarizing total revenues earned, costs incurred, and expenses booked during a specific accounting period.",
      "Hindi": "एक वैधानिक वित्तीय विवरण जो एक निश्चित अवधि के दौरान व्यवसाय द्वारा अर्जित कुल राजस्व, किए गए खर्चों और अंतिम शुद्ध लाभ या हानि का सारांश प्रस्तुत करता है।",
      "Marathi": "विहित आर्थिक कालावधीत व्यवसायाने कमावलेले एकूण उत्पन्न, झालेले सर्व खर्च आणि त्यातून उरलेला निव्वळ नफा किंवा तोटा दर्शवणारा अधिकृत ताळेबंद."
    },
    "analogy": "The quarterly flight navigation scorecard recording all altitudes reached, fuel consumed, and net ground progress achieved.",
    "indianExample": "Structure: Revenue minus Cost of Goods Sold (COGS) equals Gross Profit; subtracting Operating Expenses (Opex), Depreciation, and Taxes yields Net Profit (PAT).",
    "rememberThis": {
      "English": "Scrutinize the operating profit margin trend across consecutive quarters to verify whether underlying business fundamentals are expanding or deteriorating.",
      "Hindi": "लगातार तिमाहियों में ऑपरेटिंग प्रॉफिट मार्जिन के रुझान की जांच करें ताकि यह समझ आ सके कि व्यवसाय का मुख्य मॉडल मजबूत हो रहा है या कमजोर।",
      "Marathi": "कंपनीच्या मूळ व्यवसायातील नफ्याचे प्रमाण (Operating Margin) सातत्याने वाढते आहे की घटते आहे यावर बारीक लक्ष ठेवा."
    },
    "commonMistake": {
      "English": "Confusing gross revenues with net bottom-line profit, leading to aggressive expansion before validating profitability.",
      "Hindi": "कुल बिक्री (टर्नओवर) को ही अपना मुनाफा समझ लेना और बिना लागत घटाए अंधाधुंध विस्तार शुरू कर देना।",
      "Marathi": "एकूण विक्रीलाच निव्वळ नफा मानून अवाजवी विस्तार करणे आणि शेवटी तोट्यात जाणे."
    },
    "mythStatement": {
      "English": "A Profit & Loss statement records only transactions where cash has physically cleared into the company's bank accounts.",
      "Hindi": "P&L स्टेटमेंट में केवल वही सौदे दर्ज होते हैं जिनका नकद पैसा बैंक खाते में उसी दिन जमा हो चुका हो।",
      "Marathi": "नफा-तोटा पत्रकात केवळ रोखीने झालेल्या व्यवहारांचीच नोंद होते असा चुकीचा समज."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+to+read+Profit+and+Loss+statement+P+L+English",
        "title": "Reading a Profit and Loss (P&L) Statement",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Profit+and+loss+statement+kaise+padhe+Hindi",
        "title": "P&L Statement कैसे पढ़ें? बैलेंस शीट का सच",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Nafa+tota+patrak+Marathi",
        "title": "नफा-तोटा पत्रक (P&L) कसे वाचावे? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "working-capital",
    "term": "Working Capital (Operational Runway)",
    "category": "Business",
    "shortDef": {
      "English": "The operational liquidity metric calculated as Current Assets minus Current Liabilities, measuring an enterprise's capability to fund short-term commitments.",
      "Hindi": "चालू संपत्तियों (Current Assets) और चालू देनदारियों (Current Liabilities) के बीच का अंतर; यह व्यवसाय की दैनिक परिचालन लागत को पूरा करने की क्षमता को दर्शाता है।",
      "Marathi": "चालू मालमत्ता आणि चालू देणी यांमधील फरक; हा व्यवसायाचे दैनंदिन व्यवहार सुरळीत चालवण्यासाठी लागणारे खेळते भांडवल दर्शवतो."
    },
    "analogy": "The working fuel supply sitting in your tank right now that keeps the engine running until the next gas station payout arrives.",
    "indianExample": "Includes inventory, raw materials, and accounts receivable on the asset side, balanced against vendor payables and short-term credit lines.",
    "rememberThis": {
      "English": "Maintain a healthy Current Ratio (Current Assets ÷ Current Liabilities) between 1.33 and 2.0 to ensure your business never faces sudden supplier insolvency.",
      "Hindi": "अपने करंट रेश्यो को 1.5 से 2.0 के बीच बनाए रखें ताकि कच्चे माल के सप्लायरों और कर्मचारियों के भुगतान में कभी रुकावट न आए।",
      "Marathi": "आपले खेळते भांडवल गुणोत्तर १.५ ते २.० दरम्यान ठेवावे, जेणेकरून पुरवठादार आणि कर्मचाऱ्यांचे देणे वेळेत देता येईल."
    },
    "commonMistake": {
      "English": "Over-investing all liquid working capital into illiquid machinery, leaving the enterprise unable to pay supplier dues or utility bills.",
      "Hindi": "सारा चालू पैसा मशीनों या जमीन में फंसा देना और फिर सप्लायरों का बिल भरने के लिए कार्यशील पूंजी की तंगी में आ जाना।",
      "Marathi": "सर्व खेळते भांडवल अचल मालमत्तेत अडकवणे आणि दैनंदिन खर्चासाठी पैशांची चणचण निर्माण करून घेणे."
    },
    "mythStatement": {
      "English": "Working capital is identical to long-term equity capital invested by founders into permanent company factory buildings.",
      "Hindi": "कार्यशील पूंजी और कारखाने की इमारत में लगाया गया दीर्घकालिक निवेश दोनों बिल्कुल एक समान होते हैं।",
      "Marathi": "खेळते भांडवल आणि कारखान्याच्या इमारतीसाठी गुंतवलेले कायमस्वरूपी भांडवल हे दोन्ही एकच असतात असा भ्रम."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Working+capital+cycle+management+explained+English",
        "title": "Working Capital Cycle & Cash Conversion",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Working+capital+kya+hota+hai+Hindi",
        "title": "Working Capital क्या है? बिजनेस के लिए यह क्यों जरूरी है",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Khelte+bhandval+working+capital+Marathi",
        "title": "खेळते भांडवल (Working Capital) व्यवस्थापन मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "gross-margin",
    "term": "Gross Margin",
    "category": "Business",
    "shortDef": {
      "English": "The profitability metric showing the percentage of revenue remaining after deducting direct Cost of Goods Sold (COGS) like raw materials and direct factory labor.",
      "Hindi": "कच्चे माल और प्रत्यक्ष उत्पादन लागत (COGS) घटाने के बाद बची बिक्री आय का प्रतिशत; यह उत्पाद के मूल मूल्य निर्धारण और निर्माण दक्षता को मापता है।",
      "Marathi": "कच्चा माल आणि थेट उत्पादन खर्च वजा जाता शिल्लक राहिलेल्या उत्पन्नाचे टक्केवारीतील प्रमाण (स्थूल नफा प्रमाण)."
    },
    "analogy": "The markup cushion left on each manufactured shirt after paying for the cloth fabric and the tailor's stitching wages.",
    "indianExample": "Formula: Gross Margin % = [(Total Revenue - Cost of Goods Sold) ÷ Total Revenue] × 100. High-margin SaaS products command 75%–85%, while commodity retail operates at 15%–25%.",
    "rememberThis": {
      "English": "A healthy, expanding Gross Margin is proof of pricing power; it provides the breathing room needed to fund research, marketing, and expansion.",
      "Hindi": "मजबूत ग्रॉस मार्जिन व्यवसाय की 'मूल्य निर्धारण शक्ति' (Pricing Power) को साबित करता है और मार्केटिंग के लिए बजट उपलब्ध कराता है।",
      "Marathi": "चांगले ग्रॉस मार्जिन हे उत्पादनाच्या गुणवत्तेचे आणि ग्राहकांवरील प्रभावाचे प्रतीक असते; यातूनच जाहिरात आणि विस्ताराचा खर्च निघतो."
    },
    "commonMistake": {
      "English": "Slashing selling prices aggressively to chase vanity revenue targets while collapsing Gross Margin below sustainable operating breakeven.",
      "Hindi": "बिक्री का आंकड़ा बड़ा दिखाने के लिए भारी छूट देना, जिससे ग्रॉस मार्जिन इतना गिर जाए कि दुकान का किराया भी न निकल सके।",
      "Marathi": "केवळ उलाढाल मोठी दाखवण्यासाठी नफेखोरी सोडून तोट्यात माल विकणे आणि शेवटी दिवाळखोरी ओढवून घेणे."
    },
    "mythStatement": {
      "English": "Gross Margin and Net Profit Margin represent the exact identical percentage figure across corporate accounting reports.",
      "Hindi": "ग्रॉस मार्जिन और नेट प्रॉफिट मार्जिन दोनों हमेशा एक ही समान प्रतिशत होते हैं।",
      "Marathi": "ग्रॉस मार्जिन आणि निव्वळ नफा मार्जिन हे दोन्ही आकडे नेहमी अगदी सारखेच असतात."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+Margin+vs+Net+Margin+formulas+English",
        "title": "Gross Margin vs Net Margin: Business Metrics",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+margin+kaise+nikalte+hai+Hindi",
        "title": "Gross Margin क्या होता है? फॉर्मूला और उदाहरण",
        "channel": "Asset Yogi"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Gross+margin+Marathi+guide",
        "title": "ग्रॉस मार्जिन म्हणजे काय? व्यावसायिक हिशोब मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "net-profit-margin",
    "term": "Net Profit Margin",
    "category": "Business",
    "shortDef": {
      "English": "The bottom-line percentage metric measuring what proportion of each rupee of revenue translates into true profit after settling all operating expenses, interest, and income taxes.",
      "Hindi": "सभी परिचालन व्ययों, प्रशासनिक लागतों, बैंक ब्याज और आयकर के पूर्ण भुगतान के बाद बिक्री के प्रत्येक रुपये से बचने वाले वास्तविक शुद्ध लाभ का प्रतिशत।",
      "Marathi": "सर्व कार्यालयीन खर्च, कर्जाचे व्याज आणि प्राप्तिकर भरल्यानंतर प्रत्येक रुपयाच्या विक्रीमागे प्रत्यक्ष हातात उरणारा निव्वळ नफा (टक्केवारीत)."
    },
    "analogy": "The pure refined gold remaining in the smelter after all impurities, operational fuels, and sovereign taxes have been completely satisfied.",
    "indianExample": "Formula: Net Profit Margin % = (Net Profit after Tax ÷ Total Revenue) × 100. IT giants typically command 18%–25%, whereas hypermarkets operate on lean 2%–4% margins.",
    "rememberThis": {
      "English": "A company can generate astronomical top-line turnover but still be economically worthless if its Net Profit Margin is consistently zero or negative.",
      "Hindi": "कंपनी का टर्नओवर चाहे 1000 करोड़ हो, यदि नेट प्रॉफिट मार्जिन शून्य या नकारात्मक है, तो व्यवसाय अंततः दिवालिया हो जाएगा।",
      "Marathi": "कंपनीची उलाढाल कितीही कोटींची असली तरी निव्वळ नफा मार्जिन शून्य असेल तर ती कंपनी टिकू शकत नाही."
    },
    "commonMistake": {
      "English": "Assuming that high top-line revenue growth automatically guarantees an expanding bottom-line net profit margin.",
      "Hindi": "यह मान लेना कि बिक्री बढ़ने से मुनाफा अपने आप बढ़ जाएगा, जबकि अनियंत्रित खर्चे लाभ को पूरी तरह निगल सकते हैं।",
      "Marathi": "विक्री वाढल्याने आपोआप नफा वाढेल असा चुकीचा समज बाळगणे, कारण वाढत्या खर्चांमुळे नफा घटूही शकतो."
    },
    "mythStatement": {
      "English": "Any business generating positive net profit margin is completely insulated against seasonal economic slowdowns.",
      "Hindi": "यदि नेट प्रॉफिट मार्जिन सकारात्मक है, तो कंपनी को कभी भी आर्थिक मंदी से कोई खतरा नहीं हो सकता।",
      "Marathi": "निव्वळ नफा असणारी कंपनी आर्थिक मंदीच्या काळात कधीही तोट्यात जाऊ शकत नाही असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Net+profit+margin+calculation+formula+English",
        "title": "Net Profit Margin: The True Bottom Line",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Net+profit+margin+kya+hota+hai+Hindi",
        "title": "Net Profit Margin कैसे बढ़ाएं? बिजनेस गाइड",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Nivval+nafa+margin+Marathi",
        "title": "निव्वळ नफा मार्जिन म्हणजे काय? मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "revenue",
    "term": "Revenue (Top-Line Growth)",
    "category": "Business",
    "shortDef": {
      "English": "The gross monetary inflow generated by a business from the sale of goods, rendering of services, or commercial operations before subtracting any deductions or expenses.",
      "Hindi": "किसी व्यवसाय द्वारा वस्तुओं की बिक्री या सेवाओं के प्रावधान से प्राप्त कुल सकल आय, जिसमें से अभी किसी भी लागत या खर्च को घटाया नहीं गया है।",
      "Marathi": "वस्तूंच्या विक्रीतून किंवा सेवा पुरवून व्यवसायाला मिळालेली एकूण ढोबळ रक्कम (Top-Line); यातून अद्याप कसलाही खर्च वजा केलेला नसतो."
    },
    "analogy": "The total gross volume of water cascading over the dam waterfall before diversion into irrigation channels, filtration plants, or evaporation.",
    "indianExample": "Referred to colloquially as the 'Top-Line' because it occupies the very first line of a standardized corporate income statement.",
    "rememberThis": {
      "English": "Revenue growth without unit economics profitability is unsustainable; prioritize high-quality recurring revenue over discounted transactional spikes.",
      "Hindi": "घाटे में माल बेचकर केवल रेवेन्यू बढ़ाना आत्मघाती है; हमेशा टिकाऊ और लाभदायक रेवेन्यू पर ध्यान केंद्रित करें।",
      "Marathi": "तोट्यात माल विकून केवळ रेव्हेन्यू वाढवणे धोक्याचे असते; प्रत्येक व्यवहारात नफा देणाऱ्या दर्जेदार विक्रीवर लक्ष केंद्रित करा."
    },
    "commonMistake": {
      "English": "Focusing entirely on top-line revenue vanity metrics to impress outside investors while ignoring bleeding burn rates and gross margin erosion.",
      "Hindi": "केवल बड़े रेवेन्यू का ढिंढोरा पीटना जबकि कंपनी हर महीने भारी नकद नुकसान उठा रही हो।",
      "Marathi": "केवळ मोठी विक्री दाखवून समाधान मानणे आणि दरमहा होणाऱ्या प्रचंड तोट्याकडे दुर्लक्ष करणे."
    },
    "mythStatement": {
      "English": "Revenue and Net Cash Inflow into the corporate bank account are always identical on a day-to-day basis.",
      "Hindi": "रेवेन्यू और कंपनी के बैंक खाते में आने वाली नकद राशि हर दिन हमेशा बिल्कुल एक समान होती है।",
      "Marathi": "विक्रीची नोंद आणि बँकेत रोख पैसे जमा होणे हे दोन्ही व्यवहार दररोज एकाच वेळी घडतात असा समज."
    },
    "professionTracks": [
      "Startup Founders",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Revenue+vs+Profit+explained+top+line+bottom+line+English",
        "title": "Revenue vs Profit: Top Line vs Bottom Line",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Revenue+kya+hota+hai+Hindi+video",
        "title": "Revenue क्या होता है? टर्नओवर और प्रॉफिट का सच",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Revenue+mhanje+kay+Marathi",
        "title": "रेव्हेन्यू म्हणजे काय? नफ्यापेक्षा वेगळा कसा? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "turnover",
    "term": "Business Turnover",
    "category": "Business",
    "shortDef": {
      "English": "The aggregate volume of business transacted or the pace at which inventory, capital, or receivables cycle through the enterprise during a financial year.",
      "Hindi": "एक वित्तीय वर्ष के दौरान व्यवसाय द्वारा किया गया कुल समग्र व्यापार मूल्य (बिक्री की गति), जो यह दर्शाता है कि पूंजी या स्टॉक कितनी तेजी से घूम रहा है।",
      "Marathi": "एका आर्थिक वर्षात व्यवसायाने केलेली एकूण एकत्रित उलाढाल; ही भांडवल किंवा मालाचा साठा किती वेगाने फिरतो हे दर्शवते."
    },
    "analogy": "The rotational velocity of the water wheel: how many times your working inventory completely rotates through sales and replenishes.",
    "indianExample": "Statutory benchmarks: Tax audit under Section 44AB is triggered if business turnover exceeds ₹1 Crore (₹10 Crore if digital transactions exceed 95%).",
    "rememberThis": {
      "English": "High inventory turnover reduces holding storage costs and minimizes the risk of stock obsolescence or spoilage.",
      "Hindi": "उच्च टर्नओवर से इन्वेंट्री रखने की लागत कम होती है और सामान खराब होने या पुराना पड़ने का जोखिम घटता है।",
      "Marathi": "मालाची उलाढाल वेगाने झाल्यास गोदामाचा खर्च वाचतो आणि माल पडून राहून खराब होण्याचा धोका टळतो."
    },
    "commonMistake": {
      "English": "Expanding turnover through extended 120-day uncollateralized supplier credit that paralyzes working capital and sparks liquidity default.",
      "Hindi": "टर्नओवर बढ़ाने के लिए बाजार में अंधाधुंध उधारी बांटना और फिर वसूली न होने पर खुद दिवालिया हो जाना।",
      "Marathi": "उलाढाल वाढवण्यासाठी बाजारात अनिर्बंध उधारी वाटणे आणि पैसे अडकल्यामुळे स्वतः अडचणीत येणे."
    },
    "mythStatement": {
      "English": "Achieving high annual turnover guarantees that the business is earning healthy positive net profits.",
      "Hindi": "उच्च वार्षिक टर्नओवर इस बात की गारंटी है कि व्यवसाय बहुत अच्छा शुद्ध मुनाफा कमा रहा है।",
      "Marathi": "मोठी वार्षिक उलाढाल असणारा व्यवसाय हमखास मोठ्या नफ्यातच असतो असा चुकीचा समज."
    },
    "professionTracks": [
      "Food Business Owners",
      "Civil Engineering & Builders",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=What+is+turnover+in+business+audit+limits+India+English",
        "title": "Business Turnover and Tax Audit Limits (Section 44AB)",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Turnover+kya+hota+hai+Hindi",
        "title": "टर्नओवर क्या है और 44AB ऑडिट के नियम",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Uladhal+turnover+Marathi",
        "title": "व्यवसायाची उलाढाल (Turnover) म्हणजे काय? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "credit-score",
    "term": "Credit Score (CIBIL)",
    "category": "Credit",
    "shortDef": {
      "English": "A 3-digit numerical summary (300–900) reflecting creditworthiness and repayment track record, computed by licensed credit bureaus such as CIBIL TransUnion, Experian, and Equifax.",
      "Hindi": "उधारकर्ता की साख और ऋण चुकाने के इतिहास को दर्शाने वाला 300 से 900 के बीच का 3-अंकीय स्कोर, जिसे CIBIL, Experian और Equifax जैसे लाइसेंस प्राप्त क्रेडिट ब्यूरो तैयार करते हैं।",
      "Marathi": "कर्जफेडीची क्षमता आणि आर्थिक विश्वासार्हता दर्शवणारा ३०० ते ९०० दरम्यानचा ३-अंकी पत निर्देशांक; हा CIBIL, Experian आणि Equifax या परवानाधारक ब्युरोंद्वारे ठरवला जातो."
    },
    "analogy": "A clean academic character certificate issued by the school principal before granting admission into prestigious higher education universities.",
    "indianExample": "A CIBIL score of 750+ qualifies borrowers for preferential home loan interest rates (e.g. 8.40% vs 9.25%), saving ₹5 Lakh to ₹12 Lakh over a 20-year loan tenure.",
    "rememberThis": {
      "English": "Maintain a score above 750 by repaying 100% of credit card bills and loan EMIs on or before the due date, avoiding minimum due rollovers.",
      "Hindi": "क्रेडिट कार्ड बिल और EMI हमेशा देय तिथि से पहले पूरी तरह चुकाएं ताकि CIBIL स्कोर 750 से ऊपर बना रहे और भविष्य में सस्ते दर पर लोन मिल सके।",
      "Marathi": "क्रेडिट कार्डचे बिल आणि EMI नेहमी वेळेच्या आधी पूर्ण भरा, जेणेकरून CIBIL स्कोर ७५० च्या वर राहील आणि कमी व्याजात कर्ज मिळेल."
    },
    "commonMistake": {
      "English": "Checking your own credit score frequently will drastically degrade your CIBIL rating like a hard inquiry from a commercial bank.",
      "Hindi": "बार-बार अपना क्रेडिट स्कोर ऑनलाइन चेक करने से सिबिल स्कोर गिर जाता है।",
      "Marathi": "स्वतःचा क्रेडिट स्कोअर वेळोवेळी तपासल्याने तो कमी होतो असा चुकीचा समज बाळगणे."
    },
    "mythStatement": {
      "English": "Closing your oldest credit card will immediately increase your credit score by reducing your total debt exposure.",
      "Hindi": "अपना सबसे पुराना क्रेडिट कार्ड बंद करने से आपका सिबिल स्कोर तुरंत बढ़ जाता है।",
      "Marathi": "जुने क्रेडिट कार्ड बंद केल्याने क्रेडिट स्कोअर त्वरित सुधारतो असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Startup Founders",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+explained+how+to+improve+English",
        "title": "Understanding CIBIL Score & Credit Reports in India",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+kya+hota+hai+kaise+badhaye+Hindi",
        "title": "CIBIL Score क्या है? 750+ स्कोर कैसे बनाएं",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+mhanje+kay+Marathi",
        "title": "CIBIL स्कोअर म्हणजे काय? कसा सुधारावा? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "emi",
    "term": "EMI (Equated Monthly Installment)",
    "category": "Credit",
    "shortDef": {
      "English": "A fixed monthly payment made by a borrower to a financial lender on a predetermined calendar date to amortize both loan principal and accrued interest.",
      "Hindi": "उधारकर्ता द्वारा ऋण के मूलधन और ब्याज को चुकाने के लिए बैंक या वित्तीय संस्थान को हर महीने एक निश्चित तिथि पर दी जाने वाली समान मासिक किस्त।",
      "Marathi": "कर्जाची मुद्दल आणि व्याज फेडण्यासाठी दरमहा ठराविक तारखेला बँकेला द्यावा लागणारा समान मासिक हप्ता (EMI)."
    },
    "analogy": "A recurring monthly subscription fee paid to gradually purchase ownership of a vehicle or apartment over several years.",
    "indianExample": "On a ₹30 Lakh Home Loan for 20 years at 8.5% interest, the monthly EMI is ₹26,035, comprising ₹21,250 interest and ₹4,785 principal in Month 1.",
    "rememberThis": {
      "English": "Limit your total household loan EMIs (home, auto, personal) to under 40% of your net monthly take-home salary to avoid debt traps.",
      "Hindi": "अपने सभी कर्जों की कुल मासिक EMI को अपने शुद्ध मासिक वेतन (Take-Home) के 40% से कम रखें ताकि जीवनशैली पर आर्थिक दबाव न आए।",
      "Marathi": "घरातील सर्व कर्जांचे मासिक हप्ते (EMI) निव्वळ पगाराच्या ४०% पेक्षा कमी ठेवा, जेणेकरून संकटाच्या वेळी अडचण येणार नाही."
    },
    "commonMistake": {
      "English": "Opting for the longest permissible loan tenure (e.g. 30 years) just to minimize the initial monthly EMI, which doubles the total interest paid to the bank.",
      "Hindi": "मासिक EMI कम रखने के चक्कर में 30 साल की लंबी अवधि चुनना, जिससे बैंक को चुकाया जाने वाला कुल ब्याज मूलधन से भी अधिक हो जाता है।",
      "Marathi": "केवळ दरमहा कमी हप्ता बसावा म्हणून ३० वर्षांची मोठी मुदत निवडणे, ज्यामुळे मुद्दलापेक्षा जास्त व्याज बँकेला भरावे लागते."
    },
    "mythStatement": {
      "English": "Paying EMIs on time for 12 months completely wipes out all remaining interest for the rest of the loan tenure.",
      "Hindi": "12 महीने समय पर EMI चुकाने से बाकी पूरे लोन का ब्याज पूरी तरह माफ हो जाता है।",
      "Marathi": "एक वर्ष वेळेवर EMI भरल्यास उर्वरित मुदतीचे सर्व व्याज माफ होते असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Food Business Owners",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+EMI+calculation+works+reducing+balance+English",
        "title": "How Loan EMI Calculation and Amortization Works",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=EMI+kaise+calculate+hoto+hai+Hindi",
        "title": "EMI का गणित: बैंक आपको कैसे ब्याज में फंसाते हैं",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=EMI+ganit+marathi+video",
        "title": "EMI म्हणजे काय? बँकेचे व्याज कसे मोजतात? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "principal",
    "term": "Principal Amount",
    "category": "Credit",
    "shortDef": {
      "English": "The initial capital sum borrowed in a loan facility or deposited in an investment instrument, excluding all accumulated interest, charges, or fees.",
      "Hindi": "किसी ऋण में ली गई या किसी निवेश साधन में लगाई गई मूल धनराशि, जिसमें किसी भी प्रकार का ब्याज, अधिभार या शुल्क शामिल नहीं होता।",
      "Marathi": "कर्ज म्हणून घेतलेली किंवा गुंतवणुकीत जमा केलेली मूळ रक्कम; यात कसलेही व्याज, दंड किंवा इतर शुल्क समाविष्ट नसते."
    },
    "analogy": "The physical base brick foundation of a building upon which decorative floors of interest are constructed.",
    "indianExample": "If you borrow ₹10,00,000 for a car loan, ₹10 Lakh is the Principal; the additional ₹2.5 Lakh paid over 5 years is the interest charge.",
    "rememberThis": {
      "English": "Make periodic prepayments directly towards the loan principal; even one extra EMI per year towards principal cuts loan tenure by several years.",
      "Hindi": "हर साल कम से कम एक अतिरिक्त EMI मूलधन (Principal) चुकाने में लगाएं; इससे 20 साल का होम लोन 15 साल में समाप्त हो सकता है।",
      "Marathi": "दरवर्षी मूळ रकमेवर (Principal) किमान एक जादा हप्ता आगाऊ भरा; यामुळे कर्जाची मुदत कित्येक वर्षांनी कमी होते."
    },
    "commonMistake": {
      "English": "Assuming every EMI payment in the initial years goes equally to principal reduction and interest repayment.",
      "Hindi": "यह मान लेना कि शुरुआती वर्षों में EMI का आधा हिस्सा सीधे मूलधन को कम करता है, जबकि शुरुआती किस्तों में 80% हिस्सा केवल ब्याज होता है।",
      "Marathi": "सुरुवातीच्या वर्षांमध्ये भरलेल्या हप्त्यात मुद्दल आणि व्याज समान प्रमाणात असते असा गैरसमज बाळगणे."
    },
    "mythStatement": {
      "English": "The principal amount of a bank loan automatically decreases every month even if you skip paying your scheduled EMI.",
      "Hindi": "यदि आप EMI न भी भरें, तो भी बैंक लोन का मूलधन अपने आप हर महीने कम होता रहता है।",
      "Marathi": "हप्ता न भरल्यासही बँकेचे मूळ कर्ज आपोआप दरमहा कमी होत जाते असा भाबडा समज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Civil Engineering & Builders",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Principal+vs+interest+loan+amortization+English",
        "title": "Principal vs Interest in Loans Explained",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Loan+ka+principal+kya+hota+hai+Hindi",
        "title": "लोन में मूलधन (Principal) और ब्याज का अंतर",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Muddal+ani+vyaj+Marathi",
        "title": "कर्जाची मुद्दल आणि व्याज यातील फरक मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "interest-rate",
    "term": "Interest Rate (Fixed vs Floating)",
    "category": "Credit",
    "shortDef": {
      "English": "The annualized percentage rate charged by a lender for borrowing capital, which may be fixed for the tenure or floating linked to the RBI External Benchmark (EBLR).",
      "Hindi": "ऋणदाता द्वारा उधार दी गई पूंजी पर लिया जाने वाला वार्षिक प्रतिशत शुल्क, जो पूरे कार्यकाल के लिए स्थिर (Fixed) या RBI रेपो रेट से जुड़ा फ्लोटिंग (Floating) हो सकता है।",
      "Marathi": "कर्ज देण्यासाठी बँकेने आकारलेला वार्षिक व्याजदर (टक्केवारीत); हा संपूर्ण मुदतीसाठी कायम (Fixed) किंवा RBI च्या रेपो रेटशी जोडलेला (Floating) असू शकतो."
    },
    "analogy": "The hourly rental charge paid for renting a high-performance commercial construction crane.",
    "indianExample": "RBI Repo Rate changes directly transmit into floating home loan rates; a 50 bps repo hike by RBI raises an 8.50% home loan to 9.00%.",
    "rememberThis": {
      "English": "Opt for floating interest rates on long-term home loans as RBI regulations mandate zero prepayment penalty on floating retail loans.",
      "Hindi": "लंबी अवधि के होम लोन के लिए फ्लोटिंग दर चुनें क्योंकि RBI नियमानुसार फ्लोटिंग लोन को बिना किसी पेनाल्टी के कभी भी प्री-पे किया जा सकता है।",
      "Marathi": "गृहकर्जासाठी नेहमी फ्लोटिंग व्याजदर निवडा कारण RBI च्या नियमांनुसार फ्लोटिंग कर्जावर मुदतीपूर्व परतफेडीचा कसलाही दंड नसतो."
    },
    "commonMistake": {
      "English": "Confusing flat interest rates advertised by unorganized auto lenders (e.g. 7% flat) with true reducing balance interest rates (which equals ~13% effective APR).",
      "Hindi": "फ्लैट ब्याज दर (Flat Rate) को कम समझकर धोखा खाना, जबकि फ्लैट 7% का वास्तविक प्रभावी ब्याज दर लगभग 13% होता है।",
      "Marathi": "फ्लॅट व्याजदराला स्वस्त समजून भुलणे, कारण ७% फ्लॅट रेटचा खरा प्रभावी व्याजदर प्रत्यक्षात १३% च्या आसपास असतो."
    },
    "mythStatement": {
      "English": "Fixed interest rate home loans in India remain 100% frozen forever regardless of global hyperinflation or central bank statutory rate resets.",
      "Hindi": "फिक्स्ड रेट होम लोन का ब्याज जीवन भर कभी भी किसी भी परिस्थिति में बैंक द्वारा बदला नहीं जा सकता।",
      "Marathi": "फिक्स्ड व्याजदराचे कर्ज घेतल्यानंतर बँक तो दर कोणत्याही परिस्थितीत कधीही बदलू शकत नाही असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Civil Engineering & Builders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Fixed+vs+Floating+interest+rate+home+loan+India+English",
        "title": "Fixed vs Floating Interest Rates: Which Is Best?",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Fixed+vs+floating+interest+rate+Hindi",
        "title": "Fixed या Floating ब्याज दर? होम लोन का सच",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Vyajdar+fixed+floating+marathi",
        "title": "फिक्स्ड की फ्लोटिंग व्याजदर? कर्जदारांसाठी मार्गदर्शन मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "simple-interest",
    "term": "Simple Interest",
    "category": "Credit",
    "shortDef": {
      "English": "An elementary interest calculation methodology computed exclusively on the original principal amount over the loan or deposit tenure, ignoring interest compounding.",
      "Hindi": "ब्याज गणना की वह सरल पद्धति जिसमें ब्याज की गणना केवल मूल धनराशि पर की जाती है, और पिछले ब्याजों पर कोई अतिरिक्त ब्याज नहीं जोड़ा जाता।",
      "Marathi": "केवळ मूळ मुद्दलावरच ठराविक कालावधीसाठी मोजले जाणारे सरळ व्याज; यात आधीच्या व्याजावर पुन्हा व्याज आकारले जात नाही."
    },
    "analogy": "A standard flat parking fee charged per hour without any cumulative multiplier for staying extra hours.",
    "indianExample": "Formula: SI = (P × R × T) ÷ 100. A ₹1,00,000 personal loan at 10% simple interest for 3 years incurs total interest of ₹30,000.",
    "rememberThis": {
      "English": "Use simple interest to benchmark short-term promissory notes, but remember institutional retail loans always calculate interest on a monthly reducing balance.",
      "Hindi": "सरल ब्याज केवल अनौपचारिक या अल्पकालिक व्यक्तिगत समझौतों में लागू होता है; बैंक हमेशा मासिक घटते शेष पर चक्रवृद्धि ब्याज लेते हैं।",
      "Marathi": "सरळ व्याज केवळ साध्या व्यवहारांसाठी असते; बँकांचे सर्व गृहकर्ज आणि वाहनकर्ज नेहमी चक्रवाढ पद्धतीनेच आकारले जातात."
    },
    "commonMistake": {
      "English": "Assuming that bank credit card revolving dues and overdue overdrafts are billed using simple interest formulas.",
      "Hindi": "यह मान लेना कि क्रेडिट कार्ड के बकाया बिलों पर बैंक सरल ब्याज लगाते हैं, जबकि वे 42% वार्षिक चक्रवृद्धि ब्याज वसूलते हैं।",
      "Marathi": "क्रेडिट कार्डच्या थकीत बिलावर सरळ व्याजाने आकारणी होते असा गैरसमज बाळगणे."
    },
    "mythStatement": {
      "English": "All bank home loans in India calculate monthly repayments using elementary simple interest arithmetic.",
      "Hindi": "भारत में सभी बैंक होम लोन की गणना प्राथमिक सरल ब्याज फॉर्मूले से करते हैं।",
      "Marathi": "भारतातील सर्व बँक कर्जे सरळ व्याजाच्या गणितानुसार चालतात असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Simple+interest+vs+compound+interest+explained+English",
        "title": "Simple vs Compound Interest Mechanics",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Simple+interest+kya+hota+hai+Hindi",
        "title": "साधारण ब्याज (Simple Interest) का वास्तविक अर्थ",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Saral+vyaj+Marathi",
        "title": "सरळ व्याज म्हणजे काय? संपूर्ण माहिती मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "compound-interest-debt",
    "term": "Compound Interest on Debt",
    "category": "Credit",
    "shortDef": {
      "English": "The financial dynamic where accrued unpaid interest is added back to outstanding principal, creating an escalating spiral of interest charged upon previous interest.",
      "Hindi": "ऋण पर लगने वाला वह चक्रवृद्धि ब्याज जिसमें न चुकाए गए ब्याज को मूलधन में जोड़ दिया जाता है, जिससे ब्याज पर भी अतिरिक्त ब्याज लगना शुरू हो जाता है।",
      "Marathi": "थकीत कर्जावर आकारले जाणारे चक्रवाढ व्याज; यात न भरलेले व्याज मुद्दलात जमा होऊन व्याजावरही पुन्हा व्याज आकारले जाते, ज्यामुळे कर्जाचा डोंगर उभा राहतो."
    },
    "analogy": "A rolling snowball rolling downhill, gathering extra snow at an accelerating speed until it triggers an uncontrollable avalanche.",
    "indianExample": "Rolling ₹50,000 on a credit card at 3.5% monthly compound interest (42% APR) mushrooms into ₹1,03,000 in just 18 months if only minimum dues are settled.",
    "rememberThis": {
      "English": "Never treat credit cards as emergency installment loans; unpaid rolling credit card balances compound exponentially daily from transaction date.",
      "Hindi": "क्रेडिट कार्ड को कभी भी पर्सनल लोन की तरह न समझें; न चुकाए गए बिल पर पहले ही दिन से 42% तक का भारी चक्रवृद्धि ब्याज जुड़ने लगता है।",
      "Marathi": "क्रेडिट कार्डच्या बिलावर चक्रवाढ व्याजाने आकारणी होते, त्यामुळे संपूर्ण बिल वेळेत भरून कर्जाच्या सापळ्यातून दूर राहा."
    },
    "commonMistake": {
      "English": "Paying only the 'Minimum Amount Due' on monthly credit card statements, allowing compounding debt to trap you for decades.",
      "Hindi": "क्रेडिट कार्ड का केवल 'मिनिमम ड्यू' भरकर यह सोचना कि कर्ज खत्म हो रहा है, जबकि बाकी 95% राशि पर भारी ब्याज चक्रवृद्धित होता रहता है।",
      "Marathi": "केवळ 'किमान देय रक्कम' (Minimum Due) भरून कर्ज फिटत आहे असा खोटा दिलासा मानणे."
    },
    "mythStatement": {
      "English": "Compound interest on consumer debt automatically stops compounding if you stop making phone calls to the credit card company.",
      "Hindi": "यदि आप बैंक के फोन उठाना बंद कर दें तो क्रेडिट कार्ड का चक्रवृद्धि ब्याज बढ़ना अपने आप रुक जाता है।",
      "Marathi": "बँकेशी संपर्क तोडला की कर्जावरील चक्रवाढ व्याज थांबते असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+card+interest+trap+compounding+debt+English",
        "title": "How Credit Card Compound Interest Destroys Wealth",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+card+interest+kaise+lagta+hai+Hindi",
        "title": "क्रेडिट कार्ड का मिनिमम ड्यू का जाल: 42% ब्याज का सच",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Chakravadh+karj+marathi+video",
        "title": "कर्जावरील चक्रवाढ व्याज कसे टाळावे? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "collateral",
    "term": "Collateral & Security",
    "category": "Credit",
    "shortDef": {
      "English": "A valuable tangible or financial asset pledged by a borrower to a lending institution to secure a loan facility and mitigate lender default risk.",
      "Hindi": "ऋण प्राप्त करने के लिए उधारकर्ता द्वारा बैंक के पास गिरवी रखी जाने वाली मूल्यवान चल या अचल संपत्ति (जैसे मकान, सोना, शेयर, FD) जो ऋणदाता के जोखिम को कम करती है।",
      "Marathi": "कर्ज मिळवण्यासाठी कर्जदाराने बँकेकडे तारण ठेवलेली मौल्यवान मालमत्ता (घर, सोने, शेअर्स किंवा मुदत ठेव); यामुळे बँकेचा बुडीत कर्जाचा धोका टळतो."
    },
    "analogy": "Leaving your gold watch with a jeweler as a guaranteed pledge while you borrow cash for immediate travel expenses.",
    "indianExample": "Mortgaging commercial property or pledging ₹20 Lakh in mutual funds as collateral enables businesses to secure lower loan interest rates (9% vs 16%).",
    "rememberThis": {
      "English": "Ensure that the market value of your pledged collateral comfortably exceeds the loan amount to avoid lender margin calls during market corrections.",
      "Hindi": "जब भी संपत्ति गिरवी रखें, सुनिश्चित करें कि लोन चुकाने के बाद बैंक से 'No Objection Certificate' (NOC) और मूल दस्तावेज तुरंत वापस ले लें।",
      "Marathi": "कर्जाची पूर्ण परतफेड झाल्यावर बँकेकडून तात्काळ ना-हरकत प्रमाणपत्र (NOC) आणि मूळ कागदपत्रे ताब्यात घ्या."
    },
    "commonMistake": {
      "English": "Pledging essential emergency life savings or primary residential homes for highly speculative venture capital loans.",
      "Hindi": "सट्टेबाजी या अत्यधिक जोखिम वाले व्यवसाय के लिए अपने रहने के एकमात्र घर या आपातकालीन बचत को गिरवी रख देना।",
      "Marathi": "जोखमीच्या व्यवसायासाठी स्वतःचे राहते घर किंवा आणीबाणीचा फंड तारण ठेवण्याची मोठी घोडचूक करणे."
    },
    "mythStatement": {
      "English": "Lenders can legally confiscate and sell pledged collateral without issuing any formal legal default notice to the borrower.",
      "Hindi": "बैंक बिना कोई नोटिस दिए किसी भी दिन आपकी गिरवी रखी संपत्ति को सीधे जब्त करके बेच सकते हैं।",
      "Marathi": "बँक कोणतीही कायदेशीर नोटीस न देता तारण मालमत्ता एका रात्रीत विकू शकते असा गैरसमज."
    },
    "professionTracks": [
      "Startup Founders",
      "Civil Engineering & Builders",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=What+is+collateral+in+loans+India+English",
        "title": "Collateral and Mortgages in Secured Lending Explained",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Collateral+kya+hota+hai+Hindi",
        "title": "लोन में गारंटी और Collateral क्या होता है?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Taran+mhanje+kay+Marathi",
        "title": "तारण मालमत्ता (Collateral) म्हणजे काय? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "secured-loan",
    "term": "Secured Loan",
    "category": "Credit",
    "shortDef": {
      "English": "A credit facility backed by specific borrower assets (e.g. Home Loans, Gold Loans, Loans Against Securities) offering lower interest rates and higher sanction limits.",
      "Hindi": "ऐसी ऋण सुविधा जो उधारकर्ता की किसी संपत्ति (जैसे मकान, सोना, शेयर या कार) की गारंटी द्वारा सुरक्षित होती है, जिसमें कम ब्याज दर और अधिक ऋण सीमा मिलती है।",
      "Marathi": "एखाद्या मौल्यवान मालमत्तेच्या (घर, सोने, वाहन किंवा FD) तारणावर दिलेले सुरक्षित कर्ज; यात व्याजदर कमी असतो आणि जास्त मुदतीचे कर्ज मिळते."
    },
    "analogy": "Renting a luxury vehicle after leaving a substantial refundable security deposit with the rental agency.",
    "indianExample": "Home Loans and Gold Loans in India are prime secured loans; default allows the bank to invoke SARFAESI Act provisions to recover dues via auction.",
    "rememberThis": {
      "English": "Prefer secured loans over expensive personal loans for major capital expenditures because interest rates are typically 400–800 bps lower.",
      "Hindi": "बड़े खर्चों के लिए महंगे पर्सनल लोन के बजाय हमेशा सिक्योर्ड लोन (जैसे गोल्ड लोन या लोन अगेंस्ट सिक्योरिटीज) चुनें ताकि ब्याज दर बहुत कम लगे।",
      "Marathi": "मोठ्या खर्चासाठी महागड्या वैयक्तिक कर्जाऐवजी (Personal Loan) नेहमी सुरक्षित कर्ज निवडा, ज्यामुळे हजारो रुपयांचे व्याज वाचते."
    },
    "commonMistake": {
      "English": "Assuming that default on a secured loan only results in asset liquidation with zero adverse consequences for your personal CIBIL score.",
      "Hindi": "यह सोचना कि सिक्योर्ड लोन न चुकाने पर सिर्फ संपत्ति जब्त होगी और सिबिल स्कोर पर कोई बुरा असर नहीं पड़ेगा।",
      "Marathi": "सुरक्षित कर्ज थकवल्यास केवळ तारण मालमत्ता जाईल पण CIBIL स्कोअरवर परिणाम होणार नाही असा गैरसमज बाळगणे."
    },
    "mythStatement": {
      "English": "Secured loans never charge any loan processing fees, stamp duty charges, or documentation overheads.",
      "Hindi": "सिक्योर्ड लोन में बैंक कभी भी कोई प्रोसेसिंग फीस, स्टांप ड्यूटी या कानूनी सत्यापन शुल्क नहीं लेते।",
      "Marathi": "सुरक्षित कर्जावर बँक कधीही प्रक्रिया शुल्क किंवा मुद्रांक शुल्क आकारत नाही असा गैरसमज."
    },
    "professionTracks": [
      "Civil Engineering & Builders",
      "Salaried Employees",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Secured+loans+home+loan+gold+loan+explained+English",
        "title": "Secured Loans: Home Loans, Gold Loans & Mortgages",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Secured+loan+kya+hota+hai+Hindi",
        "title": "सिक्योर्ड लोन क्या है? फायदे और बैंक के नियम",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Surakshit+karj+marathi+guide",
        "title": "सुरक्षित कर्ज (Secured Loan) म्हणजे काय? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "unsecured-loan",
    "term": "Unsecured Loan",
    "category": "Credit",
    "shortDef": {
      "English": "A debt facility issued without requiring any collateral or underlying asset pledge, approved purely on the basis of income verification, credit score, and cash flows.",
      "Hindi": "बिना किसी संपत्ति को गिरवी रखे दिया जाने वाला ऋण (जैसे पर्सनल लोन, क्रेडिट कार्ड, कंज्यूमर ड्यूरेबल्स लोन), जो केवल आय और CIBIL स्कोर के आधार पर स्वीकृत होता है।",
      "Marathi": "कसलेही तारण न ठेवता केवळ उत्पन्न आणि CIBIL स्कोअरच्या विश्वासार्हतेवर दिलेले असुरक्षित कर्ज (उदा. पर्सनल लोन, क्रेडिट कार्ड कर्ज); याचा व्याजदर जास्त असतो."
    },
    "analogy": "A handshake emergency loan given by a trusted family physician based on your personal reputation and past character.",
    "indianExample": "Unsecured personal loans carry interest rates of 11% to 24% per annum, compared to 8.5% for secured housing finance.",
    "rememberThis": {
      "English": "Never borrow unsecured loans to fund discretionary lifestyle consumption, holidays, or speculative stock trading.",
      "Hindi": "छुट्टियां मनाने, महंगी शादियों या शेयर बाजार में ट्रेडिंग करने के लिए कभी भी 14%-20% ब्याज वाला अनसिक्योर्ड पर्सनल लोन न लें।",
      "Marathi": "मौजमजा, सुट्ट्या किंवा शेअर बाजारातील सट्टेबाजीसाठी कधीही महागडे पर्सनल लोन घेऊ नका, अन्यथा आर्थिक संकट ओढवेल."
    },
    "commonMistake": {
      "English": "Stacking multiple simultaneous unsecured instant app loans, triggering severe debt servicing distress and aggressive recovery harassment.",
      "Hindi": "सोशल मीडिया या ऐप्स से एक के बाद एक कई इंस्टेंट पर्सनल लोन लेना और फिर उनके भारी चक्रवाढ ब्याज के जाल में फंस जाना।",
      "Marathi": "मोबाईल ॲप्सवरून एकाच वेळी अनेक छोटी वैयक्तिक कर्जे घेणे आणि नंतर त्यांच्या जाचक व्याजदरात अडकणे."
    },
    "mythStatement": {
      "English": "Unsecured loans are totally immune from civil court recovery decrees or legal arbitration under Indian law.",
      "Hindi": "अनसिक्योर्ड लोन न चुकाने पर बैंक अदालत में कोई कानूनी कार्रवाई या मध्यस्थता नहीं कर सकते।",
      "Marathi": "असुरक्षित कर्ज न फेडल्यास बँक कायदेशीर कारवाई करू शकत नाही असा चुकीचा समज बाळगणे."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Secured+vs+Unsecured+loans+explained+India+English",
        "title": "Secured vs Unsecured Loans: Key Differences",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Personal+loan+unsecured+loan+Hindi+video",
        "title": "पर्सनल लोन का सच: क्या अनसिक्योर्ड लोन लेना चाहिए?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Asurakshit+karj+marathi",
        "title": "असुरक्षित कर्ज म्हणजे काय? धोके आणि सावधगिरी मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "loan-to-value",
    "term": "Loan-to-Value Ratio (LTV)",
    "category": "Credit",
    "shortDef": {
      "English": "A lending risk assessment ratio expressing the percentage of an asset's appraised market value that a bank will finance via debt versus borrower down payment.",
      "Hindi": "ऋण जोखिम मूल्यांकन अनुपात जो यह दर्शाता है कि किसी संपत्ति के कुल मूल्यांकित बाजार मूल्य का कितने प्रतिशत बैंक लोन के रूप में देगा और कितना डाउन पेमेंट करना होगा।",
      "Marathi": "तारण मालमत्तेच्या एकूण बाजार मूल्यापैकी किती टक्के रक्कम बँक कर्ज म्हणून मंजूर करू शकते हे दर्शवणारे गुणोत्तर (LTV Ratio); उर्वरित रक्कम डाऊन पेमेंट म्हणून द्यावी लागते."
    },
    "analogy": "The maximum load a cargo ship can safely carry relative to its total buoyant displacement capacity.",
    "indianExample": "RBI caps Housing Loan LTV at 90% for loans up to ₹30 Lakh, 80% for loans between ₹30L–₹75L, and 75% for loans exceeding ₹75 Lakh.",
    "rememberThis": {
      "English": "Put down a higher personal down payment (e.g. 25%–30%) to reduce your LTV ratio; lower LTV grants access to lower interest tiers and lower total interest burden.",
      "Hindi": "घर खरीदते समय कम से कम 20%-25% डाउन पेमेंट अपनी जेब से करें ताकि LTV अनुपात कम रहे और बैंक आपको सबसे कम ब्याज दर की पेशकश करे।",
      "Marathi": "घर घेताना स्वतःचे डाऊन पेमेंट जास्त करा, ज्यामुळे LTV कमी राहून बँकेकडून कमी व्याजदराचा लाभ मिळतो."
    },
    "commonMistake": {
      "English": "Taking supplementary unsecured personal loans at 15% interest to fund the mandatory 20% down payment required on an 80% LTV home loan.",
      "Hindi": "होम लोन के डाउन पेमेंट का प्रबंध करने के लिए भी महंगा पर्सनल लोन ले लेना, जिससे दोनों किस्तों का भार असहनीय हो जाए।",
      "Marathi": "डाऊन पेमेंट भरण्यासाठीही आणखी एक वैयक्तिक कर्ज काढून दुहेरी हप्त्यांच्या ओझ्याखाली दबणे."
    },
    "mythStatement": {
      "English": "Banks in India are authorized by RBI to grant 100% LTV financing covering full property cost plus registration stamp duty.",
      "Hindi": "आरबीआई बैंकों को संपत्ति की 100% लागत और रजिस्ट्री शुल्क का पूरा लोन देने की अनुमति देता है।",
      "Marathi": "बँका घराच्या संपूर्ण किमतीवर आणि नोंदणी शुल्कावर १००% कर्ज देतात असा गैरसमज."
    },
    "professionTracks": [
      "Civil Engineering & Builders",
      "Salaried Employees",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Loan+to+value+ratio+LTV+home+loans+English",
        "title": "Loan to Value (LTV) Ratio in Home Loans Explained",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=LTV+kya+hota+hai+home+loan+Hindi",
        "title": "LTV क्या है? होम लोन में डाउन पेमेंट के RBI नियम",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=LTV+ratio+marathi+mahiti",
        "title": "LTV रेशो म्हणजे काय? गृहकर्जाचे नियम मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "debt-to-income",
    "term": "Debt-to-Income Ratio (DTI)",
    "category": "Credit",
    "shortDef": {
      "English": "A personal finance metric comparing total monthly debt obligations (EMIs) to gross monthly income, used by underwriters to measure repayment bandwidth.",
      "Hindi": "व्यक्तिगत वित्तीय अनुपात जो कुल मासिक ऋण देनदारियों (सभी EMI) की तुलना सकल मासिक आय से करता है, जिससे बैंक ऋण चुकाने की क्षमता मापते हैं।",
      "Marathi": "एकूण मासिक कर्जाचे हप्ते (EMI) आणि एकूण मासिक उत्पन्न यांचे गुणोत्तर (DTI Ratio); यावरून बँक कर्जदाराची परतफेड क्षमता तपासते."
    },
    "analogy": "The fraction of a steam engine's boiler pressure dedicated to climbing an incline versus maintaining cabin heat.",
    "indianExample": "If your monthly take-home is ₹1,00,000 and total active EMIs are ₹35,000, your Debt-to-Income (DTI) ratio is exactly 35%.",
    "rememberThis": {
      "English": "Target a DTI ratio strictly below 35%–40%; a DTI exceeding 50% triggers loan rejection or punitive interest loading across Indian banks.",
      "Hindi": "सुनिश्चित करें कि आपकी सभी EMI आपकी मासिक आय के 35%-40% से अधिक न हों; 50% से अधिक DTI होने पर बैंक नए लोन रिजेक्ट कर देते हैं।",
      "Marathi": "आपले सर्व मासिक हप्ते उत्पन्नाच्या ३५% ते ४०% च्या आतच मर्यादित ठेवा; DTI ५०% पेक्षा जास्त झाल्यास बँका नवीन कर्ज नाकारतात."
    },
    "commonMistake": {
      "English": "Taking new automobile and gadget EMIs right before applying for a primary home loan, artificially inflating your DTI ratio and reducing eligibility.",
      "Hindi": "होम लोन के लिए आवेदन करने से ठीक पहले नई कार या महंगे फोन की EMI शुरू कर देना, जिससे होम लोन की पात्रता घट जाती है।",
      "Marathi": "गृहकर्जासाठी अर्ज करण्यापूर्वी नवीन महागड्या वस्तूंचे हप्ते सुरू करून स्वतःची कर्ज पात्रता कमी करून घेणे."
    },
    "mythStatement": {
      "English": "Banks do not factor in existing active credit card debt balances when evaluating your Debt-to-Income eligibility.",
      "Hindi": "बैंक DTI अनुपात की गणना करते समय आपके मौजूदा क्रेडिट कार्ड बकाये को पूरी तरह अनदेखा कर देते हैं।",
      "Marathi": "DTI मोजताना बँका क्रेडिट कार्डच्या थकीत बिलांचा विचार करत नाहीत असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Debt+to+income+ratio+DTI+explained+English",
        "title": "Debt-to-Income (DTI) Ratio and Loan Eligibility",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=DTI+ratio+kya+hai+Hindi",
        "title": "Debt to Income Ratio क्या है? लोन रिजेक्ट होने से बचाएं",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=DTI+gunottar+marathi",
        "title": "कर्ज आणि उत्पन्नाचे प्रमाण (DTI) मराठी मार्गदर्शन",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "credit-utilization",
    "term": "Credit Utilization Ratio (CUR)",
    "category": "Credit",
    "shortDef": {
      "English": "The proportion of revolving credit currently utilized compared to the aggregate sanctioned credit limit across all credit cards, expressed as a percentage.",
      "Hindi": "सभी क्रेडिट कार्डों पर स्वीकृत कुल क्रेडिट सीमा की तुलना में वर्तमान में उपयोग किए गए क्रेडिट का प्रतिशत अनुपात।",
      "Marathi": "क्रेडिट कार्डवर मिळालेल्या एकूण पत मर्यादेच्या तुलनेत प्रत्यक्ष वापरलेल्या रकमेचे प्रमाण (टक्केवारीत); हे CIBIL स्कोअरसाठी अत्यंत महत्त्वाचे असते."
    },
    "analogy": "The fluid level inside a fuel tank: utilizing 95% indicates an overstressed engine running on fumes.",
    "indianExample": "If your combined credit card limit is ₹2,00,000 and your current statement balance is ₹50,000, your Credit Utilization Ratio is 25%.",
    "rememberThis": {
      "English": "Keep your aggregate Credit Utilization Ratio consistently below 30% of sanctioned limits to achieve and sustain a 780+ CIBIL score.",
      "Hindi": "अपने क्रेडिट कार्ड की कुल लिमिट का 30% से कम ही खर्च करें; 30% से अधिक उपयोग करने पर सिबिल स्कोर में गिरावट आती है।",
      "Marathi": "क्रेडिट कार्डच्या एकूण मर्यादेपैकी ३०% पेक्षा कमीच वापर करा, ज्यामुळे CIBIL स्कोअर वेगाने सुधारतो आणि ७८० च्या वर राहतो."
    },
    "commonMistake": {
      "English": "Maxing out 90%–100% of your credit card limit each month under the mistaken belief that high usage demonstrates active creditworthiness.",
      "Hindi": "हर महीने कार्ड की पूरी 90%-100% लिमिट खर्च करना यह सोचकर कि इससे बैंक खुश होंगे, जबकि इससे आप 'क्रेडिट हंग्री' घोषित हो जाते हैं।",
      "Marathi": "दरमहा १००% मर्यादा वापरल्यास बँक खुश होईल असा चुकीचा समज बाळगणे; यामुळे पत ब्युरो तुम्हाला जोखमीचे ग्राहक मानतात."
    },
    "mythStatement": {
      "English": "Keeping your Credit Utilization at exactly 0% by never using your card for 3 years builds the highest possible credit score.",
      "Hindi": "कार्ड का बिल्कुल इस्तेमाल न करके 0% उपयोगिता रखने से सबसे बेहतरीन सिबिल स्कोर बनता है।",
      "Marathi": "क्रेडिट कार्डचा अजिबात वापर न केल्यास सर्वोत्तम CIBIL स्कोअर मिळतो असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+utilization+ratio+explained+CIBIL+English",
        "title": "How Credit Utilization Ratio Affects Your CIBIL Score",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+utilization+ratio+Hindi+video",
        "title": "Credit Utilization Ratio 30% क्यों होना चाहिए?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+vapar+gunottar+marathi",
        "title": "क्रेडिट युटिलायझेशन रेशो म्हणजे काय? मराठी माहिती",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "minimum-due",
    "term": "Minimum Due (Credit Card Trap)",
    "category": "Credit",
    "shortDef": {
      "English": "The nominal token payment (typically 5% of statement balance) required by card issuers to prevent default reporting while billing exorbitant compound interest on remainder.",
      "Hindi": "क्रेडिट कार्ड कंपनियों द्वारा मांगा जाने वाला न्यूनतम टोकन भुगतान (आमतौर पर बिल का 5%), जो केवल लेट फीस से बचाता है लेकिन बाकी 95% पर 42% का भारी ब्याज लगाता है।",
      "Marathi": "क्रेडिट कार्ड कंपनीने मागितलेली किमान नाममात्र रक्कम (साधारणपणे ५%); ही भरल्यास केवळ दंड टळतो पण उर्वरित ९५% रकमेवर दरमहा जाचक चक्रवाढ व्याज सुरू राहते."
    },
    "analogy": "Throwing a single life-buoy to keep your head above water while a submarine anchor drags your feet into deep financial ocean debt.",
    "indianExample": "Paying only the ₹2,500 minimum due on a ₹50,000 credit card bill leaves ₹47,500 accruing ~3.5% monthly compound interest plus 18% GST on interest charges.",
    "rememberThis": {
      "English": "Always pay the 'Total Amount Due' in full before the billing due date; setting up bank auto-debit for total dues eliminates interest forever.",
      "Hindi": "हमेशा 'Total Amount Due' (कुल देय राशि) का पूरा भुगतान करें; केवल 'Minimum Amount Due' भरना कर्ज के कभी न खत्म होने वाले दलदल में फंसना है।",
      "Marathi": "नेहमी 'Total Amount Due' ची पूर्ण रक्कमच भरा; केवळ 'Minimum Due' भरत राहिल्यास आयुष्यभर कर्जाच्या विळख्यात अडकून राहाल."
    },
    "commonMistake": {
      "English": "Assuming that paying the Minimum Amount Due pauses interest accumulation on your remaining credit card purchases.",
      "Hindi": "यह मान लेना कि मिनिमम ड्यू भरने के बाद बाकी बचे पैसे पर कोई ब्याज नहीं लगेगा और वह ब्याज-मुक्त रहेगा।",
      "Marathi": "किमान देय रक्कम भरल्यावर उर्वरित रकमेवर व्याज लागत नाही असा गोड गैरसमज बाळगणे."
    },
    "mythStatement": {
      "English": "Minimum Amount Due payments contribute directly toward rapid principal reduction of your credit card balance.",
      "Hindi": "मिनिमम ड्यू भरने से आपके कार्ड का मूल बकाया कर्ज बहुत तेजी से कम होता है।",
      "Marathi": "किमान देय रक्कम भरल्याने मूळ कर्ज वेगाने फिटते असा खोटा समज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Credit+card+minimum+amount+due+trap+English",
        "title": "The Minimum Amount Due Trap: How Banks Profit",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Minimum+amount+due+kya+hota+hai+Hindi",
        "title": "क्रेडिट कार्ड का Minimum Due कभी मत भरना! पूरा सच",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Minimum+due+trap+marathi",
        "title": "क्रेडिट कार्ड मिनिमम ड्यूचा धोका मराठी माहिती",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "apr",
    "term": "APR (Annual Percentage Rate)",
    "category": "Credit",
    "shortDef": {
      "English": "The comprehensive annualized cost of credit reflecting the nominal interest rate along with processing fees, administrative charges, and mandatory insurance premiums.",
      "Hindi": "ऋण की वास्तविक व्यापक वार्षिक लागत, जिसमें बैंक की नाममात्र ब्याज दर के अलावा प्रोसेसिंग फीस, दस्तावेजीकरण शुल्क और अनिवार्य बीमा लागतें भी शामिल होती हैं।",
      "Marathi": "कर्जाचा खरा सर्वसमावेशक वार्षिक खर्च (APR); यात बँकेच्या व्याजदराव्यतिरिक्त प्रक्रिया शुल्क, विमा आणि इतर सर्व छुपे खर्च एकत्र मोजले जातात."
    },
    "analogy": "The total on-road price of a motor vehicle including road tax, insurance, and registration—not just the ex-showroom factory sticker price.",
    "indianExample": "A 12% personal loan with a 3% upfront processing fee and mandatory credit life cover actually has a true effective APR of ~15.2%.",
    "rememberThis": {
      "English": "Always compare retail loans by APR rather than headline interest rates to detect hidden loan origination and processing fees.",
      "Hindi": "हमेशा विभिन्न बैंकों के लोनों की तुलना APR (वार्षिक प्रतिशत दर) के आधार पर करें ताकि छिपे हुए प्रोसेसिंग और इंश्योरेंस शुल्क सामने आ सकें।",
      "Marathi": "कर्जांची तुलना करताना केवळ व्याजदर न पाहता APR तपासा, जेणेकरून बँकेचे छुपे खर्च आणि प्रक्रिया शुल्क लक्षात येईल."
    },
    "commonMistake": {
      "English": "Comparing loan offers solely on headline nominal interest rates while ignoring massive 3%–5% upfront processing and documentation fee deductions.",
      "Hindi": "केवल कम ब्याज दर देखकर लोन ले लेना और यह न देखना कि बैंक ने लोन राशि से 5% प्रोसेसिंग फीस पहले ही काट ली है।",
      "Marathi": "केवळ वरवरचा व्याजदर पाहून भुलणे आणि बँकेने घेतलेल्या ५% छुपे प्रक्रिया शुल्काकडे दुर्लक्ष करणे."
    },
    "mythStatement": {
      "English": "The nominal advertised interest rate and true APR are legally mandated to be 100% identical on all consumer lending products.",
      "Hindi": "विज्ञापन में दिखाया गया ब्याज दर और वास्तविक APR सभी लोनों में हमेशा बिल्कुल एक समान होना अनिवार्य है।",
      "Marathi": "जाहिरातीतील व्याजदर आणि प्रत्यक्ष APR हे दोन्ही नेहमी एकसारखेच असतात असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Startup Founders",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=APR+vs+interest+rate+explained+India+English",
        "title": "Annual Percentage Rate (APR) vs Interest Rate Explained",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=APR+kya+hota+hai+loan+Hindi",
        "title": "APR क्या है? लोन के छिपे हुए खर्चे कैसे पहचानें",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=APR+vyajdar+marathi",
        "title": "APR म्हणजे काय? कर्जाचे छुपे खर्च मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "inflation",
    "term": "Inflation",
    "category": "Basics",
    "shortDef": {
      "English": "The persistent, generalized erosion of currency purchasing power over time, requiring progressively more money to acquire an identical basket of goods and services.",
      "Hindi": "समय के साथ मुद्रा की क्रय शक्ति में होने वाली निरंतर गिरावट, जिसके कारण समान वस्तुओं और सेवाओं को खरीदने के लिए लगातार अधिक धन खर्च करना पड़ता है।",
      "Marathi": "काळानुरूप पैशांच्या खरेदी क्षमतेमध्ये होणारी घट (महागाई); यामुळे त्याच वस्तू आणि सेवा खरेदी करण्यासाठी कालांतराने जास्त पैसे मोजावे लागतात."
    },
    "analogy": "An invisible leakage from your wallet that slowly drains a fraction of your liquid currency's real value every single year.",
    "indianExample": "In India, consumer inflation historically averages 5%–7% annually; an item costing ₹100 today will cost approximately ₹200 in 12–14 years.",
    "rememberThis": {
      "English": "Invest your long-term savings in equity and inflation-hedged assets yielding higher than 10% CAGR to ensure positive real purchasing power growth.",
      "Hindi": "अपनी दीर्घकालिक बचत को ऐसे साधनों (जैसे इक्विटी म्यूचुअल फंड) में निवेश करें जो 6% मुद्रास्फीति से अधिक 12%-14% रिटर्न देकर आपके पैसे की क्रय शक्ति बढ़ाएं।",
      "Marathi": "दीर्घकालीन बचत नेहमी इक्विटी आणि म्युच्युअल फंडात गुंतवा, जेणेकरून महागाईच्या दरापेक्षा (६%) जास्त परतावा मिळून खरी संपत्ती वाढेल."
    },
    "commonMistake": {
      "English": "Leaving large surplus cash idle in a 2.7% savings bank account under the mistaken belief that money is 100% safe from capital loss.",
      "Hindi": "बचत खाते में लाखों रुपये पड़े रहने देना यह सोचकर कि पैसा पूरी तरह सुरक्षित है, जबकि 6% की महंगाई हर साल उसकी वास्तविक कीमत घटा रही होती है।",
      "Marathi": "बँकेच्या बचत खात्यात लाखो रुपये पडून ठेवणे; महागाईमुळे दरवर्षी त्या पैशांचे खरे मूल्य कमी होत असते."
    },
    "mythStatement": {
      "English": "Keeping physical cash locked inside a household iron safe completely preserves its full economic value forever.",
      "Hindi": "तिजोरी में बंद नकद रुपया 20 साल बाद भी अपनी पूरी क्रय शक्ति और मूल्य को 100% सुरक्षित रखता है।",
      "Marathi": "घरातील तिजोरीत रोख पैसे ठेवल्यास त्याचे मूल्य आयुष्यभर तसेच टिकून राहते असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Inflation+explained+simply+purchasing+power+English",
        "title": "Inflation: The Silent Wealth Destroyer Explained",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Inflation+kya+hota+hai+Hindi+video",
        "title": "महंगाई (Inflation) क्या है और आपके पैसे को कैसे खाती है?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Mahagai+inflation+marathi",
        "title": "महागाई म्हणजे काय? पैशांची किंमत कशी घसरते? मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "emergency-fund",
    "term": "Emergency Fund",
    "category": "Basics",
    "shortDef": {
      "English": "A segregated reserve of 3 to 6 months of mandatory living expenses parked in liquid, risk-free assets to buffer against unforeseen medical emergencies or job loss.",
      "Hindi": "अप्रत्याशित आपात स्थितियों (जैसे नौकरी छूटना, चिकित्सा आपातकाल) से निपटने के लिए 3 से 6 महीने के अनिवार्य जीवन-यापन खर्च का तरल और सुरक्षित संपत्तियों में अलग रखा गया फंड।",
      "Marathi": "अचानक उद्भवणाऱ्या संकटांसाठी (नोकरी जाणे, वैद्यकीय खर्च) ३ ते ६ महिन्यांच्या अनिवार्य घरखर्चाएवढा सुरक्षित आणि तत्काळ उपलब्ध असणारा राखीव निधी (Emergency Fund)."
    },
    "analogy": "A durable emergency spare tire stored in the automobile trunk: unnoticed during smooth highway cruising, but indispensable during sudden punctures.",
    "indianExample": "If your mandatory household expenses are ₹40,000 monthly, your emergency fund should be between ₹1,20,000 and ₹2,40,000 in sweep-in FDs and liquid funds.",
    "rememberThis": {
      "English": "Keep your emergency fund strictly separate from speculative equity accounts, housing down payments, and discretionary vacation budgets.",
      "Hindi": "इमरजेंसी फंड को कभी भी शेयर बाजार या क्रिप्टोकरेंसी में न लगाएं; इसे हमेशा लिक्विड म्यूचुअल फंड या बैंक स्वीप-इन FD में रखें।",
      "Marathi": "आपत्कालीन निधी कधीही शेअर बाजारात किंवा जोखमीच्या साधनांमध्ये गुंतवू नका; तो लिक्विड फंड किंवा बँकेत तत्काळ काढता येईल असाच ठेवा."
    },
    "commonMistake": {
      "English": "Investing your entire liquid emergency reserve into volatile small-cap stocks or illiquid lock-in real estate plots.",
      "Hindi": "आपातकालीन फंड के पैसों से स्मॉल-कैप शेयर खरीदना और फिर अस्पताल के बिल के समय शेयर बाजार क्रैश होने पर भारी नुकसान में बेचना।",
      "Marathi": "आणीबाणीच्या निधीतून शेअर बाजारात सट्टेबाजी करणे आणि संकट आल्यावर तोट्यात शेअर्स विकण्याची वेळ येणे."
    },
    "mythStatement": {
      "English": "Having a high credit card limit is a 100% adequate replacement for maintaining a dedicated cash emergency buffer.",
      "Hindi": "क्रेडिट कार्ड की बड़ी लिमिट होने पर अलग से कैश इमरजेंसी फंड रखने की कोई आवश्यकता नहीं है।",
      "Marathi": "क्रेडिट कार्डची मोठी मर्यादा असल्यामुळे स्वतंत्र आणीबाणी निधीची काहीही गरज नाही असा गैरसमज बाळगणे."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Freelancers & Creators",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "videoId": "80t0oFqZqC8",
        "searchFallback": "https://www.youtube.com/results?search_query=Emergency+fund+how+much+where+to+keep+English",
        "title": "Emergency Fund Rule: Where & How Much to Save",
        "channel": "CA Rachana Phadke Ranade"
      },
      "Hindi": {
        "videoId": "7qTmg1k7wGg",
        "searchFallback": "https://www.youtube.com/results?search_query=Emergency+fund+kaise+banaye+Hindi",
        "title": "इमरजेंसी फंड कैसे और कहाँ बनाएं? पूरा नियम",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "videoId": "80t0oFqZqC8",
        "searchFallback": "https://www.youtube.com/results?search_query=Apatkalin+nidhi+emergency+fund+marathi",
        "title": "आपत्कालीन निधी (Emergency Fund) कसा तयार करावा? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "budgeting",
    "term": "Budgeting (50/30/20 Rule)",
    "category": "Basics",
    "shortDef": {
      "English": "A proactive cash-flow governance blueprint allocating net income across Needs (50%), Discretionary Wants (30%), and Future Savings/Investments (20%).",
      "Hindi": "शुद्ध आय को पूर्व-निर्धारित अनुपात में विभाजित करने की वित्तीय योजना, जिसमें 50% आवश्यकताओं (Needs), 30% इच्छाओं (Wants) और 20% बचत व निवेश में लगाया जाता है।",
      "Marathi": "मिळणाऱ्या उत्पन्नाचे शिस्तबद्ध विभाजन करणारी आर्थिक नियमावली (50/30/20 नियम); यात ५०% मूलभूत गरजांवर, ३०% ऐच्छिक खर्चावर आणि किमान २०% बचत व गुंतवणुकीसाठी ठेवले जातात."
    },
    "analogy": "A civil engineering master blueprint ensuring balanced water distribution across municipal drinking reservoirs, commerce, and agricultural storage.",
    "indianExample": "On a ₹60,000 monthly take-home salary, allocate ₹30,000 for rent, groceries & bills (Needs), ₹18,000 for dining & entertainment (Wants), and ₹12,000 for SIPs (Savings).",
    "rememberThis": {
      "English": "Automate your 20% savings SIP on the immediate next day of salary credit; saving what is left after spending guarantees zero savings.",
      "Hindi": "पगार आते ही अगले दिन 20% निवेश ऑटो-डेबिट करें; 'खर्च करने के बाद जो बचेगा वो बचाएंगे' यह रणनीति कभी सफल नहीं होती।",
      "Marathi": "पगार झाल्यावर दुसऱ्याच दिवशी २०% रक्कम गुंतवणुकीसाठी स्वयंचलित वळती करा; 'खर्च करून उरलेले वाचवू' या सवयीने कधीही बचत होत नाही."
    },
    "commonMistake": {
      "English": "Treating discretionary lifestyle luxuries (frequent high-end dining, latest smartphone upgrades) as mandatory essential 'Needs'.",
      "Hindi": "हर साल नया स्मार्टफोन खरीदना या वीकेंड पार्टियों को अनिवार्य 'ज़रूरत' (Need) मानकर 50% के बजट में शामिल कर लेना।",
      "Marathi": "नवीन महागडा मोबाईल किंवा अनावश्यक पार्टीच्या खर्चाला मूलभूत 'गरज' मानून बजेट बिघडवणे."
    },
    "mythStatement": {
      "English": "Budgeting requires microscopic pen-and-paper tracking of every single ₹10 tea expenditure to be effective.",
      "Hindi": "बजट बनाने के लिए हर दिन ₹10 की चाय और पान के खर्च को डायरी में लिखना अनिवार्य है।",
      "Marathi": "बजेट यशस्वी होण्यासाठी रोजच्या १० रुपयांच्या चहाचाही हिशोब लिहून ठेवणे बंधनकारक असते असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=50+30+20+budgeting+rule+explained+English",
        "title": "The 50/30/20 Budgeting Rule for Beginners",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Budgeting+kaise+kare+50+30+20+Hindi",
        "title": "50-30-20 नियम: सैलरी मैनेज करने का सबसे आसान तरीका",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Budgeting+niyam+marathi",
        "title": "घरखर्च आणि बचतीचे 50/30/20 बजेटिंग सूत्र मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "assets",
    "term": "Assets (Productive vs Depreciating)",
    "category": "Basics",
    "shortDef": {
      "English": "Economic resources owned by an individual or enterprise that generate recurring cash inflows or appreciate in capital value over time.",
      "Hindi": "व्यक्ति या व्यवसाय के स्वामित्व वाले वे आर्थिक संसाधन जो भविष्य में नकद आय उत्पन्न करते हैं या जिनके पूंजीगत मूल्य में समय के साथ वृद्धि होती है।",
      "Marathi": "व्यक्ती किंवा व्यवसायाच्या मालकीची अशी आर्थिक मालमत्ता जी भविष्यात रोख उत्पन्न मिळवून देते किंवा तिच्या मूल्यात काळानुरूप वाढ होते."
    },
    "analogy": "Fruit-bearing mango trees that produce seasonal sweet harvests year after year while growing larger and stronger.",
    "indianExample": "Productive assets include dividend-paying shares, rental real estate, and government bonds; depreciating consumer assets include personal cars and electronics.",
    "rememberThis": {
      "English": "Prioritize accumulating productive, income-generating assets during your twenties and thirties rather than purchasing depreciating status symbols.",
      "Hindi": "अपने 20 और 30 के दशक में ऐसे साधन (शेयर, म्यूचुअल फंड, जमीन) खरीदें जो पैसा कमाकर दें, न कि ऐसे सामान जो खरीदते ही अपनी कीमत खो दें।",
      "Marathi": "तारुण्यात दिखाऊ वस्तूंवर खर्च करण्याऐवजी उत्पन्न देणारी खरी मालमत्ता (शेअर्स, म्युच्युअल फंड, स्थावर मालमत्ता) जमा करण्यावर भर द्या."
    },
    "commonMistake": {
      "English": "Classifying a depreciating private personal automobile bought on a 7-year auto loan as a primary wealth-building asset.",
      "Hindi": "बैंक लोन पर खरीदी गई निजी कार को अपनी बड़ी 'संपत्ति' मानना, जबकि वह हर साल अपनी 15% कीमत खो देती है और पेट्रोल का खर्च मांगती है।",
      "Marathi": "कर्ज काढून घेतलेल्या खाजगी कारला मोठी संपत्ती मानणे, प्रत्यक्षात तिची किंमत दरवर्षी कमी होते आणि देखभाल खर्च वाढतो."
    },
    "mythStatement": {
      "English": "All physical possessions owned inside a residential household are legally classified as high-yield financial assets.",
      "Hindi": "घर में रखा हर सोफा, टीवी और कपड़ा बैंक द्वारा उच्च-उपज वित्तीय संपत्ति के रूप में वर्गीकृत किया जाता है।",
      "Marathi": "घरातील सर्व शोभेच्या वस्तू ही उच्च परतावा देणारी आर्थिक मालमत्ता असते असा चुकीचा समज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Startup Founders"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Assets+vs+liabilities+Robert+Kiyosaki+explained+English",
        "title": "Assets vs Liabilities: Real Wealth Creation",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Asset+kya+hota+hai+Hindi",
        "title": "Asset vs Liability क्या है? अमीर और गरीब की सोच का अंतर",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Malamatta+ani+dayitva+marathi",
        "title": "मालमत्ता (Assets) आणि देणी (Liabilities) यातील फरक मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "liabilities",
    "term": "Liabilities (Good Debt vs Bad Debt)",
    "category": "Basics",
    "shortDef": {
      "English": "Financial debts, contractual obligations, or claims against an entity that require future outflows of economic benefits to settle.",
      "Hindi": "वित्तीय दायित्व या ऋण जो किसी व्यक्ति या व्यवसाय को भविष्य में नकद या अन्य संपत्तियों के रूप में किसी तीसरे पक्ष को चुकाने होते हैं।",
      "Marathi": "एखाद्या व्यक्तीने किंवा व्यवसायाने कायदेशीररीत्या फेडावयाची कर्जे किंवा देणी; यात भविष्यात रोख रक्कम अथवा मालमत्ता द्यावी लागते."
    },
    "analogy": "A continuous drain pipe steadily channeling water out of your personal storage cistern until the valve is shut.",
    "indianExample": "Good liabilities (e.g. low-interest home loans, educational loans) build long-term value; bad liabilities (e.g. 42% credit card debt, personal loans for vacations) destroy wealth.",
    "rememberThis": {
      "English": "Aggressively eliminate toxic high-interest consumer liabilities before deploying surplus funds into aggressive equity market bets.",
      "Hindi": "शेयर बाजार में निवेश करने से पहले अपने सभी 15%-40% ब्याज वाले पर्सनल लोन और क्रेडिट कार्ड बकाये को पूरी तरह समाप्त करें।",
      "Marathi": "शेअर बाजारात मोठी गुंतवणूक करण्यापूर्वी सर्व महागडी वैयक्तिक कर्जे आणि क्रेडिट कार्डची देणी पूर्ण फेडून टाका."
    },
    "commonMistake": {
      "English": "Financing depreciating consumer gadgets and luxury lifestyle celebrations through unhedged high-interest revolving credit.",
      "Hindi": "महंगे मोबाइल या शादियों के लिए भारी ब्याज पर कर्ज लेना जो भविष्य की कई वर्षों की कमाई को गिरवी रख देता है।",
      "Marathi": "चैनीच्या वस्तूंसाठी महागडे कर्ज काढणे आणि भविष्यातील कमाई आधीच गहाण टाकणे."
    },
    "mythStatement": {
      "English": "All forms of debt and borrowing are equally evil and must never be utilized under any business circumstance.",
      "Hindi": "हर प्रकार का लोन और उधार बुरा होता है और किसी भी स्थिति में व्यवसाय के लिए कभी भी बैंक से कर्ज नहीं लेना चाहिए।",
      "Marathi": "सर्व प्रकारची कर्जे वाईट असतात आणि व्यवसायासाठीही बँकेकडून कधीच कर्ज घेऊ नये असा टोकाचा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=Good+debt+vs+bad+debt+explained+India+English",
        "title": "Good Debt vs Bad Debt: Strategic Borrowing",
        "channel": "Zerodha Varsity"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Good+debt+aur+bad+debt+me+antar+Hindi",
        "title": "अच्छा कर्ज बनाम बुरा कर्ज: कैसे समझें?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Changle+karj+vait+karj+marathi",
        "title": "चांगले कर्ज आणि वाईट कर्ज यातील फरक मराठी",
        "channel": "Groww Marathi"
      }
    }
  },
  {
    "id": "net-worth",
    "term": "Net Worth",
    "category": "Basics",
    "shortDef": {
      "English": "The definitive mathematical measure of individual or institutional financial standing, calculated as Total Assets minus Total Liabilities.",
      "Hindi": "किसी व्यक्ति या संस्था की वास्तविक वित्तीय स्थिति का अंतिम गणितीय माप, जिसकी गणना कुल संपत्तियों में से कुल देनदारियों (कर्जों) को घटाकर की जाती है।",
      "Marathi": "एखाद्या व्यक्तीच्या किंवा संस्थेच्या खऱ्या संपत्तीचे अंतिम मोजमाप (Net Worth); एकूण मालमत्तेमधून (Assets) सर्व कर्जे (Liabilities) वजा करून हे काढले जाते."
    },
    "analogy": "The net dry weight of a loaded cargo vessel after subtracting the mass of the ballast water and heavy ship machinery.",
    "indianExample": "Formula: Net Worth = Total Assets (cash, investments, real estate, gold) − Total Liabilities (home loan, auto loan, credit dues).",
    "rememberThis": {
      "English": "Calculate your Net Worth annually on March 31; tracking your Net Worth trajectory provides the truest signal of financial independence progress.",
      "Hindi": "हर साल 31 मार्च को अपना वास्तविक नेट वर्थ कैलकुलेट करें; जीवनशैली के दिखावे के बजाय नेट वर्थ की वृद्धि ही असली वित्तीय स्वतंत्रता है।",
      "Marathi": "दरवर्षी ३१ मार्चला आपली खरी निव्वळ संपत्ती (Net Worth) मोजा; केवळ वरवरच्या पगारापेक्षा निव्वळ संपत्तीत होणारी वाढ हीच खरी प्रगती असते."
    },
    "commonMistake": {
      "English": "Confusing monthly salary income with net worth; earning ₹25 LPA while carrying ₹30 Lakh in bad consumer debt results in negative real net worth.",
      "Hindi": "बड़ी सैलरी को बड़ा नेट वर्थ समझ लेना; यदि आपकी सैलरी 2 लाख है लेकिन सिर पर 25 लाख का पर्सनल लोन है, तो आपकी नेटवर्थ नकारात्मक हो सकती है।",
      "Marathi": "मोठा मासिक पगार म्हणजे मोठी संपत्ती असा गैरसमज बाळगणे; डोक्यावर कर्जाचा डोंगर असल्यास निव्वळ संपत्ती उणे (Negative) असू शकते."
    },
    "mythStatement": {
      "English": "Having a negative net worth in your early twenties means you are permanently disqualified from achieving future financial independence.",
      "Hindi": "यदि 22 साल की उम्र में शिक्षा ऋण के कारण आपकी नेटवर्थ नकारात्मक है, तो आप कभी अमीर नहीं बन सकते।",
      "Marathi": "तारुण्यात शैक्षणिक कर्जामुळे संपत्ती उणे असल्यास भविष्यात कधीही आर्थिक यश मिळणार नाही असा गैरसमज."
    },
    "professionTracks": [
      "Students & Freshers",
      "Salaried Employees",
      "Startup Founders",
      "Freelancers & Creators"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=How+to+calculate+net+worth+formula+English",
        "title": "How to Calculate Your Real Net Worth",
        "channel": "ClearTax"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Net+worth+kaise+calculate+kare+Hindi",
        "title": "Net Worth क्या है और इसे कैसे बढ़ाएं?",
        "channel": "Labor Law Advisor"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Net+worth+marathi+video",
        "title": "नेट वर्थ म्हणजे काय? स्वतःची संपत्ती कशी मोजावी? मराठी",
        "channel": "CA Rachana Ranade Marathi"
      }
    }
  },
  {
    "id": "inflation-rate",
    "term": "Inflation Rate & CPI Metrics",
    "category": "Basics",
    "shortDef": {
      "English": "The statutory statistical percentage pace at which the Consumer Price Index (CPI) increases year-over-year, monitored by the Reserve Bank of India (RBI) Monetary Policy Committee.",
      "Hindi": "वह सांख्यिकीय प्रतिशत दर जिस पर उपभोक्ता मूल्य सूचकांक (CPI) साल-दर-साल बढ़ता है, जिसकी निगरानी भारतीय रिज़र्व बैंक (RBI) द्वारा मुद्रास्फीति नियंत्रण हेतु की जाती है।",
      "Marathi": "ग्राहक किंमत निर्देशांक (CPI) ज्या वार्षिक टक्केवारीने वाढतो तो महागाई दर; भारतीय रिझर्व्ह बँक (RBI) पतधोरण ठरवताना या दरावर बारीक लक्ष ठेवते."
    },
    "analogy": "The calibrated speedometer on a locomotive engine recording the exact velocity at which commodity prices are accelerating.",
    "indianExample": "The RBI operates under a statutory flexible inflation targeting framework aiming for 4% CPI inflation with a tolerance corridor of +/- 2% (2% to 6%).",
    "rememberThis": {
      "English": "Evaluate investment performance against the Inflation Rate; nominal 7% returns in an era of 6% CPI inflation deliver an anaemic 1% real gain.",
      "Hindi": "हमेशा अपने निवेश के रिटर्न की तुलना देश की वर्तमान महंगाई दर से करें; यदि महंगाई 6% है और FD 6.5% दे रही है, तो टैक्स के बाद आपका पैसा घट रहा है।",
      "Marathi": "आपल्या गुंतवणुकीच्या परताव्याची तुलना नेहमी चालू महागाई दराशी करा; कर वजा जाता परतावा महागाईपेक्षा जास्त असेल तरच खरा फायदा होतो."
    },
    "commonMistake": {
      "English": "Relying solely on headline Wholesale Price Index (WPI) inflation to plan personal household budgets, ignoring high retail CPI food and medical inflation.",
      "Hindi": "थोक मूल्य सूचकांक (WPI) देखकर घर का बजट बनाना, जबकि शिक्षा और स्वास्थ्य में खुदरा महंगाई 8%-10% की गति से बढ़ रही होती है।",
      "Marathi": "घाऊक महागाईचा आकडा पाहून समाधान मानणे, प्रत्यक्षात शिक्षण आणि वैद्यकीय खर्चातील किरकोळ महागाई ८% ते १०% वेगाने वाढत असते."
    },
    "mythStatement": {
      "English": "The published CPI inflation rate reflects the identical day-to-day cost-of-living rise for every individual citizen across India.",
      "Hindi": "सरकारी CPI महंगाई दर भारत के प्रत्येक नागरिक के व्यक्तिगत खर्चों की वृद्धि को बिल्कुल समान रूप से दर्शाता है।",
      "Marathi": "शासकीय महागाईचा दर देशातील प्रत्येक नागरिकाच्या व्यक्तिगत खर्चात तंतोतंत तेवढीच वाढ दर्शवतो असा गैरसमज."
    },
    "professionTracks": [
      "Salaried Employees",
      "Students & Freshers",
      "Food Business Owners"
    ],
    "video": {
      "English": {
        "searchFallback": "https://www.youtube.com/results?search_query=CPI+inflation+rate+RBI+monetary+policy+English",
        "title": "Understanding CPI Inflation & RBI Monetary Policy",
        "channel": "Finnovate"
      },
      "Hindi": {
        "searchFallback": "https://www.youtube.com/results?search_query=CPI+inflation+rate+kya+hai+Hindi",
        "title": "महंगाई दर (CPI) क्या है? RBI का 4% टार्गेट क्या है?",
        "channel": "Pranjal Kamra"
      },
      "Marathi": {
        "searchFallback": "https://www.youtube.com/results?search_query=Mahagai+dar+CPI+marathi",
        "title": "महागाई दर (CPI) कसा मोजतात? मराठी अर्थशास्त्र",
        "channel": "Groww Marathi"
      }
    }
  }
];

export const MYTH_FACT_ITEMS: MythFactItem[] = [
  {
    id: 'myth-1',
    category: 'Investing Basics',
    myth: 'You need at least ₹25,000–₹50,000 to start investing in Mutual Funds or Index Funds.',
    fact: 'You can start a regulated Mutual Fund SIP in India with as little as ₹100 to ₹500 per month.',
    proof:
      'SEBI and AMFI enable micro-SIPs across Nifty 50 Index funds and Flexi-Cap funds with zero entry load via UPI AutoPay.',
  },
  {
    id: 'myth-2',
    category: 'Tax & Savings',
    myth: 'Bank Fixed Deposits (FDs) are 100% risk-free for long-term 20-year wealth creation.',
    fact: 'While FDs protect nominal capital, post-tax FD returns (4.9%–5.5% in the 30% slab) often trail Indian lifestyle & medical inflation (7%–10%), eroding purchasing power.',
    proof:
      'FDs are ideal for short-term goals and emergency buffers, whereas long-term 10+ year goals require equity exposure to beat inflation.',
  },
  {
    id: 'myth-3',
    category: 'Insurance',
    myth: 'Endowment / Money-Back policies are the best way to combine Life Insurance and Investment.',
    fact: 'Mixing insurance and investment typically yields low 4.5%–5.5% XIRR with inadequate life cover. Pure Term Insurance + Mutual Fund SIP provides 10× higher protection and superior wealth creation.',
    proof:
      'A 26-year-old can get a ₹1 Crore Pure Term Cover for ~₹900/month and invest the remaining ₹9,100/month in an Index Fund SIP.',
  },
  {
    id: 'myth-4',
    category: 'Credit Score',
    myth: 'Owning a Credit Card automatically damages your CIBIL score and traps you in debt.',
    fact: 'Using less than 30% of your credit limit and paying the 100% Total Amount Due before the due date builds a 780+ CIBIL score at zero interest cost.',
    proof:
      'Credit bureaus reward disciplined credit utilization (<30%) and on-time repayment history when you later apply for a Home Loan.',
  },
  {
    id: 'myth-5',
    category: 'Market Timing',
    myth: 'You must wait for a market crash to start your SIP; investing at all-time highs loses money.',
    fact: 'Over 10–15 year horizons, time IN the market beats timing the market. SIPs automatically buy more units when markets dip and fewer when markets peak.',
    proof:
      'Historical Nifty 50 rolling 10-year SIP data shows consistent double-digit compounding regardless of the starting month.',
  },
];

export function formatINR(amount: number | null | undefined): string {
  const num = Number(amount || 0);
  if (!Number.isFinite(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function formatCompactINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function estimateMonthlyInHand(annualCtc: number): number {
  if (!annualCtc || annualCtc <= 0) return 0;
  const taxInfo = calculateTaxComparison(annualCtc, 150000, 50000);
  const annualTax = Math.min(taxInfo.newRegimeTax, taxInfo.oldRegimeTax);
  const epfAndGratuity = annualCtc * 0.08;
  const netAnnual = Math.max(0, annualCtc - annualTax - epfAndGratuity);
  return Math.round(netAnnual / 12);
}

export function calculateTaxComparison(
  annualCtc: number,
  deduction80C = 150000,
  deduction80DAndHra = 75000
) {
  // FY 2025-26 New Tax Regime (Standard Deduction ₹75,000, Rebate up to ₹12L taxable)
  const newTaxable = Math.max(0, annualCtc - 75000);
  let newTax = 0;
  if (newTaxable > 1200000) {
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.1 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.2 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.3 },
    ];
    let prev = 0;
    for (const s of slabs) {
      if (newTaxable > prev) {
        const taxableSlice = Math.min(newTaxable, s.limit) - prev;
        newTax += taxableSlice * s.rate;
        prev = s.limit;
      }
    }
  }
  const newRegimeTax = Math.round(newTax * 1.04); // 4% cess

  // Old Tax Regime (Standard Deduction ₹50,000 + 80C + 80D/HRA)
  const oldTaxable = Math.max(0, annualCtc - 50000 - Math.min(150000, deduction80C) - deduction80DAndHra);
  let oldTax = 0;
  if (oldTaxable > 500000) {
    if (oldTaxable > 250000) {
      oldTax += (Math.min(oldTaxable, 500000) - 250000) * 0.05;
    }
    if (oldTaxable > 500000) {
      oldTax += (Math.min(oldTaxable, 1000000) - 500000) * 0.2;
    }
    if (oldTaxable > 1000000) {
      oldTax += (oldTaxable - 1000000) * 0.3;
    }
  }
  const oldRegimeTax = Math.round(oldTax * 1.04);

  return {
    newRegimeTax,
    oldRegimeTax,
    recommended: newRegimeTax <= oldRegimeTax ? 'New Regime' : 'Old Regime',
    annualSavings: Math.abs(newRegimeTax - oldRegimeTax),
  };
}

export interface ProjectionPoint {
  year: number;
  label: string;
  baselineWealth: number;
  whatIfWealth: number;
  investedCapital: number;
}

export function calculateWealthTrajectory(params: {
  currentSavings: number;
  monthlySip: number;
  annualReturnRate: number;
  stepUpPercent: number;
  years: number;
  whatIfMonthlySip?: number;
  whatIfReturnRate?: number;
  whatIfStepUpPercent?: number;
  whatIfInitialDelta?: number;
}): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  let baseCorpus = Math.max(0, params.currentSavings);
  let altCorpus = Math.max(0, params.currentSavings + (params.whatIfInitialDelta || 0));
  let totalInvested = Math.max(0, params.currentSavings);

  let currentBaseSip = Math.max(0, params.monthlySip);
  let currentAltSip = Math.max(0, params.whatIfMonthlySip ?? params.monthlySip);

  const baseMonthlyRate = params.annualReturnRate / 100 / 12;
  const altMonthlyRate = (params.whatIfReturnRate ?? params.annualReturnRate) / 100 / 12;

  points.push({
    year: 0,
    label: 'Now',
    baselineWealth: Math.round(baseCorpus),
    whatIfWealth: Math.round(altCorpus),
    investedCapital: Math.round(totalInvested),
  });

  for (let y = 1; y <= params.years; y++) {
    for (let m = 1; m <= 12; m++) {
      baseCorpus = (baseCorpus + currentBaseSip) * (1 + baseMonthlyRate);
      altCorpus = (altCorpus + currentAltSip) * (1 + altMonthlyRate);
      totalInvested += currentBaseSip;
    }
    currentBaseSip *= 1 + params.stepUpPercent / 100;
    currentAltSip *= 1 + (params.whatIfStepUpPercent ?? params.stepUpPercent) / 100;

    points.push({
      year: y,
      label: `Yr ${y}`,
      baselineWealth: Math.round(baseCorpus),
      whatIfWealth: Math.round(altCorpus),
      investedCapital: Math.round(totalInvested),
    });
  }

  return points;
}
