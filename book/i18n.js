/* =====================================================================
   Kalyan Pathlab - भाषा (Language) सिस्टीम
   मराठी (mr), हिंदी (hi), English (en) — वरती भाषा बदलली की संपूर्ण
   वेबसाईटवरचा मजकूर लगेच बदलतो. निवड फोनवर सेव्ह राहते (पुढच्या वेळीही
   तीच भाषा दिसेल).
   ---------------------------------------------------------------------
   टीप: पेशंटने भरलेले रिव्ह्यू, टेस्टची इंग्रजी वैद्यकीय नावं, आणि
   लॅब मालकाला जाणारा WhatsApp/ईमेल मजकूर मुद्दाम भाषांतरित केलेला नाही
   (ते जसंच्या तसं राहतं) — कारण तो अस्सल मजकूर किंवा लॅबसाठीचा
   अंतर्गत मजकूर आहे.
   ===================================================================== */

const TRANSLATIONS = {
  tagline: { mr: "संस्कार फाउंडेशन संचलित · Care For Quality", hi: "संस्कार फाउंडेशन द्वारा संचालित · Care For Quality", en: "Run by Sanskar Foundation · Care For Quality" },

  nav_home: { mr: "🏠 मुख्यपृष्ठ", hi: "🏠 होम", en: "🏠 Home" },
  nav_tests: { mr: "🧪 टेस्ट लिस्ट", hi: "🧪 टेस्ट लिस्ट", en: "🧪 Test List" },
  nav_booking: { mr: "📅 बुकिंग", hi: "📅 बुकिंग", en: "📅 Booking" },
  nav_payment: { mr: "💳 पेमेंट", hi: "💳 पेमेंट", en: "💳 Payment" },
  nav_reviews: { mr: "⭐ रिव्ह्यूज", hi: "⭐ रिव्यू", en: "⭐ Reviews" },
  nav_contact: { mr: "📞 संपर्क", hi: "📞 संपर्क", en: "📞 Contact" },

  discount_badge: { mr: "सर्व टेस्टवर 30% ते 70% सवलत", hi: "सभी टेस्ट पर 30% से 70% तक छूट", en: "30% to 70% off on all tests" },
  hero_title_line1: { mr: "तुमची तपासणी,", hi: "आपकी जांच,", en: "Your test," },
  hero_title_line2: { mr: "घरबसल्या व विश्वासाने.", hi: "घर बैठे और भरोसे के साथ।", en: "at home, with trust." },
  hero_sub: {
    mr: "रक्त तपासणी, फुल बॉडी चेकअप — अचूक रिपोर्ट्स, वाजवी दरात. सॅम्पल कलेक्शनसाठी घरी येण्याची सेवा पूर्ण मोफत.",
    hi: "रक्त जांच, फुल बॉडी चेकअप — सटीक रिपोर्ट, उचित दरों में। सैंपल कलेक्शन के लिए घर आने की सेवा पूरी तरह मुफ्त।",
    en: "Blood tests, full body checkups — accurate reports at fair prices. Home sample collection is completely free."
  },
  btn_book_now: { mr: "🩸 आत्ताच बुकिंग करा", hi: "🩸 अभी बुकिंग करें", en: "🩸 Book Now" },
  btn_whatsapp_ask: { mr: "WhatsApp वर विचारा", hi: "WhatsApp पर पूछें", en: "Ask on WhatsApp" },
  btn_share_friend: { mr: "👥 मित्राला पाठवा", hi: "👥 दोस्त को भेजें", en: "👥 Send to a Friend" },
  stat_tests: { mr: "टेस्ट व प्रोफाइल्स", hi: "टेस्ट व प्रोफाइल", en: "Tests & Profiles" },
  stat_cities: { mr: "शहरांत मोफत होम सर्विस", hi: "शहरों में मुफ्त होम सर्विस", en: "Cities with Free Home Service" },
  stat_lines: { mr: "डायरेक्ट फोन लाईन्स", hi: "डायरेक्ट फोन लाइनें", en: "Direct Phone Lines" },

  cities_heading: { mr: "मोफत होम सॅम्पल कलेक्शन — या शहरांत", hi: "मुफ्त होम सैंपल कलेक्शन — इन शहरों में", en: "Free Home Sample Collection — In These Cities" },

  about_heading: { mr: "स्थानिक, काळजीपूर्वक व सहज उपलब्ध.", hi: "स्थानीय, सावधानीपूर्वक और आसानी से उपलब्ध।", en: "Local, careful, and easily accessible." },
  about_para: {
    mr: "Kalyan Pathlab ही कल्याण परिसरातील विश्वासार्ह डायग्नोस्टिक लॅब आहे, संस्कार फाउंडेशन अंतर्गत चालवली जाते. एक साधी ब्लड टेस्ट असो किंवा फुल बॉडी चेकअप — प्रत्येक सॅम्पल काळजीपूर्वक हाताळला जातो, अत्याधुनिक व स्वयंचलित मशीनवर तपासला जातो आणि रिपोर्ट पोहोचण्याआधी तपासला जातो.",
    hi: "Kalyan Pathlab कल्याण क्षेत्र की एक भरोसेमंद डायग्नोस्टिक लैब है, जो संस्कार फाउंडेशन के तहत चलाई जाती है। चाहे एक साधारण ब्लड टेस्ट हो या फुल बॉडी चेकअप — हर सैंपल सावधानी से संभाला जाता है, अत्याधुनिक व स्वचालित मशीनों पर जांचा जाता है और रिपोर्ट पहुंचने से पहले जांचा जाता है।",
    en: "Kalyan Pathlab is a trusted diagnostic lab in the Kalyan area, run under Sanskar Foundation. Whether it's a simple blood test or a full body checkup — every sample is handled with care, tested on advanced automated machines, and checked before the report reaches you."
  },
  about_stat_categories: { mr: "टेस्ट कॅटेगरीज", hi: "टेस्ट श्रेणियाँ", en: "Test Categories" },

  gallery_heading: { mr: "आमच्या लॅबमध्ये डोकावून पहा", hi: "हमारी लैब में एक नज़र डालें", en: "Take a Peek Inside Our Lab" },
  gallery_sub: { mr: "आमची मशीन्स व टेस्टिंग प्रक्रिया.", hi: "हमारी मशीनें व टेस्टिंग प्रक्रिया।", en: "Our machines and testing process." },

  tests_heading: { mr: "टेस्ट व किंमत यादी", hi: "टेस्ट व मूल्य सूची", en: "Tests & Price List" },
  tests_search_placeholder: { mr: "टेस्टचे नाव टाईप करा… उदा. Thyroid, Sugar, CBC", hi: "टेस्ट का नाम टाइप करें... जैसे Thyroid, Sugar, CBC", en: "Type a test name… e.g. Thyroid, Sugar, CBC" },
  cat_all: { mr: "सर्व", hi: "सभी", en: "All" },
  no_result: {
    mr: "तुम्ही शोधलेली टेस्ट यादीत नाही? काळजी नाही — कॉल करा, आमच्याकडे उपलब्ध असू शकते.",
    hi: "आपके द्वारा खोजी गई टेस्ट सूची में नहीं है? चिंता न करें — कॉल करें, हमारे पास उपलब्ध हो सकती है।",
    en: "Can't find the test you're looking for? Don't worry — give us a call, we may still have it."
  },

  cart_book_btn: { mr: "बुक करा →", hi: "बुक करें →", en: "Book →" },

  booking_heading: { mr: "बुकिंग फॉर्म", hi: "बुकिंग फॉर्म", en: "Booking Form" },
  booking_sub: {
    mr: "खालील माहिती भरा — बुकिंग झाल्यावर तुम्हाला व आम्हाला दोघांनाही कन्फर्मेशन मिळेल.",
    hi: "नीचे दी गई जानकारी भरें — बुकिंग होने पर आपको और हमें दोनों को कन्फर्मेशन मिलेगा।",
    en: "Fill in the details below — once booked, both you and we will get a confirmation."
  },
  selected_tests_label: { mr: "निवडलेल्या टेस्ट:", hi: "चयनित टेस्ट:", en: "Selected Tests:" },
  selected_tests_empty: { mr: "कोणतीही टेस्ट निवडलेली नाही — ", hi: "कोई टेस्ट चयनित नहीं है — ", en: "No tests selected — " },
  selected_tests_choose_link: { mr: "टेस्ट लिस्टमधून निवडा", hi: "टेस्ट लिस्ट से चुनें", en: "choose from the test list" },
  selected_tests_or_type: { mr: " किंवा खाली टाईप करा.", hi: " या नीचे टाइप करें।", en: " or type below." },
  label_manual_test: { mr: "टेस्ट/पॅकेजचे नाव (हवं असल्यास टाईप करा)", hi: "टेस्ट/पैकेज का नाम (चाहें तो टाइप करें)", en: "Test/Package name (type if needed)" },
  label_fullname: { mr: "तुमचे पूर्ण नाव *", hi: "आपका पूरा नाम *", en: "Your Full Name *" },
  placeholder_fullname: { mr: "पूर्ण नाव", hi: "पूरा नाम", en: "Full name" },
  label_phone: { mr: "मोबाईल नंबर *", hi: "मोबाइल नंबर *", en: "Mobile Number *" },
  placeholder_phone: { mr: "10 अंकी मोबाईल नंबर", hi: "10 अंकों का मोबाइल नंबर", en: "10-digit mobile number" },
  label_altphone: { mr: "पर्यायी संपर्क नंबर", hi: "वैकल्पिक संपर्क नंबर", en: "Alternate Contact Number" },
  placeholder_altphone: { mr: "घरचा/दुसरा नंबर (ऐच्छिक)", hi: "घर का/दूसरा नंबर (वैकल्पिक)", en: "Home/other number (optional)" },
  label_address: { mr: "पूर्ण पत्ता *", hi: "पूरा पता *", en: "Full Address *" },
  placeholder_address: { mr: "घर/फ्लॅट नं, इमारत, एरिया, शहर, पिनकोड", hi: "घर/फ्लैट नं, इमारत, एरिया, शहर, पिनकोड", en: "House/flat no, building, area, city, pincode" },
  label_city: { mr: "शहर *", hi: "शहर *", en: "City *" },
  city_placeholder_option: { mr: "शहर निवडा", hi: "शहर चुनें", en: "Select city" },
  btn_location: { mr: "📍 माझे सध्याचे लोकेशन जोडा (ऐच्छिक)", hi: "📍 मेरा वर्तमान लोकेशन जोड़ें (वैकल्पिक)", en: "📍 Add My Current Location (optional)" },
  label_doctor: { mr: "रेफरन्स डॉक्टर किंवा स्वतः", hi: "रेफरेंस डॉक्टर या स्वयं", en: "Referring Doctor or Self" },
  placeholder_doctor: { mr: "डॉ. चे नाव लिहा, किंवा 'स्वतः' असे लिहा", hi: "डॉ. का नाम लिखें, या 'स्वयं' लिखें", en: "Enter doctor's name, or write 'Self'" },
  label_collection_date: { mr: "सॅम्पल कलेक्शनचा दिवस *", hi: "सैंपल कलेक्शन की तारीख *", en: "Sample Collection Date *" },
  label_collection_time: { mr: "वेळ *", hi: "समय *", en: "Time *" },
  label_report_mode: { mr: "रिपोर्ट कसा हवा? *", hi: "रिपोर्ट कैसे चाहिए? *", en: "How would you like the report? *" },
  report_hardcopy: { mr: "हार्ड कॉपी (घरी)", hi: "हार्ड कॉपी (घर पर)", en: "Hard Copy (at home)" },
  report_whatsapp: { mr: "WhatsApp", hi: "WhatsApp", en: "WhatsApp" },
  report_email: { mr: "ईमेल", hi: "ईमेल", en: "Email" },
  label_email: { mr: "ईमेल आयडी", hi: "ईमेल आईडी", en: "Email ID" },
  label_prescription: { mr: "डॉक्टरचं प्रिस्क्रिप्शन (असल्यास, ऐच्छिक)", hi: "डॉक्टर का प्रिस्क्रिप्शन (हो तो, वैकल्पिक)", en: "Doctor's Prescription (if any, optional)" },
  consent_text: {
    mr: "वरील सर्व माहिती बरोबर आहे व मी सॅम्पल कलेक्शनसाठी संपर्क करण्यास संमती देतो.",
    hi: "उपरोक्त सभी जानकारी सही है और मैं सैंपल कलेक्शन के लिए संपर्क करने की सहमति देता/देती हूं।",
    en: "All the information above is correct, and I consent to being contacted for sample collection."
  },
  btn_confirm_booking: { mr: "✅ बुकिंग कन्फर्म करा", hi: "✅ बुकिंग कन्फर्म करें", en: "✅ Confirm Booking" },
  booking_form_note: {
    mr: "बुकिंगनंतर WhatsApp विंडो उघडेल — तिथे फक्त \"Send\" दाबा, म्हणजे आमच्याकडे लगेच बुकिंग पोहोचेल.",
    hi: "बुकिंग के बाद WhatsApp विंडो खुलेगी — वहाँ सिर्फ \"Send\" दबाएँ, ताकि आपकी बुकिंग हमारे पास तुरंत पहुंचे।",
    en: "After booking, a WhatsApp window will open — just tap \"Send\" there, and your booking will reach us instantly."
  },

  payment_heading: { mr: "ऑनलाइन पेमेंट (ऐच्छिक)", hi: "ऑनलाइन पेमेंट (वैकल्पिक)", en: "Online Payment (optional)" },
  payment_sub: {
    mr: "सॅम्पल कलेक्शनच्या वेळी कॅश किंवा खालील QR कोड स्कॅन करून UPI ने पेमेंट करू शकता.",
    hi: "सैंपल कलेक्शन के समय कैश या नीचे दिए गए QR कोड को स्कैन करके UPI से भुगतान कर सकते हैं।",
    en: "You can pay by cash at the time of sample collection, or scan the QR code below to pay via UPI."
  },

  reviews_heading: { mr: "पेशंट्सचा अनुभव", hi: "मरीज़ों का अनुभव", en: "Patient Experiences" },
  reviews_sub: {
    mr: "आमच्याकडे टेस्ट केलेल्या पेशंट्सचे मत — तुमचाही अनुभव शेअर करा.",
    hi: "हमारे यहाँ टेस्ट करवाने वाले मरीज़ों की राय — अपना अनुभव भी शेयर करें।",
    en: "What our patients say — share your experience too."
  },
  btn_write_review: { mr: "✍️ तुमचा रिव्ह्यू लिहा", hi: "✍️ अपना रिव्यू लिखें", en: "✍️ Write Your Review" },
  btn_close_review: { mr: "✕ रिव्ह्यू फॉर्म बंद करा", hi: "✕ रिव्यू फॉर्म बंद करें", en: "✕ Close Review Form" },
  review_modal_title: { mr: "तुमचा रिव्ह्यू लिहा", hi: "अपना रिव्यू लिखें", en: "Write Your Review" },
  label_review_name: { mr: "तुमचे नाव *", hi: "आपका नाम *", en: "Your Name *" },
  placeholder_review_name: { mr: "तुमचे नाव", hi: "आपका नाम", en: "Your name" },
  label_review_phone: {
    mr: "मोबाईल नंबर (फक्त पडताळणीसाठी, पब्लिक दिसणार नाही)",
    hi: "मोबाइल नंबर (केवल सत्यापन हेतु, सार्वजनिक नहीं दिखेगा)",
    en: "Mobile Number (for verification only, not shown publicly)"
  },
  label_review_test: { mr: "तुम्ही कोणती टेस्ट/सर्व्हिस घेतली?", hi: "आपने कौन सी टेस्ट/सर्विस ली?", en: "Which test/service did you take?" },
  label_rating: { mr: "रेटिंग द्या *", hi: "रेटिंग दें *", en: "Give a Rating *" },
  label_feedback: { mr: "तुमचा अभिप्राय *", hi: "आपकी प्रतिक्रिया *", en: "Your Feedback *" },
  placeholder_feedback: { mr: "तुमचा अनुभव इथे लिहा…", hi: "अपना अनुभव यहाँ लिखें...", en: "Write your experience here…" },
  btn_submit_review: { mr: "रिव्ह्यू सबमिट करा", hi: "रिव्यू सबमिट करें", en: "Submit Review" },
  review_form_note: {
    mr: "रिव्ह्यू आमच्या टीमकडून तपासल्यानंतर पेजवर दिसेल.",
    hi: "रिव्यू हमारी टीम द्वारा जांचे जाने के बाद पेज पर दिखेगा।",
    en: "Your review will appear on the page after our team verifies it."
  },
  review_thanks_note: {
    mr: "तुमचा रिव्ह्यू आमच्या टीमकडून तपासल्यानंतर पेजवर दिसेल.",
    hi: "आपका रिव्यू हमारी टीम द्वारा जांचे जाने के बाद पेज पर दिखेगा।",
    en: "Your review will appear on the page after our team verifies it."
  },

  footer_address_label: { mr: "पत्ता", hi: "पता", en: "Address" },
  footer_maps_link: { mr: "Google Maps वर पहा →", hi: "Google Maps पर देखें →", en: "View on Google Maps →" },
  footer_contact_label: { mr: "संपर्क", hi: "संपर्क", en: "Contact" },
  footer_whatsapp_link: { mr: "WhatsApp वर मेसेज करा →", hi: "WhatsApp पर मैसेज करें →", en: "Message on WhatsApp →" },
  footer_timing_label: { mr: "वेळ", hi: "समय", en: "Hours" },
  footer_timing_text: {
    mr: "सोम - शनि: 7:00 AM – 9:00 PM<br />रवि: 8:00 AM – 1:00 PM",
    hi: "सोम - शनि: 7:00 AM – 9:00 PM<br />रवि: 8:00 AM – 1:00 PM",
    en: "Mon - Sat: 7:00 AM – 9:00 PM<br />Sun: 8:00 AM – 1:00 PM"
  },
  main_site_btn: { mr: "🌐 वेबसाईटला भेट देण्यासाठी क्लिक करा", hi: "🌐 वेबसाइट पर जाने के लिए क्लिक करें", en: "🌐 Click to Visit Our Website" },
  copyright: { mr: "© Kalyan Pathlab, Kalyan East · संस्कार फाउंडेशन संचलित", hi: "© Kalyan Pathlab, Kalyan East · संस्कार फाउंडेशन द्वारा संचालित", en: "© Kalyan Pathlab, Kalyan East · Run by Sanskar Foundation" },

  toast_select_test: { mr: "कृपया किमान एक टेस्ट निवडा किंवा नाव टाईप करा.", hi: "कृपया कम से कम एक टेस्ट चुनें या नाम टाइप करें।", en: "Please select at least one test or type a name." },
  toast_select_city: { mr: "कृपया शहर निवडा.", hi: "कृपया शहर चुनें।", en: "Please select a city." },
  toast_booking_ready: { mr: "बुकिंग माहिती तयार झाली ✓", hi: "बुकिंग जानकारी तैयार हो गई ✓", en: "Booking details ready ✓" },
  toast_prescription_large: {
    mr: "प्रिस्क्रिप्शन फाईल खूप मोठी आहे (8MB पेक्षा जास्त) — फाईलशिवाय बुकिंग पाठवली जाईल.",
    hi: "प्रिस्क्रिप्शन फाइल बहुत बड़ी है (8MB से अधिक) — फाइल के बिना बुकिंग भेजी जाएगी।",
    en: "Prescription file is too large (over 8MB) — booking will be sent without the file."
  },
  toast_give_rating: { mr: "कृपया स्टार रेटिंग द्या.", hi: "कृपया स्टार रेटिंग दें।", en: "Please give a star rating." },

  loc_not_supported: { mr: "या ब्राउझरमध्ये लोकेशन सपोर्ट नाही.", hi: "इस ब्राउज़र में लोकेशन सपोर्ट नहीं है।", en: "Location isn't supported in this browser." },
  loc_searching: { mr: "लोकेशन शोधत आहे…", hi: "लोकेशन खोजा जा रहा है...", en: "Finding location…" },
  loc_added: { mr: "✓ लोकेशन जोडले", hi: "✓ लोकेशन जोड़ा गया", en: "✓ Location added" },
  loc_failed: { mr: "लोकेशन मिळाले नाही — परवानगी द्या किंवा नंतर प्रयत्न करा.", hi: "लोकेशन नहीं मिला — अनुमति दें या बाद में प्रयास करें।", en: "Couldn't get location — please allow access or try again later." },

  confirm_box_title: { mr: "✅ बुकिंगची माहिती तयार झाली!", hi: "✅ बुकिंग जानकारी तैयार हो गई!", en: "✅ Your booking details are ready!" },
  confirm_box_text: {
    mr: "खालील बटणावर क्लिक करून WhatsApp मध्ये फक्त \"Send\" दाबा — म्हणजे तुमची बुकिंग लगेच आमच्यापर्यंत पोहोचेल.",
    hi: "नीचे दिए गए बटन पर क्लिक करके WhatsApp में सिर्फ \"Send\" दबाएँ — ताकि आपकी बुकिंग हमारे पास तुरंत पहुंच जाए।",
    en: "Click the button below and just tap \"Send\" in WhatsApp — your booking will reach us right away."
  },
  confirm_box_wa_btn: { mr: "WhatsApp वर बुकिंग पाठवा", hi: "WhatsApp पर बुकिंग भेजें", en: "Send Booking via WhatsApp" },
  confirm_box_or_call: { mr: "किंवा थेट कॉल करा:", hi: "या सीधे कॉल करें:", en: "Or call us directly:" },
  thank_you: { mr: "धन्यवाद", hi: "धन्यवाद", en: "Thank you" },
  review_word: { mr: "रिव्ह्यू", hi: "रिव्यू", en: "reviews" },

  welcome_back: { mr: "पुन्हा स्वागत आहे", hi: "फिर से स्वागत है", en: "Welcome back" },
  visits_count_prefix: { mr: "आधीच्या भेटी:", hi: "पिछली विज़िट:", en: "Previous visits:" },
  last_test_prefix: { mr: "शेवटची टेस्ट", hi: "पिछली टेस्ट", en: "Last test" },
  autofill_btn: { mr: "माहिती भरा", hi: "जानकारी भरें", en: "Fill my details" },
  autofill_done: { mr: "माहिती भरली ✓", hi: "जानकारी भर दी ✓", en: "Details filled ✓" }
};

