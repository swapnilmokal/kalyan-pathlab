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

function updateUpiLink() {
  const total = selectedTests.reduce((sum, t) => sum + t.price, 0);
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
const SECTION_IDS = ["home", "tests", "booking", "payment", "reviews", "profile", "contact"];
function showSection(name) {
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) el.hidden = id !== name;
  });
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.section === name);
  });
  if (name === "booking" && typeof prefillBookingFromProfile === "function") prefillBookingFromProfile();
  // सेक्शन बदलल्यावर तो नक्की वरती (sticky topbar/nav च्या खाली) दिसावा म्हणून
  // window.scrollTo ऐवजी त्याच सेक्शनला थेट scrollIntoView करतो — जुन्या स्क्रोल
  // पोझिशनमुळे नवीन सेक्शन अर्धवट/लपलेला दिसण्याची शक्यता यामुळे राहत नाही.
  requestAnimationFrame(() => {
    const target = document.getElementById(`section-${name}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
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
function categoryVisual(name) {
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
    `<button data-cat="all"><span class="cat-icon-badge" style="background:#e8f0ff;color:#0b4ea2">${CAT_ICONS.tube}</span><span class="cat-tile-label">${t("cat_all")}</span></button>` +
    TEST_CATEGORIES.map((c) => {
      const v = categoryVisual(c.name || c.id);
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
  else selectedTests.push({ name, price });
  updateCartBar();
  updateUpiLink();
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

function updateCartBar() {
  const bar = document.getElementById("cartBar");
  const summary = document.getElementById("cartSummary");
  if (selectedTests.length === 0) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;
  const total = selectedTests.reduce((sum, s) => sum + s.price, 0);
  const countWord = currentLang === "en" ? `${selectedTests.length} tests selected` : currentLang === "hi" ? `${selectedTests.length} टेस्ट चयनित` : `${selectedTests.length} टेस्ट निवडल्या`;
  summary.textContent = `${countWord} · ₹${total}`;
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
document.getElementById("bookingForm").addEventListener("submit", (e) => {
  e.preventDefault();

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

  const testNames = selectedTests.map((s) => s.name);
  if (manualTest) testNames.push(manualTest);
  const total = selectedTests.reduce((sum, s) => sum + s.price, 0);

  const payload = {
    type: "booking",
    timestamp: new Date().toLocaleString("en-IN"),
    fullName, phone, altPhone, address, city,
    location: capturedLocation,
    doctor, date, time, reportMode, email, paymentMethod,
    tests: testNames.join(", "),
    estimatedTotal: total
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
    `💰 अंदाजे रक्कम: ₹${total}\n` +
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
  syncProfileFromBooking(phone, fullName, address, city); // बुकिंग = आपोआप प्रोफाईल सेव्ह/अपडेट (Sheet + या डिव्हाइसवर)

  const appUrl = window.location.href.split("?")[0].split("#")[0];
  const box = document.getElementById("confirmBox");
  box.hidden = false;
  box.innerHTML = `
    <strong>${t("confirm_box_title")}</strong>
    ${lookedUpPatient ? `<p>🆔 ${t("your_patient_id") || "Patient ID"}: <strong>${lookedUpPatient.patientId}</strong></p>` : `<p style="font-size:0.85rem;color:var(--muted);">${t("new_patient_id_note") || "तुमचा Patient ID पुढच्या बुकिंगपासून दिसेल."}</p>`}
    <p>${t("confirm_box_text")}</p>
    <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">${t("confirm_box_wa_btn")}</a>
    <p style="margin-top:10px;">${t("confirm_box_or_call")} <a href="tel:+919870020674">98700 20674</a></p>
    <p class="form-note" style="margin-top:12px;">${t("app_link_note")}<br /><a href="${appUrl}">${appUrl}</a></p>
    <button type="button" id="newBookingBtn" class="link-btn" style="display:block; margin:14px auto 0;">${t("new_booking_btn")}</button>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("newBookingBtn").addEventListener("click", () => location.reload());
  // पेशंटला WhatsApp बटण दाबायला पुरेसा वेळ मिळावा म्हणून थोडा वेळ थांबून अ‍ॅप आपोआप रिफ्रेश होतं
  setTimeout(() => location.reload(), 14000);

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
  renderCities();
  renderCategoryTabs();
  if (document.getElementById("testSearch") && document.getElementById("testSearch").value) {
    renderSearchResults(document.getElementById("testSearch").value);
  }
  if (!document.getElementById("testModal").hidden && currentModalCat) openTestModal(currentModalCat);
  renderSelected();
  updateCartBar();
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

function renderStatusResults(bookings) {
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
        <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
        <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))}</div>
        ${b.reportLink ? `<a href="${b.reportLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block" style="margin-top:10px;">${t("download_report")}</a>` : ""}
      </div>`;
    })
    .join("");
}

document.getElementById("statusCheckBtn").addEventListener("click", () => {
  const phone = document.getElementById("statusPhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) {
    showToast(t("toast_invalid_phone"));
    return;
  }
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


/* =========================================================
   MY PROFILE / LOGIN — phone-number login, offline-first cache,
   background sync, photo upload, and multi-profile (family member)
   switching so more than one person can use the same device.
   ========================================================= */
const PROFILE_CACHE_KEY = "kp_profile_cache";      // last-loaded profile for the CURRENT active phone
const PROFILE_PENDING_KEY = "kp_profile_pending";  // queued save, waiting for internet
const FAMILY_KEY = "kp_family_profiles";           // [{phone,name,photo}] remembered on this device
const ACTIVE_PHONE_KEY = "kp_phone";               // which family member is active right now
let selectedPhotoBase64 = null;
let selectedPhotoType = null;

function getFamilyProfiles() {
  try { return JSON.parse(localStorage.getItem(FAMILY_KEY) || "[]"); } catch (e) { return []; }
}
function saveFamilyProfiles(list) { localStorage.setItem(FAMILY_KEY, JSON.stringify(list)); }
function upsertFamilyProfile(phone, name, photo, relation) {
  const list = getFamilyProfiles();
  const i = list.findIndex(p => p.phone === phone);
  const entry = { phone, name: name || "", photo: photo || "", relation: relation || "Self" };
  if (i > -1) list[i] = { ...list[i], ...entry }; else list.push(entry);
  saveFamilyProfiles(list);
  renderFamilyChips();
}

function initials(name) { const s = String(name || "?").trim(); return s ? s.charAt(0).toUpperCase() : "?"; }

function updateTopBadge(name, photo) {
  const wrap = document.getElementById("topProfileAvatarWrap");
  if (!wrap) return;
  wrap.innerHTML = photo ? `<img src="${photo}" alt="">` : (name ? initials(name) : "👤");
}

function renderFamilyChips() {
  const list = getFamilyProfiles();
  const box = document.getElementById("familyProfilesBox");
  const wrap = document.getElementById("familyProfilesList");
  if (!box || !wrap) return;
  if (list.length === 0) { box.hidden = true; return; }
  box.hidden = false;
  const activePhone = localStorage.getItem(ACTIVE_PHONE_KEY);
  wrap.innerHTML = list.map(p => `
    <div class="family-chip${p.phone === activePhone ? " active-chip" : ""}" data-phone="${p.phone}">
      <div class="family-chip-avatar">${p.photo ? `<img src="${p.photo}" alt="">` : initials(p.name)}</div>
      <div class="family-chip-info"><strong>${p.name || t("profile_new_line")}</strong><span>${p.relation && p.relation !== "Self" ? p.relation + " · " : ""}📞 ${p.phone}</span></div>
    </div>`).join("");
  wrap.querySelectorAll(".family-chip").forEach(chip => chip.addEventListener("click", () => {
    const phone = chip.dataset.phone;
    document.getElementById("profilePhoneInput").value = phone;
    document.getElementById("profileLoginBox").hidden = false;
    loadProfileForPhone(phone, false);
  }));
}

/* ---- Swipe gesture: swipe left/right on the profile card to switch
   between family members saved on this device (real touch detection,
   not just a horizontally-scrolling list). ---- */
function switchToAdjacentProfile(direction) {
  const list = getFamilyProfiles();
  if (list.length < 2) return;
  const activePhone = localStorage.getItem(ACTIVE_PHONE_KEY);
  let idx = list.findIndex(p => p.phone === activePhone);
  if (idx === -1) idx = 0;
  idx = (idx + direction + list.length) % list.length;
  const next = list[idx];
  document.getElementById("profilePhoneInput").value = next.phone;
  document.getElementById("profileLoginBox").hidden = false;
  loadProfileForPhone(next.phone, false);
  showToast(`${next.name || t("profile_new_line")}`);
}
function enableSwipeToSwitchProfile(el) {
  if (!el) return;
  let startX = 0, startY = 0, tracking = false;
  el.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });
  el.addEventListener("touchend", e => {
    if (!tracking) return;
    tracking = false;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      switchToAdjacentProfile(dx < 0 ? 1 : -1); // डावीकडे स्वाइप = पुढची प्रोफाईल, उजवीकडे = मागची
    }
  }, { passive: true });
}
enableSwipeToSwitchProfile(document.getElementById("profileFormWrap"));
enableSwipeToSwitchProfile(document.getElementById("familyProfilesBox"));

function cacheProfileLocally(phone, profile) {
  localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ phone, profile, savedAt: Date.now() }));
  localStorage.setItem(ACTIVE_PHONE_KEY, phone);
  upsertFamilyProfile(phone, profile.name, profile.photo, profile.relation);
  updateTopBadge(profile.name, profile.photo);
}
function getCachedProfile(phone) {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.phone === phone ? parsed.profile : null;
  } catch (e) { return null; }
}
function fillProfileForm(p) {
  document.getElementById("profileFormWrap").hidden = false;
  document.getElementById("profileNameField").value = p.name || "";
  document.getElementById("profileAgeField").value = p.age || "";
  document.getElementById("profileAddressField").value = p.address || "";
  document.getElementById("profileCityField").value = p.city || "";
  setPillValue("genderPillRow", "profileGenderField", "gender", p.gender || "");
  setPillValue("relationPillRow", "profileRelationField", "relation", p.relation || "Self");
  const img = document.getElementById("profilePhotoPreview");
  const placeholder = document.getElementById("profilePhotoPlaceholder");
  if (p.photo) { img.src = p.photo; img.hidden = false; placeholder.hidden = true; }
  else { img.hidden = true; placeholder.hidden = false; }
  selectedPhotoBase64 = null; selectedPhotoType = null; /* reset — only re-upload if user picks a NEW file */
}
function setPillValue(rowId, hiddenId, dataAttr, value) {
  const row = document.getElementById(rowId);
  if (!row) return;
  row.querySelectorAll(".pill-btn").forEach(b => b.classList.toggle("active", b.dataset[dataAttr] === value));
  document.getElementById(hiddenId).value = value;
}
document.getElementById("genderPillRow").addEventListener("click", e => {
  const btn = e.target.closest(".pill-btn");
  if (!btn) return;
  setPillValue("genderPillRow", "profileGenderField", "gender", btn.dataset.gender);
});
document.getElementById("relationPillRow").addEventListener("click", e => {
  const btn = e.target.closest(".pill-btn");
  if (!btn) return;
  setPillValue("relationPillRow", "profileRelationField", "relation", btn.dataset.relation);
});
function setSyncStatus(msg) {
  const el = document.getElementById("profileSyncStatus");
  if (el) el.textContent = msg || "";
}

function loadProfileForPhone(phone, silent) {
  const cached = getCachedProfile(phone);
  if (cached) {
    fillProfileForm(cached);
    document.getElementById("profileIdLine").textContent = cached.patientId ? `${t("profile_found_line")} ${cached.patientId}` : t("profile_new_line");
    setSyncStatus(t("profile_offline_copy"));
    updateTopBadge(cached.name, cached.photo);
  }
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  if (!canReachServer) { if (!cached && !silent) showToast(t("network_weak")); return; }
  fetch(`${CONFIG.appsScriptUrl}?action=profile&phone=${phone}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("profileFormWrap").hidden = false;
      const idLine = document.getElementById("profileIdLine");
      if (data.found) {
        idLine.textContent = `${t("profile_found_line")} ${data.patientId}`;
        fillProfileForm(data);
        cacheProfileLocally(phone, data);
        setSyncStatus(t("profile_synced_status"));
        updateTopBadge(data.name, data.photo);
      } else if (!cached) {
        idLine.textContent = t("profile_new_line");
        fillProfileForm({});
        setSyncStatus("");
      }
      loadHealthHistory(phone);
    })
    .catch(() => { if (!cached && !silent) showToast(t("network_weak")); });
}

