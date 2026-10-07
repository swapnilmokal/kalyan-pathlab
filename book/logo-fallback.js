/* Kalyan Pathlab — image fallback (logo / QR)
   - पहिल्या src मध्ये चूक झाली तर data-fallbacks मधले पर्याय एकेक करून वापरतो
   - सगळे अपयशी झाले तर तुटलेल्या इमेजचा आयकॉन न दाखवता CSS/SVG fallback दाखवतो
   - इमेज व्यवस्थित लोड झाली तर हा कोड काहीही करत नाही */
(function () {
  "use strict";
  var LOGO_SVG =
    '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<circle cx="20" cy="20" r="18" fill="#fff" stroke="#0b1440" stroke-width="2"/>' +
    '<path d="M20 7s8 9.4 8 15a8 8 0 0 1-16 0c0-5.600 8-15 8-15z" fill="#e5030a"/>' +
    '<path d="M20 17v8M16 21h8" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

  window.kpImgFail = function (img) {
    if (!img || img.getAttribute("data-kp-done")) return;
    var list = (img.getAttribute("data-fallbacks") || "").split("|").filter(Boolean);
    var i = parseInt(img.getAttribute("data-kp-try") || "0", 10);
    if (i < list.length) {
      img.setAttribute("data-kp-try", String(i + 1));
      img.src = list[i];
      return;
    }
    img.setAttribute("data-kp-done", "1");
    var kind = img.getAttribute("data-fail") || "logo";
    var el = document.createElement("span");
    el.className = (img.className || "") + " kp-img-fallback kp-fallback-" + kind;
    if (img.id) el.id = img.id;
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", img.getAttribute("alt") || "");
    if (kind === "text") el.textContent = img.getAttribute("data-fail-text") || img.getAttribute("alt") || "";
    else el.innerHTML = LOGO_SVG;
    if (img.parentNode) img.parentNode.replaceChild(el, img);
  };

  // स्क्रिप्ट येण्याआधीच इमेज फेल झाली असेल तर ती पकडतो
  function sweep() {
    var imgs = document.querySelectorAll("img[data-fallbacks], img[data-fail]");
    for (var k = 0; k < imgs.length; k++) {
      var im = imgs[k];
      if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) window.kpImgFail(im);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sweep);
  else sweep();
  window.addEventListener("load", sweep);
})();
