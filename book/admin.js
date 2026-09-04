/* Kalyan Pathlab - Admin Panel (no login — keep this page's link private) */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9nlYZGUiPXz6-P7zrxsuJGJgLqLFIKcaVds8zYUQk3REKGVVPbi5z9vzkjnq7XullDQ/exec";
const CUSTOMER_APP_URL = "https://swapnilmokal.github.io/kalyan-pathlab/book/";

const TRANSLATIONS = {
  tab_bookings: { en: "📅 Bookings", mr: "📅 बुकिंग्ज", hi: "📅 बुकिंग" },
  tab_reviews: { en: "⭐ Reviews", mr: "⭐ रिव्ह्यूज", hi: "⭐ रिव्यू" },
  tab_tests: { en: "🧪 Tests", mr: "🧪 टेस्ट", hi: "🧪 टेस्ट" },
  tab_patients: { en: "🔍 Find Patient", mr: "🔍 पेशंट शोधा", hi: "🔍 मरीज़ खोजें" },
  search_bookings: { en: "Search by name, phone, or test…", mr: "नाव, फोन किंवा टेस्टने शोधा…", hi: "नाम, फोन या टेस्ट से खोजें…" },
  filter_all: { en: "All", mr: "सर्व", hi: "सभी" },
  filter_pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },
  filter_approved: { en: "Approved", mr: "मंजूर", hi: "स्वीकृत" },
  filter_rejected: { en: "Rejected", mr: "नाकारलेले", hi: "अस्वीकृत" },
  add_new_test: { en: "+ Add New Test", mr: "+ नवीन टेस्ट जोडा", hi: "+ नई टेस्ट जोड़ें" },
  ph_category: { en: "Category (e.g. Diabetes Profile)", mr: "कॅटेगरी (उदा. Diabetes Profile)", hi: "श्रेणी (उदा. Diabetes Profile)" },
  ph_test_name: { en: "Test Name (e.g. HbA1c)", mr: "टेस्टचं नाव (उदा. HbA1c)", hi: "टेस्ट का नाम (उदा. HbA1c)" },
  ph_mrp: { en: "MRP ₹", mr: "MRP ₹", hi: "MRP ₹" },
  ph_price: { en: "Discount Price ₹", mr: "डिस्काउंट किंमत ₹", hi: "डिस्काउंट कीमत ₹" },
  save_test: { en: "Save Test", mr: "टेस्ट सेव्ह करा", hi: "टेस्ट सेव करें" },
  cancel: { en: "Cancel", mr: "रद्द करा", hi: "रद्द करें" },
  search_tests: { en: "Search tests…", mr: "टेस्ट शोधा…", hi: "टेस्ट खोजें…" },
  ph_phone_search: { en: "Enter 10-digit phone number…", mr: "10 अंकी फोन नंबर टाका…", hi: "10 अंकों का फोन नंबर डालें…" },
  search_btn: { en: "Search", mr: "शोधा", hi: "खोजें" },
  stat_total_bookings: { en: "Total Bookings", mr: "एकूण बुकिंग्ज", hi: "कुल बुकिंग" },
  stat_today: { en: "Today", mr: "आज", hi: "आज" },
  stat_total_reviews: { en: "Total Reviews", mr: "एकूण रिव्ह्यू", hi: "कुल रिव्यू" },
  stat_pending_reviews: { en: "Pending Reviews", mr: "प्रलंबित रिव्ह्यू", hi: "लंबित रिव्यू" },
  no_bookings: { en: "No bookings found.", mr: "कुठलीही बुकिंग सापडली नाही.", hi: "कोई बुकिंग नहीं मिली।" },
  no_reviews: { en: "No reviews found.", mr: "कुठलाही रिव्ह्यू सापडला नाही.", hi: "कोई रिव्यू नहीं मिला।" },
  no_tests: { en: 'No tests found. Tap "+ Add New Test" to create the price list.', mr: 'कुठलीही टेस्ट सापडली नाही. "+ नवीन टेस्ट जोडा" दाबून किंमत यादी तयार करा.', hi: 'कोई टेस्ट नहीं मिली। "+ नई टेस्ट जोड़ें" दबाकर मूल्य सूची बनाएं।' },
  view_prescription: { en: "📎 View Prescription", mr: "📎 प्रिस्क्रिप्शन पहा", hi: "📎 प्रिस्क्रिप्शन देखें" },
  btn_approve: { en: "✓ Approve", mr: "✓ मंजूर करा", hi: "✓ स्वीकृत करें" },
  btn_reject: { en: "✕ Reject", mr: "✕ नाकारा", hi: "✕ अस्वीकृत करें" },
  btn_delete: { en: "🗑 Delete", mr: "🗑 डिलीट करा", hi: "🗑 डिलीट करें" },
  btn_edit: { en: "✏️ Edit", mr: "✏️ एडिट करा", hi: "✏️ एडिट करें" },
  confirm_delete_review: { en: "Delete this review permanently?", mr: "हा रिव्ह्यू कायमचा डिलीट करायचा?", hi: "यह रिव्यू हमेशा के लिए डिलीट करें?" },
  confirm_delete_test: { en: "Delete this test permanently? This will remove it from the public app too.", mr: "ही टेस्ट कायमची डिलीट करायची? ती पब्लिक अ‍ॅपवरूनही निघून जाईल.", hi: "यह टेस्ट हमेशा के लिए डिलीट करें? यह पब्लिक ऐप से भी हट जाएगी।" },
  fill_all_fields: { en: "Fill all fields (Category, Name, MRP, Price).", mr: "सगळे रकाने भरा (Category, Name, MRP, Price).", hi: "सभी फ़ील्ड भरें (Category, Name, MRP, Price)." },
  update_test: { en: "Update Test", mr: "टेस्ट अपडेट करा", hi: "टेस्ट अपडेट करें" },
  saved_refreshing: { en: "Saved ✓ — refreshing…", mr: "सेव्ह झालं ✓ — रिफ्रेश होतंय…", hi: "सेव हुआ ✓ — रिफ्रेश हो रहा है…" },
  refreshing: { en: "Refreshing…", mr: "रिफ्रेश होतंय…", hi: "रिफ्रेश हो रहा है…" },
  network_weak: { en: "Network seems weak — try again.", mr: "नेटवर्क कमजोर दिसतंय — पुन्हा प्रयत्न करा.", hi: "नेटवर्क कमजोर लग रहा है — फिर से प्रयास करें।" },
  invalid_phone: { en: "Enter a valid 10-digit phone number.", mr: "योग्य 10 अंकी फोन नंबर टाका.", hi: "सही 10 अंकों का फोन नंबर डालें।" },
  no_prev_bookings: { en: "No previous bookings found for this number.", mr: "या नंबरसाठी आधीची बुकिंग सापडली नाही.", hi: "इस नंबर के लिए कोई पिछली बुकिंग नहीं मिली।" },
  prev_bookings_found: { en: "previous booking(s) found:", mr: "आधीच्या बुकिंग्ज सापडल्या:", hi: "पिछली बुकिंग मिलीं:" },
  share_customer_title: { en: "Kalyan Pathlab — Book a Test", mr: "Kalyan Pathlab — टेस्ट बुक करा", hi: "Kalyan Pathlab — टेस्ट बुक करें" },
  share_customer_text: { en: "Book your blood test at Kalyan Pathlab — 30% to 70% off, free home sample collection!", mr: "Kalyan Pathlab वर टेस्ट बुक करा — 30% ते 70% सवलत, मोफत होम सॅम्पल कलेक्शन!", hi: "Kalyan Pathlab पर टेस्ट बुक करें — 30% से 70% छूट, मुफ्त होम सैंपल कलेक्शन!" }
};
let currentLang = localStorage.getItem("kp_admin_lang") || "en";
function t(key) {
  const e = TRANSLATIONS[key];
  return e ? (e[currentLang] || e.en) : key;
}
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("kp_admin_lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
  document.getElementById("adminLangSelect").value = lang;
  renderAll();
}
document.getElementById("adminLangSelect").addEventListener("change", e => applyLanguage(e.target.value));

