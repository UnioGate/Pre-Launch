"""Extract legal HTML from agent transcript and patch for site integration."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TRANSCRIPT = Path(
    r"C:\Users\ozoem\.cursor\projects\c-Users-ozoem-OneDrive-Desktop-UG-Pre-Launch"
    r"\agent-transcripts\73b24d19-f89d-4487-ab4b-40b498293494"
    r"\73b24d19-f89d-4487-ab4b-40b498293494.jsonl"
)

SCRIPTS = (
    '<script src="assets/waitlist-modal.js" defer></script>\n'
    '<script src="assets/cookie-consent.js" defer></script>\n'
)

LEGAL_HEADER_PRIVACY = """<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
<div class="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
<a class="flex items-center gap-3" href="index.html">
<img alt="" src="LogoMark%20Blue.svg" width="40" height="40" class="h-10 w-10 shrink-0 rounded-lg"/>
<span class="text-2xl font-extrabold tracking-tight text-white font-headline">UnioGate</span>
</a>
<nav class="hidden lg:flex gap-10 items-center">
<a class="font-headline font-semibold text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors" href="how-it-works.html">How it Works</a>
<a class="font-headline font-semibold text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors" href="vision.html">Vision</a>
<a class="font-headline font-semibold text-sm tracking-wide text-on-surface-variant hover:text-white transition-colors" href="connect.html">Connect</a>
</nav>
<button type="button" data-waitlist-open class="hidden sm:inline-flex items-center justify-center bg-deep-blue hover:bg-deep-blue/90 text-white px-6 py-2.5 rounded-xl font-headline font-bold text-sm transition-all shadow-lg shadow-deep-blue/20">
Join Waitlist
</button>
</div>
</header>"""

LEGAL_HEADER_TERMS = """<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-surface-variant/60 backdrop-blur-xl border-b border-white/5">
<div class="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
<a class="flex items-center gap-3" href="index.html">
<img alt="" src="LogoMark%20Blue.svg" width="36" height="36" class="h-9 w-9 shrink-0"/>
<span class="text-2xl font-bold tracking-tighter text-primary font-headline">UnioGate</span>
</a>
<nav class="hidden md:flex items-center gap-10 font-headline font-semibold text-sm tracking-tight">
<a class="text-on-surface-variant hover:text-primary transition-colors" href="how-it-works.html">How it Works</a>
<a class="text-on-surface-variant hover:text-primary transition-colors" href="vision.html">Vision</a>
<a class="text-primary relative after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-0.5 after:bg-primary" href="terms-of-service.html">Legal</a>
<a class="text-on-surface-variant hover:text-primary transition-colors" href="connect.html">Connect</a>
</nav>
<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
Join Waitlist
</button>
</div>
</header>"""

LEGAL_HEADER_SECURITY = """<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/5">
<div class="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
<a class="flex items-center gap-3 group" href="index.html">
<div class="w-10 h-10 rounded-xl kinetic-gradient flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
<img alt="" src="LogoMark%20Blue.svg" width="28" height="28" class="h-7 w-7"/>
</div>
<span class="text-2xl font-extrabold tracking-tighter text-white font-headline">UnioGate</span>
</a>
<nav class="hidden md:flex items-center gap-10">
<a class="text-on-surface-variant text-sm font-semibold tracking-tight hover:text-white transition-all duration-300" href="how-it-works.html">How it Works</a>
<a class="text-white border-b-2 border-primary pb-1 text-sm font-semibold tracking-tight transition-all duration-300" href="security.html">Security</a>
<a class="text-on-surface-variant text-sm font-semibold tracking-tight hover:text-white transition-all duration-300" href="vision.html">Vision</a>
<a class="text-on-surface-variant text-sm font-semibold tracking-tight hover:text-white transition-all duration-300" href="connect.html">Connect</a>
</nav>
<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container text-deep-navy px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
Join Waitlist
</button>
</div>
</header>"""

LEGAL_HEADER_COOKIE = """<!-- Navigation -->
<header class="fixed top-0 w-full z-50 kinetic-blur bg-deep-navy/80 border-b border-white/5">
<div class="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
<a class="flex items-center gap-3 group" href="index.html">
<div class="bg-deep-blue p-2 rounded-lg overflow-hidden flex items-center justify-center">
<img alt="" src="LogoMark%20Blue.svg" width="28" height="28" class="h-7 w-7"/>
</div>
<span class="text-2xl font-extrabold tracking-tight text-white font-headline">UnioGate</span>
</a>
<nav class="hidden lg:flex items-center gap-10">
<a class="text-on-surface/70 hover:text-white transition-all font-headline font-semibold text-sm tracking-wide" href="how-it-works.html">How it Works</a>
<a class="text-on-surface/70 hover:text-white transition-all font-headline font-semibold text-sm tracking-wide" href="vision.html">Vision</a>
<a class="text-on-surface/70 hover:text-white transition-all font-headline font-semibold text-sm tracking-wide" href="connect.html">Connect</a>
<a class="text-teal font-headline font-semibold text-sm tracking-wide border-b-2 border-teal pb-1" href="cookie-settings.html">Legal</a>
</nav>
<button type="button" data-waitlist-open class="bg-white/5 border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors rounded-xl">
Pre-launch Access
</button>
</div>
</header>"""


def load_user_blob() -> str:
    with TRANSCRIPT.open(encoding="utf-8") as f:
        for line in f:
            o = json.loads(line)
            if o.get("role") != "user":
                continue
            c = o["message"]["content"]
            t = c[0]["text"] if isinstance(c, list) else c
            if (
                "Privacy Policy | UnioGate Infrastructure" in t
                and "This is the privacy policy page codes" in t
            ):
                return (
                    t.replace("<user_query>", "")
                    .replace("</user_query>", "")
                    .strip()
                )
    raise SystemExit("Could not find legal pages blob in transcript")


def trim_after_closing_html(html: str) -> str:
    lower = html.lower()
    end = lower.find("</html>")
    if end >= 0:
        return html[: end + len("</html>")].strip()
    return html.strip()


def split_pages(blob: str) -> tuple[str, str, str, str]:
    idx_terms = blob.find("This is the Terms of Service page codes")
    idx_sec = blob.find("This is the Security page codes")
    idx_cookie = blob.find("This is the Cookies settings page code")
    if min(idx_terms, idx_sec, idx_cookie) < 0:
        raise SystemExit("Split markers missing")

    privacy = re.sub(
        r"^.*?This is the privacy policy page codes\s*",
        "",
        blob[:idx_terms],
        flags=re.DOTALL,
    ).strip()
    terms = re.sub(
        r"^This is the Terms of Service page codes,?\s*",
        "",
        blob[idx_terms:idx_sec],
        flags=re.DOTALL,
    ).strip()
    sec = re.sub(
        r"^This is the Security page codes,?\s*",
        "",
        blob[idx_sec:idx_cookie],
        flags=re.DOTALL,
    ).strip()
    cookie = re.sub(
        r"^This is the Cookies settings page code\.?\s*",
        "",
        blob[idx_cookie:],
        flags=re.DOTALL,
    ).strip()
    return (
        trim_after_closing_html(privacy),
        trim_after_closing_html(terms),
        trim_after_closing_html(sec),
        trim_after_closing_html(cookie),
    )


def add_favicon(html: str) -> str:
    if 'rel="icon"' in html or "rel='icon'" in html:
        return html
    return html.replace(
        "</title>",
        '</title>\n<link rel="icon" href="LogoMark%20Blue.svg" type="image/svg+xml"/>',
        1,
    )


def add_scripts(html: str) -> str:
    if "cookie-consent.js" in html:
        return html
    return html.replace("</body>", SCRIPTS + "</body>", 1)


def patch_privacy(html: str) -> str:
    html = re.sub(
        r"<!-- TopAppBar Component -->.*?</header>",
        LEGAL_HEADER_PRIVACY,
        html,
        count=1,
        flags=re.DOTALL,
    )
    # Sidebar
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-lg" data-icon="policy"',
        'href="privacy-policy.html">\n<span class="material-symbols-outlined text-lg" data-icon="policy"',
        1,
    )
    html = html.replace(
        'Policy\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="#">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="gavel"',
        'Policy\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="terms-of-service.html">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="gavel"',
        1,
    )
    html = html.replace(
        'Service\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="#">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="verified_user"',
        'Service\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="security.html">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="verified_user"',
        1,
    )
    html = html.replace(
        'Compliance\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="#">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="cookie"',
        'Compliance\n                        </a>\n<a class="flex items-center gap-3 px-4 py-3 font-body text-sm font-medium text-on-surface-variant hover:text-white hover:bg-white/5 transition-all group" href="cookie-settings.html">\n<span class="material-symbols-outlined text-lg opacity-50 group-hover:opacity-100" data-icon="cookie"',
        1,
    )
    # Footer Legal column
    html = html.replace(
        '<a class="text-sm text-teal-brand font-semibold transition-colors" href="#">Privacy Policy</a>',
        '<a class="text-sm text-teal-brand font-semibold transition-colors" href="privacy-policy.html">Privacy Policy</a>',
        1,
    )
    html = html.replace(
        '<a class="text-sm text-on-surface-variant hover:text-teal-brand transition-colors" href="#">Terms of Use</a>',
        '<a class="text-sm text-on-surface-variant hover:text-teal-brand transition-colors" href="terms-of-service.html">Terms of Use</a>',
        1,
    )
    html = html.replace(
        '<a class="text-sm text-on-surface-variant hover:text-teal-brand transition-colors" href="#">Compliance</a>',
        '<a class="text-sm text-on-surface-variant hover:text-teal-brand transition-colors" href="security.html">Compliance</a>',
        1,
    )
    return html


def patch_terms(html: str) -> str:
    html = re.sub(
        r"<!-- TopAppBar -->.*?</header>",
        LEGAL_HEADER_TERMS,
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-lg group-hover:text-primary" data-icon="policy"',
        'href="privacy-policy.html">\n<span class="material-symbols-outlined text-lg group-hover:text-primary" data-icon="policy"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-lg" data-icon="gavel"',
        'href="terms-of-service.html">\n<span class="material-symbols-outlined text-lg" data-icon="gavel"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-lg group-hover:text-primary" data-icon="verified_user"',
        'href="security.html">\n<span class="material-symbols-outlined text-lg group-hover:text-primary" data-icon="verified_user"',
        1,
    )
    html = html.replace(
        '<a class="text-primary" href="#">Terms of Service</a>',
        '<a class="text-primary" href="terms-of-service.html">Terms of Service</a>',
        1,
    )
    html = html.replace(
        '<a class="hover:text-primary transition-colors" href="#">Privacy Policy</a>',
        '<a class="hover:text-primary transition-colors" href="privacy-policy.html">Privacy Policy</a>',
        1,
    )
    html = html.replace(
        '<a class="hover:text-primary transition-colors" href="#">Compliance</a>',
        '<a class="hover:text-primary transition-colors" href="security.html">Compliance</a>',
        1,
    )
    html = html.replace(
        '<a class="hover:text-primary transition-colors" href="#">Security</a>',
        '<a class="hover:text-primary transition-colors" href="security.html">Security</a>',
        1,
    )
    html = html.replace(
        '<a class="hover:text-secondary transition-colors" href="#">Privacy Policy</a>',
        '<a class="hover:text-secondary transition-colors" href="privacy-policy.html">Privacy Policy</a>',
        1,
    )
    html = html.replace(
        '<a class="hover:text-secondary transition-colors" href="#">Terms of Service</a>',
        '<a class="hover:text-secondary transition-colors" href="terms-of-service.html">Terms of Service</a>',
        1,
    )
    return html


def patch_security(html: str) -> str:
    html = re.sub(
        r"<!-- TopAppBar -->.*?</header>",
        LEGAL_HEADER_SECURITY,
        html,
        count=1,
        flags=re.DOTALL,
    )
    # Footer company column
    html = html.replace(
        '<a class="text-on-surface-variant hover:text-white transition-colors text-sm" href="#">Privacy Policy</a>',
        '<a class="text-on-surface-variant hover:text-white transition-colors text-sm" href="privacy-policy.html">Privacy Policy</a>',
        1,
    )
    html = html.replace(
        '<a class="text-on-surface-variant hover:text-white transition-colors text-sm" href="#">Terms of Service</a>',
        '<a class="text-on-surface-variant hover:text-white transition-colors text-sm" href="terms-of-service.html">Terms of Service</a>',
        1,
    )
    return html


def patch_cookie(html: str) -> str:
    html = re.sub(
        r"<!-- Navigation -->.*?</header>",
        LEGAL_HEADER_COOKIE,
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="policy"',
        'href="privacy-policy.html">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="policy"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="gavel"',
        'href="terms-of-service.html">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="gavel"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="security"',
        'href="security.html">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="security"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-xl" data-icon="cookie"',
        'href="cookie-settings.html">\n<span class="material-symbols-outlined text-xl" data-icon="cookie"',
        1,
    )
    html = html.replace(
        'href="#">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="verified_user"',
        'href="security.html">\n<span class="material-symbols-outlined text-xl group-hover:text-teal" data-icon="verified_user"',
        1,
    )
    html = html.replace(
        '<a class="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-teal transition-colors" href="#">Cookie Policy</a>',
        '<a class="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-teal transition-colors" href="cookie-settings.html">Cookie Policy</a>',
        1,
    )
    html = html.replace(
        '<a class="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-teal transition-colors" href="#">Privacy Hub</a>',
        '<a class="font-body text-[10px] uppercase tracking-widest text-white/40 hover:text-teal transition-colors" href="privacy-policy.html">Privacy Hub</a>',
        1,
    )
    # View Privacy Policy button — wrap or use anchor
    html = html.replace(
        '<button class="bg-white text-deep-navy px-10 py-4 font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-teal hover:text-white transition-all shadow-xl active:scale-95">\n<span class="material-symbols-outlined text-sm font-bold" data-icon="visibility">visibility</span>\n                        View Privacy Policy\n                    </button>',
        '<a class="bg-white text-deep-navy px-10 py-4 font-headline font-extrabold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-teal hover:text-white transition-all shadow-xl active:scale-95" href="privacy-policy.html">\n<span class="material-symbols-outlined text-sm font-bold" data-icon="visibility">visibility</span>\n                        View Privacy Policy\n                    </a>',
        1,
    )
    return html


def main() -> None:
    blob = load_user_blob()
    privacy, terms, sec, cookie = split_pages(blob)

    out = [
        ("privacy-policy.html", privacy, patch_privacy),
        ("terms-of-service.html", terms, patch_terms),
        ("security.html", sec, patch_security),
        ("cookie-settings.html", cookie, patch_cookie),
    ]

    for name, raw, patcher in out:
        html = add_favicon(raw)
        html = patcher(html)
        html = add_scripts(html)
        path = ROOT / name
        path.write_text(html, encoding="utf-8", newline="\n")
        print("Wrote", path, len(html), "bytes")


if __name__ == "__main__":
    main()
