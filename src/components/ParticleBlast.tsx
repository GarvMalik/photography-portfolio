"use client";
import { useRef, useState, useCallback, type ReactNode } from "react";

interface Particle { ox:number; oy:number; x:number; y:number; vx:number; vy:number; r:number; g:number; b:number; }
interface Props { children: ReactNode; onDoubleClick?: () => void; }

const STEP = 5;

export function ParticleBlast({ children, onDoubleClick }: Props) {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const stateRef     = useRef<"idle"|"exploding"|"reforming">("idle");
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>(0);
  const [blasting, setBlasting] = useState(false);

  const sample = useCallback(() => {
    const wrap = wrapRef.current; const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const W = wrap.offsetWidth, H = wrap.offsetHeight;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,"#030303"); g.addColorStop(.35,"#111"); g.addColorStop(.65,"#1c1c1c"); g.addColorStop(1,"#070707");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    const gl = ctx.createRadialGradient(W*.5,H*.33,0,W*.5,H*.33,W*.7);
    gl.addColorStop(0,"rgba(58,58,58,.5)"); gl.addColorStop(.6,"rgba(20,20,20,.18)"); gl.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = gl; ctx.fillRect(0,0,W,H);

    const id = ctx.getImageData(0,0,W,H); const d = id.data;
    for (let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*22;d[i]=Math.min(255,Math.max(0,d[i]+n));d[i+1]=d[i];d[i+2]=d[i];}
    ctx.putImageData(id,0,0);

    particlesRef.current = [];
    for (let px=0;px<W;px+=STEP) for (let py=0;py<H;py+=STEP) {
      const i=(py*W+px)*4;
      particlesRef.current.push({ox:px,oy:py,x:px,y:py,vx:0,vy:0,r:d[i],g:d[i+1],b:d[i+2]});
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    const P = particlesRef.current, s = stateRef.current;
    ctx.clearRect(0,0,W,H);

    if (s === "exploding") {
      P.forEach(p => { p.vx*=.92; p.vy=p.vy*.92+.11; p.x+=p.vx; p.y+=p.vy; });
    } else if (s === "reforming") {
      let done = 0;
      P.forEach(p => {
        const dx=p.ox-p.x, dy=p.oy-p.y;
        p.vx=p.vx*.74+dx*.13; p.vy=p.vy*.74+dy*.13;
        p.x+=p.vx; p.y+=p.vy;
        if(Math.abs(p.vx)<.09&&Math.abs(p.vy)<.09) done++;
      });
      if (done > P.length*.94) { stateRef.current="idle"; setBlasting(false); return; }
    }

    P.forEach(p => {
      if(p.x<-12||p.x>W+12||p.y<-12||p.y>H+12) return;
      ctx.fillStyle=`rgb(${p.r},${p.g},${p.b})`; ctx.fillRect(p.x,p.y,STEP,STEP);
    });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (stateRef.current !== "idle") return;
    const rect = wrapRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    sample(); setBlasting(true);
    setTimeout(() => {
      particlesRef.current.forEach(p => {
        const dx=p.ox-cx, dy=p.oy-cy;
        const dist=Math.sqrt(dx*dx+dy*dy)+1;
        const force=Math.min(980/dist,40);
        const ang=Math.atan2(dy,dx);
        p.vx=Math.cos(ang)*force*(0.55+Math.random()*.9);
        p.vy=Math.sin(ang)*force*(0.55+Math.random()*.9)-Math.random()*6;
      });
      stateRef.current = "exploding";
      rafRef.current = requestAnimationFrame(animate);
      setTimeout(() => { stateRef.current = "reforming"; }, 1600);
    }, 40);
  }, [sample, animate]);

  return (
    <div ref={wrapRef} style={{ position:"relative", width:"100%", height:"100%" }}
         onClick={handleClick} onDoubleClick={onDoubleClick}>
      <div style={{ opacity: blasting ? 0 : 1, transition: "opacity 0.04s" }}>{children}</div>
      <canvas ref={canvasRef} className="particle-canvas" style={{ display: blasting ? "block" : "none" }} />
    </div>
  );
}
