/* Optional UX enhancements for Kalyan Pathlab.
   Add before </body>:
   <script src="./ui-enhancements.js"></script>
*/
(() => {
  "use strict";

  const share = document.getElementById("shareBtn");
  if (share) {
    share.addEventListener("click", async () => {
      const data = {
        title: "Kalyan Pathlab",
        text: "घरबसल्या ब्लड टेस्ट बुक करा — 30% ते 70% पर्यंत सवलत",
        url: location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(location.href);
          const toast = document.getElementById("toast");
          if (toast) {
            toast.textContent = "लिंक कॉपी झाली ✓";
            toast.hidden = false;
            setTimeout(() => { toast.hidden = true; }, 2200);
          }
        }
      } catch (_) {}
    });
  }

  // Prevent broken image icons from looking like empty boxes.
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("img-fallback");
      if (img.alt && !img.getAttribute("aria-hidden")) img.setAttribute("title", img.alt);
    });
  });
})();
