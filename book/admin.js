/* Kalyan Pathlab - Admin Panel (no login — keep this page's link private) */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLz9yim3gKfD98p574l1kB8yENS1cJgspb5Ewt6HYRM-XetF4awiaGya5diEAE1Na81A/exec";
const CUSTOMER_APP_URL = "https://swapnilmokal.github.io/kalyan-pathlab/book/";
const LAB_WHATSAPP = "919870020674";
const LAB_EMAIL = "kalyan.pathlab.21@gmail.com";

const TRANSLATIONS = {
  tab_bookings: { en: "📅 Bookings", mr: "📅 बुकिंग्ज", hi: "📅 बुकिंग" },
  tab_reviews: { en: "⭐ Reviews", mr: "⭐ रिव्ह्यूज", hi: "⭐ रिव्यू" },
  tab_tests: { en: "🧪 Tests", mr: "🧪 टेस्ट", hi: "🧪 टेस्ट" },
  tab_patients: { en: "🔍 Find Patient", mr: "🔍 पेशंट शोधा", hi: "🔍 मरीज़ खोजें" },
  tab_settings: { en: "⚙️ Settings", mr: "⚙️ सेटिंग्ज", hi: "⚙️ सेटिंग्स" },
  search_bookings: { en: "Search by name, phone, or test…", mr: "नाव, फोन किंवा टेस्टने शोधा…", hi: "नाम, फोन या टेस्ट से खोजें…" },
  filter_all: { en: "All", mr: "सर्व", hi: "सभी" },
  filter_pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },
  filter_approved: { en: "Approved", mr: "मंजूर", hi: "स्वीकृत" },
  filter_rejected: { en: "Rejected", mr: "नाकारलेले", hi: "अस्वीकृत" },
  status_pending: { en: "Pending", mr: "प्रलंबित", hi: "लंबित" },
  status_confirmed: { en: "Confirmed", mr: "कन्फर्म", hi: "पुष्टि" },
  status_completed: { en: "Completed", mr: "पूर्ण", hi: "पूर्ण" },
  status_cancelled: { en: "Cancelled", mr: "रद्द", hi: "रद्द" },
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
  view_report: { en: "📄 View Report", mr: "📄 रिपोर्ट पहा", hi: "📄 रिपोर्ट देखें" },
  upload_report: { en: "📤 Upload Report", mr: "📤 रिपोर्ट अपलोड करा", hi: "📤 रिपोर्ट अपलोड करें" },
  btn_confirm_booking: { en: "✓ Confirm Booking", mr: "✓ बुकिंग कन्फर्म करा", hi: "✓ बुकिंग पुष्टि करें" },
  btn_mark_completed: { en: "✔ Mark Completed", mr: "✔ पूर्ण झाली म्हणून चिन्हांकित करा", hi: "✔ पूर्ण के रूप में चिह्नित करें" },
  btn_cancel_booking: { en: "✕ Cancel Booking", mr: "✕ बुकिंग रद्द करा", hi: "✕ बुकिंग रद्द करें" },
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
  share_customer_text: { en: "Book your blood test at Kalyan Pathlab — 30% to 70% off, free home sample collection!", mr: "Kalyan Pathlab वर टेस्ट बुक करा — 30% ते 70% सवलत, मोफत होम सॅम्पल कलेक्शन!", hi: "Kalyan Pathlab पर टेस्ट बुक करें — 30% से 70% छूट, मुफ्त होम सैंपल कलेक्शन!" },
  settings_links_heading: { en: "Quick Access", mr: "जलद प्रवेश", hi: "त्वरित पहुंच" },
  open_sheet: { en: "📊 Open Google Sheet (View/Edit All Data)", mr: "📊 Google Sheet उघडा (सगळा डेटा पहा/बदला)", hi: "📊 Google Sheet खोलें (सारा डेटा देखें/बदलें)" },
  open_drive: { en: "📁 Open Reports Folder (Google Drive)", mr: "📁 Reports फोल्डर उघडा (Google Drive)", hi: "📁 Reports फोल्डर खोलें (Google Drive)" },
  open_customer_app: { en: "🌐 Open Customer App", mr: "🌐 Customer अ‍ॅप उघडा", hi: "🌐 Customer ऐप खोलें" },
  settings_upi_heading: { en: "UPI Payment Settings", mr: "UPI पेमेंट सेटिंग्ज", hi: "UPI भुगतान सेटिंग्स" },
  settings_upi_sub: { en: "Update the UPI ID and QR code shown to customers at booking time.", mr: "बुकिंगच्या वेळी ग्राहकांना दिसणारा UPI ID व QR कोड बदला.", hi: "बुकिंग के समय ग्राहकों को दिखने वाला UPI ID और QR कोड बदलें।" },
  ph_upi_id: { en: "UPI ID", mr: "UPI ID", hi: "UPI ID" },
  settings_qr_upload: { en: "Upload New QR Code (optional)", mr: "नवीन QR कोड अपलोड करा (ऐच्छिक)", hi: "नया QR कोड अपलोड करें (वैकल्पिक)" },
  save_settings: { en: "Save Settings", mr: "सेटिंग्ज सेव्ह करा", hi: "सेटिंग्स सेव करें" },
  settings_saved: { en: "Settings saved ✓", mr: "सेटिंग्ज सेव्ह झाल्या ✓", hi: "सेटिंग्स सेव हो गईं ✓" },
  report_upload_done: { en: "Report uploaded ✓", mr: "रिपोर्ट अपलोड झाली ✓", hi: "रिपोर्ट अपलोड हो गई ✓" },
  pay: { en: "Payment", mr: "पेमेंट", hi: "भुगतान" },

  /* ---------- Billing (Business App merge) ---------- */
  tab_billing: { en: "🧾 Billing", mr: "🧾 बिलिंग", hi: "🧾 बिलिंग" },
  billing_tab_dashboard: { en: "🏠 Dashboard", mr: "🏠 डॅशबोर्ड", hi: "🏠 डैशबोर्ड" },
  billing_tab_bills: { en: "📄 Bills", mr: "📄 बिल्स", hi: "📄 बिल्स" },
  billing_tab_profit: { en: "📊 Profit", mr: "📊 प्रॉफिट", hi: "📊 प्रॉफिट" },
  billing_monthly_summary: { en: "Monthly Summary", mr: "मासिक सारांश", hi: "मासिक सारांश" },
  add_new_bill: { en: "+ New Bill", mr: "+ नवीन बिल", hi: "+ नया बिल" },
  ph_bill_no: { en: "Bill No.", mr: "बिल क्र.", hi: "बिल नं." },
  ph_patient_name: { en: "Patient Name *", mr: "पेशंटचं नाव *", hi: "मरीज़ का नाम *" },
  ph_add_test: { en: "Type test name to add…", mr: "टेस्टचं नाव टाइप करा…", hi: "टेस्ट का नाम टाइप करें…" },
  ph_b2b: { en: "B2B ₹ (your cost — not shown to customers)", mr: "B2B ₹ (तुमचा खर्च — कस्टमरला दिसत नाही)", hi: "B2B ₹ (आपकी लागत — ग्राहक को नहीं दिखती)" },
  no_tests_in_bill: { en: "No tests added yet. Search and add tests above — add as many as you like, one after another.", mr: "अजून टेस्ट जोडलेली नाही. वरती शोधून टेस्ट जोडा — हव्या तितक्या एकामागून एक जोडू शकता.", hi: "अभी कोई टेस्ट नहीं जोड़ी। ऊपर खोजकर टेस्ट जोड़ें — जितनी चाहें उतनी जोड़ सकते हैं।" },
  final_profit_label: { en: "Final Profit = Total B2C − Total B2B − Collection − Report", mr: "फायनल प्रॉफिट = Total B2C − Total B2B − Collection − Report", hi: "फाइनल प्रॉफिट = Total B2C − Total B2B − Collection − Report" },
  save_bill: { en: "Save Bill", mr: "बिल सेव्ह करा", hi: "बिल सेव करें" },
  update_bill_btn: { en: "Update Bill", mr: "बिल अपडेट करा", hi: "बिल अपडेट करें" },
  search_bills: { en: "Search by patient or bill no…", mr: "पेशंट किंवा बिल क्रमांकाने शोधा…", hi: "मरीज़ या बिल नंबर से खोजें…" },
  p_today: { en: "Today", mr: "आज", hi: "आज" },
  p_month: { en: "This Month", mr: "हा महिना", hi: "इस महीने" },
  p_all: { en: "All Time", mr: "सर्व वेळ", hi: "सभी समय" },
  p_custom: { en: "Custom", mr: "कस्टम", hi: "कस्टम" },
  formula_heading: { en: "Calculation Formula", mr: "कॅल्क्युलेशन फॉर्म्युला", hi: "गणना फॉर्मूला" },
  formula_text: { en: "Discount = Total MRP − Total B2C · Profit = Total B2C − Total B2B − Collection − Report Charges (per test line, then summed for the bill).", mr: "Discount = Total MRP − Total B2C · Profit = Total B2C − Total B2B − Collection − Report Charges (प्रत्येक टेस्टसाठी, मग बिलासाठी बेरीज).", hi: "Discount = Total MRP − Total B2C · Profit = Total B2C − Total B2B − Collection − Report Charges (हर टेस्ट के लिए, फिर बिल के लिए जोड़)." },
  billing_breakdown: { en: "Breakdown", mr: "तपशील", hi: "विवरण" },
  net_profit_label: { en: "Net Profit", mr: "निव्वळ प्रॉफिट", hi: "शुद्ध प्रॉफिट" },
  stat_today_bills: { en: "Today's Bills", mr: "आजची बिल्स", hi: "आज के बिल" },
  stat_today_b2c: { en: "Today's B2C", mr: "आजचा B2C", hi: "आज का B2C" },
  stat_today_b2b: { en: "Today's B2B", mr: "आजचा B2B", hi: "आज का B2B" },
  stat_today_profit: { en: "Today's Profit", mr: "आजचा प्रॉफिट", hi: "आज का प्रॉफिट" },
  col_bills: { en: "Bills", mr: "बिल्स", hi: "बिल" },
  col_mrp: { en: "Total MRP", mr: "एकूण MRP", hi: "कुल MRP" },
  col_b2c_collection: { en: "Total B2C Collection", mr: "एकूण B2C कलेक्शन", hi: "कुल B2C कलेक्शन" },
  col_b2b_cost: { en: "Total B2B Cost", mr: "एकूण B2B खर्च", hi: "कुल B2B लागत" },
  col_collection_charges: { en: "Collection Charges", mr: "कलेक्शन चार्जेस", hi: "कलेक्शन चार्जेस" },
  col_report_charges: { en: "Report Charges", mr: "रिपोर्ट चार्जेस", hi: "रिपोर्ट चार्जेस" },
  col_monthly_profit: { en: "Monthly Profit", mr: "मासिक प्रॉफिट", hi: "मासिक प्रॉफिट" },
  col_discount: { en: "Total Discount", mr: "एकूण डिस्काउंट", hi: "कुल डिस्काउंट" },
  no_bills: { en: "No bills found.", mr: "कुठलंही बिल सापडलं नाही.", hi: "कोई बिल नहीं मिला।" },
  confirm_delete_bill: { en: "Delete this bill permanently?", mr: "हे बिल कायमचं डिलीट करायचं?", hi: "यह बिल हमेशा के लिए डिलीट करें?" },
  test_already_in_bill: { en: "This test is already added to the bill.", mr: "ही टेस्ट आधीच बिलात जोडली आहे.", hi: "यह टेस्ट पहले से बिल में जुड़ी है।" },
  fill_patient_name: { en: "Patient Name is required.", mr: "पेशंटचं नाव भरणं आवश्यक आहे.", hi: "मरीज़ का नाम भरना ज़रूरी है।" },
  add_atleast_one_test: { en: "Add at least one test.", mr: "किमान एक टेस्ट जोडा.", hi: "कम से कम एक टेस्ट जोड़ें।" },
  bill_saved: { en: "Bill saved ✓", mr: "बिल सेव्ह झालं ✓", hi: "बिल सेव हुआ ✓" },
  bill_updated: { en: "Bill updated ✓", mr: "बिल अपडेट झालं ✓", hi: "बिल अपडेट हुआ ✓" },
  whatsapp_share: { en: "WhatsApp", mr: "WhatsApp", hi: "WhatsApp" },
  email_share: { en: "Email", mr: "Email", hi: "Email" },
  edit_bill_btn: { en: "✏️ Edit", mr: "✏️ एडिट करा", hi: "✏️ एडिट करें" },

  /* ---------- PIN Lock ---------- */
  pin_enter: { en: "Enter PIN to continue", mr: "पुढे जाण्यासाठी PIN टाका", hi: "आगे बढ़ने के लिए PIN डालें" },
  pin_unlock: { en: "Unlock", mr: "अनलॉक करा", hi: "अनलॉक करें" },
  pin_wrong: { en: "Wrong PIN, try again.", mr: "चुकीचा PIN, परत प्रयत्न करा.", hi: "गलत PIN, फिर कोशिश करें।" },
  pin_security_heading: { en: "Admin PIN (App Lock)", mr: "Admin PIN (App Lock)", hi: "Admin PIN (App Lock)" },
  pin_security_sub: { en: "Change the PIN needed to open this admin panel. Keep it safe — anyone with this PIN can view and edit bookings, tests and bills.", mr: "हा admin panel उघडण्यासाठी लागणारा PIN बदला. तो सुरक्षित ठेवा — हा PIN असलेली कुणीही व्यक्ती bookings, tests आणि bills बघू/बदलू शकते.", hi: "इस admin panel को खोलने वाला PIN बदलें। इसे सुरक्षित रखें — यह PIN रखने वाला कोई भी bookings, tests और bills देख/बदल सकता है।" },
  pin_new_ph: { en: "New PIN (4–6 digits)", mr: "नवीन PIN (4–6 अंकी)", hi: "नया PIN (4–6 अंक)" },
  pin_confirm_ph: { en: "Confirm New PIN", mr: "नवीन PIN पुन्हा टाका", hi: "नया PIN फिर से डालें" },
  pin_change_btn: { en: "Change PIN", mr: "PIN बदला", hi: "PIN बदलें" },
  pin_lock_now: { en: "🔒 Lock Now", mr: "🔒 आत्ताच लॉक करा", hi: "🔒 अभी लॉक करें" },
  pin_invalid: { en: "PIN must be 4–6 digits.", mr: "PIN 4 ते 6 अंकी असावा.", hi: "PIN 4 से 6 अंकों का होना चाहिए।" },
  pin_mismatch: { en: "Both PINs don't match.", mr: "दोन्ही PIN जुळत नाहीत.", hi: "दोनों PIN मेल नहीं खाते।" },
  pin_changed: { en: "PIN changed ✓", mr: "PIN बदलला ✓", hi: "PIN बदल गया ✓" },

  /* ---------- Patient list ---------- */
  patients_found: { en: "patient(s) found", mr: "पेशंट सापडले", hi: "मरीज़ मिले" },
  total_visits: { en: "Visits", mr: "भेटी", hi: "विज़िट" },
  total_paid: { en: "Total Paid", mr: "एकूण पेमेंट", hi: "कुल भुगतान" },
  view_history_btn: { en: "📜 View History", mr: "📜 History बघा", hi: "📜 History देखें" }
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

