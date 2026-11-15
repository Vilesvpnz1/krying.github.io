(function () {
  var SECTIONS = [
    {
      id: "core",
      title: "Core",
      items: [
        { id: "games-browser", name: "Games", desc: "full game library", view: "games" },
        { id: "apps-proxies", name: "Browser", desc: "search and browse", view: "browser" },
        { id: "ultimate-game-stash", name: "Entertainment", desc: "movies and more", view: "entertainment" },
      ],
    },
    {
      id: "proxy",
      title: "Browse",
      items: [{ id: "proxy-select", name: "Web Browser", desc: "duckduckgo + tabs", view: "browser" }],
    },
    {
      id: "tools",
      title: "Tools",
      items: [
        { id: "ai-tools", name: "AI Chat", desc: "ask anything", view: "ai" },
        { id: "rep-tools", name: "Rep Tools", desc: "finds catalog", view: "rep-tools" },
        { id: "tab-cloak", name: "Tab Cloak", desc: "disguise the tab", view: "tab-cloak" },
      ],
    },
    {
      id: "extra",
      title: "Extra",
      items: [
        { id: "tutorial", name: "Tutorial", desc: "quick walkthrough", view: "tutorial" },
        { id: "settings", name: "Settings", desc: "theme, cloak, perf", view: "settings" },
      ],
    },
  ];

  function hubSecOk(sectionId) {
    if (window.spCfg && window.spCfg.layoutVisible) {
      return window.spCfg.layoutVisible("hubSections", sectionId);
    }
    return true;
  }

  function hubItemOk(itemId) {
    if (window.spCfg && window.spCfg.layoutVisible) {
      return window.spCfg.layoutVisible("hubItems", itemId);
    }
    return true;
  }

  function goView(view) {
    if (!view) return;
    if (window.spApp && typeof window.spApp.flipVw === "function") {
      window.spApp.flipVw(view);
      return;
    }
    if (window.spBase && window.spBase.setHash) window.spBase.setHash(view);
    else location.hash = view;
  }

  function paintHub() {
    var root = document.getElementById("hub-grid");
    if (!root) return;
    root.innerHTML = "";
    var hasContent = false;
    SECTIONS.forEach(function (section) {
      if (!hubSecOk(section.id)) return;
      var visibleItems = section.items.filter(function (item) {
        return hubItemOk(item.id);
      });
      if (!visibleItems.length) return;
      hasContent = true;
      var block = document.createElement("div");
      block.className = "hub__section";
      var head = document.createElement("h3");
      head.className = "hub__section-title";
      head.textContent = section.title;
      block.appendChild(head);
      var grid = document.createElement("div");
      grid.className = "hub__grid";
      visibleItems.forEach(function (item) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "hub__card";
        card.addEventListener("click", function () {
          goView(item.view);
        });
        var title = document.createElement("span");
        title.className = "hub__card-title";
        title.textContent = item.name;
        card.appendChild(title);
        if (item.desc) {
          var desc = document.createElement("span");
          desc.className = "hub__card-desc";
          desc.textContent = item.desc;
          card.appendChild(desc);
        }
        grid.appendChild(card);
      });
      block.appendChild(grid);
      root.appendChild(block);
    });
    if (!hasContent) {
      root.innerHTML = '<p class="hub__empty">No hub links are visible right now.</p>';
    }
  }

  window.spHub = { render: paintHub, sections: SECTIONS };
  window.addEventListener("sp-cfg", paintHub);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paintHub);
  } else {
    paintHub();
  }
})();
