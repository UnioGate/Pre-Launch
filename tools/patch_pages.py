"""Apply shared patches to static HTML pages. Run: python tools/patch_pages.py path/to/file.html \"Page Title\""""
import re
import sys
from pathlib import Path

LOGO_NAV = (
    '<a href="index.html" class="flex items-center gap-2 text-xl font-bold tracking-tighter text-[#B5C4FF] font-headline">'
    '<img alt="" src="LogoMark%20Blue.svg" width="36" height="36" class="h-9 w-9 shrink-0"/>'
    "<span>UnioGate</span></a>"
)

LOGO_NAV_H2 = LOGO_NAV.replace("text-xl", "text-2xl")

LOGO_FOOTER = (
    '<a href="index.html" class="inline-flex items-center gap-2 text-2xl font-black text-[#B5C4FF] mb-6 font-headline">'
    '<img alt="" src="LogoMark%20Blue.svg" width="32" height="32" class="h-8 w-8 shrink-0"/>'
    "<span>UnioGate</span></a>"
)

LOGO_FOOTER_ALT = (
    '<a href="index.html" class="inline-flex items-center gap-2 text-xl font-bold text-[#B5C4FF] mb-4 font-headline">'
    '<img alt="" src="LogoMark%20Blue.svg" width="28" height="28" class="h-7 w-7 shrink-0"/>'
    "<span>UnioGate</span></a>"
)


def dedupe_material(html: str) -> str:
    pat = (
        r'(<link href="https://fonts\.googleapis\.com/css2\?family=Material\+Symbols\+Outlined[^>]+/>)\s*'
        r'<link href="https://fonts\.googleapis\.com/css2\?family=Material\+Symbols\+Outlined[^>]+/>'
    )
    return re.sub(pat, r"\1", html, count=1)


def add_head(html: str, title: str) -> str:
    if 'rel="icon"' in html:
        return html
    icon = '<link rel="icon" href="LogoMark%20Blue.svg" type="image/svg+xml"/>'
    if re.search(r"<title>\s*[^<]*\s*</title>", html):
        return html.replace("</title>", "</title>\n" + icon, 1)
    return re.sub(
        r'(<meta content="width=device-width[^"]*" name="viewport"/>)',
        r"\1\n<title>" + title + "</title>\n" + icon,
        html,
        count=1,
    )


def nav_links(html: str) -> str:
    html = html.replace('href="#">Platform</a>', 'href="index.html">Platform</a>')
    html = html.replace('href="#">Infrastructure</a>', 'href="how-it-works.html">Infrastructure</a>')
    html = html.replace('href="#">Developers</a>', 'href="connect.html">Developers</a>')
    # First top-nav "Company" only (before footer duplicate patterns)
    if 'href="about.html">Company</a>' not in html:
        html = html.replace('href="#">Company</a>', 'href="about.html">Company</a>', 1)
    return html


def replace_nav_logo(html: str) -> str:
    patterns = [
        (
            r'<div class="text-xl font-bold tracking-tighter text-\[#B5C4FF\] font-headline">\s*UnioGate\s*</div>',
            LOGO_NAV,
        ),
        (
            r'<div class="text-2xl font-bold tracking-tighter text-\[#B5C4FF\] dark:text-blue-200 font-headline">\s*UnioGate\s*</div>',
            LOGO_NAV_H2,
        ),
        (
            r'<div class="text-xl font-bold tracking-tighter text-\[#B5C4FF\]">\s*UnioGate\s*</div>',
            LOGO_NAV,
        ),
    ]
    for pat, repl in patterns:
        html, n = re.subn(pat, repl, html, count=1)
        if n:
            return html
    return html


def replace_footer_logo(html: str) -> str:
    for pat, repl in [
        (
            r'<span class="text-2xl font-black text-\[#B5C4FF\] mb-6 block font-headline">\s*UnioGate\s*</span>',
            LOGO_FOOTER,
        ),
        (
            r'<span class="text-xl font-bold text-\[#B5C4FF\] mb-4 block font-headline">\s*UnioGate\s*</span>',
            LOGO_FOOTER_ALT,
        ),
    ]:
        html, n = re.subn(pat, repl, html, count=1)
        if n:
            return html
    return html