/* ---------- Password hashing (client-side, phone acts as per-user salt) ----------
   Plaintext password never leaves the device — only SHA-256(phone+":"+password)
   is ever sent or stored. Not bank-grade (no server pepper), but a real,
   meaningful layer beyond "anyone who knows a phone number can see the profile". */
async function hashPassword(phone, password) {
  const enc = new TextEncoder().encode(phone + ":" + password);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
let pendingAuthPhone = null;

function resetAuthUI() {
  document.getElementById("loginPasswordStep").hidden = true;
  document.getElementById("forgotStep1").hidden = true;
  document.getElementById("forgotStep2").hidden = true;
  document.getElementById("profileFormWrap").hidden = true;
  document.getElementById("authFieldsBlock").hidden = true;
  document.getElementById("profileLoadBtn").hidden = false;
  document.getElementById("guestModeBtn").hidden = false;
  document.getElementById("loginError").hidden = true;
  document.getElementById("forgotStep1Error").hidden = true;
  document.getElementById("forgotStep2Error").hidden = true;
  document.getElementById("profilePhoneInput").value = "";
  document.getElementById("profileIdLine").textContent = "";
  setSyncStatus("");
  document.getElementById("profileHistoryList").innerHTML = "";
  renderFamilyChips();
}
document.querySelectorAll(".back-step").forEach(btn => btn.addEventListener("click", resetAuthUI));

document.getElementById("profileLoadBtn").addEventListener("click", async () => {
  const phone = document.getElementById("profilePhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) { showToast(t("toast_invalid_phone")); return; }
  const knownOnDevice = getFamilyProfiles().some(p => p.phone === phone);
  if (knownOnDevice) { loadProfileForPhone(phone, false); return; } // या डिव्हाइसवर आधीच login केलेला आहे — पासवर्ड परत नको
  pendingAuthPhone = phone;
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  if (!canReachServer) { showToast(t("network_weak")); return; }
  const btn = document.getElementById("profileLoadBtn");
  btn.disabled = true;
  try {
    const res = await fetch(`${CONFIG.appsScriptUrl}?action=profileExists&phone=${phone}`);
    const data = await res.json();
    if (!data.found) {
      document.getElementById("profileLoadBtn").hidden = true;
      document.getElementById("guestModeBtn").hidden = true;
      document.getElementById("authFieldsBlock").hidden = false;
      document.getElementById("profileFormWrap").hidden = false;
      document.getElementById("profileIdLine").textContent = t("profile_new_line");
      fillProfileForm({});
    } else if (!data.hasPassword) {
      const res2 = await fetch(`${CONFIG.appsScriptUrl}?action=profile&phone=${phone}`);
      const pd = await res2.json();
      document.getElementById("profileLoadBtn").hidden = true;
      document.getElementById("guestModeBtn").hidden = true;
      document.getElementById("authFieldsBlock").hidden = false;
      document.getElementById("profileFormWrap").hidden = false;
      document.getElementById("profileIdLine").textContent = pd.found ? `${t("profile_found_line")} ${pd.patientId}` : t("profile_new_line");
      fillProfileForm(pd.found ? pd : {});
      loadHealthHistory(phone);
    } else {
      document.getElementById("profileLoadBtn").hidden = true;
      document.getElementById("guestModeBtn").hidden = true;
      document.getElementById("loginPasswordStep").hidden = false;
      document.getElementById("loginPasswordField").value = "";
      document.getElementById("loginPasswordField").focus();
    }
  } catch (e) {
    showToast(t("network_weak"));
  } finally {
    btn.disabled = false;
  }
});

document.getElementById("loginSubmitBtn").addEventListener("click", async () => {
  const phone = pendingAuthPhone;
  const password = document.getElementById("loginPasswordField").value;
  if (!password) { showToast(t("toast_enter_password")); return; }
  document.getElementById("loginError").hidden = true;
  const hash = await hashPassword(phone, password);
  try {
    const res = await fetch(`${CONFIG.appsScriptUrl}?action=login&phone=${phone}&hash=${hash}`);
    const data = await res.json();
    if (data.success) {
      document.getElementById("loginPasswordStep").hidden = true;
      document.getElementById("profileFormWrap").hidden = false;
      document.getElementById("profileIdLine").textContent = `${t("profile_found_line")} ${data.profile.patientId}`;
      fillProfileForm(data.profile);
      cacheProfileLocally(phone, data.profile);
      setSyncStatus(t("profile_synced_status"));
      loadHealthHistory(phone);
      showToast(t("login_success_toast"));
    } else {
      document.getElementById("loginError").textContent = t("wrong_password_error");
      document.getElementById("loginError").hidden = false;
    }
  } catch (e) { showToast(t("network_weak")); }
});
document.getElementById("loginPasswordField").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("loginSubmitBtn").click(); });

