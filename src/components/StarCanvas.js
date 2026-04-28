"use client";
import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h, stars = [], shooters = [], bolts = [];
    let nextShoot = 4000, nextBolt = 3000 + Math.random() * 4000;
    let mx = -9999, my = -9999;
    let raf;
    let sunRayAngle = 0;       // slowly rotates rays
    let sunPulse    = 0;       // heartbeat scale for sun glow

    const GOLD      = "201,168,76";
    const WEB_DIST  = 150;
    const STAR_DIST = 150;

    const isDark = () => document.documentElement.classList.contains("dark");

    /* ── Resize ─────────────────────────────────────────── */
    function resize() {
      // Get the display size of the canvas in CSS pixels
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      // Set the canvas size in actual pixels, considering devicePixelRatio
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      // Scale the context to account for devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any existing transforms
      ctx.scale(dpr, dpr);
      w = displayWidth;
      h = displayHeight;
      initStars();
    }

    /* ── Stars ──────────────────────────────────────────── */
    function initStars() {
      const count = Math.floor((w * h) / 4000);
        stars = Array.from({ length: count }, () => ({
          x:     Math.random() * w,
          y:     Math.random() * h,
          r:     Math.random() * 1.5 + 0.5,
          baseAlpha: Math.random() * 0.5 + 0.5, // base alpha for shine
          alpha: 1,
          shineSpeed: Math.random() * 0.002 + 0.001, // how fast it shines
          shinePhase: Math.random() * Math.PI * 2,   // phase offset for shine
          vx:    (Math.random() - 0.5) * 0.12, // smooth, slow movement
          vy:    (Math.random() - 0.5) * 0.12,
        }));
    }

    /* ── Shooting star ──────────────────────────────────── */
    function spawnShooter() {
      return {
        x: Math.random() * w * 0.75, y: Math.random() * h * 0.35,
        len: 80 + Math.random() * 80, speed: 5 + Math.random() * 4,
        angle: Math.PI / 6 + (Math.random() - 0.5) * 0.35,
        alpha: 1, life: 0, maxLife: 55,
      };
    }

    /* ══════════════════════════════════════════════════════
       SUN  (light mode only)
    ══════════════════════════════════════════════════════ */
    function drawSun(t) {
      // Position: upper-left area, responsive
      const sx   = w * 0.92;
      const sy   = h * 0.21;
      const R    = Math.min(w, h) * 0.055; // sun radius

      sunPulse    = Math.sin(t * 0.0012) * 0.5 + 0.5;  // 0→1 slowly
      sunRayAngle += 0.001;                              // very slow rotation

      /* ── Outermost diffuse sky glow ── */
      const skyGlow = ctx.createRadialGradient(sx, sy, R * 0.5, sx, sy, R * 9);
      skyGlow.addColorStop(0,   "rgba(255,230,100,0.18)");
      skyGlow.addColorStop(0.25,"rgba(255,200,60,0.10)");
      skyGlow.addColorStop(0.55,"rgba(255,160,20,0.04)");
      skyGlow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(sx, sy, R * 9, 0, Math.PI * 2);
      ctx.fillStyle = skyGlow;
      ctx.fill();

      /* ── Long coloured light rays (crepuscular style) ── */
      const RAY_COLORS = [
        "255,200,50",   // gold
        "255,160,30",   // amber
        "255,220,80",   // yellow
        "255,140,50",   // orange
        "255,230,120",  // pale gold
        "255,175,40",   // deep amber
        "255,210,70",   // warm yellow
        "255,150,60",   // rust gold
      ];
      const RAY_COUNT = 18;
      for (let i = 0; i < RAY_COUNT; i++) {
        const angle = sunRayAngle + (i / RAY_COUNT) * Math.PI * 2;
        const rayLen = R * (7 + 4 * Math.sin(t * 0.00012 + i));
        const col = RAY_COLORS[i % RAY_COLORS.length];
        const alpha = (0.06 + 0.03 * Math.sin(t * 0.001 + i * 0.7));

        // Tapering ray using a thin triangle path
        const tipX  = sx + Math.cos(angle) * rayLen;
        const tipY  = sy + Math.sin(angle) * rayLen;
        const perp  = angle + Math.PI / 2;
        const baseW = R * 0.28;
        const b1x   = sx + Math.cos(perp) * baseW;
        const b1y   = sy + Math.sin(perp) * baseW;
        const b2x   = sx - Math.cos(perp) * baseW;
        const b2y   = sy - Math.sin(perp) * baseW;

        const rayGrad = ctx.createLinearGradient(sx, sy, tipX, tipY);
        rayGrad.addColorStop(0,   `rgba(${col},${alpha * 1.8})`);
        rayGrad.addColorStop(0.35,`rgba(${col},${alpha * 0.9})`);
        rayGrad.addColorStop(0.7, `rgba(${col},${alpha * 0.3})`);
        rayGrad.addColorStop(1,   "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.moveTo(b1x, b1y);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(b2x, b2y);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }

      /* ── Short sharp spiky rays (classic sun burst) ── */
      const SPIKE_COUNT = 14;
      for (let i = 0; i < SPIKE_COUNT; i++) {
        const angle  = sunRayAngle * 1.5 + (i / SPIKE_COUNT) * Math.PI * 2;
        const inner  = R * 1.18;
        const outer  = R * (1.55 + 0.25 * Math.sin(t * 0.002 + i * 1.3));
        const halfW  = 0.06;
        ctx.beginPath();
        ctx.moveTo(sx + Math.cos(angle - halfW) * inner, sy + Math.sin(angle - halfW) * inner);
        ctx.lineTo(sx + Math.cos(angle) * outer,         sy + Math.sin(angle) * outer);
        ctx.lineTo(sx + Math.cos(angle + halfW) * inner, sy + Math.sin(angle + halfW) * inner);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,220,80,${0.55 + 0.2 * sunPulse})`;
        ctx.fill();
      }

      /* ── Corona / haze ring ── */
      const corona = ctx.createRadialGradient(sx, sy, R * 0.9, sx, sy, R * 2.2);
      corona.addColorStop(0,   `rgba(255,240,150,${0.28 + sunPulse * 0.10})`);
      corona.addColorStop(0.4, `rgba(255,200,60,${0.12 + sunPulse * 0.05})`);
      corona.addColorStop(1,   "rgba(255,160,0,0)");
      ctx.beginPath();
      ctx.arc(sx, sy, R * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      /* ── Sun body ── */
      const sunBody = ctx.createRadialGradient(sx - R * 0.22, sy - R * 0.22, R * 0.05, sx, sy, R);
      sunBody.addColorStop(0,    "rgba(255,255,220,1.0)");
      sunBody.addColorStop(0.35, "rgba(255,240,100,0.98)");
      sunBody.addColorStop(0.75, "rgba(255,200,30,0.95)");
      sunBody.addColorStop(1,    "rgba(240,140,0,0.85)");
      ctx.beginPath();
      ctx.arc(sx, sy, R, 0, Math.PI * 2);
      ctx.fillStyle = sunBody;
      ctx.fill();

      /* ── Limb darkening ring ── */
      const limb = ctx.createRadialGradient(sx, sy, R * 0.6, sx, sy, R);
      limb.addColorStop(0,   "rgba(0,0,0,0)");
      limb.addColorStop(0.8, "rgba(180,80,0,0.06)");
      limb.addColorStop(1,   "rgba(120,50,0,0.18)");
      ctx.beginPath();
      ctx.arc(sx, sy, R, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      /* ── Surface granulation texture ── */
      for (let g = 0; g < 7; g++) {
        const gx = sx + (Math.cos(t * 0.00006 + g * 1.1)) * R * 0.42;
        const gy = sy + (Math.sin(t * 0.00008 + g * 0.9)) * R * 0.38;
        ctx.beginPath();
        ctx.arc(gx, gy, R * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,220,60,0.08)`;
        ctx.fill();
      }

      /* ── Lens flare dots along ray axis ── */
      const flareAngle = sunRayAngle + 0.4;
      [1.8, 2.6, 3.5].forEach((dist, fi) => {
        const fx = sx + Math.cos(flareAngle + Math.PI) * R * dist;
        const fy = sy + Math.sin(flareAngle + Math.PI) * R * dist;
        const fr = R * (0.10 - fi * 0.025);
        const fc = ["255,200,80", "200,160,255", "150,220,255"][fi];
        const fa = 0.18 - fi * 0.04;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${fc},${fa})`;
        ctx.fill();
      });
    }

    /* ── Light-mode sky background ─────────────────────── */
    function drawDaySky(t) {
      // Gradient sky: blue top → pale near sun horizon
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0,   "rgba(98, 165, 248, 0.92)");
      sky.addColorStop(0.4, "rgba(160,210,255,0.85)");
      sky.addColorStop(0.8, "rgba(220,240,255,0.75)");
      sky.addColorStop(1,   "rgba(255,245,220,0.70)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Atmospheric haze: warm wash near sun position
      const haze = ctx.createRadialGradient(w*0.12, h*0.11, 0, w*0.12, h*0.11, w*0.6);
      haze.addColorStop(0,   "rgba(255,220,100,0.22)");
      haze.addColorStop(0.3, "rgba(255,200,80,0.09)");
      haze.addColorStop(0.7, "rgba(255,180,60,0.03)");
      haze.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      // A few very faint wispy clouds
      drawClouds(t);
    }

    /* ── Wispy clouds ───────────────────────────────────── */
    const CLOUDS = [
      { bx: 0.35, by: 0.14, r: 0.11, a: 0.22 },
      { bx: 0.60, by: 0.08, r: 0.08, a: 0.18 },
      { bx: 0.78, by: 0.20, r: 0.09, a: 0.15 },
      { bx: 0.20, by: 0.24, r: 0.07, a: 0.13 },
    ];
    function drawClouds(t) {
      CLOUDS.forEach((c, ci) => {
        const cx = (c.bx + Math.sin(t * 0.000015 + ci) * 0.02) * w;
        const cy = (c.by + Math.cos(t * 0.000010 + ci) * 0.008) * h;
        const cr = c.r * Math.min(w, h);
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0,   `rgba(255,255,255,${c.a})`);
        cg.addColorStop(0.6, `rgba(255,255,255,${c.a * 0.5})`);
        cg.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
        // Elongated puff
        ctx.beginPath();
        ctx.ellipse(cx + cr*0.4, cy + cr*0.1, cr*0.6, cr*0.35, 0, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${c.a * 0.4})`;
        ctx.fill();
      });
    }

    /* ══════════════════════════════════════════════════════
       LIGHTNING  (dark mode)
    ══════════════════════════════════════════════════════ */
    function buildBranch(x1, y1, x2, y2, depth, spread) {
      if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      const mx2 = (x1+x2)/2 + (Math.random()-0.5)*spread;
      const my2 = (y1+y2)/2 + (Math.random()-0.5)*spread*0.6;
      return [
        ...buildBranch(x1,y1,mx2,my2,depth-1,spread*0.55),
        ...buildBranch(mx2,my2,x2,y2,depth-1,spread*0.55).slice(1),
      ];
    }

    function spawnBolt() {
      const startX = w*(0.15+Math.random()*0.70);
      const startY = h*(Math.random()*0.12);
      const endX   = startX+(Math.random()-0.5)*w*0.30;
      const endY   = h*(0.45+Math.random()*0.45);
      const spread = (endY-startY)*0.55;
      const mainPts = buildBranch(startX,startY,endX,endY,7,spread);
      const branches = [];
      const bc = 1+Math.floor(Math.random()*3);
      for(let b=0;b<bc;b++){
        const idx=Math.floor(mainPts.length*(0.25+Math.random()*0.55));
        const origin=mainPts[idx];
        const bEx=origin.x+(Math.random()-0.5)*w*0.20;
        const bEy=origin.y+h*(0.10+Math.random()*0.20);
        branches.push(buildBranch(origin.x,origin.y,bEx,bEy,5,(bEy-origin.y)*0.45));
      }
      const warm = Math.random()<0.25;
      return {
        mainPts, branches,
        coreColor: warm?"255,245,220":"210,230,255",
        glowColor: warm?"220,180,80":"140,170,255",
        life:0, maxLife:14+Math.floor(Math.random()*8), flashAlpha:1.0,
      };
    }

    function drawBoltPath(pts,alpha,coreColor,glowColor,isBranch){
      if(pts.length<2||alpha<=0) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
      ctx.strokeStyle=`rgba(${glowColor},${alpha*(isBranch?0.18:0.28)})`;
      ctx.lineWidth=isBranch?6:14; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.filter="blur(4px)"; ctx.stroke(); ctx.filter="none";
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
      ctx.strokeStyle=`rgba(${glowColor},${alpha*(isBranch?0.30:0.45)})`;
      ctx.lineWidth=isBranch?3:7; ctx.filter="blur(1.5px)"; ctx.stroke(); ctx.filter="none";
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
      ctx.strokeStyle=`rgba(${coreColor},${alpha*(isBranch?0.70:0.95)})`;
      ctx.lineWidth=isBranch?0.8:1.5; ctx.stroke();
    }

    function drawSkyFlash(alpha){
      if(alpha<=0) return;
      const g=ctx.createRadialGradient(w/2,0,0,w/2,0,h*0.9);
      g.addColorStop(0,`rgba(200,220,255,${alpha*0.18})`);
      g.addColorStop(0.4,`rgba(180,200,255,${alpha*0.08})`);
      g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    }

    /* ── Moon ───────────────────────────────────────────── */
    function drawMoon() {
      const mx2 = w * 0.90, my2 = h * 0.15, R = Math.min(w, h) * 0.038;

      // Outer halo
      const halo = ctx.createRadialGradient(mx2, my2, R * 0.7, mx2, my2, R * 3.2);
      halo.addColorStop(0,   "rgba(255,240,190,0.08)");
      halo.addColorStop(0.5, "rgba(255,230,150,0.03)");
      halo.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(mx2, my2, R * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Moon body gradient
      const body = ctx.createRadialGradient(mx2 - R * 0.25, my2 - R * 0.25, R * 0.05, mx2, my2, R);
      body.addColorStop(0,   "rgba(255,252,230,0.97)");
      body.addColorStop(0.55,"rgba(245,235,190,0.90)");
      body.addColorStop(1,   "rgba(210,195,140,0.70)");
      ctx.beginPath();
      ctx.arc(mx2, my2, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Crescent shadow
      ctx.beginPath();
      ctx.arc(mx2 + R * 0.38, my2 - R * 0.1, R * 0.78, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,5,5,0.50)";
      ctx.fill();

      // Craters
      [
        [mx2 - R*0.28, my2 + R*0.18, R*0.10],
        [mx2 - R*0.06, my2 + R*0.38, R*0.07],
        [mx2 - R*0.38, my2 - R*0.12, R*0.06],
        [mx2 - R*0.18, my2 - R*0.30, R*0.05],
      ].forEach(([cx, cy, cr]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,160,100,0.25)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + cr*0.3, cy - cr*0.3, cr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,245,210,0.15)";
        ctx.fill();
      });
    }

    /* ── Saturn ─────────────────────────────────────────── */
    function drawSaturn() {
      const sx = w * 0.10, sy = h * 0.18;
      const PR = Math.min(w, h) * 0.022;

      // Rings (behind planet)
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-0.22);
      // Outer ring
      const ringGrad = ctx.createLinearGradient(-PR*2.4, 0, PR*2.4, 0);
      ringGrad.addColorStop(0,   "rgba(180,140,80,0)");
      ringGrad.addColorStop(0.15,"rgba(180,140,80,0.25)");
      ringGrad.addColorStop(0.42,"rgba(210,170,100,0.18)");
      ringGrad.addColorStop(0.58,"rgba(210,170,100,0.18)");
      ringGrad.addColorStop(0.85,"rgba(180,140,80,0.25)");
      ringGrad.addColorStop(1,   "rgba(180,140,80,0)");
      ctx.beginPath();
      ctx.ellipse(0, 0, PR * 2.4, PR * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = ringGrad;
      ctx.fill();
      ctx.restore();

      // Planet body
      const pGrad = ctx.createRadialGradient(sx - PR*0.3, sy - PR*0.3, PR*0.05, sx, sy, PR);
      pGrad.addColorStop(0,  "rgba(240,200,130,0.95)");
      pGrad.addColorStop(0.5,"rgba(210,165,90,0.88)");
      pGrad.addColorStop(1,  "rgba(160,110,50,0.70)");
      ctx.beginPath();
      ctx.arc(sx, sy, PR, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Atmospheric bands
      for (let i = 0; i < 3; i++) {
        const by = sy - PR * 0.25 + i * PR * 0.25;
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, PR, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.ellipse(sx, by, PR, PR * 0.06, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,130,60,${0.12 - i*0.03})`;
        ctx.fill();
        ctx.restore();
      }

      // Ring front (over planet)
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-0.22);
      ctx.beginPath();
      ctx.ellipse(0, 0, PR * 2.4, PR * 0.5, 0, Math.PI, Math.PI * 2);
      const ringFront = ctx.createLinearGradient(-PR*2.4, 0, PR*2.4, 0);
      ringFront.addColorStop(0,   "rgba(200,160,90,0)");
      ringFront.addColorStop(0.15,"rgba(200,160,90,0.30)");
      ringFront.addColorStop(0.5, "rgba(220,180,100,0.22)");
      ringFront.addColorStop(0.85,"rgba(200,160,90,0.30)");
      ringFront.addColorStop(1,   "rgba(200,160,90,0)");
      ctx.fillStyle = ringFront;
      ctx.fill();
      ctx.restore();

      // Saturn glow
      const sGlow = ctx.createRadialGradient(sx, sy, PR, sx, sy, PR * 3);
      sGlow.addColorStop(0, "rgba(210,165,90,0.06)");
      sGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(sx, sy, PR * 3, 0, Math.PI * 2);
      ctx.fillStyle = sGlow;
      ctx.fill();
    }

    /* ── Small distant planet ───────────────────────────── */
    function drawDistantPlanet() {
      const px = w * 0.92, py = h * 0.32, PR = Math.min(w, h) * 0.012;
      const pg = ctx.createRadialGradient(px - PR*0.3, py - PR*0.3, PR*0.05, px, py, PR);
      pg.addColorStop(0,  "rgba(140,180,240,0.90)");
      pg.addColorStop(0.6,"rgba(80,120,200,0.75)");
      pg.addColorStop(1,  "rgba(40,70,160,0.50)");
      ctx.beginPath();
      ctx.arc(px, py, PR, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
      // Glow
      const dg = ctx.createRadialGradient(px, py, PR*0.5, px, py, PR*2.5);
      dg.addColorStop(0, "rgba(100,150,255,0.08)");
      dg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(px, py, PR*2.5, 0, Math.PI*2);
      ctx.fillStyle = dg;
      ctx.fill();
    }

    /* ── Nebula wash ────────────────────────────────────── */
    function drawNebula() {
      const n1 = ctx.createRadialGradient(w*0.15, h*0.20, 0, w*0.15, h*0.20, w*0.40);
      n1.addColorStop(0, "rgba(80,30,120,0.055)");
      n1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n1; ctx.fillRect(0, 0, w, h);

      const n2 = ctx.createRadialGradient(w*0.85, h*0.75, 0, w*0.85, h*0.75, w*0.45);
      n2.addColorStop(0, "rgba(20,50,120,0.045)");
      n2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n2; ctx.fillRect(0, 0, w, h);

      const n3 = ctx.createRadialGradient(w*0.50, h*0.55, 0, w*0.50, h*0.55, w*0.55);
      n3.addColorStop(0, "rgba(60,15,90,0.03)");
      n3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = n3; ctx.fillRect(0, 0, w, h);
    }

    /* ── Main render loop ───────────────────────────────── */
    function draw(t) {
      const dark = isDark();

      ctx.clearRect(0, 0, w, h);

      if (dark) {
        /* ════ DARK MODE ════ */
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);
        drawNebula();

        // Sky flash from lightning
        bolts.forEach(b => { if(b.life<3) drawSkyFlash(b.flashAlpha*(1-b.life/3)); });

        drawSaturn();
        drawMoon();
        drawDistantPlanet();

        // Drifting stars
        stars.forEach(s => {
          // Draw static stars (no movement or pulsing)
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD},${s.alpha})`; ctx.fill();

          if (s.alpha > 0.55 && s.r > 0.9) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r + 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${GOLD},${s.alpha * 0.15})`;
            ctx.fill();
          }

          if (s.r > 1.2 && s.alpha > 0.65) {
            ctx.strokeStyle = `rgba(${GOLD},${s.alpha * 0.30})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(s.x - s.r * 3, s.y);
            ctx.lineTo(s.x + s.r * 3, s.y);
            ctx.moveTo(s.x, s.y - s.r * 3);
            ctx.lineTo(s.x, s.y + s.r * 3);
            ctx.stroke();
          }
        });
        const now = performance.now();
        stars.forEach(s => {
          // Move star
          s.x += s.vx;
          s.y += s.vy;
          // Wrap around edges
          if (s.x < -2) s.x = w + 2;
          if (s.x > w + 2) s.x = -2;
          if (s.y < -2) s.y = h + 2;
          if (s.y > h + 2) s.y = -2;

          // Shine (pulse alpha)
          s.alpha = s.baseAlpha + 0.35 * Math.sin(now * s.shineSpeed + s.shinePhase);
          s.alpha = Math.max(0.15, Math.min(1, s.alpha));

          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD},${s.alpha})`; ctx.fill();

          if (s.alpha > 0.55 && s.r > 0.9) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r + 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${GOLD},${s.alpha * 0.15})`;
            ctx.fill();
          }

          if (s.r > 1.2 && s.alpha > 0.65) {
            ctx.strokeStyle = `rgba(${GOLD},${s.alpha * 0.30})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(s.x - s.r * 3, s.y);
            ctx.lineTo(s.x + s.r * 3, s.y);
            ctx.moveTo(s.x, s.y - s.r * 3);
            ctx.lineTo(s.x, s.y + s.r * 3);
            ctx.stroke();
          }
        });

        // Shooting stars
        nextShoot-=16;
        if(nextShoot<=0){shooters.push(spawnShooter());
          nextShoot=5000+Math.random()*8000;}
        for(let i=shooters.length-1;i>=0;i--){
          const s=shooters[i];s.life++;s.alpha=1-s.life/s.maxLife;
          if(s.life>s.maxLife){shooters.splice(i,1);
            continue;}
          const ex=s.x+Math.cos(s.angle)*s.len,ey=s.y+Math.sin(s.angle)*s.len;
          s.x+=Math.cos(s.angle)*s.speed;s.y+=Math.sin(s.angle)*s.speed;
          const sg=ctx.createLinearGradient(s.x,s.y,ex,ey);
          sg.addColorStop(0,`rgba(${GOLD},${s.alpha*0.95})`);
          sg.addColorStop(0.35,`rgba(${GOLD},${s.alpha*0.50})`);
          sg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(ex,ey);ctx.strokeStyle=sg;ctx.lineWidth=1.8;ctx.stroke();
          ctx.beginPath();ctx.arc(s.x,s.y,2.2,0,Math.PI*2);ctx.fillStyle=`rgba(${GOLD},${s.alpha*0.9})`;ctx.fill();
        }

        // Lightning
        nextBolt-=16;
        if(nextBolt<=0){
          bolts.push(spawnBolt());
          if(Math.random()<0.35) setTimeout(()=>bolts.push(spawnBolt()),80);
          nextBolt=3500+Math.random()*6500;
        }
        for(let i=bolts.length-1;i>=0;i--){
          const b=bolts[i];b.life++;
          const visible=b.life<=3?true:b.life<=5?false:b.life<=8?true:b.life<=10?false:b.life<=b.maxLife;
          if(b.life>b.maxLife){bolts.splice(i,1);
            continue;}
          if(!visible) continue;
          let alpha=b.life<=3?1.0:b.life<=8?0.75:Math.max(0,1-(b.life-8)/(b.maxLife-8));
          b.flashAlpha=alpha;
          drawBoltPath(b.mainPts,alpha,b.coreColor,b.glowColor,false);
          b.branches.forEach(br=>drawBoltPath(br,alpha*0.70,b.coreColor,b.glowColor,true));
          const tip=b.mainPts[b.mainPts.length-1];
          if(b.life<=4&&tip){
            const ig=ctx.createRadialGradient(tip.x,tip.y,0,tip.x,tip.y,60);
            ig.addColorStop(0,`rgba(${b.coreColor},${alpha*0.55})`);ig.addColorStop(0.4,`rgba(${b.glowColor},${alpha*0.18})`);ig.addColorStop(1,"rgba(0,0,0,0)");
            ctx.beginPath();ctx.arc(tip.x,tip.y,60,0,Math.PI*2);ctx.fillStyle=ig;ctx.fill();
          }
        }

      } else {
        /* ════ LIGHT MODE — DAY SKY ════ */
        ctx.fillStyle = "#f0f7ff";
        ctx.fillRect(0, 0, w, h);
        drawDaySky(t);
        drawSun(t);
      }

      // Spider web cursor — both modes
      if(mx>0&&my>0&&dark){
        stars.forEach(s=>{
          const d=Math.hypot(mx-s.x,my-s.y);
          if(d<WEB_DIST){
            const strength=1-d/WEB_DIST;
            ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(s.x,s.y);ctx.strokeStyle=`rgba(${GOLD},${strength*0.80})`;ctx.lineWidth=strength*1.4;ctx.stroke();
            stars.forEach(s2=>{
              if(s2===s) return;
              const d2=Math.hypot(s.x-s2.x,s.y-s2.y);
              if(d2<STAR_DIST){const ds2=Math.hypot(mx-s2.x,my-s2.y);if(ds2<WEB_DIST){const str2=(1-d2/STAR_DIST)*strength*0.5;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s2.x,s2.y);ctx.strokeStyle=`rgba(${GOLD},${str2*0.4})`;ctx.lineWidth=str2*0.8;ctx.stroke();}}
            });
          }
        });
        const grd=ctx.createRadialGradient(mx,my,0,mx,my,WEB_DIST*0.5);
        grd.addColorStop(0,`rgba(${GOLD},0.07)`);grd.addColorStop(0.4,`rgba(${GOLD},0.02)`);grd.addColorStop(1,"rgba(0,0,0,0)");
        ctx.beginPath();ctx.arc(mx,my,WEB_DIST*0.5,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    const onMove  = (e) => { mx=e.clientX; my=e.clientY; };
    const onLeave = ()  => { mx=-9999; my=-9999; };
    window.addEventListener("mousemove",  onMove,  { passive:true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     resize);

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width:  "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
