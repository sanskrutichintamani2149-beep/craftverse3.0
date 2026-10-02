# encoding: utf-8
import sys
import json
import os

# Import terms from data_builder
from data_builder import terms, add

# =========================================================================
# 2. INCOME (8 terms)
# =========================================================================
add(
    "gross-vs-net-salary", "Gross Salary vs Net Salary", "Income",
    "Gross Salary is the aggregate compensation before statutory withholdings, while Net Salary is the actual disposable income credited to your bank account.",
    "सकल वेतन (Gross Salary) कटौतियों से पहले की कुल वेतन राशि है, जबकि शुद्ध वेतन (Net Salary) टैक्स और PF कटने के बाद बैंक खाते में जमा होने वाली वास्तविक राशि है।",
    "स्थूल वेतन (Gross Salary) म्हणजे सर्व कपातींपूर्वीचा एकूण पगार, तर निव्वळ वेतन (Net Salary) म्हणजे कर आणि PF कपातीनंतर प्रत्यक्ष बँक खात्यात जमा होणारी रक्कम.",
    "Gross is the total restaurant bill printout; Net is the remaining cash in your wallet after settling all mandatory taxes and service charges.",
    "On a ₹10,00,000 Gross Salary, mandatory deductions (EPF ₹43,200, Professional Tax ₹2,500, TDS ₹40,000) yield a Net take-home of ~₹9,14,300 (~₹76,190/month).",
    "Always negotiate salary revisions and structure your household budget based on monthly Net Salary, not the annual Gross figure.",
    "अपनी मासिक EMI और जीवनशैली का बजट हमेशा शुद्ध वेतन (Net Salary) के आधार पर बनाएं, न कि ग्रॉस सैलरी पर।",
    "घरखर्च आणि मासिक EMI चे नियोजन नेहमी निव्वळ (Net) पगारावर करावे, ग्रॉस पगारावर नव्हे.",
    "Committing to apartment rent or vehicle loans based on Gross Salary before accounting for employee provident fund and tax withholdings.",
    "ग्रॉस सैलरी देखकर अधिक किराए का मकान या महंगी कार लोन लेना और फिर इन-हैंड सैलरी कम पड़ने पर कर्ज में फंसना।",
    "ग्रॉस पगाराच्या आकड्यावर भुलून मोठे कर्ज घेणे आणि प्रत्यक्षात हातात कमी पगार आल्यावर अडचणीत येणे.",
    "Gross Salary is the guaranteed amount that the employer must credit to your savings bank account each month.",
    "ग्रॉस सैलरी वह निश्चित राशि है जो नियोक्ता को हर महीने कर्मचारी के बैंक खाते में जमा करनी ही होती है।",
    "ग्रॉस पगार म्हणजे दरमहा बँक खात्यात जमा होणारी निश्चित हमीची रक्कम.",
    ["Salaried Employees", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Gross+vs+Net+Salary+explained+English", "title": "Gross Salary vs Net In-Hand Salary Breakdown", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Gross+Salary+aur+Net+Salary+me+antar+Hindi", "title": "Gross vs Net Salary में क्या अंतर है?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Gross+ani+Net+salary+Marathi", "title": "ग्रॉस पगार आणि नेट पगार यातील फरक", "channel": "Groww Marathi"}
)