document.getElementById("forgotPasswordLink").addEventListener("click", () => {
  document.getElementById("loginPasswordStep").hidden = true;
  document.getElementById("forgotStep1").hidden = false;
});
document.getElementById("sendResetCodeBtn").addEventListener("click", async () => {
  const phone = pendingAuthPhone;
  document.getElementById("forgotStep1Error").hidden = true;
  try {
    const res = await fetch(`${CONFIG.appsScriptUrl}?action=requestReset&phone=${phone}`);
    const data = await res.json();
    if (data.success) {
      document.getElementById("forgotStep1").hidden = true;
      document.getElementById("forgotStep2").hidden = false;
      showToast(t("reset_code_sent_toast"));
    } else {
      document.getElementById("forgotStep1Error").textContent = data.reason === "no_email" ? t("no_email_on_file_error") : t("network_weak");
      document.getElementById("forgotStep1Error").hidden = false;
    }
  } catch (e) { showToast(t("network_weak")); }
});
document.getElementById("confirmResetBtn").addEventListener("click", async () => {
  const phone = pendingAuthPhone;
  const code = document.getElementById("resetCodeField").value.trim();
  const p1 = document.getElementById("resetPwdField1").value;
  const p2 = document.getElementById("resetPwdField2").value;
  document.getElementById("forgotStep2Error").hidden = true;
  if (!code) { showToast(t("toast_enter_code")); return; }
  if (p1.length < 4) { showToast(t("password_too_short")); return; }
  if (p1 !== p2) { showToast(t("password_mismatch")); return; }
  const hash = await hashPassword(phone, p1);
  try {
    const res = await fetch(`${CONFIG.appsScriptUrl}?action=confirmReset&phone=${phone}&code=${code}&hash=${hash}`);
    const data = await res.json();
    if (data.success) {
      document.getElementById("forgotStep2").hidden = true;
      document.getElementById("profileFormWrap").hidden = false;
      document.getElementById("profileIdLine").textContent = `${t("profile_found_line")} ${data.profile.patientId}`;
      fillProfileForm(data.profile);
      cacheProfileLocally(phone, data.profile);
      setSyncStatus(t("profile_synced_status"));
      loadHealthHistory(phone);
      notifyLabWhatsAppPasswordChanged(data.profile.name, phone);
      showToast(t("password_reset_success_toast"));
    } else {
      const key = data.reason === "wrong_code" ? "wrong_reset_code_error" : data.reason === "expired" ? "reset_code_expired_error" : "network_weak";
      document.getElementById("forgotStep2Error").textContent = t(key);
      document.getElementById("forgotStep2Error").hidden = false;
    }
  } catch (e) { showToast(t("network_weak")); }
});

