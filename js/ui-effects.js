// ui-effects.js — StarBridge visuals: splash, particles, image injection
// Dipende da: assets-loader.js (IMG, EXTRA, SPLASH_B64, ecc.)

// ── INJECT IMMAGINI ──
function injectImages() {
  if (typeof IMG === 'undefined') window.IMG = {};
  if (typeof EXTRA === 'undefined') window.EXTRA = {};
  const si = (id, val) => { const e = document.getElementById(id); if (e && val) e.src = val; };

  // Top bar counters
  si('icOscar',   EXTRA.ic_oscar  || EXTRA.oscar_sm  || '');
  si('icPopcorn', EXTRA.ic_popcorn|| EXTRA.popcorn_sm|| '');
  si('icHeart',   EXTRA.ic_heart  || '');
  ['pillOscar','pillPopcorn','pillHeart'].forEach(id => si(id, EXTRA.ic_pill || ''));

  // Logo home
  si('logoImg', EXTRA.logo || '');

  // Card backgrounds (SVG) + icone (WebP)
  if (typeof SVG_SFIDA !== 'undefined') {
    si('bgSfida',    SVG_SFIDA);    si('icnSfida',    ICN_SFIDA);
    si('bgModalita', SVG_MODALITA); si('icnModalita', ICN_MODALITA);
    si('bgPopcorn',  SVG_POPCORN);  si('icnPopcorn',  ICN_POPCORN);
    si('bgOscar',    SVG_OSCAR);    si('icnOscar',    ICN_OSCAR);
    si('bgLibera',   SVG_FREE);     si('icnLibera',   ICN_LIBERA);
    si('bgTempo',    SVG_TEMPO);    si('icnTempo',    ICN_TEMPO);
  }

  // Nav bar
  si('btnHome',    IMG.btn_home    || '');
  si('btnRank',    IMG.btn_rank    || '');
  si('btnPlay',    IMG.btn_play    || '');
  si('btnMondo',   IMG.btn_popcorn || '');
  si('btnProfile', IMG.btn_profilo || '');

  // Splash
  if (typeof SPLASH_B64 !== 'undefined') si('splashImg', SPLASH_B64);

  // Schermata Modalità
  if (typeof ARROW_BACK  !== 'undefined') si('imgArrow',  ARROW_BACK);
  if (typeof TXT_MODALITA!== 'undefined') si('imgTxtMod', TXT_MODALITA);

  // Exit alert icon
  si('exitAlertIcon', IMG.btn_play || '');
  // Mondo Popcorn
  if (typeof LOGO_MONDO  !== 'undefined') si('imgLogoMondo',  LOGO_MONDO);
  if (typeof BOARD_MONDO !== 'undefined') si('imgBoardMondo', BOARD_MONDO);
}

// ── SPLASH ──
function runSplash() {
  const splash = document.getElementById('splash');
  const fill   = document.getElementById('spFill');
  const msg    = document.getElementById('spMsg');
  if (!splash) return;
  const steps = [
    [200,  15, 'Preparando il database...'],
    [600,  40, 'Caricando gli attori...'],
    [1100, 65, 'Collegando i film...'],
    [1600, 88, 'Quasi pronto...'],
    [2100,100, 'Pronti!'],
  ];
  steps.forEach(([d, p, t]) => setTimeout(() => {
    if (fill) fill.style.width = p + '%';
    if (msg)  msg.textContent  = t;
  }, d));
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.display = 'none'; }, 700);
  }, 2400);
}

// ── PARTICELLE SFONDO ──
function spawnSparks() {
  const bg = document.getElementById('bg');
  if (!bg) return;
  const colors = ['#ff9900','#ffcc00','#ff6600','#ffee44','#ff3300'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const x = 62 + Math.random() * 32, y = Math.random() * 42;
    const tx = (Math.random() - .5) * 55, ty = -(28 + Math.random() * 95);
    const d  = (2.2 + Math.random() * 3.8).toFixed(1) + 's';
    const dl = (Math.random() * 4.5).toFixed(1) + 's';
    const sz = (1 + Math.random() * 2.8).toFixed(1);
    s.style.cssText = `left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;` +
      `background:${colors[Math.floor(Math.random()*colors.length)]};` +
      `--d:${d};--dl:${dl};--tx:${tx}px;--ty:${ty}px;` +
      `box-shadow:0 0 4px 1px rgba(255,150,0,.55);`;
    bg.appendChild(s);
  }
}