let ALL_DATA = { bookings: [], reviews: [], tests: [], bills: [], patientProfiles: [], settings: {} };
let currentReviewFilter = "all";
let currentBookingFilter = "all";
let editingTestRowNum = null;
let currentBillingSubtab = "dashboard";
let currentProfitTab = "today";
let currentBillTests = [];
let editingBillRowNum = null;
let editingBillNo = null;

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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

document.getElementById("notifBellBtn").addEventListener("click", () => {
  document.querySelector('.admin-tab[data-tab="bookings"]').click();
});

[document.getElementById("shareCustomerLinkBtn")].forEach(btn => btn.addEventListener("click", shareCustomerLink));
async function shareCustomerLink() {
  const shareData = { title: t("share_customer_title"), text: t("share_customer_text"), url: CUSTOMER_APP_URL };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (err) {}
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + "\n" + shareData.url)}`, "_blank");
  }
}

document.querySelectorAll(".admin-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    ["bookings", "reviews", "tests", "patients", "settings", "billing"].forEach(name => {
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
  renderSettingsLinks();
  renderBillingDashboard();
  renderBillsList();
  renderProfitAnalysis();
  renderPatients();
}

function renderStats() {
  const today = new Date().toLocaleDateString("en-IN");
  const todayCount = ALL_DATA.bookings.filter(b => { const d = new Date(b.timestamp); return !isNaN(d) && d.toLocaleDateString("en-IN") === today; }).length;
  const pendingReviews = ALL_DATA.reviews.filter(r => r.status === "Pending").length;
  const pendingBookings = ALL_DATA.bookings.filter(b => b.status === "Pending Confirmation").length;
  document.getElementById("statRow").innerHTML = `
    <div class="stat-box"><strong>${ALL_DATA.bookings.length}</strong><span>${t("stat_total_bookings")}</span></div>
    <div class="stat-box"><strong>${todayCount}</strong><span>${t("stat_today")}</span></div>
    <div class="stat-box"><strong>${ALL_DATA.reviews.length}</strong><span>${t("stat_total_reviews")}</span></div>
    <div class="stat-box"><strong>${pendingReviews}</strong><span>${t("stat_pending_reviews")}</span></div>`;
  const totalNotif = pendingBookings + pendingReviews;
  const badge = document.getElementById("notifCount");
  if (totalNotif > 0) { badge.hidden = false; badge.textContent = totalNotif > 99 ? "99+" : totalNotif; }
  else badge.hidden = true;
}

const STATUS_CLASS = { "Pending Confirmation": "pending", "Confirmed": "approved", "Completed": "completed", "Cancelled": "rejected" };

function renderBookings(filterText = "") {
  const wrap = document.getElementById("bookingList");
  const term = filterText.trim().toLowerCase();
  const rows = ALL_DATA.bookings.filter(b =>
    (currentBookingFilter === "all" || b.status === currentBookingFilter) &&
    (!term || String(b.fullName).toLowerCase().includes(term) || String(b.phone).includes(term) || String(b.tests).toLowerCase().includes(term))
  );
  if (rows.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_bookings")}</p>`; return; }
  wrap.innerHTML = rows.map(b => {
    const statusCls = STATUS_CLASS[b.status] || "pending";
    return `
    <div class="booking-card">
      <div class="booking-card-top">
        <strong>${escapeHtml(b.fullName)}</strong>
        <span class="status-badge status-${statusCls}">${escapeHtml(b.status)}</span>
      </div>
      <div class="booking-meta">${b.patientId ? `🆔 <strong>${escapeHtml(b.patientId)}</strong> · ` : ""}📞 ${escapeHtml(String(b.phone))} · 📍 ${escapeHtml(b.city || "")}</div>
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")} · ₹${b.amount || 0}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} ${escapeHtml(String(b.time || ""))} · 💳 ${escapeHtml(b.paymentMethod || "-")}</div>
      <div class="booking-meta">🕒 ${escapeHtml(String(b.timestamp || ""))}</div>
      <div class="booking-links">
        ${b.prescription ? `<a href="${b.prescription}" target="_blank" rel="noopener" class="link-btn">${t("view_prescription")}</a>` : ""}
        ${b.reportLink ? `<a href="${b.reportLink}" target="_blank" rel="noopener" class="link-btn">${t("view_report")}</a>` : ""}
      </div>
      <div class="review-actions">
        ${b.status === "Pending Confirmation" ? `<button type="button" class="mini-btn approve" data-row="${b.rowNum}" data-bstatus="Confirmed">${t("btn_confirm_booking")}</button>` : ""}
        ${b.status !== "Completed" && b.status !== "Cancelled" ? `<button type="button" class="mini-btn approve" data-row="${b.rowNum}" data-bstatus="Completed">${t("btn_mark_completed")}</button>` : ""}
        ${b.status !== "Cancelled" && b.status !== "Completed" ? `<button type="button" class="mini-btn reject" data-row="${b.rowNum}" data-bstatus="Cancelled">${t("btn_cancel_booking")}</button>` : ""}
      </div>
      <label class="report-upload-row">
        <span class="mini-btn approve">${t("upload_report")}</span>
        <input type="file" accept="image/*,.pdf" class="report-upload-input" data-row="${b.rowNum}" hidden />
      </label>
    </div>`;
  }).join("");

  wrap.querySelectorAll("[data-bstatus]").forEach(b => b.addEventListener("click", () => {
    postAdminAction({ action: "updateBookingStatus", rowNum: Number(b.dataset.row), status: b.dataset.bstatus });
  }));
  wrap.querySelectorAll(".report-upload-input").forEach(input => input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file) return;
    showToast(t("refreshing"));
    const base64 = await fileToBase64(file);
    postAdminAction({ action: "uploadReport", rowNum: Number(input.dataset.row), reportBase64: base64, reportName: file.name, reportType: file.type }, t("report_upload_done"));
  }));
}
document.getElementById("bookingSearch").addEventListener("input", e => renderBookings(e.target.value));
document.querySelectorAll('#tab-bookings .filter-chip').forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll('#tab-bookings .filter-chip').forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentBookingFilter = chip.dataset.bstatus;
  renderBookings(document.getElementById("bookingSearch").value);
}));

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
document.querySelectorAll('#tab-reviews .filter-chip').forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll('#tab-reviews .filter-chip').forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentReviewFilter = chip.dataset.status;
  renderReviews();
}));

