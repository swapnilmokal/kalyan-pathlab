/* =====================================================================
   Kalyan Pathlab - Admin Panel
   ⚠️ पासवर्ड इथे कुठेही लिहिलेला नाही — तो Apps Script च्या Script
   Properties मध्ये (ADMIN_PASSWORD) सुरक्षित ठेवलेला असतो, आणि तपासणी
   सर्व्हरवरच (Apps Script मध्ये) होते.
   ===================================================================== */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5NiqYnOITBj6jSsaK6HEwPetk-dh078Ufl6Yod-eEA2u5AW7Yq_ks-VTwqAJNxxBU/exec";

let ADMIN_PASSWORD_CACHE = ""; // फक्त याच सेशनसाठी मेमरीत ठेवतो (रिफ्रेश केल्यावर पुन्हा लॉगिन लागेल)
let ALL_DATA = { bookings: [], reviews: [] };
let currentReviewFilter = "all";

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Login ---------- */
document.getElementById("loginBtn").addEventListener("click", doLogin);
document.getElementById("passwordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

function doLogin() {
  const pw = document.getElementById("passwordInput").value;
  if (!pw) return;
  const btn = document.getElementById("loginBtn");
  btn.textContent = "Checking…";
  btn.disabled = true;

  fetch(`${APPS_SCRIPT_URL}?action=adminData&password=${encodeURIComponent(pw)}`)
    .then((res) => res.json())
    .then((data) => {
      btn.textContent = "Login";
      btn.disabled = false;
      if (data.error) {
        document.getElementById("loginError").textContent = "चुकीचा पासवर्ड — पुन्हा प्रयत्न करा.";
        document.getElementById("loginError").hidden = false;
        return;
      }
      if (!Array.isArray(data.bookings)) {
        // हे तेव्हा घडतं जेव्हा Apps Script मध्ये अजून जुनाच (Admin सपोर्ट
        // नसलेला) कोड डिप्लॉय आहे — नवीन कोड पेस्ट करून पुन्हा Deploy करा
        document.getElementById("loginError").textContent =
          "बॅकएंड अजून जुनं आहे असं दिसतंय — कृपया Apps Script मध्ये नवीन कोड पेस्ट करून पुन्हा Deploy (Manage deployments → New version) करा.";
        document.getElementById("loginError").hidden = false;
        return;
      }
      ADMIN_PASSWORD_CACHE = pw;
      ALL_DATA = data;
      document.getElementById("loginScreen").hidden = true;
      document.getElementById("dashboard").hidden = false;
      renderAll();
    })
    .catch(() => {
      btn.textContent = "Login";
      btn.disabled = false;
      showToast("Network error — try again.");
    });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  ADMIN_PASSWORD_CACHE = "";
  document.getElementById("dashboard").hidden = true;
  document.getElementById("loginScreen").hidden = false;
  document.getElementById("passwordInput").value = "";
});

