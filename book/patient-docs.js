/* =====================================================================
   Kalyan Pathlab — Patient app: बुकिंग इतिहास, रिपोर्ट (पहा/डाउनलोड/सेव्ह/शेअर),
   बिल (PDF), टेस्ट बास्केट, आणि अ‍ॅप पुन्हा उघडल्यावर मागची स्थिती.
   app.js नंतर लोड होतो.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- भाषांतर ---------------- */
  Object.assign(TRANSLATIONS, {
    hist_title: { mr: "माझ्या बुकिंग्स व रिपोर्ट्स", hi: "मेरी बुकिंग्स व रिपोर्ट्स", en: "My bookings & reports" },
    hist_total: { mr: "बुकिंग्स", hi: "बुकिंग्स", en: "Bookings" },
    hist_done: { mr: "पूर्ण", hi: "पूर्ण", en: "Completed" },
    hist_reports: { mr: "रिपोर्ट्स", hi: "रिपोर्ट्स", en: "Reports" },
    f_all: { mr: "सर्व", hi: "सभी", en: "All" },
    f_upcoming: { mr: "येणाऱ्या", hi: "आने वाली", en: "Upcoming" },
    f_done: { mr: "पूर्ण", hi: "पूर्ण", en: "Completed" },
    f_cancelled: { mr: "रद्द", hi: "रद्द", en: "Cancelled" },
    hist_empty_filter: { mr: "या गटात बुकिंग नाही.", hi: "इस वर्ग में बुकिंग नहीं।", en: "No bookings in this group." },
    btn_bill: { mr: "बिल", hi: "बिल", en: "Bill" },
    btn_save: { mr: "सेव्ह", hi: "सेव", en: "Save" },
    btn_share: { mr: "शेअर", hi: "शेयर", en: "Share" },
    report_shared_on: { mr: "रिपोर्ट शेअर केला: {d}", hi: "रिपोर्ट शेयर की: {d}", en: "Report shared: {d}" },
    rep_preparing: { mr: "फाईल तयार होत आहे…", hi: "फ़ाइल तैयार हो रही है…", en: "Preparing file…" },
    rep_failed: { mr: "रिपोर्ट फाईल थेट मिळाली नाही — Drive लिंकने उघडत आहे.", hi: "रिपोर्ट फ़ाइल सीधे नहीं मिली — Drive लिंक से खोल रहे हैं।", en: "Couldn't fetch the file directly — using the Drive link." },
    toast_shared: { mr: "रिपोर्ट शेअर झाला ✓ (नोंद झाली)", hi: "रिपोर्ट शेयर हुई ✓ (दर्ज हुआ)", en: "Report shared ✓ (recorded)" },
    toast_saved: { mr: "सेव्ह झाला ✓", hi: "सेव हुआ ✓", en: "Saved ✓" },
    toast_downloading: { mr: "डाउनलोड सुरू झाला…", hi: "डाउनलोड शुरू…", en: "Download started…" },
    bill_title: { mr: "बिल", hi: "बिल", en: "Bill" },
    bucket_title: { mr: "माझी टेस्ट बास्केट", hi: "मेरी टेस्ट बास्केट", en: "My test basket" },
    bucket_empty: { mr: "बास्केट रिकामी आहे.", hi: "बास्केट खाली है।", en: "Your basket is empty." },
    bucket_add_more: { mr: "आणखी टेस्ट जोडा", hi: "और टेस्ट जोड़ें", en: "Add more tests" },
    bucket_book: { mr: "बुक करा →", hi: "बुक करें →", en: "Book now →" },
    snack_added: { mr: "जोडली ✓", hi: "जोड़ी ✓", en: "added ✓" },
    snack_more: { mr: "+ आणखी टेस्ट", hi: "+ और टेस्ट", en: "+ More tests" },
    snack_book: { mr: "बुक करा →", hi: "बुक करें →", en: "Book →" },
    back_word: { mr: "← मागे", hi: "← पीछे", en: "← Back" }
  });

  const APPS = () => CONFIG.appsScriptUrl;
  const phoneNow = () => document.getElementById("statusPhoneInput").value.trim();
  const esc = (s) => escapeHtml(s);
  const tt = (k, vals) => String(t(k)).replace(/\{(\w+)\}/g, (_, x) => (vals && vals[x] !== undefined ? vals[x] : ""));
  const locale = () => (currentLang === "mr" ? "mr-IN" : currentLang === "hi" ? "hi-IN" : "en-IN");

  function toISO(s) {
    s = String(s || "").trim();
    let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
    m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
    if (m) return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
    return "";
  }
  const dateObj = (iso) => (iso ? new Date(iso + "T00:00:00") : null);

  /* ---------------- ओव्हरले + मोबाईल "Back" बटण ---------------- */
  const overlayStack = [];
  function pushOverlay(closeFn) {
    overlayStack.push(closeFn);
    history.pushState({ s: "overlay" }, "");
  }
  function popOverlayByUI() { if (overlayStack.length) history.back(); }
  // app.js चा popstate हँडलर हे आधी विचारतो
  function closeIfOpen() {
    if (!overlayStack.length) return false;
    const fn = overlayStack.pop();
    try { fn(); } catch (_) {}
    return true;
  }

  /* ---------------- फाईल हेल्पर्स ---------------- */
  function downloadBlob(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  async function saveFile(blob, name) {
    if (window.showSaveFilePicker) {
      try {
        const h = await window.showSaveFilePicker({ suggestedName: name, types: [{ description: "PDF", accept: { "application/pdf": [".pdf"] } }] });
        const w = await h.createWritable(); await w.write(blob); await w.close(); return "saved";
      } catch (e) { if (e && e.name === "AbortError") return "cancel"; }
    }
    const f = new File([blob], name, { type: blob.type || "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) {
      try { await navigator.share({ files: [f], title: name }); return "saved"; } catch (e) { if (e && e.name === "AbortError") return "cancel"; }
    }
    downloadBlob(blob, name); return "downloaded";
  }
  // शेअर: फाईल (PDF) शक्य असेल तर, नाहीतर लिंक. परत: "shared" | "link" | "cancel"
  async function shareFile(blob, name, title, text, linkUrl) {
    const f = blob ? new File([blob], name, { type: blob.type || "application/pdf" }) : null;
    if (f && navigator.canShare && navigator.canShare({ files: [f] })) {
      try { await navigator.share({ files: [f], title, text }); return "shared"; } catch (e) { if (e && e.name === "AbortError") return "cancel"; }
    }
    if (navigator.share && linkUrl) {
      try { await navigator.share({ title, text, url: linkUrl }); return "link"; } catch (e) { if (e && e.name === "AbortError") return "cancel"; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text + (linkUrl ? "\n" + linkUrl : ""))}`, "_blank");
    return "link";
  }

  /* ---------------- रिपोर्ट फाईल (बॅकएंडकडून base64) ---------------- */
  const blobCache = {};
  async function getReportBlob(b) {
    if (blobCache[b.rowNum]) return blobCache[b.rowNum];
    const res = await fetch(`${APPS()}?action=getReportFile&rowNum=${b.rowNum}&phone=${encodeURIComponent(phoneNow())}`);
    const j = await res.json();
    if (!j || !j.ok) throw new Error((j && j.error) || "no_file");
    const bin = atob(j.data); const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const out = { blob: new Blob([arr], { type: j.mime || "application/pdf" }), name: (j.name || `Report-${b.rowNum}.pdf`).replace(/[^\w.\- ]+/g, "_") };
    blobCache[b.rowNum] = out;
    return out;
  }

  function nowStamp() {
    const d = new Date(), p = (x) => String(x).padStart(2, "0");
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function markShared(b, via) {
    b.reportShared = nowStamp();
    try {
      fetch(APPS(), { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "markReportShared", rowNum: b.rowNum, phone: phoneNow(), via }) });
    } catch (_) {}
    showToast(t("toast_shared"));
    render(histData);
    paintViewerNote(b);
  }

  /* ---------------- रिपोर्ट व्ह्यूअर (अ‍ॅपच्या आतच) ---------------- */
  let curReport = null;
  function ensureViewer() {
    let m = document.getElementById("reportModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "reportModal"; m.className = "rep-modal"; m.hidden = true;
    m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = `
      <div class="rep-head"><button type="button" id="repClose"></button><strong id="repTitle"></strong></div>
      <div class="rep-frame"><iframe id="repFrame" title="Report"></iframe><div id="repLoading" class="rep-loading"></div></div>
      <div id="repNote" class="rep-note"></div>
      <div class="rep-bar">
        <button type="button" id="repDownload"></button>
        <button type="button" id="repSave"></button>
        <button type="button" id="repShare" class="primary"></button>
      </div>`;
    document.body.appendChild(m);
    m.querySelector("#repClose").addEventListener("click", popOverlayByUI);
    m.querySelector("#repFrame").addEventListener("load", () => { m.querySelector("#repLoading").hidden = true; });
    m.querySelector("#repDownload").addEventListener("click", () => reportAction("download"));
    m.querySelector("#repSave").addEventListener("click", () => reportAction("save"));
    m.querySelector("#repShare").addEventListener("click", () => reportAction("share"));
    return m;
  }
  function paintViewerNote(b) {
    const n = document.getElementById("repNote");
    if (!n) return;
    n.textContent = b && b.reportShared ? "📤 " + tt("report_shared_on", { d: b.reportShared }) : "";
    n.hidden = !(b && b.reportShared);
  }
  function openViewer(b) {
    const m = ensureViewer();
    curReport = b;
    const l = reportLinks(b.reportLink);
    m.querySelector("#repClose").textContent = t("back_word");
    m.querySelector("#repTitle").textContent = b.tests || "Report";
    m.querySelector("#repDownload").textContent = "⬇ " + t("btn_dl_short");
    m.querySelector("#repSave").textContent = "💾 " + t("btn_save");
    m.querySelector("#repShare").textContent = "📤 " + t("btn_share");
    const ld = m.querySelector("#repLoading"); ld.hidden = false; ld.textContent = t("rep_preparing");
    m.querySelector("#repFrame").src = l.view.replace(/\/view.*$/, "/preview");
    paintViewerNote(b);
    m.hidden = false;
    pushOverlay(() => { m.hidden = true; m.querySelector("#repFrame").src = "about:blank"; curReport = null; });
  }

  async function reportAction(kind) {
    const b = curReport; if (!b) return;
    const l = reportLinks(b.reportLink);
    let file = null;
    showToast(t("rep_preparing"));
    try { file = await getReportBlob(b); } catch (_) { file = null; }
    if (!file && kind !== "share") { showToast(t("rep_failed")); window.open(l.dl, "_blank"); return; }
    if (kind === "download") { downloadBlob(file.blob, file.name); showToast(t("toast_downloading")); return; }
    if (kind === "save") { const r = await saveFile(file.blob, file.name); if (r !== "cancel") showToast(r === "downloaded" ? t("toast_downloading") : t("toast_saved")); return; }
    // share
    const text = `Kalyan Pathlab — ${b.tests || "Report"}`;
    const r = await shareFile(file ? file.blob : null, file ? file.name : "report.pdf", "Kalyan Pathlab Report", text, l.view);
    if (r !== "cancel") markShared(b, r === "shared" ? "file" : "link");
  }

  /* ---------------- बिल (पेशंट) ---------------- */
  function matchTests(str) {
    const all = [];
    (TEST_CATEGORIES || []).forEach((c) => (c.tests || []).forEach((x) => all.push(x)));
    const orig = String(str || ""); const low = orig.toLowerCase(); let work = low; const found = [];
    all.filter((x) => x.name).sort((a, b) => b.name.length - a.name.length).forEach((m) => {
      const nm = m.name.toLowerCase(); const idx = work.indexOf(nm);
      if (idx >= 0) { found.push({ idx, m }); work = work.slice(0, idx) + "\u0000".repeat(nm.length) + work.slice(idx + nm.length); }
    });
    found.sort((a, b) => a.idx - b.idx);
    const rest = work.replace(/\u0000+/g, ",").split(",").map((x) => x.trim()).filter((x) => x.length > 1)
      .map((r) => { const p = low.indexOf(r); return p >= 0 ? orig.substr(p, r.length) : r; });
    return { found: found.map((f) => f.m), rest };
  }
  function billFromBooking(b) {
    const { found, rest } = matchTests(b.tests);
    const lines = found.map((m) => ({ name: m.name, mrp: Number(m.mrp) || Number(m.price), rate: Number(m.price) }));
    const sum = lines.reduce((a, l) => a + l.rate, 0);
    const net = Number(b.amount) || sum;
    let coll = 0;
    if (rest.length === 0) coll = Math.min(100, Math.max(0, net - sum));
    else {
      const remainder = Math.max(0, net - sum);
      rest.forEach((n) => lines.push({ name: n, mrp: Math.round(remainder / rest.length), rate: Math.round(remainder / rest.length) }));
    }
    const iso = toISO(b.date) || new Date().toISOString().slice(0, 10);
    return {
      type: "B2C", lang: "en", billNo: `KPL-${iso.replace(/-/g, "").slice(2)}-${String(b.rowNum || 0).padStart(4, "0")}`, date: iso,
      patient: { name: b.fullName || "", age: b.age || "", gender: "", phone: String(b.phone || phoneNow()), address: [b.address, b.city].filter(Boolean).join(", "), doctor: b.doctor || "", pid: b.patientId || "", sampleDate: iso, sampleTime: b.time || "", report: b.reportMode || "" },
      client: {}, lines, collection: coll,
      pay: { mode: /upi/i.test(b.paymentMethod || "") ? "UPI" : "Cash", status: b.status === "Completed" ? "Paid" : "Unpaid" },
      lab: {}
    };
  }

  let curBill = null;
  function ensureBillOverlay() {
    let o = document.getElementById("invoiceOverlay");
    if (o) return o;
    o = document.createElement("div");
    o.id = "invoiceOverlay"; o.hidden = true;
    o.innerHTML = `
      <div class="inv-toolbar">
        <button type="button" id="pbBack"></button>
        <button type="button" id="pbPdf" class="primary"></button>
        <button type="button" id="pbSave"></button>
        <button type="button" id="pbShare"></button>
        <button type="button" id="pbPrint"></button>
      </div>
      <div class="inv-scroll"><div id="invScaleWrap"><div id="invSheet"></div></div></div>`;
    document.body.appendChild(o);
    o.querySelector("#pbBack").addEventListener("click", popOverlayByUI);
    o.querySelector("#pbPrint").addEventListener("click", () => window.print());
    o.querySelector("#pbPdf").addEventListener("click", () => billAction("download"));
    o.querySelector("#pbSave").addEventListener("click", () => billAction("save"));
    o.querySelector("#pbShare").addEventListener("click", () => billAction("share"));
    window.addEventListener("resize", () => { if (!o.hidden) fitBill(); });
    return o;
  }
  function fitBill() {
    const sheet = document.getElementById("invSheet"), wrap = document.getElementById("invScaleWrap");
    const scale = Math.min(1, (window.innerWidth - 16) / 794);
    sheet.style.transform = `scale(${scale})`;
    wrap.style.width = Math.round(794 * scale) + "px";
    wrap.style.height = Math.round(sheet.offsetHeight * scale) + "px";
  }
  function openBill(b) {
    curBill = billFromBooking(b);
    const o = ensureBillOverlay();
    o.querySelector("#pbBack").textContent = t("back_word");
    o.querySelector("#pbPdf").textContent = "⬇ PDF";
    o.querySelector("#pbSave").textContent = "💾 " + t("btn_save");
    o.querySelector("#pbShare").textContent = "📤 " + t("btn_share");
    o.querySelector("#pbPrint").textContent = "🖨";
    o.querySelector("#invSheet").innerHTML = KPInv.html(curBill, { upi: (typeof liveSettings !== "undefined" && liveSettings.upiId) || "enterprises60658@nyes" });
    o.hidden = false;
    o.querySelector(".inv-scroll").scrollTop = 0;
    fitBill();
    const img = o.querySelector(".inv-logo"); if (img) img.addEventListener("load", fitBill);
    pushOverlay(() => { o.hidden = true; curBill = null; });
  }
  async function billAction(kind) {
    if (!curBill) return;
    showToast(t("rep_preparing"));
    let blob;
    try { blob = await KPInv.pdfBlob(curBill, { upi: (typeof liveSettings !== "undefined" && liveSettings.upiId) || "enterprises60658@nyes" }); }
    catch (_) { showToast("PDF error — 🖨"); return; }
    const name = `${curBill.billNo}.pdf`;
    if (kind === "download") { downloadBlob(blob, name); showToast(t("toast_downloading")); }
    else if (kind === "save") { const r = await saveFile(blob, name); if (r !== "cancel") showToast(r === "downloaded" ? t("toast_downloading") : t("toast_saved")); }
    else await shareFile(blob, name, `Kalyan Pathlab — ${curBill.billNo}`, `Kalyan Pathlab — Bill ${curBill.billNo}`, "");
  }

  /* ---------------- बुकिंग इतिहास (तारखेनुसार) ---------------- */
  let histData = [];
  let histFilter = "all";
  const GROUP = (s) => (s === "Completed" ? "done" : s === "Cancelled" ? "cancelled" : "upcoming");

  function render(bookings) {
    histData = bookings || [];
    const wrap = document.getElementById("statusResultWrap");
    if (!histData.length) {
      wrap.innerHTML = `<p class="empty-msg" style="text-align:center;color:var(--muted);padding:14px 0;">${t("no_booking_found")}</p>`;
      return;
    }
    const total = histData.length;
    const done = histData.filter((b) => b.status === "Completed").length;
    const reports = histData.filter((b) => b.reportLink).length;
    const list = histData.filter((b) => histFilter === "all" || GROUP(b.status) === histFilter)
      .sort((a, b) => (toISO(b.date) || "").localeCompare(toISO(a.date) || "") || (b.rowNum || 0) - (a.rowNum || 0));

    // महिन्यानुसार गट
    const groups = []; const idx = {};
    list.forEach((b) => {
      const iso = toISO(b.date); const d = dateObj(iso);
      const key = iso ? iso.slice(0, 7) : "x";
      if (!(key in idx)) { idx[key] = groups.length; groups.push({ key, label: d ? d.toLocaleDateString(locale(), { month: "long", year: "numeric" }) : "—", items: [] }); }
      groups[idx[key]].items.push(b);
    });

    const chip = (id, label, n) => `<button type="button" class="hist-chip ${histFilter === id ? "on" : ""}" data-f="${id}">${label}${n !== undefined ? ` <i>${n}</i>` : ""}</button>`;
    const cnt = (g) => histData.filter((b) => GROUP(b.status) === g).length;

    wrap.innerHTML = `
      <div class="hist-head">${t("hist_title")}</div>
      <div class="hist-summary">
        <div><b>${total}</b><span>${t("hist_total")}</span></div>
        <div><b>${done}</b><span>${t("hist_done")}</span></div>
        <div><b>${reports}</b><span>${t("hist_reports")}</span></div>
      </div>
      <div class="hist-filters">${chip("all", t("f_all"), total)}${chip("upcoming", t("f_upcoming"), cnt("upcoming"))}${chip("done", t("f_done"), cnt("done"))}${chip("cancelled", t("f_cancelled"), cnt("cancelled"))}</div>
      ${groups.length ? groups.map((g) => `
        <div class="hist-month">${esc(g.label)}</div>
        ${g.items.map(cardHtml).join("")}`).join("") : `<p class="empty-msg" style="text-align:center;color:var(--muted);padding:14px 0;">${t("hist_empty_filter")}</p>`}`;

    wrap.querySelectorAll(".hist-chip").forEach((c) => c.addEventListener("click", () => { histFilter = c.dataset.f; render(histData); }));
    wrap.querySelectorAll("[data-act]").forEach((el) => el.addEventListener("click", () => onAct(el)));
  }

  function cardHtml(b) {
    const s = statusLabel(b.status);
    const iso = toISO(b.date); const d = dateObj(iso);
    const day = d ? String(d.getDate()).padStart(2, "0") : "--";
    const mon = d ? d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase() : "";
    const canCancel = b.rowNum && (b.status === "Pending Confirmation" || b.status === "Confirmed");
    const hasReport = !!b.reportLink;
    const canBill = b.status === "Completed";
    const actions = [];
    if (hasReport) {
      actions.push(`<button type="button" class="hist-btn pri" data-act="view" data-row="${b.rowNum}">👁 ${t("report_view")}</button>`);
      actions.push(`<button type="button" class="hist-btn" data-act="dl" data-row="${b.rowNum}">⬇ ${t("btn_dl_short")}</button>`);
      actions.push(`<button type="button" class="hist-btn" data-act="share" data-row="${b.rowNum}">📤 ${t("btn_share")}</button>`);
    }
    if (canBill) actions.push(`<button type="button" class="hist-btn" data-act="bill" data-row="${b.rowNum}">🧾 ${t("btn_bill")}</button>`);
    return `<article class="hist-card">
      <div class="hist-date"><b>${day}</b><span>${mon}</span></div>
      <div class="hist-main">
        <div class="hist-top"><span class="status-pill ${s.cls}">${s.text}</span>${b.amount ? `<span class="hist-amt">₹${esc(b.amount)}</span>` : ""}</div>
        <div class="hist-tests">${esc(b.tests || "-")}</div>
        <div class="hist-meta">🕒 ${esc(b.time || "")}${b.paymentMethod ? " · 💳 " + esc(b.paymentMethod) : ""}</div>
        ${statusTimeline(b.status)}
        ${b.reportShared ? `<div class="hist-shared">📤 ${tt("report_shared_on", { d: esc(b.reportShared) })}</div>` : ""}
        ${actions.length ? `<div class="hist-actions">${actions.join("")}</div>` : ""}
        ${canCancel ? `<button type="button" class="btn btn-cancel btn-block cancel-booking-btn" data-act="cancel" data-row="${b.rowNum}" data-tests="${esc(b.tests || "")}" data-when="${esc(String(b.date || "") + " " + String(b.time || ""))}">❌ ${t("btn_cancel_booking")}</button>` : ""}
      </div>
    </article>`;
  }

  async function onAct(el) {
    const b = histData.find((x) => String(x.rowNum) === el.dataset.row);
    if (!b) return;
    const act = el.dataset.act;
    if (act === "cancel") { askCancelBooking(el); return; }
    if (act === "view") { openViewer(b); return; }
    if (act === "bill") { openBill(b); return; }
    // थेट डाउनलोड / शेअर (व्ह्यूअर न उघडता)
    curReport = b;
    if (act === "dl") await reportAction("download");
    if (act === "share") await reportAction("share");
    if (!overlayStack.length) curReport = null;
  }

  /* ---------------- टेस्ट बास्केट + "जोडली" पट्टी ---------------- */
  function ensureBucket() {
    let s = document.getElementById("bucketSheet");
    if (s) return s;
    s = document.createElement("div");
    s.id = "bucketSheet"; s.className = "dlg-backdrop bucket-backdrop"; s.hidden = true;
    s.innerHTML = `<div class="bucket-sheet" role="dialog" aria-modal="true" aria-labelledby="bucketTitle">
        <div class="bucket-head"><strong id="bucketTitle"></strong><button type="button" id="bucketClose" aria-label="Close">✕</button></div>
        <div id="bucketBody" class="bucket-body"></div>
        <div class="bucket-foot">
          <button type="button" class="btn btn-outline" id="bucketMore"></button>
          <button type="button" class="btn btn-primary" id="bucketBook"></button>
        </div></div>`;
    document.body.appendChild(s);
    s.addEventListener("click", (e) => { if (e.target === s) s.hidden = true; });
    s.querySelector("#bucketClose").addEventListener("click", () => { s.hidden = true; });
    s.querySelector("#bucketMore").addEventListener("click", () => { s.hidden = true; showSection("tests"); });
    s.querySelector("#bucketBook").addEventListener("click", () => { s.hidden = true; askChargePopup(() => showSection("booking")); });
    s.querySelector("#bucketBody").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-rm]");
      if (rm) { selectedTests.splice(Number(rm.dataset.rm), 1); updateCartBar(); updateUpiLink(); renderSelected(); if (typeof renderPopularTests === "function") renderPopularTests(); paintBucket(); }
    });
    return s;
  }
  function paintBucket() {
    const s = ensureBucket(); const c = calcTotals();
    s.querySelector("#bucketTitle").textContent = "🧺 " + t("bucket_title");
    s.querySelector("#bucketMore").textContent = t("bucket_add_more");
    s.querySelector("#bucketBook").textContent = t("bucket_book");
    const body = s.querySelector("#bucketBody");
    if (!selectedTests.length) { body.innerHTML = `<p class="empty-msg" style="text-align:center;color:var(--muted);padding:18px 0">${t("bucket_empty")}</p>`; s.querySelector("#bucketBook").disabled = true; return; }
    s.querySelector("#bucketBook").disabled = false;
    body.innerHTML = selectedTests.map((x, i) => `<div class="bucket-row"><span>${esc(x.name)}</span><b>₹${x.price}</b><button type="button" data-rm="${i}" aria-label="Remove">✕</button></div>`).join("") +
      `<div class="charge-box ${c.waived ? "ok" : "warn"}" style="margin-top:10px">
        <div class="cb-row"><span>${t("charge_line_sub")}</span><b>₹${c.subtotal}</b></div>
        ${c.waived ? `<div class="cb-row ok"><span>${t("charge_line_waived")}</span><b><s>₹${COLLECTION_CHARGE}</s> ₹0</b></div>` : `<div class="cb-row"><span>${t("charge_line_charge")}</span><b>+₹${c.charge}</b></div><div class="cb-hint">${fillTpl(t("cart_note_charge"), { more: c.more })}</div>`}
        <div class="cb-row total"><span>${t("charge_line_total")}</span><b>₹${c.total}</b></div></div>`;
  }
  function openBucket() { ensureBucket(); paintBucket(); document.getElementById("bucketSheet").hidden = false; }

  let snackTimer = null;
  function ensureSnack() {
    let s = document.getElementById("addSnack");
    if (s) return s;
    s = document.createElement("div");
    s.id = "addSnack"; s.className = "add-snack"; s.hidden = true; s.setAttribute("role", "status");
    s.innerHTML = `<div class="add-snack-text"></div><div class="add-snack-btns"><button type="button" id="snackMore"></button><button type="button" id="snackBook" class="primary"></button></div>`;
    document.body.appendChild(s);
    s.querySelector("#snackMore").addEventListener("click", () => { s.hidden = true; });
    s.querySelector("#snackBook").addEventListener("click", () => { s.hidden = true; askChargePopup(() => showSection("booking")); });
    return s;
  }
  // test-add बटणावर टॅप केल्यावर (app.js मधून बोलावतो)
  window.kpOnTestAdded = function (name) {
    if (document.body.dataset.sec === "booking") return;
    const s = ensureSnack(); const c = calcTotals();
    s.querySelector(".add-snack-text").innerHTML = `<b>${esc(name)}</b> ${t("snack_added")}<br><small>${selectedTests.length} · ₹${c.total}</small>`;
    s.querySelector("#snackMore").textContent = t("snack_more");
    s.querySelector("#snackBook").textContent = t("snack_book");
    s.hidden = false;
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => { s.hidden = true; }, 7000);
  };

  /* ---------------- कार्ट टिकवणे + अ‍ॅप पुन्हा उघडल्यावर मागची स्थिती ---------------- */
  const CART_KEY = "kp_cart", RESUME_KEY = "kp_resume";
  window.kpSaveCart = function () {
    if (window.__kpCartLocked) return;
    try {
      if (selectedTests.length) localStorage.setItem(CART_KEY, JSON.stringify({ t: Date.now(), items: selectedTests }));
      else localStorage.removeItem(CART_KEY);
    } catch (_) {}
  };
  window.kpSaveSection = function (name) {
    try { localStorage.setItem(RESUME_KEY, JSON.stringify({ s: name, t: Date.now() })); } catch (_) {}
  };
  function restoreState() {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "null");
      if (cart && Date.now() - cart.t < 24 * 3600 * 1000 && Array.isArray(cart.items)) {
        cart.items.forEach((x) => { if (x && x.name && Number(x.price) >= 0 && !selectedTests.some((s) => s.name === x.name)) selectedTests.push({ name: x.name, price: Number(x.price) }); });
        updateCartBar(); updateUpiLink(); renderSelected();
        if (typeof renderPopularTests === "function") renderPopularTests();
      }
    } catch (_) {}
    try {
      const r = JSON.parse(localStorage.getItem(RESUME_KEY) || "null");
      if (r && Date.now() - r.t < 30 * 60 * 1000 && ["tests", "payment", "reviews", "contact", "booking"].includes(r.s)) {
        if (r.s === "booking" && selectedTests.length === 0) return;
        showSection(r.s, true, true);
        if (r.s === "payment" && /^[0-9]{10}$/.test(phoneNow())) document.getElementById("statusCheckBtn").click();
      }
    } catch (_) {}
  }

  document.getElementById("cartInfo") && document.getElementById("cartInfo").addEventListener("click", openBucket);

  window.KPDocs = { render, closeIfOpen, openBucket, restoreState, refresh: () => render(histData) };
  restoreState();
})();