function renderTests(filterText = "") {
  const wrap = document.getElementById("testListAdmin");
  const term = filterText.trim().toLowerCase();
  let tests = (ALL_DATA.tests || []).filter(x => !term || String(x.name).toLowerCase().includes(term) || String(x.category).toLowerCase().includes(term));
  const categories = [...new Set((ALL_DATA.tests || []).map(x => x.category))];
  document.getElementById("categoryList").innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join("");
  if (tests.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_tests")}</p>`; return; }
  /* group by category, categories sorted alphabetically, tests within a category sorted alphabetically */
  tests = tests.slice().sort((a, b) => {
    const c = String(a.category || "").localeCompare(String(b.category || ""));
    return c !== 0 ? c : String(a.name || "").localeCompare(String(b.name || ""));
  });
  let html = "";
  let lastCategory = null;
  tests.forEach(x => {
    if (x.category !== lastCategory) {
      html += `<div class="cat-group-header">${escapeHtml(x.category)}</div>`;
      lastCategory = x.category;
    }
    const v = testVisual(x.category, x.name);
    html += `
    <div class="booking-card">
      <div class="booking-card-top"><span class="cat-badge" style="background:${v.bg};color:${v.fg}">${TEST_ICONS[v.icon]}</span><strong>${escapeHtml(x.name)}</strong><span class="amount">₹${x.price}</span></div>
      <div class="booking-meta">${escapeHtml(x.category)} · <s>₹${x.mrp}</s> MRP · B2B ₹${x.b2b || 0}</div>
      <div class="review-actions">
        <button type="button" class="mini-btn approve edit-test" data-row="${x.rowNum}">${t("btn_edit")}</button>
        <button type="button" class="mini-btn delete delete-test" data-row="${x.rowNum}">${t("btn_delete")}</button>
      </div>
    </div>`;
  });
  wrap.innerHTML = html;
  wrap.querySelectorAll(".edit-test").forEach(b => b.addEventListener("click", () => {
    const x = ALL_DATA.tests.find(y => y.rowNum === Number(b.dataset.row));
    if (!x) return;
    editingTestRowNum = x.rowNum;
    document.getElementById("testCategory").value = x.category;
    document.getElementById("testName").value = x.name;
    document.getElementById("testMrp").value = x.mrp;
    document.getElementById("testPrice").value = x.price;
    document.getElementById("testB2B").value = x.b2b || 0;
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
  document.getElementById("testB2B").value = "";
  document.getElementById("saveTestBtn").textContent = t("save_test");
  document.getElementById("addTestForm").hidden = false;
});
document.getElementById("cancelTestBtn").addEventListener("click", () => { document.getElementById("addTestForm").hidden = true; });

document.getElementById("saveTestBtn").addEventListener("click", () => {
  const category = document.getElementById("testCategory").value.trim();
  const name = document.getElementById("testName").value.trim();
  const mrp = document.getElementById("testMrp").value;
  const price = document.getElementById("testPrice").value;
  const b2b = document.getElementById("testB2B").value || 0;
  if (!category || !name || !mrp || !price) { showToast(t("fill_all_fields")); return; }
  const payload = editingTestRowNum
    ? { action: "updateTest", rowNum: editingTestRowNum, category, name, mrp, price, b2b }
    : { action: "addTest", category, name, mrp, price, b2b };
  postAdminAction(payload);
  document.getElementById("addTestForm").hidden = true;
});

function postAdminAction(extra, successMsg) {
  fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "adminAction", ...extra }) })
    .then(() => { showToast(successMsg || t("saved_refreshing")); setTimeout(loadData, 900); });
}