// ── CARD PARTICELLE DORATE ──
function initCardParticles() {
  const COLS = ['#ffd34d','#ffbb00','#ffcc55','#fff0a0','#ffaa00','#ffe066'];
  document.querySelectorAll('.rcard').forEach(card => {
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    const bg = card.querySelector('.rcard-bg');
    if (bg) bg.insertAdjacentElement('afterend', cv);
    else    card.prepend(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, raf;

    function resize() {
      W = cv.width  = cv.offsetWidth  || card.offsetWidth  || 160;
      H = cv.height = cv.offsetHeight || card.offsetHeight || 220;
    }
    function mkP(init) {
      const ml = 90 + Math.random() * 130;
      return {
        x: Math.random(), y: init ? Math.random() : 0.85 + Math.random() * 0.15,
        r: 0.7 + Math.random() * 1.6,
        vx: (Math.random() - .5) * 0.0007, vy: -(0.0007 + Math.random() * 0.0013),
        li: init ? Math.random() * ml : 0, ml,
        ma: 0.3 + Math.random() * 0.45,
        c: COLS[Math.floor(Math.random() * COLS.length)]
      };
    }
    const pts = Array.from({length: 22}, () => mkP(true));

    function draw() {
      if (!W) resize();
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        p.li++; p.x += p.vx; p.y += p.vy;
        if (p.li >= p.ml || p.y < -0.06) { pts[i] = mkP(false); return; }
        const t = p.li / p.ml;
        const a = t < 0.18 ? (t / 0.18) * p.ma
                : t > 0.72 ? ((1 - t) / 0.28) * p.ma
                : p.ma;
        ctx.globalAlpha = a;
        ctx.fillStyle   = p.c;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, 6.2832);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { resize(); draw(); }
      else cancelAnimationFrame(raf);
    }, {threshold: 0.05}).observe(card);
  });
}

// ── ANIMATED MODE CARDS (canvas per screenModes) ──
function initAnimCards() {
  var cfgs = [
    {r1:"0,90,255",  r2:"10,50,200",  p:"80,180,255"},
    {r1:"220,20,20", r2:"160,8,8",    p:"255,100,60"},
    {r1:"140,0,220", r2:"90,0,170",   p:"200,100,255"},
    {r1:"215,100,0", r2:"130,48,0",   p:"255,185,40"}
  ];
  cfgs.forEach(function(cfg, i) {
    var cv = document.getElementById("amcBg" + i);
    if (!cv || cv.dataset.init) return;
    cv.dataset.init = 1;
    var cx = cv.getContext("2d"), W = 400, H = 140,
        pts = [], t = Math.random() * 100;
    for (var n = 0; n < 40; n++)
      pts.push({x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.4+.3,
                a:Math.random()*6.28, sp:Math.random()*.25+.05,
                op:Math.random()*.55+.2, dr:(Math.random()-.5)*.35});
    var rgb = cfg.p.split(",");
    (function loop() {
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = "#08060e"; cx.fillRect(0, 0, W, H);
      var p = .75 + Math.sin(t * .022) * .25;
      var g = cx.createRadialGradient(W*.72, H*.85, 4, W*.72, H*.85, 130);
      g.addColorStop(0, "rgba("+cfg.r1+","+(0.5*p)+")");
      g.addColorStop(.5,"rgba("+cfg.r2+",.18)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      pts.forEach(function(q) {
        q.y -= q.sp; q.x += q.dr * Math.sin(t*.018 + q.a);
        if (q.y < -3) { q.y = H+3; q.x = Math.random()*W; }
        if (q.x < -3) q.x = W+3;
        if (q.x > W+3) q.x = -3;
        var fo = q.op * (.5 + .5*Math.sin(t*.04 + q.a));
        cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 6.28);
        var rb = parseInt(rgb[1]) + Math.floor(Math.random()*40);
        cx.fillStyle = "rgba("+rgb[0]+","+rb+","+rgb[2]+","+fo+")";
        cx.fill();
      });
      t++; requestAnimationFrame(loop);
    })();
  });
}

// ── AVVIO (unico handler) ──
function sbBootUIEffects() {
  try { if (typeof injectImages === 'function') injectImages(); } catch(e) { console.warn('injectImages error', e); }
  try { if (typeof spawnSparks === 'function') spawnSparks(); } catch(e) { console.warn('spawnSparks error', e); }
  try { if (typeof initCardParticles === 'function') initCardParticles(); } catch(e) { console.warn('initCardParticles error', e); }
  try { if (typeof runSplash === 'function') runSplash(); } catch(e) { console.warn('runSplash error', e); }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', sbBootUIEffects);
} else {
  sbBootUIEffects();
}
