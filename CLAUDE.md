# Helmy.github.io — Project Notes

Jekyll technical blog / documentation site published at https://Helmy.github.io/.

## Project posture

- **Repo**: `github.com/Helmy/github.io` — public (GitHub Pages user site). Anything committed to `main` is public forever.
- **Owner use**: personal / hobby.
- **Default branch**: `main`. Pushes to `main` deploy automatically via GitHub Pages.
- **Trusted domain**: `Helmy.github.io`.
- **Do not commit**: `.vs/`, `Gemfile.lock`, `_site/`, `.jekyll-cache/`, `vendor/`, or anything containing secrets. `.gitignore` already covers these.

## Local development

Requires **Ruby + Bundler**. If Ruby isn't installed:

- Windows: install via `winget install RubyInstallerTeam.Ruby.3.2` (or use RubyInstaller with Devkit) and re-open the shell.
- Then run once: `gem install bundler`.

First-time or after `Gemfile` changes:

```bash
bundle install
```

Serve locally with live reload at http://localhost:4000:

```bash
bundle exec jekyll serve --livereload
```

One-off build into `_site/`:

```bash
bundle exec jekyll build
```

## Publishing

Push to `main`. GitHub Pages rebuilds in ~30–90s. If the build fails, the previous version stays live and GitHub emails the account owner with the error.

```bash
git add _layouts _includes _sass assets index.md
git commit -m "Describe the change"
git push origin main
```

## Repo layout

```
_config.yml             Site config (title, description, plugins)
_layouts/
  default.html          Base page shell (header, main, footer, JS)
  post.html             Blog post layout (breadcrumbs, tags, pager)
_includes/
  head.html             <head> — fonts, SEO, CSS, theme bootstrap
  header.html           Sticky header (brand, nav, theme toggle, GitHub)
  footer.html           Site footer
_sass/
  _tokens.scss          Design tokens (colors, spacing, type, dark mode)
  _base.scss            Element resets, typography, focus, skip link
  _layout.scss          Header + footer
  _components.scss      Hero, category sections, post cards, post body,
                        breadcrumbs, pager, callouts
  _code.scss            Code blocks (light inline, dark blocks, syntax colors)
  rtl-article.scss      Arabic (RTL) post styles, scoped to .rtl-article
assets/
  main.scss             SCSS entrypoint — imports the partials above
  js/site.js            Theme toggle + code-copy button
index.md                Home page (hero + category cards)
Security/_posts/        Blog posts, category "Security"
```

## Authoring

### New post

Create `Security/_posts/YYYY-MM-DD-slug.md` (or a new category directory):

```markdown
---
layout: post
title: "Post title"
date: 2026-08-16 10:00:00 +0300
tags: [XSS, CSP]
description: "One-line summary shown on cards and in metadata."
---

Body in Markdown.
```

For Arabic (RTL) content, wrap the body in the same `.rtl-article` div used by the existing XSS post so the RTL typography kicks in.

### Code blocks

Standard fenced blocks. The JS wrapper adds a language chip + Copy button automatically:

    ```csharp
    public async Task<User> GetUserAsync(Guid id)
        => await _userRepository.GetByIdAsync(id);
    ```

### Callouts

The CSS classes exist in `_sass/_components.scss` but there's no markdown shortcut yet. Until Phase 2 adds an `{% callout %}` include, raw HTML works:

```html
<div class="callout callout--tip">
  <div class="callout__icon">💡</div>
  <div class="callout__body">Body text with **markdown** allowed via `markdown="1"`.</div>
</div>
```

Variants: `callout--tip`, `callout--info`, `callout--warning`, `callout--danger`, `callout--success`.

## Theme

Light + dark themes are driven by a `data-theme` attribute on `<html>`.

- No user choice → follows `prefers-color-scheme` (with runtime sync when the OS setting flips).
- User clicks the header toggle → the choice is stored in `localStorage.theme` and takes precedence.
- An inline script in `head.html` sets the attribute before first paint — no flash of the wrong theme.

To add a new color, add it to `:root` and to the `@mixin dark-tokens` block in `_sass/_tokens.scss` so both themes stay consistent.

## Redesign roadmap

### Phase 1 — visual foundation (done)

- Custom Jekyll layouts + includes (no dependency on minima layouts)
- Design token system + light/dark mode
- Premium sticky header, footer, skip link
- Post layout with breadcrumbs, tags, prev/next pager
- Dark code blocks with language chip + one-click Copy
- Home page as hero + category card grid
- Accessible focus states, respects `prefers-reduced-motion`

### Phase 2 — navigation (next)

- Left sidebar with nested docs categories and active-page state
- Right sidebar "On this page" TOC with scroll-spy
- Mobile: sidebar becomes a drawer with a hamburger toggle

### Phase 3 — search

- `Ctrl` + `K` command palette
- Client-side index (lunr.js or similar), grouped results, keyboard navigation, recent searches

### Phase 4 — authoring polish

- Liquid include for callouts (`{% include callout.html type="tip" %}...{% endinclude %}` style)
- Version selector in the header (if versioned docs land)
- Optional reading-progress bar on long posts

## Troubleshooting

- **GitHub Pages build failed**: check the email GitHub sent. Common causes: unsupported plugin, invalid front-matter YAML, SCSS syntax error.
- **Local build fine, production broken**: pin gem versions in `Gemfile` and match what `github-pages` supports (see https://pages.github.com/versions/).
- **Post doesn't appear**: check the date isn't more than a few hours in the future beyond what `future: true` in `_config.yml` allows, and that the file is in a `_posts` directory.
- **Fonts don't load**: Google Fonts is loaded from `_includes/head.html`. Behind a strict CSP, self-host the fonts instead.
