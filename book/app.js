/* =====================================================================
   Kalyan Pathlab - App Logic
   खाली दिलेला CONFIG बदलून तुम्ही नंबर/ईमेल/बॅकएंड लिंक अपडेट करू शकता.
   ===================================================================== */
const CONFIG = {
  labWhatsApp: "919870020674",          // बुकिंग/रिपोर्ट साठी लॅबचा WhatsApp नंबर
  labEmail: "kalyan.pathlab.21@gmail.com",
  // खाली Google Apps Script Web App डिप्लॉय केल्यावर मिळणारी लिंक टाका (README.md पहा)
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbzLz9yim3gKfD98p574l1kB8yENS1cJgspb5Ewt6HYRM-XetF4awiaGya5diEAE1Na81A/exec",
  cities: ["कल्याण", "डोंबिवली", "अंबरनाथ", "बदलापूर", "उल्हासनगर", "ठाणे", "मुंबई", "नवी मुंबई"]
};

const DEFAULT_REVIEWS = [
  { name: "Purushottam", rating: 5, feedback: "Technicians are very experienced and professional. Blood test rates also very impressive.", test: "" },
  { name: "Megha", rating: 5, feedback: "Blood test reports were available at a very low cost compared to other labs.", test: "" },
  { name: "Tushar Kamble", rating: 5, feedback: "The report is very professional and the technicians are also very supportive.", test: "" },
  { name: "Reshma Patil", rating: 5, feedback: "सगळ्या टेस्ट खूप कमी पैशात झाल्या. Thanks.", test: "" }
];

let selectedTests = []; // {name, price}
let liveSettings = { upiId: "enterprises60658@nyes", qrUrl: "" };

/* ---------- Payment method (Cash/UPI) ---------- */
function fetchSettings() {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(`${CONFIG.appsScriptUrl}?action=settings`)
    .then((res) => res.json())
    .then((s) => {
      liveSettings = s;
      document.getElementById("upiIdText").textContent = s.upiId;
      document.getElementById("mainUpiIdText").textContent = s.upiId;
      if (s.qrUrl) {
        document.getElementById("upiQrImg").src = s.qrUrl;
        document.getElementById("mainQrImg").src = s.qrUrl;
      }
      updateUpiLink();
    })
    .catch(() => {});
}

/* ---------- कलेक्शन चार्ज नियम: ₹499 पेक्षा कमी बिलावर ₹100; ₹499 किंवा जास्त = माफ ---------- */
const FREE_COLLECTION_MIN = 499;
const COLLECTION_CHARGE = 100;
let lastSubtotal = 0;
let chargeAckSub = -1;
function calcTotals() {
  const subtotal = selectedTests.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const charge = subtotal > 0 && subtotal < FREE_COLLECTION_MIN ? COLLECTION_CHARGE : 0;
  return { subtotal, charge, waived: subtotal >= FREE_COLLECTION_MIN, total: subtotal + charge, more: Math.max(0, FREE_COLLECTION_MIN - subtotal) };
}
function fillTpl(str, vals) { return String(str).replace(/\{(\w+)\}/g, (_, k) => (vals[k] !== undefined ? vals[k] : "")); }

function updateUpiLink() {
  const total = calcTotals().total;
  const params = new URLSearchParams({ pa: liveSettings.upiId, pn: "Kalyan Pathlab", cu: "INR" });
  if (total > 0) params.set("am", total);
  document.getElementById("upiPayLink").href = `upi://pay?${params.toString()}`;
}

document.querySelectorAll('input[name="paymentMethod"]').forEach((r) => {
  r.addEventListener("change", (e) => {
    document.getElementById("upiPayBox").hidden = e.target.value !== "UPI";
    if (e.target.value === "UPI") updateUpiLink();
  });
});

/* ---------- Share button (मोबाईलचा native share sheet उघडतो) ---------- */
async function shareApp() {
  const shareData = {
    title: "Kalyan Pathlab — ऑनलाइन ब्लड टेस्ट बुकिंग",
    text: "Kalyan Pathlab वरून घरबसल्या ब्लड टेस्ट बुक करा — सर्व टेस्टवर 30% ते 70% सवलत!",
    url: window.location.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // यूजरने शेअर रद्द केलं तर काही करायची गरज नाही
    }
  } else {
    // Share API नसलेल्या जुन्या ब्राउझरसाठी WhatsApp वर पर्याय
    const waText = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
    window.open(`https://wa.me/?text=${waText}`, "_blank");
  }
}
["shareBtn", "shareBtn2"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", shareApp);
});

/* ---------- Tab navigation (एका वेळी एकच सेक्शन दिसतं) ---------- */
const SECTION_IDS = ["home", "tests", "booking", "payment", "reviews", "contact"];
let currentSection = "home";
function scrollMainTop(instant) {
  const main = document.getElementById("appMain");
  if (main) main.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
}
function showSection(name, instant, fromPop) {
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.hidden = id !== name;
  });
  document.querySelectorAll(".nav-btn").forEach((b) => {
    const on = b.dataset.section === name;
    b.classList.toggle("active", on);
    if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
  });
  document.body.dataset.sec = name;
  if (window.kpSaveSection) kpSaveSection(name);
  // मोबाईल "Back" बटण: मागच्या स्क्रीनवर जातं (अ‍ॅप एकदम बंद होत नाही)
  if (!fromPop && name !== currentSection) history.pushState({ s: name }, "");
  currentSection = name;
  scrollMainTop(instant);
}
window.addEventListener("popstate", (e) => {
  if (window.KPDocs && KPDocs.closeIfOpen()) return;   // रिपोर्ट/बिल उघडं असल्यास "Back" ने तेच बंद व्हावं
  const s = (e.state && e.state.s) || "home";
  if (document.getElementById("testModal") && !document.getElementById("testModal").hidden) closeTestModal();
  showSection(s, true, true);
});
document.getElementById("mainNav").addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-btn");
  if (btn) showSection(btn.dataset.section);
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".jump-to");
  if (btn) showSection(btn.dataset.section);
});

/* ---------- Register service worker ---------- */
if ("serviceWorker" in navigator) {
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  // नवीन आवृत्ती आली की (बुकिंग सुरू नसेल तर) अ‍ॅप एकदाच आपोआप रिफ्रेश होतं
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || reloaded) return;
    if (typeof selectedTests !== "undefined" && selectedTests.length > 0) return;
    if (typeof bookingStep !== "undefined" && bookingStep > 1) return;
    reloaded = true;
    location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

/* ---------- Cities ---------- */
function renderCities() {
  const chips = document.getElementById("cityChips");
  if (chips) chips.innerHTML = CONFIG.cities.map((c) => `<span>${translateCityName(c)}</span>`).join("");
  const select = document.getElementById("city");
  const prevValue = select.value;
  select.innerHTML =
    `<option value="">${t("city_placeholder_option")}</option>` +
    CONFIG.cities.map((c) => `<option value="${c}">${translateCityName(c)}</option>`).join("");
  if (prevValue) select.value = prevValue;
}

/* ---------- Test list ---------- */
/* Original hand-drawn icons per category keyword — same visual family
   used in the admin panel's Test Master, kept consistent across both apps. */
