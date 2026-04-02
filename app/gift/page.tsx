'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GiftPage() {
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState('');
  const [giftName, setGiftName] = useState('');
  const [isRolling, setIsRolling] = useState(true);
  const [rollingGift, setRollingGift] = useState('🎁');
  const [showConfetti, setShowConfetti] = useState(false);

  const gifts = ['Branded hair band', 'Branded tissue', 'Surprise Gift', 'Special Reward'];

  useEffect(() => {
    const code = localStorage.getItem('ticketCode');
    const name = localStorage.getItem('giftName');
    
    if (!code || !name) {
      router.push('/signup');
      return;
    }
    
    setTicketCode(code);
    setGiftName(name);

    // Rolling animation logic
    let interval: NodeJS.Timeout;
    const rollingDuration = 3000; // 3 seconds
    const startTime = Date.now();

    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < rollingDuration) {
        setRollingGift(gifts[Math.floor(Math.random() * gifts.length)]);
      } else {
        clearInterval(interval);
        setIsRolling(false);
        setShowConfetti(true);
        
        // Hide confetti after 5s
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
      {showConfetti && <Confetti />}

      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <Image
            src="https://hrccattendance.netlify.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogohr.b7d53c0a.jpg&w=2048&q=75"
            alt="Logo"
            width={150}
            height={60}
            className="rounded-xl shadow-sm"
          />
        </div>

        {isRolling ? (
          <div className="space-y-8 py-12">
            <div className="text-8xl animate-bounce">🎰</div>
            <h2 className="text-3xl font-bold text-primary animate-pulse">
              Dispensing your gift...
            </h2>
            <div className="text-2xl font-medium text-muted-foreground h-8">
              {rollingGift}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in duration-500">
            <div className="animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
                You're in!
              </h1>
            </div>

            <p className="text-2xl font-semibold text-primary">
              Your gift: <span className="text-foreground">{giftName}</span> 🎁
            </p>

            <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-10 mt-8 shadow-inner shadow-primary/5">
              <p className="text-sm text-muted-foreground font-medium mb-3 uppercase tracking-widest">Your Ticket Code:</p>
              <div className="text-5xl font-black text-primary tracking-tighter">
                {ticketCode}
              </div>
            </div>

            <div className="mt-8 p-6 bg-accent rounded-2xl">
              <p className="text-lg text-accent-foreground font-semibold">
                Please show this screen to receive your gift
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {pieces.map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: ['hsl(252, 82%, 67%)', 'hsl(252, 82%, 80%)', 'hsl(252, 82%, 50%)'][Math.floor(Math.random() * 3)],
            opacity: Math.random() * 0.7 + 0.3,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
