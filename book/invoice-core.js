/* =====================================================================
   Kalyan Pathlab — Shared invoice core (admin + patient app)
   KPInv.html(inv, {upi})   -> छापता येणारं A4 बिल (HTML)
   KPInv.pdfBlob(inv, {upi})-> खरी PDF फाईल (Blob) — डाउनलोड/सेव्ह/शेअरसाठी
   KPInv.calc(inv)          -> बेरीज
   inv = { type:"B2C"|"B2B", lang, billNo, date, patient:{...}, client:{...},
           lines:[{name,mrp,rate}], collection, pay:{mode,status}, lab:{gstin,reg,sign} }
   ===================================================================== */
(function (global) {
  "use strict";
  const FREE_MIN = 499;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => Number(v) || 0;
  const plain = (n) => Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  function fmtDate(s) {
    const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}-${m[2]}-${m[1]}` : String(s || "");
  }
  const LAB = {
    name: "Kalyan Pathlab",
    sub: "Pathology Services",
    managed: "Managed by Sanskar Foundation",
    address: "Shop No. 3, 1st Floor, Parvati Apartment, Tisgaon Naka, Kalyan East – 421306",
    phone: "98700 20674 | 88281 11774",
    email: "kalyan.pathlab.21@gmail.com",
    hours: "Mon–Sat 7:00 AM – 9:00 PM · Sun 8:00 AM – 1:00 PM"
  };

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


  function calc(inv) {
    const sumRate = inv.lines.reduce((a, l) => a + num(l.rate), 0);
    const sumMrp = inv.lines.reduce((a, l) => a + (num(l.mrp) || num(l.rate)), 0);
    const coll = num(inv.collection);
    return { sumRate, sumMrp, discount: Math.max(0, sumMrp - sumRate), coll, net: sumRate + coll, waived: inv.type === "B2C" && sumRate >= FREE_MIN };
  }

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


    function html(inv, opts) {
    opts = opts || {};
    const L = BL[inv.lang] || BL.en;
    const c = calc(inv);
    const isB2B = inv.type === "B2B";
    const p = inv.patient, cl = inv.client, lab = inv.lab;
    const row = (k, v) => (v ? `<tr><td class="k">${k}</td><td class="v">${esc(v)}</td></tr>` : "");
    const lines = inv.lines.map((l, i) => `<tr><td class="c">${i + 1}</td><td>${esc(l.name)}</td>${!isB2B ? `<td class="r">${plain(num(l.mrp) || num(l.rate))}</td>` : ""}<td class="r">${plain(num(l.rate))}</td></tr>`).join("");
    const colSpan = isB2B ? 2 : 3;
    const sampleStr = [fmtDate(p.sampleDate), p.sampleTime].filter(Boolean).join(", ");
    const agesex = [p.age ? p.age + " Y" : "", p.gender].filter(Boolean).join(" / ");
    const upi = opts.upi || "enterprises60658@nyes";
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

  /* ---------- खरी PDF फाईल: कॅनव्हासवर बिल काढून PDF मध्ये ठेवतो (सर्व भाषा, स्टॅम्पसह) ---------- */
  const FONT = "'Noto Sans Devanagari','Poppins','Segoe UI',Arial,sans-serif";
  function loadImg(src) {
    return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  }
  function wrap(g, text, maxW) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = []; let cur = "";
    words.forEach((w) => {
      const t = cur ? cur + " " + w : w;
      if (g.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  }
  function rrect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  async function pdfBlob(inv, opts) {
    opts = opts || {};
    const L = BL[inv.lang] || BL.en;
    const c = calc(inv);
    const isB2B = inv.type === "B2B";
    const p = inv.patient, cl = inv.client || {}, lab = inv.lab || {};
    const W = 794, H = 1123, S = 1240 / 794;
    const cv = document.createElement("canvas");
    cv.width = 1240; cv.height = Math.round(H * S);
    const g = cv.getContext("2d");
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (_) {} }
    g.scale(S, S);
    g.fillStyle = "#fff"; g.fillRect(0, 0, W, H);
    g.textBaseline = "alphabetic";
    const NAVY = "#0b1440", RED = "#e5030a", GREY = "#5a5f7d", INK = "#161a2e";
    const font = (w, px) => (g.font = `${w} ${px}px ${FONT}`);
    const T = (txt, x, y, color, align) => { g.fillStyle = color || INK; g.textAlign = align || "left"; g.fillText(String(txt), x, y); };

    // ---- header ----
    const logo = await loadImg("./icons/logo.png");
    g.save(); g.beginPath(); g.arc(36 + 43, 30 + 43, 43, 0, Math.PI * 2); g.clip();
    if (logo) g.drawImage(logo, 36, 30, 86, 86); else { g.fillStyle = "#fff"; g.fillRect(36, 30, 86, 86); }
    g.restore();
    g.strokeStyle = "#e1e4f0"; g.lineWidth = 1; g.beginPath(); g.arc(79, 73, 43, 0, Math.PI * 2); g.stroke();
    font("800", 26); T(LAB.name.toUpperCase(), 138, 56, NAVY);
    font("700", 12.5); T(`${LAB.sub} · ${LAB.managed}`, 138, 76, RED);
    font("400", 11.5);
    let hy = 94;
    wrap(g, LAB.address, 396).forEach((ln) => { T(ln, 138, hy, "#3b4160"); hy += 15; });
    T(`Tel: ${LAB.phone}  |  ${LAB.email}`, 138, hy, "#3b4160"); hy += 15;
    const legal = [lab.gstin ? `GSTIN: ${lab.gstin}` : "", lab.reg ? `${L.regno}: ${lab.reg}` : ""].filter(Boolean).join("   |   ");
    if (legal) { font("700", 11.5); T(legal, 138, hy, NAVY); }
    // title box
    const bx = 552, by = 30, bw = 206;
    const meta = [[L.bill_no, inv.billNo], [L.date, fmtDate(inv.date)]];
    if (p.pid) meta.push([L.pid, p.pid]);
    const bh = 30 + meta.length * 22 + 6;
    g.save(); rrect(g, bx, by, bw, bh, 8); g.clip();
    g.fillStyle = NAVY; g.fillRect(bx, by, bw, 30);
    g.restore();
    g.strokeStyle = NAVY; g.lineWidth = 1.5; rrect(g, bx, by, bw, bh, 8); g.stroke();
    font("800", 14); try { g.letterSpacing = "1.5px"; } catch (_) {}
    T(isB2B ? L.title_b2b : L.title_b2c, bx + bw / 2, by + 20, "#fff", "center");
    try { g.letterSpacing = "0px"; } catch (_) {}
    meta.forEach((m, i) => {
      const yy = by + 30 + 20 + i * 22;
      font("400", 12); T(m[0], bx + 10, yy, GREY);
      font("700", 12); T(m[1], bx + bw - 10, yy, INK, "right");
    });
    // rule
    const ry = Math.max(hy, by + bh) + 16;
    g.fillStyle = NAVY; g.fillRect(36, ry, 722 * 0.7, 4); g.fillStyle = RED; g.fillRect(36 + 722 * 0.7, ry, 722 * 0.3, 4);

    // ---- info boxes ----
    const agesex = [p.age ? p.age + " Y" : "", p.gender].filter(Boolean).join(" / ");
    const sampleStr = [fmtDate(p.sampleDate), p.sampleTime].filter(Boolean).join(", ");
    const leftRows = isB2B
      ? [[L.name, cl.name], [L.address, cl.address], [L.gstin, cl.gstin], [L.contact, cl.contact], [L.patient_ref, [p.name, agesex].filter(Boolean).join(" · ")]]
      : [[L.name, p.name], [L.agesex, agesex], [L.mobile, p.phone], [L.address, p.address], [L.ref, p.doctor || L.self]];
    const rightRows = [[L.sample, sampleStr], [L.report, p.report], [L.pmode, inv.pay.mode], [L.pstatus, inv.pay.status === "Paid" ? L.paid : L.unpaid]];
    if (isB2B && p.phone) rightRows.push([L.mobile, p.phone]);
    const lw = 378, rw = 330, bx1 = 36, bx2 = 36 + lw + 14, iy = ry + 20;
    function measureRows(rows, w) {
      font("700", 12.5);
      return rows.filter((r) => r[1]).map((r) => ({ k: r[0], lines: wrap(g, r[1], w * 0.6 - 16) }));
    }
    const lm = measureRows(leftRows, lw), rm = measureRows(rightRows, rw);
    const rowsH = (m) => m.reduce((a, r) => a + r.lines.length * 16 + 4, 0);
    const ih = 24 + 8 + Math.max(rowsH(lm), rowsH(rm)) + 6;
    function drawBox(x, w, title, m) {
      g.strokeStyle = "#cfd4e8"; g.lineWidth = 1; rrect(g, x, iy, w, ih, 8); g.stroke();
      g.save(); rrect(g, x, iy, w, ih, 8); g.clip(); g.fillStyle = "#eef1fb"; g.fillRect(x, iy, w, 24); g.restore();
      font("800", 11.5); try { g.letterSpacing = "0.6px"; } catch (_) {}
      T(title.toUpperCase(), x + 12, iy + 16, NAVY);
      try { g.letterSpacing = "0px"; } catch (_) {}
      let yy = iy + 24 + 8 + 12;
      m.forEach((r) => {
        font("400", 12.5); T(r.k, x + 12, yy, GREY);
        font("700", 12.5);
        r.lines.forEach((ln, i) => T(ln, x + w * 0.4 + 8, yy + i * 16, INK));
        yy += r.lines.length * 16 + 4;
      });
    }
    drawBox(bx1, lw, isB2B ? L.billed : L.patient, lm);
    drawBox(bx2, rw, L.coll, rm);

    // ---- table ----
    let ty = iy + ih + 16;
    g.fillStyle = NAVY; g.fillRect(36, ty, 722, 32);
    font("700", 12);
    T(L.sr, 36 + 19, ty + 21, "#fff", "center"); T(L.desc, 36 + 48, ty + 21, "#fff");
    const rateX = 758 - 10, mrpX = rateX - 110;
    if (!isB2B) T(L.mrp, mrpX, ty + 21, "#fff", "right");
    T(L.rate, rateX, ty + 21, "#fff", "right");
    ty += 32;
    inv.lines.forEach((l, i) => {
      font("400", 12.5);
      const maxW = (isB2B ? rateX - 130 : mrpX - 130) - 36;
      const nl = wrap(g, l.name, maxW);
      const rh = Math.max(30, nl.length * 16 + 14);
      T(String(i + 1), 36 + 19, ty + 20, INK, "center");
      nl.forEach((ln, k) => T(ln, 36 + 48, ty + 20 + k * 16, INK));
      if (!isB2B) T(plain(num(l.mrp) || num(l.rate)), mrpX, ty + 20, INK, "right");
      T(plain(num(l.rate)), rateX, ty + 20, INK, "right");
      g.strokeStyle = "#e1e4f0"; g.lineWidth = 1; g.beginPath(); g.moveTo(36, ty + rh); g.lineTo(758, ty + rh); g.stroke();
      ty += rh;
    });
    g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.moveTo(36, ty); g.lineTo(758, ty); g.stroke();
    ty += 4;
    const tot = (label, val, color) => { font("400", 12.5); T(label, (isB2B ? rateX : mrpX) - 30 + (isB2B ? 0 : 0), ty + 17, "#4a4f6e", "right"); font("400", 12.5); T(val, rateX, ty + 17, color || INK, "right"); ty += 24; };
    const labelRight = rateX - 125;
    const totRow = (label, val, color) => { font("400", 12.5); T(label, labelRight + (isB2B ? 0 : 0), ty + 17, "#4a4f6e", "right"); T(val, rateX, ty + 17, color || INK, "right"); ty += 24; };
    if (!isB2B) { totRow(L.total_mrp, plain(c.sumMrp)); totRow(L.discount, "- " + plain(c.discount)); }
    totRow(L.subtotal, plain(c.sumRate));
    totRow(L.collection, c.coll > 0 ? plain(c.coll) : (c.waived ? L.waived : plain(0)), c.coll > 0 ? INK : (c.waived ? "#12793f" : INK));
    g.fillStyle = NAVY; g.fillRect(36, ty + 2, 722, 38);
    font("800", 15); T(L.net, labelRight, ty + 27, "#fff", "right"); T("Rs. " + plain(c.net), rateX, ty + 27, "#fff", "right");
    ty += 40 + 12;
    // words
    g.fillStyle = "#fff8e1"; g.fillRect(36, ty, 722, 30); g.fillStyle = "#f5b400"; g.fillRect(36, ty, 4, 30);
    font("700", 12.5); T(L.words + ":", 50, ty + 19, INK);
    const wl = g.measureText(L.words + ": ").width;
    font("400", 12.5); T("Rupees " + inWords(c.net) + " Only", 50 + wl, ty + 19, INK);
    ty += 30;
    if (inv.pay.status !== "Paid") { ty += 8; font("400", 12.5); T(L.upi + ": ", 36, ty + 14, NAVY); const uw = g.measureText(L.upi + ": ").width; font("700", 12.5); T(opts.upi || "enterprises60658@nyes", 36 + uw, ty + 14, NAVY); }

    // ---- footer ----
    const footBottom = H - 86;
    // terms
    const terms = [L.t1, !isB2B ? L.t2 : L.t5, L.t3, L.t4];
    font("400", 11);
    const tl = terms.map((tx, i) => wrap(g, `${i + 1}. ${tx}`, 440));
    const th = 24 + 8 + tl.reduce((a, l) => a + l.length * 15, 0) + 8;
    const fy = footBottom - Math.max(th, 190);
    g.strokeStyle = "#cfd4e8"; g.lineWidth = 1; rrect(g, 36, footBottom - th, 472, th, 8); g.stroke();
    g.save(); rrect(g, 36, footBottom - th, 472, th, 8); g.clip(); g.fillStyle = "#eef1fb"; g.fillRect(36, footBottom - th, 472, 24); g.restore();
    font("800", 11.5); T(L.terms.toUpperCase(), 48, footBottom - th + 16, NAVY);
    let tyy = footBottom - th + 24 + 18;
    font("400", 11);
    tl.forEach((ls) => ls.forEach((ln) => { T(ln, 48, tyy, "#3b4160"); tyy += 15; }));
    // stamp
    const svgStr = stampSVG().replace("<svg ", '<svg width="236" height="236" ');
    const stampImg = await loadImg("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgStr));
    const sx = 758 - 115;
    if (stampImg) { g.save(); g.translate(sx, footBottom - 130); g.rotate(-11 * Math.PI / 180); g.globalAlpha = 0.9; g.drawImage(stampImg, -59, -59, 118, 118); g.restore(); }
    font("400", 11.5); T(L.for_lab, sx, footBottom - 58, "#4a4f6e", "center");
    g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.moveTo(758 - 220, footBottom - 24); g.lineTo(758 - 10, footBottom - 24); g.stroke();
    font("700", 12.5); T(lab.sign || L.sign, sx, footBottom - 6, NAVY, "center");
    // thanks
    g.fillStyle = RED; g.fillRect(36, H - 60, 722, 2);
    font("700", 11.5); T(L.thanks, W / 2, H - 40, NAVY, "center");
    font("400", 10.5); T(`${L.hours}: ${LAB.hours}`, W / 2, H - 24, GREY, "center");

    const jpeg = await new Promise((res) => cv.toBlob(res, "image/jpeg", 0.92));
    if (!jpeg) throw new Error("canvas export failed");
    const bytes = new Uint8Array(await jpeg.arrayBuffer());
    return jpegToPdf(bytes, cv.width, cv.height);
  }

  // एका JPEG चित्राचं (A4) PDF
  function jpegToPdf(jpg, wPx, hPx) {
    const enc = new TextEncoder();
    const chunks = []; const offs = []; let pos = 0;
    const add = (d) => { const u = typeof d === "string" ? enc.encode(d) : d; chunks.push(u); pos += u.length; };
    const PW = 595.28, PH = 841.89;
    add("%PDF-1.4\n");
    offs[1] = pos; add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    offs[2] = pos; add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    offs[3] = pos; add(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>\nendobj\n`);
    const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
    offs[4] = pos; add(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
    offs[5] = pos; add(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${wPx} /Height ${hPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
    add(jpg); add("\nendstream\nendobj\n");
    const xref = pos;
    let x = "xref\n0 6\n0000000000 65535 f \n";
    for (let i = 1; i <= 5; i++) x += String(offs[i]).padStart(10, "0") + " 00000 n \n";
    add(x + `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(chunks, { type: "application/pdf" });
  }

  global.KPInv = { html, calc, pdfBlob, inWords, LAB, BL, fmtDate, FREE_MIN };
})(window);
