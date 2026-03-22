(function () {
  var STORAGE_KEY = "uniogate_cookie_consent";
  var BANNER_ID = "ug-cookie-consent-banner";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    removeBanner();
    try {
      window.dispatchEvent(new CustomEvent("uniogate:cookie-consent", { detail: { value: value } }));
    } catch (e) {}
  }

  function removeBanner() {
    var el = document.getElementById(BANNER_ID);
    if (el) el.remove();
    document.documentElement.classList.remove("ug-cookie-banner-visible");
    document.body.style.paddingBottom = "";
  }

  function buildBanner() {
    if (getConsent()) return;

    var root = document.createElement("div");
    root.id = BANNER_ID;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-labelledby", "ug-cookie-consent-title");
    root.setAttribute("aria-modal", "false");
    root.className =
      "fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0B1325]/95 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]";
    root.innerHTML =
      '<div class="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5">' +
      '<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">' +
      '<div class="flex-1 min-w-0">' +
      '<p id="ug-cookie-consent-title" class="font-headline text-sm sm:text-base font-semibold text-[#F1F5F9] mb-1">Cookies &amp; privacy</p>' +
      '<p class="text-xs sm:text-sm text-slate-400 font-body leading-relaxed max-w-3xl">' +
      "We use cookies to run the site, remember preferences, and understand how our pre-launch pages are used. " +
      'You can accept all, reject non-essential cookies, or manage details on our cookie page.' +
      "</p></div>" +
      '<div class="flex flex-col xs:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">' +
      '<button type="button" data-cookie-action="reject" class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-headline font-semibold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors">' +
      "Reject all" +
      "</button>" +
      '<a href="cookie-settings.html" class="inline-flex justify-center items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-headline font-semibold text-[#B5C4FF] border border-[#B5C4FF]/30 hover:bg-[#B5C4FF]/10 transition-colors">' +
      "Manage settings" +
      "</a>" +
      '<button type="button" data-cookie-action="accept" class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-headline font-bold text-[#0c2a73] bg-gradient-to-br from-[#B5C4FF] to-[#253e86] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20">' +
      "Accept all" +
      "</button></div></div></div>";

    document.body.appendChild(root);
    document.documentElement.classList.add("ug-cookie-banner-visible");
    document.body.style.paddingBottom = "7.5rem";

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cookie-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-cookie-action");
      if (action === "accept") setConsent("all");
      if (action === "reject") setConsent("essential");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildBanner);
  } else {
    buildBanner();
  }

  window.UnioGateCookieConsent = {
    get: getConsent,
    set: setConsent,
    clear: function () {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      buildBanner();
    },
  };

  document.addEventListener("DOMContentLoaded", function () {
    var save = document.querySelector("[data-ug-save-cookie-prefs]");
    var reject = document.querySelector("[data-ug-reject-nonessential]");
    var analytics = document.getElementById("ug-cookie-analytics");
    var marketing = document.getElementById("ug-cookie-marketing");
    if (save) {
      save.addEventListener("click", function () {
        var a = analytics && analytics.checked;
        var m = marketing && marketing.checked;
        if (a || m) {
          setConsent("all");
        } else {
          setConsent("essential");
        }
      });
    }
    if (reject) {
      reject.addEventListener("click", function () {
        if (analytics) analytics.checked = false;
        if (marketing) marketing.checked = false;
        setConsent("essential");
      });
    }
  });
})();
