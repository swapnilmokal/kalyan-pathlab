/* Kalyan Pathlab — Admin: बायोमेट्रिक लॉक (फिंगरप्रिंट / फेस / फोनचा स्क्रीन-लॉक)
   WebAuthn (platform authenticator) वापरतो. PIN तसाच राहतो — बायोमेट्रिक हा अतिरिक्त सोपा पर्याय.
   टीप: हा फक्त या फोनवरचा लॉक आहे (सर्व्हर-सत्यापन नाही), PIN प्रमाणेच "अ‍ॅप-लॉक". */
(function () {
  "use strict";
  var BIO_KEY = "kpAdminBio";
  Object.assign(TRANSLATIONS, {
    bio_title: { en: "Biometric lock", mr: "बायोमेट्रिक लॉक", hi: "बायोमेट्रिक लॉक" },
    bio_sub: { en: "Unlock this admin app with your fingerprint / face / phone screen-lock instead of typing the PIN. The PIN keeps working.", mr: "PIN टाईप करण्याऐवजी फिंगरप्रिंट / फेस / फोनच्या स्क्रीन-लॉकने अ‍ॅप उघडा. PIN तसाच चालू राहतो.", hi: "PIN डालने के बजाय फिंगरप्रिंट / फेस / फोन के स्क्रीन-लॉक से ऐप खोलें। PIN भी चलता रहेगा।" },
    bio_on: { en: "Biometric lock is ON", mr: "बायोमेट्रिक लॉक चालू आहे", hi: "बायोमेट्रिक लॉक चालू है" },
    bio_off: { en: "Biometric lock is OFF", mr: "बायोमेट्रिक लॉक बंद आहे", hi: "बायोमेट्रिक लॉक बंद है" },
    bio_enable: { en: "Enable biometric lock", mr: "बायोमेट्रिक लॉक चालू करा", hi: "बायोमेट्रिक लॉक चालू करें" },
    bio_disable: { en: "Turn off", mr: "बंद करा", hi: "बंद करें" },
    bio_unlock: { en: "Unlock with fingerprint / face", mr: "फिंगरप्रिंट / फेसने उघडा", hi: "फिंगरप्रिंट / फेस से खोलें" },
    bio_unsupported: { en: "This phone/browser does not support biometric lock. Set a screen lock (fingerprint/PIN) on the phone and use Chrome.", mr: "या फोन/ब्राउझरमध्ये बायोमेट्रिक लॉक चालत नाही. फोनवर स्क्रीन-लॉक (फिंगरप्रिंट/PIN) सेट करा आणि Chrome वापरा.", hi: "इस फोन/ब्राउज़र में बायोमेट्रिक लॉक नहीं चलता। फोन में स्क्रीन-लॉक सेट करें और Chrome इस्तेमाल करें।" },
    bio_enabled_ok: { en: "Biometric lock enabled ✓", mr: "बायोमेट्रिक लॉक चालू झाला ✓", hi: "बायोमेट्रिक लॉक चालू हुआ ✓" },
    bio_failed: { en: "Biometric check failed — use the PIN.", mr: "बायोमेट्रिक तपासणी जमली नाही — PIN वापरा.", hi: "बायोमेट्रिक जाँच नहीं हो सकी — PIN इस्तेमाल करें।" },
    bio_disabled_ok: { en: "Biometric lock turned off", mr: "बायोमेट्रिक लॉक बंद केला", hi: "बायोमेट्रिक लॉक बंद किया" }
  });

  var supported = !!(window.PublicKeyCredential && navigator.credentials && navigator.credentials.create);
  var busy = false;
  var FP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 11v3a6 6 0 0 1-1 3.300M8 12a4 4 0 0 1 8 0v2a9 9 0 0 1-1.200 4.500M5 12a7 7 0 0 1 14 0v1.500M9.500 20.500c.8-1 1.300-2.200 1.500-3.500"/></svg>';

  function enc(buf) {
    var s = ""; var a = new Uint8Array(buf);
    for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function dec(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/"); while (str.length % 4) str += "=";
    var bin = atob(str), a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return a.buffer;
  }
  function rand(n) { return crypto.getRandomValues(new Uint8Array(n)); }
  function stored() { try { return JSON.parse(localStorage.getItem(BIO_KEY) || "null"); } catch (_) { return null; } }
  function isOn() { return !!stored(); }

  async function platformOk() {
    if (!supported) return false;
    try { return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); } catch (_) { return false; }
  }

  async function enable() {
    if (!(await platformOk())) { showToast(t("bio_unsupported")); return false; }
    try {
      var cred = await navigator.credentials.create({
        publicKey: {
          challenge: rand(32),
          rp: { name: "Kalyan Pathlab Admin", id: location.hostname },
          user: { id: rand(16), name: "kp-admin", displayName: "KP Admin" },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "discouraged" },
          timeout: 60000, attestation: "none"
        }
      });
      if (!cred) return false;
      localStorage.setItem(BIO_KEY, JSON.stringify({ id: enc(cred.rawId), t: Date.now() }));
      showToast(t("bio_enabled_ok"));
      return true;
    } catch (e) { showToast(t("bio_failed")); return false; }
  }
  function disable() { localStorage.removeItem(BIO_KEY); showToast(t("bio_disabled_ok")); }

  async function authenticate() {
    var s = stored(); if (!s || busy) return false;
    busy = true;
    try {
      var res = await navigator.credentials.get({
        publicKey: {
          challenge: rand(32), rpId: location.hostname, timeout: 60000, userVerification: "required",
          allowCredentials: [{ type: "public-key", id: dec(s.id), transports: ["internal"] }]
        }
      });
      if (!res) return false;
      var flags = new Uint8Array(res.response.authenticatorData)[32];
      if (!(flags & 0x04)) return false;                 // बायोमेट्रिक/स्क्रीन-लॉक पडताळणी (UV) झालेली हवी
      sessionStorage.setItem(PIN_UNLOCK_KEY, "1");
      hideLockScreen();
      return true;
    } catch (e) { return false; }
    finally { busy = false; }
  }

  /* ---- लॉक स्क्रीनवरचं बटण ---- */
  function ensureLockButton() {
    var screen = document.getElementById("pinLockScreen");
    var btn = document.getElementById("bioUnlockBtn");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button"; btn.id = "bioUnlockBtn"; btn.className = "pin-bio-btn";
      var submit = document.getElementById("pinSubmitBtn");
      submit.parentNode.insertBefore(btn, submit.nextSibling);
      btn.addEventListener("click", async function () { var ok = await authenticate(); if (!ok) showToast(t("bio_failed")); });
    }
    btn.innerHTML = FP + "<span>" + t("bio_unlock") + "</span>";
    btn.hidden = !isOn();
    return btn;
  }

  /* ---- सेटिंग्स कार्ड ---- */
  function ensureSettingsCard() {
    var pinBtn = document.getElementById("changePinBtn"); if (!pinBtn) return;
    var pinCard = pinBtn.closest(".settings-card"); if (!pinCard) return;
    var card = document.getElementById("bioCard");
    if (!card) {
      card = document.createElement("div"); card.id = "bioCard"; card.className = "settings-card";
      pinCard.parentNode.insertBefore(card, pinCard.nextSibling);
    }
    var on = isOn();
    card.innerHTML = '<h3>🔐 ' + t("bio_title") + '</h3><p class="section-sub-admin">' + t("bio_sub") + '</p>' +
      '<p class="bio-status ' + (on ? "on" : "off") + '">' + (on ? "● " + t("bio_on") : "○ " + t("bio_off")) + '</p>' +
      (on ? '<button type="button" id="bioOffBtn" class="btn btn-block" style="background:#fde8e8;color:#a1235a">' + t("bio_disable") + '</button>'
          : '<button type="button" id="bioOnBtn" class="btn btn-outline-admin btn-block">' + t("bio_enable") + '</button>');
    var onB = document.getElementById("bioOnBtn"), offB = document.getElementById("bioOffBtn");
    if (onB) onB.addEventListener("click", async function () { await enable(); ensureSettingsCard(); ensureLockButton(); });
    if (offB) offB.addEventListener("click", function () { disable(); ensureSettingsCard(); ensureLockButton(); });
  }

  // लॉक स्क्रीन दिसली की बायोमेट्रिक आपोआप विचारतो
  var origShow = window.showLockScreen;
  window.showLockScreen = function () {
    origShow();
    ensureLockButton();
    if (isOn()) setTimeout(function () { authenticate(); }, 350);
  };

  ensureLockButton();
  ensureSettingsCard();
  var screen = document.getElementById("pinLockScreen");
  if (screen && screen.style.display !== "none" && isOn() && sessionStorage.getItem(PIN_UNLOCK_KEY) !== "1") setTimeout(function () { authenticate(); }, 450);
  window.KPAdminLock = { enable: enable, disable: disable, authenticate: authenticate, isOn: isOn };
})();
