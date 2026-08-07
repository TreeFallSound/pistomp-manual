// Landing on a page from search is only half the job: the reader still has to
// find the word. Pagefind writes the terms it matched into ?highlight= on every
// result URL; this marks them in the body and gives the reader a way to walk
// them. Nothing loads unless the param is present, so ordinary page views pay
// nothing for the 44 KB mark.js bundle.
(function () {
  var PARAM = "highlight";
  var params = new URLSearchParams(window.location.search);
  if (!params.getAll(PARAM).length) return;

  var config = document.querySelector("pagefind-config");
  var base = (config && config.getAttribute("bundle-path")) || "/pagefind/";

  function run(PagefindHighlight) {
    // addStyles injects a fixed yellow fill; style.css paints .pagefind-highlight
    // from the theme palette instead.
    new PagefindHighlight({ highlightParam: PARAM, addStyles: false });

    var marks = [].slice.call(document.querySelectorAll("mark.pagefind-highlight"));
    if (!marks.length) return;

    var index = -1;

    function show(i, scroll, smooth) {
      if (index >= 0) marks[index].classList.remove("pagefind-highlight-current");
      index = (i + marks.length) % marks.length;
      var el = marks[index];
      el.classList.add("pagefind-highlight-current");
      if (scroll) el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
      count.textContent = index + 1 + " of " + marks.length;
    }

    function inView(el) {
      var box = el.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= window.innerHeight;
    }

    var bar = document.createElement("div");
    bar.className = "match-nav";
    bar.setAttribute("data-pagefind-ignore", "");
    bar.innerHTML =
      '<span class="match-nav-count"></span>' +
      '<button type="button" class="match-nav-btn" data-step="-1" aria-label="Previous match">↑</button>' +
      '<button type="button" class="match-nav-btn" data-step="1" aria-label="Next match">↓</button>' +
      '<button type="button" class="match-nav-btn match-nav-close" aria-label="Clear highlights">✕</button>';
    document.body.appendChild(bar);
    var count = bar.querySelector(".match-nav-count");

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (btn.classList.contains("match-nav-close")) return clear();
      show(index + parseInt(btn.getAttribute("data-step"), 10), true, true);
    });

    function clear() {
      bar.remove();
      marks.forEach(function (el) {
        el.replaceWith.apply(el, [].slice.call(el.childNodes));
      });
      // Otherwise a reload re-marks what the reader just dismissed.
      var url = new URL(window.location.href);
      url.searchParams.delete(PARAM);
      history.replaceState(null, "", url);
      document.removeEventListener("keydown", keys);
    }

    function keys(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        show(index + (e.shiftKey ? -1 : 1), true, true);
      } else if (e.key === "Escape") {
        clear();
      }
    }
    document.addEventListener("keydown", keys);

    // A result row's anchor has already put the right heading at the top of the
    // viewport; only jump if the first match under it fell below the fold.
    var start = 0;
    if (window.location.hash) {
      var target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) {
        var after = marks.findIndex(function (el) {
          return target.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
        });
        if (after > -1) start = after;
      }
      show(start, !inView(marks[start]));
      return;
    }
    show(start, true);
  }

  import(base + "pagefind-highlight.js").then(function (mod) {
    run(mod.default || window.PagefindHighlight);
  });
})();