// ठराविक शहरांची नावं भाषेनुसार दाखवण्यासाठी (पाठवला जाणारा खरा डेटा नेहमी मराठीतच राहतो,
// जेणेकरून लॅबच्या Sheet/ईमेलमध्ये सुसंगतता राहील — फक्त वेबसाईटवरचं लेबल भाषेनुसार बदलतं)
const CITY_TRANSLATIONS = {
  "कल्याण": { hi: "कल्याण", en: "Kalyan" },
  "डोंबिवली": { hi: "डोंबिवली", en: "Dombivli" },
  "अंबरनाथ": { hi: "अंबरनाथ", en: "Ambernath" },
  "बदलापूर": { hi: "बदलापुर", en: "Badlapur" },
  "उल्हासनगर": { hi: "उल्हासनगर", en: "Ulhasnagar" },
  "ठाणे": { hi: "ठाणे", en: "Thane" },
  "मुंबई": { hi: "मुंबई", en: "Mumbai" },
  "नवी मुंबई": { hi: "नवी मुंबई", en: "Navi Mumbai" }
};

// built-in टेस्ट कॅटेगरींची नावं भाषेनुसार (tests-data.js मधल्या id शी जोडलेली).
// Sheet मधून लाईव्ह डेटा आला, तर त्यातल्या कॅटेगरी क्लायंटने Sheet मध्ये जशा लिहिल्या
// तशाच दिसतील (त्यांचं भाषांतर आपोआप होणार नाही).
const CATEGORY_TRANSLATIONS = {
  basic: { hi: "बेसिक व रूटीन टेस्ट", en: "Basic & Routine Tests" },
  diabetes: { hi: "डायबिटीज़ (मधुमेह) प्रोफाइल", en: "Diabetes Profile" },
  thyroid: { hi: "थायरॉइड प्रोफाइल", en: "Thyroid Profile" },
  liver: { hi: "लिवर फंक्शन टेस्ट (LFT)", en: "Liver Function Test (LFT)" },
  kidney: { hi: "किडनी फंक्शन टेस्ट (KFT)", en: "Kidney Function Test (KFT)" },
  lipid: { hi: "लिपिड प्रोफाइल (हृदय / कोलेस्ट्रॉल)", en: "Lipid Profile (Heart / Cholesterol)" },
  vitamins: { hi: "विटामिन व मिनरल्स", en: "Vitamins & Minerals" },
  infection: { hi: "इन्फेक्शन व बुखार संबंधित", en: "Infection & Fever Related" },
  hormones: { hi: "हार्मोन्स व फर्टिलिटी", en: "Hormones & Fertility" },
  cardiac: { hi: "कार्डियक व अन्य", en: "Cardiac & Others" },
  packages: { hi: "फुल बॉडी चेकअप पैकेज", en: "Full Body Checkup Packages" }
};

