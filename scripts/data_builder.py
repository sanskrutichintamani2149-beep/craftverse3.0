# encoding: utf-8
import json
import os

terms = []

def add(id, term, category, short_en, short_hi, short_mr,
        analogy, indian_example,
        rem_en, rem_hi, rem_mr,
        mistake_en, mistake_hi, mistake_mr,
        myth_en, myth_hi, myth_mr,
        tracks, v_en, v_hi, v_mr):
    terms.append({
        "id": id,
        "term": term,
        "category": category,
        "shortDef": {"English": short_en, "Hindi": short_hi, "Marathi": short_mr},
        "analogy": analogy,
        "indianExample": indian_example,
        "rememberThis": {"English": rem_en, "Hindi": rem_hi, "Marathi": rem_mr},
        "commonMistake": {"English": mistake_en, "Hindi": mistake_hi, "Marathi": mistake_mr},
        "mythStatement": {"English": myth_en, "Hindi": myth_hi, "Marathi": myth_mr},
        "professionTracks": tracks,
        "video": {"English": v_en, "Hindi": v_hi, "Marathi": v_mr}
    })

# =========================================================================
# 1. TAX (13 terms)
# =========================================================================
add(
    "gst", "GST (Goods and Services Tax)", "Tax",
    "A unified destination-based indirect tax levied on the supply of goods and services across India, consolidating multiple cascading state and central levies.",
    "वस्तु एवं सेवा कर (GST) भारत में वस्तुओं और सेवाओं की आपूर्ति पर लगने वाला एक एकीकृत अप्रत्यक्ष कर है, जिसने कई पुराने राज्य और केंद्रीय करों को समाप्त किया है।",
    "वस्तू आणि सेवा कर (GST) हा देशभरातील वस्तू आणि सेवांच्या पुरवठ्यावर आकारला जाणारा एकसंध अप्रत्यक्ष कर असून त्याने जुने विविध राज्य आणि केंद्रीय कर एकत्र केले आहेत.",
    "Like an all-inclusive single check at a restaurant replacing separate billing slips for state, municipal, and central service charges.",
    "Standard GST slabs in India are 0%, 5%, 12%, 18%, and 28%, governed by the GST Council under the Central and State GST Acts.",
    "Businesses with annual aggregate turnover exceeding ₹40 Lakh (₹20 Lakh for services) must mandate GST registration and file regular monthly returns.",
    "₹40 लाख (सेवाओं के लिए ₹20 लाख) से अधिक वार्षिक टर्नओवर वाले व्यवसायों के लिए GST पंजीकरण और मासिक रिटर्न दाखिल करना अनिवार्य है।",
    "वार्षिक उलाढाल ₹४० लाखांपेक्षा जास्त (सेवा क्षेत्रासाठी ₹२० लाख) असणाऱ्या व्यवसायांसाठी GST नोंदणी कायद्याने बंधनकारक आहे.",
    "Treating collected GST as business revenue rather than a statutory liability owed directly to the Government of India.",
    "ग्राहकों से वसूले गए GST को अपनी व्यावसायिक आय समझ लेना, जबकि यह सरकार को देय वैधानिक कर देनदारी है।",
    "ग्राहकांकडून गोळा केलेल्या GST ला स्वतःचे उत्पन्न मानणे, ही रक्कम शासनाकडे जमा करावी लागणारी देणी असते.",
    "GST is a direct tax deducted directly from your personal monthly salary slip like Income Tax.",
    "GST एक प्रत्यक्ष कर है जो आयकर की तरह आपके व्यक्तिगत वेतन से सीधे काटा जाता है।",
    "GST हा प्राप्तिकराप्रमाणे तुमच्या पगारातून थेट कापला जाणारा प्रत्यक्ष कर आहे.",
    ["Freelancers & Creators", "Startup Founders", "Food Business Owners", "Civil Engineering & Builders"],
    {"videoId": "V9Ra8klDzrM", "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+English+for+beginners", "title": "Goods & Services Tax Structure Explained", "channel": "Zerodha Varsity"},
    {"videoId": "_xglqWq_VNg", "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+Hindi", "title": "GST क्या है - सम्पूर्ण मार्गदर्शन", "channel": "Financial Awareness India"},
    {"videoId": "5Ls-mm01SdA", "searchFallback": "https://www.youtube.com/results?search_query=GST+mhanje+kay+Marathi", "title": "GST म्हणजे काय? संपूर्ण माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "tds", "TDS (Tax Deducted at Source)", "Tax",
    "A statutory mechanism under the Income Tax Act where the payer deducts tax at specified rates before making payments such as salary, professional fees, or bank interest.",
    "आयकर अधिनियम के तहत भुगतानकर्ता द्वारा वेतन, पेशेवर शुल्क या बैंक ब्याज का भुगतान करते समय स्रोत पर ही काटा जाने वाला अग्रिम कर।",
    "पगार, व्यावसायिक शुल्क किंवा बँक व्याज देताना रक्कम देणाऱ्या संस्थेने मूळ स्रोतावरच नियमानुसार कापून घेतलेला प्राप्तिकर.",
    "Like an automated toll booth collecting a portion of the tax upfront along the highway to ensure continuous, disciplined revenue collection.",
    "Banks deduct 10% TDS under Section 194A on FD interest if annual earnings exceed ₹40,000 (₹50,000 for senior citizens).",
    "Always verify that your deducted TDS reflects accurately in your Annual Information Statement (AIS) and Form 26AS before filing your ITR.",
    "अपना ITR दाखिल करने से पहले हमेशा जांच लें कि काटा गया TDS आपके Form 26AS और AIS में सही दिखाई दे रहा है।",
    "ITR भरण्यापूर्वी कापला गेलेला सर्व TDS तुमच्या Form 26AS आणि AIS मध्ये योग्यरित्या नोंदवला गेला आहे का याची खात्री करा.",
    "Assuming that because TDS was deducted from salary or interest, there is no need to file an Income Tax Return.",
    "यह मान लेना कि TDS कट जाने के बाद आयकर रिटर्न (ITR) दाखिल करने की कोई आवश्यकता नहीं रहती।",
    "TDS कापला गेल्यामुळे आता प्राप्तिकर विवरणपत्र (ITR) भरण्याची आवश्यकता नाही असा चुकीचा समज करून घेणे.",
    "TDS is an additional punitive surcharge over and above your final calculated income tax liability.",
    "TDS आपकी अंतिम आयकर देनदारी के अतिरिक्त लगाया जाने वाला एक अलग दंडात्मक शुल्क है।",
    "TDS हा तुमच्या अंतिम प्राप्तिकराव्यतिरिक्त आकारला जाणारा वेगळा जाचक दंड आहे.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=TDS+Tax+Deducted+at+Source+explained+English", "title": "Understanding TDS and Form 26AS", "channel": "ClearTax India"},
    {"searchFallback": "https://www.youtube.com/results?search_query=TDS+kya+hota+hai+Hindi+guide", "title": "TDS क्या होता है और Form 26AS कैसे चेक करें", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=TDS+mhanje+kay+Marathi", "title": "TDS म्हणजे काय आणि परतावा कसा मिळवावा", "channel": "Groww Marathi"}
)

add(
    "income-tax", "Income Tax", "Tax",
    "A constitutional direct tax levied annually by the Central Government on the total net taxable income earned by individuals, HUFs, and corporate entities.",
    "व्यक्तियों, अविभाजित हिंदू परिवारों (HUF) और कंपनियों की वार्षिक शुद्ध करयोग्य आय पर केंद्र सरकार द्वारा लगाया जाने वाला प्रत्यक्ष कर।",
    "व्यक्ती, हिंदू अविभक्त कुटुंबे आणि कंपन्यांच्या वार्षिक निव्वळ करपात्र उत्पन्नावर केंद्र सरकारद्वारे आकारला जाणारा प्रत्यक्ष कर.",
    "A mandatory annual civic contribution paid to finance sovereign defense, expressways, healthcare, and national public infrastructure.",
    "Governed by the Income Tax Act 1961, with tax slabs revised annually in the Union Budget presented to Parliament.",
    "Income Tax is computed on taxable income after legal deductions and statutory exemptions, not on total gross salary.",
    "आयकर की गणना कुल सकल वेतन पर नहीं, बल्कि अनुमेय छूट और कटौतियों के बाद बची शुद्ध करयोग्य आय पर की जाती है।",
    "प्राप्तिकराची आकारणी एकूण वेतनावर न होता, कायदेशीर वजावटींनंतर उरणाऱ्या निव्वळ करपात्र उत्पन्नावर केली जाते.",
    "Failing to disclose interest earned on savings bank accounts or capital gains from mutual fund switches on your annual ITR.",
    "सेविंग्स अकाउंट पर मिले ब्याज या म्यूचुअल फंड स्विच से हुए कैपिटल गेन्स को ITR में घोषित न करना।",
    "बचत खात्यावरील व्याज किंवा म्युच्युअल फंड युनिट्सच्या बदल्यातून झालेला नफा ITR मध्ये दाखवण्यास विसरणे.",
    "If your total annual salary is under ₹7 Lakh, you do not even need to file an ITR.",
    "यदि आपकी कुल वार्षिक आय ₹7 लाख से कम है, तो ITR फाइल करने का कोई औचित्य या लाभ नहीं होता।",
    "वार्षिक उत्पन्न ₹७ लाखांच्या आत असल्यास ITR भरण्याची कसलीही गरज नसते.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+basics+India+English", "title": "Indian Income Tax System Explained", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+slabs+guide+Hindi", "title": "Income Tax Slabs & Rules Explained", "channel": "CA Rachana Ranade"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+niyam+Marathi", "title": "इन्कम टॅक्स नियम आणि स्लॅब मराठी", "channel": "Groww Marathi"}
)

