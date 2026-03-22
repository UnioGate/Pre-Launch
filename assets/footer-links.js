document.addEventListener("DOMContentLoaded", function () {
  var footer = document.querySelector("footer");

  if (!footer) {
    return;
  }

  var style = document.createElement("style");
  style.textContent = [
    ".ug-coming-soon-link { position: relative; cursor: not-allowed; }",
    ".ug-coming-soon-link.ug-coming-soon-icon::after {",
    "content: 'Coming Soon';",
    "position: absolute;",
    "left: 50%;",
    "bottom: calc(100% + 8px);",
    "transform: translateX(-50%);",
    "padding: 0.35rem 0.6rem;",
    "border-radius: 9999px;",
    "background: rgba(11, 19, 37, 0.96);",
    "color: #dbe2fb;",
    "font-size: 0.7rem;",
    "letter-spacing: 0.08em;",
    "text-transform: uppercase;",
    "white-space: nowrap;",
    "opacity: 0;",
    "pointer-events: none;",
    "transition: opacity 0.2s ease;",
    "border: 1px solid rgba(181, 196, 255, 0.18);",
    "}",
    ".ug-coming-soon-link.ug-coming-soon-icon:hover::after,",
    ".ug-coming-soon-link.ug-coming-soon-icon:focus-visible::after { opacity: 1; }"
  ].join("");
  document.head.appendChild(style);

  footer.querySelectorAll('a[href="#"]').forEach(function (link) {
    var originalLabel = link.textContent.replace(/\s+/g, " ").trim();
    var hasVisibleText = originalLabel.length > 0;

    link.classList.add("ug-coming-soon-link");
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", "Coming Soon");
    link.removeAttribute("href");

    link.addEventListener("click", function (event) {
      event.preventDefault();
    });

    if (hasVisibleText) {
      link.dataset.originalLabel = originalLabel;

      link.addEventListener("mouseenter", function () {
        link.textContent = "Coming Soon";
      });

      link.addEventListener("mouseleave", function () {
        link.textContent = link.dataset.originalLabel;
      });

      link.addEventListener("blur", function () {
        link.textContent = link.dataset.originalLabel;
      });
    } else {
      link.classList.add("ug-coming-soon-icon");
      link.setAttribute("aria-label", "Coming Soon");
    }
  });
});
