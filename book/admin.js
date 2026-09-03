/* Kalyan Pathlab - Admin Panel (no login — keep this page's link private) */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9nlYZGUiPXz6-P7zrxsuJGJgLqLFIKcaVds8zYUQk3REKGVVPbi5z9vzkjnq7XullDQ/exec";

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
    .catch(() => showToast("नेटवर्क कमजोर दिसतंय — पुन्हा प्रयत्न करा."));
}

document.getElementById("refreshBtn").addEventListener("click", () => {
  showToast("Refreshing…");
  loadData();
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
    <div class="stat-box"><strong>${ALL_DATA.bookings.length}</strong><span>Total Bookings</span></div>
    <div class="stat-box"><strong>${todayCount}</strong><span>Today</span></div>
    <div class="stat-box"><strong>${ALL_DATA.reviews.length}</strong><span>Total Reviews</span></div>
    <div class="stat-box"><strong>${pendingReviews}</strong><span>Pending Reviews</span></div>`;
}

function renderBookings(filterText = "") {
  const wrap = document.getElementById("bookingList");
  const term = filterText.trim().toLowerCase();
  const rows = ALL_DATA.bookings.filter(b => !term || String(b.fullName).toLowerCase().includes(term) || String(b.phone).includes(term) || String(b.tests).toLowerCase().includes(term));
  if (rows.length === 0) { wrap.innerHTML = `<p class="empty-msg">No bookings found.</p>`; return; }
  wrap.innerHTML = rows.map(b => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(b.fullName)}</strong><span class="amount">₹${b.amount || 0}</span></div>
      <div class="booking-meta">📞 ${escapeHtml(String(b.phone))} · 📍 ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
      ${b.prescription ? `<a href="${b.prescription}" target="_blank" rel="noopener" class="link-btn">📎 View Prescription</a>` : ""}
    </div>`).join("");
}
document.getElementById("bookingSearch").addEventListener("input", e => renderBookings(e.target.value));

function renderReviews() {
  const wrap = document.getElementById("reviewList");
  const rows = ALL_DATA.reviews.filter(r => currentReviewFilter === "all" || r.status === currentReviewFilter);
  if (rows.length === 0) { wrap.innerHTML = `<p class="empty-msg">No reviews found.</p>`; return; }
  wrap.innerHTML = rows.map(r => `
    <div class="review-card-admin">
      <div class="booking-card-top"><strong>${escapeHtml(r.name)}</strong><span class="status-badge status-${String(r.status).toLowerCase()}">${escapeHtml(String(r.status))}</span></div>
      <div class="booking-meta">${"★".repeat(Number(r.rating) || 0)}${"☆".repeat(5 - (Number(r.rating) || 0))} · 📞 ${escapeHtml(String(r.phone || ""))}</div>
      <p class="review-feedback">"${escapeHtml(r.feedback)}"</p>
      <div class="review-actions">
        <button type="button" class="mini-btn approve" data-row="${r.rowNum}" data-act="approveReview">✓ Approve</button>
        <button type="button" class="mini-btn reject" data-row="${r.rowNum}" data-act="rejectReview">✕ Reject</button>
        <button type="button" class="mini-btn delete" data-row="${r.rowNum}" data-act="deleteReview">🗑 Delete</button>
      </div>
    </div>`).join("");
  wrap.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.act === "deleteReview" && !confirm("Delete this review permanently?")) return;
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
  const tests = (ALL_DATA.tests || []).filter(t => !term || String(t.name).toLowerCase().includes(term) || String(t.category).toLowerCase().includes(term));
  const categories = [...new Set((ALL_DATA.tests || []).map(t => t.category))];
  document.getElementById("categoryList").innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join("");
  if (tests.length === 0) { wrap.innerHTML = `<p class="empty-msg">No tests found. Tap "+ Add New Test" to create the price list.</p>`; return; }
  wrap.innerHTML = tests.map(t => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(t.name)}</strong><span class="amount">₹${t.price}</span></div>
      <div class="booking-meta">${escapeHtml(t.category)} · <s>₹${t.mrp}</s> MRP</div>
      <div class="review-actions">
        <button type="button" class="mini-btn approve edit-test" data-row="${t.rowNum}">✏️ Edit</button>
        <button type="button" class="mini-btn delete delete-test" data-row="${t.rowNum}">🗑 Delete</button>
      </div>
    </div>`).join("");
  wrap.querySelectorAll(".edit-test").forEach(b => b.addEventListener("click", () => {
    const t = ALL_DATA.tests.find(x => x.rowNum === Number(b.dataset.row));
    if (!t) return;
    editingTestRowNum = t.rowNum;
    document.getElementById("testCategory").value = t.category;
    document.getElementById("testName").value = t.name;
    document.getElementById("testMrp").value = t.mrp;
    document.getElementById("testPrice").value = t.price;
    document.getElementById("saveTestBtn").textContent = "Update Test";
    document.getElementById("addTestForm").hidden = false;
    document.getElementById("addTestForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  wrap.querySelectorAll(".delete-test").forEach(b => b.addEventListener("click", () => {
    if (!confirm("Delete this test permanently? This will remove it from the public app too.")) return;
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
  document.getElementById("saveTestBtn").textContent = "Save Test";
  document.getElementById("addTestForm").hidden = false;
});
document.getElementById("cancelTestBtn").addEventListener("click", () => { document.getElementById("addTestForm").hidden = true; });

document.getElementById("saveTestBtn").addEventListener("click", () => {
  const category = document.getElementById("testCategory").value.trim();
  const name = document.getElementById("testName").value.trim();
  const mrp = document.getElementById("testMrp").value;
  const price = document.getElementById("testPrice").value;
  if (!category || !name || !mrp || !price) { showToast("सगळे रकाने भरा (Category, Name, MRP, Price)."); return; }
  const payload = editingTestRowNum
    ? { action: "updateTest", rowNum: editingTestRowNum, category, name, mrp, price }
    : { action: "addTest", category, name, mrp, price };
  postAdminAction(payload);
  document.getElementById("addTestForm").hidden = true;
});

function postAdminAction(extra) {
  fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "adminAction", ...extra }) })
    .then(() => { showToast("Saved ✓ — refreshing…"); setTimeout(loadData, 900); });
}

document.getElementById("patientSearchBtn").addEventListener("click", () => {
  const phone = document.getElementById("patientPhoneSearch").value.trim();
  const result = document.getElementById("patientResult");
  if (!/^[0-9]{10}$/.test(phone)) { result.innerHTML = `<p class="empty-msg">Enter a valid 10-digit phone number.</p>`; return; }
  const matches = ALL_DATA.bookings.filter(b => String(b.phone).trim() === phone);
  if (matches.length === 0) { result.innerHTML = `<p class="empty-msg">No previous bookings found for this number.</p>`; return; }
  result.innerHTML = `<p class="empty-msg">${matches.length} previous booking(s) found:</p>` + matches.map(b => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(b.fullName)}</strong><span class="amount">₹${b.amount || 0}</span></div>
      <div class="booking-meta">📍 ${escapeHtml(b.address || "")}, ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
    </div>`).join("");
});

loadData();