add(
    "ctc", "CTC (Cost to Company)", "Income",
    "The total annual expense an enterprise incurs to employ an individual, encompassing direct salary, employer PF contribution, gratuity provision, medical insurance, and variable incentives.",
    "कंपनी द्वारा किसी कर्मचारी पर किया जाने वाला कुल वार्षिक वित्तीय व्यय, जिसमें मूल वेतन, भत्ते, नियोक्ता का PF अंशदान, ग्रेच्युटी और स्वास्थ्य बीमा शामिल होते हैं।",
    "कंपनीने एका कर्मचाऱ्यासाठी केलेला एकूण वार्षिक आर्थिक खर्च; यात मूळ पगार, भत्ते, कंपनीचा PF हिस्सा, ग्रॅच्युइटी आणि आरोग्य विम्याचा समावेश असतो.",
    "The total ticket price paid for a chartered flight including fuel, runway taxes, baggage handling, and maintenance—not just the seat.",
    "A ₹15 LPA CTC job offer typically results in ~₹95,000–₹1,02,000 monthly in-hand credit after deducting statutory EPF, gratuity reserves, and monthly TDS.",
    "Deconstruct every job offer letter by isolating Fixed Basic Salary from Variable Pay, Retention Bonuses, and Employer Retirement Provisions.",
    "जॉब ऑफर स्वीकारते समय हमेशा फिक्स्ड बेसिक सैलरी और वैरिएबल पे व ग्रेच्युटी प्रोविजन को अलग-अलग करके वास्तविक इन-हैंड की गणना करें।",
    "नोकरीची ऑफर स्वीकारताना व्हेरिएबल पे आणि ग्रॅच्युइटी वेगळी करून दरमहा प्रत्यक्ष किती रक्कम खात्यात येईल ते आधी तपासा.",
    "Dividing annual CTC by 12 and expecting that exact rupee amount to be credited to your bank account at the end of the month.",
    "वार्षिक CTC को 12 से भाग देकर यह मान लेना कि हर महीने के अंत में उतनी पूरी नकदी खाते में जमा होगी।",
    "वार्षिक CTC ला १२ ने भागून तेवढाच पगार दरमहा खात्यात येईल अशी भाबडी अपेक्षा ठेवणे.",
    "CTC represents pure monthly cash in hand that you are free to spend or invest immediately upon receipt.",
    "CTC पूरी तरह से नकद वेतन है जिसे कर्मचारी अपनी इच्छानुसार तुरंत खर्च या निवेश कर सकता है।",
    "CTC म्हणजे दरमहा हातात मिळणारी रोख रक्कम असून ती लगेच हवी तशी खर्च करता येते.",
    ["Salaried Employees", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Cost+to+Company+CTC+breakup+explained+English", "title": "How CTC Breakup Works in Indian Companies", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=CTC+kya+hota+hai+salary+breakup+Hindi", "title": "CTC क्या होता है? Salary Slip का सच", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=CTC+mhanje+kay+Marathi", "title": "CTC म्हणजे काय? पगार कसा ठरतो?", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "take-home-salary", "Take-Home Salary & Perquisites", "Income",
    "The net liquid compensation disbursed into an employee's bank account after all statutory obligations, employer retirement deductions, and tax withholdings have been satisfied.",
    "सभी वैधानिक कटौतियों, भविष्य निधि अंशदान और आयकर (TDS) के समायोजन के बाद कर्मचारी के बैंक खाते में जमा होने वाला वास्तविक शुद्ध नकद वेतन।",
    "सर्व वैधानिक कपाती, भविष्य निर्वाह निधी आणि प्राप्तिकर वजा केल्यानंतर कर्मचाऱ्याच्या बँक खात्यात प्रत्यक्ष जमा होणारा निव्वळ पगार.",
    "The net harvest grains delivered into your home granary after paying field rent, seed reserves, and statutory grain levies.",
    "Includes non-monetary perquisites under Section 17(2) such as company car leases, subsidized accommodation, or stock options, taxed according to prescribed valuation rules.",
    "Calculate your savings rate (e.g. 20%–30%) strictly against your actual monthly Take-Home Salary rather than your gross CTC.",
    "अपनी मासिक बचत और निवेश दर (20%-30%) की गणना हमेशा वास्तविक टेक-होम सैलरी के आधार पर करें।",
    "गुंतवणुकीचे आणि बचतीचे प्रमाण (२०%-३०%) नेहमी प्रत्यक्ष टेक-होम पगारावर ठरवावे.",
    "Including non-cash company perquisites (like health insurance coverage or gym allowances) in your liquid monthly budget calculations.",
    "कंपनी द्वारा दी जाने वाली गैर-नकद सुविधाओं को अपने मासिक नकदी बजट में जोड़कर अधिक खर्च की योजना बनाना।",
    "कंपनीच्या बिगर-रोख सवलतींचा विचार करून रोख पैशांचे अवाजवी बजेट आखणे.",
    "Your Take-Home Salary remains completely fixed and identical under both the Old and New Tax Regimes.",
    "पुरानी और नई दोनों कर व्यवस्थाओं में आपकी टेक-होम सैलरी हमेशा बिल्कुल समान रहती है।",
    "जुनी आणि नवीन कर प्रणालीत प्रत्यक्ष मिळणारा टेक-होम पगार नेहमी अगदी सारखाच राहतो.",
    ["Salaried Employees", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Take+home+salary+calculator+India+English", "title": "Calculating True Take-Home Salary in India", "channel": "Finnovate"},
    {"searchFallback": "https://www.youtube.com/results?search_query=In+hand+salary+kaise+nikale+Hindi", "title": "इन-हैंड सैलरी कैसे निकालें? आसान तरीका", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Take+home+salary+Marathi", "title": "हातात येणारा पगार (Take-Home) कसा मोजायचा?", "channel": "Groww Marathi"}
)

add(
    "hra", "HRA (House Rent Allowance)", "Income",
    "A designated component of salary compensation provided by employers to meet expenditure incurred on rented residential accommodation, eligible for tax exemption under Section 10(13A).",
    "नियोक्ता द्वारा आवासीय किराए के खर्च की भरपाई के लिए दिया जाने वाला वेतन घटक, जिस पर आयकर अधिनियम की धारा 10(13A) के तहत वैध कर छूट प्राप्त होती है।",
    "भाड्याच्या घरात राहणाऱ्या कर्मचाऱ्यांना घरभाड्याच्या खर्चासाठी मिळणारा पगार घटक, ज्यावर कलम 10(13A) अंतर्गत कायदेशीर करसवलत मिळते.",
    "A corporate housing stipend designed to offset metropolitan living costs without artificially inflating your base taxable compensation.",
    "Exemption is computed as the minimum of: 1) Actual HRA received; 2) 50% of Basic (Metros: Mumbai, Delhi, Kolkata, Chennai) or 40% (Non-metros); 3) Rent paid minus 10% of Basic salary.",
    "If annual rent paid exceeds ₹1,00,000, quoting the landlord's Permanent Account Number (PAN) on your declaration is a mandatory statutory requirement.",
    "यदि वार्षिक किराया ₹1 लाख से अधिक है, तो मकान मालिक का PAN देना अनिवार्य है; फर्जी किराए की रसीदें आयकर नोटिस का कारण बन सकती हैं।",
    "वार्षिक भाडे ₹१ लाखांपेक्षा जास्त असल्यास घरमालकाचा पॅन देणे कायद्याने बंधनकारक आहे.",
    "Paying rent in untraceable cash without bank transfer proof, rent agreements, or rent receipts, making the claim indefensible during income tax scrutiny.",
    "बिना बैंक ट्रांसफर, रेंट एग्रीमेंट या पक्की रसीद के नकद में किराया देना, जिससे जांच के समय छूट रद्द हो सकती है।",
    "बँक खात्यातून भाडे न देता रोखीने देणे आणि भाडेकरार किंवा अधिकृत पावत्या नसणे, ज्यामुळे करसवलत नाकारली जाऊ शकते.",
    "Employees can claim HRA tax exemption while simultaneous claiming interest deduction on a self-occupied home loan in the same city without justification.",
    "कर्मचारी एक ही शहर में अपने खुद के घर पर होम लोन छूट और HRA छूट दोनों बिना किसी ठोस कारण के एक साथ ले सकते हैं।",
    "एकाच शहरात स्वतःचे घर असताना आणि त्यात राहत असतानाही HRA वर करसवलत मिळवता येते असा गैरसमज.",
    ["Salaried Employees"],
    {"searchFallback": "https://www.youtube.com/results?search_query=House+Rent+Allowance+HRA+rules+English", "title": "HRA Exemption Formula and Rules", "channel": "ClearTax"},
    {"searchFallback": "https://www.youtube.com/results?search_query=HRA+tax+saving+Hindi+video", "title": "HRA से टैक्स कैसे बचाएं? पूरे नियम", "channel": "Asset Yogi"},
    {"searchFallback": "https://www.youtube.com/results?search_query=HRA+Marathi+mahiti", "title": "HRA घरभाडे भत्ता सवलत मराठी माहिती", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "pf-epf", "PF / EPF (Employee Provident Fund)", "Income",
    "A statutory retirement savings scheme governed by the Employees' Provident Fund Organisation (EPFO), where employee and employer each contribute 12% of basic wages monthly.",
    "कर्मचारी भविष्य निधि संगठन (EPFO) द्वारा संचालित एक अनिवार्य सेवानिवृत्ति बचत योजना, जिसमें कर्मचारी और नियोक्ता प्रत्येक मूल वेतन का 12% मासिक योगदान करते हैं।",
    "कर्मचारी भविष्य निर्वाह निधी संघटना (EPFO) द्वारे चालवली जाणारी वैधानिक निवृत्ती बचत योजना, ज्यात कर्मचारी आणि कंपनी दोघेही मूळ पगाराच्या १२% रक्कम दरमहा जमा करतात.",
    "A government-guaranteed automated vault where a portion of every paycheck is matched by your employer and sealed to compound for your twilight years.",
    "Backed by a sovereign guarantee, EPF currently delivers an attractive ~8.25% annual interest rate, with interest credited tax-free up to ₹2.5 Lakh annual employee contribution.",
    "Always link and transfer your EPF account using your Universal Account Number (UAN) across job changes instead of closing the account early.",
    "नौकरी बदलते समय अपना EPF पैसा निकालने के बजाय UAN के माध्यम से नई कंपनी में ट्रांसफर करें ताकि चक्रवृद्धि ब्याज जारी रहे।",
    "नोकरी बदलताना EPF ची रक्कम काढून न घेता UAN द्वारे ती नवीन कंपनीत वर्ग करावी, ज्यामुळे चक्रवाढीचा फायदा टिकून राहतो.",
    "Withdrawing EPF balance before completing 5 years of continuous service, which renders the entire withdrawal taxable as salary income.",
    "5 साल की निरंतर सेवा पूरी होने से पहले EPF निकाल लेना, जिससे पूरी राशि पर टैक्स लग जाता है।",
    "५ वर्षांची सलग सेवा पूर्ण होण्यापूर्वी EPF मधून पैसे काढणे, ज्यामुळे संपूर्ण रकमेवर पूर्वलक्ष्यी प्रभावाने कर आकारला जातो.",
    "The entire 12% employer contribution goes directly and solely into your EPF account balance.",
    "नियोक्ता का पूरा 12% अंशदान सीधे आपके EPF खाते में जमा होता है (जबकि 8.33% EPS पेंशन में जाता है)।",
    "कंपनीचा संपूर्ण १२% हिस्सा केवळ तुमच्या EPF खात्यात जमा होतो (८.३३% हिस्सा EPS पेन्शन योजनेत जातो).",
    ["Salaried Employees", "Students & Freshers"],
    {"searchFallback": "https://www.youtube.com/results?search_query=EPF+PF+rules+and+interest+rate+English", "title": "EPF Complete Guide: Interest, UAN & Rules", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=PF+ka+paisa+kaise+check+kare+Hindi", "title": "PF क्या है और UAN से कैसे ट्रांसफर करें", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=EPF+passbook+UAN+Marathi", "title": "EPF आणि UAN संपूर्ण मराठी मार्गदर्शक", "channel": "Groww Marathi"}
)

add(
    "nps", "NPS (National Pension System)", "Income",
    "A voluntary, market-linked, defined-contribution retirement platform regulated by PFRDA, offering low-cost fund management across equity, corporate bonds, and government debt.",
    "PFRDA द्वारा विनियमित एक स्वैच्छिक, बाजार-आधारित पेंशन योजना, जो इक्विटी, कॉर्पोरेट बॉन्ड और सरकारी प्रतिभूतियों में न्यूनतम लागत पर निवेश की सुविधा देती है।",
    "PFRDA द्वारे नियंत्रित एक ऐच्छिक आणि बाजारपेठेशी जोडलेली निवृत्ती योजना, जी अत्यंत कमी खर्चात समभाग, कॉर्पोरेट रोखे आणि सरकारी कर्जरोख्यांमध्ये गुंतवणूक करते.",
    "A multi-lane pension expressway allowing you to dial your preferred mix of equity horsepower and government bond stability until age 60.",
    "Offers exclusive additional tax deduction of up to ₹50,000 under Section 80CCD(1B) under the Old Regime, plus up to 14% employer contribution deduction under 80CCD(2) in both regimes.",
    "At retirement (age 60), 60% of the accumulated corpus can be withdrawn completely tax-free, while the remaining 40% must be used to purchase a monthly annuity.",
    "60 वर्ष की आयु में कुल जमा राशि का 60% पूरी तरह से टैक्स-फ्री निकाला जा सकता है, जबकि 40% से नियमित पेंशन (Annuity) खरीदी जाती है।",
    "वयाच्या ६० व्या वर्षी जमा झालेल्या रकमेतील ६०% रक्कम पूर्णपणे करमुक्त काढता येते, तर उरलेल्या ४०% रकमेतून दरमहा पेन्शन देणारी अ‍ॅन्युइटी खरेदी करावी लागते.",
    "Opting for 100% government debt in your 20s and missing out on equity compounding during your prime working decades.",
    "20-25 वर्ष की उम्र में NPS में केवल सरकारी बॉन्ड चुनना और इक्विटी के लंबे समय के चक्रवृद्धि विकास से वंचित रह जाना।",
    "तरुण वयात NPS मध्ये केवळ सरकारी रोखे निवडणे आणि समभागांच्या दीर्घकालीन चक्रवाढ परताव्याला मुकणे.",
    "NPS investments are locked until age 60 with zero provisions for partial withdrawals for emergencies or higher education.",
    "NPS का पैसा 60 साल तक पूरी तरह से ब्लॉक रहता है और बच्चों की पढ़ाई या मेडिकल इमरजेंसी के लिए भी नहीं निकाला जा सकता।",
    "NPS मधील निधी वयाच्या ६० वर्षांपर्यंत पूर्णपणे बंदिस्त असतो आणि गंभीर कारणांसाठीही त्यातून रक्कम काढता येत नाही.",
    ["Salaried Employees", "Freelancers & Creators", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=National+Pension+System+NPS+guide+English", "title": "National Pension System (NPS) Explained", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=NPS+kya+hai+pension+yojana+Hindi", "title": "NPS में निवेश के नियम और टैक्स लाभ", "channel": "Asset Yogi"},
    {"searchFallback": "https://www.youtube.com/results?search_query=NPS+pension+Marathi+mahiti", "title": "NPS राष्ट्रीय पेन्शन योजना मराठी", "channel": "Groww Marathi"}
)

add(
    "gratuity", "Gratuity", "Income",
    "A statutory statutory retirement benefit payable by employers under the Payment of Gratuity Act 1972 to employees rendering five or more years of continuous service.",
    "ग्रेच्युटी भुगतान अधिनियम 1972 के तहत 5 वर्ष या उससे अधिक की निरंतर सेवा पूरी करने वाले कर्मचारियों को नियोक्ता द्वारा दिया जाने वाला एकमुश्त वैधानिक सेवानिवृत्ति लाभ।",
    "ग्रॅच्युइटी कायदा १९७२ अंतर्गत सलग ५ किंवा त्यापेक्षा जास्त वर्षे सेवा पूर्ण केलेल्या कर्मचाऱ्यांना कंपनीकडून दिला जाणारा एकरकमी वैधानिक कृतज्ञता लाभ.",
    "An employer loyalty bonus mandated by Parliament to honor five or more years of dedicated tenure at the organization.",
    "Formula: (15 × Last Drawn Basic Salary + DA × Completed Years of Service) ÷ 26. Cumulative gratuity up to ₹20 Lakh is completely exempt from income tax under Section 10(10).",
    "Ensure you complete at least 4 years and 240 working days in a company to legally qualify for the mandatory gratuity benefit upon resignation.",
    "कंपनी छोड़ने से पहले सुनिश्चित करें कि आपने 5 वर्ष (या 4 साल 240 दिन) की सेवा पूरी कर ली है ताकि ग्रेच्युटी का कानूनी अधिकार सुरक्षित रहे।",
    "राजीनामा देण्यापूर्वी सलग ५ वर्षे (किंवा ४ वर्षे २४० दिवस) सेवा पूर्ण झाली आहे का ते तपासा, जेणेकरून ग्रॅच्युइटीचा कायदेशीर हक्क अबाधित राहील.",
    "Allowing an employer to withhold gratuity due to routine resignation or general business economic slowdowns.",
    "यह मान लेना कि सामान्य त्यागपत्र देने पर कंपनी ग्रेच्युटी की वैधानिक राशि रोकने का अधिकार रखती है।",
    "राजीनामा दिल्यामुळे कंपनी ग्रॅच्युइटी रोखून धरू शकते असा चुकीचा समज करून घेणे.",
    "Gratuity is paid out of regular monthly deductions from the employee's net take-home salary each month.",
    "ग्रेच्युटी कर्मचारी के मासिक वेतन से काटी जाने वाली राशि से दी जाती है (जबकि यह 100% नियोक्ता द्वारा वहन किया जाने वाला खर्च है)।",
    "ग्रॅच्युइटी ही कर्मचाऱ्याच्या दरमहा पगारातून कापून गोळा केली जाणारी रक्कम असते.",
    ["Salaried Employees"],
    {"searchFallback": "https://www.youtube.com/results?search_query=Payment+of+Gratuity+Act+rules+calculation+English", "title": "Gratuity Calculation Formula and Tax Rules", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Gratuity+kaise+calculate+kare+Hindi", "title": "ग्रेच्युटी कैसे मिलती है और कब मिलती है?", "channel": "Labor Law Advisor"},
    {"searchFallback": "https://www.youtube.com/results?search_query=Gratuity+calculation+Marathi", "title": "ग्रॅच्युइटी नियम आणि कॅल्क्युलेशन मराठी", "channel": "CA Rachana Ranade Marathi"}
)

add(
    "esops", "ESOPs (Employee Stock Ownership Plans)", "Income",
    "Equity compensation granting employees the legal right to purchase shares of the employer company at a predetermined exercise price after completing a defined vesting schedule.",
    "कर्मचारियों को एक निर्धारित वेस्टिंग अवधि के बाद पूर्व-निश्चित रियायती मूल्य पर कंपनी के शेयर खरीदने का कानूनी अधिकार देने वाली इक्विटी प्रोत्साहन योजना।",
    "विहित सेवा कालावधी पूर्ण केल्यावर कर्मचाऱ्यांना पूर्व-निश्चित सवलतीच्या दरात कंपनीचे समभाग खरेदी करण्याचा कायदेशीर अधिकार देणारी इक्विटी योजना.",
    "Holding a VIP golden key to ownership in the venture that grows exponentially in value as the enterprise succeeds.",
    "Subject to dual taxation in India: Perquisite tax at exercise on the spread (FMV minus Exercise Price), and Capital Gains tax upon ultimate share sale.",
    "Always analyze the company's realistic path to liquidity (IPO or secondary buyback) and exercise tax obligations before investing personal funds into unlisted ESOPs.",
    "अनलिस्टेड स्टार्टअप्स में ESOPs एक्सरसाइज करने से पहले कंपनी की लिक्विडिटी योजना और उस पर लगने वाले पर्क्विजिट टैक्स का आकलन अवश्य करें।",
    "खाजगी स्टार्टअप्सचे ESOPs खरेदी करण्यापूर्वी कंपनीच्या IPO किंवा शेअर्स विक्रीच्या संधी आणि देय प्राप्तिकराचा नीट विचार करा.",
    "Failing to account for the heavy upfront perquisite income tax liability due at the time of exercising options before any actual cash is realized.",
    "शेयर एक्सरसाइज करते समय लगने वाले भारी पर्क्विजिट टैक्स की अनदेखी करना, भले ही शेयर अभी बाजार में बिके न हों।",
    "शेअर्स प्रत्यक्ष विकण्यापूर्वी केवळ खरेदी केल्यावर द्याव्या लागणाऱ्या मोठ्या पर्क्विझिट कराची तरतूद न ठेवणे.",
    "ESOP grants represent immediate free shares credited directly into your personal Demat account on day one of employment.",
    "ESOP का मतलब है कि नौकरी के पहले ही दिन कंपनी के शेयर आपके डीमैट खाते में मुफ्त में ट्रांसफर हो जाते हैं।",
    "ESOP म्हणजे नोकरीच्या पहिल्याच दिवशी कंपनीचे मोफत शेअर्स तुमच्या डिमॅट खात्यात जमा होतात.",
    ["Salaried Employees", "Startup Founders"],
    {"searchFallback": "https://www.youtube.com/results?search_query=ESOPs+explained+vesting+exercise+taxation+English", "title": "ESOPs Explained: Vesting, Exercise & Tax", "channel": "Zerodha Varsity"},
    {"searchFallback": "https://www.youtube.com/results?search_query=ESOP+kya+hota+hai+Hindi+guide", "title": "ESOPs क्या हैं? स्टार्टअप शेयर्स का सच", "channel": "Pranjal Kamra"},
    {"searchFallback": "https://www.youtube.com/results?search_query=ESOP+Marathi+mahiti", "title": "ESOP शेअर्स म्हणजे काय? मराठी माहिती", "channel": "Groww Marathi"}
)

print(f"Income terms added. Total now: {len(terms)}")
