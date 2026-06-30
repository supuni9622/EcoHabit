'use client';

import { useRef, useEffect, useState } from 'react';

interface ShareCardProps {
  badge: { id: string; name: string; icon: string; description: string };
  user: { displayName: string; totalPoints: number; level: number; currentStreak: number };
  onClose: () => void;
}

export default function ShareCard({ badge, user, onClose }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#16a34a');
    gradient.addColorStop(1, '#065f46');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(520, 60, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(80, 340, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Top: EcoHabit logo text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌿 EcoHabit', 300, 55);

    // Divider line
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 75);
    ctx.lineTo(540, 75);
    ctx.stroke();

    // Badge icon (large emoji in center)
    ctx.font = '80px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badge.icon, 300, 180);

    // Badge name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.fillText(badge.name, 300, 225);

    // Badge description
    ctx.fillStyle = '#bbf7d0';
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.fillText(badge.description, 300, 257);

    // Stats bar background
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    const barRadius = 12;
    const barX = 40;
    const barY = 295;
    const barW = 520;
    const barH = 56;
    ctx.moveTo(barX + barRadius, barY);
    ctx.lineTo(barX + barW - barRadius, barY);
    ctx.quadraticCurveTo(barX + barW, barY, barX + barW, barY + barRadius);
    ctx.lineTo(barX + barW, barY + barH - barRadius);
    ctx.quadraticCurveTo(barX + barW, barY + barH, barX + barW - barRadius, barY + barH);
    ctx.lineTo(barX + barRadius, barY + barH);
    ctx.quadraticCurveTo(barX, barY + barH, barX, barY + barH - barRadius);
    ctx.lineTo(barX, barY + barRadius);
    ctx.quadraticCurveTo(barX, barY, barX + barRadius, barY);
    ctx.closePath();
    ctx.fill();

    // User stats text
    ctx.fillStyle = '#ffffff';
    ctx.font = '15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const statsText = `${user.displayName} · Level ${user.level} · 🔥 ${user.currentStreak}-day streak · ${user.totalPoints.toLocaleString()} pts`;
    ctx.fillText(statsText, 300, 329);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('#EcoHabit · ecohabit.app', 300, 380);

    // Generate preview
    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [badge, user]);

  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSharing(true);
    try {
      if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'ecohabit-achievement.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `I earned the ${badge.name} badge on EcoHabit!`,
              text: `Check out my achievement on EcoHabit! ${badge.icon} ${badge.name}`,
              files: [file],
            });
          } else {
            handleDownload();
          }
        }, 'image/png');
      } else {
        handleDownload();
      }
    } catch {
      // User cancelled or error — silently fail
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'ecohabit-achievement.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `I just earned the ${badge.name} badge on EcoHabit! Join me: https://ecohabit.app #EcoHabit`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I just earned the ${badge.name} badge on EcoHabit!`
  )}&hashtags=EcoHabit,RecyclingChallenge,SriLanka`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Hidden canvas for drawing */}
        <canvas ref={canvasRef} width={600} height={400} className="hidden" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 id="share-card-title" className="font-bold text-gray-800 text-lg">Share Achievement</h2>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Preview image */}
        {previewUrl && (
          <div className="px-5">
            <img
              src={previewUrl}
              alt="Achievement card preview"
              className="w-full rounded-2xl shadow-md"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="p-5 space-y-3">
          <button
            onClick={handleNativeShare}
            disabled={sharing}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <span>↑</span>
            {sharing ? 'Sharing…' : 'Share'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white py-2.5 rounded-xl font-medium text-sm text-center hover:opacity-90 transition-opacity"
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white py-2.5 rounded-xl font-medium text-sm text-center hover:opacity-80 transition-opacity"
            >
              Twitter / X
            </a>
          </div>

          <button
            onClick={handleDownload}
            className="w-full border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}