const CAT_ICONS = {
  kidney: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3C6 3 4 6.3 4 10.2c0 3 1.3 4 1.3 6 0 2.6 1.7 4.8 4.4 4.8 2 0 3.3-1.4 3.3-3.3 0-1.6-1.1-2.1-1.1-3.7s1.4-2 1.4-3.9C13.3 6.7 12.3 3 9.5 3Z"/></svg>',
  liver: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2.5-5 6-5h5c3 0 5.5 2.7 5.5 6.2 0 4.3-3.3 7.8-7.5 7.8H9c-3 0-5-2.2-5-5V9Z"/></svg>',
  thyroid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="12" r="4"/><circle cx="16.5" cy="12" r="4"/><path d="M11.3 10.5h1.4M11.3 13.5h1.4"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6.5 7.4 6.5 12a6.5 6.5 0 1 1-13 0C5.5 10.4 12 3 12 3Z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.2-4.5-9.7-9.2A5.4 5.4 0 0 1 12 6.3a5.4 5.4 0 0 1 9.7 5.5C19.2 16.5 12 21 12 21Z"/></svg>',
  glucose: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z"/><path d="M12 12v5M9.5 14.5h5"/></svg>',
  lipid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z"/><path d="M9 13.5h6M9 16h6" stroke-width="1.3"/></svg>',
  capsule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="10" width="17" height="4" rx="2"/><path d="M12 10v4"/></svg>',
  thermo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 14.2V5a1.5 1.5 0 1 1 3 0v9.2a3.5 3.5 0 1 1-3 0Z"/></svg>',
  hormone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.5" r="2.3"/><circle cx="18" cy="6.5" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M7.7 8.2 10.5 16M16.3 8.2 13.5 16"/></svg>',
  blood: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5s7 8.3 7 13.3a7 7 0 1 1-14 0c0-5 7-13.3 7-13.3Z"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><path d="M6 21l2-9h8l2 9M9 12V8h6v4"/></svg>',
  vial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v14.500a2 2 0 0 0 4 0V3"/><path d="M10 10h4M10 13h4"/></svg>',
  cardio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.200-4.500-9.700-9.200A5.400 5.400 0 0 1 12 6.300a5.400 5.400 0 0 1 9.700 5.500C19.200 16.500 12 21 12 21Z"/><path d="M5.500 12.500h3l1.500-3 3 6 1.500-3h3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.500c0 4.800-3 8.200-7 9.500-4-1.300-7-4.700-7-9.500V6z"/><path d="M9 12l2.200 2.200L15.500 10"/></svg>',
  bone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.500" r="2.200"/><circle cx="9" cy="4.200" r="1.800"/><circle cx="18" cy="17.500" r="2.200"/><circle cx="15" cy="19.800" r="1.800"/><path d="M7.600 8 16.400 16"/></svg>',
  cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8M9 3v2.500h6V3M7 7.500h10l-1 12.300a1 1 0 0 1-1 .9H9a1 1 0 0 1-1-.9z"/><path d="M8.200 13.500h7.600"/></svg>',
  timer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13.500" r="7"/><path d="M12 9.500v4l2.500 1.800M9.500 3h5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.600 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="4" y="13.500" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.500"/></svg>',
  tube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v7l-4.3 8a2 2 0 0 0 1.8 2.9h9a2 2 0 0 0 1.8-2.9L14 10V3"/></svg>'
};
const CAT_ICON_RULES = [
  { kw: ["kidney"], icon: "kidney", bg: "#f4ead9", fg: "#8a5a1f" },
  { kw: ["liver"], icon: "liver", bg: "#ffe8d6", fg: "#b1560f" },
  { kw: ["thyroid"], icon: "thyroid", bg: "#f3e8ff", fg: "#6b21a8" },
  { kw: ["urine", "bladder"], icon: "droplet", bg: "#fff6d9", fg: "#a3790a" },
  { kw: ["cardiac", "heart"], icon: "heart", bg: "#ffe1e6", fg: "#b3123f" },
  { kw: ["diabetes", "sugar", "glucose"], icon: "glucose", bg: "#ffe9d6", fg: "#b1560f" },
  { kw: ["lipid", "cholesterol"], icon: "lipid", bg: "#e6ecff", fg: "#3346c9" },
  { kw: ["vitamin", "mineral"], icon: "capsule", bg: "#e3f7ea", fg: "#12793f" },
  { kw: ["fever", "infection"], icon: "thermo", bg: "#ffe1e1", fg: "#c21f1f" },
  { kw: ["hormone", "fertility", "pregnanc"], icon: "hormone", bg: "#ffe3f0", fg: "#b3126e" },
  { kw: ["full body", "checkup", "package"], icon: "body", bg: "#e6ecff", fg: "#0b4ea2" },
  { kw: ["blood", "cbc", "anemia", "hemoglobin"], icon: "blood", bg: "#ffe1e6", fg: "#c21f1f" }
];
/* हर टेस्ट-ग्रुपसाठी वेगळा आयकॉन: आधी ग्रुपच्या id नुसार, नाहीतर नावातील शब्दांनुसार */
const CAT_ID_VISUALS = {
  basic:       { icon: "vial",    bg: "#e8f0ff", fg: "#0b4ea2" },
  anemia:      { icon: "blood",   bg: "#ffe1e6", fg: "#c21f1f" },
  diabetes:    { icon: "glucose", bg: "#ffe9d6", fg: "#b1560f" },
  thyroid:     { icon: "thyroid", bg: "#f3e8ff", fg: "#6b21a8" },
  liver:       { icon: "liver",   bg: "#ffe8d6", fg: "#b1560f" },
  kidney:      { icon: "kidney",  bg: "#f4ead9", fg: "#8a5a1f" },
  lipid:       { icon: "cardio",  bg: "#ffe1e6", fg: "#b3123f" },
  cardiac:     { icon: "cardio",  bg: "#ffe1e6", fg: "#b3123f" },
  vitamins:    { icon: "capsule", bg: "#e3f7ea", fg: "#12793f" },
  infection:   { icon: "thermo",  bg: "#ffe1e1", fg: "#c21f1f" },
  hormones:    { icon: "hormone", bg: "#ffe3f0", fg: "#b3126e" },
  markers:     { icon: "shield",  bg: "#e0f4f7", fg: "#0b7285" },
  autoimmune:  { icon: "bone",    bg: "#eee8ff", fg: "#5b3fc4" },
  urine:       { icon: "cup",     bg: "#fff6d9", fg: "#a3790a" },
  coagulation: { icon: "timer",   bg: "#fde7e7", fg: "#a12424" },
  packages:    { icon: "body",    bg: "#e6ecff", fg: "#0b4ea2" },
  special:     { icon: "star",    bg: "#fff4d6", fg: "#a36b00" },
  other:       { icon: "tube",    bg: "#eceff6", fg: "#4a5072" }
};
function categoryVisual(cat) {
  const id = cat && typeof cat === "object" ? cat.id : "";
  if (id && CAT_ID_VISUALS[id]) return CAT_ID_VISUALS[id];
  const name = cat && typeof cat === "object" ? (cat.name || cat.id) : cat;
  const s = String(name || "").toLowerCase();
  for (const rule of CAT_ICON_RULES) { if (rule.kw.some(k => s.includes(k))) return rule; }
  return { icon: "tube", bg: "#e8f0ff", fg: "#0b4ea2" };
}

/* Smart profile grouping — regardless of what raw "Category" value was
   typed in Test Master, tests are re-grouped here by keyword into a
   fixed set of sensible profiles (Fever, Diabetes, Thyroid, Liver,
   Kidney...), so the browse screen never turns into one tile per test. */
