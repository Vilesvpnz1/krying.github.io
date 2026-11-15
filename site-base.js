(function () {
  function hostName() {
    try {
      return String(location.hostname || "");
    } catch (e) {
      return "";
    }
  }

  function pkgVer() {
    try {
      var m = String(location.pathname || "").match(/krying@([^/?#]+)/i);
      if (m) return m[1];
      m = String(location.pathname || "").match(/\/npm\/krying@([^/?#]+)/i);
      if (m) return m[1];
    } catch (e) {}
    return "";
  }

  function isGcs() {
    return /storage\.googleapis\.com$/i.test(hostName());
  }

  function isPages() {
    return /\.github\.io$/i.test(hostName());
  }

  function isCdn() {
    try {
      var host = hostName();
      if (/unpkg\.com$/i.test(host) || /jsdelivr\.net$/i.test(host) || isGcs() || isPages()) return true;
      if (/\/krying@/i.test(String(location.pathname || ""))) return true;
    } catch (e) {}
    return false;
  }

  function pkgBase() {
    try {
      var path = String(location.pathname || "/");
      var host = hostName();
      var m = path.match(/^(.*?\/(?:npm\/)?krying(?:@[^/?#]+)?\/)/i);
      if (m) return m[1];
      if (/unpkg\.com$/i.test(host) || /jsdelivr\.net$/i.test(host)) {
        m = path.match(/^(\/[^/]+@[^/]+\/)/);
        if (m) return m[1];
        m = path.match(/^(\/npm\/[^/]+@[^/]+\/)/i);
        if (m) return m[1];
      }
      if (isGcs()) {
        m = path.match(/^(\/[^/]+\/)/);
        if (m) return m[1];
      }
      if (isPages()) {
        var user = host.split(".")[0].toLowerCase();
        m = path.match(/^\/([^/]+)\//);
        if (m && String(m[1]).toLowerCase() !== user.toLowerCase() + ".github.io") {
          if (path.indexOf("/" + m[1] + "/") === 0 && !/\/(?:index|study)\.html$/i.test("/" + m[1])) {
            return "/" + m[1] + "/";
          }
        }
        if (/\/(?:index|study)\.html$/i.test(path)) return path.replace(/(?:index|study)\.html$/i, "");
        if (path.endsWith("/")) return path;
        var slash = path.lastIndexOf("/");
        return slash >= 0 ? path.slice(0, slash + 1) : "/";
      }
      if (/\/(?:index|study)\.html$/i.test(path)) return path.replace(/(?:index|study)\.html$/i, "");
      if (path.endsWith("/")) return path;
      var slash2 = path.lastIndexOf("/");
      return slash2 >= 0 ? path.slice(0, slash2 + 1) : "/";
    } catch (e) {
      return "/";
    }
  }

  function assetBase() {
    try {
      var host = hostName();
      var ver = pkgVer() || "latest";
      if (/unpkg\.com$/i.test(host) || /jsdelivr\.net$/i.test(host)) {
        return "https://cdn.jsdelivr.net/npm/krying@" + ver + "/";
      }
    } catch (e) {}
    return pkgBase();
  }

  function assetUrl(raw) {
    var rel = String(raw || "").trim();
    if (!rel) return "";
    if (/^https?:\/\//i.test(rel) || /^data:/i.test(rel) || /^blob:/i.test(rel)) return rel;
    if (rel.charAt(0) === "/") rel = rel.slice(1);
    if (isPages() && /^assets\/thumbs\//i.test(rel)) {
      return "https://cdn.jsdelivr.net/npm/krying@1.0.4/" + rel;
    }
    return assetBase() + rel;
  }

  function pageHash(hash) {
    var h = String(hash || "").replace(/^#/, "");
    var path = String(location.pathname || "/");
    if (!path || path === "/") path = pkgBase() + "study.html";
    else if (path.endsWith("/")) path = path + "study.html";
    return path + (location.search || "") + (h ? "#" + h : "");
  }

  function setHash(hash) {
    var next = pageHash(hash);
    try {
      history.replaceState(null, "", next);
    } catch (e) {
      try {
        location.hash = String(hash || "").replace(/^#/, "");
      } catch (e2) {}
    }
  }

  window.spBase = {
    pkgVer: pkgVer,
    isCdn: isCdn,
    isGcs: isGcs,
    isPages: isPages,
    pkgBase: pkgBase,
    assetBase: assetBase,
    assetUrl: assetUrl,
    pageHash: pageHash,
    setHash: setHash,
  };
})();