add(
    "itr", "ITR (Income Tax Return)", "Tax",
    "The prescribed electronic statutory declaration submitted to the Income Tax Department stating gross earnings, deductions, taxes paid, and refund claims for a financial year.",
    "आयकर विभाग के पोर्टल पर जमा किया जाने वाला वार्षिक वैधानिक प्रपत्र, जिसमें आपकी कुल आय, कटौतियां, चुकाया गया कर और रिफंड का पूर्ण विवरण होता है।",
    "आर्थिक वर्षातील एकूण उत्पन्न, वजावटी, भरलेला कर आणि परताव्याचा दावा दर्शवणारे प्राप्तिकर विभागाकडे सादर केले जाणारे अधिकृत विवरणपत्र.",
    "Your official annual financial passport stamped by the sovereign government certifying your declared legitimate earnings.",
    "ITR-1 (Sahaj) applies to salaried individuals with total income up to ₹50 Lakh, whereas ITR-4 (Sugam) covers presumptive business/freelance income under Section 44ADA.",
    "Filing ITR on or before the statutory July 31 deadline is critical to carry forward capital losses and ensure smooth visa approvals and Home Loan underwriting.",
    "पूंजीगत हानियों (Capital Losses) को आगे ले जाने और होम लोन की त्वरित स्वीकृति के लिए 31 जुलाई से पहले ITR दाखिल करना आवश्यक है।",
    "भांडवली तोटा पुढील वर्षांसाठी वर्ग करण्यासाठी आणि गृहकर्ज मंजुरीसाठी ३१ जुलैपूर्वी ITR भरणे अत्यावश्यक आहे.",
    "Selecting the incorrect ITR form (e.g. filing ITR-1 when holding unlisted equity shares or direct capital gains).",
    "गलत ITR फॉर्म चुन लेना (जैसे अनलिस्टेड शेयर या कैपिटल गेन्स होने पर भी ITR-1 दाखिल कर देना)।",
    "चुकीचा ITR फॉर्म निवडणे (उदा. भांडवली नफा किंवा खाजगी शेअर्स असताना ITR-1 भरणे).",
    "Filing an Income Tax Return automatically triggers a tax audit or assessment notice from the department.",
    "ITR दाखिल करने से आयकर विभाग द्वारा जांच या स्क्रूटनी का नोटिस अनिवार्य रूप से आ जाता है।",
    "ITR सादर केल्यास प्राप्तिकर विभागाकडून तपासणीची नोटीस हमखास येते.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=how+to+file+ITR+step+by+step+English", "title": "Filing Your Income Tax Return Step-by-Step", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=ITR+file+kaise+kare+Hindi", "title": "ITR कैसे फाइल करें - पूरी प्रक्रिया", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=ITR+file+karne+paddhat+Marathi", "title": "ITR कसा भरावा - सोपी मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "tax-regime", "Tax Regime (Old vs New)", "Tax",
    "The dual taxation framework in India: the New Regime offering lower tax slab rates without deductions, versus the Old Regime permitting exemptions like Section 80C, 80D, and HRA.",
    "भारत में दोहरी कर व्यवस्था: नई कर व्यवस्था (कम टैक्स दरें बिना किसी छूट के) बनाम पुरानी कर व्यवस्था (धारा 80C, 80D और HRA जैसी छूटों के साथ)।",
    "भारतातील दुहेरी कर प्रणाली: वजावटींशिवाय कमी करदर असणारी नवीन प्रणाली विरुद्ध कलम 80C, 80D आणि HRA अशा सवलती देणारी जुनी प्रणाली.",
    "Choosing between a flat-rate buffet with all items included, versus an à la carte menu where itemized coupons lower the final tally.",
    "Under the New Tax Regime (FY 2025-26), individuals with taxable income up to ₹12 Lakh effectively pay zero tax after Section 87A rebate and ₹75,000 standard deduction.",
    "The New Tax Regime is the default regime; salaried taxpayers may switch between regimes annually at the time of filing their return.",
    "नई कर व्यवस्था डिफॉल्ट व्यवस्था है; वेतनभोगी कर्मचारी हर वित्तीय वर्ष में अपनी सुविधानुसार पुरानी या नई व्यवस्था चुन सकते हैं।",
    "नवीन कर प्रणाली ही मूळ (Default) प्रणाली आहे; नोकरदार व्यक्ती दरवर्षी ITR भरताना योग्य त्या प्रणालीची निवड करू शकतात.",
    "Locking ₹1.5 Lakh into tax-saving schemes without calculating whether the New Regime provides a lower tax liability with zero investments.",
    "बिना तुलना किए केवल टैक्स बचाने के लिए ₹1.5 लाख निवेश कर देना, जबकि नई व्यवस्था में बिना निवेश ही टैक्स शून्य हो सकता था।",
    "दोन्ही प्रणालींची तुलना न करता घाईघाईने गुंतवणूक करणे, ज्यामुळे कर कमी न होता भांडवल अडकून पडते.",
    "The Old Tax Regime has been abolished and is no longer legally available to Indian taxpayers.",
    "पुरानी कर व्यवस्था को पूरी तरह समाप्त कर दिया गया है और अब यह कानूनी रूप से उपलब्ध नहीं है।",
    "जुनी कर प्रणाली पूर्णपणे रद्द करण्यात आली असून ती आता करदात्यांना उपलब्ध नाही.",
    ["Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+Tax+regime+comparison+English", "title": "New vs Old Tax Regime Detailed Analysis", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Old+vs+New+tax+regime+kon+sa+chune+Hindi", "title": "Old vs New Tax Regime: कौन सा चुनें?", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+tax+regime+Marathi", "title": "नवीन की जुनी कर प्रणाली? सविस्तर मार्गदर्शन", "channel": "Groww Marathi"}
)

