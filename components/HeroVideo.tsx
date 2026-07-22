'use client';
import { useEffect, useState } from 'react';

/**
 * Видео-фон hero грузим ТОЛЬКО на десктопе и только при нормальной связи.
 * На мобильных / медленном интернете остаётся фото-фон (hero-kenburns) —
 * экономим ~0.65 МБ на первый экран (важно для РФ-мобильного без VPN).
 */
export default function HeroVideo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    // Экономия трафика / медленная сеть
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || ''));
    if (isDesktop && !slow) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/stock/p37733181.jpg"
      className="hero-video absolute inset-0 h-full w-full object-cover"
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>
  );
}
