'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Globe, Check, Lock, Zap, Smartphone, WifiOff, CheckCircle2 } from 'lucide-react';
import styles from './PrivacyTrustModal.module.css';

interface LangContent {
  name: string;
  flag: string;
  title: string;
  subtitle: string;
  simpleExplanation: string;
  scenarioTitle: string;
  scenarioText: string;
  b1Title: string;
  b1Desc: string;
  b2Title: string;
  b2Desc: string;
  b3Title: string;
  b3Desc: string;
  b4Title: string;
  b4Desc: string;
  verifyTitle: string;
  verifyStep1: string;
  verifyStep2: string;
  verifyStep3: string;
  verifyNote: string;
  dontShow: string;
  gotIt: string;
}

const LANGUAGES: Record<string, LangContent> = {
  hi: {
    name: 'हिंदी (Hindi)',
    flag: '🇮🇳',
    title: 'आपकी फाइलें आपके डिवाइस पर ही प्रोसेस होती हैं — जानिए कैसे!',
    subtitle: '100% क्लाइंट-साइड प्रोसेसिंग • आपकी फाइल्स कभी किसी सर्वर पर नहीं जातीं',
    simpleExplanation: 'दूसरी वेबसाइट्स पर जब आप कोई फोटो या PDF डालते हैं, तो वह इंटरनेट के जरिए उनके सर्वर (कंप्यूटर) पर अपलोड हो जाती है। लेकिन ToolsforTools पर ऐसा बिल्कुल नहीं होता! हमारी वेबसाइट आपकी किसी भी फाइल को हमारे पास नहीं मंगवाती और न ही कहीं सेव करती है।',
    scenarioTitle: '💡 एक आसान उदाहरण (Real-Life Scenario):',
    scenarioText: 'सोचिए आपने अपने फोन में कैलकुलेटर ऐप खोला और 500 + 500 जोड़ा। क्या आपका फोन यह हिसाब लगाने के लिए इंटरनेट पर किसी को डेटा भेजता है? बिल्कुल नहीं! सारा हिसाब आपके फोन के अंदर ही होता है।\n\nठीक वैसे ही, ToolsforTools पर जब आप कोई PDF मर्ज करते हैं या फोटो कंप्रेस करते हैं, तो सब कुछ आपके फोन या लैपटॉप के अंदर ही प्रोसेस होता है। फाइल आपके डिवाइस से 1 इंच भी बाहर नहीं जाती! आप इंटरनेट बंद (Airplane Mode) करके भी चलाएंगे, तब भी ये टूल्स 100% चलेंगे। इसलिए आपके आधार कार्ड, बैंक स्टेटमेंट और प्राइवेट फोटो हमेशा आपके पास ही पूरी तरह सुरक्षित रहते हैं।',
    b1Title: 'फोन से बाहर कभी नहीं जाता',
    b1Desc: 'आपकी फाइल आपके डिवाइस में ही रहती है, हमारे सर्वर तक नहीं पहुंचती।',
    b2Title: 'इंटरनेट बंद होने पर भी काम करेगा',
    b2Desc: 'पेज लोड होने के बाद ऑफलाइन (Airplane Mode) में भी टूल्स चलते हैं।',
    b3Title: 'आधार व बैंक दस्तावेज सुरक्षित',
    b3Desc: 'प्राइवेट डॉक्यूमेंट्स किसी अनजान कंपनी या सर्वर के हाथ में नहीं जाते।',
    b4Title: 'सुपर फास्ट स्पीड',
    b4Desc: 'भारी सर्वर अपलोड का इंतजार किए बिना पलक झपकते ही काम होता है।',
    verifyTitle: '🔬 खुद टेस्ट करके देखें (30 सेकंड में लाइव सबूत):',
    verifyStep1: 'कोई भी टूल पेज खोलें (जैसे PDF Merge या Image Compressor)।',
    verifyStep2: 'पेज लोड होने के बाद अपना Wi-Fi या मोबाइल डेटा बंद (Airplane Mode) कर दें।',
    verifyStep3: 'अपनी फाइल चुनें और प्रोसेस करें — आप देखेंगे कि बिना इंटरनेट भी सब कुछ तुरंत हो गया!',
    verifyNote: '💡 नोट: पहली बार वेब पेज लोड करने के लिए थोड़ा सा इंटरनेट चाहिए होता है, पर उसके बाद फाइल प्रोसेसिंग के लिए 0 KB डेटा लगता है और सर्वर पर 0 बाइट अपलोड होता है।',
    dontShow: 'मुझे दोबारा मत दिखाना (Don\'t show again)',
    gotIt: 'समझ गया! (Got it)',
  },
  hinglish: {
    name: 'Hinglish (Casual Hindi)',
    flag: '🇮🇳',
    title: 'Aapki Files Aapke Device Par Hi Process Hoti Hain — Jaaniye Kaise!',
    subtitle: '100% Client-Side Processing • Your Data Never Leaves Your Device',
    simpleExplanation: 'Baki normal websites par jab aap photo ya PDF dalte ho, toh wo internet ke zariye unke cloud servers par upload ho jaati hai. But ToolsforTools par hum aapka data na toh apne server par mangwate hain aur na hi apne paas store karte hain.',
    scenarioTitle: '💡 Ek Simple Scenario Samjho:',
    scenarioText: 'Socho jaise aapke phone ka Calculator app hota hai — jab aap usme 500 + 500 karte ho, toh kya wo hisaab kisi doosre computer par jata hai? Bilkul nahi! Sab kuch aapke phone ke processor ke andar hi calculate hota hai.\n\nToolsforTools bhi bilkul waise hi kaam karta hai! Aap jab apna Aadhar card PDF merge karte ho ya exam photo compress karte ho, toh sab kuch aapke browser ke andar hi process ho jata hai. File aapke phone se 1 inch bhi bahar nahi nikalti! Isliye aapke documents 100% safe hain.',
    b1Title: '100% Private & Local',
    b1Desc: 'File aapke device ki memory me hi process hoti hai.',
    b2Title: 'No Cloud Upload',
    b2Desc: 'Hamare paas aapka koi document aata hi nahi hai.',
    b3Title: 'Offline Capability',
    b3Desc: 'Page khulne ke baad internet band hone par bhi processing chalti hai.',
    b4Title: 'Instant & Fast',
    b4Desc: 'Heavy server upload waiting time bilkul zero hai.',
    verifyTitle: '🔬 Live Test (Khud Check Karein — 30 Seconds Proof):',
    verifyStep1: 'Koi bhi tool kholiye (jaise PDF Merge ya Image Compressor page).',
    verifyStep2: 'Page khulne ke baad Wi-Fi ya mobile data band (Airplane Mode) kar dijiye.',
    verifyStep3: 'Apni file select karke process karein — bina internet ke bhi kaam instantly ho jayega!',
    verifyNote: '💡 Note: Pehli baar web page open karne ke liye internet lagta hai, lekin ek baar page khul gaya toh file processing ke liye 0 KB internet lagta hai aur 0 bytes upload hota hai.',
    dontShow: 'Dobara mat show karna (Don\'t show again)',
    gotIt: 'Main Samajh Gaya!',
  },
  en: {
    name: 'English',
    flag: '🌐',
    title: 'Your Files Are Processed Directly On Your Device — Here is How!',
    subtitle: '100% Client-Side Processing • Complete Local Privacy',
    simpleExplanation: 'Unlike traditional websites that upload your personal documents to remote cloud servers, ToolsforTools processes everything directly inside your web browser. We never receive, inspect, or store your files.',
    scenarioTitle: '💡 A Simple Real-Life Example:',
    scenarioText: 'Think of your phone\'s Calculator app: when you calculate 500 + 500, does your phone send your numbers over the internet? Absolutely not! The math happens entirely inside your device.\n\nToolsforTools works the exact same way. When you compress a photo or merge a PDF, the processing is performed entirely by your phone or laptop\'s own processor. Your sensitive documents—like Aadhaar cards, tax returns, and family photos—never leave your hands.',
    b1Title: 'Zero Server Uploads',
    b1Desc: 'Your confidential files are never transmitted across the web.',
    b2Title: 'Works Offline',
    b2Desc: 'Once loaded, processing functions even without an active internet connection.',
    b3Title: 'Privacy Guaranteed',
    b3Desc: 'We have zero access to your sensitive government forms or personal images.',
    b4Title: 'Blazing Fast',
    b4Desc: 'No upload/download bottlenecks. Everything processes in milliseconds.',
    verifyTitle: '🔬 Verify It Yourself (Live Proof in 30 Seconds):',
    verifyStep1: 'Open any tool page (e.g. PDF Merge or Image Compressor).',
    verifyStep2: 'Once loaded, disconnect your Wi-Fi or turn on Airplane Mode.',
    verifyStep3: 'Choose a file and process it — watch it finish instantly with zero internet!',
    verifyNote: '💡 Note: Initial page load requires internet to fetch scripts, but document processing uses 0 KB network data and uploads 0 bytes.',
    dontShow: 'Don\'t show this again',
    gotIt: 'Got it, thanks!',
  },
  bn: {
    name: 'বাংলা (Bengali)',
    flag: '🇮🇳',
    title: 'আপনার ফাইল আপনার ডিভাইসেই প্রসেস হয় — কীভাবে জানুন!',
    subtitle: 'জিরো সার্ভার আপলোড • আপনার ডেটা আপনার ডিভাইসেই থাকে',
    simpleExplanation: 'সাধারণ ওয়েবসাইটে কোনো ফাইল দিলে তা তাদের ইন্টারনেটের মাধ্যমে সার্ভারে আপলোড হয়। কিন্তু ToolsforTools-এ আপনার কোনো ফাইল আমাদের কাছে আসে না বা সংরক্ষিত হয় না।',
    scenarioTitle: '💡 একটি সহজ উদাহরণ:',
    scenarioText: 'আপনার ফোনের ক্যালকুলেটর অ্যাপটির কথা ভাবুন: যখন আপনি 500 + 500 যোগ করেন, তখন কি আপনার ফোন ইন্টারনেটে হিসাব পাঠায়? একদমই না! হিসাবটি আপনার ফোনের ভিতরেই হয়। ToolsforTools ঠিক একইভাবে কাজ করে!',
    b1Title: 'ডিভাইসেই সুরক্ষিত',
    b1Desc: 'আপনার ফাইল আপনার ফোনের বাইরে যায় না।',
    b2Title: 'অফলাইনেও কার্যকর',
    b2Desc: 'ইন্টারনেট ছাড়াই ব্রাউজারে কাজ সম্পন্ন হয়।',
    b3Title: 'সম্পূর্ণ গোপনীয়তা',
    b3Desc: 'আপনার ব্যক্তিগত নথি আমাদের দেখার সুযোগ নেই।',
    b4Title: 'অতিরিক্ত দ্রুত',
    b4Desc: 'সার্ভার আপলোডের কোনো অপেক্ষা নেই।',
    verifyTitle: '🔬 নিজেই যাচাই করুন (লাইভ পরীক্ষা):',
    verifyStep1: 'যেকোনো টুল পেজ খুলুন (যেমন PDF Merge বা Image Compressor)।',
    verifyStep2: 'পেজ লোড হওয়ার পর ইন্টারনেট বা ওয়াই-ফাই বন্ধ করুন।',
    verifyStep3: 'ফাইল সিলেক্ট করে প্রসেস করুন — ইন্টারনেট ছাড়াই কাজ সম্পন্ন হবে!',
    verifyNote: '💡 নোট: প্রথমবার পেজ খোলার জন্য নেট দরকার, তবে ফাইল প্রসেসিংয়ে ০ বাইট আপলোড হয়।',
    dontShow: 'আমাকে আর দেখাবেন না (Don\'t show again)',
    gotIt: 'বুঝেছি (Got it)',
  },
  mr: {
    name: 'मराठी (Marathi)',
    flag: '🇮🇳',
    title: 'तुमच्या फाइल्स तुमच्या डिव्हाइसवरच प्रोसेस होतात — कसे ते जाणून घ्या!',
    subtitle: 'झिरो सर्व्हर अपलोड • तुमचा डेटा तुमच्या डिव्हाइसमध्येच राहतो',
    simpleExplanation: 'इतर वेबसाइट्सवर तुम्ही फोटो किंवा पीडीएफ टाकता तेव्हा ती त्यांच्या सर्व्हरवर जाते। पण ToolsforTools वर तुमची फाइल आमच्याकडे कधीच येत नाही आणि आम्ही ती सेव्हही करत नाही.',
    scenarioTitle: '💡 एक सोपे उदाहरण:',
    scenarioText: 'तुमच्या फोनमधील कॅल्क्युलेटरचा विचार करा: 500 + 500 करताना फोन इंटरनेटवर माहिती पाठवतो का? मुळीच नाही! सर्व हिशोब फोनमध्येच होतो। तसेच ToolsforTools वर फोटो किंवा पीडीएफचे काम तुमच्या फोनमध्येच होते।',
    b1Title: 'डिव्हाइसबाहेर जात नाही',
    b1Desc: 'तुमची फाइल तुमच्या फोनमध्येच सुरक्षित राहते.',
    b2Title: 'इंटरनेटशिवाय चालते',
    b2Desc: 'ऑफलाइन मोडमध्येही सर्व प्रक्रिया सुरळीत होते.',
    b3Title: 'आधार व बँक कागदपत्रे सेफ',
    b3Desc: 'खाजगी डेटा कोणाच्याही हातात जात नाही.',
    b4Title: 'अत्यंत वेगवान',
    b4Desc: 'सर्व्हरवर अपलोड होण्याची वाट पाहावी लागत नाही.',
    verifyTitle: '🔬 स्वतः तपासून पाहा (थेट पुरावा):',
    verifyStep1: 'कोणतेही टूल उघडा (उदा. PDF Merge किंवा Image Compressor).',
    verifyStep2: 'पेज उघडल्यानंतर फोन Airplane Mode वर टाका.',
    verifyStep3: 'फाइल निवडून प्रोसेस करा — इंटरनेटशिवाय सर्व काम त्वरित होईल!',
    verifyNote: '💡 टीप: पेज उघडण्यासाठी इंटरनेट लागते, पण फाइल प्रोसेसिंगसाठी 0 बाइट अपलोड होते.',
    dontShow: 'मला पुन्हा दाखवू नका',
    gotIt: 'मला समजले!',
  },
  te: {
    name: 'తెలుగు (Telugu)',
    flag: '🇮🇳',
    title: 'మీ ఫైల్స్ మీ పరికరంలోనే ప్రాసెస్ అవుతాయి — ఎలాగో తెలుసుకోండి!',
    subtitle: 'జీరో సర్వర్ అప్‌లోడ్ • మీ డేటా మీ ఫోన్లోనే ఉంటుంది',
    simpleExplanation: 'సాధారణ వెబ్‌సైట్లలో ఫైల్స్ అప్‌లోడ్ చేస్తే అవి వేరే సర్వర్‌లోకి వెళ్తాయి. కానీ ToolsforTools లో మీ ఫైల్స్ మా సర్వర్‌కి రావు మరియు మేము నిల్వ చేయము.',
    scenarioTitle: '💡 ఒక సులభమైన ఉదాహరణ:',
    scenarioText: 'మీ ఫోన్‌లోని క్యాలిక్యులేటర్ గురించి ఆలోచించండి: 500 + 500 లెక్కించేటప్పుడు ఫోన్ ఇంటర్నెట్‌కి డేటా పంపుతుందా? లేదు! లెక్క అంతా ఫోన్ లోపలే జరుగుతుంది. ToolsforTools కూడా అలాగే పనిచేస్తుంది!',
    b1Title: 'ఫోన్ దాటి వెళ్ళదు',
    b1Desc: 'మీ రహస్య పత్రాలు మీ పరికరంలోనే ఉంటాయి.',
    b2Title: 'ఆఫ్‌లైన్‌లో కూడా పనిచేస్తుంది',
    b2Desc: 'ఇంటర్నెట్ లేకుండా కూడా వేగంగా పనిచేస్తుంది.',
    b3Title: 'పూర్తి గోప్యత',
    b3Desc: 'ఆధార్, బ్యాంక్ వివరాలు పూర్తిగా సురక్షితం.',
    b4Title: 'అత్యంత వేగం',
    b4Desc: 'సర్వర్ వెయిటింగ్ సమయం ఉండదు.',
    verifyTitle: '🔬 మీరే పరీక్షించండి (లైవ్ ప్రూఫ్):',
    verifyStep1: 'ఏదైనా టూల్ తెరవండి (ఉదా. PDF Merge లేదా Image Compressor).',
    verifyStep2: 'పేజీ లోడ్ అయిన తర్వాత Wi-Fi లేదా ఇంటర్నెట్ ఆపివేయండి.',
    verifyStep3: 'ఫైల్ ప్రాసెస్ చేయండి — ఇంటర్నెట్ లేకపోయినా వెంటనే పని పూర్తవుతుంది!',
    verifyNote: '💡 గమనిక: పేజీ తెరవడానికి నెట్ కావాలి, కానీ ఫైల్ ప్రాసెసింగ్ సర్వర్‌కి ఏమీ వెళ్లదు.',
    dontShow: 'మళ్ళీ చూపించవద్దు',
    gotIt: 'అర్థమైంది!',
  },
  ta: {
    name: 'தமிழ் (Tamil)',
    flag: '🇮🇳',
    title: 'உங்கள் கோப்புகள் உங்கள் போனிலேயே செயலாக்கப்படும் — எப்படி என்று பாருங்கள்!',
    subtitle: 'பூஜ்ஜிய சர்வர் பதிவேற்றம் • உங்கள் தகவல் உங்களிடமே இருக்கும்',
    simpleExplanation: 'மற்ற தளங்களில் உங்கள் கோப்புகள் அவர்களின் சர்வர்களில் சேமிக்கப்படும். ஆனால் ToolsforTools தளத்தில் உங்கள் கோப்புகள் எங்கள் சர்வர்களுக்கு வரவே வராது.',
    scenarioTitle: '💡 எளிய உதாரணம்:',
    scenarioText: 'உங்கள் போன் கால்குலேட்டரை யோசியுங்கள்: 500 + 500 கூட்டும் போது அது இணையத்திற்கு போகுமா? இல்லை! கணக்கீடு உங்கள் போனிலேயே நடக்கிறது. அதேபோல் ToolsforTools உங்கள் போனிலேயே நடக்கும்!',
    b1Title: 'போனிலேயே பாதுகாப்பானது',
    b1Desc: 'கோப்புகள் உங்கள் சாதனத்தை விட்டு வெளியே போகாது.',
    b2Title: 'ஆஃப்லைனிலும் வேலை செய்யும்',
    b2Desc: 'இணையம் இல்லாமலும் தடையின்றி இயங்கும்.',
    b3Title: 'முழுமையான பாதுகாப்பு',
    b3Desc: 'ஆதார் மற்றும் வங்கி ஆவணங்கள் 100% பாதுகாப்பானவை.',
    b4Title: 'மின்னல் வேகம்',
    b4Desc: 'சர்வர் பதிவேற்ற தாமதம் இல்லை.',
    verifyTitle: '🔬 நீங்களே பரிசோதிக்கலாம்:',
    verifyStep1: 'ஏதேனும் ஒரு கருவி பக்கத்தைத் திறக்கவும் (PDF Merge / Compressor).',
    verifyStep2: 'பக்கம் திறந்ததும் இணையத்தை அணைக்கவும் (Airplane Mode).',
    verifyStep3: 'கோப்பை செயலாக்குங்கள் — இணையம் இன்றியே வேலை செய்யும்!',
    verifyNote: '💡 குறிப்பு: பக்கம் திறக்க மட்டுமே நெட் தேவை, கோப்பு எதுவும் வெளியே போகாது.',
    dontShow: 'மீண்டும் காட்டாதே',
    gotIt: 'புரிந்தது!',
  },
  gu: {
    name: 'ગુજરાતી (Gujarati)',
    flag: '🇮🇳',
    title: 'તમારી ફાઇલો તમારા ડિવાઇસ પર જ પ્રોસેસ થાય છે — જાણો કેવી રીતે!',
    subtitle: 'ઝીરો સર્વર અપલોડ • તમારો ડેટા તમારા ડિવાઇસમાં જ રહે છે',
    simpleExplanation: 'બીજી વેબસાઇટ્સ પર ફાઇલ સર્વર પર અપલોડ થાય છે. પરંતુ ToolsforTools પર તમારી કોઈ પણ ફાઇલ અમારા સર્વર પર આવતી નથી કે સેવ થતી નથી.',
    scenarioTitle: '💡 એક સરળ ઉદાહરણ:',
    scenarioText: 'તમારા ફોનના કેલ્ક્યુલેટર વિશે વિચારો: 500 + 500 કરવા માટે શું ફોન ઇન્ટરનેટ વાપરે છે? બિલકુલ નહીં! બધો હિસાબ ફોનની અંદર જ થાય છે. તેવી જ રીતે ToolsforTools પર બધું તમારા ફોનમાં જ પ્રોસેસ થાય છે.',
    b1Title: 'ડિવાઇસમાં જ સુરક્ષિત',
    b1Desc: 'ફાઇલ તમારા ફોનની બહાર જતી નથી.',
    b2Title: 'ઓફલાઇન પણ કામ કરે છે',
    b2Desc: 'ઇન્ટરનેટ વગર પણ ઝડપથી ચાલે છે.',
    b3Title: 'પ્રાઇવેસી ગેરંટી',
    b3Desc: 'કોઈ પણ ફાઇલ અમારા સુધી પહોંચતી નથી.',
    b4Title: 'ઝડપી પ્રોસેસિંગ',
    b4Desc: 'સર્વર અપલોડની રાહ જોવી પડતી નથી.',
    verifyTitle: '🔬 જાતે ચકાસી જુઓ (લાઇવ પુરાવો):',
    verifyStep1: 'કોઈપણ ટૂલ પેજ ખોલો (જેમ કે PDF Merge અથવા Image Compressor).',
    verifyStep2: 'પેજ ખુલ્યા પછી ઇન્ટરનેટ બંધ કરી દો (Airplane Mode).',
    verifyStep3: 'ફાઇલ પ્રોસેસ કરો — ઇન્ટરનેટ વિના પણ તરત જ કામ પૂરું થશે!',
    verifyNote: '💡 નોંધ: પેજ લોડ કરવા માટે નેટ જોઈએ, પરંતુ ફાઇલ માટે 0 બાઇટ અપલોડ થાય છે.',
    dontShow: 'ફરીથી ન બતાવો',
    gotIt: 'સમજાઈ ગયું!',
  },
  ur: {
    name: 'اردو (Urdu)',
    flag: '🇵🇰',
    title: 'آپ کی فائلیں آپ کی ڈیوائس پر ہی پروسیس ہوتی ہیں — جانیے کیسے!',
    subtitle: 'زیرو سرور اپ لوڈ • آپ کا ڈیٹا آپ کے پاس رہتا ہے',
    simpleExplanation: 'عام ویب سائٹس پر آپ کی فائلیں ان کے سرور پر چلی جاتی ہیں۔ لیکن ToolsforTools پر آپ کی کوئی بھی فائل ہمارے پاس نہیں آتی اور نہ محفوظ ہوتی ہے۔',
    scenarioTitle: '💡 ایک سادہ مثال:',
    scenarioText: 'اپنے فون کے کیلکولیٹر کے بارے میں سوچیں: 500 + 500 کا حساب لگاتے وقت کیا فون انٹرنیٹ پر ڈیٹا بھیجتا ہے؟ بالکل نہیں! حساب فون کے اندر ہی ہوتا ہے۔ ToolsforTools بھی اسی طرح کام کرتا ہے۔',
    b1Title: 'فون سے باہر نہیں جاتا',
    b1Desc: 'آپ کی فائلیں آپ کی ڈیوائس میں محفوظ رہتی ہیں۔',
    b2Title: 'آف لائن بھی کام کرتا ہے',
    b2Desc: 'انٹرنیٹ کے بغیر بھی تیزی سے کام ہوتا ہے۔',
    b3Title: 'مکمل پرائیویسی',
    b3Desc: 'شناختی کارڈ اور بینک دستاویزات بالکل محفوظ ہیں۔',
    b4Title: 'انتہائی تیز رفتار',
    b4Desc: 'سرور اپ لوڈ کا کوئی انتظار نہیں۔',
    verifyTitle: '🔬 خود ٹیسٹ کریں (لائیو ثبوت):',
    verifyStep1: 'کوئی بھی ٹول پیج کھولیں (جیسے PDF Merge یا Image Compressor)۔',
    verifyStep2: 'پیج کھلنے کے بعد انٹرنیٹ یا وائی فائی بند کر دیں (Airplane Mode)۔',
    verifyStep3: 'فائل پروسیس کریں — بغیر انٹرنیٹ کے کام مکمل ہو جائے گا!',
    verifyNote: '💡 نوٹ: پیج کھولنے کے لیے نیٹ درکار ہے، لیکن فائل پروسیسنگ 0 بائٹ اپ لوڈ کرتی ہے۔',
    dontShow: 'دوبارہ مت دکھائیں',
    gotIt: 'سمجھ گیا!',
  },
  kn: {
    name: 'ಕನ್ನಡ (Kannada)',
    flag: '🇮🇳',
    title: 'ನಿಮ್ಮ ಫೈಲ್‌ಗಳು ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಸಂಸ್ಕರಿಸಲ್ಪಡುತ್ತವೆ — ಹೇಗೆ ತಿಳಿಯಿರಿ!',
    subtitle: 'ಶೂನ್ಯ ಸರ್ವರ್ ಅಪ್‌ಲೋಡ್ • ನಿಮ್ಮ ಡೇಟಾ ನಿಮ್ಮ ಬಳಿಯೇ ಇರುತ್ತದೆ',
    simpleExplanation: 'ಸಾಮಾನ್ಯ ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಫೈಲ್‌ಗಳು ಸರ್ವರ್‌ಗೆ ಹೋಗುತ್ತವೆ. ಆದರೆ ToolsforTools ನಲ್ಲಿ ನಿಮ್ಮ ಯಾವುದೇ ಫೈಲ್ ನಮ್ಮ ಸರ್ವರ್‌ಗೆ ಬರುವುದಿಲ್ಲ.',
    scenarioTitle: '💡 ಸರಳ ಉದಾಹರಣೆ:',
    scenarioText: 'ನಿಮ್ಮ ಫೋನ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ ನೆನಪಿಸಿಕೊಳ್ಳಿ: 500 + 500 ಲೆಕ್ಕ ಮಾಡುವಾಗ ಇಂಟರ್ನೆಟ್ ಬೇಕೇ? ಇಲ್ಲ! ಲೆಕ್ಕ ಫೋನ್ ಒಳಗೇ ನಡೆಯುತ್ತದೆ. ToolsforTools ಕೂಡ ಹಾಗೆಯೇ ನಿಮ್ಮ ಡಿವೈಸ್ ಒಳಗೇ ಕೆಲಸ ಮಾಡುತ್ತದೆ!',
    b1Title: 'ಫೋನ್‌ನಲ್ಲೇ ಸುರಕ್ಷಿತ',
    b1Desc: 'ಫೈಲ್‌ಗಳು ನಿಮ್ಮ ಡಿವೈಸ್ ಬಿಟ್ಟು ಹೋಗುವುದಿಲ್ಲ.',
    b2Title: 'ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಕೆಲಸ',
    b2Desc: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದಿದ್ದರೂ ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತದೆ.',
    b3Title: 'ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ',
    b3Desc: 'ಖಾಸಗಿ ದಾಖಲೆಗಳು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ.',
    b4Title: 'ಅತಿ ವೇಗ',
    b4Desc: 'ಸರ್ವರ್ ಕಾಯುವಿಕೆ ಇಲ್ಲ.',
    verifyTitle: '🔬 ನೀವೇ ಪರಿಶೀಲಿಸಿ:',
    verifyStep1: 'ಯಾವುದಾದರೂ ಟೂಲ್ ತೆರೆಯಿರಿ (ಉದಾ: PDF Merge ಅಥವಾ Compressor).',
    verifyStep2: 'ಪುಟ ತೆರೆದ ನಂತರ ವೈ-ಫೈ ಆಫ್ ಮಾಡಿ (Airplane Mode).',
    verifyStep3: 'ಫೈಲ್ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಿ — ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ತಕ್ಷಣ ಪೂರ್ಣಗೊಳ್ಳುತ್ತದೆ!',
    verifyNote: '💡 ಗಮನಿಸಿ: ಪುಟ ತೆರೆಯಲು ಮಾತ್ರ ನೆಟ್ ಬೇಕು, ಫೈಲ್ ಯಾವುದೂ ಹೊರಹೋಗುವುದಿಲ್ಲ.',
    dontShow: 'ಮತ್ತೆ ತೋರಿಸಬೇಡಿ',
    gotIt: 'ತಿಳಿಯಿತು!',
  },
  ml: {
    name: 'മലയാളം (Malayalam)',
    flag: '🇮🇳',
    title: 'നിങ്ങളുടെ ഫയലുകൾ നിങ്ങളുടെ ഫോണിൽ മാത്രം പ്രോസസ്സ് ചെയ്യപ്പെടുന്നു!',
    subtitle: 'സീറോ സെർവർ അപ്‌ലോഡ് • ഡാറ്റ നിങ്ങളുടെ ഫോണിൽ മാത്രം',
    simpleExplanation: 'മറ്റ് സൈറ്റുകൾ ഫയലുകൾ സെർവറുകളിലേക്ക് എടുക്കുമ്പോൾ, ToolsforTools നിങ്ങളുടെ ഫയലുകൾ ഒരിക്കലും പുറത്തേക്ക് വിടുന്നില്ല.',
    scenarioTitle: '💡 ലളിതമായ ഉദാഹരണം:',
    scenarioText: 'ഫോൺ കാൽക്കുലേറ്റർ പോലെ: കണക്കുകൂട്ടലുകൾ ഫോണിൽ തന്നെ നടക്കുന്നു, ഇന്റർനെറ്റിലേക്ക് പോകുന്നില്ല. ഇതേപോലെ ToolsforTools നിങ്ങളുടെ ഫോണിൽ മാത്രം പ്രവർത്തിക്കുന്നു!',
    b1Title: 'ഫോണിൽ സുരക്ഷിതം',
    b1Desc: 'ഫയലുകൾ നിങ്ങളുടെ ഉപകരണത്തിൽ മാത്രം.',
    b2Title: 'ഓഫ്‌ലൈനിലും ലഭ്യം',
    b2Desc: 'ഇന്റർനെറ്റ് ഇല്ലാതെ പ്രവർത്തിക്കുന്നു.',
    b3Title: 'പൂർണ്ണ സുരക്ഷ',
    b3Desc: 'ആധാർ, ബാങ്ക് രേഖകൾ തികച്ചും സുരക്ഷിതം.',
    b4Title: 'മിന്നൽ വേഗത',
    b4Desc: 'സെർവർ കാത്തിരിപ്പില്ല.',
    verifyTitle: '🔬 സ്വയം പരീക്ഷിക്കുക:',
    verifyStep1: 'ഏതെങ്കിലും ടൂൾ പേജ് തുറക്കുക (PDF Merge / Compressor).',
    verifyStep2: 'പേജ് ലോഡായ ശേഷം ഇന്റർനെറ്റ് വിച്ഛേദിക്കുക.',
    verifyStep3: 'ഫയൽ പ്രോസസ്സ് ചെയ്യുക — ഇന്റർനെറ്റ് ഇല്ലാതെയും പൂർത്തിയാകും!',
    verifyNote: '💡 കുറിപ്പ്: പേജ് തുറക്കാൻ മാത്രം നെറ്റ് വേണം, ഫയൽ പുറത്തുപോകില്ല.',
    dontShow: 'ഇനി കാണിക്കരുത്',
    gotIt: 'മനസ്സിലായി!',
  },
  pa: {
    name: 'ਪੰਜਾਬੀ (Punjabi)',
    flag: '🇮🇳',
    title: 'ਤੁਹਾਡੀਆਂ ਫਾਈਲਾਂ ਤੁਹਾਡੇ ਫੋਨ ਵਿੱਚ ਹੀ ਪ੍ਰੋਸੈਸ ਹੁੰਦੀਆਂ ਹਨ — ਜਾਣੋ ਕਿਵੇਂ!',
    subtitle: 'ਜ਼ੀਰੋ ਸਰਵਰ ਅਪਲੋਡ • ਤੁਹਾਡਾ ਡਾਟਾ ਤੁਹਾਡੇ ਫੋਨ ਵਿੱਚ ਹੀ ਰਹਿੰਦਾ ਹੈ',
    simpleExplanation: 'ਦੂਜੀਆਂ ਸਾਈਟਾਂ ਫਾਈਲਾਂ ਆਪਣੇ ਸਰਵਰ ਤੇ ਅਪਲੋਡ ਕਰਦੀਆਂ ਹਨ। ਪਰ ToolsforTools ਤੇ ਤੁਹਾਡੀ ਕੋਈ ਫਾਈਲ ਸਾਡੇ ਕੋਲ ਨਹੀਂ ਆਉਂਦੀ।',
    scenarioTitle: '💡 ਇੱਕ ਸੌਖੀ ਮਿਸਾਲ:',
    scenarioText: 'ਫੋਨ ਦੇ ਕੈਲਕੁਲੇਟਰ ਵਾਂਗ: 500 + 500 ਦਾ ਹਿਸਾਬ ਫੋਨ ਦੇ ਅੰਦਰ ਹੀ ਹੁੰਦਾ ਹੈ, ਇੰਟਰਨੈਟ ਤੇ ਨਹੀਂ ਜਾਂਦਾ। ToolsforTools ਵੀ ਬਿਲਕੁਲ ਇਸੇ ਤਰ੍ਹਾਂ ਤੁਹਾਡੇ ਫੋਨ ਵਿੱਚ ਹੀ ਕੰਮ ਕਰਦਾ ਹੈ!',
    b1Title: 'ਫੋਨ ਵਿੱਚ ਹੀ ਸੁਰੱਖਿਅਤ',
    b1Desc: 'ਫਾਈਲ ਤੁਹਾਡੇ ਫੋਨ ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਜਾਂਦੀ।',
    b2Title: 'ਇੰਟਰਨੈਟ ਤੋਂ ਬਿਨਾਂ ਵੀ ਚੱਲਦਾ ਹੈ',
    b2Desc: 'ਆਫਲਾਈਨ ਮੋਡ ਵਿੱਚ ਵੀ ਪੂਰਾ ਕੰਮ ਕਰਦਾ ਹੈ।',
    b3Title: 'ਪੂਰੀ ਪ੍ਰਾਈਵੇਸੀ',
    b3Desc: 'ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ ਹਨ।',
    b4Title: 'ਬਹੁਤ ਤੇਜ਼',
    b4Desc: 'ਸਰਵਰ ਅਪਲੋਡ ਦੀ ਕੋਈ ਦੇਰੀ ਨਹੀਂ।',
    verifyTitle: '🔬 ਖੁਦ ਚੈੱਕ ਕਰੋ (ਲਾਈਵ ਸਬੂਤ):',
    verifyStep1: 'ਕੋਈ ਵੀ ਟੂਲ ਪੇਜ ਖੋਲ੍ਹੋ (ਜਿਵੇਂ PDF Merge ਜਾਂ Image Compressor)।',
    verifyStep2: 'ਪੇਜ ਖੁੱਲ੍ਹਣ ਤੋਂ ਬਾਅਦ ਇੰਟਰਨੈਟ ਬੰਦ ਕਰੋ (Airplane Mode)।',
    verifyStep3: 'ਫਾਈਲ ਪ੍ਰੋਸੈਸ ਕਰੋ — ਬਿਨਾਂ ਇੰਟਰਨੈਟ ਦੇ ਕੰਮ ਤੁਰੰਤ ਪੂਰਾ ਹੋ ਜਾਵੇਗਾ!',
    verifyNote: '💡 ਨੋਟ: ਪੇਜ ਖੋਲ੍ਹਣ ਲਈ ਨੈੱਟ ਚਾਹੀਦਾ ਹੈ, ਪਰ ਫਾਈਲ ਪ੍ਰੋਸੈਸਿੰਗ ਵਿੱਚ 0 ਬਾਈਟ ਅਪਲੋਡ ਹੁੰਦੀ ਹੈ।',
    dontShow: 'ਦੁਬਾਰਾ ਨਾ ਦਿਖਾਓ',
    gotIt: 'ਸਮਝ ਆ ਗਈ!',
  },
  es: {
    name: 'Español (Spanish)',
    flag: '🇪🇸',
    title: 'Tus archivos se procesan directamente en tu dispositivo — ¡Descubre cómo!',
    subtitle: 'Cero Carga en Servidores • Privacidad 100% Local',
    simpleExplanation: 'A diferencia de otros sitios que suben tus documentos a la nube, ToolsforTools procesa todo en tu propio navegador. Nunca vemos ni guardamos tus archivos.',
    scenarioTitle: '💡 Un Ejemplo Cotidiano:',
    scenarioText: 'Piensa en la calculadora de tu teléfono: cuando sumas 500 + 500, ¿tu teléfono envía esos números a internet? ¡Claro que no! Todo se calcula en tu teléfono. ToolsforTools funciona exactamente igual.',
    b1Title: '100% en tu Dispositivo',
    b1Desc: 'Los archivos nunca se transmiten por internet.',
    b2Title: 'Funciona Sin Conexión',
    b2Desc: 'Una vez cargada, funciona sin internet.',
    b3Title: 'Privacidad Total',
    b3Desc: 'Tus documentos sensibles están a salvo.',
    b4Title: 'Ultra Rápido',
    b4Desc: 'Sin tiempos de espera de subida.',
    verifyTitle: '🔬 Pruébalo tú mismo (Prueba en vivo):',
    verifyStep1: 'Abre cualquier herramienta (como Unir PDF o Comprimir Imagen).',
    verifyStep2: 'Una vez cargada, activa el Modo Avión o desconecta el Wi-Fi.',
    verifyStep3: 'Procesa tu archivo: ¡verás cómo funciona al instante sin internet!',
    verifyNote: '💡 Nota: Solo se requiere conexión para abrir la página inicialmente.',
    dontShow: 'No volver a mostrar',
    gotIt: '¡Entendido!',
  },
  de: {
    name: 'Deutsch (German)',
    flag: '🇩🇪',
    title: 'Ihre Dateien werden direkt auf Ihrem Gerät verarbeitet — Erfahren Sie wie!',
    subtitle: 'Keine Server-Uploads • 100% Lokale Verarbeitung',
    simpleExplanation: 'Im Gegensatz zu anderen Websites werden Ihre Dateien bei ToolsforTools direkt in Ihrem Browser verarbeitet. Wir empfangen oder speichern Ihre Daten niemals.',
    scenarioTitle: '💡 Ein Einfaches Beispiel:',
    scenarioText: 'Denken Sie an den Taschenrechner Ihres Handys: Wenn Sie 500 + 500 rechnen, wird das nicht ins Internet gesendet. Alles passiert auf Ihrem Gerät. ToolsforTools funktioniert genauso!',
    b1Title: 'Lokal auf Ihrem Gerät',
    b1Desc: 'Dateien verlassen niemals Ihren Browser.',
    b2Title: 'Funktioniert Offline',
    b2Desc: 'Verarbeitung klappt auch ohne Internet.',
    b3Title: 'Maximale Privatsphäre',
    b3Desc: 'Sensible Dokumente bleiben privat.',
    b4Title: 'Blitzschnell',
    b4Desc: 'Keine Wartezeiten für Server-Uploads.',
    verifyTitle: '🔬 Selbst testen (Live-Beweis):',
    verifyStep1: 'Öffnen Sie ein beliebiges Tool (z. B. PDF zusammenfügen).',
    verifyStep2: 'Schalten Sie nach dem Laden das WLAN aus (Flugmodus).',
    verifyStep3: 'Wählen Sie Ihre Datei — alles funktioniert ohne Internet!',
    verifyNote: '💡 Hinweis: Internet wird nur zum ersten Laden der Seite benötigt.',
    dontShow: 'Nicht mehr anzeigen',
    gotIt: 'Verstanden!',
  },
  fr: {
    name: 'Français (French)',
    flag: '🇫🇷',
    title: 'Vos fichiers sont traités directement sur votre appareil — Découvrez comment !',
    subtitle: 'Zéro Envoi vers un Serveur • Confidentialité Totale',
    simpleExplanation: 'Contrairement aux autres sites, ToolsforTools traite tout localement dans votre navigateur web. Aucun fichier n\'est jamais envoyé sur nos serveurs.',
    scenarioTitle: '💡 Un Exemple Tout Simple :',
    scenarioText: 'Pensez à la calculatrice de votre téléphone : le calcul 500 + 500 s\'effectue dans votre téléphone, sans internet. ToolsforTools fonctionne exactement de la même manière !',
    b1Title: '100% Local',
    b1Desc: 'Vos fichiers restent sur votre machine.',
    b2Title: 'Fonctionne Hors Ligne',
    b2Desc: 'Opérationnel même sans connexion internet.',
    b3Title: 'Sécurité Maximale',
    b3Desc: 'Vos documents confidentiels sont protégés.',
    b4Title: 'Instantané',
    b4Desc: 'Aucun temps d\'attente de téléchargement.',
    verifyTitle: '🔬 Vérifiez par vous-même :',
    verifyStep1: 'Ouvrez n\'importe quel outil (Fusion PDF ou Compresseur).',
    verifyStep2: 'Une fois chargé, passez en Mode Avion.',
    verifyStep3: 'Traitez votre fichier : le résultat est instantané sans connexion !',
    verifyNote: '💡 Note : Connexion requise uniquement pour le chargement initial.',
    dontShow: 'Ne plus afficher',
    gotIt: 'Compris !',
  },
  ja: {
    name: '日本語 (Japanese)',
    flag: '🇯🇵',
    title: 'ファイルはお使いの端末上だけで処理されます — その仕組み',
    subtitle: 'サーバー送信ゼロ • お使いの端末内で完全処理',
    simpleExplanation: '一般的なサイトとは異なり、ToolsforToolsはお使いのブラウザ内だけで処理を行います。ファイルがサーバーにアップロードされることはありません。',
    scenarioTitle: '💡 分かりやすい例え：',
    scenarioText: 'スマートフォンの電卓アプリと同じです。「500 + 500」を計算するとき、通信は発生しません。ToolsforToolsも同じように、完全に端末内で動作します！',
    b1Title: '端末内完結',
    b1Desc: 'ファイルは外部に一切送信されません。',
    b2Title: 'オフライン対応',
    b2Desc: '機内モードでもそのまま動作します。',
    b3Title: '確実なプライバシー',
    b3Desc: '個人情報や書類が漏洩する心配はありません。',
    b4Title: '超高速処理',
    b4Desc: 'アップロード待ち時間ゼロで即座に処理。',
    verifyTitle: '🔬 実際にお試しください（ライブ検証）：',
    verifyStep1: '任意のツール（PDF結合や画像圧縮など）を開きます。',
    verifyStep2: '読み込み後、Wi-Fiをオフ（機内モード）にします。',
    verifyStep3: 'ファイルを処理してください — ネットなしでも瞬時に完了します！',
    verifyNote: '💡 注: 初回のページ読み込みにのみ通信を使用します。',
    dontShow: '次回から表示しない',
    gotIt: '理解しました！',
  },
  ko: {
    name: '한국어 (Korean)',
    flag: '🇰🇷',
    title: '파일은 사용자의 기기에서만 직접 처리됩니다 — 작동 원리',
    subtitle: '서버 업로드 0% • 100% 브라우저 로컬 처리',
    simpleExplanation: '다른 사이트와 달리 ToolsforTools는 브라우저 내부에서만 모든 작업을 처리합니다. 귀하의 파일은 서버로 전송되거나 저장되지 않습니다.',
    scenarioTitle: '💡 쉬운 예시：',
    scenarioText: '스마트폰 계산기 앱을 생각해보세요. 계산할 때 인터넷으로 데이터를 보내지 않는 것처럼, ToolsforTools도 모든 파일 처리를 기기 내부에서 직접 수행합니다!',
    b1Title: '기기 내 로컬 처리',
    b1Desc: '파일이 기기 밖으로 나가지 않습니다.',
    b2Title: '오프라인 지원',
    b2Desc: '인터넷 연결이 끊겨도 작동합니다.',
    b3Title: '완벽한 개인정보 보호',
    b3Desc: '중요 서류가 외부에 노출되지 않습니다.',
    b4Title: '초고속 실행',
    b4Desc: '업로드 대기 시간 없이 즉시 완료됩니다.',
    verifyTitle: '🔬 직접 확인해보세요 (라이브 검증):',
    verifyStep1: '아무 도구 페이지나 엽니다 (PDF 병합 또는 이미지 압축).',
    verifyStep2: '페이지 로딩 후 비행기 탑승 모드를 켭니다.',
    verifyStep3: '파일을 처리해보세요 — 인터넷 없이도 즉시 처리됩니다!',
    verifyNote: '💡 참고: 최초 페이지 접속 시에만 네트워크가 필요합니다.',
    dontShow: '다시 보지 않기',
    gotIt: '확인했습니다!',
  },
  zh: {
    name: '中文 (Chinese Simplified)',
    flag: '🇨🇳',
    title: '您的文件仅在您的设备本地处理 — 了解运作原理！',
    subtitle: '零服务器上传 • 100% 浏览器本地处理',
    simpleExplanation: '不同于将文件上传到云端的传统网站，ToolsforTools 直接在您的浏览器中处理所有内容。我们绝不会接收、查看或存储您的任何文件。',
    scenarioTitle: '💡 一个通俗易懂的例子：',
    scenarioText: '就像您手机里的计算器：计算 500 + 500 时不需要联网。ToolsforTools 也是如此，所有的 PDF 和图片处理都由您自己的设备完成，即使断开网络也完全正常！',
    b1Title: '本地安全处理',
    b1Desc: '文件永远保留在您的设备中。',
    b2Title: '支持离线使用',
    b2Desc: '无需联网也能流畅处理。',
    b3Title: '保障隐私安全',
    b3Desc: '证件与私密文件绝对保密。',
    b4Title: '极速响应',
    b4Desc: '无需等待漫长的服务器上传。',
    verifyTitle: '🔬 亲自测试（实时验证）：',
    verifyStep1: '打开任意工具页面（如 PDF 合并或图片压缩）。',
    verifyStep2: '页面加载后，断开 Wi-Fi 或开启飞行模式。',
    verifyStep3: '选择文件并处理 — 无需联网即可瞬间完成！',
    verifyNote: '💡 说明：仅初次打开网页时需要网络，文件处理全程 0 上传。',
    dontShow: '不再提示 (Don\'t show again)',
    gotIt: '我明白了 (Got it)',
  },
  ar: {
    name: 'العربية (Arabic)',
    flag: '🇸🇦',
    title: 'تتم معالجة ملفاتك مباشرة على جهازك فقط — اكتشف كيف!',
    subtitle: 'بدون أي رفع للخوادم • خصوصية كاملة على جهازك',
    simpleExplanation: 'على عكس المواقع الأخرى التي ترفع ملفاتك إلى خوادمها، فإن ToolsforTools يعالج كل شيء مباشرة داخل متصفحك. نحن لا نخزن ولا نرى ملفاتك.',
    scenarioTitle: '💡 مثال بسيط من الواقع:',
    scenarioText: 'فكر في تطبيق الآلة الحاسبة على هاتفك: عند جمع 500 + 500، هل يرسل هاتفك الأرقام عبر الإنترنت؟ بالطبع لا! الحساب يتم بالكامل داخل جهازك. يعمل موقعنا بنفس الطريقة تمامًا!',
    b1Title: 'معالجة داخلية 100%',
    b1Desc: 'الملفات تبقى داخل ذاكرة جهازك فقط.',
    b2Title: 'يعمل بدون إنترنت',
    b2Desc: 'يمكنك استخدامه دون اتصال بالشبكة.',
    b3Title: 'خصوصية مضمونة',
    b3Desc: 'وثائقك السرية في أمان تام.',
    b4Title: 'سرعة فائقة',
    b4Desc: 'لا مزيد من الانتظار لرفع الملفات.',
    verifyTitle: '🔬 تحقق بنفسك (إثبات عملي):',
    verifyStep1: 'افتح أي أداة (مثل دمج PDF أو ضغط الصور).',
    verifyStep2: 'بعد فتح الصفحة، قم بتفعيل وضع الطيران وافصل الإنترنت.',
    verifyStep3: 'قم بمعالجة ملفك — ستلاحظ أنه يكتمل فورًا بدون إنترنت!',
    verifyNote: '💡 ملاحظة: تحتاج للإنترنت فقط لتحميل الصفحة في البداية.',
    dontShow: 'عدم الإظهار مرة أخرى',
    gotIt: 'فهمت ذلك!',
  },
  ru: {
    name: 'Русский (Russian)',
    flag: '🇷🇺',
    title: 'Ваши файлы обрабатываются прямо на вашем устройстве — узнайте как!',
    subtitle: 'Без отправки на сервер • 100% локальная обработка',
    simpleExplanation: 'В отличие от других сайтов, ToolsforTools обрабатывает все файлы прямо в вашем браузере. Мы не загружаем и не сохраняем ваши данные.',
    scenarioTitle: '💡 Простой пример из жизни:',
    scenarioText: 'Вспомните калькулятор на телефоне: когда вы считаете 500 + 500, телефон не отправляет эти данные в интернет. Все происходит прямо на вашем устройстве. ToolsforTools работает точно так же!',
    b1Title: 'Локально на устройстве',
    b1Desc: 'Файлы не передаются в интернет.',
    b2Title: 'Работает оффлайн',
    b2Desc: 'Обработка продолжается даже без сети.',
    b3Title: 'Полная конфиденциальность',
    b3Desc: 'Личные документы в безопасности.',
    b4Title: 'Мгновенная скорость',
    b4Desc: 'Никаких задержек при передаче.',
    verifyTitle: '🔬 Проверьте сами (живое доказательство):',
    verifyStep1: 'Откройте любой инструмент (например, Объединение PDF).',
    verifyStep2: 'После загрузки страницы включите режим полета.',
    verifyStep3: 'Обработайте файл — всё выполнится мгновенно без интернета!',
    verifyNote: '💡 Примечание: интернет нужен только для первой загрузки страницы.',
    dontShow: 'Больше не показывать',
    gotIt: 'Понятно!',
  },
};

