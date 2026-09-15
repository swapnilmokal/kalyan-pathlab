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
  chips.innerHTML = CONFIG.cities.map((c) => `<span>${translateCityName(c)}</span>`).join("");
  const select = document.getElementById("city");
  const prevValue = select.value;
  select.innerHTML =
    `<option value="">${t("city_placeholder_option")}</option>` +
    CONFIG.cities.map((c) => `<option value="${c}">${translateCityName(c)}</option>`).join("");
  if (prevValue) select.value = prevValue;
}

/* ---------- Test list ---------- */
function renderCategoryTabs() {
  const wrap = document.getElementById("categoryTabs");
  const prevActive = wrap.querySelector("button.active")?.dataset.cat || "all";
  wrap.innerHTML =
    `<button data-cat="all" class="${prevActive === "all" ? "active" : ""}">${t("cat_all")}</button>` +
    TEST_CATEGORIES.map((c) => `<button data-cat="${c.id}" class="${prevActive === c.id ? "active" : ""}">${translateCategoryName(c)}</button>`).join("");
}
document.getElementById("categoryTabs").addEventListener("click", (e) => {
  const wrap = e.currentTarget;
  const btn = e.target.closest("button");
  if (!btn) return;
  wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderTestList(document.getElementById("testSearch").value, btn.dataset.cat);
});

function renderTestList(filterText = "", catFilter = "all") {
  const wrap = document.getElementById("testListWrap");
  const noResult = document.getElementById("noResult");
  const term = filterText.trim().toLowerCase();
  let anyShown = false;
  let html = "";

  TEST_CATEGORIES.forEach((cat) => {
    if (catFilter !== "all" && cat.id !== catFilter) return;
    const matches = cat.tests.filter((t) => t.name.toLowerCase().includes(term));
    if (matches.length === 0) return;
    anyShown = true;
    html += `<div class="test-category-title">${translateCategoryName(cat)}</div>`;
    matches.forEach((t) => {
      const isAdded = selectedTests.some((s) => s.name === t.name);
      html += `
        <div class="test-row">
          <span class="test-row-name">${t.name}</span>
          <div class="test-row-price">
            <span class="test-row-mrp">₹${t.mrp}</span>
            <span class="test-row-final">₹${t.price}</span>
          </div>
          <button type="button" class="test-add-btn ${isAdded ? "added" : ""}" data-name="${encodeURIComponent(t.name)}" data-price="${t.price}">${isAdded ? "✓" : "+"}</button>
        </div>`;
    });
  });

  wrap.innerHTML = html;
  noResult.hidden = anyShown;

  wrap.querySelectorAll(".test-add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = decodeURIComponent(btn.dataset.name);
      const price = Number(btn.dataset.price);
      toggleTest(name, price);
      renderTestList(document.getElementById("testSearch").value, document.querySelector(".category-tabs button.active").dataset.cat);
      renderSelected();
    });
  });
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
      renderTestList(document.getElementById("testSearch").value, document.querySelector(".category-tabs button.active").dataset.cat);
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
  const activeCat = document.querySelector(".category-tabs button.active")?.dataset.cat || "all";
  renderTestList(e.target.value, activeCat);
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
  const waMsg =
    `✅ *नवीन बुकिंग - Kalyan Pathlab* ✅\n` +
    `━━━━━━━━━━━━━━\n` +
    (lookedUpPatient ? `🆔 *Patient ID:* ${lookedUpPatient.patientId} (Returning)\n` : "") +
    `👤 *नाव:* ${fullName}\n` +
    `📞 *मोबाईल:* ${phone}\n` +
    `📍 *पत्ता:* ${address}, ${city}\n` +
    `🧪 *टेस्ट/पॅकेज:* ${testNames.join(", ") || "-"}\n` +
    `💰 *अंदाजे रक्कम:* ₹${total}\n` +
    `📅 *कलेक्शन दिवस/वेळ:* ${date} ${time}\n` +
    `👨‍⚕️ *डॉक्टर रेफरन्स:* ${doctor}\n` +
    `📄 *रिपोर्ट हवा:* ${reportMode}` +
    (capturedLocation ? `\n📍 *लोकेशन:* ${capturedLocation}` : "") +
    (lookedUpPatient && lookedUpPatient.lastTests ? `\n🕓 *मागील टेस्ट:* ${lookedUpPatient.lastTests}` : "") +
    `\n━━━━━━━━━━━━━━\n` +
    `_संस्कार फाउंडेशन संचलित · Care For Quality_`;

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
  renderTestList(
    document.getElementById("testSearch") ? document.getElementById("testSearch").value : "",
    document.querySelector(".category-tabs button.active")?.dataset.cat || "all"
  );
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
        const catName = (r.category || "इतर टेस्ट").trim();
        if (!(catName in catIndex)) {
          catIndex[catName] = grouped.length;
          grouped.push({ id: `cat${grouped.length}`, name: catName, tests: [] });
        }
        grouped[catIndex[catName]].tests.push({
          name: r.name,
          mrp: Number(r.mrp) || 0,
          price: Number(r.price) || 0
        });
      });
      TEST_CATEGORIES = grouped;
      renderCategoryTabs();
      renderTestList();
    })
    .catch(() => {}); // इंटरनेट/लिंक प्रॉब्लेम असल्यास built-in यादी तशीच राहते
}

