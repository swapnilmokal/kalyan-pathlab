/* =====================================================================
   Kalyan Pathlab - App Logic
   खाली दिलेला CONFIG बदलून तुम्ही नंबर/ईमेल/बॅकएंड लिंक अपडेट करू शकता.
   ===================================================================== */
const CONFIG = {
  labWhatsApp: "919870020674",          // बुकिंग/रिपोर्ट साठी लॅबचा WhatsApp नंबर
  labEmail: "kalyan.pathlab.21@gmail.com",
  // खाली Google Apps Script Web App डिप्लॉय केल्यावर मिळणारी लिंक टाका (README.md पहा)
  appsScriptUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  cities: ["कल्याण", "डोंबिवली", "अंबरनाथ", "बदलापूर", "उल्हासनगर", "ठाणे", "मुंबई", "नवी मुंबई"]
};

const DEFAULT_REVIEWS = [
  { name: "Purushottam", rating: 5, feedback: "Technicians are very experienced and professional. Blood test rates also very impressive.", test: "" },
  { name: "Megha", rating: 5, feedback: "Blood test reports were available at a very low cost compared to other labs.", test: "" },
  { name: "Tushar Kamble", rating: 5, feedback: "The report is very professional and the technicians are also very supportive.", test: "" },
  { name: "Reshma Patil", rating: 5, feedback: "सगळ्या टेस्ट खूप कमी पैशात झाल्या. Thanks.", test: "" }
];

let selectedTests = []; // {name, price}

/* ---------- Register service worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

/* ---------- Cities ---------- */
function renderCities() {
  const chips = document.getElementById("cityChips");
  chips.innerHTML = CONFIG.cities.map((c) => `<span>${c}</span>`).join("");
  const select = document.getElementById("city");
  select.innerHTML =
    `<option value="">शहर निवडा</option>` +
    CONFIG.cities.map((c) => `<option value="${c}">${c}</option>`).join("");
}

/* ---------- Test list ---------- */
function renderCategoryTabs() {
  const wrap = document.getElementById("categoryTabs");
  wrap.innerHTML =
    `<button data-cat="all" class="active">सर्व</button>` +
    TEST_CATEGORIES.map((c) => `<button data-cat="${c.id}">${c.name}</button>`).join("");
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    wrap.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTestList(document.getElementById("testSearch").value, btn.dataset.cat);
  });
}

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
    html += `<div class="test-category-title">${cat.name}</div>`;
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
}