/* पासवर्ड बदलल्याची सूचना लॅबच्या WhatsApp वर (ईमेल आधीच सर्व्हरकडून आपोआप गेलेला असतो) */
function notifyLabWhatsAppPasswordChanged(name, phone) {
  const msg = `🔑 पासवर्ड बदलला — Kalyan Pathlab\nनाव: ${name || "-"}\nमोबाईल: ${phone}`;
  window.open(`https://wa.me/919870020674?text=${encodeURIComponent(msg)}`, "_blank");
}

document.getElementById("guestModeBtn").addEventListener("click", () => {
  showSection("home");
  showToast(t("guest_mode_toast"));
});

document.getElementById("switchProfileBtn").addEventListener("click", resetAuthUI);
document.getElementById("addFamilyBtn").addEventListener("click", () => {
  resetAuthUI();
  document.getElementById("profilePhoneInput").focus();
});

/* ---- Photo picker ---- */
document.getElementById("profilePhotoInput").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  const MAX_SIZE = 3 * 1024 * 1024; // 3MB
  if (file.size > MAX_SIZE) { showToast(t("photo_too_large")); e.target.value = ""; return; }
  selectedPhotoBase64 = await fileToBase64(file);
  selectedPhotoType = file.type;
  const img = document.getElementById("profilePhotoPreview");
  const placeholder = document.getElementById("profilePhotoPlaceholder");
  img.src = `data:${file.type};base64,${selectedPhotoBase64}`;
  img.hidden = false;
  placeholder.hidden = true;
});