let currentLang = localStorage.getItem("kp_lang") || "en";

function t(key) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[currentLang] || entry.mr || key;
}

// एखाद्या कॅटेगरीचं नाव सध्याच्या भाषेत परत देते (built-in कॅटेगरीसाठी भाषांतर वापरतं,
// Sheet मधून आलेल्या कॅटेगरीसाठी जसं लिहिलंय तसंच दाखवतं)
function translateCategoryName(cat) {
  if (currentLang === "mr") return cat.name;
  const tr = CATEGORY_TRANSLATIONS[cat.id];
  return (tr && tr[currentLang]) || cat.name;
}

// शहराचं नाव सध्याच्या भाषेत परत देते (पाठवला जाणारा value मात्र नेहमी मूळ मराठी नावच असतो)
function translateCityName(cityMr) {
  if (currentLang === "mr") return cityMr;
  const tr = CITY_TRANSLATIONS[cityMr];
  return (tr && tr[currentLang]) || cityMr;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("kp_lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });

  const langSelect = document.getElementById("langSelect");
  if (langSelect) langSelect.value = lang;

  // JS ने आधीच तयार केलेला डायनॅमिक भाग पुन्हा भाषेनुसार रेंडर करतो
  if (typeof onLanguageChanged === "function") onLanguageChanged();
}

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener("change", (e) => applyLanguage(e.target.value));
  }
  applyLanguage(currentLang);
});
