(function () {
  var c = null;
  var g = null;
  var bits = [];
  var loop = 0;
  var go = false;
  var W = 0;
  var H = 0;
  var mist = null;

  function flakePath(ctx, x, y, size, rot, arms) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    var arm = arms || 6;
    var len = size;
    var i;
    for (i = 0; i < arm; i++) {
      ctx.rotate((Math.PI * 2) / arm);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.moveTo(0, -len * 0.35);
      ctx.lineTo(-len * 0.22, -len * 0.55);
      ctx.moveTo(0, -len * 0.35);
      ctx.lineTo(len * 0.22, -len * 0.55);
      ctx.moveTo(0, -len * 0.62);
      ctx.lineTo(-len * 0.16, -len * 0.78);
      ctx.moveTo(0, -len * 0.62);
      ctx.lineTo(len * 0.16, -len * 0.78);
      ctx.moveTo(0, -len * 0.82);
      ctx.lineTo(-len * 0.1, -len * 0.95);
      ctx.moveTo(0, -len * 0.82);
      ctx.lineTo(len * 0.1, -len * 0.95);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.6, size * 0.12), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function yeet() {
    var sz = 3.5 + Math.random() * 7.5;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      sz: sz,
      vy: 0.4 + Math.random() * 1.5 + sz * 0.06,
      vx: -0.45 + Math.random() * 0.9,
      wob: Math.random() * Math.PI * 2,
      wobSp: 0.006 + Math.random() * 0.02,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.035,
      a: 0.45 + Math.random() * 0.5,
      arms: Math.random() > 0.25 ? 6 : 5 + Math.floor(Math.random() * 3),
      fat: 0.7 + Math.random() * 1.1,
    };
  }

  function dumpBits(n) {
    bits = [];
    for (var i = 0; i < n; i++) bits.push(yeet());
  }

  function fit() {
    if (!c || !g) return;
    W = window.innerWidth || 1;
    H = window.innerHeight || 1;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(W * d);
    c.height = Math.floor(H * d);
    c.style.width = W + "px";
    c.style.height = H + "px";
    g.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.floor((W * H) / 12000);
    if (n < 45) n = 45;
    if (n > 110) n = 110;
    if (document.body && document.body.classList.contains("ent-standalone-movies")) {
      n = Math.floor(n * 0.45);
      if (n < 18) n = 18;
      if (n > 42) n = 42;
    }
    if (document.body && document.body.classList.contains("fx-performance")) n = Math.min(n, 40);
    dumpBits(n);
  }

  function frame() {
    if (!go || !g) {
      loop = 0;
      return;
    }
    g.clearRect(0, 0, W, H);
    g.lineCap = "round";
    g.lineJoin = "round";
    for (var i = 0; i < bits.length; i++) {
      var p = bits[i];
      p.wob += p.wobSp;
      p.rot += p.spin;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.wob) * 0.7;
      if (p.y > H + 16) {
        p.y = -18;
        p.x = Math.random() * W;
      }
      if (p.x > W + 16) p.x = -16;
      if (p.x < -16) p.x = W + 16;
      g.globalAlpha = p.a * 0.35;
      g.strokeStyle = "rgba(190,220,255,1)";
      g.fillStyle = "rgba(190,220,255,1)";
      g.lineWidth = p.fat * 1.8;
      flakePath(g, p.x, p.y, p.sz * 1.15, p.rot, p.arms);
      g.globalAlpha = p.a;
      g.strokeStyle = "rgba(255,255,255,1)";
      g.fillStyle = "rgba(245,252,255,1)";
      g.lineWidth = p.fat;
      flakePath(g, p.x, p.y, p.sz, p.rot, p.arms);
    }
    g.globalAlpha = 1;
    loop = requestAnimationFrame(frame);
  }

  function kick() {
    if (!c || !g || loop) return;
    loop = requestAnimationFrame(frame);
  }

  function kill() {
    if (loop) cancelAnimationFrame(loop);
    loop = 0;
    if (g && c) g.clearRect(0, 0, W, H);
  }

  function mistUp(on) {
    if (!mist) {
      mist = document.getElementById("winter-mist");
      if (!mist) {
        mist = document.createElement("div");
        mist.id = "winter-mist";
        mist.className = "winter-mist";
        mist.setAttribute("aria-hidden", "true");
        document.body.insertBefore(mist, document.body.firstChild);
      }
    }
    mist.hidden = !on;
  }

  function sync() {
    var want = true;
    try {
      if (window.spSet && typeof window.spSet.get === "function") {
        want = !!window.spSet.get("winterOn");
      }
    } catch (e) {}
    if (document.body) document.body.classList.toggle("fx-winter", want);
    var snow = want;
    if (document.body && document.body.classList.contains("fx-performance")) snow = false;
    if (document.body && document.body.classList.contains("fx-low-data")) snow = false;
    mistUp(want && snow && !(document.body && document.body.classList.contains("ent-standalone-movies")));
    go = snow;
    if (c) {
      if (snow) c.removeAttribute("hidden");
      else c.setAttribute("hidden", "");
    }
    if (snow) {
      fit();
      kick();
    } else {
      kill();
    }
  }

  function boot() {
    c = document.getElementById("winter-canvas");
    if (!c) {
      c = document.createElement("canvas");
      c.id = "winter-canvas";
      c.className = "winter-canvas";
      c.setAttribute("aria-hidden", "true");
      document.body.appendChild(c);
    }
    c.className = "winter-canvas";
    g = c.getContext("2d", { alpha: true });
    window.addEventListener("resize", function () {
      if (go) fit();
    });
    window.addEventListener("sp-set", sync);
    sync();
    setTimeout(sync, 0);
    setTimeout(function () {
      if (go) fit();
    }, 200);
  }

  window.spWinter = { sync: sync };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
