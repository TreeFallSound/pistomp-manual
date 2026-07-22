(function () {
  var REPO = "sastraxi/pistomp-manual";
  var BRANCH = "main";

  var main = document.querySelector(".content[data-source-path]");
  if (!main) return;

  var sourcePath = main.getAttribute("data-source-path").replace(/^\.\//, "");
  var lineOffset = parseInt(main.getAttribute("data-line-offset"), 10) || 0;
  var repoRoot = (main.getAttribute("data-repo-root") || "").replace(/\/$/, "");

  // On the dev machine (localhost) the editor and the build share a filesystem,
  // so the button opens VS Code at the exact line instead of GitHub's editor.
  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && repoRoot;

  var button = document.createElement("a");
  button.className = isLocal ? "suggest-edit-btn open-editor-btn" : "suggest-edit-btn";
  button.textContent = isLocal ? "Open in VS Code" : "Suggest edit…";
  if (!isLocal) {
    button.target = "_blank";
    button.rel = "noopener";
  }
  document.body.appendChild(button);

  function hide() {
    button.classList.remove("visible");
  }

  function show(rect, line) {
    var mainRect = main.getBoundingClientRect();
    // Local: vscode://file/<abs-path>:<line>:<col> — OS-registered URL handler.
    button.href = isLocal
      ? "vscode://file" + repoRoot + "/" + sourcePath + ":" + line + ":1"
      : "https://github.com/" + REPO + "/edit/" + BRANCH + "/" + sourcePath + "#L" + line;
    button.style.top = window.scrollY + rect.top + "px";
    button.classList.add("visible");
    // Anchor to the content's right edge, but pull left if it would run off-screen.
    var left = mainRect.right;
    var marginLeft = parseFloat(getComputedStyle(button).marginLeft) || 0;
    var overflow = left + marginLeft + button.offsetWidth - document.documentElement.clientWidth;
    if (overflow > 0) left -= overflow + 8;
    button.style.left = window.scrollX + left + "px";
  }

  document.addEventListener("mouseup", function (e) {
    if (button.contains(e.target)) return;

    var selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      hide();
      return;
    }

    var anchorNode = selection.anchorNode;
    var el = anchorNode && anchorNode.nodeType === 1 ? anchorNode : anchorNode && anchorNode.parentElement;
    var block = el ? el.closest("[data-line]") : null;
    if (!block || !main.contains(block)) {
      hide();
      return;
    }

    var line = parseInt(block.getAttribute("data-line"), 10) + lineOffset;
    var rect = selection.getRangeAt(0).getBoundingClientRect();
    show(rect, line);
  });

  document.addEventListener("mousedown", function (e) {
    if (button.contains(e.target)) return;
    hide();
  });
  window.addEventListener("scroll", hide, true);
  window.addEventListener("resize", hide);
})();