export default function PrivacyTrustModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // 1. Restore user's preferred language from localStorage
    try {
      const savedLang = localStorage.getItem('tft_privacy_lang');
      if (savedLang && LANGUAGES[savedLang]) {
        setSelectedLang(savedLang);
      }
    } catch (e) {}

    // 2. Only auto-open on the homepage ('/' or '') and NEVER on tool pages (/tools/...)
    if (typeof window !== 'undefined') {
      const isHomepage = window.location.pathname === '/' || window.location.pathname === '';
      const hidePref = localStorage.getItem('tft_hide_privacy_trust_modal');
      
      if (isHomepage && !hidePref) {
        // Gentle non-intrusive 2.8s delay only on homepage
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Listen for manual trigger events from Navbar / Hero badge
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-privacy-modal', handleOpenModal);
    return () => window.removeEventListener('open-privacy-modal', handleOpenModal);
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLang(newLang);
    try {
      localStorage.setItem('tft_privacy_lang', newLang);
    } catch (e) {}
  };

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('tft_hide_privacy_trust_modal', 'true');
      } catch (e) {}
    }
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const current = LANGUAGES[selectedLang] || LANGUAGES.hi;

  return (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy and Trust Explainer"
    >
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.shieldIcon}>
              🛡️
            </div>
            <div>
              <div className={styles.headerTitle}>ToolsforTools Privacy & Trust</div>
              <div className={styles.headerSub}>100% Client-Side In-Browser Processing</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close Modal"
            className={styles.closeBtn}
            title="Press Esc to close"
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Language Selection Bar */}
        <div className={styles.langBar}>
          <div className={styles.langLabel}>
            <Globe style={{ width: '1rem', height: '1rem', color: '#f97316' }} />
            <span>Choose Language / अपनी भाषा चुनें:</span>
          </div>
          <select
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={styles.langSelect}
          >
            {Object.entries(LANGUAGES).map(([key, item]) => (
              <option key={key} value={key}>
                {item.flag} {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content Body */}
        <div className={styles.contentScroll}>
          <h3 className={styles.mainHeading}>
            {current.title}
          </h3>

          <p className={styles.simpleDesc}>
            {current.simpleExplanation}
          </p>

          {/* Scenario Box (Highlighted) */}
          <div className={styles.scenarioBox}>
            <div className={styles.scenarioTitle}>
              {current.scenarioTitle}
            </div>
            <div className={styles.scenarioText} style={{ whiteSpace: 'pre-line' }}>
              {current.scenarioText}
            </div>
          </div>

          {/* Live Demonstration / Self Verification Guide */}
          <div className={styles.verifyBox}>
            <div className={styles.verifyTitle}>
              {current.verifyTitle}
            </div>
            <div className={styles.verifySteps}>
              <div className={styles.verifyStep}>
                <span className={styles.stepBadge}>1</span>
                <span>{current.verifyStep1}</span>
              </div>
              <div className={styles.verifyStep}>
                <span className={styles.stepBadge}>2</span>
                <span>{current.verifyStep2}</span>
              </div>
              <div className={styles.verifyStep}>
                <span className={styles.stepBadge}>3</span>
                <span>{current.verifyStep3}</span>
              </div>
            </div>
            <div className={styles.verifyNote}>
              {current.verifyNote}
            </div>
          </div>

          {/* Key Bullets Grid */}
          <div className={styles.bulletsGrid}>
            <div className={styles.bulletCard}>
              <span className={styles.bulletIcon}>🔒</span>
              <div>
                <div className={styles.bulletTitle}>{current.b1Title}</div>
                <div className={styles.bulletDesc}>{current.b1Desc}</div>
              </div>
            </div>

            <div className={styles.bulletCard}>
              <span className={styles.bulletIcon}>✈️</span>
              <div>
                <div className={styles.bulletTitle}>{current.b2Title}</div>
                <div className={styles.bulletDesc}>{current.b2Desc}</div>
              </div>
            </div>

            <div className={styles.bulletCard}>
              <span className={styles.bulletIcon}>🛡️</span>
              <div>
                <div className={styles.bulletTitle}>{current.b3Title}</div>
                <div className={styles.bulletDesc}>{current.b3Desc}</div>
              </div>
            </div>

            <div className={styles.bulletCard}>
              <span className={styles.bulletIcon}>⚡</span>
              <div>
                <div className={styles.bulletTitle}>{current.b4Title}</div>
                <div className={styles.bulletDesc}>{current.b4Desc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <label className={styles.dontShowLabel}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className={styles.checkbox}
            />
            <span>{current.dontShow}</span>
          </label>

          <button onClick={handleClose} className={styles.actionBtn}>
            {current.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}