function aggregatePatients() {
  const map = {};
  (ALL_DATA.bookings || []).forEach(b => {
    const phone = String(b.phone || "").trim();
    if (!phone) return;
    if (!map[phone]) map[phone] = { phone, name: b.fullName, patientId: b.patientId || "", photo: "", visits: 0, total: 0, bookings: [] };
    map[phone].visits++;
    map[phone].total += Number(b.amount) || 0;
    map[phone].bookings.push(b);
    if (!map[phone].patientId && b.patientId) map[phone].patientId = b.patientId;
  });
  (ALL_DATA.patientProfiles || []).forEach(p => {
    const phone = String(p.phone || "").trim();
    if (!phone) return;
    if (!map[phone]) map[phone] = { phone, name: p.name, patientId: p.patientId || "", photo: "", visits: 0, total: 0, bookings: [] };
    if (p.name) map[phone].name = p.name;
    if (p.photo) map[phone].photo = p.photo;
    if (p.patientId) map[phone].patientId = p.patientId;
    map[phone].age = p.age || "";
    map[phone].gender = p.gender || "";
    map[phone].address = p.address || "";
    map[phone].city = p.city || "";
    map[phone].relation = p.relation || "";
  });
  return Object.values(map).sort((a, b) => b.visits - a.visits || a.name.localeCompare(b.name));
}
function initials(name) { const s = String(name || "?").trim(); return s ? s.charAt(0).toUpperCase() : "?"; }
const AVATAR_COLORS = ["#0b4ea2", "#a1235a", "#a35d00", "#137a3f", "#6b21a8", "#0e7490", "#b1560f"];
function avatarStyle(name) {
  let h = 0; const s = String(name || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `background:${AVATAR_COLORS[h % AVATAR_COLORS.length]}`;
}
function renderPatients(filterText) {
  const wrap = document.getElementById("patientResult");
  const term = (filterText !== undefined ? filterText : document.getElementById("patientPhoneSearch").value).trim().toLowerCase();
  let patients = aggregatePatients();
  if (term) patients = patients.filter(p => String(p.name).toLowerCase().includes(term) || p.phone.includes(term) || String(p.patientId).toLowerCase().includes(term));
  if (patients.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_prev_bookings")}</p>`; return; }
  wrap.innerHTML = `<p class="empty-msg">${patients.length} ${t("patients_found")}</p>` + patients.map(p => `
    <div class="booking-card patient-card">
      <div class="patient-card-top">
        ${p.photo ? `<img src="${escapeHtml(p.photo)}" class="avatar-circle" style="object-fit:cover" alt="">` : `<div class="avatar-circle" style="${avatarStyle(p.name)}">${escapeHtml(initials(p.name))}</div>`}
        <div class="patient-card-info">
          <strong>${escapeHtml(p.name)}</strong>
          <div class="booking-meta">${p.patientId ? `🆔 ${escapeHtml(p.patientId)} · ` : ""}📞 ${escapeHtml(p.phone)}</div>
        </div>
      </div>
      <div class="patient-stats-row">
        <div><strong>${p.visits}</strong><span>${t("total_visits")}</span></div>
        <div><strong>₹${p.total}</strong><span>${t("total_paid")}</span></div>
      </div>
      ${(p.age || p.gender || p.address || p.city) ? `<div class="booking-meta">${[p.age ? p.age + " yrs" : "", p.gender, p.relation && p.relation !== "Self" ? p.relation : "", p.city].filter(Boolean).join(" · ")}</div>${p.address ? `<div class="booking-meta">📍 ${escapeHtml(p.address)}</div>` : ""}` : ""}
      <button type="button" class="mini-btn approve view-history" data-phone="${escapeHtml(p.phone)}">${t("view_history_btn")}</button>
      <div class="patient-history" id="hist-${escapeHtml(p.phone)}" hidden></div>
    </div>`).join("");
  wrap.querySelectorAll(".view-history").forEach(btn => btn.addEventListener("click", () => {
    const phone = btn.dataset.phone;
    const box = document.getElementById(`hist-${phone}`);
    if (!box.hidden) { box.hidden = true; return; }
    const p = patients.find(x => x.phone === phone);
    box.innerHTML = (p ? p.bookings : []).map(b => `
      <div class="booking-meta">🧪 ${escapeHtml(b.tests || "-")}</div>
      <div class="booking-meta">📅 ${escapeHtml(String(b.date || ""))} · ₹${b.amount || 0}</div>`).join("<hr>");
    box.hidden = false;
  }));
}
document.getElementById("patientSearchBtn").addEventListener("click", () => renderPatients());
document.getElementById("patientPhoneSearch").addEventListener("input", e => renderPatients(e.target.value));

/* ---------- Settings tab ---------- */
function renderSettingsLinks() {
  document.getElementById("openSheetLink").href = ALL_DATA.sheetUrl || "#";
  document.getElementById("openDriveLink").href = ALL_DATA.driveUrl || "#";
  document.getElementById("shareCustomerLink2").href = CUSTOMER_APP_URL;
  if (ALL_DATA.settings) {
    document.getElementById("settingsUpiId").value = ALL_DATA.settings.upiId || "";
    if (ALL_DATA.settings.qrUrl) {
      document.getElementById("settingsQrPreview").src = ALL_DATA.settings.qrUrl;
      document.getElementById("settingsQrPreview").hidden = false;
    }
  }
}
document.getElementById("shareCustomerLink2").addEventListener("click", e => { e.preventDefault(); shareCustomerLink(); });
document.getElementById("settingsQrFile").addEventListener("change", () => {
  const file = document.getElementById("settingsQrFile").files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById("settingsQrPreview");
    preview.src = reader.result;
    preview.hidden = false;
  };
  reader.readAsDataURL(file);
});
document.getElementById("saveSettingsBtn").addEventListener("click", async () => {
  const upiId = document.getElementById("settingsUpiId").value.trim();
  const file = document.getElementById("settingsQrFile").files[0];
  const payload = { action: "updateSettings", upiId };
  if (file) {
    payload.qrBase64 = await fileToBase64(file);
    payload.qrType = file.type;
  }
  postAdminAction(payload, t("settings_saved"));
});

document.getElementById("adminLangSelect").value = currentLang;
loadData();

/* =========================================================
   BILLING (Business App merged in — Dashboard / Bills / Profit)
   ========================================================= */
function money(n) { return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 }); }
function todayStr() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function monthKey(dateStr) { return String(dateStr || "").slice(0, 7); }
function monthLabelStr(ym) { const p = ym.split("-"); if (p.length < 2) return ym; return new Date(Number(p[0]), Number(p[1]) - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" }); }
function lineProfit(t) { return (Number(t.b2c) || 0) - (Number(t.b2b) || 0) - (Number(t.collection) || 0) - (Number(t.report) || 0); }
function statMiniRow(label, value, hl) { return `<div class="stat-mini-row${hl ? " hl" : ""}"><span>${label}</span><b>${value}</b></div>`; }

/* ---- billing sub-tabs (Dashboard / Bills / Profit) ---- */
document.querySelectorAll(".billing-subtabs .filter-chip").forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll(".billing-subtabs .filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentBillingSubtab = chip.dataset.billtab;
  ["dashboard", "bills", "profit"].forEach(name => {
    document.getElementById(`billing-${name}`).hidden = name !== currentBillingSubtab;
  });
}));