const CANON_RULES = [
  { id: "special", label: "स्पेशल टेस्ट्स", kw: ["special"] },
  { id: "packages", label: "फुल बॉडी चेकअप पॅकेजेस", kw: ["full body", "health checkup", "master health", "senior citizen", "package", "pre-marriage"] },
  { id: "infection", label: "इन्फेक्शन व ताप संबंधित", kw: ["widal", "dengue", "malaria", "malerian", "typhoid", "chikungunya", "leptospira", "fever", "ns1", "crp"] },
  { id: "diabetes", label: "मधुमेह (डायबिटीज) प्रोफाइल", kw: ["fbs", "ppbs", "rbs", "hba1c", "insulin", "glucose", "sugar", "diabetes"] },
  { id: "thyroid", label: "थायरॉइड प्रोफाइल", kw: ["t3", "t4", "tsh", "thyroid"] },
  { id: "lipid", label: "लिपिड प्रोफाइल (हृदय / कोलेस्ट्रॉल)", kw: ["lipid", "cholesterol", "triglyceride", "hdl", "ldl", "vldl", "homocysteine", "troponin", "ecg", "cardiac"] },
  { id: "liver", label: "लिव्हर फंक्शन टेस्ट (LFT)", kw: ["lft", "liver", "sgot", "sgpt", "bilirubin", "albumin", "ast", "alt"] },
  { id: "kidney", label: "किडनी फंक्शन टेस्ट (KFT)", kw: ["kft", "rft", "kidney", "urea", "creatinine", "uric acid", "electrolyte", "sodium", "potassium", "egfr", "bun"] },
  { id: "anemia", label: "अ‍ॅनिमिया व ब्लड प्रोफाइल", kw: ["cbc", "hemogram", "iron", "ferritin", "tibc", "folic acid", "vitamin b12", "b12", "hb electrophoresis", "platelet", "esr", "peripheral smear", "anemia", "blood group"] },
  { id: "vitamins", label: "व्हिटॅमिन्स व मिनरल्स", kw: ["vitamin d", "calcium", "phosphorus", "magnesium", "vitamin"] },
  { id: "hormones", label: "हार्मोन्स व फर्टिलिटी", kw: ["hcg", "fertility", "prolactin", "prl", "fsh", "lh", "testosterone", "anc profile", "estradiol", " e2", "hormone"] },
  { id: "markers", label: "इन्फेक्शन मार्कर्स (HIV/HCV/VDRL)", kw: ["hiv", "hcv", "hbsag", "vdrl", "hepatitis"] },
  { id: "autoimmune", label: "आर्थरायटिस व ऑटोइम्यून", kw: ["ana", "ra factor", "rheumatoid", "arthritis"] },
  { id: "urine", label: "युरिन टेस्ट्स", kw: ["urine", "stool"] },
  { id: "coagulation", label: "कोअ‍ॅग्युलेशन (PT/INR)", kw: ["pt/inr", "pt / inr", "coagulation", "aptt"] },
  { id: "basic", label: "बेसिक व रूटीन टेस्ट", kw: ["complete blood count"] }
];
function canonicalCategory(rawCategory, testName) {
  const s = (String(rawCategory || "") + " " + String(testName || "")).toLowerCase();
  for (const rule of CANON_RULES) { if (rule.kw.some(k => s.includes(k))) return rule; }
  return { id: "other", label: "इतर टेस्ट्स" };
}

function renderCategoryTabs() {
  const wrap = document.getElementById("categoryTabs");
  wrap.innerHTML =
    `<button data-cat="all"><span class="cat-icon-badge" style="background:#e8f0ff;color:#0b4ea2">${CAT_ICONS.grid}</span><span class="cat-tile-label">${t("cat_all")}</span></button>` +
    TEST_CATEGORIES.map((c) => {
      const v = categoryVisual(c);
      return `<button data-cat="${c.id}"><span class="cat-icon-badge" style="background:${v.bg};color:${v.fg}">${CAT_ICONS[v.icon]}</span><span class="cat-tile-label">${translateCategoryName(c)}</span></button>`;
    }).join("");
}
document.getElementById("categoryTabs").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  openTestModal(btn.dataset.cat);
});

/* ---------- Test row (shared by modal + search results) — name, MRP struck-through, price, discount % ---------- */
function testRowHTML(t) {
  const isAdded = selectedTests.some((s) => s.name === t.name);
  const discPct = t.mrp > 0 && t.mrp > t.price ? Math.round((1 - t.price / t.mrp) * 100) : 0;
  return `
    <div class="test-row">
      <div class="test-row-info">
        <span class="test-row-name">${escapeHtmlLocal(t.name)}</span>
        <div class="test-row-price">
          <span class="test-row-final">₹${t.price}</span>
          ${t.mrp > t.price ? `<span class="test-row-mrp">₹${t.mrp}</span>` : ""}
          ${discPct > 0 ? `<span class="test-discount-badge">${discPct}% off</span>` : ""}
        </div>
      </div>
      <button type="button" class="test-add-btn ${isAdded ? "added" : ""}" data-name="${encodeURIComponent(t.name)}" data-price="${t.price}">${isAdded ? "✓" : "+"}</button>
    </div>`;
}
function wireTestAddButtons(container, afterToggle) {
  container.querySelectorAll(".test-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = decodeURIComponent(btn.dataset.name);
      const price = Number(btn.dataset.price);
      toggleTest(name, price);
      renderSelected();
      if (afterToggle) afterToggle();
    });
  });
}

/* ---------- Category popup (professional bottom-sheet modal) ---------- */
let currentModalCat = null;
function openTestModal(catId) {
  currentModalCat = catId;
  const modal = document.getElementById("testModal");
  const title = document.getElementById("testModalTitle");
  const body = document.getElementById("testModalBody");
  if (catId === "all") {
    title.textContent = t("cat_all");
    body.innerHTML = TEST_CATEGORIES.map((cat) => `
      <div class="test-category-title">${translateCategoryName(cat)}</div>
      ${cat.tests.map(testRowHTML).join("")}`).join("");
  } else {
    const cat = TEST_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    title.textContent = translateCategoryName(cat);
    body.innerHTML = cat.tests.map(testRowHTML).join("");
  }
  wireTestAddButtons(body, () => openTestModal(currentModalCat));
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeTestModal() {
  document.getElementById("testModal").hidden = true;
  document.body.style.overflow = "";
  currentModalCat = null;
}
document.getElementById("testModalClose").addEventListener("click", closeTestModal);
document.getElementById("testModalBackdrop").addEventListener("click", closeTestModal);

/* ---------- Search — flat "Found N tests" list (matches the search-results style shown in the reference) ---------- */
function renderSearchResults(term) {
  const wrap = document.getElementById("testListWrap");
  const noResult = document.getElementById("noResult");
  const q = term.trim().toLowerCase();
  if (!q) { wrap.innerHTML = ""; wrap.hidden = true; noResult.hidden = true; document.getElementById("categoryTabs").hidden = false; return; }
  document.getElementById("categoryTabs").hidden = true;
  wrap.hidden = false;
  const matches = [];
  TEST_CATEGORIES.forEach((cat) => cat.tests.forEach((t) => { if (t.name.toLowerCase().includes(q)) matches.push(t); }));
  if (matches.length === 0) { wrap.innerHTML = ""; noResult.hidden = false; return; }
  noResult.hidden = true;
  wrap.innerHTML = `<p class="search-found-heading">${t("found_tests_prefix")} ${matches.length} ${t("found_tests_suffix")} "${escapeHtmlLocal(term)}"</p>` + matches.map(testRowHTML).join("");
  wireTestAddButtons(wrap, () => renderSearchResults(document.getElementById("testSearch").value));
}

function toggleTest(name, price) {
  const idx = selectedTests.findIndex((s) => s.name === name);
  if (idx >= 0) selectedTests.splice(idx, 1);
  else { selectedTests.push({ name, price }); if (window.kpOnTestAdded) kpOnTestAdded(name); }
  updateCartBar();
  updateUpiLink();
  if (typeof renderPopularTests === "function") renderPopularTests();
}

function renderSelected() {
  const box = document.getElementById("selectedTestsList");
  if (selectedTests.length === 0) {
    box.innerHTML = `${t("selected_tests_empty")}<button type="button" class="link-btn jump-to" data-section="tests">${t("selected_tests_choose_link")}</button>${t("selected_tests_or_type")}`;
    return;
  }
  box.innerHTML = selectedTests
    .map(
      (s, i) =>
        `<span>${s.name} · ₹${s.price} <button type="button" data-i="${i}" aria-label="Remove">✕</button></span>`
    )
    .join("");
  box.querySelectorAll("button[data-i]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTests.splice(Number(btn.dataset.i), 1);
      renderSelected();
      updateCartBar();
      if (!document.getElementById("testModal").hidden) openTestModal(currentModalCat);
      if (!document.getElementById("testListWrap").hidden) renderSearchResults(document.getElementById("testSearch").value);
    });
  });
}