add(
    "capital-gains", "Capital Gains", "Tax",
    "The net taxable profit realized when a capital asset—such as listed shares, equity mutual funds, commercial property, or gold—is transferred or sold above its acquisition cost.",
    "किसी पूंजीगत संपत्ति (जैसे शेयर, म्यूचुअल फंड, अचल संपत्ति या सोना) को उसके खरीद मूल्य से अधिक कीमत पर बेचने पर प्राप्त शुद्ध लाभ।",
    "शेअर्स, म्युच्युअल फंड, स्थावर मालमत्ता किंवा सोने यांसारख्या भांडवली मालमत्तांची खरेदी किमतीपेक्षा जास्त भावाने विक्री केल्यावर होणारा निव्वळ नफा.",
    "The harvested profit when selling an antique car or commercial plot at an appreciated market valuation.",
    "Regulated under Sections 45 to 55 of the Income Tax Act with differentiated rates for short-term and long-term holding tenures.",
    "Capital gains taxes are only triggered upon actual sale (realization); unrealized paper gains remain completely untaxed.",
    "पूंजीगत लाभ कर केवल संपत्ति की वास्तविक बिक्री पर लगता है; पोर्टफोलियो में दिख रहे अनरियलाइज्ड मुनाफे पर कोई टैक्स नहीं लगता।",
    "भांडवली नफा कर केवळ प्रत्यक्ष विक्री झाल्यानंतरच आकारला जातो; पोर्टफोलिओतील न विकलेल्या नफ्यावर कर लागत नाही.",
    "Failing to index the acquisition cost when calculating long-term capital gains on unlisted real estate transactions.",
    "अचल संपत्ति की बिक्री पर दीर्घकालिक पूंजीगत लाभ की गणना करते समय इंडेक्सेशन लाभ को नजरअंदाज करना।",
    "स्थावर मालमत्तेच्या दीर्घकालीन विक्रीवर भांडवली नफ्याची आकारणी करताना नियमांनुसार इंडेक्सेशन न तपासणे.",
    "Capital gains tax must be paid every financial year even if you have not sold any shares or mutual fund units.",
    "यदि आपने कोई शेयर या म्यूचुअल फंड नहीं बेचा है, तब भी हर साल पूंजीगत लाभ कर चुकाना अनिवार्य होता है।",
    "शेअर्स किंवा म्युच्युअल फंड युनिट्स विकले नसले तरी दरवर्षी भांडवली नफा कर भरावा लागतो.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Capital+Gains+Tax+India+Explained+English", "title": "Capital Gains Taxation in India", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+kya+hota+hai+Hindi", "title": "Capital Gains Tax क्या है? सरल हिंदी में", "channel": "Asset Yogi"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+Marathi", "title": "कॅपिटल गेन्स टॅक्स म्हणजे काय? मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "stcg", "Short-Term Capital Gains (STCG)", "Tax",
    "Taxable profits earned on listed equities or equity mutual funds held for 12 months or less, taxed under Section 111A at a flat statutory rate of 20%.",
    "12 महीने या उससे कम समय के लिए रखे गए लिस्टेड शेयरों या इक्विटी फंडों की बिक्री से अर्जित लाभ, जिस पर धारा 111A के तहत फ्लैट 20% टैक्स लगता है।",
    "१२ महिने किंवा त्यापेक्षा कमी कालावधीत विकलेल्या समभागांवर होणारा नफा, ज्यावर कलम 111A अंतर्गत २०% निश्चित दराने कर आकारला जातो.",
    "A fast-lane exit toll applied to rapid investments liquidated before completing one full calendar year.",
    "Following Union Budget 2024 revisions, Section 111A STCG on listed equity securities was standardized at 20% plus applicable cess.",
    "Short-term capital losses can only be set off against short-term or long-term capital gains, not against regular salary income.",
    "शॉर्ट-टर्म कैपिटल लॉस की भरपाई केवल कैपिटल गेन्स से की जा सकती है, इसे अपनी नियमित वेतन आय से नहीं घटाया जा सकता।",
    "अल्पकालीन भांडवली तोटा केवळ भांडवली नफ्यातूनच वजा करता येतो, वेतनाच्या उत्पन्नातून नाही.",
    "Switching between equity mutual fund schemes within 12 months and ignoring the resulting 20% STCG liability.",
    "एक साल के भीतर एक म्यूचुअल फंड से दूसरे में स्विच करना और उस पर लगने वाले 20% STCG टैक्स को भूल जाना।",
    "एका वर्षाच्या आत म्युच्युअल फंड योजना बदलणे आणि त्यावर २०% STCG कर देय असल्याचे विसरणे.",
    "Short-term capital gains are added to your salary and taxed at your personal slab rate of 30%.",
    "लिस्टेड इक्विटी का शॉर्ट-टर्म कैपिटल गेन आपके वेतन में जुड़कर 30% स्लैब रेट पर टैक्स होता है।",
    "इक्विटीवरील अल्पकालीन भांडवली नफा तुमच्या वेतनात मिळवून ३०% च्या सर्वोच्च दराने करपात्र होतो.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=STCG+Short+term+capital+gains+tax+explained+English", "title": "STCG Rules & Calculations", "channel": "Groww"},
    {"searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+kya+hai+Hindi", "title": "शॉर्ट टर्म कैपिटल गेन टैक्स की पूरी जानकारी", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+rules+Marathi", "title": "STCG कर नियम आणि आकारणी मराठी", "channel": "Groww Marathi"}
)