def waitlist_attrs(html: str) -> str:
    replacements = [
        (
            '<button class="kinetic-gradient text-on-primary font-headline text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="kinetic-gradient text-on-primary font-headline text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform">',
        ),
        (
            '<button class="bg-primary-container text-primary px-6 py-2 rounded-xl font-headline font-bold text-sm active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="bg-primary-container text-primary px-6 py-2 rounded-xl font-headline font-bold text-sm active:scale-95 transition-transform">',
        ),
        (
            '<button class="kinetic-gradient text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="kinetic-gradient text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform">',
        ),
        (
            '<button class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">',
            '<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">',
        ),
        (
            '<button class="bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 rounded-xl text-on-primary font-headline text-sm font-bold active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 rounded-xl text-on-primary font-headline text-sm font-bold active:scale-95 transition-transform">',
        ),
        (
            '<button class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-headline font-bold text-sm active:scale-95 transition-transform">',
        ),
        (
            '<button class="kinetic-gradient text-on-primary px-6 py-2.5 rounded-xl font-jakarta font-bold text-sm active:scale-95 transition-transform">',
            '<button type="button" data-waitlist-open class="kinetic-gradient text-on-primary px-6 py-2.5 rounded-xl font-jakarta font-bold text-sm active:scale-95 transition-transform">',
        ),
        (
            '<button class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-headline font-bold text-lg shadow-[0_8px_32px_rgba(37,62,134,0.3)]">Join the Waitlist</button>',
            '<button type="button" data-waitlist-open class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-headline font-bold text-lg shadow-[0_8px_32px_rgba(37,62,134,0.3)]">Join the Waitlist</button>',
        ),
        (
            '<button class="px-10 py-5 bg-primary text-on-primary font-bold rounded-xl text-lg hover:brightness-110 active:scale-95 transition-all">',
            '<button type="button" data-waitlist-open class="px-10 py-5 bg-primary text-on-primary font-bold rounded-xl text-lg hover:brightness-110 active:scale-95 transition-all">',
        ),
        (
            '<button class="bg-on-primary text-primary px-10 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform hover:shadow-xl">Apply Now</button>',
            '<button type="button" data-waitlist-open class="bg-on-primary text-primary px-10 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform hover:shadow-xl">Apply Now</button>',
        ),
    ]
    for old, new in replacements:
        if old in html and "data-waitlist-open" not in html.split(old)[0][-200:]:
            html = html.replace(old, new, 1)
    return html


def footer_company(html: str) -> str:
    pairs = [
        ('href="#">About Us</a>', 'href="about.html">About Us</a>'),
        ('href="#">About</a>', 'href="about.html">About</a>'),
        ('href="#">Blog</a>', 'href="blog.html">Blog</a>'),
        ('href="#">Careers</a>', 'href="careers.html">Careers</a>'),
        ('href="#">Press</a>', 'href="press.html">Press</a>'),
        ('href="#">Vision</a>', 'href="vision.html">Vision</a>'),
        ('href="#">Connect</a>', 'href="connect.html">Connect</a>'),
    ]
    for a, b in pairs:
        html = html.replace(a, b)
    return html


def inject_script(html: str) -> str:
    if "waitlist-modal.js" in html:
        return html
    return html.replace("</body></html>", '<script src="assets/waitlist-modal.js" defer></script>\n</body></html>')


def patch(html: str, title: str) -> str:
    html = dedupe_material(html)
    html = add_head(html, title)
    html = nav_links(html)
    html = replace_nav_logo(html)
    html = replace_footer_logo(html)
    html = waitlist_attrs(html)
    html = footer_company(html)
    html = inject_script(html)
    return html


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    path = Path(sys.argv[1])
    title = sys.argv[2]
    html = path.read_text(encoding="utf-8")
    path.write_text(patch(html, title), encoding="utf-8")
    print("Patched", path)


if __name__ == "__main__":
    main()