function updateChargeBox() {
  const box = document.getElementById("chargeBox");
  if (!box) return;
  const c = calcTotals();
  if (c.subtotal === 0) { box.hidden = true; return; }
  box.hidden = false;
  box.className = "charge-box " + (c.waived ? "ok" : "warn");
  box.innerHTML =
    `<div class="cb-row"><span>${t("charge_line_sub")}</span><b>₹${c.subtotal}</b></div>` +
    (c.waived
      ? `<div class="cb-row ok"><span>${t("charge_line_waived")}</span><b><s>₹${COLLECTION_CHARGE}</s> ₹0</b></div>`
      : `<div class="cb-row"><span>${t("charge_line_charge")}</span><b>+₹${c.charge}</b></div><div class="cb-hint">${fillTpl(t("cart_note_charge"), { more: c.more })}</div>`) +
    `<div class="cb-row total"><span>${t("charge_line_total")}</span><b>₹${c.total}</b></div>`;
}

function updateCartBar() {
  const bar = document.getElementById("cartBar");
  const summary = document.getElementById("cartSummary");
  const note = document.getElementById("cartNote");
  const c = calcTotals();
  // ₹499 च्या सीमेवरून वर/खाली गेल्यावर संदेश
  if (lastSubtotal > 0 && c.subtotal > 0) {
    if (lastSubtotal < FREE_COLLECTION_MIN && c.subtotal >= FREE_COLLECTION_MIN) showToast(t("toast_charge_waived"));
    else if (lastSubtotal >= FREE_COLLECTION_MIN && c.subtotal < FREE_COLLECTION_MIN) showToast(t("toast_charge_applies"));
  }
  lastSubtotal = c.subtotal;
  updateChargeBox();
  if (window.kpSaveCart) kpSaveCart();
  if (window.kpAfterCart) kpAfterCart();
  if (selectedTests.length === 0) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  const countWord = currentLang === "en" ? `${selectedTests.length} tests selected` : currentLang === "hi" ? `${selectedTests.length} टेस्ट चयनित` : `${selectedTests.length} टेस्ट निवडल्या`;
  summary.textContent = `${countWord} · ₹${c.total}`;
  note.textContent = c.waived ? t("cart_note_waived") : fillTpl(t("cart_note_charge"), { more: c.more });
  note.className = c.waived ? "ok" : "";
}

/* ---------- Search ---------- */
document.getElementById("testSearch").addEventListener("input", (e) => {
  renderSearchResults(e.target.value);
});

/* ---------- Report mode (multi-select) -> show email field if Email checked ---------- */
document.querySelectorAll('input[name="reportMode"]').forEach((r) => {
  r.addEventListener("change", () => {
    const anyEmail = Array.from(document.querySelectorAll('input[name="reportMode"]:checked')).some((c) => c.value === "Email");
    document.getElementById("emailFieldWrap").hidden = !anyEmail;
  });
});

/* ---------- Geolocation ---------- */
let capturedLocation = "";
document.getElementById("getLocationBtn").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");
  if (!navigator.geolocation) {
    status.textContent = t("loc_not_supported");
    return;
  }
  status.textContent = t("loc_searching");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      capturedLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      status.textContent = t("loc_added");
    },
    () => {
      status.textContent = t("loc_failed");
    }
  );
});