document.getElementById("profileSaveBtn").addEventListener("click", async () => {
  const phone = document.getElementById("profilePhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) { showToast(t("toast_invalid_phone")); return; }

  // पहिल्यांदाच profile बनवत असाल / जुनी profile ला password सेट करत असाल — दोन्हीत हे field दिसतं
  const settingPassword = !document.getElementById("authFieldsBlock").hidden;
  let email = "", pwdHash = "";
  if (settingPassword) {
    email = document.getElementById("profileEmailField").value.trim();
    const p1 = document.getElementById("profilePwdField1").value;
    const p2 = document.getElementById("profilePwdField2").value;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showToast(t("valid_email_required")); return; }
    if (p1.length < 4) { showToast(t("password_too_short")); return; }
    if (p1 !== p2) { showToast(t("password_mismatch")); return; }
    pwdHash = await hashPassword(phone, p1);
  }

  const existingCached = getCachedProfile(phone) || {};
  const profile = {
    name: document.getElementById("profileNameField").value.trim(),
    age: document.getElementById("profileAgeField").value,
    gender: document.getElementById("profileGenderField").value,
    relation: document.getElementById("profileRelationField").value || "Self",
    address: document.getElementById("profileAddressField").value.trim(),
    city: document.getElementById("profileCityField").value.trim(),
    photo: selectedPhotoBase64 ? `data:${selectedPhotoType};base64,${selectedPhotoBase64}` : (existingCached.photo || "")
  };
  cacheProfileLocally(phone, profile); /* saved on this device immediately — never lost, works offline */
  const payload = { type: "profile", phone, name: profile.name, age: profile.age, gender: profile.gender, relation: profile.relation, address: profile.address, city: profile.city };
  if (selectedPhotoBase64) { payload.photoBase64 = selectedPhotoBase64; payload.photoType = selectedPhotoType; }
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  if (!canReachServer) {
    localStorage.setItem(PROFILE_PENDING_KEY, JSON.stringify(payload));
    showToast(t("profile_saved_offline_toast"));
    setSyncStatus(t("profile_offline_copy"));
    return;
  }
  fetch(CONFIG.appsScriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
    .then(() => {
      showToast(t("profile_saved_toast"));
      setSyncStatus(t("profile_synced_status"));
      localStorage.removeItem(PROFILE_PENDING_KEY);
    })
    .catch(() => {
      localStorage.setItem(PROFILE_PENDING_KEY, JSON.stringify(payload));
      showToast(t("profile_saved_offline_toast"));
      setSyncStatus(t("profile_offline_copy"));
    });

  if (settingPassword) {
    fetch(CONFIG.appsScriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "setPassword", phone, hash: pwdHash, email }) })
      .then(() => showToast(t("password_set_toast")))
      .catch(() => {});
    document.getElementById("authFieldsBlock").hidden = true;
  }
});

