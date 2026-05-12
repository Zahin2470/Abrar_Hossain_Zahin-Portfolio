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
    let sunRayAngle = 0;
    let sunPulse    = 0;
    
    // Rain system
    let rainDrops   = [];
    let rainActive  = false;
    let rainTimer   = null;
    let rainFadeOut = false;
    let rainAlpha   = 0;

    const GOLD      = "201,168,76";
    const WEB_DIST  = 150;
    const STAR_DIST = 150;

    const isDark = () => document.documentElement.classList.contains("dark");

    /* ══════════════════════════════════════════════════════
       THUNDER SOUND — Web Audio API, no external files
       Synthesised programmatically: crack + long rumble
    ══════════════════════════════════════════════════════ */
    let audioCtx = null;

    // AudioContext must be created after a user gesture
    function getAudioCtx() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      // Resume if suspended (browser autoplay policy)
      if (audioCtx.state === "suspended") audioCtx.resume();
      return audioCtx;
    }

    function playThunder(delaySeconds = 0.5) {
      // Don't play if user hasn't interacted yet (no AudioContext)
      if (!audioCtx) return;
      const ac = getAudioCtx();
      const startAt = ac.currentTime + delaySeconds;

      /* ── 1. Initial sharp CRACK ── */
      const crackDuration = 0.15;
      const crackBuf = ac.createBuffer(1, ac.sampleRate * crackDuration, ac.sampleRate);
      const crackData = crackBuf.getChannelData(0);
      for (let i = 0; i < crackData.length; i++) {
        // White noise decaying very quickly
        crackData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / crackData.length, 3);
      }
      const crackSrc = ac.createBufferSource();
      crackSrc.buffer = crackBuf;

      // High-pass to make it crisp and sharp
      const crackHp = ac.createBiquadFilter();
      crackHp.type = "highpass";
      crackHp.frequency.value = 800;

      const crackGain = ac.createGain();
      crackGain.gain.setValueAtTime(0, startAt);
      crackGain.gain.linearRampToValueAtTime(1.8, startAt + 0.005);
      crackGain.gain.exponentialRampToValueAtTime(0.001, startAt + crackDuration);

      crackSrc.connect(crackHp);
      crackHp.connect(crackGain);
      crackGain.connect(ac.destination);
      crackSrc.start(startAt);
      crackSrc.stop(startAt + crackDuration);

      /* ── 2. Long deep RUMBLE ── */
      const rumbleDuration = 3.5 + Math.random() * 2.5; // 3.5–6 seconds
      const rumbleBuf = ac.createBuffer(1, ac.sampleRate * rumbleDuration, ac.sampleRate);
      const rumbleData = rumbleBuf.getChannelData(0);
      // Pink-ish noise: sum of multiple sine waves at low freq + noise
      for (let i = 0; i < rumbleData.length; i++) {
        const t2 = i / ac.sampleRate;
        // Low-freq noise bursts
        const noise = Math.random() * 2 - 1;
        // Add some harmonic content for realism
        const tone1 = Math.sin(2 * Math.PI * 38 * t2) * 0.25;
        const tone2 = Math.sin(2 * Math.PI * 62 * t2 + Math.random() * 0.4) * 0.15;
        const tone3 = Math.sin(2 * Math.PI * 20 * t2) * 0.30;
        rumbleData[i] = (noise * 0.6 + tone1 + tone2 + tone3);
      }
      const rumbleSrc = ac.createBufferSource();
      rumbleSrc.buffer = rumbleBuf;

      // Low-pass filter — only let the deep bass through
      const rumbleLp = ac.createBiquadFilter();
      rumbleLp.type = "lowpass";
      rumbleLp.frequency.value = 180;
      rumbleLp.Q.value = 1.2;

      // Second bandpass for the mid-rumble character
      const rumbleBp = ac.createBiquadFilter();
      rumbleBp.type = "bandpass";
      rumbleBp.frequency.value = 90;
      rumbleBp.Q.value = 0.5;

      // Gain envelope: starts loud, slow decay, fades to silence
      const rumbleGain = ac.createGain();
      const rumbleStart = startAt + 0.04; // tiny delay after crack
      rumbleGain.gain.setValueAtTime(0, rumbleStart);
      rumbleGain.gain.linearRampToValueAtTime(0.9, rumbleStart + 0.12);
      // Natural thunder wobble — rises and falls
      rumbleGain.gain.setValueAtTime(0.9, rumbleStart + 0.12);
      rumbleGain.gain.linearRampToValueAtTime(0.70, rumbleStart + 0.6);
      rumbleGain.gain.linearRampToValueAtTime(0.85, rumbleStart + 1.1);
      rumbleGain.gain.linearRampToValueAtTime(0.40, rumbleStart + 2.0);
      rumbleGain.gain.linearRampToValueAtTime(0.20, rumbleStart + 3.2);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, rumbleStart + rumbleDuration);

      // Parallel: src → lp → gain AND src → bp → gain
      rumbleSrc.connect(rumbleLp);
      rumbleLp.connect(rumbleGain);
      rumbleSrc.connect(rumbleBp);
      rumbleBp.connect(rumbleGain);
      rumbleGain.connect(ac.destination);
      rumbleSrc.start(rumbleStart);
      rumbleSrc.stop(rumbleStart + rumbleDuration);

      /* ── 3. Optional distant echo (random 40% chance) ── */
      if (Math.random() < 0.4) {
        const echoDelay = rumbleDuration * 0.55 + Math.random() * 0.8;
        const echoAt = startAt + echoDelay;
        const echoBuf = ac.createBuffer(1, ac.sampleRate * 1.2, ac.sampleRate);
        const echoData = echoBuf.getChannelData(0);
        for (let i = 0; i < echoData.length; i++) {
          echoData[i] = (Math.random() * 2 - 1);
        }
        const echoSrc = ac.createBufferSource();
        echoSrc.buffer = echoBuf;
        const echoLp = ac.createBiquadFilter();
        echoLp.type = "lowpass";
        echoLp.frequency.value = 120;
        const echoGain = ac.createGain();
        echoGain.gain.setValueAtTime(0, echoAt);
        echoGain.gain.linearRampToValueAtTime(0.28, echoAt + 0.1);
        echoGain.gain.exponentialRampToValueAtTime(0.001, echoAt + 1.2);
        echoSrc.connect(echoLp);
        echoLp.connect(echoGain);
        echoGain.connect(ac.destination);
        echoSrc.start(echoAt);
        echoSrc.stop(echoAt + 1.3);
      }
    }

    // Create AudioContext on first user interaction
    // (browser requires a gesture before playing audio)
    const initAudio = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener("click",     initAudio, { once: true, passive: true });
    window.addEventListener("mousemove", initAudio, { once: true, passive: true });
    window.addEventListener("touchstart",initAudio, { once: true, passive: true });

    /* ── Resize ─────────────────────────────────────────── */
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth  = window.innerWidth;
      const displayHeight = window.innerHeight;
      canvas.width  = displayWidth  * dpr;
      canvas.height = displayHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        baseAlpha:  Math.random() * 0.5 + 0.5,
        alpha:      1,
        shineSpeed: Math.random() * 0.002 + 0.001,
        shinePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
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
      const sx = w * 0.89, sy = h * 0.18;
      const R  = Math.min(w, h) * 0.055;
      sunPulse     = Math.sin(t * 0.0012) * 0.5 + 0.5;
      sunRayAngle += 0.001;

      const skyGlow = ctx.createRadialGradient(sx, sy, R*0.5, sx, sy, R*9);
      skyGlow.addColorStop(0,   "rgba(255,230,100,0.18)");
      skyGlow.addColorStop(0.25,"rgba(255,200,60,0.10)");
      skyGlow.addColorStop(0.55,"rgba(255,160,20,0.04)");
      skyGlow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(sx, sy, R*9, 0, Math.PI*2);
      ctx.fillStyle = skyGlow; ctx.fill();

      const RAY_COLORS = ["255,200,50","255,160,30","255,220,80","255,140,50",
                          "255,230,120","255,175,40","255,210,70","255,150,60"];
      for (let i = 0; i < 18; i++) {
        const angle  = sunRayAngle + (i / 18) * Math.PI * 2;
        const rayLen = R * (7 + 4 * Math.sin(t * 0.00012 + i));
        const col    = RAY_COLORS[i % RAY_COLORS.length];
        const alpha  = 0.06 + 0.03 * Math.sin(t * 0.001 + i * 0.7);
        const tipX = sx + Math.cos(angle) * rayLen;
        const tipY = sy + Math.sin(angle) * rayLen;
        const perp = angle + Math.PI / 2;
        const bw   = R * 0.28;
        const rg   = ctx.createLinearGradient(sx, sy, tipX, tipY);
        rg.addColorStop(0,    `rgba(${col},${alpha*1.8})`);
        rg.addColorStop(0.35, `rgba(${col},${alpha*0.9})`);
        rg.addColorStop(0.7,  `rgba(${col},${alpha*0.3})`);
        rg.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(sx+Math.cos(perp)*bw, sy+Math.sin(perp)*bw);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(sx-Math.cos(perp)*bw, sy-Math.sin(perp)*bw);
        ctx.closePath(); ctx.fillStyle = rg; ctx.fill();
      }

      for (let i = 0; i < 14; i++) {
        const angle = sunRayAngle*1.5 + (i/14)*Math.PI*2;
        const inner = R*1.18, outer = R*(1.55+0.25*Math.sin(t*0.002+i*1.3));
        const hw = 0.06;
        ctx.beginPath();
        ctx.moveTo(sx+Math.cos(angle-hw)*inner, sy+Math.sin(angle-hw)*inner);
        ctx.lineTo(sx+Math.cos(angle)*outer,     sy+Math.sin(angle)*outer);
        ctx.lineTo(sx+Math.cos(angle+hw)*inner, sy+Math.sin(angle+hw)*inner);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,220,80,${0.55+0.2*sunPulse})`; ctx.fill();
      }

      const corona = ctx.createRadialGradient(sx, sy, R*0.9, sx, sy, R*2.2);
      corona.addColorStop(0,   `rgba(255,240,150,${0.28+sunPulse*0.10})`);
      corona.addColorStop(0.4, `rgba(255,200,60,${0.12+sunPulse*0.05})`);
      corona.addColorStop(1,   "rgba(255,160,0,0)");
      ctx.beginPath(); ctx.arc(sx, sy, R*2.2, 0, Math.PI*2);
      ctx.fillStyle = corona; ctx.fill();

      const sunBody = ctx.createRadialGradient(sx-R*0.22, sy-R*0.22, R*0.05, sx, sy, R);
      sunBody.addColorStop(0,    "rgba(255,255,220,1.0)");
      sunBody.addColorStop(0.35, "rgba(255,240,100,0.98)");
      sunBody.addColorStop(0.75, "rgba(255,200,30,0.95)");
      sunBody.addColorStop(1,    "rgba(240,140,0,0.85)");
      ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI*2);
      ctx.fillStyle = sunBody; ctx.fill();

      const limb = ctx.createRadialGradient(sx, sy, R*0.6, sx, sy, R);
      limb.addColorStop(0,   "rgba(0,0,0,0)");
      limb.addColorStop(0.8, "rgba(180,80,0,0.06)");
      limb.addColorStop(1,   "rgba(120,50,0,0.18)");
      ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI*2);
      ctx.fillStyle = limb; ctx.fill();

      for (let g = 0; g < 7; g++) {
        const gx = sx + Math.cos(t*0.00006+g*1.1)*R*0.42;
        const gy = sy + Math.sin(t*0.00008+g*0.9)*R*0.38;
        ctx.beginPath(); ctx.arc(gx, gy, R*0.12, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,220,60,0.08)"; ctx.fill();
      }

      const flareAngle = sunRayAngle + 0.4;
      [1.8, 2.6, 3.5].forEach((dist, fi) => {
        const fx = sx + Math.cos(flareAngle+Math.PI)*R*dist;
        const fy = sy + Math.sin(flareAngle+Math.PI)*R*dist;
        const fr = R*(0.10-fi*0.025);
        const fc = ["255,200,80","200,160,255","150,220,255"][fi];
        ctx.beginPath(); ctx.arc(fx, fy, fr, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${fc},${0.18-fi*0.04})`; ctx.fill();
      });
    }

    /* ── Day sky ────────────────────────────────────────── */
    function drawDaySky(t) {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0,   "rgba(98,165,248,0.92)");
      sky.addColorStop(0.4, "rgba(160,210,255,0.85)");
      sky.addColorStop(0.8, "rgba(220,240,255,0.75)");
      sky.addColorStop(1,   "rgba(255,245,220,0.70)");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

      const haze = ctx.createRadialGradient(w*0.12, h*0.11, 0, w*0.12, h*0.11, w*0.6);
      haze.addColorStop(0,   "rgba(255,220,100,0.22)");
      haze.addColorStop(0.3, "rgba(255,200,80,0.09)");
      haze.addColorStop(0.7, "rgba(255,180,60,0.03)");
      haze.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = haze; ctx.fillRect(0, 0, w, h);
      drawClouds(t);
    }

    /* ── Clouds ─────────────────────────────────────────── */
    const CLOUDS = [
      {bx:0.35,by:0.14,r:0.11,a:0.22},{bx:0.60,by:0.08,r:0.08,a:0.18},
      {bx:0.78,by:0.20,r:0.09,a:0.15},{bx:0.20,by:0.24,r:0.07,a:0.13},
    ];
    function drawClouds(t) {
      CLOUDS.forEach((c, ci) => {
        const cx = (c.bx + Math.sin(t*0.000015+ci)*0.02)*w;
        const cy = (c.by + Math.cos(t*0.000010+ci)*0.008)*h;
        const cr = c.r * Math.min(w, h);
        const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        cg.addColorStop(0,   `rgba(255,255,255,${c.a})`);
        cg.addColorStop(0.6, `rgba(255,255,255,${c.a*0.5})`);
        cg.addColorStop(1,   "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI*2);
        ctx.fillStyle = cg; ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx+cr*0.4, cy+cr*0.1, cr*0.6, cr*0.35, 0, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${c.a*0.4})`; ctx.fill();
      });
    }

    /* ══════════════════════════════════════════════════════
       LIGHTNING
    ══════════════════════════════════════════════════════ */
    function buildBranch(x1,y1,x2,y2,depth,spread){
      if(depth===0) return [{x:x1,y:y1},{x:x2,y:y2}];
      const mx2=(x1+x2)/2+(Math.random()-0.5)*spread;
      const my2=(y1+y2)/2+(Math.random()-0.5)*spread*0.6;
      return [
        ...buildBranch(x1,y1,mx2,my2,depth-1,spread*0.55),
        ...buildBranch(mx2,my2,x2,y2,depth-1,spread*0.55).slice(1),
      ];
    }

    function spawnBolt(){
      const startX=w*(0.15+Math.random()*0.70), startY=h*Math.random()*0.12;
      const endX=startX+(Math.random()-0.5)*w*0.30, endY=h*(0.45+Math.random()*0.45);
      const spread=(endY-startY)*0.55;
      const mainPts=buildBranch(startX,startY,endX,endY,7,spread);
      const branches=[];
      for(let b=0;b<1+Math.floor(Math.random()*3);b++){
        const idx=Math.floor(mainPts.length*(0.25+Math.random()*0.55));
        const origin=mainPts[idx];
        const bEx=origin.x+(Math.random()-0.5)*w*0.20;
        const bEy=origin.y+h*(0.10+Math.random()*0.20);
        branches.push(buildBranch(origin.x,origin.y,bEx,bEy,5,(bEy-origin.y)*0.45));
      }
      const warm=Math.random()<0.25;

      // ── PLAY THUNDER: slight delay after the visual flash ──
      // Sound of thunder travels at ~340m/s; we simulate a 0.2–0.8s delay
      const thunderDelay = 0.15 + Math.random() * 0.65;
      setTimeout(() => playThunder(0), thunderDelay * 1000);

      // Trigger rain on lightning crack
      startRain();

      // Double-strike also gets sound
      if(Math.random()<0.25){
        setTimeout(()=>{
          bolts.push(spawnBolt_silent());
          playThunder(0.02);
        }, 80);
      }

      return {
        mainPts, branches,
        coreColor: warm?"255,245,220":"210,230,255",
        glowColor: warm?"220,180,80":"140,170,255",
        life:0, maxLife:14+Math.floor(Math.random()*8), flashAlpha:1.0,
      };
    }

    // Silent version for the double-strike (avoids double-spawning sound)
    function spawnBolt_silent(){
      const startX=w*(0.15+Math.random()*0.70), startY=h*Math.random()*0.12;
      const endX=startX+(Math.random()-0.5)*w*0.30, endY=h*(0.45+Math.random()*0.45);
      const spread=(endY-startY)*0.55;
      const mainPts=buildBranch(startX,startY,endX,endY,7,spread);
      const branches=[];
      for(let b=0;b<1+Math.floor(Math.random()*3);b++){
        const idx=Math.floor(mainPts.length*(0.25+Math.random()*0.55));
        const origin=mainPts[idx];
        branches.push(buildBranch(origin.x,origin.y,
          origin.x+(Math.random()-0.5)*w*0.20,
          origin.y+h*(0.10+Math.random()*0.20),5,
          (origin.y+h*0.15-origin.y)*0.45));
      }
      const warm=Math.random()<0.25;
      return {mainPts,branches,
        coreColor:warm?"255,245,220":"210,230,255",
        glowColor:warm?"220,180,80":"140,170,255",
        life:0,maxLife:14+Math.floor(Math.random()*8),flashAlpha:1.0};
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
    function drawMoon(){
      const mx2=w*0.90, my2=h*0.15, R=Math.min(w,h)*0.038;
      const halo=ctx.createRadialGradient(mx2,my2,R*0.7,mx2,my2,R*3.2);
      halo.addColorStop(0,"rgba(255,240,190,0.08)");
      halo.addColorStop(0.5,"rgba(255,230,150,0.03)");
      halo.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(mx2,my2,R*3.2,0,Math.PI*2);ctx.fillStyle=halo;ctx.fill();
      const body=ctx.createRadialGradient(mx2-R*0.25,my2-R*0.25,R*0.05,mx2,my2,R);
      body.addColorStop(0,"rgba(255,252,230,0.97)");
      body.addColorStop(0.55,"rgba(245,235,190,0.90)");
      body.addColorStop(1,"rgba(210,195,140,0.70)");
      ctx.beginPath();ctx.arc(mx2,my2,R,0,Math.PI*2);ctx.fillStyle=body;ctx.fill();
      ctx.beginPath();ctx.arc(mx2+R*0.38,my2-R*0.1,R*0.78,0,Math.PI*2);ctx.fillStyle="rgba(5,5,5,0.50)";ctx.fill();
      [[mx2-R*0.28,my2+R*0.18,R*0.10],[mx2-R*0.06,my2+R*0.38,R*0.07],
       [mx2-R*0.38,my2-R*0.12,R*0.06],[mx2-R*0.18,my2-R*0.30,R*0.05]].forEach(([cx,cy,cr])=>{
        ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fillStyle="rgba(180,160,100,0.25)";ctx.fill();
        ctx.beginPath();ctx.arc(cx+cr*0.3,cy-cr*0.3,cr,0,Math.PI*2);ctx.fillStyle="rgba(255,245,210,0.15)";ctx.fill();
      });
    }

    /* ── Saturn ─────────────────────────────────────────── */
    function drawSaturn(){
      const sx=w*0.10,sy=h*0.18,PR=Math.min(w,h)*0.022;
      ctx.save();ctx.translate(sx,sy);ctx.rotate(-0.22);
      const rg=ctx.createLinearGradient(-PR*2.4,0,PR*2.4,0);
      rg.addColorStop(0,"rgba(180,140,80,0)");rg.addColorStop(0.15,"rgba(180,140,80,0.25)");
      rg.addColorStop(0.42,"rgba(210,170,100,0.18)");
      rg.addColorStop(0.58,"rgba(210,170,100,0.18)");
      rg.addColorStop(0.85,"rgba(180,140,80,0.25)");
      rg.addColorStop(1,"rgba(180,140,80,0)");
      ctx.beginPath();ctx.ellipse(0,0,PR*2.4,PR*0.5,0,0,Math.PI*2);ctx.fillStyle=rg;ctx.fill();ctx.restore();
      const pg=ctx.createRadialGradient(sx-PR*0.3,sy-PR*0.3,PR*0.05,sx,sy,PR);
      pg.addColorStop(0,"rgba(240,200,130,0.95)");pg.addColorStop(0.5,"rgba(210,165,90,0.88)");pg.addColorStop(1,"rgba(160,110,50,0.70)");
      ctx.beginPath();ctx.arc(sx,sy,PR,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();
      for(let i=0;i<3;i++){const by=sy-PR*0.25+i*PR*0.25;ctx.save();ctx.beginPath();ctx.arc(sx,sy,PR,0,Math.PI*2);ctx.clip();ctx.beginPath();ctx.ellipse(sx,by,PR,PR*0.06,0,0,Math.PI*2);ctx.fillStyle=`rgba(180,130,60,${0.12-i*0.03})`;ctx.fill();ctx.restore();}
      ctx.save();ctx.translate(sx,sy);ctx.rotate(-0.22);ctx.beginPath();ctx.ellipse(0,0,PR*2.4,PR*0.5,0,Math.PI,Math.PI*2);
      const rf=ctx.createLinearGradient(-PR*2.4,0,PR*2.4,0);
      rf.addColorStop(0,"rgba(200,160,90,0)");rf.addColorStop(0.15,"rgba(200,160,90,0.30)");rf.addColorStop(0.5,"rgba(220,180,100,0.22)");rf.addColorStop(0.85,"rgba(200,160,90,0.30)");rf.addColorStop(1,"rgba(200,160,90,0)");
      ctx.fillStyle=rf;ctx.fill();ctx.restore();
      const sg=ctx.createRadialGradient(sx,sy,PR,sx,sy,PR*3);sg.addColorStop(0,"rgba(210,165,90,0.06)");sg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(sx,sy,PR*3,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
    }

    /* ── Distant planet ─────────────────────────────────── */
    function drawDistantPlanet(){
      const px=w*0.92,py=h*0.32,PR=Math.min(w,h)*0.012;
      const pg=ctx.createRadialGradient(px-PR*0.3,py-PR*0.3,PR*0.05,px,py,PR);
      pg.addColorStop(0,"rgba(140,180,240,0.90)");pg.addColorStop(0.6,"rgba(80,120,200,0.75)");pg.addColorStop(1,"rgba(40,70,160,0.50)");
      ctx.beginPath();ctx.arc(px,py,PR,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();
      const dg=ctx.createRadialGradient(px,py,PR*0.5,px,py,PR*2.5);
      dg.addColorStop(0,"rgba(100,150,255,0.08)");dg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath();ctx.arc(px,py,PR*2.5,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill();
    }

    /* ── Nebula ─────────────────────────────────────────── */
    function drawNebula(){
      const n1=ctx.createRadialGradient(w*0.15,h*0.20,0,w*0.15,h*0.20,w*0.40);
      n1.addColorStop(0,"rgba(80,30,120,0.055)");n1.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=n1;ctx.fillRect(0,0,w,h);
      const n2=ctx.createRadialGradient(w*0.85,h*0.75,0,w*0.85,h*0.75,w*0.45);
      n2.addColorStop(0,"rgba(20,50,120,0.045)");n2.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=n2;ctx.fillRect(0,0,w,h);
      const n3=ctx.createRadialGradient(w*0.50,h*0.55,0,w*0.50,h*0.55,w*0.55);
      n3.addColorStop(0,"rgba(60,15,90,0.03)");n3.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=n3;ctx.fillRect(0,0,w,h);
    }


    /* ══════════════════════════════════════════════════════
       RAIN SYSTEM
       Triggered on lightning strike — falls 5 sec then fades
    ══════════════════════════════════════════════════════ */
    function initRain() {
      const count = Math.floor(w * 0.55);  // density
      rainDrops = Array.from({ length: count }, () => ({
        x:     Math.random() * w,
        y:     Math.random() * h,          // start anywhere so it fills instantly
        len:   8  + Math.random() * 14,    // streak length
        speed: 14 + Math.random() * 10,    // px per frame
        width: 0.5 + Math.random() * 0.8,  // line width
        // slight wind angle — rain tilts right
        angle: 0.25 + (Math.random() - 0.5) * 0.08,
      }));
    }

    function startRain() {
      // Cancel any existing timer
      if (rainTimer) { clearTimeout(rainTimer); rainTimer = null; }
      rainFadeOut = false;
      rainAlpha   = 0;
      rainActive  = true;
      initRain();

      // After 2.5 seconds begin fade-out (reduced rain duration)
      rainTimer = setTimeout(() => {
        rainFadeOut = true;
        rainTimer = null;
      }, 2500);
    }

    function drawRain() {
      if (!rainActive) return;

      // Fade in fast (0.08/frame), fade out slow (0.012/frame)
      if (!rainFadeOut) {
        rainAlpha = Math.min(1, rainAlpha + 0.08);
      } else {
        rainAlpha -= 0.012;
        if (rainAlpha <= 0) {
          rainAlpha  = 0;
          rainActive = false;
          rainDrops  = [];
          return;
        }
      }

      ctx.save();
      ctx.lineCap = "round";

      rainDrops.forEach(d => {
        // Move drop downward along angle
        d.x += Math.sin(d.angle) * d.speed;
        d.y += Math.cos(d.angle) * d.speed;

        // Wrap: re-enter from top with random X when it exits bottom
        if (d.y > h + d.len) {
          d.y = -d.len - Math.random() * 20;
          d.x = Math.random() * w;
        }
        if (d.x > w + 20) d.x = -20;

        // Draw streak
        const tailX = d.x - Math.sin(d.angle) * d.len;
        const tailY = d.y - Math.cos(d.angle) * d.len;

        const grad = ctx.createLinearGradient(tailX, tailY, d.x, d.y);
        grad.addColorStop(0, `rgba(180,210,255,0)`);
        grad.addColorStop(0.4, `rgba(190,220,255,${rainAlpha * 0.35})`);
        grad.addColorStop(1, `rgba(210,235,255,${rainAlpha * 0.70})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(d.x, d.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = d.width;
        ctx.stroke();
      });

      ctx.restore();
    }

    /* ── Main loop ──────────────────────────────────────── */
    function draw(t) {
      const dark = isDark();
      ctx.clearRect(0, 0, w, h);

      if (dark) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);
        drawNebula();
        bolts.forEach(b => { if(b.life<3) drawSkyFlash(b.flashAlpha*(1-b.life/3)); });
        drawSaturn(); drawMoon(); drawDistantPlanet();

        // Rain — drawn after background, before stars, so stars show through
        drawRain();

        // Stars — static pass
        stars.forEach(s => {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
          ctx.fillStyle=`rgba(${GOLD},${s.alpha})`; ctx.fill();
          if(s.alpha>0.55&&s.r>0.9){ctx.beginPath();ctx.arc(s.x,s.y,s.r+1.8,0,Math.PI*2);ctx.fillStyle=`rgba(${GOLD},${s.alpha*0.15})`;ctx.fill();}
          if(s.r>1.2&&s.alpha>0.65){ctx.strokeStyle=`rgba(${GOLD},${s.alpha*0.30})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(s.x-s.r*3,s.y);ctx.lineTo(s.x+s.r*3,s.y);ctx.moveTo(s.x,s.y-s.r*3);ctx.lineTo(s.x,s.y+s.r*3);ctx.stroke();}
        });

        // Stars — move + shine pass
        const now = performance.now();
        stars.forEach(s => {
          s.x += s.vx; s.y += s.vy;
          if(s.x<-2) s.x=w+2; if(s.x>w+2) s.x=-2;
          if(s.y<-2) s.y=h+2; if(s.y>h+2) s.y=-2;
          s.alpha = Math.max(0.15, Math.min(1, s.baseAlpha + 0.35*Math.sin(now*s.shineSpeed+s.shinePhase)));
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
          ctx.fillStyle=`rgba(${GOLD},${s.alpha})`; ctx.fill();
          if(s.alpha>0.55&&s.r>0.9){ctx.beginPath();ctx.arc(s.x,s.y,s.r+1.8,0,Math.PI*2);ctx.fillStyle=`rgba(${GOLD},${s.alpha*0.15})`;ctx.fill();}
          if(s.r>1.2&&s.alpha>0.65){ctx.strokeStyle=`rgba(${GOLD},${s.alpha*0.30})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(s.x-s.r*3,s.y);ctx.lineTo(s.x+s.r*3,s.y);ctx.moveTo(s.x,s.y-s.r*3);ctx.lineTo(s.x,s.y+s.r*3);ctx.stroke();}
        });

        // Shooting stars
        nextShoot-=16;
        if(nextShoot<=0){shooters.push(spawnShooter());nextShoot=5000+Math.random()*8000;}
        for(let i=shooters.length-1;i>=0;i--){
          const s=shooters[i];s.life++;s.alpha=1-s.life/s.maxLife;
          if(s.life>s.maxLife){shooters.splice(i,1);continue;}
          const ex=s.x+Math.cos(s.angle)*s.len,ey=s.y+Math.sin(s.angle)*s.len;
          s.x+=Math.cos(s.angle)*s.speed;s.y+=Math.sin(s.angle)*s.speed;
          const sg=ctx.createLinearGradient(s.x,s.y,ex,ey);
          sg.addColorStop(0,`rgba(${GOLD},${s.alpha*0.95})`);sg.addColorStop(0.35,`rgba(${GOLD},${s.alpha*0.50})`);sg.addColorStop(1,"rgba(0,0,0,0)");
          ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(ex,ey);ctx.strokeStyle=sg;ctx.lineWidth=1.8;ctx.stroke();
          ctx.beginPath();ctx.arc(s.x,s.y,2.2,0,Math.PI*2);ctx.fillStyle=`rgba(${GOLD},${s.alpha*0.9})`;ctx.fill();
        }

        // Lightning — spawnBolt() now also triggers playThunder()
        nextBolt-=16;
        if(nextBolt<=0){
          bolts.push(spawnBolt());
          // Increase time between thunder (lightning) events
          nextBolt=5000+Math.random()*7000;
        }
        for(let i=bolts.length-1;i>=0;i--){
          const b=bolts[i];b.life++;
          const visible=b.life<=3?true:b.life<=5?false:b.life<=8?true:b.life<=10?false:b.life<=b.maxLife;
          if(b.life>b.maxLife){bolts.splice(i,1);continue;}
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
        ctx.fillStyle = "#f0f7ff";
        ctx.fillRect(0, 0, w, h);
        drawDaySky(t);
        drawSun(t);
      }

      // Spider web cursor
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
      if (audioCtx) { audioCtx.close(); audioCtx = null; }
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