/* ---------- Toast ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => (t.hidden = true), 3500);
}

/* ---------- Send data to Google Apps Script backend (Sheet + Drive + auto email) ---------- */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // data:...;base64, नंतरचा भाग
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function sendToBackend(payload) {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    mode: "no-cors", // Apps Script सह साधा वापर; प्रतिसाद वाचता येणार नाही पण डेटा जातो
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

/* ---------- जुना पेशंट ओळखणे (फोन नंबरवरून आधीची माहिती) ---------- */
let lookedUpPatient = null; // सबमिट करताना WhatsApp मेसेज/कन्फर्मेशनमध्ये वापरण्यासाठी
document.getElementById("phone").addEventListener("blur", () => {
  const phone = document.getElementById("phone").value.trim();
  const note = document.getElementById("returningPatientNote");
  lookedUpPatient = null;
  if (!/^[0-9]{10}$/.test(phone)) {
    note.hidden = true;
    return;
  }
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;

  fetch(`${CONFIG.appsScriptUrl}?action=patientLookup&phone=${phone}`)
    .then((res) => res.json())
    .then((info) => {
      if (!info.found) {
        note.hidden = true;
        return;
      }
      lookedUpPatient = info;
      note.hidden = false;
      note.innerHTML = `
        👋 ${t("welcome_back")}, <strong>${escapeHtml(info.fullName)}</strong>! (ID: <strong>${escapeHtml(info.patientId || "-")}</strong>)
        ${t("visits_count_prefix")} ${info.visitCount}. ${t("last_test_prefix")}: ${escapeHtml(info.lastTests || "-")}.
        <button type="button" id="autofillBtn" class="link-btn">${t("autofill_btn")}</button>
      `;
      document.getElementById("autofillBtn").addEventListener("click", () => {
        document.getElementById("fullName").value = info.fullName || "";
        document.getElementById("address").value = info.address || "";
        if (info.city) document.getElementById("city").value = info.city;
        if (info.doctor) document.getElementById("doctor").value = info.doctor;
        note.hidden = true;
        showToast(t("autofill_done"));
      });
    })
    .catch(() => { note.hidden = true; });
});

/* ---------- Booking form submit ---------- */
let bookingSubmitting = false;
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (bookingSubmitting) return;   // दोनदा टॅप केल्यास बुकिंग दोनदा नोंदवली जाऊ नये

  const manualTest = document.getElementById("manualTest").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const altPhone = document.getElementById("altPhone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value;
  const doctor = document.getElementById("doctor").value.trim() || "स्वतः";
  const date = document.getElementById("collectionDate").value;
  const time = document.getElementById("collectionTime").value;
  const reportModeArr = Array.from(document.querySelectorAll('input[name="reportMode"]:checked')).map((c) => c.value);
  const reportMode = reportModeArr.join(", ") || "WhatsApp";
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const email = document.getElementById("email").value.trim();
  const prescriptionFile = document.getElementById("prescription").files[0];

  if (selectedTests.length === 0 && !manualTest) {
    showToast(t("toast_select_test"));
    return;
  }
  if (!city) {
    showToast(t("toast_select_city"));
    return;
  }
  if (reportModeArr.length === 0) {
    showToast(t("toast_select_report_mode"));
    return;
  }
  if (!time) {
    showToast(t("toast_select_slot"));
    return;
  }
  if (date < todayLocalStr()) {
    showToast(t("toast_past_date"));
    return;
  }

  const testNames = selectedTests.map((s) => s.name);
  if (manualTest) testNames.push(manualTest);
  const totals = calcTotals();
  const total = totals.total;

  bookingSubmitting = true;
  window.__kpCartLocked = true; try { localStorage.removeItem("kp_cart"); } catch (_) {}
  const submitBtn = e.target.querySelector('button[type="submit"]'); if (submitBtn) submitBtn.disabled = true;
  const payload = {
    type: "booking",
    timestamp: new Date().toLocaleString("en-IN"),
    fullName, phone, altPhone, address, city,
    location: capturedLocation,
    doctor, date, time, reportMode, email, paymentMethod,
    tests: testNames.join(", "),
    estimatedTotal: total,
    subtotal: totals.subtotal,
    collectionCharge: totals.charge
  };

  // WhatsApp confirmation message (customer taps Send once — lab receives it instantly)
  // टीप: गुंतागुंतीचे संयुक्त (ZWJ) इमोजी (उदा. 👨‍⚕️) जुन्या फोन/WhatsApp
  // व्हर्जनवर किंवा संथ इंटरनेटवर तुटलेले "�" म्हणून दिसू शकतात — म्हणून इथे
  // फक्त साधे, single-codepoint इमोजी वापरले आहेत.
  const waMsg =
    `✅ नवीन बुकिंग — Kalyan Pathlab\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    (lookedUpPatient ? `🆔 Patient ID: ${lookedUpPatient.patientId} (Returning)\n\n` : "\n") +
    `👤 नाव: ${fullName}\n` +
    `📞 मोबाईल: ${phone}\n` +
    `📍 पत्ता: ${address}, ${city}\n\n` +
    `🧪 टेस्ट/पॅकेज:\n${testNames.map(n => `   • ${n}`).join("\n") || "   -"}\n\n` +
    (totals.subtotal > 0 ? `🧾 टेस्ट रक्कम: ₹${totals.subtotal}\n🏠 होम कलेक्शन चार्ज: ${totals.charge > 0 ? "₹" + totals.charge : "माफ ✓"}\n` : ``) +
    `💰 अंदाजे एकूण रक्कम: ₹${total}\n` +
    `📅 कलेक्शन: ${date}, ${time}\n` +
    `🩺 डॉक्टर रेफरन्स: ${doctor}\n` +
    `📄 रिपोर्ट हवा: ${reportMode}` +
    (capturedLocation ? `\n📍 लोकेशन: ${capturedLocation}` : "") +
    (lookedUpPatient && lookedUpPatient.lastTests ? `\n🕓 मागील टेस्ट: ${lookedUpPatient.lastTests}` : "") +
    `\n━━━━━━━━━━━━━━━━━━\n` +
    `संस्कार फाउंडेशन संचलित • Care For Quality 🙏`;

  const waLink = `https://wa.me/${CONFIG.labWhatsApp}?text=${encodeURIComponent(waMsg)}`;

  // ⚠️ इथे लगेच (कुठलाही await/विलंब न होता) WhatsApp उघडतो — ब्राउझरचा
  // पॉप-अप ब्लॉकर फक्त "sync" क्लिकनंतर लगेच केलेलं window.open() ब्लॉक
  // करत नाही; कुठलाही "await" या ओळीच्या आधी आला की हे ब्लॉक होतं,
  // म्हणून टेस्ट/प्रिस्क्रिप्शनच्या प्रोसेसिंगच्या आधीच हे केलं आहे.
  window.open(waLink, "_blank");

  localStorage.setItem("kp_phone", phone);
  localStorage.setItem("kp_last_status", "Pending Confirmation");

  const appUrl = window.location.href.split("?")[0].split("#")[0];
  const box = document.getElementById("confirmBox");
  box.hidden = false;
  box.innerHTML = `
    <strong>${t("confirm_box_title")}</strong>
    ${lookedUpPatient ? `<p>🆔 ${t("your_patient_id") || "Patient ID"}: <strong>${lookedUpPatient.patientId}</strong></p>` : `<p style="font-size:0.85rem;color:var(--muted);">${t("new_patient_id_note") || "तुमचा Patient ID पुढच्या बुकिंगपासून दिसेल."}</p>`}
    <p>${t("confirm_box_text")}</p>
    <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">${t("confirm_box_wa_btn")}</a>
    <button type="button" id="copyDetailsBtn" class="btn btn-outline btn-block" style="margin-top:8px;">${t("btn_copy_details")}</button>
    <p style="margin-top:10px;">${t("confirm_box_or_call")} <a href="tel:+919870020674">98700 20674</a></p>
    <p class="form-note" style="margin-top:12px;">${t("app_link_note")}<br /><a href="${appUrl}">${appUrl}</a></p>
    <button type="button" id="newBookingBtn" class="link-btn" style="display:block; margin:14px auto 0;">${t("new_booking_btn")}</button>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("newBookingBtn").addEventListener("click", () => location.reload());
  document.getElementById("copyDetailsBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(waMsg); }
    catch (_) {
      const ta = document.createElement("textarea"); ta.value = waMsg; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (__) {}
      ta.remove();
    }
    showToast(t("toast_copied"));
  });
  e.target.hidden = true; // फॉर्म लपवून कन्फर्मेशन तसंच राहू देतो (आपोआप रिफ्रेश होत नाही)
  document.getElementById("bookingProgress").hidden = true;

  e.target.reset();
  lookedUpPatient = null;
  selectedTests = [];
  renderSelected();
  updateCartBar();
  showToast(t("toast_booking_ready"));

  // प्रिस्क्रिप्शन फाईल वाचणं व बॅकएंडला डेटा पाठवणं — हे पार्श्वभूमीत होतं,
  // वरचं WhatsApp उघडणं व फॉर्म रिसेट यात याची वाट बघितली जात नाही.
  (async () => {
    if (prescriptionFile) {
      const MAX_SIZE = 8 * 1024 * 1024; // 8MB
      if (prescriptionFile.size > MAX_SIZE) {
        showToast(t("toast_prescription_large"));
      } else {
        try {
          payload.prescriptionBase64 = await fileToBase64(prescriptionFile);
          payload.prescriptionName = prescriptionFile.name;
          payload.prescriptionType = prescriptionFile.type;
        } catch (err) {
          // फाईल वाचता आली नाही तरी बुकिंग पुढे जाऊ द्या
        }
      }
    }
    sendToBackend(payload);
  })();
});

/* =====================================================================
   REVIEWS
   ===================================================================== */
let currentRating = 0;

function starString(n) {
  return "★★★★★☆☆☆☆☆".slice(5 - n, 10 - n);
}

function renderReviews(list) {
  const wrap = document.getElementById("reviewList");
  wrap.innerHTML = list
    .map(
      (r) => `
      <div class="review-card">
        <span class="stars">${starString(r.rating)}</span>
        <p>${escapeHtml(r.feedback)}</p>
        <span class="review-meta">— ${escapeHtml(r.name)}${r.test ? " · " + escapeHtml(r.test) : ""}</span>
      </div>`
    )
    .join("");

  const avg = (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1);
  document.getElementById("avgRating").textContent = avg;
  document.getElementById("avgStars").textContent = starString(Math.round(avg));
  document.getElementById("reviewCount").textContent = `(${list.length} ${t("review_word")})`;
  const hr = document.getElementById("homeReviews");
  if (hr) {
    hr.innerHTML = list.slice(-5).reverse().map((r) => `
      <div class="pop-card home-review">
        <span class="stars">${starString(r.rating)}</span>
        <span class="home-review-text">${escapeHtml(r.feedback)}</span>
        <span class="review-meta">— ${escapeHtml(r.name)}</span>
      </div>`).join("");
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

let allReviews = [...DEFAULT_REVIEWS];
renderReviews(allReviews);

// Apps Script वरून मंजूर झालेले रिव्ह्यूज आणा (backend सेट केले असल्यास)
function loadApprovedReviews() {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(`${CONFIG.appsScriptUrl}?action=reviews`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length) {
        allReviews = [...DEFAULT_REVIEWS, ...data];
        renderReviews(allReviews);
      }
    })
    .catch(() => {});
}
loadApprovedReviews();

/* ---------- Review panel open/close (inline, popup नाही) ---------- */
const reviewPanel = document.getElementById("reviewPanel");
const openReviewBtn = document.getElementById("openReviewModal");
openReviewBtn.addEventListener("click", () => {
  const isHidden = reviewPanel.hidden;
  reviewPanel.hidden = !isHidden;
  document.getElementById("reviewThanks").hidden = true;
  document.getElementById("reviewForm").hidden = false;
  openReviewBtn.textContent = isHidden ? t("btn_close_review") : t("btn_write_review");
  if (isHidden) reviewPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

/* ---------- Star picker ---------- */
const starPicker = document.getElementById("starPicker");
starPicker.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  currentRating = Number(btn.dataset.val);
  document.getElementById("reviewRating").value = currentRating;
  starPicker.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("on", Number(b.dataset.val) <= currentRating);
  });
});

/* ---------- Review form submit ---------- */
document.getElementById("reviewForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const phone = document.getElementById("reviewPhone").value.trim();
  const testTaken = document.getElementById("reviewTestTaken").value.trim();
  const feedback = document.getElementById("reviewFeedback").value.trim();

  if (currentRating === 0) {
    showToast(t("toast_give_rating"));
    return;
  }

  const payload = {
    type: "review",
    timestamp: new Date().toLocaleString("en-IN"),
    name, phone, test: testTaken, rating: currentRating, feedback,
    status: "Pending"
  };
  sendToBackend(payload);

  document.getElementById("reviewForm").hidden = true;
  const thanks = document.getElementById("reviewThanks");
  thanks.hidden = false;
  thanks.innerHTML = `<strong>${t("thank_you")}, ${escapeHtml(name)}! 🙏</strong><p>${t("review_thanks_note")}</p>`;

  e.target.reset();
  currentRating = 0;
  starPicker.querySelectorAll("button").forEach((b) => b.classList.remove("on"));

  setTimeout(() => {
    reviewPanel.hidden = true;
    openReviewBtn.textContent = t("btn_write_review");
  }, 2200);
});

/* ---------- भाषा बदलली की JS-generated भाग पुन्हा रेंडर करणे ---------- */
function onLanguageChanged() {
  if (window.KPDocs) KPDocs.refresh();
  renderCities();
  renderCategoryTabs();
  if (document.getElementById("testSearch") && document.getElementById("testSearch").value) {
    renderSearchResults(document.getElementById("testSearch").value);
  }
  if (!document.getElementById("testModal").hidden && currentModalCat) openTestModal(currentModalCat);
  renderSelected();
  updateCartBar();
  if (typeof renderPopularTests === "function") renderPopularTests();
  if (typeof allReviews !== "undefined") renderReviews(allReviews);
  if (typeof reviewPanel !== "undefined" && typeof openReviewBtn !== "undefined") {
    openReviewBtn.textContent = reviewPanel.hidden ? t("btn_write_review") : t("btn_close_review");
  }
}

/* ---------- Sheet मधून टेस्ट/किंमती लाईव्ह आणणे (Excel मध्ये बदल केला की इथेही बदलतो) ---------- */
function fetchLiveTests() {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(`${CONFIG.appsScriptUrl}?action=tests`)
    .then((res) => res.json())
    .then((rows) => {
      if (!Array.isArray(rows) || rows.length === 0) return; // Sheet सेटअप नसेल तर आधीची (built-in) यादीच वापरतो
      const grouped = [];
      const catIndex = {};
      rows.forEach((r) => {
        const canon = canonicalCategory(r.category, r.name);
        if (!(canon.id in catIndex)) {
          catIndex[canon.id] = grouped.length;
          grouped.push({ id: canon.id, name: canon.label, tests: [] });
        }
        grouped[catIndex[canon.id]].tests.push({
          name: r.name,
          mrp: Number(r.mrp) || 0,
          price: Number(r.price) || 0
        });
      });
      TEST_CATEGORIES = grouped;
      renderCategoryTabs();
      renderPopularTests();
    })
    .catch(() => {}); // इंटरनेट/लिंक प्रॉब्लेम असल्यास built-in यादी तशीच राहते
}

/* ---------- Init ---------- */
renderCities();
renderCategoryTabs();
renderSelected();
fetchLiveTests();
fetchSettings();
checkForStatusUpdate();

/* ---------- बुकिंग स्थिती / रिपोर्ट तपासणे ---------- */
const STATUS_LABELS = {
  "Pending Confirmation": { cls: "pending", mr: "पडताळणी प्रलंबित", hi: "पुष्टि लंबित", en: "Pending Confirmation" },
  "Confirmed": { cls: "confirmed", mr: "कन्फर्म झाली", hi: "पुष्टि हो गई", en: "Confirmed" },
  "Completed": { cls: "completed", mr: "पूर्ण झाली", hi: "पूर्ण हुई", en: "Completed" },
  "Cancelled": { cls: "cancelled", mr: "रद्द झाली", hi: "रद्द हुई", en: "Cancelled" }
};
function statusLabel(status) {
  const s = STATUS_LABELS[status] || STATUS_LABELS["Pending Confirmation"];
  return { cls: s.cls, text: s[currentLang] || s.en };
}

function statusTimeline(status) {
  if (status === "Cancelled") return `<div class="tl-cancel">✖ ${t("tl_cancelled")}</div>`;
  const level = status === "Completed" ? 3 : status === "Confirmed" ? 2 : 1;
  const steps = [t("tl_received"), t("tl_confirmed"), t("tl_completed")];
  return `<ol class="tl">${steps.map((s, i) => `<li class="${i + 1 < level ? "done" : i + 1 === level ? "now" : ""}"><span>${i + 1 <= level ? "✓" : i + 1}</span><b>${s}</b></li>`).join("")}</ol>`;
}

/* ---------- रिपोर्ट: पहा + डाउनलोड (Google Drive लिंकवरून थेट डाउनलोड) ---------- */
function driveFileId(url) {
  const m = String(url || "").match(/\/d\/([A-Za-z0-9_-]+)/) || String(url || "").match(/[?&]id=([A-Za-z0-9_-]+)/);
  return m ? m[1] : "";
}
function reportLinks(url) {
  const id = driveFileId(url);
  return id
    ? { view: `https://drive.google.com/file/d/${id}/view`, dl: `https://drive.google.com/uc?export=download&id=${id}` }
    : { view: url, dl: url };
}
function reportButtonsHtml(url) {
  const l = reportLinks(url);
  return `<div class="report-actions">
    <a class="btn btn-whatsapp" href="${escapeHtmlLocal(l.dl)}" rel="noopener" download>⬇ ${t("report_download")}</a>
    <a class="btn btn-outline" href="${escapeHtmlLocal(l.view)}" target="_blank" rel="noopener">👁 ${t("report_view")}</a>
  </div>`;
}

function renderStatusResults(bookings) {
  if (window.KPDocs) { KPDocs.render(bookings); return; }
  const wrap = document.getElementById("statusResultWrap");
  if (!bookings || bookings.length === 0) {
    wrap.innerHTML = `<p class="empty-msg" style="text-align:center;color:var(--muted);padding:14px 0;">${t("no_booking_found")}</p>`;
    return;
  }
  wrap.innerHTML = bookings
    .map((b) => {
      const s = statusLabel(b.status);
      return `<div class="status-result-card">
        <span class="status-pill ${s.cls}">${s.text}</span>
        ${statusTimeline(b.status)}
        <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
        <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))}</div>
        ${b.reportLink ? reportButtonsHtml(b.reportLink) : ""}
        ${b.rowNum && (b.status === "Pending Confirmation" || b.status === "Confirmed") ? `<button type="button" class="btn btn-cancel btn-block cancel-booking-btn" data-row="${b.rowNum}" data-tests="${escapeHtml(b.tests || "")}" data-when="${escapeHtml(String(b.date || "") + " " + String(b.time || ""))}">❌ ${t("btn_cancel_booking")}</button>` : ""}
      </div>`;
    })
    .join("");
  wrap.querySelectorAll(".cancel-booking-btn").forEach((btn) => btn.addEventListener("click", () => askCancelBooking(btn)));
}

document.getElementById("statusCheckBtn").addEventListener("click", () => {
  const phone = document.getElementById("statusPhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) {
    showToast(t("toast_invalid_phone"));
    return;
  }
  try { localStorage.setItem("kp_phone", phone); } catch (_) {}   // पुढच्या वेळी नंबर आपोआप भरतो
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(`${CONFIG.appsScriptUrl}?action=bookingStatus&phone=${phone}`)
    .then((res) => res.json())
    .then((data) => renderStatusResults(data.bookings))
    .catch(() => showToast(t("network_weak")));
});

// अ‍ॅप उघडल्यावर स्वतःहून तपासतं — आधीच्या बुकिंगचं स्टेटस "Confirmed"/"Completed" झालं असेल तर वरती बॅनर दाखवतं
function checkForStatusUpdate() {
  const phone = localStorage.getItem("kp_phone");
  if (!phone || !CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(`${CONFIG.appsScriptUrl}?action=bookingStatus&phone=${phone}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.bookings || data.bookings.length === 0) return;
      const latest = data.bookings[0];
      const lastSeen = localStorage.getItem("kp_last_status");
      // रिपोर्ट तयार असेल तर वरती कायमस्वरूपी बॅनर (✕ दाबेपर्यंत) — Download + पहा
      const withReport = data.bookings.find((x) => x.reportLink);
      if (withReport && localStorage.getItem("kp_report_dismissed") !== withReport.reportLink) {
        const banner = document.getElementById("notifBanner");
        banner.hidden = false;
        banner.innerHTML = `<div class="rep-banner"><strong>📄 ${t("report_ready")}</strong>${reportButtonsHtml(withReport.reportLink)}<button type="button" class="rep-close" aria-label="Close">✕</button></div>`;
        banner.querySelector(".rep-close").addEventListener("click", () => { localStorage.setItem("kp_report_dismissed", withReport.reportLink); banner.hidden = true; });
        localStorage.setItem("kp_last_status", latest.status);
        return;
      }
      if (latest.status !== lastSeen && (latest.status === "Confirmed" || latest.status === "Completed")) {
        const s = statusLabel(latest.status);
        const banner = document.getElementById("notifBanner");
        banner.hidden = false;
        banner.innerHTML = `✅ ${t("notif_status_prefix")} <strong>${s.text}</strong>! ${latest.reportLink ? `<a href="${latest.reportLink}" target="_blank" rel="noopener">${t("download_report")}</a>` : ""}`;
      }
      localStorage.setItem("kp_last_status", latest.status);
    })
    .catch(() => {});
}


/* ---------- HTML escape (टेस्ट लिस्ट व स्टेटस कार्ड्ससाठी) ---------- */
function escapeHtmlLocal(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* ---------- जुना प्रोफाईल डेटा (असल्यास) या डिव्हाइसवरून साफ करणे ---------- */
["kp_profile_cache", "kp_profile_pending", "kp_family_profiles"].forEach((k) => localStorage.removeItem(k));

/* ---------- Home: लोकप्रिय टेस्ट (Quick add) ---------- */
const POPULAR_KEYWORDS = ["complete blood count", "hba1c", "thyroid profile", "lipid profile", "liver function", "kidney function", "vitamin d", "full body"];
function renderPopularTests() {
  const wrap = document.getElementById("popularTests");
  if (!wrap) return;
  const all = [];
  TEST_CATEGORIES.forEach((cat) => cat.tests.forEach((x) => all.push(x)));
  const picked = [];
  POPULAR_KEYWORDS.forEach((kw) => {
    const hit = all.find((x) => x.name.toLowerCase().includes(kw) && !picked.includes(x));
    if (hit) picked.push(hit);
  });
  wrap.innerHTML = picked.slice(0, 6).map((x) => {
    const added = selectedTests.some((s) => s.name === x.name);
    const off = x.mrp > x.price ? Math.round((1 - x.price / x.mrp) * 100) : 0;
    return `<div class="pop-card">
      <span class="pop-name">${escapeHtmlLocal(x.name)}</span>
      <div class="pop-bottom">
        <div class="pop-price"><b>₹${x.price}</b>${x.mrp > x.price ? `<s>₹${x.mrp}</s>` : ""}${off ? `<em>${off}% off</em>` : ""}</div>
        <button type="button" class="test-add-btn ${added ? "added" : ""}" data-name="${encodeURIComponent(x.name)}" data-price="${x.price}" aria-label="Add">${added ? "✓" : "+"}</button>
      </div>
    </div>`;
  }).join("");
  wireTestAddButtons(wrap, renderPopularTests);
}
renderPopularTests();
history.replaceState({ s: "home" }, "");
showSection("home", true, true); // अ‍ॅप नेहमी होम पेजवरून सुरू होतं


/* =====================================================================
   BOOKING: 3 टप्प्यांचा फॉर्म + आजची/पुढची तारीख + वेळेचे स्लॉट
   ===================================================================== */
function todayLocalStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

let bookingStep = 1;
function showBookingStep(n) {
  bookingStep = n;
  document.querySelectorAll(".bstep").forEach((el) => { el.hidden = Number(el.dataset.step) !== n; });
  document.querySelectorAll("#bookingProgress li").forEach((li) => {
    const s = Number(li.dataset.step);
    li.classList.toggle("on", s === n);
    li.classList.toggle("done", s < n);
  });
  if (n === 3) refreshSlots();
  scrollMainTop(false);
}

function validateBookingStep(n) {
  if (n === 1) {
    if (selectedTests.length === 0 && !document.getElementById("manualTest").value.trim()) {
      showToast(t("toast_select_test"));
      return false;
    }
    return true;
  }
  const wrap = document.querySelector(`.bstep[data-step="${n}"]`);
  for (const f of wrap.querySelectorAll("input, select, textarea")) {
    if (!f.checkValidity()) { f.reportValidity(); return false; }
  }
  return true;
}

document.querySelectorAll(".step-next").forEach((b) => b.addEventListener("click", () => {
  if (!validateBookingStep(bookingStep)) return;
  if (bookingStep === 1) askChargePopup(() => showBookingStep(2));
  else showBookingStep(bookingStep + 1);
}));
document.querySelectorAll(".step-back").forEach((b) => b.addEventListener("click", () => showBookingStep(bookingStep - 1)));
// Enter दाबल्यावर फॉर्म सबमिट होण्याऐवजी पुढच्या टप्प्यावर जावं
document.getElementById("bookingForm").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && bookingStep < 3 && e.target.tagName === "INPUT") {
    e.preventDefault();
    if (!validateBookingStep(bookingStep)) return;
    if (bookingStep === 1) askChargePopup(() => showBookingStep(2));
    else showBookingStep(bookingStep + 1);
  }
});
// "सलग टप्पे" फक्त पूर्ण झालेल्या टप्प्यावर परत जाण्यासाठी क्लिक करता येतात
document.getElementById("bookingProgress").addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li && Number(li.dataset.step) < bookingStep) showBookingStep(Number(li.dataset.step));
});

/* ---- तारीख: मागची निवडता येत नाही; वेळेचे स्लॉट ---- */
const dateInput = document.getElementById("collectionDate");
function refreshDateMin() {
  const today = todayLocalStr();
  dateInput.min = today;
  if (dateInput.value && dateInput.value < today) dateInput.value = "";
}
function refreshSlots() {
  refreshDateMin();
  const slots = document.querySelectorAll(".slot-btn");
  const val = dateInput.value;
  const now = new Date();
  const isToday = val === todayLocalStr();
  const isSunday = val ? new Date(val + "T00:00:00").getDay() === 0 : false;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  slots.forEach((b) => {
    const start = Number(b.dataset.start);
    let off = !val; // आधी तारीख निवडा
    if (isSunday && start < 8) off = true;                   // रविवार: लॅब सकाळी 8 ला उघडते (सकाळी 7–8 स्लॉट बंद)
    if (isToday && start * 60 <= nowMin + 60) off = true;    // आजसाठी: किमान 1 तास आधी
    b.disabled = off;
    if (off && b.classList.contains("on")) { b.classList.remove("on"); document.getElementById("collectionTime").value = ""; }
  });
}
dateInput.addEventListener("change", refreshSlots);
document.getElementById("slotGrid").addEventListener("click", (e) => {
  const b = e.target.closest(".slot-btn");
  if (!b || b.disabled) return;
  document.querySelectorAll(".slot-btn").forEach((x) => x.classList.toggle("on", x === b));
  document.getElementById("collectionTime").value = b.dataset.slot;
});
refreshDateMin();
refreshSlots();

/* ---------- स्थिती पेज: मागच्या बुकिंगचा मोबाईल नंबर आपोआप भरतो ---------- */
(() => {
  const saved = localStorage.getItem("kp_phone");
  const inp = document.getElementById("statusPhoneInput");
  if (saved && inp && !inp.value) inp.value = saved;
})();


/* =====================================================================
   कलेक्शन चार्ज पॉप-अप (₹499 पेक्षा कमी बिल)
   ===================================================================== */
let chargeContinueCb = null;
function closeChargeModal() { const m = document.getElementById("chargeModal"); if (m) m.hidden = true; chargeContinueCb = null; }
function askChargePopup(onContinue) {
  const c = calcTotals();
  if (c.charge === 0 || chargeAckSub === c.subtotal) { onContinue(); return; }
  document.getElementById("chargeModalBody").textContent = fillTpl(t("charge_modal_body"), { sub: c.subtotal, total: c.total, more: c.more });
  chargeContinueCb = onContinue;
  document.getElementById("chargeModal").hidden = false;
  document.getElementById("chargeContinue").focus();
}
document.getElementById("chargeContinue").addEventListener("click", () => {
  const cb = chargeContinueCb; chargeAckSub = calcTotals().subtotal; closeChargeModal(); if (cb) cb();
});
document.getElementById("chargeAddMore").addEventListener("click", () => { closeChargeModal(); showSection("tests"); });
document.getElementById("chargeModal").addEventListener("click", (e) => { if (e.target.id === "chargeModal") closeChargeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeChargeModal(); });
// कार्ट पट्टीतून "बुक करा" दाबल्यावरही चार्जची माहिती दिसावी
document.getElementById("cartBookBtn").addEventListener("click", () => askChargePopup(() => showSection("booking")));
// भाषा बदलल्यावर चार्ज बॉक्स/पट्टी पुन्हा तयार

/* =====================================================================
   अ‍ॅप इन्स्टॉल (PWA) — पहिल्यांदा उघडल्यावर इन्स्टॉल पर्याय
   ===================================================================== */
(() => {
  const banner = document.getElementById("installBanner");
  const btn = document.getElementById("installBtn");
  const close = document.getElementById("installClose");
  const contactBtn = document.getElementById("installBtnContact");
  const KEY = "kp_install_dismissed";
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  let deferred = null;

  const recentlyDismissed = () => { const t0 = Number(localStorage.getItem(KEY) || 0); return t0 && Date.now() - t0 < 7 * 24 * 3600 * 1000; };
  function show() {
    if (isStandalone() || recentlyDismissed() || !banner) return;
    if (isIOS && !deferred) {
      document.getElementById("installSub").textContent = t("install_ios");
      btn.hidden = true;
    }
    banner.hidden = false;
  }
  function hide(remember) { banner.hidden = true; if (remember) localStorage.setItem(KEY, String(Date.now())); }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    if (contactBtn && !isStandalone()) contactBtn.hidden = false;
    setTimeout(show, 1500);
  });
  // iPhone Safari मध्ये beforeinstallprompt नसतो — सूचना दाखवतो
  if (isIOS && !isStandalone()) setTimeout(show, 2500);

  async function doInstall() {
    if (!deferred) { if (isIOS) { banner.hidden = false; document.getElementById("installSub").textContent = t("install_ios"); } return; }
    deferred.prompt();
    try { await deferred.userChoice; } catch (_) {}
    deferred = null; hide(false); if (contactBtn) contactBtn.hidden = true;
  }
  btn.addEventListener("click", doInstall);
  if (contactBtn) contactBtn.addEventListener("click", doInstall);
  close.addEventListener("click", () => hide(true));
  window.addEventListener("appinstalled", () => { hide(false); if (contactBtn) contactBtn.hidden = true; });
})();


/* =====================================================================
   पेशंटकडून बुकिंग रद्द करणे (Pending / Confirmed असतानाच)
   ===================================================================== */
let cancelBusy = false;
function askCancelBooking(btn) {
  const row = Number(btn.dataset.row);
  document.getElementById("cancelModalBody").textContent = `${btn.dataset.tests} — ${btn.dataset.when}`;
  const m = document.getElementById("cancelModal");
  m.hidden = false;
  m.dataset.row = String(row);
  document.getElementById("cancelKeep").focus();
}
function closeCancelModal() { const m = document.getElementById("cancelModal"); if (m) m.hidden = true; }
document.getElementById("cancelKeep").addEventListener("click", closeCancelModal);
document.getElementById("cancelModal").addEventListener("click", (e) => { if (e.target.id === "cancelModal") closeCancelModal(); });
document.getElementById("cancelConfirm").addEventListener("click", async () => {
  if (cancelBusy) return;
  const phone = document.getElementById("statusPhoneInput").value.trim();
  const rowNum = Number(document.getElementById("cancelModal").dataset.row);
  if (!/^[0-9]{10}$/.test(phone) || !rowNum || !CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  cancelBusy = true;
  closeCancelModal();
  try {
    await fetch(CONFIG.appsScriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "cancelBooking", rowNum, phone }) });
    showToast(t("toast_cancel_sent"));
    setTimeout(async () => {
      try {
        const res = await fetch(`${CONFIG.appsScriptUrl}?action=bookingStatus&phone=${phone}`);
        const data = await res.json();
        renderStatusResults(data.bookings);
        const b = (data.bookings || []).find((x) => x.rowNum === rowNum);
        showToast(b && b.status === "Cancelled" ? t("toast_cancel_done") : t("toast_cancel_pending"));
      } catch (_) { showToast(t("network_weak")); }
      cancelBusy = false;
    }, 2200);
  } catch (_) { showToast(t("network_weak")); cancelBusy = false; }
});
