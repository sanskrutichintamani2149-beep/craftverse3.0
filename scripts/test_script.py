# encoding: utf-8
import json
import os

terms = [
    # TAX (14 terms)
    {
        "id": "gst",
        "term": "GST (Goods and Services Tax)",
        "category": "Tax",
        "shortDef": {
            "English": "A unified destination-based indirect tax levied on the supply of goods and services across India, replacing complex cascading state and central levies.",
            "Hindi": "वस्तु एवं सेवा कर (GST) भारत में वस्तुओं और सेवाओं की आपूर्ति पर लगने वाला एक एकीकृत अप्रत्यक्ष कर है, जिसने पुराने वैट और उत्पाद शुल्क को प्रतिस्थापित किया है।",
            "Marathi": "वस्तू आणि सेवा कर (GST) हा देशभरातील वस्तू आणि सेवांच्या पुरवठ्यावर आकारला जाणारा एकसंध अप्रत्यक्ष कर असून त्याने जुने विविध राज्य आणि केंद्रीय कर एकत्र केले आहेत."
        },
        "analogy": "Like a consolidated all-inclusive bill at a restaurant instead of separate tax slips for state, municipal, and central charges.",
        "indianExample": "Standard GST slabs in India are 0%, 5%, 12%, 18%, and 28%, governed by the GST Council under the Central and State GST Acts.",
        "rememberThis": {
            "English": "Businesses with annual aggregate turnover exceeding ₹40 Lakh (₹20 Lakh for services) must mandate GST registration and file regular monthly returns.",
            "Hindi": "₹40 लाख (सेवाओं के लिए ₹20 लाख) से अधिक वार्षिक टर्नओवर वाले व्यवसायों के लिए GST पंजीकरण अनिवार्य है।",
            "Marathi": "वार्षिक उलाढाल ₹४० लाखांपेक्षा जास्त (सेवा क्षेत्रासाठी ₹२० लाख) असणाऱ्या व्यवसायांसाठी GST नोंदणी कायद्याने बंधनकारक आहे."
        },
        "commonMistake": {
            "English": "Treating collected GST as business revenue rather than a statutory liability owed directly to the Government of India.",
            "Hindi": "ग्राहकों से वसूले गए GST को अपनी व्यावसायिक आय समझ लेना, जबकि यह सरकार को देय वैधानिक कर देनदारी है।",
            "Marathi": "ग्राहकांकडून गोळा केलेल्या GST ला स्वतःचे उत्पन्न मानणे, ही रक्कम शासनाकडे जमा करावी लागणारी देणी असते."
        },
        "mythStatement": {
            "English": "GST is a direct tax deducted directly from your personal salary income like Income Tax.",
            "Hindi": "GST एक प्रत्यक्ष कर है जो आयकर की तरह आपके व्यक्तिगत वेतन से सीधे काटा जाता है।",
            "Marathi": "GST हा प्राप्तिकराप्रमाणे तुमच्या पगारातून थेट कापला जाणारा प्रत्यक्ष कर आहे."
        },
        "professionTracks": ["Freelancers & Creators", "Startup Founders", "Food Business Owners", "Civil Engineering & Builders"],
        "video": {
            "English": {"videoId": "V9Ra8klDzrM", "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+English+for+beginners", "title": "Goods & Services Tax Structure Explained", "channel": "Zerodha Varsity"},
            "Hindi": {"videoId": "_xglqWq_VNg", "searchFallback": "https://www.youtube.com/results?search_query=GST+explained+in+Hindi", "title": "GST Kya Hai - Sampoorna Margdarshan", "channel": "Financial Awareness India"},
            "Marathi": {"videoId": "5Ls-mm01SdA", "searchFallback": "https://www.youtube.com/results?search_query=GST+mhanje+kay+Marathi", "title": "GST म्हणजे काय? संपूर्ण माहिती", "channel": "CA Rachana Ranade Marathi"}
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
        "analogy": "Like a toll booth collecting a portion of the fare upfront along the highway so tax collection is disciplined throughout the financial year.",
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=TDS+Tax+Deducted+at+Source+explained+English", "title": "Understanding TDS and Form 26AS", "channel": "ClearTax India"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=TDS+kya+hota+hai+Hindi+guide", "title": "TDS क्या होता है और Form 26AS कैसे चेक करें", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=TDS+mhanje+kay+Marathi", "title": "TDS म्हणजे काय आणि परतावा कसा मिळवावा", "channel": "Groww Marathi"}
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
        "analogy": "A mandatory annual civic subscription fee paid to fund national defense, highways, public healthcare, and civil infrastructure.",
        "indianExample": "Governed by the Income Tax Act 1961, with tax slabs revised annually in the Union Budget presented to Parliament.",
        "rememberThis": {
            "English": "Income Tax is calculated on taxable income after legal deductions and exemptions, not on total gross turnover or gross salary.",
            "Hindi": "आयकर की गणना कुल सकल वेतन पर नहीं, बल्कि अनुमेय छूट और कटौतियों के बाद बची शुद्ध करयोग्य आय पर की जाती है।",
            "Marathi": "प्राप्तिकराची आकारणी एकूण वेतनावर न होता, कायदेशीर वजावटींनंतर उरणाऱ्या निव्वळ करपात्र उत्पन्नावर केली जाते."
        },
        "commonMistake": {
            "English": "Failing to disclose interest earned on savings bank accounts or capital gains from mutual fund switches on your ITR.",
            "Hindi": "सेविंग्स अकाउंट पर मिले ब्याज या म्यूचुअल फंड स्विच से हुए कैपिटल गेन्स को ITR में घोषित न करना।",
            "Marathi": "बचत खात्यावरील व्याज किंवा म्युच्युअल फंड युनिट्सच्या बदल्यातून झालेला नफा ITR मध्ये दाखवण्यास विसरणे."
        },
        "mythStatement": {
            "English": "If your total annual salary is under ₹7 Lakh, you do not even need to file an ITR.",
            "Hindi": "यदि आपकी कुल वार्षिक आय ₹7 लाख से कम है, तो ITR फाइल करने का कोई औचित्य या लाभ नहीं होता।",
            "Marathi": "वार्षिक उत्पन्न ₹७ लाखांच्या आत असल्यास ITR भरण्याची कसलीही गरज नसते."
        },
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+basics+India+English", "title": "Indian Income Tax System Explained", "channel": "Pranjal Kamra"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+slabs+guide+Hindi", "title": "Income Tax Slabs & Rules Explained", "channel": "CA Rachana Ranade"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+niyam+Marathi", "title": "इन्कम टॅक्स नियम आणि स्लॅब मराठी", "channel": "Groww Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders", "Food Business Owners"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=how+to+file+ITR+step+by+step+English", "title": "Filing Your Income Tax Return Step-by-Step", "channel": "ClearTax"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=ITR+file+kaise+kare+Hindi", "title": "ITR कैसे फाइल करें - पूरी प्रक्रिया", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=ITR+file+karne+paddhat+Marathi", "title": "ITR कसा भरावा - सोपी मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+Tax+regime+comparison+English", "title": "New vs Old Tax Regime Detailed Analysis", "channel": "Finnovate"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Old+vs+New+tax+regime+kon+sa+chune+Hindi", "title": "Old vs New Tax Regime: कौन सा चुनें?", "channel": "Pranjal Kamra"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=New+vs+Old+tax+regime+Marathi", "title": "नवीन की जुनी कर प्रणाली? सविस्तर मार्गदर्शन", "channel": "Groww Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Capital+Gains+Tax+India+Explained+English", "title": "Capital Gains Taxation in India", "channel": "Zerodha Varsity"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+kya+hota+hai+Hindi", "title": "Capital Gains Tax क्या है? सरल हिंदी में", "channel": "Asset Yogi"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Capital+gains+tax+Marathi", "title": "कॅपिटल गेन्स टॅक्स म्हणजे काय? मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
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
        "analogy": "A fast-lane exit toll applied to rapid investments sold before completing one full calendar year.",
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=STCG+Short+term+capital+gains+tax+explained+English", "title": "STCG Rules & Calculations", "channel": "Groww"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+kya+hai+Hindi", "title": "शॉर्ट टर्म कैपिटल गेन टैक्स की पूरी जानकारी", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=STCG+tax+rules+Marathi", "title": "STCG कर नियम आणि आकारणी मराठी", "channel": "Groww Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+Long+Term+Capital+Gains+tax+12.5+percent+English", "title": "LTCG Tax Rules and ₹1.25L Exemption", "channel": "Zerodha Varsity"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+kya+hota+hai+budget+rules+Hindi", "title": "LTCG टैक्स और टैक्स हार्वेस्टिंग की तकनीक", "channel": "Asset Yogi"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=LTCG+tax+Marathi+explanation", "title": "दीर्घकालीन भांडवली नफा कर (LTCG) मराठी", "channel": "Groww Marathi"}
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
        "analogy": "Discount coupons recognized by tax authorities that deduct directly from the billable weight of your salary.",
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Section+80C+and+80D+deductions+explained+English", "title": "How Tax Deductions Work under Chapter VI-A", "channel": "Finnovate"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Section+80C+80D+tax+deductions+Hindi", "title": "80C और 80D से टैक्स कैसे बचाएं", "channel": "Pranjal Kamra"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Kalam+80C+80D+Marathi", "title": "कलम 80C आणि 80D वजावटी मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
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
        "professionTracks": ["Salaried Employees"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=How+HRA+tax+exemption+calculated+English", "title": "HRA Tax Exemption Calculation Formula", "channel": "ClearTax"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=HRA+calculation+Hindi+guide", "title": "HRA कैलकुलेशन और टैक्स छूट के नियम", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=HRA+exemption+calculation+Marathi", "title": "HRA करसवलत कशी मोजावी? मराठी", "channel": "Groww Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Students & Freshers"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+Rebate+explained+English", "title": "Section 87A Tax Rebate Rules & Slabs", "channel": "ClearTax"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+kya+hai+Hindi", "title": "धारा 87A का पूरा सच और टैक्स छूट", "channel": "Asset Yogi"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Section+87A+rebate+Marathi", "title": "कलम 87A कर सवलत नियम मराठी", "channel": "Groww Marathi"}
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
        "professionTracks": ["Freelancers & Creators", "Startup Founders", "Civil Engineering & Builders", "Food Business Owners"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Advance+Tax+calculation+and+due+dates+English", "title": "Advance Tax Rules, Due Dates & Penalties", "channel": "Finnovate"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+kaise+bhare+Hindi", "title": "Advance Tax क्या है और कैसे भरें?", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Advance+tax+niyam+Marathi", "title": "आगाऊ कर (Advance Tax) नियम मराठी", "channel": "CA Rachana Ranade Marathi"}
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
        "professionTracks": ["Salaried Employees", "Freelancers & Creators", "Students & Freshers"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+process+and+status+English", "title": "Tracking & Claiming Income Tax Refund", "channel": "ClearTax"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+kab+aata+hai+Hindi", "title": "Income Tax Refund कब और कैसे आता है?", "channel": "Labor Law Advisor"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=Income+tax+refund+Marathi+process", "title": "प्राप्तिकर परतावा (Refund) कसा मिळवावा?", "channel": "Groww Marathi"}
        }
    },
    {
        "id": "elss",
        "term": "ELSS (Equity Linked Savings Scheme)",
        "category": "Tax",
        "shortDef": {
            "English": "A diversified equity mutual fund offering tax deduction under Section 80C up to ₹1.5 Lakh under the Old Regime, with the shortest statutory lock-in period of 3 years.",
            "Hindi": "इक्विटी म्यूचुअल फंड की वह श्रेणी जिसमें पुरानी कर व्यवस्था में धारा 80C के तहत ₹1.5 लाख तक की कर छूट मिलती है और केवल 3 वर्ष का लॉक-इन होता है।",
            "Marathi": "जुन्या कर प्रणालीत कलम 80C अंतर्गत ₹१.५ लाखांपर्यंत करसवलत देणारा आणि केवळ ३ वर्षांचा सर्वात कमी लॉक-इन असणारा इक्विटी म्युच्युअल फंड."
        },
        "analogy": "A fast-yielding commercial orchard that lowers your current tax levy today and unlocks equity growth after just 3 seasons.",
        "indianExample": "Compared to 5-year Tax-Saver Bank FDs or 15-year PPF accounts, ELSS features the lowest lock-in and high equity compounding potential.",
        "rememberThis": {
            "English": "When investing in ELSS via monthly SIP, each individual monthly installment carries its own independent 36-month lock-in period.",
            "Hindi": "ELSS में SIP के माध्यम से निवेश करने पर प्रत्येक मासिक किस्त का अपना अलग 36 महीने का लॉक-इन होता है।",
            "Marathi": "ELSS मध्ये SIP द्वारे गुंतवणूक करताना प्रत्येक मासिक हप्त्याला स्वतंत्र ३६ महिन्यांचा लॉक-इन कालावधी लागू होतो."
        },
        "commonMistake": {
            "English": "Redeeming all ELSS units immediately at the 3-year mark during a bear market rather than letting them compound long-term.",
            "Hindi": "3 साल पूरे होते ही बाजार मंदी में होने के बावजूद तुरंत सारे यूनिट्स बेच देना, जिससे कंपाउंडिंग का लाभ रुक जाता है।",
            "Marathi": "३ वर्षे पूर्ण होताच बाजार घसरलेला असतानाही सर्व युनिट्स विकून टाकणे, ज्यामुळे दीर्घकालीन वाढ थांबते."
        },
        "mythStatement": {
            "English": "ELSS mutual fund schemes guarantee fixed government-backed returns of 15% every year.",
            "Hindi": "ELSS योजनाएं हर साल 15% का निश्चित सरकारी गारंटीड रिटर्न देने का वादा करती हैं।",
            "Marathi": "ELSS म्युच्युअल फंड योजना दरवर्षी निश्चित १५% परताव्याची सरकारी हमी देतात."
        },
        "professionTracks": ["Salaried Employees", "Freelancers & Creators"],
        "video": {
            "English": {"searchFallback": "https://www.youtube.com/results?search_query=ELSS+mutual+funds+guide+English", "title": "ELSS Tax Saving Mutual Funds Guide", "channel": "CA Rachana Ranade"},
            "Hindi": {"searchFallback": "https://www.youtube.com/results?search_query=ELSS+mutual+funds+kya+hai+Hindi", "title": "ELSS में निवेश के फायदे और 80C छूट", "channel": "Pranjal Kamra"},
            "Marathi": {"searchFallback": "https://www.youtube.com/results?search_query=ELSS+mutual+fund+Marathi", "title": "ELSS म्युच्युअल फंड म्हणजे काय? मराठी", "channel": "CA Rachana Ranade Marathi"}
        }
    }
]

print(f"Loaded {len(terms)} initial terms...")
