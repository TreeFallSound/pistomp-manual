(function () {
  var prefix = window.MANUAL_PATH_PREFIX || "/";
  var modal = document.getElementById("search-modal");
  var openBtn = document.getElementById("search-open");
  if (!modal || !openBtn) return;

  var loaded = null;

  function load(tag, attrs) {
    return new Promise(function (resolve, reject) {
      var el = Object.assign(document.createElement(tag), attrs);
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
  }

  // 130 KB of widget on a page nobody may search is worse than a beat of
  // latency on the page they do.
  function boot() {
    if (loaded) return loaded;
    loaded = Promise.all([
      load("link", { rel: "stylesheet", href: prefix + "pagefind/pagefind-ui.css" }),
      load("script", { src: prefix + "pagefind/pagefind-ui.js" }),
    ]).then(function () {
      new PagefindUI({
        element: "#search-ui",
        bundlePath: prefix + "pagefind/",
        showImages: false,
        showSubResults: true,
        pageSize: 8,
        autofocus: true,
        processResult: function (result) {
          result.url = prefix + result.url.replace(/^\//, "");
          (result.sub_results || []).forEach(function (sub) {
            sub.url = prefix + sub.url.replace(/^\//, "");
          });
          return result;
        },
      });
    });
    return loaded;
  }

  function open() {
    modal.hidden = false;
    document.body.classList.add("search-active");
    boot().then(function () {
      var input = modal.querySelector("input");
      if (input) input.focus();
    });
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("search-active");
    openBtn.focus();
  }

  openBtn.addEventListener("click", open);
  openBtn.addEventListener("pointerenter", boot);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      close();
      return;
    }
    if (e.key !== "/" || !modal.hidden) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    e.preventDefault();
    open();
  });

  // Without this the modal is still open when the reader hits back.
  window.addEventListener("pageshow", function () {
    if (!modal.hidden) close();
  });
})();
