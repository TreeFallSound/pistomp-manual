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
      .catch(function (err) {
        loaded = null;
        throw err;
      });
    return loaded;
  }

  function open() {
    boot().then(function () {
      // open() is imperative on the component; there is no `open` attribute.
      modal.open();
    });
  }

  openBtn.addEventListener("click", open);
  openBtn.addEventListener("pointerenter", boot);

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
