/* =====================================================================
   Kalyan Pathlab - मुख्य वेबसाईटसाठी भाषा (Language) सिस्टीम
   English (डिफॉल्ट), मराठी, हिंदी — निवड फोनवर सेव्ह राहते.
   टीप: पेशंटचे खरे रिव्ह्यू व टेस्टची वैद्यकीय इंग्रजी नावं मुद्दाम
   भाषांतरित केलेली नाहीत.
   ===================================================================== */

const TRANSLATIONS = {
  ticker: { en: "30% to 70% off on various blood tests — call and book today", mr: "विविध ब्लड टेस्टवर 30% ते 70% सवलत — आजच कॉल करून बुक करा", hi: "विभिन्न ब्लड टेस्ट पर 30% से 70% तक छूट — आज ही कॉल करके बुक करें" },
  tagline: { en: "Pathology Laboratory · Kalyan East", mr: "पॅथोलॉजी लॅबोरेटरी · कल्याण ईस्ट", hi: "पैथोलॉजी लैबोरेटरी · कल्याण ईस्ट" },
  nav_services: { en: "Services", mr: "सेवा", hi: "सेवाएं" },
  nav_about: { en: "About", mr: "आमच्याबद्दल", hi: "हमारे बारे में" },
  nav_gallery: { en: "Gallery", mr: "गॅलरी", hi: "गैलरी" },
  nav_reviews: { en: "Reviews", mr: "रिव्ह्यूज", hi: "रिव्यू" },
  nav_contact: { en: "Contact", mr: "संपर्क", hi: "संपर्क" },

  hero_eyebrow: { en: "Kalyan East · Run by Sanskar Foundation", mr: "कल्याण ईस्ट · संस्कार फाउंडेशन संचलित", hi: "कल्याण ईस्ट · संस्कार फाउंडेशन द्वारा संचालित" },
  hero_title: { en: "Your results,<br /><em>read clearly.</em>", mr: "तुमचे रिझल्ट्स,<br /><em>स्पष्ट व सहज समजणारे.</em>", hi: "आपके रिज़ल्ट,<br /><em>स्पष्ट और आसान।</em>" },
  hero_sub: {
    en: "Blood tests, full body checkups and COVID-19 testing — done carefully, explained simply. Home sample collection available.",
    mr: "रक्त तपासणी, फुल बॉडी चेकअप व COVID-19 टेस्टिंग — काळजीपूर्वक व सोप्या भाषेत समजावून. होम सॅम्पल कलेक्शन उपलब्ध.",
    hi: "रक्त जांच, फुल बॉडी चेकअप और COVID-19 टेस्टिंग — सावधानी से, सरल भाषा में समझाई गई। होम सैंपल कलेक्शन उपलब्ध।"
  },
  btn_call: { en: "Call", mr: "कॉल करा", hi: "कॉल करें" },
  btn_whatsapp: { en: "WhatsApp", mr: "WhatsApp", hi: "WhatsApp" },
  btn_download_app: { en: "Download Our Booking App", mr: "आमचं बुकिंग अ‍ॅप डाउनलोड करा", hi: "हमारा बुकिंग ऐप डाउनलोड करें" },
  hero_photo_cap: { en: "Our actual lab — Kalyan East", mr: "आमची प्रत्यक्ष लॅब — कल्याण ईस्ट", hi: "हमारी असली लैब — कल्याण ईस्ट" },

  stat_off: { en: "Off select blood tests", mr: "निवडक ब्लड टेस्टवर सवलत", hi: "चुनिंदा ब्लड टेस्ट पर छूट" },
  stat_home_word: { en: "Home", mr: "होम", hi: "होम" },
  stat_home_sub: { en: "Sample collection", mr: "सॅम्पल कलेक्शन", hi: "सैंपल कलेक्शन" },
  stat_lines: { en: "Direct phone lines", mr: "डायरेक्ट फोन लाईन्स", hi: "डायरेक्ट फोन लाइनें" },
  stat_digital_word: { en: "Digital", mr: "डिजिटल", hi: "डिजिटल" },
  stat_digital_sub: { en: "Reports", mr: "रिपोर्ट्स", hi: "रिपोर्ट" },
  stat_categories: { en: "Test categories offered", mr: "टेस्ट कॅटेगरीज", hi: "टेस्ट श्रेणियाँ" },

  app_banner_title: { en: "📱 Book Faster with Our App", mr: "📱 अ‍ॅपवरून जलद बुकिंग करा", hi: "📱 ऐप से तेज़ी से बुकिंग करें" },
  app_banner_sub: {
    en: "See exact prices for 50+ tests, book a home visit, and track it all — right from your phone. Free, no installation from an app store needed.",
    mr: "50+ टेस्टच्या नेमक्या किंमती बघा, होम व्हिजिट बुक करा — सगळं फोनवरूनच. पूर्ण मोफत, ॲप स्टोअरमधून इन्स्टॉल करायची गरज नाही.",
    hi: "50+ टेस्ट की सटीक कीमतें देखें, होम विज़िट बुक करें — सब कुछ फोन से ही। पूरी तरह मुफ्त, ऐप स्टोर से इंस्टॉल करने की ज़रूरत नहीं।"
  },
  btn_open_app: { en: "Open Booking App →", mr: "बुकिंग अ‍ॅप उघडा →", hi: "बुकिंग ऐप खोलें →" },

  services_heading: { en: "A full range of diagnostics, under one roof.", mr: "एकाच ठिकाणी सर्व प्रकारच्या टेस्ट्स.", hi: "एक ही जगह सभी प्रकार की जांचें।" },
  services_sub: { en: "Type to search a test or profile — from routine screening to complete checkups.", mr: "टेस्ट किंवा प्रोफाइल शोधण्यासाठी टाईप करा.", hi: "टेस्ट या प्रोफाइल खोजने के लिए टाइप करें।" },
  search_placeholder: { en: "Search a test…", mr: "टेस्ट शोधा…", hi: "टेस्ट खोजें…" },
  no_result: { en: "No matching test found — call us, we likely still offer it.", mr: "तुम्ही शोधलेली टेस्ट सापडली नाही — कॉल करा, आमच्याकडे उपलब्ध असू शकते.", hi: "आपके द्वारा खोजी गई टेस्ट नहीं मिली — कॉल करें, हमारे पास उपलब्ध हो सकती है।" },

  home_visit_title: { en: "Can't visit us? We'll come to you.", mr: "येणं जमत नाही? आम्ही तुमच्याकडे येतो.", hi: "आ नहीं सकते? हम आपके पास आएंगे।" },
  home_visit_sub: { en: "Free home sample collection available across these cities:", mr: "या शहरांत मोफत होम सॅम्पल कलेक्शन उपलब्ध:", hi: "इन शहरों में मुफ्त होम सैंपल कलेक्शन उपलब्ध:" },
  city_kalyan: { en: "Kalyan", mr: "कल्याण", hi: "कल्याण" },
  city_dombivli: { en: "Dombivli", mr: "डोंबिवली", hi: "डोंबिवली" },
  city_ambernath: { en: "Ambernath", mr: "अंबरनाथ", hi: "अंबरनाथ" },
  city_badlapur: { en: "Badlapur", mr: "बदलापूर", hi: "बदलापुर" },
  city_ulhasnagar: { en: "Ulhasnagar", mr: "उल्हासनगर", hi: "उल्हासनगर" },
  city_thane: { en: "Thane", mr: "ठाणे", hi: "ठाणे" },
  city_mumbai: { en: "Mumbai", mr: "मुंबई", hi: "मुंबई" },
  city_navimumbai: { en: "Navi Mumbai", mr: "नवी मुंबई", hi: "नवी मुंबई" },
  btn_book_home: { en: "Book Home Collection", mr: "होम कलेक्शन बुक करा", hi: "होम कलेक्शन बुक करें" },

  about_heading: { en: "Local, careful, and easy to reach.", mr: "स्थानिक, काळजीपूर्वक व सहज उपलब्ध.", hi: "स्थानीय, सावधानीपूर्वक और आसानी से उपलब्ध।" },
  about_para: {
    en: "Kalyan Pathlab is a trusted diagnostic centre in Kalyan East, operated under Sanskar Foundation. Whether it's a single blood test or a full body checkup, our team handles every sample with care — processed on modern, automated equipment and reviewed before the report reaches you.",
    mr: "Kalyan Pathlab ही कल्याण ईस्ट येथील विश्वासार्ह डायग्नोस्टिक लॅब आहे, संस्कार फाउंडेशन अंतर्गत चालवली जाते. एक साधी ब्लड टेस्ट असो किंवा फुल बॉडी चेकअप — प्रत्येक सॅम्पल काळजीपूर्वक हाताळला जातो, अत्याधुनिक व स्वयंचलित मशीनवर तपासला जातो आणि रिपोर्ट पोहोचण्याआधी तपासला जातो.",
    hi: "Kalyan Pathlab कल्याण ईस्ट की एक भरोसेमंद डायग्नोस्टिक लैब है, जो संस्कार फाउंडेशन के तहत चलाई जाती है। चाहे एक साधारण ब्लड टेस्ट हो या फुल बॉडी चेकअप — हर सैंपल सावधानी से संभाला जाता है, अत्याधुनिक व स्वचालित मशीनों पर जांचा जाता है और रिपोर्ट पहुंचने से पहले जांचा जाता है।"
  },
  tag_fast: { en: "Fast & accurate reports", mr: "जलद व अचूक रिपोर्ट्स", hi: "तेज़ व सटीक रिपोर्ट" },
  tag_private: { en: "Privacy & trusted service", mr: "गोपनीयता व विश्वासार्ह सेवा", hi: "गोपनीयता व भरोसेमंद सेवा" },
  tag_modern: { en: "Testing on modern equipment", mr: "अत्याधुनिक मशीनद्वारे तपासणी", hi: "अत्याधुनिक मशीनों से जांच" },

  gallery_heading: { en: "Inside the lab.", mr: "लॅबच्या आत.", hi: "लैब के अंदर।" },
  gallery_sub: { en: "A look at our equipment and testing process.", mr: "आमची मशीन्स व टेस्टिंग प्रक्रिया.", hi: "हमारी मशीनें व टेस्टिंग प्रक्रिया।" },

  reviews_heading: { en: "What patients are saying.", mr: "पेशंट्सचा अनुभव.", hi: "मरीज़ों का अनुभव।" },
  reviews_sub: { en: "Real words from patients who've visited Kalyan Pathlab.", mr: "आमच्याकडे टेस्ट केलेल्या पेशंट्सचे मत.", hi: "हमारे यहाँ जांच करवाने वाले मरीज़ों की राय।" },

  contact_heading: { en: "Book a test or ask a question.", mr: "टेस्ट बुक करा किंवा प्रश्न विचारा.", hi: "टेस्ट बुक करें या सवाल पूछें।" },
  contact_phone: { en: "Phone", mr: "फोन", hi: "फोन" },
  contact_email: { en: "Email", mr: "ईमेल", hi: "ईमेल" },
  contact_address: { en: "Address", mr: "पत्ता", hi: "पता" },
  contact_directions: { en: "Get directions →", mr: "Google Maps वर पहा →", hi: "Google Maps पर देखें →" },
  contact_timings: { en: "Timings", mr: "वेळ", hi: "समय" },
  timings_weekday: { en: "Monday – Saturday: 7:00 AM – 9:00 PM", mr: "सोम - शनि: 7:00 AM – 9:00 PM", hi: "सोम - शनि: 7:00 AM – 9:00 PM" },
  timings_sunday: { en: "Sunday: 8:00 AM – 1:00 PM", mr: "रवि: 8:00 AM – 1:00 PM", hi: "रवि: 8:00 AM – 1:00 PM" },
  copyright: { en: "© Kalyan Pathlab, Kalyan East · Run by Sanskar Foundation", mr: "© Kalyan Pathlab, Kalyan East · संस्कार फाउंडेशन संचलित", hi: "© Kalyan Pathlab, Kalyan East · संस्कार फाउंडेशन द्वारा संचालित" }
};

let currentLang = localStorage.getItem("kp_main_lang") || "en";

function t(key) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[currentLang] || entry.en || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("kp_main_lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
  const sel = document.getElementById("langSelect");
  if (sel) sel.value = lang;
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("langSelect");
  if (sel) {
    sel.value = currentLang;
    sel.addEventListener("change", (e) => applyLanguage(e.target.value));
  }
  applyLanguage(currentLang);

  // टेस्ट शोध (Search)
  const search = document.getElementById("testSearch");
  const cards = document.querySelectorAll(".service-card");
  const noResult = document.getElementById("noResult");
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.trim().toLowerCase();
      let any = false;
      cards.forEach((card) => {
        const match = card.textContent.toLowerCase().includes(term);
        card.style.display = match ? "" : "none";
        if (match) any = true;
      });
      noResult.style.display = any ? "none" : "block";
    });
  }
});