function renderSelected() {
  const box = document.getElementById("selectedTestsList");
  if (selectedTests.length === 0) {
    box.innerHTML = "कोणतीही टेस्ट निवडलेली नाही — वरील यादीतून निवडा किंवा खाली टाईप करा.";
    return;
  }
  box.innerHTML = selectedTests
    .map(
      (s, i) =>
        `<span>${s.name} · ₹${s.price} <button type="button" data-i="${i}" aria-label="काढा">✕</button></span>`
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
  summary.textContent = `${selectedTests.length} टेस्ट निवडल्या · अंदाजे ₹${total}`;
}

/* ---------- Search ---------- */
document.getElementById("testSearch").addEventListener("input", (e) => {
  const activeCat = document.querySelector(".category-tabs button.active")?.dataset.cat || "all";
  renderTestList(e.target.value, activeCat);
});

/* ---------- Report mode -> show email field ---------- */
document.querySelectorAll('input[name="reportMode"]').forEach((r) => {
  r.addEventListener("change", (e) => {
    document.getElementById("emailFieldWrap").hidden = e.target.value !== "Email";
  });
});

/* ---------- Geolocation ---------- */
let capturedLocation = "";
document.getElementById("getLocationBtn").addEventListener("click", () => {
  const status = document.getElementById("locationStatus");
  if (!navigator.geolocation) {
    status.textContent = "या ब्राउझरमध्ये लोकेशन सपोर्ट नाही.";
    return;
  }
  status.textContent = "लोकेशन शोधत आहे…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      capturedLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;
      status.textContent = "✓ लोकेशन जोडले";
    },
    () => {
      status.textContent = "लोकेशन मिळाले नाही — परवानगी द्या किंवा नंतर प्रयत्न करा.";
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

/* ---------- Send data to Google Apps Script backend (Sheet + auto email) ---------- */
function sendToBackend(payload) {
  if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.startsWith("PASTE_")) return;
  fetch(CONFIG.appsScriptUrl, {
    method: "POST",
    mode: "no-cors", // Apps Script सह साधा वापर; प्रतिसाद वाचता येणार नाही पण डेटा जातो
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

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
  const reportMode = document.querySelector('input[name="reportMode"]:checked').value;
  const email = document.getElementById("email").value.trim();

  if (selectedTests.length === 0 && !manualTest) {
    showToast("कृपया किमान एक टेस्ट निवडा किंवा नाव टाईप करा.");
    return;
  }
  if (!city) {
    showToast("कृपया शहर निवडा.");
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
    doctor, date, time, reportMode, email,
    tests: testNames.join(", "),
    estimatedTotal: total
  };

  sendToBackend(payload);

  // WhatsApp confirmation message (customer taps Send once — lab receives it instantly)
  const waMsg =
    `*नवीन बुकिंग - Kalyan Pathlab*%0A` +
    `नाव: ${fullName}%0A` +
    `मोबाईल: ${phone}%0A` +
    `पत्ता: ${address}, ${city}%0A` +
    `टेस्ट: ${testNames.join(", ") || "-"}%0A` +
    `अंदाजे रक्कम: ₹${total}%0A` +
    `दिवस/वेळ: ${date} ${time}%0A` +
    `डॉक्टर रेफरन्स: ${doctor}%0A` +
    `रिपोर्ट: ${reportMode}` +
    (capturedLocation ? `%0Aलोकेशन: ${capturedLocation}` : "");

  const waLink = `https://wa.me/${CONFIG.labWhatsApp}?text=${waMsg}`;

  const box = document.getElementById("confirmBox");
  box.hidden = false;
  box.innerHTML = `
    <strong>✅ बुकिंगची माहिती तयार झाली!</strong>
    <p>खालील बटणावर क्लिक करून WhatsApp मध्ये फक्त "Send" दाबा — म्हणजे तुमची बुकिंग लगेच आमच्यापर्यंत पोहोचेल.</p>
    <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">WhatsApp वर बुकिंग पाठवा</a>
    <p style="margin-top:10px;">किंवा थेट कॉल करा: <a href="tel:+919870020674">98700 20674</a></p>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "center" });

  window.open(waLink, "_blank");

  e.target.reset();
  selectedTests = [];
  renderSelected();
  updateCartBar();
  showToast("बुकिंग माहिती तयार झाली ✓");
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
  document.getElementById("reviewCount").textContent = `(${list.length} रिव्ह्यू)`;
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

/* ---------- Review modal open/close ---------- */
const reviewModal = document.getElementById("reviewModalOverlay");
document.getElementById("openReviewModal").addEventListener("click", () => {
  reviewModal.hidden = false;
  document.getElementById("reviewThanks").hidden = true;
  document.getElementById("reviewForm").hidden = false;
});
document.getElementById("closeReviewModal").addEventListener("click", () => (reviewModal.hidden = true));
reviewModal.addEventListener("click", (e) => {
  if (e.target === reviewModal) reviewModal.hidden = true;
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
    showToast("कृपया स्टार रेटिंग द्या.");
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
  thanks.innerHTML = `<strong>धन्यवाद, ${escapeHtml(name)}! 🙏</strong><p>तुमचा रिव्ह्यू आमच्या टीमकडून तपासल्यानंतर पेजवर दिसेल.</p>`;

  e.target.reset();
  currentRating = 0;
  starPicker.querySelectorAll("button").forEach((b) => b.classList.remove("on"));

  setTimeout(() => (reviewModal.hidden = true), 2200);
});

/* ---------- Init ---------- */
renderCities();
renderCategoryTabs();
renderTestList();
renderSelected();
