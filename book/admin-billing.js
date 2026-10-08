/* =====================================================================
   Kalyan Pathlab — Admin: Professional Bill / Invoice generation
   - बुकिंग Confirmed/Completed झाल्यावर "🧾 Generate Bill"
   - B2C (पेशंट बिल: कलेक्शन चार्जसह) आणि B2B (क्लायंट/पार्टनर इनव्हॉइस)
   - डिफॉल्ट भाषा English; गोल स्टॅम्प "Kalyan Pathlab" च्या नावाने
   - प्रिंट / PDF: Chrome मध्ये Print → "Save as PDF"
   admin.js नंतर लोड होतो (admin.js मधले ALL_DATA, t, money, showToast, ... वापरतो).
   ===================================================================== */
(function () {
  "use strict";

  const FREE_MIN = 499;      // ₹499 किंवा जास्त = कलेक्शन चार्ज माफ
  const CHARGE = 100;        // ₹499 पेक्षा कमी = ₹100
  const CHARGE_LINE_NAME = "Home Sample Collection Charges";
  const PROFILE_KEY = "kp_lab_profile";

  const LAB = {
    name: "Kalyan Pathlab",
    sub: "Pathology Services",
    managed: "Managed by Sanskar Foundation",
    address: "Shop No. 3, 1st Floor, Parvati Apartment, Tisgaon Naka, Kalyan East – 421306",
    phone: "98700 20674 | 88281 11774",
    email: "kalyan.pathlab.21@gmail.com",
    hours: "Mon–Sat 7:00 AM – 9:00 PM · Sun 8:00 AM – 1:00 PM"
  };

  /* ---------- Admin UI translations (en / mr / hi) ---------- */
  Object.assign(TRANSLATIONS, {
    ib_btn_bill: { en: "Generate Bill", mr: "बिल बनवा", hi: "बिल बनाएं" },
    ib_print_bill: { en: "Print Bill", mr: "बिल प्रिंट", hi: "बिल प्रिंट" },
    ib_title: { en: "Generate Bill", mr: "बिल बनवा", hi: "बिल बनाएं" },
    ib_type_b2c: { en: "B2C · Patient bill", mr: "B2C · पेशंट बिल", hi: "B2C · मरीज़ बिल" },
    ib_type_b2b: { en: "B2B · Client / partner", mr: "B2B · क्लायंट / पार्टनर", hi: "B2B · क्लाइंट / पार्टनर" },
    ib_lang: { en: "Bill language", mr: "बिलची भाषा", hi: "बिल की भाषा" },
    ib_patient: { en: "Patient details", mr: "पेशंट तपशील", hi: "मरीज़ विवरण" },
    ib_name: { en: "Patient name *", mr: "पेशंटचे नाव *", hi: "मरीज़ का नाम *" },
    ib_age: { en: "Age", mr: "वय", hi: "उम्र" },
    ib_gender: { en: "Gender", mr: "लिंग", hi: "लिंग" },
    ib_mobile: { en: "Mobile", mr: "मोबाईल", hi: "मोबाइल" },
    ib_addr: { en: "Address", mr: "पत्ता", hi: "पता" },
    ib_doc: { en: "Referred by (Doctor / Self)", mr: "रेफर करणारे (डॉक्टर / स्वतः)", hi: "रेफर (डॉक्टर / स्वयं)" },
    ib_sample_date: { en: "Sample collection date", mr: "सॅम्पल कलेक्शन तारीख", hi: "सैंपल कलेक्शन तारीख" },
    ib_client: { en: "Billed to (client)", mr: "बिल कोणाला (क्लायंट)", hi: "बिल किसे (क्लाइंट)" },
    ib_client_name: { en: "Client / organisation name *", mr: "क्लायंट / संस्थेचे नाव *", hi: "क्लाइंट / संस्था का नाम *" },
    ib_client_addr: { en: "Client address", mr: "क्लायंटचा पत्ता", hi: "क्लाइंट का पता" },
    ib_client_gstin: { en: "Client GSTIN (if any)", mr: "क्लायंट GSTIN (असल्यास)", hi: "क्लाइंट GSTIN (यदि हो)" },
    ib_client_contact: { en: "Contact person / phone", mr: "संपर्क व्यक्ती / फोन", hi: "संपर्क व्यक्ति / फोन" },
    ib_tests: { en: "Tests", mr: "टेस्ट", hi: "टेस्ट" },
    ib_search: { en: "Search & add test…", mr: "टेस्ट शोधा व जोडा…", hi: "टेस्ट खोजें व जोड़ें…" },
    ib_custom_name: { en: "Custom test name", mr: "इतर टेस्टचे नाव", hi: "अन्य टेस्ट का नाम" },
    ib_add: { en: "+ Add", mr: "+ जोडा", hi: "+ जोड़ें" },
    ib_rate: { en: "Rate ₹", mr: "दर ₹", hi: "दर ₹" },
    ib_mrp: { en: "MRP ₹", mr: "MRP ₹", hi: "MRP ₹" },
    ib_no_lines: { en: "No tests added yet.", mr: "अजून टेस्ट जोडली नाही.", hi: "अभी कोई टेस्ट नहीं जुड़ी।" },
    ib_coll: { en: "Home collection charge ₹", mr: "होम कलेक्शन चार्ज ₹", hi: "होम कलेक्शन चार्ज ₹" },
    ib_coll_b2c: { en: "Auto: ₹100 below ₹499, waived at ₹499 and above (editable).", mr: "आपोआप: ₹499 पेक्षा कमी = ₹100, ₹499 किंवा जास्त = माफ (बदलता येतं).", hi: "अपने-आप: ₹499 से कम = ₹100, ₹499 या अधिक = माफ (बदल सकते हैं)।" },
    ib_coll_b2b: { en: "B2B default ₹0 (edit if needed).", mr: "B2B साठी डिफॉल्ट ₹0 (हवं तर बदला).", hi: "B2B के लिए डिफ़ॉल्ट ₹0 (चाहें तो बदलें)।" },
    ib_pay: { en: "Payment", mr: "पेमेंट", hi: "पेमेंट" },
    ib_pay_mode: { en: "Mode", mr: "पद्धत", hi: "तरीका" },
    ib_pay_status: { en: "Status", mr: "स्थिती", hi: "स्थिति" },
    ib_paid: { en: "Paid", mr: "भरले", hi: "चुकाया" },
    ib_unpaid: { en: "Unpaid / Due", mr: "बाकी", hi: "बाकी" },
    ib_lab: { en: "Lab details printed on bill", mr: "बिलावर छापले जाणारे लॅब तपशील", hi: "बिल पर छपने वाले लैब विवरण" },
    ib_lab_gstin: { en: "Lab GSTIN (optional)", mr: "लॅब GSTIN (ऐच्छिक)", hi: "लैब GSTIN (वैकल्पिक)" },
    ib_lab_reg: { en: "Registration / licence no.", mr: "नोंदणी / परवाना क्र.", hi: "पंजीकरण / लाइसेंस नं." },
    ib_lab_sign: { en: "Signatory (name / designation)", mr: "सही करणारे (नाव / पद)", hi: "हस्ताक्षरकर्ता (नाम / पद)" },
    ib_save_list: { en: "Also save to Bills list (profit tracking)", mr: "बिल्स यादीतही सेव्ह करा (प्रॉफिट ट्रॅकिंग)", hi: "बिल्स सूची में भी सेव करें (प्रॉफिट ट्रैकिंग)" },
    ib_b2b_nosave: { en: "B2B invoices are for printing only — not added to profit stats.", mr: "B2B इनव्हॉइस फक्त प्रिंटसाठी — प्रॉफिट आकडेवारीत जोडले जात नाहीत.", hi: "B2B इनवॉइस केवल प्रिंट के लिए — प्रॉफिट आँकड़ों में नहीं जुड़ते।" },
    ib_preview: { en: "Preview & Print", mr: "प्रीव्ह्यू व प्रिंट", hi: "प्रीव्यू व प्रिंट" },
    ib_back_edit: { en: "← Edit", mr: "← एडिट", hi: "← एडिट" },
    ib_print: { en: "🖨 Print / Save PDF", mr: "🖨 प्रिंट / PDF सेव्ह", hi: "🖨 प्रिंट / PDF सेव" },
    ib_wa: { en: "💬 WhatsApp", mr: "💬 WhatsApp", hi: "💬 WhatsApp" },
    ib_sub: { en: "Sub-total", mr: "उप-एकूण", hi: "उप-कुल" },
    ib_coll_line: { en: "Collection charge", mr: "कलेक्शन चार्ज", hi: "कलेक्शन चार्ज" },
    ib_net: { en: "Net payable", mr: "एकूण देय", hi: "कुल देय" },
    ib_waived: { en: "Waived", mr: "माफ", hi: "माफ" },
    ib_err_name: { en: "Enter patient name.", mr: "पेशंटचे नाव टाका.", hi: "मरीज़ का नाम डालें।" },
    ib_err_lines: { en: "Add at least one test.", mr: "किमान एक टेस्ट जोडा.", hi: "कम से कम एक टेस्ट जोड़ें।" },
    ib_err_client: { en: "Enter client / organisation name.", mr: "क्लायंट / संस्थेचे नाव टाका.", hi: "क्लाइंट / संस्था का नाम डालें।" },
    ib_bill_date: { en: "Bill date", mr: "बिलाची तारीख", hi: "बिल की तारीख" },
    ib_sample_time: { en: "Sample collection time", mr: "सॅम्पल कलेक्शन वेळ", hi: "सैंपल कलेक्शन समय" },
    ib_saved_clients: { en: "Saved clients (from sheet)", mr: "सेव्ह केलेले क्लायंट (शीटमधून)", hi: "सेव किए क्लाइंट (शीट से)" },
    ib_pick_client: { en: "— Select saved client —", mr: "— सेव्ह क्लायंट निवडा —", hi: "— सेव क्लाइंट चुनें —" },
    ib_save_client: { en: "Save / update this client for next time", mr: "हा क्लायंट पुढच्या वेळेसाठी सेव्ह/अपडेट करा", hi: "यह क्लाइंट अगली बार के लिए सेव/अपडेट करें" },
    ib_client_saved: { en: "Client details saved to sheet ✓", mr: "क्लायंट तपशील शीटमध्ये सेव्ह झाले ✓", hi: "क्लाइंट विवरण शीट में सेव हुए ✓" },
    ib_lab_saved: { en: "Lab details saved to sheet ✓", mr: "लॅब तपशील शीटमध्ये सेव्ह झाले ✓", hi: "लैब विवरण शीट में सेव हुए ✓" },
    ib_no_b2b: { en: "B2B rate not set in Test Master — B2C rate used. Edit if needed.", mr: "टेस्ट मास्टरमध्ये B2B दर नाही — B2C दर वापरला आहे. हवा तर बदला.", hi: "टेस्ट मास्टर में B2B दर नहीं है — B2C दर लिया गया। चाहें तो बदलें।" },
    ib_saved: { en: "Bill saved to list ✓", mr: "बिल यादीत सेव्ह झालं ✓", hi: "बिल सूची में सेव हुआ ✓" }
  });

  /* ---------- Bill (printed document) labels ---------- */
  const BL = {
    en: {
      title_b2c: "BILL / RECEIPT", title_b2b: "INVOICE", bill_no: "Bill No.", date: "Date", pid: "Patient ID",
      patient: "Patient Details", name: "Name", agesex: "Age / Sex", mobile: "Mobile", address: "Address", ref: "Referred by",
      coll: "Collection & Payment", sample: "Sample collection", report: "Report via", pmode: "Payment mode", pstatus: "Payment status",
      billed: "Billed To", gstin: "GSTIN", contact: "Contact", patient_ref: "Patient / Reference",
      sr: "#", desc: "Test / Profile", mrp: "MRP (₹)", rate: "Rate (₹)", total_mrp: "Total MRP", discount: "Discount",
      subtotal: "Sub-total", collection: "Home collection charges", waived: "Waived (bill ₹499+)", net: "NET PAYABLE", words: "Amount in words",
      paid: "PAID", unpaid: "PAYMENT DUE", terms: "Terms & Notes",
      t1: "Reports are shared via the selected mode (WhatsApp / Email / Hard copy) after processing.",
      t2: "Home collection charge of ₹100 applies on bills below ₹499; it is waived for bills of ₹499 and above.",
      t3: "Charges once paid are non-refundable after sample collection.",
      t4: "This is a computer-generated bill and is valid with the lab stamp.",
      t5: "Payment is due as per the agreed terms.",
      for_lab: "For Kalyan Pathlab", sign: "Authorised Signatory", thanks: "Thank you for choosing Kalyan Pathlab · Care For Quality",
      upi: "Pay via UPI", regno: "Reg. No.", hours: "Hours", self: "Self"
    },
    mr: {
      title_b2c: "बिल / पावती", title_b2b: "इनव्हॉइस", bill_no: "बिल क्र.", date: "दिनांक", pid: "पेशंट ID",
      patient: "पेशंट तपशील", name: "नाव", agesex: "वय / लिंग", mobile: "मोबाईल", address: "पत्ता", ref: "रेफर करणारे",
      coll: "कलेक्शन व पेमेंट", sample: "सॅम्पल कलेक्शन", report: "रिपोर्ट", pmode: "पेमेंट पद्धत", pstatus: "पेमेंट स्थिती",
      billed: "बिल कोणाला", gstin: "GSTIN", contact: "संपर्क", patient_ref: "पेशंट / संदर्भ",
      sr: "#", desc: "टेस्ट / प्रोफाईल", mrp: "MRP (₹)", rate: "दर (₹)", total_mrp: "एकूण MRP", discount: "सवलत",
      subtotal: "उप-एकूण", collection: "होम कलेक्शन चार्ज", waived: "माफ (बिल ₹499+)", net: "एकूण देय", words: "अक्षरी रक्कम",
      paid: "भरले", unpaid: "पेमेंट बाकी", terms: "अटी व सूचना",
      t1: "प्रक्रिया पूर्ण झाल्यावर रिपोर्ट निवडलेल्या मार्गाने (WhatsApp / ईमेल / हार्ड कॉपी) दिला जाईल.",
      t2: "₹499 पेक्षा कमी बिलावर ₹100 होम कलेक्शन चार्ज लागतो; ₹499 किंवा जास्त बिलावर तो माफ आहे.",
      t3: "भरलेले शुल्क सॅम्पल घेतल्यानंतर परत मिळणार नाही.",
      t4: "हे संगणकीय बिल असून लॅबच्या स्टॅम्पसह वैध आहे.",
      t5: "पेमेंट ठरलेल्या अटींनुसार देय आहे.",
      for_lab: "कल्याण पॅथलॅबसाठी", sign: "अधिकृत स्वाक्षरी", thanks: "Kalyan Pathlab निवडल्याबद्दल धन्यवाद · Care For Quality",
      upi: "UPI ने पेमेंट", regno: "नोंदणी क्र.", hours: "वेळ", self: "स्वतः"
    },
    hi: {
      title_b2c: "बिल / रसीद", title_b2b: "इनवॉइस", bill_no: "बिल नं.", date: "दिनांक", pid: "मरीज़ ID",
      patient: "मरीज़ विवरण", name: "नाम", agesex: "उम्र / लिंग", mobile: "मोबाइल", address: "पता", ref: "रेफर",
      coll: "कलेक्शन व पेमेंट", sample: "सैंपल कलेक्शन", report: "रिपोर्ट", pmode: "पेमेंट तरीका", pstatus: "पेमेंट स्थिति",
      billed: "बिल किसे", gstin: "GSTIN", contact: "संपर्क", patient_ref: "मरीज़ / संदर्भ",
      sr: "#", desc: "टेस्ट / प्रोफाइल", mrp: "MRP (₹)", rate: "दर (₹)", total_mrp: "कुल MRP", discount: "छूट",
      subtotal: "उप-कुल", collection: "होम कलेक्शन चार्ज", waived: "माफ (बिल ₹499+)", net: "कुल देय", words: "शब्दों में राशि",
      paid: "चुकाया", unpaid: "पेमेंट बाकी", terms: "शर्तें व सूचना",
      t1: "प्रोसेसिंग के बाद रिपोर्ट चुने गए माध्यम (WhatsApp / ईमेल / हार्ड कॉपी) से दी जाएगी।",
      t2: "₹499 से कम के बिल पर ₹100 होम कलेक्शन चार्ज लगता है; ₹499 या अधिक पर माफ है।",
      t3: "चुकाया गया शुल्क सैंपल लेने के बाद वापस नहीं होगा।",
      t4: "यह कंप्यूटर जनित बिल है और लैब की मुहर के साथ मान्य है।",
      t5: "भुगतान तय शर्तों के अनुसार देय है।",
      for_lab: "कल्याण पैथलैब के लिए", sign: "अधिकृत हस्ताक्षरकर्ता", thanks: "Kalyan Pathlab चुनने के लिए धन्यवाद · Care For Quality",
      upi: "UPI से पेमेंट", regno: "पंजीकरण नं.", hours: "समय", self: "स्वयं"
    }
  };

  /* ---------- helpers ---------- */
  const esc = (s) => escapeHtml(s);
  const num = (v) => Number(v) || 0;
  const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const plain = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  function fmtDate(s) {
    const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : String(s || "");
  }
  const pad2 = (x) => String(x).padStart(2, "0");
  function toISO(s) {
    s = String(s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;
    m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (m) return `${m[3]}-${pad2(m[2])}-${pad2(m[1])}`;
    return "";
  }
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, " ").trim();
  function findMaster(name) {
    const n = norm(name);
    return n ? (ALL_DATA.tests || []).find((m) => norm(m.name) === n) : null;
  }

  /* ---- B2B क्लायंट लॅब्स + आपल्या लॅबचा प्रोफाईल: Google Sheet ("B2B Clients") + फोनवर कॅश ---- */
  const CLIENT_CACHE_KEY = "kp_b2b_clients";
  function localClients() { try { return JSON.parse(localStorage.getItem(CLIENT_CACHE_KEY) || "[]"); } catch (_) { return []; } }
  function allClients() {
    const map = {};
    localClients().forEach((c) => { if (c.name) map[norm(c.name)] = c; });
    (ALL_DATA.clients || []).filter((c) => (c.type || "CLIENT") === "CLIENT").forEach((c) => { if (c.name) map[norm(c.name)] = c; });   // शीट जिंकते
    return Object.values(map).sort((x, y) => x.name.localeCompare(y.name));
  }
  function rememberClient(c) {
    const list = localClients().filter((x) => norm(x.name) !== norm(c.name));
    list.push({ name: c.name, address: c.address, gstin: c.gstin, contact: c.contact, type: "CLIENT" });
    try { localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(list)); } catch (_) {}
  }
  function selfProfile() {
    const row = (ALL_DATA.clients || []).find((c) => c.type === "SELF");
    const loc = loadProfile();
    return row ? { gstin: row.gstin || loc.gstin || "", reg: row.regNo || loc.reg || "", sign: row.signatory || loc.sign || "" } : { gstin: loc.gstin || "", reg: loc.reg || "", sign: loc.sign || "" };
  }

  function loadProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); } catch (_) { return {}; } }
  function saveProfile(p) { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (_) {} }

  function inWords(n) {
    n = Math.round(Math.abs(n));
    if (n === 0) return "Zero";
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const two = (x) => (x < 20 ? ones[x] : tens[Math.floor(x / 10)] + (x % 10 ? " " + ones[x % 10] : ""));
    const three = (x) => (x >= 100 ? ones[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " + two(x % 100) : "") : two(x));
    let out = "";
    const crore = Math.floor(n / 10000000); n %= 10000000;
    const lakh = Math.floor(n / 100000); n %= 100000;
    const thou = Math.floor(n / 1000); n %= 1000;
    if (crore) out += three(crore) + " Crore ";
    if (lakh) out += two(lakh) + " Lakh ";
    if (thou) out += two(thou) + " Thousand ";
    if (n) out += three(n);
    return out.trim();
  }

  /* ---------- state ---------- */
  let inv = null;

  function nextBillNo(type) {
    const d = todayStr().replace(/-/g, "");
    const prefix = `${type}-${d}-`;
    let max = 0;
    (ALL_DATA.bills || []).forEach((b) => {
      const m = String(b.billNo || "").match(new RegExp("^" + prefix + "(\\d+)$"));
      if (m) max = Math.max(max, Number(m[1]));
    });
    return prefix + String(max + 1).padStart(3, "0");
  }

  function autoCollection() {
    if (!inv) return 0;
    if (inv.type === "B2B") return 0;
    const s = inv.lines.reduce((a, l) => a + num(l.rate), 0);
    return s > 0 && s < FREE_MIN ? CHARGE : 0;
  }

  /* टेस्ट मास्टरशी जुळवून बुकिंगमधील टेस्ट ओळखतो (नावात स्वल्पविराम असू शकतो) */
  function parseTests(str, master) {
    const orig = String(str || "");
    const low = orig.toLowerCase();
    let work = low;
    const found = [];
    const sorted = [...master].filter((m) => m.name).sort((a, b) => String(b.name).length - String(a.name).length);
    for (const m of sorted) {
      const nm = String(m.name).toLowerCase();
      const idx = work.indexOf(nm);
      if (idx >= 0) {
        found.push({ idx, m });
        work = work.slice(0, idx) + "\u0000".repeat(nm.length) + work.slice(idx + nm.length);
      }
    }
    found.sort((a, b) => a.idx - b.idx);
    const rest = work.replace(/\u0000+/g, ",").split(",").map((x) => x.trim()).filter((x) => x.length > 1);
    // leftover साठी मूळ अक्षर-रूप वापर
    const leftovers = rest.map((r) => { const p = low.indexOf(r); return p >= 0 ? orig.substr(p, r.length) : r; });
    return { found: found.map((f) => f.m), leftovers };
  }

  function lineFromMaster(m, type) {
    const b2c = num(m.price), b2b = num(m.b2b) || num(m.price);
    return { name: m.name, mrp: num(m.mrp) || b2c, b2c, b2b, costB2b: num(m.b2b), noB2b: !num(m.b2b), rate: type === "B2B" ? b2b : b2c, custom: false };
  }

  function baseInv(type) {
    const prof = selfProfile();
    return {
      type: type || "B2C", lang: "en", lines: [], collAuto: true, collection: 0, save: true, savedOnce: false,
      billNo: "", date: todayStr(), bookingRow: null, saveClient: true,
      patient: { name: "", age: "", gender: "", phone: "", address: "", doctor: "", pid: "", sampleDate: "", sampleTime: "", report: "" },
      client: { name: "", address: "", gstin: "", contact: "" },
      pay: { mode: "Cash", status: "Unpaid" },
      lab: { gstin: prof.gstin || "", reg: prof.reg || "", sign: prof.sign || "" }
    };
  }

  function openInvoiceFromBooking(rowNum) {
    const b = (ALL_DATA.bookings || []).find((x) => x.rowNum === Number(rowNum));
    if (!b) return;
    inv = baseInv("B2C");
    inv.bookingRow = b.rowNum;
    inv.patient = {
      name: b.fullName || "", age: b.age || "", gender: "", phone: String(b.phone || ""),
      address: [b.address, b.city].filter(Boolean).join(", "), doctor: b.doctor || "", pid: b.patientId || "",
      sampleDate: String(b.date || ""), sampleTime: String(b.time || ""), report: b.reportMode || ""
    };
    inv.pay.mode = /upi/i.test(b.paymentMethod || "") ? "UPI" : "Cash";
    inv.pay.status = b.status === "Completed" ? "Paid" : "Unpaid";
    const parsed = parseTests(b.tests, ALL_DATA.tests || []);
    inv.lines = parsed.found.map((m) => lineFromMaster(m, "B2C"));
    parsed.leftovers.forEach((n) => {
      const m = findMaster(n);   // थोडं वेगळं लिहिलेलं नाव असेल तरी मास्टरशी जुळवा
      inv.lines.push(m ? lineFromMaster(m, "B2C") : { name: n, mrp: 0, b2c: 0, b2b: 0, costB2b: 0, rate: 0, custom: true });
    });
    inv.collection = autoCollection();
    inv.billNo = nextBillNo("B2C");
    showModal();
  }

  function openInvoiceFromBill(rowNum) {
    const bill = (ALL_DATA.bills || []).find((x) => x.rowNum === Number(rowNum));
    if (!bill) return;
    const type = /^B2B-/.test(String(bill.billNo)) ? "B2B" : "B2C";
    inv = baseInv(type);
    inv.save = false; inv.savedOnce = true;
    inv.billNo = bill.billNo;
    inv.date = String(bill.date || todayStr()).slice(0, 10);
    inv.patient.name = bill.patient || "";
    // त्याच नावाचं ताजं बुकिंग असल्यास त्यातून तपशील भरा
    const bk = (ALL_DATA.bookings || []).find((x) => String(x.fullName).trim().toLowerCase() === String(bill.patient).trim().toLowerCase());
    if (bk) {
      Object.assign(inv.patient, { age: bk.age || "", phone: String(bk.phone || ""), address: [bk.address, bk.city].filter(Boolean).join(", "), doctor: bk.doctor || "", pid: bk.patientId || "", sampleDate: String(bk.date || ""), sampleTime: String(bk.time || ""), report: bk.reportMode || "" });
    }
    let coll = 0;
    (bill.tests || []).forEach((x) => {
      if (new RegExp("sample collection charge", "i").test(x.name || "")) { coll += num(x.b2c); return; }
      const m = findMaster(x.name);
      inv.lines.push({ name: x.name, mrp: num(x.mrp), b2c: num(x.b2c), b2b: m ? (num(m.b2b) || num(m.price)) : num(x.b2b), costB2b: num(x.b2b), noB2b: m ? !num(m.b2b) : false, rate: num(x.b2c), custom: !m });
    });
    inv.collAuto = false; inv.collection = coll;
    showModal();
  }
  window.openInvoiceFromBooking = openInvoiceFromBooking;
  window.openInvoiceFromBill = openInvoiceFromBill;

  /* ---------- calc ---------- */
  function calc() {
    const sumRate = inv.lines.reduce((a, l) => a + num(l.rate), 0);
    const sumMrp = inv.lines.reduce((a, l) => a + (num(l.mrp) || num(l.rate)), 0);
    const coll = num(inv.collection);
    return { sumRate, sumMrp, discount: Math.max(0, sumMrp - sumRate), coll, net: sumRate + coll, waived: inv.type === "B2C" && sumRate >= FREE_MIN };
  }

  /* ---------- modal (form) ---------- */
  function ensureModal() {
    let m = document.getElementById("invModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "invModal"; m.className = "inv-modal"; m.hidden = true;
    m.innerHTML = `<div class="inv-modal-sheet"><div class="inv-modal-head"><strong id="invModalTitle"></strong><button type="button" id="invModalClose" aria-label="Close">✕</button></div><div class="inv-modal-body" id="invModalBody"></div></div>`;
    document.body.appendChild(m);
    m.querySelector("#invModalClose").addEventListener("click", closeModal);
    m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
    const body = m.querySelector("#invModalBody");
    body.addEventListener("input", onInput);
    body.addEventListener("change", onInput);
    body.addEventListener("click", onClick);
    return m;
  }
  function closeModal() { const m = document.getElementById("invModal"); if (m) m.hidden = true; }

  function fld(label, path, val, opts = {}) {
    if (opts.area) return `<label class="ib-field"><span>${label}</span><textarea data-f="${path}" rows="2">${esc(val)}</textarea></label>`;
    const type = opts.type ? ` type="${opts.type}"` : ' type="text"';
    const im = opts.inputmode ? ` inputmode="${opts.inputmode}"` : "";
    return `<label class="ib-field"><span>${label}</span><input${type}${im} data-f="${path}" value="${esc(val)}"></label>`;
  }

  function renderBody() {
    const body = document.getElementById("invModalBody");
    document.getElementById("invModalTitle").textContent = "🧾 " + t("ib_title") + " · " + inv.billNo;
    const p = inv.patient, c = inv.client;
    const isB2B = inv.type === "B2B";
    body.innerHTML = `
      <div class="ib-seg" role="tablist">
        <button type="button" class="${!isB2B ? "on" : ""}" data-type="B2C">${t("ib_type_b2c")}</button>
        <button type="button" class="${isB2B ? "on" : ""}" data-type="B2B">${t("ib_type_b2b")}</button>
      </div>
      <label class="ib-field"><span>${t("ib_lang")}</span>
        <select data-f="lang"><option value="en" ${inv.lang === "en" ? "selected" : ""}>English</option><option value="mr" ${inv.lang === "mr" ? "selected" : ""}>मराठी</option><option value="hi" ${inv.lang === "hi" ? "selected" : ""}>हिंदी</option></select>
      </label>

      ${fld(t("ib_bill_date"), "date", toISO(inv.date) || todayStr(), { type: "date" })}

      ${isB2B ? `<h4 class="ib-h">${t("ib_client")}</h4>
        ${allClients().length ? `<label class="ib-field"><span>${t("ib_saved_clients")}</span><select id="ibClientPick"><option value="">${t("ib_pick_client")}</option>${allClients().map((x) => `<option value="${esc(x.name)}" ${norm(x.name) === norm(c.name) ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label>` : ""}
        ${fld(t("ib_client_name"), "client.name", c.name)}
        ${fld(t("ib_client_addr"), "client.address", c.address, { area: true })}
        <div class="ib-row">${fld(t("ib_client_gstin"), "client.gstin", c.gstin)}${fld(t("ib_client_contact"), "client.contact", c.contact)}</div>` : ""}

      <h4 class="ib-h">${t("ib_patient")}</h4>
      ${fld(t("ib_name"), "patient.name", p.name)}
      <div class="ib-row">${fld(t("ib_age"), "patient.age", p.age, { inputmode: "numeric" })}
        <label class="ib-field"><span>${t("ib_gender")}</span><select data-f="patient.gender">
          ${["", "Male", "Female", "Other"].map((g) => `<option value="${g}" ${p.gender === g ? "selected" : ""}>${g || "—"}</option>`).join("")}</select></label></div>
      <div class="ib-row">${fld(t("ib_mobile"), "patient.phone", p.phone, { type: "tel", inputmode: "numeric" })}${fld(t("ib_sample_date"), "patient.sampleDate", toISO(p.sampleDate), { type: "date" })}</div>
      ${fld(t("ib_sample_time"), "patient.sampleTime", p.sampleTime)}
      ${fld(t("ib_addr"), "patient.address", p.address, { area: true })}
      ${fld(t("ib_doc"), "patient.doctor", p.doctor)}

      <h4 class="ib-h">${t("ib_tests")}</h4>
      <div class="ib-suggest-wrap"><input type="text" id="ibSearch" placeholder="${esc(t("ib_search"))}" autocomplete="off" /><div id="ibSuggest" class="ib-suggest" hidden></div></div>
      <div class="ib-row ib-custom"><input type="text" id="ibCustomName" placeholder="${esc(t("ib_custom_name"))}" /><input type="number" id="ibCustomRate" placeholder="₹" min="0" inputmode="numeric" /><button type="button" id="ibCustomAdd" class="mini-btn approve">${t("ib_add")}</button></div>
      <div id="ibLines"></div>

      <label class="ib-field"><span>${t("ib_coll")}</span><input type="number" min="0" inputmode="numeric" id="ibColl" value="${num(inv.collection)}" /></label>
      <p class="ib-hint">${isB2B ? t("ib_coll_b2b") : t("ib_coll_b2c")}</p>
      <div id="ibTotals" class="ib-totals"></div>

      <h4 class="ib-h">${t("ib_pay")}</h4>
      <div class="ib-row">
        <label class="ib-field"><span>${t("ib_pay_mode")}</span><select data-f="pay.mode">${["Cash", "UPI", "Card", "Bank Transfer", "Credit"].map((x) => `<option ${inv.pay.mode === x ? "selected" : ""}>${x}</option>`).join("")}</select></label>
        <label class="ib-field"><span>${t("ib_pay_status")}</span><select data-f="pay.status"><option value="Paid" ${inv.pay.status === "Paid" ? "selected" : ""}>${t("ib_paid")}</option><option value="Unpaid" ${inv.pay.status !== "Paid" ? "selected" : ""}>${t("ib_unpaid")}</option></select></label>
      </div>

      <details class="ib-details"><summary>${t("ib_lab")}</summary>
        ${fld(t("ib_lab_gstin"), "lab.gstin", inv.lab.gstin)}
        ${fld(t("ib_lab_reg"), "lab.reg", inv.lab.reg)}
        ${fld(t("ib_lab_sign"), "lab.sign", inv.lab.sign)}
      </details>

      ${isB2B ? `<label class="ib-check"><input type="checkbox" id="ibSaveClient" ${inv.saveClient ? "checked" : ""}/> <span>${t("ib_save_client")}</span></label><p class="ib-hint">${t("ib_b2b_nosave")}</p>` : `<label class="ib-check"><input type="checkbox" id="ibSave" ${inv.save && !inv.savedOnce ? "checked" : ""} ${inv.savedOnce ? "disabled" : ""}/> <span>${t("ib_save_list")}</span></label>`}
      <button type="button" class="btn btn-block" id="ibPreview" style="background:var(--navy);color:#fff;margin-top:6px">${t("ib_preview")}</button>`;
    renderLines();
  }

  function renderLines() {
    const wrap = document.getElementById("ibLines");
    if (!wrap) return;
    const isB2B = inv.type === "B2B";
    wrap.innerHTML = inv.lines.length === 0 ? `<p class="ib-hint">${t("ib_no_lines")}</p>` : inv.lines.map((l, i) => `
      <div class="ib-line">
        <div class="ib-line-name">${esc(l.name)}</div>
        <div class="ib-line-nums">
          ${!isB2B ? `<label><span>${t("ib_mrp")}</span><input type="number" min="0" inputmode="numeric" data-li="${i}" data-lk="mrp" value="${num(l.mrp)}"></label>` : ""}
          <label><span>${t("ib_rate")}</span><input type="number" min="0" inputmode="numeric" data-li="${i}" data-lk="rate" value="${num(l.rate)}"></label>
          <button type="button" class="ib-x" data-rm="${i}" aria-label="Remove">✕</button>
        </div>
        ${isB2B && l.noB2b && !l.custom ? `<div class="ib-warn">⚠ ${t("ib_no_b2b")}</div>` : ""}
      </div>`).join("");
    renderTotals();
  }

  function renderTotals() {
    const box = document.getElementById("ibTotals");
    if (!box) return;
    const c = calc();
    const collCell = c.waived && c.coll === 0 ? `<s>${rupee(CHARGE)}</s> ${t("ib_waived")}` : rupee(c.coll);
    box.innerHTML = `
      <div><span>${t("ib_sub")}</span><b>${rupee(c.sumRate)}</b></div>
      <div><span>${t("ib_coll_line")}</span><b>${collCell}</b></div>
      <div class="net"><span>${t("ib_net")}</span><b>${rupee(c.net)}</b></div>`;
    const coll = document.getElementById("ibColl");
    if (coll && document.activeElement !== coll) coll.value = num(inv.collection);
  }

  function setPath(path, val) {
    const parts = path.split(".");
    let o = inv;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = val;
  }

  function onInput(e) {
    const el = e.target;
    if (el.id === "ibClientPick") { fillClient(el.value); return; }
    if (el.id === "ibSaveClient") { inv.saveClient = el.checked; return; }
    if (el.dataset.f) {
      setPath(el.dataset.f, el.value);
      // क्लायंटचं नाव सेव्ह केलेल्या नावाशी जुळलं तर बाकी तपशील आपोआप भरा
      if (el.dataset.f === "client.name" && e.type === "change") fillClient(el.value, true);
      return;
    }
    if (el.dataset.li !== undefined) {
      const i = Number(el.dataset.li), k = el.dataset.lk;
      inv.lines[i][k] = num(el.value);
      if (inv.collAuto) inv.collection = autoCollection();
      renderTotals();
      return;
    }
    if (el.id === "ibColl") { inv.collection = num(el.value); inv.collAuto = false; renderTotals(); return; }
    if (el.id === "ibSave") { inv.save = el.checked; return; }
    if (el.id === "ibSearch") {
      const term = el.value.trim().toLowerCase();
      const box = document.getElementById("ibSuggest");
      if (!term) { box.hidden = true; return; }
      const matches = (ALL_DATA.tests || []).filter((x) => String(x.name).toLowerCase().includes(term)).slice(0, 8);
      box.innerHTML = matches.map((x, i) => `<div data-sug="${i}"><strong>${esc(x.name)}</strong><br><small>MRP ₹${x.mrp} · B2C ₹${x.price} · B2B ₹${x.b2b || 0}</small></div>`).join("") || `<div class="ib-none">—</div>`;
      box._m = matches; box.hidden = false;
    }
  }

  function fillClient(name, onlyIfEmpty) {
    const c = allClients().find((x) => norm(x.name) === norm(name));
    if (!c) return;
    const cur = inv.client;
    if (onlyIfEmpty && (cur.address || cur.gstin || cur.contact)) return;
    inv.client = { name: c.name, address: c.address || "", gstin: c.gstin || "", contact: c.contact || "" };
    renderBody();
  }

  function onClick(e) {
    const el = e.target;
    const typeBtn = el.closest("[data-type]");
    if (typeBtn) {
      const type = typeBtn.dataset.type;
      if (type === inv.type) return;
      inv.type = type;
      inv.billNo = nextBillNo(type);
      inv.lines.forEach((l) => {
        if (l.custom) {
          const m = findMaster(l.name);
          if (m) { Object.assign(l, lineFromMaster(m, type)); l.custom = false; }
          return;
        }
        l.rate = type === "B2B" ? l.b2b : l.b2c;   // B2B निवडल्यावर टेस्ट मास्टरचा B2B दर आपोआप
      });
      inv.collAuto = true; inv.collection = autoCollection();
      renderBody();
      return;
    }
    const rm = el.closest("[data-rm]");
    if (rm) { inv.lines.splice(Number(rm.dataset.rm), 1); if (inv.collAuto) inv.collection = autoCollection(); renderLines(); return; }
    const sug = el.closest("[data-sug]");
    if (sug) {
      const box = document.getElementById("ibSuggest");
      const m = box._m[Number(sug.dataset.sug)];
      if (m && !inv.lines.some((l) => l.name.toLowerCase() === m.name.toLowerCase())) {
        inv.lines.push(lineFromMaster(m, inv.type));
        if (inv.collAuto) inv.collection = autoCollection();
      }
      box.hidden = true; document.getElementById("ibSearch").value = "";
      renderLines();
      return;
    }
    if (el.id === "ibCustomAdd") {
      const n = document.getElementById("ibCustomName").value.trim();
      const r = num(document.getElementById("ibCustomRate").value);
      if (!n) return;
      inv.lines.push({ name: n, mrp: r, b2c: r, b2b: r, costB2b: 0, rate: r, custom: true });
      document.getElementById("ibCustomName").value = ""; document.getElementById("ibCustomRate").value = "";
      if (inv.collAuto) inv.collection = autoCollection();
      renderLines();
      return;
    }
    if (el.id === "ibPreview") doPreview();
  }

  function showModal() {
    const m = ensureModal();
    renderBody();
    m.hidden = false;
    document.getElementById("invModalBody").scrollTop = 0;
  }

  /* ---------- save to Bills list (existing addBill action) ---------- */
  function saveToBills() {
    const c = calc();
    const tests = inv.lines.map((l) => ({ name: l.name, mrp: num(l.mrp) || num(l.rate), b2c: num(l.rate), b2b: num(l.costB2b), collection: 0, report: 0 }));
    if (c.coll > 0) tests.push({ name: CHARGE_LINE_NAME, mrp: c.coll, b2c: c.coll, b2b: 0, collection: 0, report: 0 });
    const mrp = tests.reduce((a, x) => a + x.mrp, 0), b2c = tests.reduce((a, x) => a + x.b2c, 0), b2b = tests.reduce((a, x) => a + x.b2b, 0);
    const payload = { billNo: inv.billNo, date: inv.date, patient: inv.patient.name.trim(), tests, mrp, b2c, b2b, collection: 0, report: 0, discount: mrp - b2c, profit: b2c - b2b };
    // त्याच पेशंटचं त्याच दिवसाचं तेच बिल आधीच असेल तर नवी नोंद न करता तीच अपडेट करा (शीटमध्ये डुप्लिकेट नको)
    const key = (x) => String(x.patient).trim().toLowerCase() + "|" + String(x.date).slice(0, 10);
    const names = (arr) => (arr || []).map((x) => norm(x.name)).filter((n) => n !== norm(CHARGE_LINE_NAME)).sort().join("|");
    const existing = (ALL_DATA.bills || []).find((x) => key(x) === key(payload) && names(x.tests) === names(tests) && /^B2C-/.test(String(x.billNo)));
    if (existing) {
      payload.billNo = existing.billNo; inv.billNo = existing.billNo;
      if (existing.rowNum >= 2) postAdminAction({ action: "updateBill", rowNum: existing.rowNum, ...payload }, t("ib_saved"));
    } else {
      postAdminAction({ action: "addBill", ...payload }, t("ib_saved"));
      (ALL_DATA.bills = ALL_DATA.bills || []).push({ rowNum: -1, ...payload });   // लगेच पुन्हा उघडलं तरी डुप्लिकेट होऊ नये
    }
  }


  /* क्लायंट लॅबचे तपशील + आपल्या लॅबचे तपशील Google Sheet मध्ये सेव्ह (पुढच्या वेळी आपोआप दिसतात) */
  function syncToSheet() {
    const prevSelf = selfProfile();
    const selfChanged = prevSelf.gstin !== (inv.lab.gstin || "") || prevSelf.reg !== (inv.lab.reg || "") || prevSelf.sign !== (inv.lab.sign || "");
    if (selfChanged && (inv.lab.gstin || inv.lab.reg || inv.lab.sign)) {
      const rows = (ALL_DATA.clients = ALL_DATA.clients || []).filter((x) => x.type !== "SELF");
      rows.push({ name: LAB.name, gstin: inv.lab.gstin, regNo: inv.lab.reg, signatory: inv.lab.sign, type: "SELF" });
      ALL_DATA.clients = rows;
      postAdminAction({ action: "saveClient", clientType: "SELF", name: LAB.name, gstin: inv.lab.gstin, regNo: inv.lab.reg, signatory: inv.lab.sign }, t("ib_lab_saved"));
    }
    if (inv.type === "B2B" && inv.saveClient && inv.client.name.trim()) {
      const c = inv.client;
      const old = allClients().find((x) => norm(x.name) === norm(c.name));
      const same = old && (old.address || "") === (c.address || "") && (old.gstin || "") === (c.gstin || "") && (old.contact || "") === (c.contact || "");
      if (!same) {
        rememberClient(c);
        postAdminAction({ action: "saveClient", clientType: "CLIENT", name: c.name.trim(), address: c.address, gstin: c.gstin, contact: c.contact }, t("ib_client_saved"));
      }
    }
  }

  function doPreview() {
    if (!inv.patient.name.trim()) { showToast(t("ib_err_name")); return; }
    if (inv.type === "B2B" && !inv.client.name.trim()) { showToast(t("ib_err_client")); return; }
    if (inv.lines.length === 0) { showToast(t("ib_err_lines")); return; }
    inv.date = toISO(inv.date) || todayStr();
    saveProfile({ gstin: inv.lab.gstin, reg: inv.lab.reg, sign: inv.lab.sign });
    syncToSheet();
    if (inv.type === "B2C" && inv.save && !inv.savedOnce) { saveToBills(); inv.savedOnce = true; }
    showInvoice();
  }

  /* ---------- the printable invoice ---------- */
  function stampSVG() {
    return `<svg class="inv-stamp-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-label="Kalyan Pathlab stamp">
      <defs>
        <path id="stTop" d="M 21,60 A 39,39 0 0 1 99,60"/>
        <path id="stBot" d="M 14,60 A 46,46 0 0 0 106,60"/>
      </defs>
      <g fill="none" stroke="#1d3a8a">
        <circle cx="60" cy="60" r="57" stroke-width="2.6"/>
        <circle cx="60" cy="60" r="52" stroke-width="0.9"/>
        <circle cx="60" cy="60" r="29" stroke-width="1.4"/>
      </g>
      <g fill="#1d3a8a" font-family="Arial, Helvetica, sans-serif" font-weight="700">
        <text font-size="9.6" letter-spacing="0.9"><textPath href="#stTop" startOffset="50%" text-anchor="middle">KALYAN PATHLAB</textPath></text>
        <text font-size="7.4" letter-spacing="1"><textPath href="#stBot" startOffset="50%" text-anchor="middle">PATHOLOGY SERVICES</textPath></text>
        <text x="17" y="64" font-size="8" text-anchor="middle">★</text>
        <text x="103" y="64" font-size="8" text-anchor="middle">★</text>
        <g transform="translate(0,4.500) scale(1,1)"><path d="M60 38s9.500 11 9.500 17.500a9.500 9.500 0 0 1-19 0C50.500 49 60 38 60 38z" fill="#1d3a8a"/>
        <path d="M60 50v10M55 55h10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>
              </g>
    </svg>`;
  }

  function buildInvoice() {
    const L = BL[inv.lang] || BL.en;
    const c = calc();
    const isB2B = inv.type === "B2B";
    const p = inv.patient, cl = inv.client, lab = inv.lab;
    const row = (k, v) => (v ? `<tr><td class="k">${k}</td><td class="v">${esc(v)}</td></tr>` : "");
    const lines = inv.lines.map((l, i) => `<tr><td class="c">${i + 1}</td><td>${esc(l.name)}</td>${!isB2B ? `<td class="r">${plain(num(l.mrp) || num(l.rate))}</td>` : ""}<td class="r">${plain(num(l.rate))}</td></tr>`).join("");
    const colSpan = isB2B ? 2 : 3;
    const sampleStr = [fmtDate(p.sampleDate), p.sampleTime].filter(Boolean).join(", ");
    const agesex = [p.age ? p.age + " Y" : "", p.gender].filter(Boolean).join(" / ");
    const upi = (ALL_DATA.settings && ALL_DATA.settings.upiId) || "enterprises60658@nyes";
    const legal = [lab.gstin ? `GSTIN: ${esc(lab.gstin)}` : "", lab.reg ? `${L.regno}: ${esc(lab.reg)}` : ""].filter(Boolean).join(" &nbsp;|&nbsp; ");
    return `
    <div class="inv-page">
      <div class="inv-head">
        <img class="inv-logo" src="./icons/logo.png?v=20261012" alt="Kalyan Pathlab" width="86" height="86" data-fallbacks="./icons/logo.png|./icons/admin-logo.png" data-fail="logo" onerror="window.kpImgFail&&kpImgFail(this)" />
        <div class="inv-lab">
          <div class="inv-lab-name">${esc(LAB.name.toUpperCase())}</div>
          <div class="inv-lab-sub">${esc(LAB.sub)} · ${esc(LAB.managed)}</div>
          <div class="inv-lab-line">${esc(LAB.address)}</div>
          <div class="inv-lab-line">☎ ${esc(LAB.phone)} &nbsp;|&nbsp; ✉ ${esc(LAB.email)}</div>
          ${legal ? `<div class="inv-lab-line strong">${legal}</div>` : ""}
        </div>
        <div class="inv-title-box">
          <div class="inv-title">${isB2B ? L.title_b2b : L.title_b2c}</div>
          <table class="inv-meta">
            <tr><td>${L.bill_no}</td><td><b>${esc(inv.billNo)}</b></td></tr>
            <tr><td>${L.date}</td><td><b>${fmtDate(inv.date)}</b></td></tr>
            ${p.pid ? `<tr><td>${L.pid}</td><td><b>${esc(p.pid)}</b></td></tr>` : ""}
          </table>
        </div>
      </div>
      <div class="inv-rule"></div>

      <div class="inv-grid">
        <div class="inv-box">
          <div class="inv-box-h">${isB2B ? L.billed : L.patient}</div>
          <table class="inv-kv">
            ${isB2B
              ? row(L.name, cl.name) + row(L.address, cl.address) + row(L.gstin, cl.gstin) + row(L.contact, cl.contact) + row(L.patient_ref, [p.name, agesex].filter(Boolean).join(" · "))
              : row(L.name, p.name) + row(L.agesex, agesex) + row(L.mobile, p.phone) + row(L.address, p.address) + row(L.ref, p.doctor || L.self)}
          </table>
        </div>
        <div class="inv-box">
          <div class="inv-box-h">${L.coll}</div>
          <table class="inv-kv">
            ${row(L.sample, sampleStr) + row(L.report, p.report) + row(L.pmode, inv.pay.mode) + row(L.pstatus, inv.pay.status === "Paid" ? L.paid : L.unpaid)}
            ${isB2B && p.phone ? row(L.mobile, p.phone) : ""}
          </table>
        </div>
      </div>

      <table class="inv-table">
        <thead><tr><th class="c" style="width:38px">${L.sr}</th><th>${L.desc}</th>${!isB2B ? `<th class="r" style="width:110px">${L.mrp}</th>` : ""}<th class="r" style="width:110px">${L.rate}</th></tr></thead>
        <tbody>${lines}</tbody>
        <tfoot>
          ${!isB2B ? `<tr><td colspan="${colSpan}" class="r lbl">${L.total_mrp}</td><td class="r">${plain(c.sumMrp)}</td></tr>
          <tr><td colspan="${colSpan}" class="r lbl">${L.discount}</td><td class="r">− ${plain(c.discount)}</td></tr>` : ""}
          <tr><td colspan="${colSpan}" class="r lbl">${L.subtotal}</td><td class="r">${plain(c.sumRate)}</td></tr>
          <tr><td colspan="${colSpan}" class="r lbl">${L.collection}</td><td class="r">${c.coll > 0 ? plain(c.coll) : (c.waived ? `<span class="waived">${L.waived}</span>` : plain(0))}</td></tr>
          <tr class="net"><td colspan="${colSpan}" class="r">${L.net}</td><td class="r">₹ ${plain(c.net)}</td></tr>
        </tfoot>
      </table>
      <div class="inv-words"><b>${L.words}:</b> Rupees ${esc(inWords(c.net))} Only</div>
      ${inv.pay.status !== "Paid" ? `<div class="inv-upi">${L.upi}: <b>${esc(upi)}</b></div>` : ""}

      <div class="inv-foot">
        <div class="inv-terms">
          <div class="inv-box-h">${L.terms}</div>
          <ol>
            <li>${L.t1}</li>
            ${!isB2B ? `<li>${L.t2}</li>` : `<li>${L.t5}</li>`}
            <li>${L.t3}</li>
            <li>${L.t4}</li>
          </ol>
        </div>
        <div class="inv-sign">
          <div class="inv-stamp">${stampSVG()}</div>
          <div class="inv-sign-for">${L.for_lab}</div>
          <div class="inv-sign-line"></div>
          <div class="inv-sign-name">${esc(lab.sign || L.sign)}</div>
          ${lab.sign ? `<div class="inv-sign-sub">${L.sign}</div>` : ""}
        </div>
      </div>
      <div class="inv-thanks">${L.thanks}<br><small>${L.hours}: ${esc(LAB.hours)}</small></div>
    </div>`;
  }

  function ensureOverlay() {
    let o = document.getElementById("invoiceOverlay");
    if (o) return o;
    o = document.createElement("div");
    o.id = "invoiceOverlay"; o.hidden = true;
    o.innerHTML = `
      <div class="inv-toolbar">
        <button type="button" id="invBack"></button>
        <button type="button" id="invPrint" class="primary"></button>
        <button type="button" id="invWa"></button>
      </div>
      <div class="inv-scroll"><div id="invScaleWrap"><div id="invSheet"></div></div></div>`;
    document.body.appendChild(o);
    o.querySelector("#invBack").addEventListener("click", () => { o.hidden = true; });
    o.querySelector("#invPrint").addEventListener("click", () => window.print());
    o.querySelector("#invWa").addEventListener("click", shareWhatsApp);
    window.addEventListener("resize", () => { if (!o.hidden) fitSheet(); });
    return o;
  }

  function fitSheet() {
    const sheet = document.getElementById("invSheet"), wrap = document.getElementById("invScaleWrap");
    const scale = Math.min(1, (window.innerWidth - 16) / 794);
    sheet.style.transform = `scale(${scale})`;
    wrap.style.width = Math.round(794 * scale) + "px";
    wrap.style.height = Math.round(sheet.offsetHeight * scale) + "px";
  }

  function showInvoice() {
    const o = ensureOverlay();
    o.querySelector("#invBack").textContent = t("ib_back_edit");
    o.querySelector("#invPrint").textContent = t("ib_print");
    o.querySelector("#invWa").textContent = t("ib_wa");
    document.getElementById("invSheet").innerHTML = buildInvoice();
    o.hidden = false;
    o.querySelector(".inv-scroll").scrollTop = 0;
    fitSheet();
    // लोगो नंतर लोड झाल्यावर उंची पुन्हा मोजा
    const img = o.querySelector(".inv-logo");
    if (img) img.addEventListener("load", fitSheet);
  }

  function shareWhatsApp() {
    const c = calc();
    const lines = [];
    lines.push(`*${LAB.name}* — ${inv.type === "B2B" ? "Invoice" : "Bill"} ${inv.billNo}`);
    lines.push(`Date: ${fmtDate(inv.date)}`);
    lines.push(`Patient: ${inv.patient.name}`);
    if (inv.type === "B2B" && inv.client.name) lines.push(`Billed to: ${inv.client.name}`);
    lines.push("");
    inv.lines.forEach((l) => lines.push(`• ${l.name} — ${rupee(l.rate)}`));
    lines.push(`Sub-total: ${rupee(c.sumRate)}`);
    lines.push(`Home collection charge: ${c.coll > 0 ? rupee(c.coll) : (c.waived ? "Waived" : rupee(0))}`);
    lines.push(`*Net payable: ${rupee(c.net)}*`);
    lines.push(inv.pay.status === "Paid" ? "Payment: PAID ✓" : "Payment: DUE");
    lines.push("", "Care For Quality • Managed by Sanskar Foundation");
    const digits = String(inv.patient.phone || "").replace(/\D/g, "").slice(-10);
    const to = digits.length === 10 ? "91" + digits : "";
    window.open(`https://wa.me/${to}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }
})();