add(
    "ltcg", "Long-Term Capital Gains (LTCG)", "Tax",
    "Profits realized on equity investments held over 12 months, taxed under Section 112A at 12.5% on annual cumulative gains exceeding the statutory ₹1.25 Lakh exemption limit.",
    "12 महीने से अधिक समय तक रखे गए इक्विटी निवेश की बिक्री पर अर्जित लाभ, जहां वार्षिक ₹1.25 लाख से अधिक के लाभ पर 12.5% की दर से टैक्स लगता है।",
    "१२ महिन्यांपेक्षा जास्त काळ ठेवलेल्या समभाग गुंतवणुकीवरील नफा; आर्थिक वर्षात ₹१.२५ लाखांवरील नफ्यावर १२.५% दराने कर लागू होतो.",
    "A concessionary reward toll for patient investors who nurture enterprise capital over multiannual horizons.",
    "If your listed equity mutual fund gains after 3 years total ₹2,00,000, the first ₹1,25,000 is tax-free and the remaining ₹75,000 is taxed at 12.5% (₹9,375 plus cess).",
    "Take advantage of annual tax-harvesting by booking up to ₹1.25 Lakh in long-term capital gains tax-free before March 31 each financial year.",
    "हर साल 31 मार्च से पहले ₹1.25 लाख तक का लॉन्ग-टर्म कैपिटल गेन बुक करके कानूनी रूप से टैक्स बचाने (Tax Harvesting) की रणनीति अपनाएं।",
    "दरवर्षी ३१ मार्चपूर्वी ₹१.२५ लाखांपर्यंतचा भांडवली नफा बुक करून करमुक्त पुनर्गंतवणूक (Tax Harvesting) करण्याची संधी वापरा.",
    "Assuming all equity gains held for more than 1 year are 100% tax-exempt as was the case prior to 2018.",
    "यह समझना कि 1 साल से पुराने सभी इक्विटी मुनाफे पूरी तरह करमुक्त हैं (जैसा 2018 से पहले हुआ करता था)।",
    "१ वर्षापेक्षा जुना सर्व इक्विटी नफा १००% करमुक्त असतो असा जुना गैरसमज बाळगणे.",
    "LTCG tax of 12.5% is charged on the entire sale consideration rather than purely on the net profit.",
    "LTCG टैक्स पूरी बिक्री राशि पर लगता है, न कि केवल अर्जित शुद्ध लाभ पर।",
    "LTCG कर एकूण विक्री रकमेवर आकारला जातो, निव्वळ नफ्यावर नाही.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+Long+Term+Capital+Gains+tax+12.5+percent+English", "title": "LTCG Tax Rules and ₹1.25L Exemption", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+kya+hota+hai+budget+rules+Hindi", "title": "LTCG टैक्स और टैक्स हार्वेस्टिंग की तकनीक", "channel": "Asset Yogi"},
    {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+Marathi+explanation", "title": "दीर्घकालीन भांडवली नफा कर (LTCG) मराठी", "channel": "Groww Marathi"}
)

add(
    "tax-deductible", "Tax Deductible (Section 80C & 80D)", "Tax",
    "Eligible statutory outflows and investments—such as EPF, PPF, ELSS (80C up to ₹1.5L) and health insurance premiums (80D up to ₹25k–₹50k)—that reduce gross taxable income under the Old Regime.",
    "वे वैध खर्च और निवेश (जैसे EPF, PPF, ELSS एवं स्वास्थ्य बीमा प्रीमियम) जो पुरानी कर व्यवस्था में आपकी कुल करयोग्य आय को घटाते हैं।",
    "कायदेशीरदृष्ट्या अनुज्ञेय खर्च आणि गुंतवणूक (उदा. EPF, PPF, ELSS आणि आरोग्य विमा हप्ता) ज्यामुळे जुन्या कर प्रणालीत करपात्र उत्पन्न कमी होते.",
    "Official discount vouchers recognized by the tax code that deduct directly from the taxable weight of your salary.",
    "Section 80D provides up to ₹25,000 deduction for self/family health insurance and an additional ₹50,000 for senior citizen parents.",
    "Deductions under Chapter VI-A (80C, 80D, 80E) are strictly unavailable under the default New Tax Regime.",
    "अध्याय VI-A की अधिकांश कटौतियां (80C, 80D) डिफॉल्ट नई कर व्यवस्था में स्वीकार्य नहीं हैं।",
    "कलम 80C आणि 80D अंतर्गत मिळणाऱ्या वजावटी नवीन कर प्रणालीत उपलब्ध नसतात.",
    "Buying expensive traditional insurance endowment plans in March solely to exhaust the ₹1.5 Lakh 80C limit.",
    "केवल धारा 80C की सीमा समाप्त करने के लिए मार्च के महीने में कम रिटर्न वाली एंडोमेंट पॉलिसियां खरीद लेना।",
    "केवळ कलम 80C ची मर्यादा संपवण्यासाठी मार्च महिन्यात निकृष्ट परतावा देणाऱ्या विमा पॉलिसी खरेदी करणे.",
    "A ₹1,50,000 deduction under Section 80C means the government transfers ₹1,50,000 cash back to your bank account.",
    "धारा 80C में ₹1.5 लाख की छूट का मतलब है कि सरकार ₹1.5 लाख आपके बैंक खाते में सीधे वापस भेज देती है।",
    "कलम 80C खाली ₹१.५ लाखांची वजावट म्हणजे सरकार तेवढी रोकड थेट तुमच्या खात्यात जमा करते.",
    ["Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Section+80C+and+80D+deductions+explained+English", "title": "How Tax Deductions Work under Chapter VI-A", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Section+80C+80D+tax+deductions+Hindi", "title": "80C और 80D से टैक्स कैसे बचाएं", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Kalam+80C+80D+Marathi", "title": "कलम 80C आणि 80D वजावटी मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "tax-exemption", "Tax Exemption (HRA & LTA)", "Tax",
    "Specific statutory components of income—such as House Rent Allowance under Section 10(13A) or Leave Travel Allowance—that are legally excluded from total taxable income upon meeting conditions.",
    "वेतन के विशिष्ट घटक (जैसे धारा 10(13A) के तहत HRA या LTA) जो वैध किराया रसीदें या यात्रा बिल प्रस्तुत करने पर करयोग्य आय की गणना से बाहर कर दिए जाते हैं।",
    "वेतनाचे असे विशिष्ट भाग (उदा. कलम 10(13A) खाली HRA किंवा LTA) जे घरभाडे पावत्या किंवा प्रवास पुरावे दिल्यावर करपात्र उत्पन्नातून पूर्णपणे वगळले जातात.",
    "A diplomatic tax-free zone inside your compensation contract designated for essential living and transit expenses.",
    "HRA exemption is the least of: actual HRA received, 50% of basic salary (metro) / 40% (non-metro), or actual rent paid minus 10% of basic salary.",
    "HRA and LTA exemptions can only be claimed under the Old Tax Regime and require landlord PAN details if annual rent exceeds ₹1,00,000.",
    "HRA छूट केवल पुरानी कर व्यवस्था में मिलती है और यदि वार्षिक किराया ₹1 लाख से अधिक है तो मकान मालिक का PAN अनिवार्य है।",
    "HRA सवलत केवळ जुन्या कर प्रणालीत मिळते आणि वार्षिक भाडे ₹१ लाखांपेक्षा जास्त असल्यास घरमालकाचा PAN आवश्यक असतो.",
    "Attempting to claim HRA while owning and residing in your own residential home in the same municipality.",
    "उसी शहर में अपने स्वयं के मकान में रहते हुए भी कंपनी से प्राप्त HRA पर कर छूट का दावा करना।",
    "स्वतःच्या मालकीच्या घरात राहूनही कंपनीकडून मिळणाऱ्या HRA वर करसवलतीचा दावा करणे.",
    "Whatever full HRA amount is credited on your monthly salary slip is automatically 100% tax-free without calculations.",
    "सैलरी स्लिप में दिखने वाला पूरा HRA बिना किसी गणना या किराए की रसीद के पूरी तरह टैक्स-फ्री होता है।",
    "पगारपत्रकात दिसणारा संपूर्ण HRA कसल्याही भाड्याच्या पावत्यांशिवाय आपोआप १००% करमुक्त असतो.",
    ["Salaried Employees"],
    {"searchFallback": "https://www.youtube.com/results?search_query=How+HRA+tax+exemption+calculated+English", "title": "HRA Tax Exemption Calculation Formula", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=HRA+calculation+Hindi+guide", "title": "HRA कैलकुलेशन और टैक्स छूट के नियम", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=HRA+exemption+calculation+Marathi", "title": "HRA करसवलत कशी मोजावी? मराठी", "channel": "Groww Marathi"}
)

add(
    "tax-rebate", "Tax Rebate (Section 87A)", "Tax",
    "A statutory relief credited directly against calculated income tax for resident individuals whose net taxable income stays below specified legal thresholds.",
    "निवासी भारतीय व्यक्तियों को देय कर में मिलने वाली सीधी राहत, जिससे निर्धारित आय सीमा के भीतर कर देनदारी घटकर शून्य हो जाती है।",
    "विहित उत्पन्न मर्यादेच्या आत असणाऱ्या भारतीय रहिवासी करदात्यांच्या अंतिम प्राप्तिकरातून मिळणारी थेट कायदेशीर सूट, ज्यामुळे कर शून्य होतो.",
    "A government waiver voucher applied at the cashier desk that cancels out the total tax bill if your income remains below the middle-income benchmark.",
    "In the New Tax Regime, Section 87A rebate provides relief up to ₹25,000 (effectively zero tax up to ₹7L under FY24 rules, expanded to ₹12L in revised budget framework).",
    "Section 87A is an end-of-calculation tax credit against tax liability, not an income deduction that lowers gross income.",
    "धारा 87A एक टैक्स रिबेट (कर छूट) है जो अंतिम कर राशि से घटती है, यह कोई आय कटौती (Deduction) नहीं है।",
    "कलम 87A ही कर रकमेवर मिळणारी थेट सूट (Tax Credit) आहे, ती उत्पन्नातून वजा होणारी कपात नाही.",
    "Assuming non-resident Indians (NRIs) are eligible for Section 87A rebate (it is restricted exclusively to resident individuals).",
    "यह मान लेना कि अनिवासी भारतीय (NRI) भी धारा 87A की कर छूट के पात्र हैं (यह केवल निवासी भारतीयों के लिए है)।",
    "अनिवासी भारतीयांनाही (NRI) कलम 87A ची करसवलत मिळते असा चुकीचा समज करून घेणे.",
    "Section 87A can be claimed on special-rate incomes like Short-Term Capital Gains under Section 111A.",
    "धारा 111A के तहत शॉर्ट-टर्म कैपिटल गेन्स पर भी धारा 87A का रिबेट आसानी से लिया जा सकता है।",
    "इक्विटीवरील विशेष STCG करावरही कलम 87A ची सवलत विनाअडथळा लागू होते.",
    ["Salaried Employees", "Freelancers & Creators", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+Rebate+explained+English", "title": "Section 87A Tax Rebate Rules & Slabs", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+kya+hai+Hindi", "title": "धारा 87A का पूरा सच और टैक्स छूट", "channel": "Asset Yogi"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+rebate+Marathi", "title": "कलम 87A कर सवलत नियम मराठी", "channel": "Groww Marathi"}
)

add(
    "advance-tax", "Advance Tax", "Tax",
    "The 'pay-as-you-earn' statutory schedule requiring individuals and businesses with estimated annual tax liability over ₹10,000 to pay tax in quarterly installments.",
    "कमाई के साथ कर चुकाने की वैधानिक प्रणाली, जिसके तहत यदि आपकी अनुमानित वार्षिक कर देनदारी ₹10,000 से अधिक है, तो 4 किस्तों में अग्रिम कर भरना होता है।",
    "आर्थिक वर्षात देय प्राप्तिकर ₹१०,००० पेक्षा जास्त असल्यास तो वर्षाअखेरीस न भरता दर तिमाहीला ४ हप्त्यांमध्ये भरण्याची वैधानिक पद्धत.",
    "Paying your utility dues in quarterly progress tranches rather than receiving a giant penal bill at the close of March.",
    "Quarterly deadlines: 15% by June 15, 45% by Sept 15, 75% by Dec 15, and 100% by March 15; failure triggers interest under Sections 234B and 234C.",
    "Freelancers, business owners, and salaried professionals with substantial capital gains or interest income must compute and remit Advance Tax quarterly.",
    "फ्रीलांसरों और शेयर बाजार से लाभ कमाने वालों को ब्याज दंड से बचने के लिए तिमाही अग्रिम कर जमा करना आवश्यक है।",
    "फ्रीलान्सर्स आणि भांडवली नफा मिळवणाऱ्या करदात्यांनी दंड टाळण्यासाठी दर तिमाहीला आगाऊ कर भरणे बंधनकारक आहे.",
    "Waiting until July ITR filing to pay tax on heavy stock market capital gains, incurring mandatory interest penalties under Sections 234B & 234C.",
    "शेयर बाजार के बड़े मुनाफे का टैक्स जुलाई में ITR भरते समय देना, जिससे 234B और 234C का ब्याज जुर्माना लग जाता है।",
    "शेअर बाजारातील नफ्याचा कर थेट जुलैमध्ये भरल्यामुळे २३४B आणि २३४C कलमांखाली होणारा व्याज दंड.",
    "Advance tax only applies to registered corporate companies, never to individuals or professionals.",
    "अग्रिम कर केवल बड़ी प्राइवेट लिमिटेड कंपनियों पर लागू होता है, व्यक्तिगत करदाताओं पर नहीं।",
    "आगाऊ कर केवळ मोठ्या कंपन्यांसाठी असतो, नोकरदार किंवा व्यावसायिकांसाठी नसतो.",
    ["Freelancers & Creators", "Startup Founders", "Civil Engineering & Builders", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Advance+Tax+calculation+and+due+dates+English", "title": "Advance Tax Rules, Due Dates & Penalties", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+kaise+bhare+Hindi", "title": "Advance Tax क्या है और कैसे भरें?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+niyam+Marathi", "title": "आगाऊ कर (Advance Tax) नियम मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "tax-refund", "Tax Refund", "Tax",
    "The statutory repayment remitted directly by the Income Tax Department to your verified bank account when total taxes paid (TDS/Advance Tax) exceed final assessed tax liability.",
    "आयकर विभाग द्वारा आपके बैंक खाते में भेजा जाने वाला अतिरिक्त कर का पैसा, जब चुकाया गया TDS या अग्रिम कर आपकी वास्तविक देनदारी से अधिक हो।",
    "प्राप्तिकर विभागाकडून करदात्याच्या बँक खात्यात थेट जमा होणारा परतावा, जेव्हा कापलेला TDS किंवा आगाऊ कर प्रत्यक्ष देय करापेक्षा जास्त असतो.",
    "Change returned by a cashier when the currency note you handed over exceeded the price of the purchase.",
    "If an employer deducted ₹90,000 TDS but your finalized net tax liability after regime choice is ₹55,000, you receive a ₹35,000 refund plus 0.5% monthly interest under Section 244A.",
    "To receive your tax refund smoothly, ensure your bank account is pre-validated with matching PAN and active name on the e-filing portal.",
    "रिफंड निर्बाध रूप से प्राप्त करने के लिए आयकर पोर्टल पर अपना बैंक खाता पूर्व-सत्यापित (Pre-Validated) और PAN से लिंक रखें।",
    "प्राप्तिकर परतावा वेळेत मिळण्यासाठी आयकर पोर्टलवर तुमचे बँक खाते पूर्व-सत्यापित (Pre-validated) आणि पॅनशी जोडलेले असावे.",
    "Failing to e-verify your ITR within 30 days of submission, which invalidates the return and halts all refund disbursements.",
    "ITR फाइल करने के बाद 30 दिनों के भीतर ई-सत्यापन (e-Verify) न करना, जिससे रिटर्न अमान्य हो जाता है और रिफंड रुक जाता है।",
    "ITR भरल्यानंतर ३० दिवसांच्या आत ई-व्हेरिफिकेशन न करणे, ज्यामुळे विवरणपत्र अवैध ठरून परतावा थांबतो.",
    "The Income Tax Department charges a processing fee deduction before crediting your legitimate tax refund.",
    "आयकर विभाग आपके रिफंड की राशि खाते में भेजने से पहले उसमें से प्रोसेसिंग फीस काट लेता है।",
    "प्राप्तिकर विभाग तुमचा परतावा खात्यात जमा करण्यापूर्वी त्यातून प्रक्रिया शुल्क कापून घेतो.",
    ["Salaried Employees", "Freelancers & Creators", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+process+and+status+English", "title": "Tracking & Claiming Income Tax Refund", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+kab+aata+hai+Hindi", "title": "Income Tax Refund कब और कैसे आता है?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+Marathi+process", "title": "प्राप्तिकर परतावा (Refund) कसा मिळवावा?", "channel": "Groww Marathi"}
)

print(f"Tax terms count: {len(terms)}")
