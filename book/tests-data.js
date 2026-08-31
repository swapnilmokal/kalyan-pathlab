// Kalyan Pathlab - Test & Profile price list
// mrp = मूळ किंमत, price = 30-70% सवलतीनंतरची किंमत
// लॅब मालक ही यादी सहज बदलू शकतात (खाली प्रत्येक ओळ एक टेस्ट आहे)
let TEST_CATEGORIES = [
  {
    id: "basic",
    name: "बेसिक व रुटीन टेस्ट",
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: 500, price: 199 },
      { name: "Hemoglobin (Hb)", mrp: 200, price: 99 },
      { name: "ESR (Erythrocyte Sedimentation Rate)", mrp: 200, price: 99 },
      { name: "Blood Grouping (ABO & Rh)", mrp: 300, price: 149 },
      { name: "Peripheral Smear Study", mrp: 400, price: 199 },
      { name: "Platelet Count", mrp: 250, price: 99 },
      { name: "Complete Urine Examination (CUE)", mrp: 300, price: 129 },
      { name: "Stool Routine Examination", mrp: 300, price: 149 }
    ]
  },
  {
    id: "diabetes",
    name: "डायबिटीस (मधुमेह) प्रोफाइल",
    tests: [
      { name: "Blood Sugar Fasting (FBS)", mrp: 150, price: 69 },
      { name: "Blood Sugar PP (Post Meal)", mrp: 150, price: 69 },
      { name: "Random Blood Sugar (RBS)", mrp: 150, price: 69 },
      { name: "HbA1c (Glycated Hemoglobin)", mrp: 900, price: 399 },
      { name: "Diabetes Profile (FBS+PP+HbA1c)", mrp: 1200, price: 499 },
      { name: "Insulin Fasting", mrp: 900, price: 449 }
    ]
  },
  {
    id: "thyroid",
    name: "थायरॉईड प्रोफाइल",
    tests: [
      { name: "TSH (Thyroid Stimulating Hormone)", mrp: 500, price: 199 },
      { name: "T3, T4, TSH (Thyroid Profile)", mrp: 900, price: 349 },
      { name: "Free T3 / Free T4", mrp: 700, price: 299 },
      { name: "Anti TPO Antibody", mrp: 1200, price: 599 }
    ]
  },
  {
    id: "liver",
    name: "लिव्हर फंक्शन टेस्ट (LFT)",
    tests: [
      { name: "Liver Function Test (LFT) - Complete", mrp: 900, price: 399 },
      { name: "SGPT (ALT)", mrp: 250, price: 99 },
      { name: "SGOT (AST)", mrp: 250, price: 99 },
      { name: "Bilirubin Total & Direct", mrp: 300, price: 129 },
      { name: "Serum Protein & Albumin", mrp: 400, price: 179 }
    ]
  },
  {
    id: "kidney",
    name: "किडनी फंक्शन टेस्ट (KFT)",
    tests: [
      { name: "Kidney Function Test (KFT) - Complete", mrp: 900, price: 399 },
      { name: "Serum Creatinine", mrp: 250, price: 99 },
      { name: "Blood Urea", mrp: 250, price: 99 },
      { name: "Serum Uric Acid", mrp: 300, price: 129 },
      { name: "Electrolytes (Na, K, Cl)", mrp: 600, price: 279 }
    ]
  },
  {
    id: "lipid",
    name: "लिपिड प्रोफाइल (हृदय / कोलेस्ट्रॉल)",
    tests: [
      { name: "Lipid Profile - Complete", mrp: 800, price: 349 },
      { name: "Total Cholesterol", mrp: 250, price: 99 },
      { name: "Triglycerides", mrp: 250, price: 99 },
      { name: "HDL / LDL Cholesterol", mrp: 400, price: 179 }
    ]
  },
  {
    id: "vitamins",
    name: "व्हिटॅमिन व मिनरल्स",
    tests: [
      { name: "Vitamin D (25-Hydroxy)", mrp: 1800, price: 649 },
      { name: "Vitamin B12", mrp: 1200, price: 499 },
      { name: "Iron Profile (Iron, TIBC, Ferritin)", mrp: 1500, price: 649 },
      { name: "Calcium Serum", mrp: 350, price: 149 },
      { name: "Magnesium Serum", mrp: 400, price: 189 }
    ]
  },
  {
    id: "infection",
    name: "इन्फेक्शन व ताप संबंधित",
    tests: [
      { name: "Widal Test (Typhoid)", mrp: 300, price: 149 },
      { name: "Dengue NS1 Antigen", mrp: 900, price: 399 },
      { name: "Dengue IgG/IgM", mrp: 900, price: 399 },
      { name: "Malaria Antigen Test", mrp: 400, price: 189 },
      { name: "CRP (C-Reactive Protein)", mrp: 600, price: 249 },
      { name: "COVID-19 RT-PCR", mrp: 700, price: 299 }
    ]
  },
  {
    id: "hormones",
    name: "हार्मोन्स व फर्टिलिटी",
    tests: [
      { name: "Pregnancy Test (Beta hCG)", mrp: 500, price: 199 },
      { name: "Prolactin", mrp: 800, price: 349 },
      { name: "Testosterone Total", mrp: 900, price: 399 },
      { name: "FSH / LH", mrp: 900, price: 399 }
    ]
  },
  {
    id: "cardiac",
    name: "कार्डियाक व इतर",
    tests: [
      { name: "ECG (Electrocardiogram)", mrp: 400, price: 199 },
      { name: "Troponin I", mrp: 1200, price: 599 },
      { name: "RA Factor (Rheumatoid Arthritis)", mrp: 600, price: 279 },
      { name: "ASO Titer", mrp: 600, price: 279 }
    ]
  },
  {
    id: "packages",
    name: "फुल बॉडी चेकअप पॅकेजेस",
    tests: [
      { name: "बेसिक हेल्थ चेकअप (CBC+Sugar+Urine)", mrp: 900, price: 349 },
      { name: "फुल बॉडी चेकअप (CBC, LFT, KFT, Lipid, Thyroid, Sugar, Urine)", mrp: 3500, price: 999 },
      { name: "सिनियर सिटीझन हेल्थ पॅकेज", mrp: 4500, price: 1399 },
      { name: "मास्टर हेल्थ चेकअप (Vitamins सह)", mrp: 6000, price: 1899 },
      { name: "प्री-मॅरेज हेल्थ चेकअप", mrp: 2500, price: 899 }
    ]
  }
];
