/* Admin अ‍ॅप: Service Worker नोंदणी + "इन्स्टॉल करा" बॅनर
   (ग्राहक अ‍ॅपपेक्षा वेगळे id/scope असल्याने दोन्ही एकाच फोनवर इन्स्टॉल होतात) */
(function () {
  "use strict";
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("./sw.js").catch(function () {}); });
  }
  var KEY = "kp_admin_install_dismissed";
  var deferred = null;
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  function recently() { var t = Number(localStorage.getItem(KEY) || 0); return t && Date.now() - t < 7 * 24 * 3600 * 1000; }
  function show() {
    if (standalone || recently() || !deferred || document.getElementById("adminInstallBar")) return;
    var bar = document.createElement("div");
    bar.id = "adminInstallBar";
    bar.innerHTML = '<img src="./icons/admin-icon-192.png" alt="" width="40" height="40"><span><b>Install KP Admin app</b><small>होम स्क्रीनवर Admin अ‍ॅप</small></span><button type="button" id="adminInstallBtn">Install</button><button type="button" id="adminInstallClose" aria-label="Close">✕</button>';
    document.body.appendChild(bar);
    document.getElementById("adminInstallBtn").addEventListener("click", function () {
      deferred.prompt();
      Promise.resolve(deferred.userChoice).catch(function () {}).then(function () { deferred = null; bar.remove(); });
    });
    document.getElementById("adminInstallClose").addEventListener("click", function () { localStorage.setItem(KEY, String(Date.now())); bar.remove(); });
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; setTimeout(show, 1200); });
  window.addEventListener("appinstalled", function () { var b = document.getElementById("adminInstallBar"); if (b) b.remove(); });
})();
