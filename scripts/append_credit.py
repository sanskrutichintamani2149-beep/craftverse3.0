# encoding: utf-8
from data_builder import terms, add

# =========================================================================
# 5. CREDIT (14 terms)
# =========================================================================

add(
    "credit-score", "Credit Score (CIBIL)", "Credit",
    "A 3-digit numerical summary (300–900) reflecting creditworthiness and repayment track record, computed by licensed credit bureaus such as CIBIL TransUnion, Experian, and Equifax.",
    "उधारकर्ता की साख और ऋण चुकाने के इतिहास को दर्शाने वाला 300 से 900 के बीच का 3-अंकीय स्कोर, जिसे CIBIL, Experian और Equifax जैसे लाइसेंस प्राप्त क्रेडिट ब्यूरो तैयार करते हैं।",
    "कर्जफेडीची क्षमता आणि आर्थिक विश्वासार्हता दर्शवणारा ३०० ते ९०० दरम्यानचा ३-अंकी पत निर्देशांक; हा CIBIL, Experian आणि Equifax या परवानाधारक ब्युरोंद्वारे ठरवला जातो.",
    "A clean academic character certificate issued by the school principal before granting admission into prestigious higher education universities.",
    "A CIBIL score of 750+ qualifies borrowers for preferential home loan interest rates (e.g. 8.40% vs 9.25%), saving ₹5 Lakh to ₹12 Lakh over a 20-year loan tenure.",
    "Maintain a score above 750 by repaying 100% of credit card bills and loan EMIs on or before the due date, avoiding minimum due rollovers.",
    "क्रेडिट कार्ड बिल और EMI हमेशा देय तिथि से पहले पूरी तरह चुकाएं ताकि CIBIL स्कोर 750 से ऊपर बना रहे और भविष्य में सस्ते दर पर लोन मिल सके।",
    "क्रेडिट कार्डचे बिल आणि EMI नेहमी वेळेच्या आधी पूर्ण भरा, जेणेकरून CIBIL स्कोर ७५० च्या वर राहील आणि कमी व्याजात कर्ज मिळेल.",
    "Checking your own credit score frequently will drastically degrade your CIBIL rating like a hard inquiry from a commercial bank.",
    "बार-बार अपना क्रेडिट स्कोर ऑनलाइन चेक करने से सिबिल स्कोर गिर जाता है।",
    "स्वतःचा क्रेडिट स्कोअर वेळोवेळी तपासल्याने तो कमी होतो असा चुकीचा समज बाळगणे.",
    "Closing your oldest credit card will immediately increase your credit score by reducing your total debt exposure.",
    "अपना सबसे पुराना क्रेडिट कार्ड बंद करने से आपका सिबिल स्कोर तुरंत बढ़ जाता है।",
    "जुने क्रेडिट कार्ड बंद केल्याने क्रेडिट स्कोअर त्वरित सुधारतो असा गैरसमज.",
    ["Salaried Employees", "Students & Freshers", "Startup Founders", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+explained+how+to+improve+English", "title": "Understanding CIBIL Score & Credit Reports in India", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+kya+hota+hai+kaise+badhaye+Hindi", "title": "CIBIL Score क्या है? 750+ स्कोर कैसे बनाएं", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=CIBIL+score+mhanje+kay+Marathi", "title": "CIBIL स्कोअर म्हणजे काय? कसा सुधारावा? मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "emi", "EMI (Equated Monthly Installment)", "Credit",
    "A fixed monthly payment made by a borrower to a financial lender on a predetermined calendar date to amortize both loan principal and accrued interest.",
    "उधारकर्ता द्वारा ऋण के मूलधन और ब्याज को चुकाने के लिए बैंक या वित्तीय संस्थान को हर महीने एक निश्चित तिथि पर दी जाने वाली समान मासिक किस्त।",
    "कर्जाची मुद्दल आणि व्याज फेडण्यासाठी दरमहा ठराविक तारखेला बँकेला द्यावा लागणारा समान मासिक हप्ता (EMI).",
    "A recurring monthly subscription fee paid to gradually purchase ownership of a vehicle or apartment over several years.",
    "On a ₹30 Lakh Home Loan for 20 years at 8.5% interest, the monthly EMI is ₹26,035, comprising ₹21,250 interest and ₹4,785 principal in Month 1.",
    "Limit your total household loan EMIs (home, auto, personal) to under 40% of your net monthly take-home salary to avoid debt traps.",
    "अपने सभी कर्जों की कुल मासिक EMI को अपने शुद्ध मासिक वेतन (Take-Home) के 40% से कम रखें ताकि जीवनशैली पर आर्थिक दबाव न आए।",
    "घरातील सर्व कर्जांचे मासिक हप्ते (EMI) निव्वळ पगाराच्या ४०% पेक्षा कमी ठेवा, जेणेकरून संकटाच्या वेळी अडचण येणार नाही.",
    "Opting for the longest permissible loan tenure (e.g. 30 years) just to minimize the initial monthly EMI, which doubles the total interest paid to the bank.",
    "मासिक EMI कम रखने के चक्कर में 30 साल की लंबी अवधि चुनना, जिससे बैंक को चुकाया जाने वाला कुल ब्याज मूलधन से भी अधिक हो जाता है।",
    "केवळ दरमहा कमी हप्ता बसावा म्हणून ३० वर्षांची मोठी मुदत निवडणे, ज्यामुळे मुद्दलापेक्षा जास्त व्याज बँकेला भरावे लागते.",
    "Paying EMIs on time for 12 months completely wipes out all remaining interest for the rest of the loan tenure.",
    "12 महीने समय पर EMI चुकाने से बाकी पूरे लोन का ब्याज पूरी तरह माफ हो जाता है।",
    "एक वर्ष वेळेवर EMI भरल्यास उर्वरित मुदतीचे सर्व व्याज माफ होते असा गैरसमज.",
    ["Salaried Employees", "Students & Freshers", "Food Business Owners", "Civil Engineering & Builders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=How+EMI+calculation+works+reducing+balance+English", "title": "How Loan EMI Calculation and Amortization Works", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=EMI+kaise+calculate+hoto+hai+Hindi", "title": "EMI का गणित: बैंक आपको कैसे ब्याज में फंसाते हैं", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=EMI+ganit+marathi+video", "title": "EMI म्हणजे काय? बँकेचे व्याज कसे मोजतात? मराठी", "channel": "Groww Marathi"}
)

add(
    "principal", "Principal Amount", "Credit",
    "The initial capital sum borrowed in a loan facility or deposited in an investment instrument, excluding all accumulated interest, charges, or fees.",
    "किसी ऋण में ली गई या किसी निवेश साधन में लगाई गई मूल धनराशि, जिसमें किसी भी प्रकार का ब्याज, अधिभार या शुल्क शामिल नहीं होता।",
    "कर्ज म्हणून घेतलेली किंवा गुंतवणुकीत जमा केलेली मूळ रक्कम; यात कसलेही व्याज, दंड किंवा इतर शुल्क समाविष्ट नसते.",
    "The physical base brick foundation of a building upon which decorative floors of interest are constructed.",
    "If you borrow ₹10,00,000 for a car loan, ₹10 Lakh is the Principal; the additional ₹2.5 Lakh paid over 5 years is the interest charge.",
    "Make periodic prepayments directly towards the loan principal; even one extra EMI per year towards principal cuts loan tenure by several years.",
    "हर साल कम से कम एक अतिरिक्त EMI मूलधन (Principal) चुकाने में लगाएं; इससे 20 साल का होम लोन 15 साल में समाप्त हो सकता है।",
    "दरवर्षी मूळ रकमेवर (Principal) किमान एक जादा हप्ता आगाऊ भरा; यामुळे कर्जाची मुदत कित्येक वर्षांनी कमी होते.",
    "Assuming every EMI payment in the initial years goes equally to principal reduction and interest repayment.",
    "यह मान लेना कि शुरुआती वर्षों में EMI का आधा हिस्सा सीधे मूलधन को कम करता है, जबकि शुरुआती किस्तों में 80% हिस्सा केवल ब्याज होता है।",
    "सुरुवातीच्या वर्षांमध्ये भरलेल्या हप्त्यात मुद्दल आणि व्याज समान प्रमाणात असते असा गैरसमज बाळगणे.",
    "The principal amount of a bank loan automatically decreases every month even if you skip paying your scheduled EMI.",
    "यदि आप EMI न भी भरें, तो भी बैंक लोन का मूलधन अपने आप हर महीने कम होता रहता है।",
    "हप्ता न भरल्यासही बँकेचे मूळ कर्ज आपोआप दरमहा कमी होत जाते असा भाबडा समज.",
    ["Salaried Employees", "Civil Engineering & Builders", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Principal+vs+interest+loan+amortization+English", "title": "Principal vs Interest in Loans Explained", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Loan+ka+principal+kya+hota+hai+Hindi", "title": "लोन में मूलधन (Principal) और ब्याज का अंतर", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Muddal+ani+vyaj+Marathi", "title": "कर्जाची मुद्दल आणि व्याज यातील फरक मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "interest-rate", "Interest Rate (Fixed vs Floating)", "Credit",
    "The annualized percentage rate charged by a lender for borrowing capital, which may be fixed for the tenure or floating linked to the RBI External Benchmark (EBLR).",
    "ऋणदाता द्वारा उधार दी गई पूंजी पर लिया जाने वाला वार्षिक प्रतिशत शुल्क, जो पूरे कार्यकाल के लिए स्थिर (Fixed) या RBI रेपो रेट से जुड़ा फ्लोटिंग (Floating) हो सकता है।",
    "कर्ज देण्यासाठी बँकेने आकारलेला वार्षिक व्याजदर (टक्केवारीत); हा संपूर्ण मुदतीसाठी कायम (Fixed) किंवा RBI च्या रेपो रेटशी जोडलेला (Floating) असू शकतो.",
    "The hourly rental charge paid for renting a high-performance commercial construction crane.",
    "RBI Repo Rate changes directly transmit into floating home loan rates; a 50 bps repo hike by RBI raises an 8.50% home loan to 9.00%.",
    "Opt for floating interest rates on long-term home loans as RBI regulations mandate zero prepayment penalty on floating retail loans.",
    "लंबी अवधि के होम लोन के लिए फ्लोटिंग दर चुनें क्योंकि RBI नियमानुसार फ्लोटिंग लोन को बिना किसी पेनाल्टी के कभी भी प्री-पे किया जा सकता है।",
    "गृहकर्जासाठी नेहमी फ्लोटिंग व्याजदर निवडा कारण RBI च्या नियमांनुसार फ्लोटिंग कर्जावर मुदतीपूर्व परतफेडीचा कसलाही दंड नसतो.",
    "Confusing flat interest rates advertised by unorganized auto lenders (e.g. 7% flat) with true reducing balance interest rates (which equals ~13% effective APR).",
    "फ्लैट ब्याज दर (Flat Rate) को कम समझकर धोखा खाना, जबकि फ्लैट 7% का वास्तविक प्रभावी ब्याज दर लगभग 13% होता है।",
    "फ्लॅट व्याजदराला स्वस्त समजून भुलणे, कारण ७% फ्लॅट रेटचा खरा प्रभावी व्याजदर प्रत्यक्षात १३% च्या आसपास असतो.",
    "Fixed interest rate home loans in India remain 100% frozen forever regardless of global hyperinflation or central bank statutory rate resets.",
    "फिक्स्ड रेट होम लोन का ब्याज जीवन भर कभी भी किसी भी परिस्थिति में बैंक द्वारा बदला नहीं जा सकता।",
    "फिक्स्ड व्याजदराचे कर्ज घेतल्यानंतर बँक तो दर कोणत्याही परिस्थितीत कधीही बदलू शकत नाही असा गैरसमज.",
    ["Salaried Employees", "Freelancers & Creators", "Civil Engineering & Builders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Fixed+vs+Floating+interest+rate+home+loan+India+English", "title": "Fixed vs Floating Interest Rates: Which Is Best?", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Fixed+vs+floating+interest+rate+Hindi", "title": "Fixed या Floating ब्याज दर? होम लोन का सच", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Vyajdar+fixed+floating+marathi", "title": "फिक्स्ड की फ्लोटिंग व्याजदर? कर्जदारांसाठी मार्गदर्शन मराठी", "channel": "Groww Marathi"}
)

add(
    "simple-interest", "Simple Interest", "Credit",
    "An elementary interest calculation methodology computed exclusively on the original principal amount over the loan or deposit tenure, ignoring interest compounding.",
    "ब्याज गणना की वह सरल पद्धति जिसमें ब्याज की गणना केवल मूल धनराशि पर की जाती है, और पिछले ब्याजों पर कोई अतिरिक्त ब्याज नहीं जोड़ा जाता।",
    "केवळ मूळ मुद्दलावरच ठराविक कालावधीसाठी मोजले जाणारे सरळ व्याज; यात आधीच्या व्याजावर पुन्हा व्याज आकारले जात नाही.",
    "A standard flat parking fee charged per hour without any cumulative multiplier for staying extra hours.",
    "Formula: SI = (P × R × T) ÷ 100. A ₹1,00,000 personal loan at 10% simple interest for 3 years incurs total interest of ₹30,000.",
    "Use simple interest to benchmark short-term promissory notes, but remember institutional retail loans always calculate interest on a monthly reducing balance.",
    "सरल ब्याज केवल अनौपचारिक या अल्पकालिक व्यक्तिगत समझौतों में लागू होता है; बैंक हमेशा मासिक घटते शेष पर चक्रवृद्धि ब्याज लेते हैं।",
    "सरळ व्याज केवळ साध्या व्यवहारांसाठी असते; बँकांचे सर्व गृहकर्ज आणि वाहनकर्ज नेहमी चक्रवाढ पद्धतीनेच आकारले जातात.",
    "Assuming that bank credit card revolving dues and overdue overdrafts are billed using simple interest formulas.",
    "यह मान लेना कि क्रेडिट कार्ड के बकाया बिलों पर बैंक सरल ब्याज लगाते हैं, जबकि वे 42% वार्षिक चक्रवृद्धि ब्याज वसूलते हैं।",
    "क्रेडिट कार्डच्या थकीत बिलावर सरळ व्याजाने आकारणी होते असा गैरसमज बाळगणे.",
    "All bank home loans in India calculate monthly repayments using elementary simple interest arithmetic.",
    "भारत में सभी बैंक होम लोन की गणना प्राथमिक सरल ब्याज फॉर्मूले से करते हैं।",
    "भारतातील सर्व बँक कर्जे सरळ व्याजाच्या गणितानुसार चालतात असा गैरसमज.",
    ["Students & Freshers", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Simple+interest+vs+compound+interest+explained+English", "title": "Simple vs Compound Interest Mechanics", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Simple+interest+kya+hota+hai+Hindi", "title": "साधारण ब्याज (Simple Interest) का वास्तविक अर्थ", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Saral+vyaj+Marathi", "title": "सरळ व्याज म्हणजे काय? संपूर्ण माहिती मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "compound-interest-debt", "Compound Interest on Debt", "Credit",
    "The financial dynamic where accrued unpaid interest is added back to outstanding principal, creating an escalating spiral of interest charged upon previous interest.",
    "ऋण पर लगने वाला वह चक्रवृद्धि ब्याज जिसमें न चुकाए गए ब्याज को मूलधन में जोड़ दिया जाता है, जिससे ब्याज पर भी अतिरिक्त ब्याज लगना शुरू हो जाता है।",
    "थकीत कर्जावर आकारले जाणारे चक्रवाढ व्याज; यात न भरलेले व्याज मुद्दलात जमा होऊन व्याजावरही पुन्हा व्याज आकारले जाते, ज्यामुळे कर्जाचा डोंगर उभा राहतो.",
    "A rolling snowball rolling downhill, gathering extra snow at an accelerating speed until it triggers an uncontrollable avalanche.",
    "Rolling ₹50,000 on a credit card at 3.5% monthly compound interest (42% APR) mushrooms into ₹1,03,000 in just 18 months if only minimum dues are settled.",
    "Never treat credit cards as emergency installment loans; unpaid rolling credit card balances compound exponentially daily from transaction date.",
    "क्रेडिट कार्ड को कभी भी पर्सनल लोन की तरह न समझें; न चुकाए गए बिल पर पहले ही दिन से 42% तक का भारी चक्रवृद्धि ब्याज जुड़ने लगता है।",
    "क्रेडिट कार्डच्या बिलावर चक्रवाढ व्याजाने आकारणी होते, त्यामुळे संपूर्ण बिल वेळेत भरून कर्जाच्या सापळ्यातून दूर राहा.",
    "Paying only the 'Minimum Amount Due' on monthly credit card statements, allowing compounding debt to trap you for decades.",
    "क्रेडिट कार्ड का केवल 'मिनिमम ड्यू' भरकर यह सोचना कि कर्ज खत्म हो रहा है, जबकि बाकी 95% राशि पर भारी ब्याज चक्रवृद्धित होता रहता है।",
    "केवळ 'किमान देय रक्कम' (Minimum Due) भरून कर्ज फिटत आहे असा खोटा दिलासा मानणे.",
    "Compound interest on consumer debt automatically stops compounding if you stop making phone calls to the credit card company.",
    "यदि आप बैंक के फोन उठाना बंद कर दें तो क्रेडिट कार्ड का चक्रवृद्धि ब्याज बढ़ना अपने आप रुक जाता है।",
    "बँकेशी संपर्क तोडला की कर्जावरील चक्रवाढ व्याज थांबते असा गैरसमज.",
    ["Students & Freshers", "Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+card+interest+trap+compounding+debt+English", "title": "How Credit Card Compound Interest Destroys Wealth", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+card+interest+kaise+lagta+hai+Hindi", "title": "क्रेडिट कार्ड का मिनिमम ड्यू का जाल: 42% ब्याज का सच", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Chakravadh+karj+marathi+video", "title": "कर्जावरील चक्रवाढ व्याज कसे टाळावे? मराठी माहिती", "channel": "Groww Marathi"}
)

add(
    "collateral", "Collateral & Security", "Credit",
    "A valuable tangible or financial asset pledged by a borrower to a lending institution to secure a loan facility and mitigate lender default risk.",
    "ऋण प्राप्त करने के लिए उधारकर्ता द्वारा बैंक के पास गिरवी रखी जाने वाली मूल्यवान चल या अचल संपत्ति (जैसे मकान, सोना, शेयर, FD) जो ऋणदाता के जोखिम को कम करती है।",
    "कर्ज मिळवण्यासाठी कर्जदाराने बँकेकडे तारण ठेवलेली मौल्यवान मालमत्ता (घर, सोने, शेअर्स किंवा मुदत ठेव); यामुळे बँकेचा बुडीत कर्जाचा धोका टळतो.",
    "Leaving your gold watch with a jeweler as a guaranteed pledge while you borrow cash for immediate travel expenses.",
    "Mortgaging commercial property or pledging ₹20 Lakh in mutual funds as collateral enables businesses to secure lower loan interest rates (9% vs 16%).",
    "Ensure that the market value of your pledged collateral comfortably exceeds the loan amount to avoid lender margin calls during market corrections.",
    "जब भी संपत्ति गिरवी रखें, सुनिश्चित करें कि लोन चुकाने के बाद बैंक से 'No Objection Certificate' (NOC) और मूल दस्तावेज तुरंत वापस ले लें।",
    "कर्जाची पूर्ण परतफेड झाल्यावर बँकेकडून तात्काळ ना-हरकत प्रमाणपत्र (NOC) आणि मूळ कागदपत्रे ताब्यात घ्या.",
    "Pledging essential emergency life savings or primary residential homes for highly speculative venture capital loans.",
    "सट्टेबाजी या अत्यधिक जोखिम वाले व्यवसाय के लिए अपने रहने के एकमात्र घर या आपातकालीन बचत को गिरवी रख देना।",
    "जोखमीच्या व्यवसायासाठी स्वतःचे राहते घर किंवा आणीबाणीचा फंड तारण ठेवण्याची मोठी घोडचूक करणे.",
    "Lenders can legally confiscate and sell pledged collateral without issuing any formal legal default notice to the borrower.",
    "बैंक बिना कोई नोटिस दिए किसी भी दिन आपकी गिरवी रखी संपत्ति को सीधे जब्त करके बेच सकते हैं।",
    "बँक कोणतीही कायदेशीर नोटीस न देता तारण मालमत्ता एका रात्रीत विकू शकते असा गैरसमज.",
    ["Startup Founders", "Civil Engineering & Builders", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=What+is+collateral+in+loans+India+English", "title": "Collateral and Mortgages in Secured Lending Explained", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Collateral+kya+hota+hai+Hindi", "title": "लोन में गारंटी और Collateral क्या होता है?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Taran+mhanje+kay+Marathi", "title": "तारण मालमत्ता (Collateral) म्हणजे काय? मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "secured-loan", "Secured Loan", "Credit",
    "A credit facility backed by specific borrower assets (e.g. Home Loans, Gold Loans, Loans Against Securities) offering lower interest rates and higher sanction limits.",
    "ऐसी ऋण सुविधा जो उधारकर्ता की किसी संपत्ति (जैसे मकान, सोना, शेयर या कार) की गारंटी द्वारा सुरक्षित होती है, जिसमें कम ब्याज दर और अधिक ऋण सीमा मिलती है।",
    "एखाद्या मौल्यवान मालमत्तेच्या (घर, सोने, वाहन किंवा FD) तारणावर दिलेले सुरक्षित कर्ज; यात व्याजदर कमी असतो आणि जास्त मुदतीचे कर्ज मिळते.",
    "Renting a luxury vehicle after leaving a substantial refundable security deposit with the rental agency.",
    "Home Loans and Gold Loans in India are prime secured loans; default allows the bank to invoke SARFAESI Act provisions to recover dues via auction.",
    "Prefer secured loans over expensive personal loans for major capital expenditures because interest rates are typically 400–800 bps lower.",
    "बड़े खर्चों के लिए महंगे पर्सनल लोन के बजाय हमेशा सिक्योर्ड लोन (जैसे गोल्ड लोन या लोन अगेंस्ट सिक्योरिटीज) चुनें ताकि ब्याज दर बहुत कम लगे।",
    "मोठ्या खर्चासाठी महागड्या वैयक्तिक कर्जाऐवजी (Personal Loan) नेहमी सुरक्षित कर्ज निवडा, ज्यामुळे हजारो रुपयांचे व्याज वाचते.",
    "Assuming that default on a secured loan only results in asset liquidation with zero adverse consequences for your personal CIBIL score.",
    "यह सोचना कि सिक्योर्ड लोन न चुकाने पर सिर्फ संपत्ति जब्त होगी और सिबिल स्कोर पर कोई बुरा असर नहीं पड़ेगा।",
    "सुरक्षित कर्ज थकवल्यास केवळ तारण मालमत्ता जाईल पण CIBIL स्कोअरवर परिणाम होणार नाही असा गैरसमज बाळगणे.",
    "Secured loans never charge any loan processing fees, stamp duty charges, or documentation overheads.",
    "सिक्योर्ड लोन में बैंक कभी भी कोई प्रोसेसिंग फीस, स्टांप ड्यूटी या कानूनी सत्यापन शुल्क नहीं लेते।",
    "सुरक्षित कर्जावर बँक कधीही प्रक्रिया शुल्क किंवा मुद्रांक शुल्क आकारत नाही असा गैरसमज.",
    ["Civil Engineering & Builders", "Salaried Employees", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Secured+loans+home+loan+gold+loan+explained+English", "title": "Secured Loans: Home Loans, Gold Loans & Mortgages", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Secured+loan+kya+hota+hai+Hindi", "title": "सिक्योर्ड लोन क्या है? फायदे और बैंक के नियम", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Surakshit+karj+marathi+guide", "title": "सुरक्षित कर्ज (Secured Loan) म्हणजे काय? मराठी माहिती", "channel": "Groww Marathi"}
)

add(
    "unsecured-loan", "Unsecured Loan", "Credit",
    "A debt facility issued without requiring any collateral or underlying asset pledge, approved purely on the basis of income verification, credit score, and cash flows.",
    "बिना किसी संपत्ति को गिरवी रखे दिया जाने वाला ऋण (जैसे पर्सनल लोन, क्रेडिट कार्ड, कंज्यूमर ड्यूरेबल्स लोन), जो केवल आय और CIBIL स्कोर के आधार पर स्वीकृत होता है।",
    "कसलेही तारण न ठेवता केवळ उत्पन्न आणि CIBIL स्कोअरच्या विश्वासार्हतेवर दिलेले असुरक्षित कर्ज (उदा. पर्सनल लोन, क्रेडिट कार्ड कर्ज); याचा व्याजदर जास्त असतो.",
    "A handshake emergency loan given by a trusted family physician based on your personal reputation and past character.",
    "Unsecured personal loans carry interest rates of 11% to 24% per annum, compared to 8.5% for secured housing finance.",
    "Never borrow unsecured loans to fund discretionary lifestyle consumption, holidays, or speculative stock trading.",
    "छुट्टियां मनाने, महंगी शादियों या शेयर बाजार में ट्रेडिंग करने के लिए कभी भी 14%-20% ब्याज वाला अनसिक्योर्ड पर्सनल लोन न लें।",
    "मौजमजा, सुट्ट्या किंवा शेअर बाजारातील सट्टेबाजीसाठी कधीही महागडे पर्सनल लोन घेऊ नका, अन्यथा आर्थिक संकट ओढवेल.",
    "Stacking multiple simultaneous unsecured instant app loans, triggering severe debt servicing distress and aggressive recovery harassment.",
    "सोशल मीडिया या ऐप्स से एक के बाद एक कई इंस्टेंट पर्सनल लोन लेना और फिर उनके भारी चक्रवाढ ब्याज के जाल में फंस जाना।",
    "मोबाईल ॲप्सवरून एकाच वेळी अनेक छोटी वैयक्तिक कर्जे घेणे आणि नंतर त्यांच्या जाचक व्याजदरात अडकणे.",
    "Unsecured loans are totally immune from civil court recovery decrees or legal arbitration under Indian law.",
    "अनसिक्योर्ड लोन न चुकाने पर बैंक अदालत में कोई कानूनी कार्रवाई या मध्यस्थता नहीं कर सकते।",
    "असुरक्षित कर्ज न फेडल्यास बँक कायदेशीर कारवाई करू शकत नाही असा चुकीचा समज बाळगणे.",
    ["Students & Freshers", "Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Secured+vs+Unsecured+loans+explained+India+English", "title": "Secured vs Unsecured Loans: Key Differences", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Personal+loan+unsecured+loan+Hindi+video", "title": "पर्सनल लोन का सच: क्या अनसिक्योर्ड लोन लेना चाहिए?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Asurakshit+karj+marathi", "title": "असुरक्षित कर्ज म्हणजे काय? धोके आणि सावधगिरी मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "loan-to-value", "Loan-to-Value Ratio (LTV)", "Credit",
    "A lending risk assessment ratio expressing the percentage of an asset's appraised market value that a bank will finance via debt versus borrower down payment.",
    "ऋण जोखिम मूल्यांकन अनुपात जो यह दर्शाता है कि किसी संपत्ति के कुल मूल्यांकित बाजार मूल्य का कितने प्रतिशत बैंक लोन के रूप में देगा और कितना डाउन पेमेंट करना होगा।",
    "तारण मालमत्तेच्या एकूण बाजार मूल्यापैकी किती टक्के रक्कम बँक कर्ज म्हणून मंजूर करू शकते हे दर्शवणारे गुणोत्तर (LTV Ratio); उर्वरित रक्कम डाऊन पेमेंट म्हणून द्यावी लागते.",
    "The maximum load a cargo ship can safely carry relative to its total buoyant displacement capacity.",
    "RBI caps Housing Loan LTV at 90% for loans up to ₹30 Lakh, 80% for loans between ₹30L–₹75L, and 75% for loans exceeding ₹75 Lakh.",
    "Put down a higher personal down payment (e.g. 25%–30%) to reduce your LTV ratio; lower LTV grants access to lower interest tiers and lower total interest burden.",
    "घर खरीदते समय कम से कम 20%-25% डाउन पेमेंट अपनी जेब से करें ताकि LTV अनुपात कम रहे और बैंक आपको सबसे कम ब्याज दर की पेशकश करे।",
    "घर घेताना स्वतःचे डाऊन पेमेंट जास्त करा, ज्यामुळे LTV कमी राहून बँकेकडून कमी व्याजदराचा लाभ मिळतो.",
    "Taking supplementary unsecured personal loans at 15% interest to fund the mandatory 20% down payment required on an 80% LTV home loan.",
    "होम लोन के डाउन पेमेंट का प्रबंध करने के लिए भी महंगा पर्सनल लोन ले लेना, जिससे दोनों किस्तों का भार असहनीय हो जाए।",
    "डाऊन पेमेंट भरण्यासाठीही आणखी एक वैयक्तिक कर्ज काढून दुहेरी हप्त्यांच्या ओझ्याखाली दबणे.",
    "Banks in India are authorized by RBI to grant 100% LTV financing covering full property cost plus registration stamp duty.",
    "आरबीआई बैंकों को संपत्ति की 100% लागत और रजिस्ट्री शुल्क का पूरा लोन देने की अनुमति देता है।",
    "बँका घराच्या संपूर्ण किमतीवर आणि नोंदणी शुल्कावर १००% कर्ज देतात असा गैरसमज.",
    ["Civil Engineering & Builders", "Salaried Employees", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Loan+to+value+ratio+LTV+home+loans+English", "title": "Loan to Value (LTV) Ratio in Home Loans Explained", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=LTV+kya+hota+hai+home+loan+Hindi", "title": "LTV क्या है? होम लोन में डाउन पेमेंट के RBI नियम", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=LTV+ratio+marathi+mahiti", "title": "LTV रेशो म्हणजे काय? गृहकर्जाचे नियम मराठी", "channel": "Groww Marathi"}
)

add(
    "debt-to-income", "Debt-to-Income Ratio (DTI)", "Credit",
    "A personal finance metric comparing total monthly debt obligations (EMIs) to gross monthly income, used by underwriters to measure repayment bandwidth.",
    "व्यक्तिगत वित्तीय अनुपात जो कुल मासिक ऋण देनदारियों (सभी EMI) की तुलना सकल मासिक आय से करता है, जिससे बैंक ऋण चुकाने की क्षमता मापते हैं।",
    "एकूण मासिक कर्जाचे हप्ते (EMI) आणि एकूण मासिक उत्पन्न यांचे गुणोत्तर (DTI Ratio); यावरून बँक कर्जदाराची परतफेड क्षमता तपासते.",
    "The fraction of a steam engine's boiler pressure dedicated to climbing an incline versus maintaining cabin heat.",
    "If your monthly take-home is ₹1,00,000 and total active EMIs are ₹35,000, your Debt-to-Income (DTI) ratio is exactly 35%.",
    "Target a DTI ratio strictly below 35%–40%; a DTI exceeding 50% triggers loan rejection or punitive interest loading across Indian banks.",
    "सुनिश्चित करें कि आपकी सभी EMI आपकी मासिक आय के 35%-40% से अधिक न हों; 50% से अधिक DTI होने पर बैंक नए लोन रिजेक्ट कर देते हैं।",
    "आपले सर्व मासिक हप्ते उत्पन्नाच्या ३५% ते ४०% च्या आतच मर्यादित ठेवा; DTI ५०% पेक्षा जास्त झाल्यास बँका नवीन कर्ज नाकारतात.",
    "Taking new automobile and gadget EMIs right before applying for a primary home loan, artificially inflating your DTI ratio and reducing eligibility.",
    "होम लोन के लिए आवेदन करने से ठीक पहले नई कार या महंगे फोन की EMI शुरू कर देना, जिससे होम लोन की पात्रता घट जाती है।",
    "गृहकर्जासाठी अर्ज करण्यापूर्वी नवीन महागड्या वस्तूंचे हप्ते सुरू करून स्वतःची कर्ज पात्रता कमी करून घेणे.",
    "Banks do not factor in existing active credit card debt balances when evaluating your Debt-to-Income eligibility.",
    "बैंक DTI अनुपात की गणना करते समय आपके मौजूदा क्रेडिट कार्ड बकाये को पूरी तरह अनदेखा कर देते हैं।",
    "DTI मोजताना बँका क्रेडिट कार्डच्या थकीत बिलांचा विचार करत नाहीत असा गैरसमज.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Debt+to+income+ratio+DTI+explained+English", "title": "Debt-to-Income (DTI) Ratio and Loan Eligibility", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=DTI+ratio+kya+hai+Hindi", "title": "Debt to Income Ratio क्या है? लोन रिजेक्ट होने से बचाएं", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=DTI+gunottar+marathi", "title": "कर्ज आणि उत्पन्नाचे प्रमाण (DTI) मराठी मार्गदर्शन", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "credit-utilization", "Credit Utilization Ratio (CUR)", "Credit",
    "The proportion of revolving credit currently utilized compared to the aggregate sanctioned credit limit across all credit cards, expressed as a percentage.",
    "सभी क्रेडिट कार्डों पर स्वीकृत कुल क्रेडिट सीमा की तुलना में वर्तमान में उपयोग किए गए क्रेडिट का प्रतिशत अनुपात।",
    "क्रेडिट कार्डवर मिळालेल्या एकूण पत मर्यादेच्या तुलनेत प्रत्यक्ष वापरलेल्या रकमेचे प्रमाण (टक्केवारीत); हे CIBIL स्कोअरसाठी अत्यंत महत्त्वाचे असते.",
    "The fluid level inside a fuel tank: utilizing 95% indicates an overstressed engine running on fumes.",
    "If your combined credit card limit is ₹2,00,000 and your current statement balance is ₹50,000, your Credit Utilization Ratio is 25%.",
    "Keep your aggregate Credit Utilization Ratio consistently below 30% of sanctioned limits to achieve and sustain a 780+ CIBIL score.",
    "अपने क्रेडिट कार्ड की कुल लिमिट का 30% से कम ही खर्च करें; 30% से अधिक उपयोग करने पर सिबिल स्कोर में गिरावट आती है।",
    "क्रेडिट कार्डच्या एकूण मर्यादेपैकी ३०% पेक्षा कमीच वापर करा, ज्यामुळे CIBIL स्कोअर वेगाने सुधारतो आणि ७८० च्या वर राहतो.",
    "Maxing out 90%–100% of your credit card limit each month under the mistaken belief that high usage demonstrates active creditworthiness.",
    "हर महीने कार्ड की पूरी 90%-100% लिमिट खर्च करना यह सोचकर कि इससे बैंक खुश होंगे, जबकि इससे आप 'क्रेडिट हंग्री' घोषित हो जाते हैं।",
    "दरमहा १००% मर्यादा वापरल्यास बँक खुश होईल असा चुकीचा समज बाळगणे; यामुळे पत ब्युरो तुम्हाला जोखमीचे ग्राहक मानतात.",
    "Keeping your Credit Utilization at exactly 0% by never using your card for 3 years builds the highest possible credit score.",
    "कार्ड का बिल्कुल इस्तेमाल न करके 0% उपयोगिता रखने से सबसे बेहतरीन सिबिल स्कोर बनता है।",
    "क्रेडिट कार्डचा अजिबात वापर न केल्यास सर्वोत्तम CIBIL स्कोअर मिळतो असा गैरसमज.",
    ["Students & Freshers", "Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+utilization+ratio+explained+CIBIL+English", "title": "How Credit Utilization Ratio Affects Your CIBIL Score", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+utilization+ratio+Hindi+video", "title": "Credit Utilization Ratio 30% क्यों होना चाहिए?", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+vapar+gunottar+marathi", "title": "क्रेडिट युटिलायझेशन रेशो म्हणजे काय? मराठी माहिती", "channel": "Groww Marathi"}
)

add(
    "minimum-due", "Minimum Due (Credit Card Trap)", "Credit",
    "The nominal token payment (typically 5% of statement balance) required by card issuers to prevent default reporting while billing exorbitant compound interest on remainder.",
    "क्रेडिट कार्ड कंपनियों द्वारा मांगा जाने वाला न्यूनतम टोकन भुगतान (आमतौर पर बिल का 5%), जो केवल लेट फीस से बचाता है लेकिन बाकी 95% पर 42% का भारी ब्याज लगाता है।",
    "क्रेडिट कार्ड कंपनीने मागितलेली किमान नाममात्र रक्कम (साधारणपणे ५%); ही भरल्यास केवळ दंड टळतो पण उर्वरित ९५% रकमेवर दरमहा जाचक चक्रवाढ व्याज सुरू राहते.",
    "Throwing a single life-buoy to keep your head above water while a submarine anchor drags your feet into deep financial ocean debt.",
    "Paying only the ₹2,500 minimum due on a ₹50,000 credit card bill leaves ₹47,500 accruing ~3.5% monthly compound interest plus 18% GST on interest charges.",
    "Always pay the 'Total Amount Due' in full before the billing due date; setting up bank auto-debit for total dues eliminates interest forever.",
    "हमेशा 'Total Amount Due' (कुल देय राशि) का पूरा भुगतान करें; केवल 'Minimum Amount Due' भरना कर्ज के कभी न खत्म होने वाले दलदल में फंसना है।",
    "नेहमी 'Total Amount Due' ची पूर्ण रक्कमच भरा; केवळ 'Minimum Due' भरत राहिल्यास आयुष्यभर कर्जाच्या विळख्यात अडकून राहाल.",
    "Assuming that paying the Minimum Amount Due pauses interest accumulation on your remaining credit card purchases.",
    "यह मान लेना कि मिनिमम ड्यू भरने के बाद बाकी बचे पैसे पर कोई ब्याज नहीं लगेगा और वह ब्याज-मुक्त रहेगा।",
    "किमान देय रक्कम भरल्यावर उर्वरित रकमेवर व्याज लागत नाही असा गोड गैरसमज बाळगणे.",
    "Minimum Amount Due payments contribute directly toward rapid principal reduction of your credit card balance.",
    "मिनिमम ड्यू भरने से आपके कार्ड का मूल बकाया कर्ज बहुत तेजी से कम होता है।",
    "किमान देय रक्कम भरल्याने मूळ कर्ज वेगाने फिटते असा खोटा समज.",
    ["Students & Freshers", "Salaried Employees", "Freelancers & Creators"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Credit+card+minimum+amount+due+trap+English", "title": "The Minimum Amount Due Trap: How Banks Profit", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Minimum+amount+due+kya+hota+hai+Hindi", "title": "क्रेडिट कार्ड का Minimum Due कभी मत भरना! पूरा सच", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Minimum+due+trap+marathi", "title": "क्रेडिट कार्ड मिनिमम ड्यूचा धोका मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "apr", "APR (Annual Percentage Rate)", "Credit",
    "The comprehensive annualized cost of credit reflecting the nominal interest rate along with processing fees, administrative charges, and mandatory insurance premiums.",
    "ऋण की वास्तविक व्यापक वार्षिक लागत, जिसमें बैंक की नाममात्र ब्याज दर के अलावा प्रोसेसिंग फीस, दस्तावेजीकरण शुल्क और अनिवार्य बीमा लागतें भी शामिल होती हैं।",
    "कर्जाचा खरा सर्वसमावेशक वार्षिक खर्च (APR); यात बँकेच्या व्याजदराव्यतिरिक्त प्रक्रिया शुल्क, विमा आणि इतर सर्व छुपे खर्च एकत्र मोजले जातात.",
    "The total on-road price of a motor vehicle including road tax, insurance, and registration—not just the ex-showroom factory sticker price.",
    "A 12% personal loan with a 3% upfront processing fee and mandatory credit life cover actually has a true effective APR of ~15.2%.",
    "Always compare retail loans by APR rather than headline interest rates to detect hidden loan origination and processing fees.",
    "हमेशा विभिन्न बैंकों के लोनों की तुलना APR (वार्षिक प्रतिशत दर) के आधार पर करें ताकि छिपे हुए प्रोसेसिंग और इंश्योरेंस शुल्क सामने आ सकें।",
    "कर्जांची तुलना करताना केवळ व्याजदर न पाहता APR तपासा, जेणेकरून बँकेचे छुपे खर्च आणि प्रक्रिया शुल्क लक्षात येईल.",
    "Comparing loan offers solely on headline nominal interest rates while ignoring massive 3%–5% upfront processing and documentation fee deductions.",
    "केवल कम ब्याज दर देखकर लोन ले लेना और यह न देखना कि बैंक ने लोन राशि से 5% प्रोसेसिंग फीस पहले ही काट ली है।",
    "केवळ वरवरचा व्याजदर पाहून भुलणे आणि बँकेने घेतलेल्या ५% छुपे प्रक्रिया शुल्काकडे दुर्लक्ष करणे.",
    "The nominal advertised interest rate and true APR are legally mandated to be 100% identical on all consumer lending products.",
    "विज्ञापन में दिखाया गया ब्याज दर और वास्तविक APR सभी लोनों में हमेशा बिल्कुल एक समान होना अनिवार्य है।",
    "जाहिरातीतील व्याजदर आणि प्रत्यक्ष APR हे दोन्ही नेहमी एकसारखेच असतात असा गैरसमज.",
    ["Salaried Employees", "Startup Founders", "Food Business Owners"],
    {"searchFallback": "https://www.youtube.com/results?search_query=APR+vs+interest+rate+explained+India+English", "title": "Annual Percentage Rate (APR) vs Interest Rate Explained", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=APR+kya+hota+hai+loan+Hindi", "title": "APR क्या है? लोन के छिपे हुए खर्चे कैसे पहचानें", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=APR+vyajdar+marathi", "title": "APR म्हणजे काय? कर्जाचे छुपे खर्च मराठी", "channel": "Groww Marathi"}
)

print(f"Credit terms added. Total now: {len(terms)}")