function syncPendingProfile() {
  const raw = localStorage.getItem(PROFILE_PENDING_KEY);
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  if (!raw || !canReachServer) return;
  fetch(CONFIG.appsScriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: raw })
    .then(() => {
      localStorage.removeItem(PROFILE_PENDING_KEY);
      showToast(t("profile_sync_done_toast"));
      setSyncStatus(t("profile_synced_status"));
    })
    .catch(() => {});
}
window.addEventListener("online", syncPendingProfile);

/* ---- Top header badge → tap to jump to Profile tab ---- */
/* ---- Top header quick-switch dropdown (profile switching accessible from anywhere) ---- */
function renderProfileSwitchDropdown() {
  const list = getFamilyProfiles();
  const dd = document.getElementById("profileSwitchDropdown");
  const activePhone = localStorage.getItem(ACTIVE_PHONE_KEY);
  dd.innerHTML =
    list.map(p => `
      <div class="psd-chip${p.phone === activePhone ? " current" : ""}" data-phone="${p.phone}">
        <div class="psd-avatar">${p.photo ? `<img src="${p.photo}" alt="">` : initials(p.name)}</div>
        <div class="psd-info"><strong>${p.name || t("profile_new_line")}</strong><span>${p.relation && p.relation !== "Self" ? p.relation + " · " : ""}📞 ${p.phone}</span></div>
      </div>`).join("") +
    `<div class="psd-add" id="psdAddNew">+ ${t("family_add_btn")}</div>` +
    (activePhone ? `<div class="psd-add" id="psdLogout" style="color:#a1235a">🔓 ${t("logout_btn")}</div>` : "");
  dd.querySelectorAll(".psd-chip").forEach(chip => chip.addEventListener("click", () => {
    const phone = chip.dataset.phone;
    document.getElementById("profilePhoneInput").value = phone;
    document.getElementById("profileLoginBox").hidden = false;
    loadProfileForPhone(phone, false);
    closeProfileSwitchDropdown();
    showSection("profile");
  }));
  document.getElementById("psdAddNew").addEventListener("click", () => {
    closeProfileSwitchDropdown();
    showSection("profile");
    document.getElementById("addFamilyBtn").click();
  });
  const psdLogout = document.getElementById("psdLogout");
  if (psdLogout) psdLogout.addEventListener("click", () => {
    closeProfileSwitchDropdown();
    logoutUser();
  });
}