document.getElementById("refreshBtn").addEventListener("click", () => {
  if (!ADMIN_PASSWORD_CACHE) return;
  fetch(`${APPS_SCRIPT_URL}?action=adminData&password=${encodeURIComponent(ADMIN_PASSWORD_CACHE)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) return;
      ALL_DATA = data;
      renderAll();
      showToast("Refreshed ✓");
    });
});

/* ---------- Tabs ---------- */
document.querySelectorAll(".admin-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    ["bookings", "reviews", "patients"].forEach((name) => {
      document.getElementById(`tab-${name}`).hidden = name !== btn.dataset.tab;
    });
  });
});

/* ---------- Render everything ---------- */
function renderAll() {
  document.getElementById("lastUpdated").textContent = "Updated " + new Date().toLocaleTimeString("en-IN");
  renderStats();
  renderBookings();
  renderReviews();
}

function renderStats() {
  const today = new Date().toLocaleDateString("en-IN");
  const todayCount = ALL_DATA.bookings.filter((b) => {
    const d = new Date(b.timestamp);
    return !isNaN(d) && d.toLocaleDateString("en-IN") === today;
  }).length;
  const pendingReviews = ALL_DATA.reviews.filter((r) => r.status === "Pending").length;

  document.getElementById("statRow").innerHTML = `
    <div class="stat-box"><strong>${ALL_DATA.bookings.length}</strong><span>Total Bookings</span></div>
    <div class="stat-box"><strong>${todayCount}</strong><span>Today</span></div>
    <div class="stat-box"><strong>${ALL_DATA.reviews.length}</strong><span>Total Reviews</span></div>
    <div class="stat-box"><strong>${pendingReviews}</strong><span>Pending Reviews</span></div>
  `;
}

function renderBookings(filterText = "") {
  const wrap = document.getElementById("bookingList");
  const term = filterText.trim().toLowerCase();
  const rows = ALL_DATA.bookings.filter(
    (b) =>
      !term ||
      String(b.fullName).toLowerCase().includes(term) ||
      String(b.phone).includes(term) ||
      String(b.tests).toLowerCase().includes(term)
  );

  if (rows.length === 0) {
    wrap.innerHTML = `<p class="empty-msg">No bookings found.</p>`;
    return;
  }

  wrap.innerHTML = rows
    .map(
      (b) => `
    <div class="booking-card">
      <div class="booking-card-top">
        <strong>${escapeHtml(b.fullName)}</strong>
        <span class="amount">₹${b.amount || 0}</span>
      </div>
      <div class="booking-meta">📞 ${escapeHtml(String(b.phone))} · 📍 ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
      ${b.prescription ? `<a href="${b.prescription}" target="_blank" rel="noopener" class="link-btn">📎 View Prescription</a>` : ""}
    </div>`
    )
    .join("");
}
document.getElementById("bookingSearch").addEventListener("input", (e) => renderBookings(e.target.value));

function renderReviews() {
  const wrap = document.getElementById("reviewList");
  const rows = ALL_DATA.reviews.filter((r) => currentReviewFilter === "all" || r.status === currentReviewFilter);

  if (rows.length === 0) {
    wrap.innerHTML = `<p class="empty-msg">No reviews found.</p>`;
    return;
  }

  wrap.innerHTML = rows
    .map(
      (r) => `
    <div class="review-card-admin">
      <div class="booking-card-top">
        <strong>${escapeHtml(r.name)}</strong>
        <span class="status-badge status-${String(r.status).toLowerCase()}">${escapeHtml(String(r.status))}</span>
      </div>
      <div class="booking-meta">${"★".repeat(Number(r.rating) || 0)}${"☆".repeat(5 - (Number(r.rating) || 0))} · 📞 ${escapeHtml(String(r.phone || ""))}</div>
      <p class="review-feedback">"${escapeHtml(r.feedback)}"</p>
      <div class="review-actions">
        <button type="button" class="mini-btn approve" data-row="${r.rowNum}">✓ Approve</button>
        <button type="button" class="mini-btn reject" data-row="${r.rowNum}">✕ Reject</button>
        <button type="button" class="mini-btn delete" data-row="${r.rowNum}">🗑 Delete</button>
      </div>
    </div>`
    )
    .join("");

  wrap.querySelectorAll(".approve").forEach((b) => b.addEventListener("click", () => reviewAction(b.dataset.row, "approveReview")));
  wrap.querySelectorAll(".reject").forEach((b) => b.addEventListener("click", () => reviewAction(b.dataset.row, "rejectReview")));
  wrap.querySelectorAll(".delete").forEach((b) => b.addEventListener("click", () => {
    if (confirm("Delete this review permanently?")) reviewAction(b.dataset.row, "deleteReview");
  }));
}

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    currentReviewFilter = chip.dataset.status;
    renderReviews();
  });
});

function reviewAction(rowNum, action) {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ type: "adminAction", action, rowNum: Number(rowNum), password: ADMIN_PASSWORD_CACHE })
  }).then(() => {
    showToast("Done ✓ — refreshing…");
    setTimeout(() => document.getElementById("refreshBtn").click(), 900);
  });
}

/* ---------- Find patient ---------- */
document.getElementById("patientSearchBtn").addEventListener("click", () => {
  const phone = document.getElementById("patientPhoneSearch").value.trim();
  const result = document.getElementById("patientResult");
  if (!/^[0-9]{10}$/.test(phone)) {
    result.innerHTML = `<p class="empty-msg">Enter a valid 10-digit phone number.</p>`;
    return;
  }
  const matches = ALL_DATA.bookings.filter((b) => String(b.phone).trim() === phone);
  if (matches.length === 0) {
    result.innerHTML = `<p class="empty-msg">No previous bookings found for this number.</p>`;
    return;
  }
  result.innerHTML =
    `<p class="empty-msg">${matches.length} previous booking(s) found:</p>` +
    matches
      .map(
        (b) => `
      <div class="booking-card">
        <div class="booking-card-top"><strong>${escapeHtml(b.fullName)}</strong><span class="amount">₹${b.amount || 0}</span></div>
        <div class="booking-meta">📍 ${escapeHtml(b.address || "")}, ${escapeHtml(b.city || "")}</div>
        <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
        <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} · 🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
      </div>`
      )
      .join("");
});

function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
