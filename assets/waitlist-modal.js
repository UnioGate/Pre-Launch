(function () {
  var MODAL_ID = "ug-waitlist-modal";
  var OPEN_SELECTOR = "[data-waitlist-open]";

  function buildModal() {
    var root = document.createElement("div");
    root.id = MODAL_ID;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "ug-waitlist-title");
    root.className =
      "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface/80 backdrop-blur-md hidden";
    root.innerHTML =
      '<div class="absolute inset-0" data-waitlist-close="backdrop" aria-hidden="true"></div>' +
      '<div class="relative z-10 w-full max-w-xl rounded-xl shadow-[0_32px_64px_rgba(11,19,37,0.8)] p-8 md:p-12 overflow-hidden" style="background:rgba(11,19,37,0.7);backdrop-filter:blur(24px);border:1px solid rgba(181,196,255,0.1)">' +
      '<div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>' +
      '<div class="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>' +
      '<button type="button" class="absolute top-6 right-6 text-on-surface-variant hover:text-white transition-colors z-10" data-waitlist-close="button" aria-label="Close dialog">' +
      '<span class="material-symbols-outlined">close</span></button>' +
      '<div class="relative z-10">' +
      '<div class="mb-10 text-center md:text-left">' +
      '<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/30 border border-tertiary/20 mb-6">' +
      '<span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>' +
      '<span class="text-[10px] uppercase tracking-widest font-bold text-tertiary-fixed">Priority Access</span></div>' +
      '<h2 id="ug-waitlist-title" class="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">Join the <span class="text-primary">Waitlist</span></h2>' +
      '<p class="text-on-surface-variant text-lg max-w-md leading-relaxed">Experience the next generation of financial infrastructure. Secure your spot in the first wave of deployment.</p></div>' +
      '<form class="space-y-6" id="ug-waitlist-form">' +
      '<div class="space-y-2">' +
      '<label class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" for="ug-waitlist-name">Full Name</label>' +
      '<div class="relative group">' +
      '<input class="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:bg-surface-container transition-all" id="ug-waitlist-name" name="name" placeholder="E.g. Alexander Vance" type="text" autocomplete="name"/>' +
      '<div class="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary group-focus-within:w-full transition-all duration-300"></div></div></div>' +
      '<div class="space-y-2">' +
      '<label class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" for="ug-waitlist-email">Work Email</label>' +
      '<div class="relative group">' +
      '<input class="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:bg-surface-container transition-all" id="ug-waitlist-email" name="email" placeholder="alexander@company.com" type="email" autocomplete="email" required/>' +
      '<div class="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary group-focus-within:w-full transition-all duration-300"></div></div></div>' +
      '<div class="space-y-2">' +
      '<label class="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" for="ug-waitlist-business">Business Type</label>' +
      '<div class="relative group">' +
      '<input class="w-full bg-surface-container-lowest border-none rounded-xl px-6 py-4 text-on-surface placeholder:text-outline/50 focus:ring-0 focus:bg-surface-container transition-all" id="ug-waitlist-business" name="business" placeholder="Type or choose your business type" type="text" list="ug-waitlist-business-options" autocomplete="organization-title" required/>' +
      '<datalist id="ug-waitlist-business-options">' +
      '<option value="Fintech Startup"></option>' +
      '<option value="Digital Bank"></option>' +
      '<option value="Commercial Bank"></option>' +
      '<option value="Microfinance Bank"></option>' +
      '<option value="Credit Union"></option>' +
      '<option value="Payment Processor"></option>' +
      '<option value="Payment Gateway"></option>' +
      '<option value="POS Provider"></option>' +
      '<option value="Merchant Aggregator"></option>' +
      '<option value="E-commerce Brand"></option>' +
      '<option value="Online Marketplace"></option>' +
      '<option value="Retail Business"></option>' +
      '<option value="Wholesale Distributor"></option>' +
      '<option value="Logistics Company"></option>' +
      '<option value="Mobility / Transport"></option>' +
      '<option value="Travel & Hospitality"></option>' +
      '<option value="Healthtech Company"></option>' +
      '<option value="Edtech Company"></option>' +
      '<option value="SaaS Company"></option>' +
      '<option value="Enterprise Software"></option>' +
      '<option value="Telecommunications"></option>' +
      '<option value="Media & Entertainment"></option>' +
      '<option value="Gaming Platform"></option>' +
      '<option value="Creator Economy"></option>' +
      '<option value="Crypto Exchange"></option>' +
      '<option value="Web3 Infrastructure"></option>' +
      '<option value="Stablecoin Business"></option>' +
      '<option value="Blockchain Protocol"></option>' +
      '<option value="Investment Platform"></option>' +
      '<option value="Asset Management"></option>' +
      '<option value="Insurance Provider"></option>' +
      '<option value="Lending Platform"></option>' +
      '<option value="Accounting / Finance Ops"></option>' +
      '<option value="Treasury Management"></option>' +
      '<option value="NGO / Nonprofit"></option>' +
      '<option value="Government / Public Sector"></option>' +
      '<option value="Import / Export Business"></option>' +
      '<option value="Manufacturing Company"></option>' +
      '<option value="Energy / Utilities"></option>' +
      '<option value="Real Estate"></option>' +
      '<option value="Professional Services"></option>' +
      '<option value="Consulting Firm"></option>' +
      '<option value="Developer / Agency"></option>' +
      '<option value="Other"></option>' +
      '</datalist>' +
      '<div class="absolute bottom-0 left-0 w-0 h-[2px] bg-secondary group-focus-within:w-full transition-all duration-300"></div></div></div>' +
      '<div class="pt-4">' +
      '<button class="w-full bg-secondary text-on-secondary-container h-14 rounded-xl font-headline font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(89,219,196,0.2)]" type="submit">Join Waitlist</button>' +
      '<p class="mt-6 text-[10px] text-center text-outline leading-normal px-4">By joining, you agree to receive early access updates. We value your data as much as our encryption keys.</p></div></form></div></div>';

    document.body.appendChild(root);

    root.querySelector("#ug-waitlist-form").addEventListener("submit", function (e) {
      e.preventDefault();
    });

    root.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-waitlist-close]")) {
        closeModal();
      }
    });

    return root;
  }

  var modalEl;

  function getModal() {
    if (!modalEl) modalEl = document.getElementById(MODAL_ID) || buildModal();
    return modalEl;
  }

  function openModal() {
    var el = getModal();
    el.classList.remove("hidden");
    document.documentElement.classList.add("overflow-hidden");
    var first = el.querySelector("#ug-waitlist-name");
    if (first) first.focus();
  }

  function closeModal() {
    var el = document.getElementById(MODAL_ID);
    if (!el) return;
    el.classList.add("hidden");
    document.documentElement.classList.remove("overflow-hidden");
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(OPEN_SELECTOR)) {
      e.preventDefault();
      openModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  window.UnioGateWaitlist = { open: openModal, close: closeModal };
})();