/* ---- Logout: ends the current session on this device but keeps the
   saved family profiles so logging back in is quick. ---- */
function logoutUser() {
  localStorage.removeItem(ACTIVE_PHONE_KEY);
  localStorage.removeItem(PROFILE_CACHE_KEY);
  updateTopBadge("", "");
  resetAuthUI();
  showSection("home");
  showToast(t("logout_success_toast"));
}
document.getElementById("logoutBtn").addEventListener("click", logoutUser);
function closeProfileSwitchDropdown() { document.getElementById("profileSwitchDropdown").hidden = true; }
document.getElementById("topProfileBadge").addEventListener("click", (e) => {
  e.stopPropagation();
  const list = getFamilyProfiles();
  if (list.length === 0) { showSection("profile"); return; }
  const dd = document.getElementById("profileSwitchDropdown");
  if (!dd.hidden) { closeProfileSwitchDropdown(); return; }
  renderProfileSwitchDropdown();
  dd.hidden = false;
});
document.addEventListener("click", (e) => {
  const dd = document.getElementById("profileSwitchDropdown");
  if (!dd.hidden && !e.target.closest(".profile-switch-dropdown") && !e.target.closest("#topProfileBadge")) closeProfileSwitchDropdown();
});

/* ---- Simple, real "health record" = their own past bookings/tests, not fabricated data ---- */
function loadHealthHistory(phone) {
  const box = document.getElementById("profileHistoryList");
  if (!box) return;
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  if (!canReachServer) { box.innerHTML = `<p class="section-sub">${t("network_weak")}</p>`; return; }
  fetch(`${CONFIG.appsScriptUrl}?action=bookingStatus&phone=${phone}`)
    .then(res => res.json())
    .then(data => {
      const list = data.bookings || [];
      if (list.length === 0) { box.innerHTML = `<p class="section-sub">${t("no_booking_found")}</p>`; return; }
      box.innerHTML = list.map(b => `
        <div class="history-row">
          <strong>${escapeHtmlLocal(b.tests || "-")}</strong>
          <div class="section-sub">📅 ${escapeHtmlLocal(String(b.date || ""))} · ${escapeHtmlLocal(b.status || "")}${b.amount ? " · ₹" + b.amount : ""}</div>
        </div>`).join("");
    })
    .catch(() => { box.innerHTML = `<p class="section-sub">${t("network_weak")}</p>`; });
}
function escapeHtmlLocal(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* Booking = auto profile save/update (so a profile is never "missing"
   after someone books, even if they never opened the Profile tab). */
function syncProfileFromBooking(phone, name, address, city) {
  if (!/^[0-9]{10}$/.test(phone)) return;
  const existing = getCachedProfile(phone) || {};
  const profile = {
    name: name || existing.name || "",
    age: existing.age || "",
    gender: existing.gender || "",
    relation: existing.relation || "Self",
    address: address || existing.address || "",
    city: city || existing.city || "",
    photo: existing.photo || ""
  };
  cacheProfileLocally(phone, profile);
  const canReachServer = navigator.onLine && CONFIG.appsScriptUrl && !CONFIG.appsScriptUrl.startsWith("PASTE_");
  const payload = { type: "profile", phone, name: profile.name, age: profile.age, gender: profile.gender, relation: profile.relation, address: profile.address, city: profile.city };
  if (!canReachServer) { localStorage.setItem(PROFILE_PENDING_KEY, JSON.stringify(payload)); return; }
  fetch(CONFIG.appsScriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) }).catch(() => {
    localStorage.setItem(PROFILE_PENDING_KEY, JSON.stringify(payload));
  });
}

/* Auto-login: if a phone is remembered on this device, load that
   profile right away (front-end shows name/photo without asking
   again), and render the family-member switcher. */
document.addEventListener("DOMContentLoaded", () => {
  renderFamilyChips();
  const savedPhone = localStorage.getItem(ACTIVE_PHONE_KEY);
  if (savedPhone) {
    document.getElementById("profilePhoneInput").value = savedPhone;
    loadProfileForPhone(savedPhone, true);
  }
  syncPendingProfile();
});

/* ---- Auto-fill the booking form from the active profile (no re-typing) ---- */
function prefillBookingFromProfile() {
  const phone = localStorage.getItem(ACTIVE_PHONE_KEY);
  if (!phone) return;
  const cached = getCachedProfile(phone);
  if (!cached) return;
  const phoneField = document.getElementById("phone");
  const nameField = document.getElementById("fullName");
  const addressField = document.getElementById("address");
  const cityField = document.getElementById("city");
  if (phoneField && !phoneField.value) phoneField.value = phone;
  if (nameField && !nameField.value && cached.name) nameField.value = cached.name;
  if (addressField && !addressField.value && cached.address) addressField.value = cached.address;
  if (cityField && !cityField.value && cached.city) cityField.value = cached.city;
}