/* ---- Dashboard ---- */
function renderBillingDashboard() {
  const bills = ALL_DATA.bills || [];
  const today = todayStr();
  const todayBills = bills.filter(b => b.date === today);
  const sum = (arr, k) => arr.reduce((a, b) => a + (Number(b[k]) || 0), 0);
  document.getElementById("billStatRow").innerHTML = `
    <div class="stat-box"><strong>${todayBills.length}</strong><span>${t("stat_today_bills")}</span></div>
    <div class="stat-box"><strong>${money(sum(todayBills, "b2c"))}</strong><span>${t("stat_today_b2c")}</span></div>
    <div class="stat-box"><strong>${money(sum(todayBills, "b2b"))}</strong><span>${t("stat_today_b2b")}</span></div>
    <div class="stat-box"><strong>${money(sum(todayBills, "profit"))}</strong><span>${t("stat_today_profit")}</span></div>`;
  const ym = today.slice(0, 7);
  const monthBills = bills.filter(b => monthKey(b.date) === ym);
  document.getElementById("billMonthlySummary").innerHTML =
    statMiniRow(t("col_bills"), monthBills.length)
    + statMiniRow(t("col_mrp"), money(sum(monthBills, "mrp")))
    + statMiniRow(t("col_b2c_collection"), money(sum(monthBills, "b2c")))
    + statMiniRow(t("col_b2b_cost"), money(sum(monthBills, "b2b")))
    + statMiniRow(t("col_collection_charges"), money(sum(monthBills, "collection")))
    + statMiniRow(t("col_report_charges"), money(sum(monthBills, "report")))
    + statMiniRow(t("col_monthly_profit"), money(sum(monthBills, "profit")), true);
}

