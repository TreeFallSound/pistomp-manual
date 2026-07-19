// Theme switcher. Cycles system → light → dark; "system" clears the stored
// preference so the page follows prefers-color-scheme again.
(function () {
  var buttons = document.querySelectorAll('.theme-toggle');
  if (!buttons.length) return;

  var ORDER = ['system', 'light', 'dark'];
  var LABELS = {
    system: 'Colour theme: follow system',
    light: 'Colour theme: light',
    dark: 'Colour theme: dark'
  };

  function current() {
    var t = document.documentElement.getAttribute('data-theme');
    return t === 'light' || t === 'dark' ? t : 'system';
  }

  function apply(mode) {
    if (mode === 'system') {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.removeItem('theme'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', mode);
      try { localStorage.setItem('theme', mode); } catch (e) {}
    }
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-label', LABELS[mode]);
      b.setAttribute('title', LABELS[mode]);
    });
  }

  apply(current());

  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () {
      apply(ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length]);
    });
  });
})();

(function () {
  var sidebar = document.getElementById('sidebar');
  var toggle = document.getElementById('nav-toggle');
  var scrim = document.getElementById('scrim');
  if (!sidebar) return;

  // Keep the reader's place in the long nav list across page loads.
  var saved = sessionStorage.getItem('sidebarScroll');
  if (saved) sidebar.scrollTop = parseInt(saved, 10);
  sidebar.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (link && link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
      sessionStorage.setItem('sidebarScroll', sidebar.scrollTop);
    }
  }, true);

  if (!toggle || !scrim) return;

  var lastFocus = null;

  function isOpen() {
    return document.body.classList.contains('nav-open');
  }

  function open() {
    lastFocus = document.activeElement;
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    scrim.hidden = false;
    var active = sidebar.querySelector('.nav-link.active') || sidebar.querySelector('a');
    if (active) active.focus();
  }

  function close() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    scrim.hidden = true;
    if (lastFocus) lastFocus.focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) close(); else open();
  });

  scrim.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    // Trap focus between the toggle button and the last control in the drawer.
    var focusable = [toggle].concat(
      Array.prototype.slice
        .call(sidebar.querySelectorAll('a[href], button'))
        // The sidebar's theme toggle is display:none on mobile; skip it so the
        // trap never parks focus on something invisible.
        .filter(function (el) { return el.offsetParent !== null; })
    );
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Navigating away from a hash link inside the drawer should reveal the target.
  sidebar.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (link && isOpen()) close();
  });

  // If the viewport grows past the desktop breakpoint the drawer is no longer
  // overlaid, so drop the open state rather than leaving a stale scrim.
  var desktop = window.matchMedia('(min-width: 64em)');
  (desktop.addEventListener ? desktop.addEventListener.bind(desktop, 'change')
                            : desktop.addListener.bind(desktop))(function () {
    if (desktop.matches && isOpen()) close();
  });
})();
