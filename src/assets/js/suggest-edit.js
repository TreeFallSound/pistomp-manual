(function () {
  var REPO = "sastraxi/pistomp-manual";
  var BRANCH = "main";

  var main = document.querySelector(".content[data-source-path]");
  if (!main) return;

  var sourcePath = main.getAttribute("data-source-path").replace(/^\.\//, "");
  var lineOffset = parseInt(main.getAttribute("data-line-offset"), 10) || 0;

  var button = document.createElement("a");
  button.className = "suggest-edit-btn";
  button.textContent = "Suggest edit…";
  button.target = "_blank";
  button.rel = "noopener";
  document.body.appendChild(button);

  function hide() {
    button.classList.remove("visible");
  }

  function show(rect, line) {
    var mainRect = main.getBoundingClientRect();
    button.href = "https://github.com/" + REPO + "/edit/" + BRANCH + "/" + sourcePath + "#L" + line;
    button.style.top = window.scrollY + rect.top + "px";
    button.style.left = window.scrollX + mainRect.right + "px";
    button.classList.add("visible");
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
    if (!button.contains(e.target)) hide();
  });
  window.addEventListener("scroll", hide, true);
  window.addEventListener("resize", hide);
})();