/* ---- Bill form: test line editor ---- */
function billLineHTML(x, i) {
  return `<div class="bill-line" data-i="${i}">
    <div class="bill-line-head"><strong>${escapeHtml(x.name)}</strong><button type="button" class="bill-line-remove" data-i="${i}">×</button></div>
    <div class="bill-line-grid">
      <div class="bill-line-field"><label>MRP</label><input type="number" min="0" class="bl-in" data-i="${i}" data-k="mrp" value="${x.mrp}"></div>
      <div class="bill-line-field"><label>B2C</label><input type="number" min="0" class="bl-in" data-i="${i}" data-k="b2c" value="${x.b2c}"></div>
      <div class="bill-line-field"><label>B2B</label><input type="number" min="0" class="bl-in" data-i="${i}" data-k="b2b" value="${x.b2b}"></div>
      <div class="bill-line-field"><label>Collection</label><input type="number" min="0" class="bl-in" data-i="${i}" data-k="collection" value="${x.collection}"></div>
      <div class="bill-line-field"><label>Report</label><input type="number" min="0" class="bl-in" data-i="${i}" data-k="report" value="${x.report}"></div>
    </div>
    <div class="bill-line-profit">Profit:<b>${money(lineProfit(x))}</b></div>
  </div>`;
}
function renderBillLines() {
  document.getElementById("billTestLines").innerHTML = currentBillTests.map((x, i) => billLineHTML(x, i)).join("");
  document.getElementById("billNoTests").hidden = currentBillTests.length > 0;
}
function calcBillTotals() {
  const sum = k => currentBillTests.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  const mrp = sum("mrp"), b2c = sum("b2c"), b2b = sum("b2b"), cc = sum("collection"), rc = sum("report");
  document.getElementById("billTotalsBox").innerHTML =
    statMiniRow("Total MRP", money(mrp)) + statMiniRow("Total B2C", money(b2c)) + statMiniRow("Total B2B", money(b2b))
    + statMiniRow(t("col_collection_charges"), money(cc)) + statMiniRow(t("col_report_charges"), money(rc))
    + statMiniRow(t("col_discount"), money(mrp - b2c));
  document.getElementById("billFinalProfit").textContent = money(b2c - b2b - cc - rc);
}
document.getElementById("billTestLines").addEventListener("input", e => {
  const inp = e.target.closest(".bl-in"); if (!inp) return;
  const i = Number(inp.dataset.i), k = inp.dataset.k;
  currentBillTests[i][k] = Number(inp.value) || 0;
  inp.closest(".bill-line").querySelector(".bill-line-profit b").textContent = money(lineProfit(currentBillTests[i]));
  calcBillTotals();
});
document.getElementById("billTestLines").addEventListener("click", e => {
  const rm = e.target.closest(".bill-line-remove"); if (!rm) return;
  currentBillTests.splice(Number(rm.dataset.i), 1);
  renderBillLines(); calcBillTotals();
});

function addBillTest(test) {
  if (!test) return;
  if (currentBillTests.some(x => x.name.toLowerCase() === test.name.toLowerCase())) {
    showToast(t("test_already_in_bill"));
    document.getElementById("billTestSearch").value = ""; document.getElementById("billTestSuggest").hidden = true;
    return;
  }
  currentBillTests.push({ name: test.name, mrp: Number(test.mrp) || 0, b2c: Number(test.price) || 0, b2b: Number(test.b2b) || 0, collection: 0, report: 0 });
  document.getElementById("billTestSearch").value = ""; document.getElementById("billTestSuggest").hidden = true;
  renderBillLines(); calcBillTotals();
}
document.getElementById("billTestSearch").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  const box = document.getElementById("billTestSuggest");
  if (!q) { box.hidden = true; box.innerHTML = ""; return; }
  const matches = (ALL_DATA.tests || []).filter(x => x.name.toLowerCase().includes(q)).slice(0, 15);
  box.innerHTML = matches.map(x => `<div data-name="${escapeHtml(x.name)}"><strong>${escapeHtml(x.name)}</strong><br><span style="color:var(--muted);font-size:0.8rem">B2C ₹${x.price} · B2B ₹${x.b2b || 0}</span></div>`).join("");
  box.hidden = matches.length === 0;
  box.querySelectorAll("[data-name]").forEach(el => el.addEventListener("click", () => {
    const x = ALL_DATA.tests.find(y => y.name === el.dataset.name);
    addBillTest(x);
  }));
});
document.addEventListener("click", e => {
  if (!e.target.closest(".suggest-wrap")) { const b = document.getElementById("billTestSuggest"); if (b) b.hidden = true; }
});

function generateBillNo() {
  const d = todayStr().replaceAll("-", "");
  const prefix = "BILL-" + d + "-";
  let max = 0;
  (ALL_DATA.bills || []).forEach(b => {
    const m = String(b.billNo || "").match(new RegExp("^" + prefix + "(\\d+)$"));
    if (m) max = Math.max(max, Number(m[1]));
  });
  return prefix + String(max + 1).padStart(3, "0");
}