let ALL_DATA = { bookings: [], reviews: [], tests: [] };
let currentReviewFilter = "all";
let editingTestRowNum = null;

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { el.hidden = true; }, 2600);
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fetchWithRetry(url, tries = 3, delayMs = 1200) {
  return fetch(url).catch(err => {
    if (tries <= 1) throw err;
    return new Promise(r => setTimeout(r, delayMs)).then(() => fetchWithRetry(url, tries - 1, delayMs));
  });
}

function loadData() {
  fetchWithRetry(`${APPS_SCRIPT_URL}?action=adminData`)
    .then(res => res.json())
    .then(data => { ALL_DATA = data; renderAll(); })
    .catch(() => showToast(t("network_weak")));
}

document.getElementById("refreshBtn").addEventListener("click", () => {
  showToast(t("refreshing"));
  loadData();
});

document.getElementById("shareCustomerLinkBtn").addEventListener("click", async () => {
  const shareData = { title: t("share_customer_title"), text: t("share_customer_text"), url: CUSTOMER_APP_URL };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (err) {}
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`, "_blank");
  }
});

document.querySelectorAll(".admin-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    ["bookings", "reviews", "tests", "patients"].forEach(name => {
      document.getElementById(`tab-${name}`).hidden = name !== btn.dataset.tab;
    });
  });
});

function renderAll() {
  document.getElementById("lastUpdated").textContent = "Updated " + new Date().toLocaleTimeString("en-IN");
  renderStats();
  renderBookings();
  renderReviews();
  renderTests();
}

function renderStats() {
  const today = new Date().toLocaleDateString("en-IN");
  const todayCount = ALL_DATA.bookings.filter(b => { const d = new Date(b.timestamp); return !isNaN(d) && d.toLocaleDateString("en-IN") === today; }).length;
  const pendingReviews = ALL_DATA.reviews.filter(r => r.status === "Pending").length;
  document.getElementById("statRow").innerHTML = `
    <div class="stat-box"><strong>${ALL_DATA.bookings.length}</strong><span>${t("stat_total_bookings")}</span></div>
    <div class="stat-box"><strong>${todayCount}</strong><span>${t("stat_today")}</span></div>
    <div class="stat-box"><strong>${ALL_DATA.reviews.length}</strong><span>${t("stat_total_reviews")}</span></div>
    <div class="stat-box"><strong>${pendingReviews}</strong><span>${t("stat_pending_reviews")}</span></div>`;
}

function renderBookings(filterText = "") {
  const wrap = document.getElementById("bookingList");
  const term = filterText.trim().toLowerCase();
  const rows = ALL_DATA.bookings.filter(b => !term || String(b.fullName).toLowerCase().includes(term) || String(b.phone).includes(term) || String(b.tests).toLowerCase().includes(term));
  if (rows.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_bookings")}</p>`; return; }
  wrap.innerHTML = rows.map(b => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(b.fullName)}</strong><span class="amount">₹${b.amount || 0}</span></div>
      <div class="booking-meta">${b.patientId ? `🆔 <strong>${escapeHtml(b.patientId)}</strong> · ` : ""}📞 ${escapeHtml(String(b.phone))} · 📍 ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
      ${b.prescription ? `<a href="${b.prescription}" target="_blank" rel="noopener" class="link-btn">${t("view_prescription")}</a>` : ""}
    </div>`).join("");
}
document.getElementById("bookingSearch").addEventListener("input", e => renderBookings(e.target.value));

function renderReviews() {
  const wrap = document.getElementById("reviewList");
  const rows = ALL_DATA.reviews.filter(r => currentReviewFilter === "all" || r.status === currentReviewFilter);
  if (rows.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_reviews")}</p>`; return; }
  wrap.innerHTML = rows.map(r => `
    <div class="review-card-admin">
      <div class="booking-card-top"><strong>${escapeHtml(r.name)}</strong><span class="status-badge status-${String(r.status).toLowerCase()}">${escapeHtml(String(r.status))}</span></div>
      <div class="booking-meta">${"★".repeat(Number(r.rating) || 0)}${"☆".repeat(5 - (Number(r.rating) || 0))} · 📞 ${escapeHtml(String(r.phone || ""))}</div>
      <p class="review-feedback">"${escapeHtml(r.feedback)}"</p>
      <div class="review-actions">
        <button type="button" class="mini-btn approve" data-row="${r.rowNum}" data-act="approveReview">${t("btn_approve")}</button>
        <button type="button" class="mini-btn reject" data-row="${r.rowNum}" data-act="rejectReview">${t("btn_reject")}</button>
        <button type="button" class="mini-btn delete" data-row="${r.rowNum}" data-act="deleteReview">${t("btn_delete")}</button>
      </div>
    </div>`).join("");
  wrap.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.act === "deleteReview" && !confirm(t("confirm_delete_review"))) return;
    postAdminAction({ action: b.dataset.act, rowNum: Number(b.dataset.row) });
  }));
}
document.querySelectorAll(".filter-chip").forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentReviewFilter = chip.dataset.status;
  renderReviews();
}));

