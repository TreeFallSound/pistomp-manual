---
title: All Plugins
extraCss: plugin-index.css
wide: true
eleventyNavigation:
  key: plugins-all
  parent: plugins-section
  title: All Plugins
  order: 0
---

# All Plugins

Every LV2 plugin available on pi-Stomp: {{ plugins.length }} in total. Filter by name or category — this is a raw index, not editorial. See the [Plugin Reference]({{ '/plugins/' | url }}) for curated picks.

<div class="plugin-index" id="plugin-index">
  <div class="plugin-index-controls">
    <input type="search" id="plugin-search" placeholder="Search by name, category, or maintainer…">
    <select id="plugin-category-filter">
      <option value="">All categories</option>
    </select>
  </div>
  <table id="plugin-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Categories</th>
        <th>Maintainer</th>
        <th>License</th>
        <th>Version</th>
      </tr>
    </thead>
    <tbody>
      {%- for plugin in plugins %}
      <tr data-name="{{ plugin.name | lower }}" data-categories="{{ plugin.categories | join(',') }}" data-maintainer="{{ plugin.maintainer or '' }}">
        <td>
          <span class="plugin-name">{{ plugin.name }}</span>
          {%- if plugin.comment %}
          <div class="plugin-comment-wrap">
            <div class="plugin-comment">{{ plugin.comment }}</div>
            {%- if plugin.commentTruncated %}
            <button type="button" class="plugin-comment-more" popovertarget="comment-{{ loop.index }}">More</button>
            <div id="comment-{{ loop.index }}" popover class="plugin-comment-popover">
              <button type="button" class="plugin-comment-popover-close" popovertarget="comment-{{ loop.index }}" popovertargetaction="hide" aria-label="Close">×</button>
              <strong>{{ plugin.name }}</strong>
              <p>{{ plugin.comment }}</p>
            </div>
            {%- endif %}
          </div>
          {%- endif %}
        </td>
        <td>{% if plugin.categories.length %}{{ plugin.categories | join(', ') }}{% else %}—{% endif %}</td>
        <td>{{ plugin.maintainer or '—' }}</td>
        <td>{{ plugin.license or '—' }}</td>
        <td>{{ plugin.version or '—' }}</td>
      </tr>
      {%- endfor %}
    </tbody>
  </table>
  <p id="plugin-empty-state" hidden>No plugins match.</p>
</div>

<script>
(function () {
  var table = document.getElementById('plugin-table');
  var rows = Array.prototype.slice.call(table.tBodies[0].rows);
  var search = document.getElementById('plugin-search');
  var categoryFilter = document.getElementById('plugin-category-filter');
  var emptyState = document.getElementById('plugin-empty-state');

  var categories = new Set();
  rows.forEach(function (row) {
    row.dataset.categories.split(',').forEach(function (c) {
      if (c) categories.add(c);
    });
  });
  Array.from(categories).sort().forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });

  function applyFilter() {
    var q = search.value.trim().toLowerCase();
    var cat = categoryFilter.value;
    var visibleCount = 0;
    rows.forEach(function (row) {
      var rowCategories = row.dataset.categories.toLowerCase().split(',');
      var matchesText = !q ||
        row.dataset.name.toLowerCase().indexOf(q) !== -1 ||
        row.dataset.categories.toLowerCase().indexOf(q) !== -1 ||
        row.dataset.maintainer.toLowerCase().indexOf(q) !== -1;
      var matchesCat = !cat || rowCategories.indexOf(cat.toLowerCase()) !== -1;
      var visible = matchesText && matchesCat;
      row.hidden = !visible;
      if (visible) visibleCount++;
    });
    emptyState.hidden = visibleCount !== 0;
  }

  search.addEventListener('input', applyFilter);
  categoryFilter.addEventListener('change', applyFilter);
})();
</script>
