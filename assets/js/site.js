(function () {
  'use strict';

  // ---- Theme toggle ----------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  function currentTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  // Sync when the OS preference changes and the user hasn't chosen manually.
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function (e) {
      var stored = localStorage.getItem('theme');
      if (!stored) applyTheme(e.matches ? 'dark' : 'light');
    });
  } catch (e) {}

  // ---- Code block enhancement -----------------------------------------
  var COPY_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHECK_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  function detectLanguage(highlightEl) {
    // Jekyll/Rouge emits: <figure class="highlight"><pre><code class="language-xxx">
    // or a bare <div class="highlight">. Try the code element first.
    var code = highlightEl.querySelector('code');
    if (code) {
      var match = /language-([\w-]+)/.exec(code.className || '');
      if (match) return match[1];
    }
    var cls = highlightEl.className || '';
    var m2 = /language-([\w-]+)/.exec(cls);
    if (m2) return m2[1];
    return '';
  }

  function extractText(highlightEl) {
    var code = highlightEl.querySelector('pre');
    return code ? code.innerText.replace(/\n$/, '') : highlightEl.innerText;
  }

  function enhanceHighlight(highlightEl) {
    if (highlightEl.closest('.code-block')) return; // already wrapped
    if (highlightEl.dataset.enhanced === 'true') return;
    highlightEl.dataset.enhanced = 'true';

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    var header = document.createElement('div');
    header.className = 'code-block__header';

    var lang = detectLanguage(highlightEl) || 'code';
    var langEl = document.createElement('span');
    langEl.className = 'code-block__lang';
    langEl.textContent = lang;

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'code-block__copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    copyBtn.innerHTML = COPY_ICON + '<span>Copy</span>';

    copyBtn.addEventListener('click', function () {
      var text = extractText(highlightEl);
      var done = function () {
        copyBtn.setAttribute('data-copied', 'true');
        copyBtn.innerHTML = CHECK_ICON + '<span>Copied</span>';
        setTimeout(function () {
          copyBtn.removeAttribute('data-copied');
          copyBtn.innerHTML = COPY_ICON + '<span>Copy</span>';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });

    header.appendChild(langEl);
    header.appendChild(copyBtn);

    highlightEl.parentNode.insertBefore(wrapper, highlightEl);
    wrapper.appendChild(header);
    wrapper.appendChild(highlightEl);

    // Neutralize the inner .highlight background so wrapper controls it.
    highlightEl.style.background = 'transparent';
    highlightEl.style.border = '0';
    highlightEl.style.borderRadius = '0';
    highlightEl.style.margin = '0';
    highlightEl.style.boxShadow = 'none';
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.highlight, figure.highlight').forEach(enhanceHighlight);

  // ---- Active heading in category nav (subtle) ------------------------
  // Nothing yet — reserved hook.
})();