function renderTests(filterText = "") {
  const wrap = document.getElementById("testListAdmin");
  const term = filterText.trim().toLowerCase();
  const tests = (ALL_DATA.tests || []).filter(x => !term || String(x.name).toLowerCase().includes(term) || String(x.category).toLowerCase().includes(term));
  const categories = [...new Set((ALL_DATA.tests || []).map(x => x.category))];
  document.getElementById("categoryList").innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join("");
  if (tests.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_tests")}</p>`; return; }
  wrap.innerHTML = tests.map(x => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(x.name)}</strong><span class="amount">₹${x.price}</span></div>
      <div class="booking-meta">${escapeHtml(x.category)} · <s>₹${x.mrp}</s> MRP</div>
      <div class="review-actions">
        <button type="button" class="mini-btn approve edit-test" data-row="${x.rowNum}">${t("btn_edit")}</button>
        <button type="button" class="mini-btn delete delete-test" data-row="${x.rowNum}">${t("btn_delete")}</button>
      </div>
    </div>`).join("");
  wrap.querySelectorAll(".edit-test").forEach(b => b.addEventListener("click", () => {
    const x = ALL_DATA.tests.find(y => y.rowNum === Number(b.dataset.row));
    if (!x) return;
    editingTestRowNum = x.rowNum;
    document.getElementById("testCategory").value = x.category;
    document.getElementById("testName").value = x.name;
    document.getElementById("testMrp").value = x.mrp;
    document.getElementById("testPrice").value = x.price;
    document.getElementById("saveTestBtn").textContent = t("update_test");
    document.getElementById("addTestForm").hidden = false;
    document.getElementById("addTestForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  wrap.querySelectorAll(".delete-test").forEach(b => b.addEventListener("click", () => {
    if (!confirm(t("confirm_delete_test"))) return;
    postAdminAction({ action: "deleteTest", rowNum: Number(b.dataset.row) });
  }));
}
document.getElementById("testSearchAdmin").addEventListener("input", e => renderTests(e.target.value));

document.getElementById("showAddTestBtn").addEventListener("click", () => {
  editingTestRowNum = null;
  document.getElementById("testCategory").value = "";
  document.getElementById("testName").value = "";
  document.getElementById("testMrp").value = "";
  document.getElementById("testPrice").value = "";
  document.getElementById("saveTestBtn").textContent = t("save_test");
  document.getElementById("addTestForm").hidden = false;
});
document.getElementById("cancelTestBtn").addEventListener("click", () => { document.getElementById("addTestForm").hidden = true; });

document.getElementById("saveTestBtn").addEventListener("click", () => {
  const category = document.getElementById("testCategory").value.trim();
  const name = document.getElementById("testName").value.trim();
  const mrp = document.getElementById("testMrp").value;
  const price = document.getElementById("testPrice").value;
  if (!category || !name || !mrp || !price) { showToast(t("fill_all_fields")); return; }
  const payload = editingTestRowNum
    ? { action: "updateTest", rowNum: editingTestRowNum, category, name, mrp, price }
    : { action: "addTest", category, name, mrp, price };
  postAdminAction(payload);
  document.getElementById("addTestForm").hidden = true;
});

function postAdminAction(extra) {
  fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "adminAction", ...extra }) })
    .then(() => { showToast(t("saved_refreshing")); setTimeout(loadData, 900); });
}

document.getElementById("patientSearchBtn").addEventListener("click", () => {
  const phone = document.getElementById("patientPhoneSearch").value.trim();
  const result = document.getElementById("patientResult");
  if (!/^[0-9]{10}$/.test(phone)) { result.innerHTML = `<p class="empty-msg">${t("invalid_phone")}</p>`; return; }
  const matches = ALL_DATA.bookings.filter(b => String(b.phone).trim() === phone);
  if (matches.length === 0) { result.innerHTML = `<p class="empty-msg">${t("no_prev_bookings")}</p>`; return; }
  result.innerHTML = `<p class="empty-msg">${matches.length} ${t("prev_bookings_found")}</p>` + matches.map(b => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(b.fullName)}</strong><span class="amount">₹${b.amount || 0}</span></div>
      <div class="booking-meta">${b.patientId ? `🆔 <strong>${escapeHtml(b.patientId)}</strong>` : ""}</div>
      <div class="booking-meta">📍 ${escapeHtml(b.address || "")}, ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
    </div>`).join("");
});

document.getElementById("adminLangSelect").value = currentLang;
loadData();