/* ---------- Init ---------- */
renderCities();
renderCategoryTabs();
renderTestList();
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
   MY PROFILE — offline-first: saves to this device instantly (works
   without internet), syncs to the server in the background, and
   auto-loads next time the app opens (no need to re-enter phone).
   ========================================================= */
const PROFILE_CACHE_KEY = "kp_profile_cache";
const PROFILE_PENDING_KEY = "kp_profile_pending";

function cacheProfileLocally(phone, profile) {
  localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ phone, profile, savedAt: Date.now() }));
  localStorage.setItem("kp_phone", phone);
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
  document.getElementById("profileGenderField").value = p.gender || "";
  document.getElementById("profileAddressField").value = p.address || "";
  document.getElementById("profileCityField").value = p.city || "";
}
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
      } else if (!cached) {
        idLine.textContent = t("profile_new_line");
        fillProfileForm({});
        setSyncStatus("");
      }
      loadHealthHistory(phone);
    })
    .catch(() => { if (!cached && !silent) showToast(t("network_weak")); });
}

document.getElementById("profileLoadBtn").addEventListener("click", () => {
  const phone = document.getElementById("profilePhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) { showToast(t("toast_invalid_phone")); return; }
  loadProfileForPhone(phone, false);
});

document.getElementById("profileSaveBtn").addEventListener("click", () => {
  const phone = document.getElementById("profilePhoneInput").value.trim();
  if (!/^[0-9]{10}$/.test(phone)) { showToast(t("toast_invalid_phone")); return; }
  const profile = {
    name: document.getElementById("profileNameField").value.trim(),
    age: document.getElementById("profileAgeField").value,
    gender: document.getElementById("profileGenderField").value,
    address: document.getElementById("profileAddressField").value.trim(),
    city: document.getElementById("profileCityField").value.trim()
  };
  cacheProfileLocally(phone, profile); /* saved on this device immediately — never lost, works offline */
  const payload = { type: "profile", phone, ...profile };
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

/* Auto-load remembered profile the moment the app opens — shown the
   instant the person taps the Profile tab, no re-typing needed. */
document.addEventListener("DOMContentLoaded", () => {
  const savedPhone = localStorage.getItem("kp_phone");
  if (savedPhone) {
    document.getElementById("profilePhoneInput").value = savedPhone;
    loadProfileForPhone(savedPhone, true);
  }
  syncPendingProfile();
});

