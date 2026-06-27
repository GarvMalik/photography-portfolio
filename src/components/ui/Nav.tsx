"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 1.0, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  const link: React.CSSProperties = {
    fontSize: "9.5px", letterSpacing: "0.22em",
    color: "var(--c-fg-2)", textTransform: "uppercase", textDecoration: "none",
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 flex justify-between items-center"
         style={{ padding: "18px var(--page-px)", zIndex: 100, mixBlendMode: "difference" }}>
      <Link href="/" data-cursor
            style={{ ...link, color: "#fff", fontWeight: 600, fontSize: "12px", letterSpacing: "0.15em" }}>
        GM
      </Link>
      <div className="flex gap-8">
        {["Work", "Series", "About", "Contact"].map(l => (
          <Link key={l} href={`#${l.toLowerCase()}`} data-cursor style={link}>{l}</Link>
        ))}
      </div>
      <span style={{ ...link, color: "var(--c-fg-3)", fontSize: "9px" }}>2024</span>
    </nav>
  );
}
