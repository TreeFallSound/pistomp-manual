(function () {
  var root = document.documentElement;
  var modal = document.getElementById("search-modal");
  var openBtn = document.getElementById("search-open");
  var config = document.querySelector("pagefind-config");
  if (!modal || !openBtn || !config) return;

  var base = config.getAttribute("bundle-path");

  // Pagefind gates its dark palette behind [data-pf-theme="dark"] and never
  // reads prefers-color-scheme, so tokens we don't override stay light and
  // paint black shadows onto the dark modal. Mirror the resolved theme here;
  // "system" means no data-theme attribute, so fall back to the media query.
  var dark = window.matchMedia("(prefers-color-scheme: dark)");

  function syncTheme() {
    var chosen = root.getAttribute("data-theme");
    var resolved = chosen === "light" || chosen === "dark" ? chosen : dark.matches ? "dark" : "light";
    root.setAttribute("data-pf-theme", resolved);
  }

  syncTheme();
  dark.addEventListener("change", syncTheme);
  new MutationObserver(syncTheme).observe(root, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  var loaded = null;
  var ready = false;

  function load(tag, attrs) {
    return new Promise(function (resolve, reject) {
      var el = Object.assign(document.createElement(tag), attrs);
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }

  // The component bundle is ~175 KB. Fetching it on every page view to serve
  // the minority who search is a bad trade; hover gives it a head start.
  function boot() {
    if (loaded) return loaded;
    loaded = Promise.all([
      load("link", { rel: "stylesheet", href: base + "pagefind-component-ui.css" }),
      load("script", { type: "module", src: base + "pagefind-component-ui.js" }),
    ])
      .then(function () {
        return customElements.whenDefined("pagefind-modal");
      })
      .then(function () {
        ready = true;
      })
      .catch(function (err) {
        loaded = null;
        throw err;
      });
    return loaded;
  }

  // The component focuses its input from a requestAnimationFrame callback, which
  // on iOS is a separate task from the tap and so carries no user activation:
  // the caret lands in the field but the on-screen keyboard never rises. Focus
  // it ourselves, synchronously inside the gesture.
  function focusInput() {
    var host = modal.querySelector("pagefind-input");
    var el = host && (host.inputEl || host.querySelector("input"));
    if (el) el.focus();
    return !!el;
  }

  // Cold first tap: the bundle is still in flight, so there is nothing to focus
  // before the gesture ends. Focus a throwaway field to raise the keyboard now
  // and hand focus over once the real input exists — iOS keeps the keyboard up
  // across a focus move between text fields.
  function decoy() {
    var el = document.createElement("input");
    el.type = "search";
    el.setAttribute("aria-hidden", "true");
    el.tabIndex = -1;
    // font-size below 16px triggers Safari's zoom-on-focus; opacity rather than
    // visibility/display because iOS refuses focus on non-rendered elements.
    el.style.cssText =
      "position:fixed;top:50%;left:0;width:1px;height:1px;opacity:0;border:0;padding:0;font-size:16px;pointer-events:none;";
    document.body.appendChild(el);
    el.focus();
    return el;
  }

  function open() {
    // open() is imperative on the component; there is no `open` attribute.
    if (ready) {
      modal.open();
      focusInput();
      return;
    }
    var stand = decoy();
    boot().then(
      function () {
        modal.open();
        focusInput();
        stand.remove();
      },
      function () {
        stand.remove();
      }
    );
  }

  openBtn.addEventListener("click", open);
  // pointerenter never fires on touch; pointerdown gives the fetch a head start
  // between finger-down and click, which is often enough to take the warm path.
  openBtn.addEventListener("pointerenter", boot);
  openBtn.addEventListener("pointerdown", boot);

  // A result pointing at the current page only changes the hash, which is not
  // a navigation, so the dialog would otherwise stay up over the anchor the
  // reader just asked to see.
  modal.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[href]");
    if (link && typeof modal.close === "function") modal.close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "/") return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    e.preventDefault();
    open();
  });
})();
