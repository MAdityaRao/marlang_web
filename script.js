/* ============================================================
   MAR LANG — script.js
   ============================================================ */

'use strict';

/* ── TYPING ANIMATION ─────────────────────────────────────── */

const MAR_CODE_HTML = `<span class="m-cmt">// Prime checker in Mar</span>

<span class="m-type">int</span> <span class="m-fn">prime</span>(<span class="m-type">int</span> n)
{
    <span class="m-kw">if</span>(n &lt; <span class="m-num">2</span>)
        <span class="m-kw">return</span> <span class="m-num">0</span>
    <span class="m-type">int</span> i = <span class="m-num">2</span>
    <span class="m-kw">while</span>(i * i &lt;= n)
    {
        <span class="m-kw">if</span>(n % i == <span class="m-num">0</span>)
            <span class="m-kw">return</span> <span class="m-num">0</span>
        i = i + <span class="m-num">1</span>
    }
    <span class="m-kw">return</span> <span class="m-num">1</span>
}

<span class="m-type">int</span> <span class="m-fn">main</span>()
{
    <span class="m-fn">print</span>(<span class="m-str">"Primes from 2 to 20:\\n"</span>)
    <span class="m-kw">for</span> i <span class="m-kw">in</span> <span class="m-fn">range</span>(<span class="m-num">2</span>, <span class="m-num">21</span>)
    {
        <span class="m-kw">if</span>(<span class="m-fn">prime</span>(i))
            <span class="m-fn">print</span>(<span class="m-str">"%d "</span>, i)
    }
    <span class="m-fn">print</span>(<span class="m-str">"\\n"</span>)
    <span class="m-kw">return</span> <span class="m-num">0</span>
}`;

/**
 * Types HTML source character-by-character into a container element.
 * HTML tags and entities are injected instantly so only visible text
 * characters incur the typing delay.
 *
 * @param {HTMLElement} container  - target element
 * @param {string}      html       - source HTML string to type
 * @param {number}      charDelay  - ms per visible character
 * @param {number}      startDelay - ms before typing begins
 */
function typeHtml(container, html, charDelay, startDelay) {
  const cursor = document.getElementById('type-cursor');
  if (!cursor) return;

  let i = 0;
  let rendered = '';

  function step() {
    if (i >= html.length) return;

    // Swallow entire HTML tag instantly
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      rendered += html.slice(i, end + 1);
      i = end + 1;
      flush();
      setTimeout(step, 2);
      return;
    }

    // Swallow HTML entity instantly
    if (html[i] === '&') {
      const end = html.indexOf(';', i);
      rendered += html.slice(i, end + 1);
      i = end + 1;
      flush();
      setTimeout(step, charDelay);
      return;
    }

    // Visible character — show and delay
    rendered += html[i];
    i++;
    flush();

    // Longer pause on newlines for a natural typing feel
    const next = html[i];
    const delay = (next === '\n' || html[i - 1] === '\n') ? charDelay * 5 : charDelay;
    setTimeout(step, delay);
  }

  function flush() {
    container.innerHTML = rendered;
    if (cursor) container.appendChild(cursor);
  }

  setTimeout(step, startDelay);
}

/* ── SCROLL-TRIGGERED TYPING ──────────────────────────────── */

function initTypingAnimation() {
  const showcase = document.getElementById('showcase');
  const marCode  = document.getElementById('mar-code-panel');
  if (!showcase || !marCode) return;

  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !marCode.dataset.typed) {
        marCode.dataset.typed = 'true';
        typeHtml(marCode, MAR_CODE_HTML, 16, 400);
        obs.disconnect();
      }
    });
  }, { threshold: 0.25 });

  obs.observe(showcase);
}

/* ── COPY BUTTONS ─────────────────────────────────────────── */

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const text = btn.dataset.copy;
      const label = btn.querySelector('.copy-label') || btn;

      navigator.clipboard.writeText(text).then(function() {
        label.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          label.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2200);
      }).catch(function() {
        // Fallback for browsers without clipboard API
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);
        label.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function() {
          label.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */

function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .pipe-step, .roadmap-item, .reveal'
  );

  targets.forEach(function(el) {
    el.style.opacity = '0';
  });

  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'revealUp 0.55s ease forwards';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  // Stagger sibling groups
  const staggerGroups = [
    '.features-grid .feature-card',
    '.pipeline-flow .pipe-step',
    '.roadmap-item',
  ];

  staggerGroups.forEach(function(selector) {
    document.querySelectorAll(selector).forEach(function(el, i) {
      el.style.animationDelay = (i * 0.07) + 's';
    });
  });

  targets.forEach(function(el) {
    obs.observe(el);
  });
}

/* ── ACTIVE NAV LINK (docs) ───────────────────────────────── */

function initDocsActiveLink() {
  const links = document.querySelectorAll('.sidebar-link');
  if (!links.length) return;

  const sections = Array.from(document.querySelectorAll('.doc-section[id]'));

  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(function(link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(function(s) { obs.observe(s); });

  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── INIT ─────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
  initTypingAnimation();
  initCopyButtons();
  initScrollReveal();
  initDocsActiveLink();
});