function resetBillForm() {
  editingBillRowNum = null; editingBillNo = null;
  currentBillTests = [];
  document.getElementById("billNoField").value = generateBillNo();
  document.getElementById("billDateField").value = todayStr();
  document.getElementById("billPatientField").value = "";
  document.getElementById("billTestSearch").value = "";
  document.getElementById("saveBillBtn").textContent = t("save_bill");
  renderBillLines(); calcBillTotals();
}
document.getElementById("showAddBillBtn").addEventListener("click", () => {
  resetBillForm();
  document.getElementById("billForm").hidden = false;
  document.getElementById("billForm").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.getElementById("cancelBillBtn").addEventListener("click", () => { document.getElementById("billForm").hidden = true; });

document.getElementById("saveBillBtn").addEventListener("click", () => {
  const patient = document.getElementById("billPatientField").value.trim();
  if (!patient) { showToast(t("fill_patient_name")); return; }
  if (currentBillTests.length === 0) { showToast(t("add_atleast_one_test")); return; }
  const sum = k => currentBillTests.reduce((a, x) => a + (Number(x[k]) || 0), 0);
  const mrp = sum("mrp"), b2c = sum("b2c"), b2b = sum("b2b"), cc = sum("collection"), rc = sum("report");
  const payload = {
    billNo: document.getElementById("billNoField").value,
    date: document.getElementById("billDateField").value,
    patient, tests: currentBillTests,
    mrp, b2c, b2b, collection: cc, report: rc, discount: mrp - b2c, profit: b2c - b2b - cc - rc
  };
  if (editingBillRowNum) {
    postAdminAction({ action: "updateBill", rowNum: editingBillRowNum, ...payload }, t("bill_updated"));
  } else {
    postAdminAction({ action: "addBill", ...payload }, t("bill_saved"));
  }
  document.getElementById("billForm").hidden = true;
});

/* ---- Bills list ---- */
function renderBillsList(filterText) {
  const wrap = document.getElementById("billListAdmin");
  const term = (filterText !== undefined ? filterText : (document.getElementById("billSearchAdmin").value || "")).trim().toLowerCase();
  const bills = (ALL_DATA.bills || []).filter(b => !term || String(b.patient).toLowerCase().includes(term) || String(b.billNo).toLowerCase().includes(term));
  if (bills.length === 0) { wrap.innerHTML = `<p class="empty-msg">${t("no_bills")}</p>`; return; }
  wrap.innerHTML = bills.map(b => `
    <div class="booking-card">
      <div class="booking-card-top"><strong>${escapeHtml(b.patient)}</strong><span class="amount">${money(b.b2c)}</span></div>
      <div class="booking-meta">${escapeHtml(b.billNo)} · ${escapeHtml(String(b.date || ""))} · ${(b.tests || []).length} test(s)</div>
      <div class="booking-meta">Profit: <strong style="color:#137a3f">${money(b.profit)}</strong></div>
      <div class="review-actions">
        <button type="button" class="mini-btn approve edit-bill" data-row="${b.rowNum}">${t("edit_bill_btn")}</button>
        <button type="button" class="mini-btn delete delete-bill" data-row="${b.rowNum}">${t("btn_delete")}</button>
      </div>
      <div class="bill-card-actions">
        <button type="button" class="mini-btn whatsapp share-wa" data-row="${b.rowNum}">💬 ${t("whatsapp_share")}</button>
        <button type="button" class="mini-btn email share-email" data-row="${b.rowNum}">✉️ ${t("email_share")}</button>
      </div>
    </div>`).join("");
  wrap.querySelectorAll(".edit-bill").forEach(el => el.addEventListener("click", () => {
    const b = ALL_DATA.bills.find(x => x.rowNum === Number(el.dataset.row));
    if (!b) return;
    editingBillRowNum = b.rowNum; editingBillNo = b.billNo;
    currentBillTests = (b.tests || []).map(x => ({ ...x }));
    document.getElementById("billNoField").value = b.billNo;
    document.getElementById("billDateField").value = b.date;
    document.getElementById("billPatientField").value = b.patient;
    document.getElementById("saveBillBtn").textContent = t("update_bill_btn");
    renderBillLines(); calcBillTotals();
    document.getElementById("billForm").hidden = false;
    document.getElementById("billForm").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  wrap.querySelectorAll(".delete-bill").forEach(el => el.addEventListener("click", () => {
    if (!confirm(t("confirm_delete_bill"))) return;
    postAdminAction({ action: "deleteBill", rowNum: Number(el.dataset.row) });
  }));
  wrap.querySelectorAll(".share-wa").forEach(el => el.addEventListener("click", () => {
    const b = ALL_DATA.bills.find(x => x.rowNum === Number(el.dataset.row));
    if (b) shareBillWhatsApp(b);
  }));
  wrap.querySelectorAll(".share-email").forEach(el => el.addEventListener("click", () => {
    const b = ALL_DATA.bills.find(x => x.rowNum === Number(el.dataset.row));
    if (b) shareBillEmail(b);
  }));
}
document.getElementById("billSearchAdmin").addEventListener("input", e => renderBillsList(e.target.value));

function buildBillMessage(b) {
  const lines = [];
  lines.push("Kalyan Pathlab");
  lines.push("Bill No: " + b.billNo);
  lines.push("Date: " + b.date);
  lines.push("Patient: " + b.patient);
  lines.push("");
  lines.push("Tests:");
  (b.tests || []).forEach(x => lines.push("- " + x.name + " : " + money(x.b2c)));
  lines.push("");
  lines.push("Total Payable: " + money(b.b2c));
  lines.push("");
  lines.push("Thank you for choosing Kalyan Pathlab!");
  lines.push("For queries: WhatsApp +91 98700 20674 | Email " + LAB_EMAIL);
  return lines.join("\n");
}
function shareBillWhatsApp(b) { window.open("https://wa.me/?text=" + encodeURIComponent(buildBillMessage(b)), "_blank"); }
function shareBillEmail(b) {
  const subject = "Kalyan Pathlab - Bill " + b.billNo;
  window.location.href = "mailto:?cc=" + encodeURIComponent(LAB_EMAIL) + "&subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildBillMessage(b));
}

/* ---- Profit Analysis ---- */
document.querySelectorAll('#billing-profit .review-filter .filter-chip').forEach(chip => chip.addEventListener("click", () => {
  document.querySelectorAll('#billing-profit .review-filter .filter-chip').forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  currentProfitTab = chip.dataset.ptab;
  document.getElementById("profitCustomRange").hidden = currentProfitTab !== "custom";
  renderProfitAnalysis();
}));
document.getElementById("profitFrom").addEventListener("change", renderProfitAnalysis);
document.getElementById("profitTo").addEventListener("change", renderProfitAnalysis);

function profitFilteredBills() {
  const bills = ALL_DATA.bills || [];
  const today = todayStr(), ym = today.slice(0, 7);
  if (currentProfitTab === "today") return bills.filter(b => b.date === today);
  if (currentProfitTab === "month") return bills.filter(b => monthKey(b.date) === ym);
  if (currentProfitTab === "custom") {
    const f = document.getElementById("profitFrom").value, to = document.getElementById("profitTo").value;
    return bills.filter(b => (!f || String(b.date) >= f) && (!to || String(b.date) <= to));
  }
  return bills;
}
function renderProfitAnalysis() {
  const bills = profitFilteredBills();
  const sum = k => bills.reduce((a, b) => a + (Number(b[k]) || 0), 0);
  const mrp = sum("mrp"), b2c = sum("b2c"), b2b = sum("b2b"), cc = sum("collection"), rc = sum("report"), disc = sum("discount"), profit = sum("profit");
  document.getElementById("profitBreakdown").innerHTML =
    statMiniRow(t("col_bills"), bills.length) + statMiniRow(t("col_mrp"), money(mrp)) + statMiniRow("Total B2C", money(b2c))
    + statMiniRow("Total B2B", money(b2b)) + statMiniRow(t("col_collection_charges"), money(cc))
    + statMiniRow(t("col_report_charges"), money(rc)) + statMiniRow(t("col_discount"), money(disc));
  document.getElementById("profitNetBig").textContent = money(profit);
  const margin = b2c > 0 ? ((profit / b2c) * 100).toFixed(1) : "0.0";
  document.getElementById("profitMarginText").textContent = "Profit Margin: " + margin + "% of B2C collection";
}

/* =========================================================
   DYNAMIC TEST ICONS — original hand-drawn SVGs, chosen per
   test/category keyword (kidney, liver, thyroid, urine, heart,
   blood, vitamins, fever, hormone) with a generic test-tube default.
   ========================================================= */
const TEST_ICONS = {
  kidney: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3C6 3 4 6.3 4 10.2c0 3 1.3 4 1.3 6 0 2.6 1.7 4.8 4.4 4.8 2 0 3.3-1.4 3.3-3.3 0-1.6-1.1-2.1-1.1-3.7s1.4-2 1.4-3.9C13.3 6.7 12.3 3 9.5 3Z"/></svg>',
  liver: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9c0-3 2.5-5 6-5h5c3 0 5.5 2.7 5.5 6.2 0 4.3-3.3 7.8-7.5 7.8H9c-3 0-5-2.2-5-5V9Z"/></svg>',
  thyroid: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="12" r="4"/><circle cx="16.5" cy="12" r="4"/><path d="M11.3 10.5h1.4M11.3 13.5h1.4"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6.5 7.4 6.5 12a6.5 6.5 0 1 1-13 0C5.5 10.4 12 3 12 3Z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7.2-4.5-9.7-9.2A5.4 5.4 0 0 1 12 6.3a5.4 5.4 0 0 1 9.7 5.5C19.2 16.5 12 21 12 21Z"/></svg>',
  glucose: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z"/><path d="M12 12v5M9.5 14.5h5"/></svg>',
  lipid: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z"/><path d="M9 13.5h6M9 16h6" stroke-width="1.3"/></svg>',
  capsule: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="10" width="17" height="4" rx="2"/><path d="M12 10v4"/></svg>',
  thermo: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 14.2V5a1.5 1.5 0 1 1 3 0v9.2a3.5 3.5 0 1 1-3 0Z"/></svg>',
  hormone: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6.5" r="2.3"/><circle cx="18" cy="6.5" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M7.7 8.2 10.5 16M16.3 8.2 13.5 16"/></svg>',
  blood: '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" stroke="none"><path d="M12 2.5s7 8.3 7 13.3a7 7 0 1 1-14 0c0-5 7-13.3 7-13.3Z"/></svg>',
  tube: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v7l-4.3 8a2 2 0 0 0 1.8 2.9h9a2 2 0 0 0 1.8-2.9L14 10V3"/></svg>'
};
const TEST_ICON_RULES = [
  { kw: ["kidney"], icon: "kidney", bg: "#f4ead9", fg: "#8a5a1f" },
  { kw: ["liver"], icon: "liver", bg: "#ffe8d6", fg: "#b1560f" },
  { kw: ["thyroid"], icon: "thyroid", bg: "#f3e8ff", fg: "#6b21a8" },
  { kw: ["urine", "bladder", "cue"], icon: "droplet", bg: "#fff6d9", fg: "#a3790a" },
  { kw: ["cardiac", "heart", "ecg", "troponin", "aso"], icon: "heart", bg: "#ffe1e6", fg: "#b3123f" },
  { kw: ["diabetes", "sugar", "glucose", "hba1c", "insulin", "fbs", "ppbs", "rbs"], icon: "glucose", bg: "#ffe9d6", fg: "#b1560f" },
  { kw: ["lipid", "cholesterol", "triglyceride", "hdl", "ldl"], icon: "lipid", bg: "#e6ecff", fg: "#3346c9" },
  { kw: ["vitamin", "mineral", "b12", "iron", "calcium", "magnesium", "tibc", "ferritin"], icon: "capsule", bg: "#e3f7ea", fg: "#12793f" },
  { kw: ["fever", "infection", "widal", "dengue", "malaria", "covid", "crp", "typhoid"], icon: "thermo", bg: "#ffe1e1", fg: "#c21f1f" },
  { kw: ["hormone", "fertility", "pregnancy", "hcg", "prolactin", "testosterone", "fsh", "lh"], icon: "hormone", bg: "#ffe3f0", fg: "#b3126e" },
  { kw: ["blood", "cbc", "hemoglobin", "anemia", "platelet", "esr", "grouping", "smear"], icon: "blood", bg: "#ffe1e6", fg: "#c21f1f" }
];
function testVisual(category, name) {
  const s = (String(category || "") + " " + String(name || "")).toLowerCase();
  for (const rule of TEST_ICON_RULES) { if (rule.kw.some(k => s.includes(k))) return rule; }
  return { icon: "tube", bg: "#e8f0ff", fg: "#0b4ea2" };
}

/* =========================================================
   PIN LOCK (basic app-lock — deterrent, not bank-grade security)
   ========================================================= */
const PIN_KEY = "kpAdminPin";
const PIN_UNLOCK_KEY = "kpAdminUnlocked";
const DEFAULT_PIN = "1234";

function getStoredPin() { return localStorage.getItem(PIN_KEY) || DEFAULT_PIN; }

function showLockScreen() {
  document.getElementById("pinLockScreen").style.display = "flex";
  document.getElementById("pinInput").value = "";
  document.getElementById("pinError").hidden = true;
  setTimeout(() => document.getElementById("pinInput").focus(), 100);
}
function hideLockScreen() { document.getElementById("pinLockScreen").style.display = "none"; }

function tryUnlock() {
  const entered = document.getElementById("pinInput").value.trim();
  if (entered === getStoredPin()) {
    sessionStorage.setItem(PIN_UNLOCK_KEY, "1");
    hideLockScreen();
  } else {
    document.getElementById("pinError").hidden = false;
    document.getElementById("pinInput").value = "";
    document.getElementById("pinInput").focus();
  }
}
document.getElementById("pinSubmitBtn").addEventListener("click", tryUnlock);
document.getElementById("pinInput").addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });

document.getElementById("changePinBtn").addEventListener("click", () => {
  const p1 = document.getElementById("newPinField").value.trim();
  const p2 = document.getElementById("confirmPinField").value.trim();
  if (p1.length < 4 || p1.length > 6 || !/^\d+$/.test(p1)) { showToast(t("pin_invalid")); return; }
  if (p1 !== p2) { showToast(t("pin_mismatch")); return; }
  localStorage.setItem(PIN_KEY, p1);
  document.getElementById("newPinField").value = "";
  document.getElementById("confirmPinField").value = "";
  showToast(t("pin_changed"));
});
document.getElementById("lockNowBtn").addEventListener("click", () => {
  sessionStorage.removeItem(PIN_UNLOCK_KEY);
  showLockScreen();
});

if (sessionStorage.getItem(PIN_UNLOCK_KEY) === "1") { hideLockScreen(); } else { showLockScreen(); }
