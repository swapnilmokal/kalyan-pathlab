/* =====================================================================
   Kalyan Pathlab — प्रिस्क्रिप्शनवरून टेस्ट शोधणे
   1) फोटो (किंवा PDF) लहान करून Apps Script ला पाठवतो → Google Drive OCR → मजकूर परत
   2) मजकुरातून रक्त-चाचण्यांची नावं/शॉर्टफॉर्म (CBC, FBS, HbA1c, TSH, LFT…) ओळखतो
   3) पेशंटला यादी दाखवतो — तपासून निवडलेल्या टेस्ट बास्केटमध्ये जोडतो
   महत्त्वाचं: हा फक्त "सूचना" आहे; पेशंट व लॅब दोघे तपासतात. बुकिंग आपोआप होत नाही.
   ===================================================================== */
(function () {
  "use strict";

  Object.assign(TRANSLATIONS, {
    rx_cta: { mr: "प्रिस्क्रिप्शनवरून टेस्ट शोधा", hi: "प्रिस्क्रिप्शन से टेस्ट खोजें", en: "Find tests from prescription" },
    rx_cta_sub: { mr: "डॉक्टरचं प्रिस्क्रिप्शन अपलोड करा — टेस्ट आपोआप सुचवतो", hi: "डॉक्टर का प्रिस्क्रिप्शन अपलोड करें — टेस्ट अपने-आप सुझाते हैं", en: "Upload the doctor's prescription — we suggest the tests" },
    rx_title: { mr: "प्रिस्क्रिप्शनवरून टेस्ट", hi: "प्रिस्क्रिप्शन से टेस्ट", en: "Tests from prescription" },
    rx_pick: { mr: "📷 फोटो / PDF निवडा", hi: "📷 फ़ोटो / PDF चुनें", en: "📷 Choose photo / PDF" },
    rx_hint: { mr: "प्रिस्क्रिप्शन सरळ, उजेडात आणि सगळं दिसेल असं फोटो काढा.", hi: "प्रिस्क्रिप्शन सीधा, रोशनी में और पूरा दिखे ऐसा फ़ोटो लें।", en: "Take a straight, well-lit photo where the whole prescription is visible." },
    rx_scan: { mr: "🔍 टेस्ट शोधा", hi: "🔍 टेस्ट खोजें", en: "🔍 Find tests" },
    rx_reading: { mr: "प्रिस्क्रिप्शन वाचत आहे… (१०–२० सेकंद)", hi: "प्रिस्क्रिप्शन पढ़ रहे हैं… (10–20 सेकंड)", en: "Reading the prescription… (10–20 seconds)" },
    rx_found: { mr: "{n} टेस्ट सापडल्या — तपासून निवडा", hi: "{n} टेस्ट मिलीं — जाँचकर चुनें", en: "{n} tests found — review and select" },
    rx_none: { mr: "टेस्ट ओळखता आल्या नाहीत. हस्ताक्षर अस्पष्ट असू शकतं. कृपया टेस्ट स्वतः निवडा — लॅब तुमचं प्रिस्क्रिप्शन तपासेल.", hi: "टेस्ट पहचानी नहीं जा सकीं। लिखावट अस्पष्ट हो सकती है। कृपया टेस्ट खुद चुनें — लैब आपका प्रिस्क्रिप्शन जाँचेगी।", en: "Couldn't recognise any tests. The handwriting may be unclear. Please pick tests yourself — the lab will check your prescription." },
    rx_fail: { mr: "आत्ता स्कॅन करता आलं नाही. टेस्ट स्वतः निवडा किंवा थोड्या वेळाने प्रयत्न करा.", hi: "अभी स्कैन नहीं हो सका। टेस्ट खुद चुनें या थोड़ी देर बाद कोशिश करें।", en: "Couldn't scan right now. Pick tests yourself or try again shortly." },
    rx_big: { mr: "फाईल खूप मोठी आहे (३ MB पेक्षा कमी हवी).", hi: "फ़ाइल बहुत बड़ी है (3 MB से कम चाहिए)।", en: "File is too large (must be under 3 MB)." },
    rx_exact: { mr: "पक्की जुळणी", hi: "पक्की मिलान", en: "Match" },
    rx_maybe: { mr: "कदाचित", hi: "शायद", en: "Maybe" },
    rx_add: { mr: "निवडलेल्या टेस्ट बास्केटमध्ये जोडा", hi: "चुनी हुई टेस्ट बास्केट में जोड़ें", en: "Add selected tests to basket" },
    rx_added: { mr: "{n} टेस्ट बास्केटमध्ये जोडल्या ✓", hi: "{n} टेस्ट बास्केट में जोड़ी ✓", en: "{n} tests added to basket ✓" },
    rx_disc: { mr: "ही फक्त सूचना आहे — चूक असू शकते. जोडण्यापूर्वी तपासा. लॅब तुमचं प्रिस्क्रिप्शन पुन्हा तपासेल. फोटो फक्त टेस्ट शोधण्यासाठी वापरला जातो.", hi: "यह सिर्फ़ सुझाव है — गलती हो सकती है। जोड़ने से पहले जाँचें। लैब आपका प्रिस्क्रिप्शन फिर से जाँचेगी। फ़ोटो केवल टेस्ट खोजने के लिए इस्तेमाल होता है।", en: "These are only suggestions and may be wrong — please check before adding. The lab will re-check your prescription. The photo is used only to find tests." },
    rx_text: { mr: "प्रिस्क्रिप्शनमधून वाचलेला मजकूर", hi: "प्रिस्क्रिप्शन से पढ़ा गया पाठ", en: "Text read from the prescription" },
    rx_empty: { mr: "फोटोतून मजकूर वाचता आला नाही. फोटो सरळ, स्पष्ट आणि उजेडात घ्या — किंवा खाली स्वतः टाईप करा.", hi: "फ़ोटो से पाठ नहीं पढ़ा जा सका। फ़ोटो सीधा, साफ़ और रोशनी में लें — या नीचे खुद टाइप करें।", en: "Couldn't read any text from the photo. Take it straight, sharp and well-lit — or type the tests below." },
    rx_old: { mr: "स्कॅन सेवा सध्या उपलब्ध नाही. खाली प्रिस्क्रिप्शनमधील टेस्ट स्वतः टाईप करून शोधा.", hi: "स्कैन सेवा अभी उपलब्ध नहीं है। नीचे प्रिस्क्रिप्शन की टेस्ट खुद टाइप करके खोजें।", en: "The scan service isn't available right now. Type the prescription's tests below to find them." },
    rx_type_title: { mr: "✍️ स्वतः टाईप करा (हस्ताक्षर वाचलं नाही तर)", hi: "✍️ खुद टाइप करें (लिखावट न पढ़ी जाए तो)", en: "✍️ Type it yourself (if handwriting can't be read)" },
    rx_type_ph: { mr: "प्रिस्क्रिप्शनमध्ये जे लिहिलंय ते टाईप करा, उदा. CBC, CRP, FBS, PP, HbA1c, TSH, Vit D", hi: "प्रिस्क्रिप्शन में जो लिखा है वह टाइप करें, जैसे CBC, CRP, FBS, PP, HbA1c, TSH, Vit D", en: "Type what the prescription says, e.g. CBC, CRP, FBS, PP, HbA1c, TSH, Vit D" },
    rx_type_go: { mr: "🔍 या मजकुरावरून शोधा", hi: "🔍 इस पाठ से खोजें", en: "🔍 Find from this text" },
    rx_close: { mr: "बंद करा", hi: "बंद करें", en: "Close" },
    rx_from_booking: { mr: "🔍 या प्रिस्क्रिप्शनवरून टेस्ट शोधा", hi: "🔍 इस प्रिस्क्रिप्शन से टेस्ट खोजें", en: "🔍 Find tests from this prescription" }
  });

  /* ---------------- ओळख: शॉर्टफॉर्म/समानार्थी शब्द ---------------- */
  // [टेस्टच्या नावातील तुकडा (lowercase), [प्रिस्क्रिप्शनमध्ये येणारे शब्द]]
  const ALIASES = [
    ["complete blood count", ["cbc", "c b c", "complete blood count", "complete blood picture", "cbp", "hemogram", "haemogram", "blood count"]],
    ["hemoglobin (hb)", ["hb", "hgb", "haemoglobin", "hemoglobin"]],
    ["esr", ["esr", "erythrocyte sedimentation"]],
    ["blood grouping", ["blood group", "blood grouping", "abo rh", "rh typing"]],
    ["peripheral smear", ["peripheral smear", "pbs", "smear study"]],
    ["platelet count", ["platelet count", "platelets", "plt"]],
    ["complete urine", ["urine routine", "urine r m", "urine rm", "urine examination", "urine analysis", "urine re", "cue", "urine complete", "urine routine microscopy"]],
    ["stool routine", ["stool routine", "stool examination", "stool r m", "stool re"]],
    ["blood sugar fasting", ["fbs", "fbg", "fasting blood sugar", "fasting sugar", "fasting glucose", "blood sugar fasting", "f b s", "sugar fasting", "bsl f", "bsl fasting"]],
    ["blood sugar pp", ["ppbs", "pp2bs", "post prandial", "post meal", "pp blood sugar", "postprandial", "bsl pp", "sugar pp", "pp sugar", "ppbs"]],
    ["random blood sugar", ["rbs", "random blood sugar", "random sugar", "bsl random"]],
    ["hba1c", ["hba1c", "hb a1c", "a1c", "glycosylated hemoglobin", "glycated hemoglobin", "glycated haemoglobin", "glycosylated haemoglobin", "hba 1c"]],
    ["diabetes profile", ["diabetes profile", "diabetic profile"]],
    ["insulin fasting", ["fasting insulin", "insulin fasting", "insulin level", "serum insulin"]],
    ["tsh (thyroid stimulating", ["tsh", "thyroid stimulating hormone"]],
    ["thyroid profile", ["thyroid profile", "tft", "thyroid function", "t3 t4 tsh", "thyroid panel", "thyroid"]],
    ["free t3", ["ft3 ft4", "free t3", "free t4", "ft3", "ft4"]],
    ["anti tpo", ["anti tpo", "tpo antibody", "tpo ab", "atpo"]],
    ["liver function test (lft)", ["lft", "lfts", "liver function", "liver function test"]],
    ["sgpt", ["sgpt", "alt", "alanine"]],
    ["sgot", ["sgot", "ast", "aspartate"]],
    ["bilirubin", ["bilirubin"]],
    ["serum protein", ["serum protein", "albumin", "total protein"]],
    ["kidney function test (kft)", ["kft", "rft", "kidney function", "renal function", "kidney function test", "renal profile"]],
    ["serum creatinine", ["creatinine", "s creatinine", "serum creatinine"]],
    ["blood urea", ["blood urea", "urea", "bun"]],
    ["uric acid", ["uric acid", "s uric acid", "serum uric acid"]],
    ["electrolytes", ["electrolytes", "na k cl", "sodium potassium", "s electrolytes"]],
    ["lipid profile", ["lipid profile", "lipid", "lipids", "cholesterol profile"]],
    ["total cholesterol", ["total cholesterol", "s cholesterol", "cholesterol"]],
    ["triglycerides", ["triglycerides", "triglyceride", "tg"]],
    ["hdl / ldl", ["hdl", "ldl"]],
    ["vitamin d", ["vitamin d", "vit d", "vit d3", "25 oh", "25 hydroxy", "vitamin d3", "25 oh vitamin d"]],
    ["vitamin b12", ["vitamin b12", "vit b12", "b12", "cobalamin", "vit b 12"]],
    ["iron profile", ["iron profile", "iron studies", "serum iron", "tibc", "ferritin", "iron"]],
    ["calcium serum", ["calcium", "serum calcium", "s calcium"]],
    ["magnesium", ["magnesium", "s magnesium"]],
    ["widal", ["widal", "typhoid", "typhidot"]],
    ["dengue ns1", ["dengue ns1", "ns1", "dengue antigen"]],
    ["dengue igg", ["dengue igg", "dengue igm", "dengue serology"]],
    ["malaria", ["malaria", "malarial parasite", "mp card", "malaria antigen"]],
    ["crp", ["crp", "c reactive protein"]],
    ["covid", ["covid", "rt pcr", "rtpcr", "covid 19"]],
    ["pregnancy test", ["pregnancy test", "beta hcg", "b hcg", "hcg", "upt"]],
    ["prolactin", ["prolactin", "prl"]],
    ["testosterone", ["testosterone"]],
    ["fsh / lh", ["fsh", "lh", "fsh lh"]],
    ["ecg", ["ecg", "ekg"]],
    ["troponin", ["troponin", "trop i", "trop t"]],
    ["ra factor", ["ra factor", "rheumatoid factor", "ra test"]],
    ["aso titer", ["aso", "aso titre", "aso titer"]],
    ["widal", ["typhi igm", "typhi dot", "typhidot", "typhoid igm", "typhi igg"]],
    ["malaria antigen", ["malarial ag", "malaria ag", "mp ag", "malarial antigen", "malaria card"]],
    ["blood sugar fasting", ["bs fasting", "bs f", "sugar f"]],
    ["blood sugar pp", ["bs pp", "sugar pp"]]
  ];

  // छोटे शब्द जे टेस्ट नसलेल्या अर्थानेही येऊ शकतात — फक्त "कदाचित"
  const AMBIGUOUS = new Set(["hb", "alt", "ast", "tg", "lh", "plt", "pbs", "bun", "prl", "upt", "mp", "tpo", "iron", "lipid", "thyroid", "urea", "calcium", "albumin"]);
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, " ").replace(/\s+/g, " ").trim();
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  function allTests() {
    const out = [];
    (typeof TEST_CATEGORIES !== "undefined" ? TEST_CATEGORIES : []).forEach((c) => (c.tests || []).forEach((x) => { if (x && x.name) out.push(x); }));
    return out;
  }

  // डॉक्टरांचं शॉर्टहँड: "BS < F / PP", "Sugar F, PP", "U R/M", "S R/M" …
  const RULES = [
    [/\b(bs|bsl|sugar|blood sugar)\b(\s+\w+){0,3}?\s+(f|fasting|fbs)\b/, "blood sugar fasting", "high"],
    [/\b(bs|bsl|sugar|blood sugar)\b(\s+\w+){0,3}?\s+(pp|ppbs|pp2|post|postprandial)\b/, "blood sugar pp", "high"],
    [/\b(bs|bsl|sugar|blood sugar)\b(\s+\w+){0,3}?\s+(r|rbs|random)\b/, "random blood sugar", "maybe"],
    [/\b(fbs|fasting|f)\b(\s+\w+){0,2}?\s+pp\b/, "blood sugar pp", "high"],
    [/\bpp\b/, "blood sugar pp", "maybe"],
    [/\bu(rine)?\s+r\s*m\b/, "complete urine", "maybe"],
    [/\b(s|stool)\s+r\s*m\b/, "stool routine", "maybe"]
  ];

  /* मजकुरातून टेस्ट सुचवतो: [{test, conf:"high"|"maybe", hit}] */
  function suggest(text) {
    const tests = allTests();
    const T = " " + norm(text) + " ";
    const toks = norm(text).split(" ").filter(Boolean);
    const found = new Map();
    const add = (test, conf, hit, pos) => {
      const ex = found.get(test.name);
      if (!ex || (ex.conf === "maybe" && conf === "high")) found.set(test.name, { test, conf, hit, pos: ex ? Math.min(ex.pos, pos) : pos });
    };
    const posOf = (phrase) => { const i = T.indexOf(" " + phrase + " "); return i < 0 ? 1e9 : i; };

    const tryAlias = (aliasList, matchTests) => {
      for (const raw of aliasList) {
        const a = norm(raw); if (!a) continue;
        let conf = null, pos = 1e9;
        if (T.includes(" " + a + " ")) { conf = AMBIGUOUS.has(a) ? "maybe" : "high"; pos = posOf(a); }
        else if (a.length >= 7) {           // OCR ची थोडी चूक चालेल
          const k = a.split(" ").length; const maxD = a.length > 10 ? 2 : 1;
          for (let i = 0; i + k <= toks.length && !conf; i++) {
            const w = toks.slice(i, i + k).join(" ");
            if (Math.abs(w.length - a.length) <= maxD && lev(w, a) <= maxD) { conf = "maybe"; pos = T.indexOf(" " + toks[i]); }
          }
        }
        if (conf) { matchTests.forEach((tt, idx) => add(tt, idx === 0 ? conf : "maybe", raw, pos)); return true; }
      }
      return false;
    };

    RULES.forEach(([re, key, conf]) => {
      const mm = T.match(re);
      if (mm) tests.filter((x) => x.name.toLowerCase().includes(key)).slice(0, 1).forEach((x) => add(x, conf, mm[0], mm.index));
    });
    ALIASES.forEach(([key, list]) => {
      const m = tests.filter((x) => x.name.toLowerCase().includes(key));
      if (m.length) tryAlias(list, m.slice(0, 3));
    });
    // बाकी टेस्ट: स्वतःच्या नावावरून (उदा. "Serum Ferritin", "Free T3")
    tests.forEach((x) => {
      if (found.has(x.name)) return;
      const base = norm(x.name.replace(/\([^)]*\)/g, " "));
      const abbr = (x.name.match(/\(([A-Za-z0-9]{3,8})\)/) || [])[1];
      const list = [];
      if (base.split(" ").length >= 2 && base.length >= 8) list.push(base);
      if (abbr && norm(abbr).length >= 3) list.push(abbr);
      if (list.length) tryAlias(list, [x]);
    });
    return [...found.values()].sort((a, b) => (a.conf === b.conf ? a.pos - b.pos : a.conf === "high" ? -1 : 1)).slice(0, 18);
  }

  /* ---------------- फोटो लहान करणे ---------------- */
  function readAsDataURL(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }); }
  async function prepare(file) {
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      if (file.size > 3 * 1024 * 1024) throw new Error("big");
      return { mime: "application/pdf", data: (await readAsDataURL(file)).split(",")[1] };
    }
    const url = await readAsDataURL(file);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const max = 1800; const sc = Math.min(1, max / Math.max(img.width, img.height));
    const cv = document.createElement("canvas"); cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
    const g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
    let q = 0.82, out = cv.toDataURL("image/jpeg", q);
    while (out.length > 2.6 * 1024 * 1024 * 1.37 && q > 0.4) { q -= 0.12; out = cv.toDataURL("image/jpeg", q); }
    return { mime: "image/jpeg", data: out.split(",")[1] };
  }

  async function ocr(file) {
    const url = CONFIG.appsScriptUrl;
    if (!url || url.startsWith("PASTE_")) throw new Error("no_backend");
    const p = await prepare(file);
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ type: "ocrPrescription", mime: p.mime, image: p.data }) });
    const j = await res.json();
    if (!j || !j.ok) throw new Error((j && j.error) || "ocr_failed");
    if (typeof j.text !== "string") throw new Error("old_backend");   // जुना Apps Script: फक्त {ok:true} देतो
    return j.text;
  }

  /* ---------------- UI (डायलॉग) ---------------- */
  const esc = (s) => escapeHtml(s);
  const tt = (k, v) => String(t(k)).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] !== undefined ? v[x] : ""));
  let curFile = null, lastText = "", lastSug = [];

  function ensureDialog() {
    let m = document.getElementById("rxDialog");
    if (m) return m;
    m = document.createElement("div");
    m.id = "rxDialog"; m.className = "dlg-backdrop"; m.hidden = true;
    m.innerHTML = `<div class="dlg rx-dlg" role="dialog" aria-modal="true" aria-labelledby="rxTitle">
      <h3 id="rxTitle"></h3>
      <p class="rx-hint" id="rxHint"></p>
      <input type="file" id="rxFile" accept="image/*,.pdf" hidden>
      <button type="button" class="btn btn-outline btn-block" id="rxPick"></button>
      <div class="rx-fname" id="rxFname"></div>
      <button type="button" class="btn btn-primary btn-block" id="rxScan" disabled></button>
      <div id="rxStatus" class="rx-status" aria-live="polite"></div>
      <div id="rxResults"></div>
      <details class="rx-type" id="rxType"><summary id="rxTypeT"></summary>
        <textarea id="rxTypeBox" rows="3"></textarea>
        <button type="button" class="btn btn-outline btn-block" id="rxTypeGo"></button></details>
      <p class="rx-disc" id="rxDisc"></p>
      <button type="button" class="btn btn-outline btn-block" id="rxClose"></button></div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) m.hidden = true; });
    m.querySelector("#rxClose").addEventListener("click", () => { m.hidden = true; });
    m.querySelector("#rxPick").addEventListener("click", () => m.querySelector("#rxFile").click());
    m.querySelector("#rxFile").addEventListener("change", (e) => setFile(e.target.files[0]));
    m.querySelector("#rxScan").addEventListener("click", scan);
    m.querySelector("#rxTypeGo").addEventListener("click", () => {
      const v = m.querySelector("#rxTypeBox").value.trim(); if (!v) return;
      lastText = v; m.querySelector("#rxStatus").textContent = ""; render(v, true);
    });
    return m;
  }
  function setFile(f) {
    curFile = f || null;
    const m = ensureDialog();
    m.querySelector("#rxFname").textContent = f ? "📎 " + f.name : "";
    m.querySelector("#rxScan").disabled = !f;
    m.querySelector("#rxResults").innerHTML = ""; m.querySelector("#rxStatus").textContent = "";
  }
  function open(file) {
    const m = ensureDialog();
    m.querySelector("#rxTitle").textContent = "📋 " + t("rx_title");
    m.querySelector("#rxHint").textContent = t("rx_hint");
    m.querySelector("#rxPick").textContent = t("rx_pick");
    m.querySelector("#rxScan").textContent = t("rx_scan");
    m.querySelector("#rxDisc").textContent = t("rx_disc");
    m.querySelector("#rxClose").textContent = t("rx_close");
    m.querySelector("#rxTypeT").textContent = t("rx_type_title"); m.querySelector("#rxTypeBox").placeholder = t("rx_type_ph"); m.querySelector("#rxTypeGo").textContent = t("rx_type_go");
    setFile(file || curFile);
    m.hidden = false;
  }

  async function scan() {
    if (!curFile) return;
    const m = ensureDialog(); const st = m.querySelector("#rxStatus"), box = m.querySelector("#rxResults"), btn = m.querySelector("#rxScan");
    box.innerHTML = ""; st.className = "rx-status busy"; st.textContent = t("rx_reading"); btn.disabled = true;
    try {
      lastText = await ocr(curFile);
      render(lastText);
    } catch (e) {
      st.className = "rx-status err";
      const code = e && e.message;
      st.textContent = code === "big" ? t("rx_big") : code === "old_backend" ? t("rx_old") : t("rx_fail");
      m.querySelector("#rxType").open = true;      // स्कॅन न जमल्यास टाईप करण्याचा पर्याय आपोआप उघडतो
    }
    btn.disabled = false;
  }

  function render(text, typed) {
    const m = ensureDialog(); const st = m.querySelector("#rxStatus"), box = m.querySelector("#rxResults");
    lastSug = suggest(text);
    if (!lastSug.length) {
      st.className = "rx-status err";
      st.textContent = !String(text).trim() ? t("rx_empty") : t("rx_none");
      box.innerHTML = text && !typed ? `<details class="rx-text" open><summary>${t("rx_text")}</summary><pre>${esc(text)}</pre></details>` : "";
      m.querySelector("#rxType").open = true;
      return;
    }
    st.className = "rx-status ok"; st.textContent = tt("rx_found", { n: lastSug.length });
    const have = new Set((typeof selectedTests !== "undefined" ? selectedTests : []).map((x) => x.name));
    box.innerHTML = `<div class="rx-list">${lastSug.map((s, i) => `
      <label class="rx-row ${s.conf}"><input type="checkbox" data-i="${i}" ${s.conf === "high" && !have.has(s.test.name) ? "checked" : ""} ${have.has(s.test.name) ? "disabled" : ""}>
        <span class="rx-name">${esc(s.test.name)}<small>₹${s.test.price}${s.test.mrp > s.test.price ? ` <s>₹${s.test.mrp}</s>` : ""}</small></span>
        <span class="rx-badge ${s.conf}">${s.conf === "high" ? t("rx_exact") : t("rx_maybe")}</span></label>`).join("")}</div>
      <button type="button" class="btn btn-primary btn-block" id="rxAdd">${t("rx_add")}</button>
      <details class="rx-text"><summary>${t("rx_text")}</summary><pre>${esc(text)}</pre></details>`;
    box.querySelector("#rxAdd").addEventListener("click", addSelected);
  }

  function addSelected() {
    const m = ensureDialog(); let n = 0;
    m.querySelectorAll('#rxResults input[type=checkbox]:checked:not(:disabled)').forEach((cb) => {
      const s = lastSug[Number(cb.dataset.i)]; if (!s) return;
      if (!selectedTests.some((x) => x.name === s.test.name)) { selectedTests.push({ name: s.test.name, price: Number(s.test.price) }); n++; }
    });
    updateCartBar(); updateUpiLink(); renderSelected();
    if (typeof renderPopularTests === "function") renderPopularTests();
    m.hidden = true;
    if (n) showToast(tt("rx_added", { n }));
    if (n && document.body.dataset.sec !== "booking") { setTimeout(() => { if (window.KPDocs && KPDocs.openBucket) KPDocs.openBucket(); }, 400); }
  }

  /* ---------------- प्रवेश-बिंदू: टेस्ट पेज + बुकिंग पायरी १ ---------------- */
  function inject() {
    const search = document.getElementById("testSearch");
    if (search && !document.getElementById("rxCta")) {
      const b = document.createElement("button");
      b.type = "button"; b.id = "rxCta"; b.className = "quote-cta rx-cta";
      b.innerHTML = `<span class="quote-cta-ico" aria-hidden="true">📋</span><span class="quote-cta-text"><b data-i18n="rx_cta">${t("rx_cta")}</b><small data-i18n="rx_cta_sub">${t("rx_cta_sub")}</small></span><span aria-hidden="true">›</span>`;
      b.addEventListener("click", () => open());
      const anchor = document.querySelector("#section-tests .quote-cta") || search;
      anchor.insertAdjacentElement("afterend", b);
    }
    const rx = document.getElementById("prescription");
    if (rx && !document.getElementById("rxFromBooking")) {
      const b = document.createElement("button");
      b.type = "button"; b.id = "rxFromBooking"; b.className = "btn btn-outline btn-block rx-booking-btn"; b.hidden = true;
      rx.closest("label").insertAdjacentElement("afterend", b);
      b.addEventListener("click", () => { const f = rx.files[0]; if (f) open(f); });
      const upd = () => { b.hidden = !rx.files[0]; b.textContent = t("rx_from_booking"); };
      rx.addEventListener("change", upd); upd();
    }
  }
  inject();

  window.KPRx = { suggest, open, ocr, render, norm };
})();
