'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const brandBlue = '#091838';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background overflow-x-hidden">
      <div className="w-full max-w-2xl text-center relative flex flex-col items-center">
        {/* Welcome Message Box - Moved up and changed to Brand Blue */}
        <div 
          className="w-[90%] md:w-[75%] border-2 rounded-[2.5rem] p-6 md:p-8 mb-[-3rem] md:mb-[-4rem] relative z-0"
          style={{ 
            backgroundColor: `${brandBlue}10`, // 10% opacity
            borderColor: `${brandBlue}20`      // 20% opacity
          }}
        >
          <h1 className="text-2xl md:text-4xl font-bold leading-tight" style={{ color: brandBlue }}>
            Welcome! Let's get your gift.
          </h1>
          <p className="text-lg md:text-xl opacity-70 mt-2" style={{ color: brandBlue }}>
            It takes 10 seconds.
          </p>
        </div>

        {/* Character Image - 2/3 of previous mobile size and centered */}
        <div className="flex justify-center relative z-10 w-full">
          <Image
            src="/image2.png"
            alt="Welcome Character"
            width={800}
            height={320}
            priority
            className="w-[200%] max-w-none md:w-[250%] h-auto object-contain relative left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0"
          />
        </div>

        {/* Start Button */}
        <div className="flex justify-center -mt-10 md:-mt-24 relative z-20 w-full">
          <Link
            href="/signup"
            className="inline-block w-full max-w-xs px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}
