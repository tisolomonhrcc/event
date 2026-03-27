'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background overflow-x-hidden">
      <div className="w-full max-w-2xl text-center relative">
        {/* Welcome Message Box behind character */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] bg-accent/50 backdrop-blur-sm border-2 border-primary/10 rounded-[2.5rem] p-8 pb-16 z-0">
          <h1 className="text-2xl md:text-4xl font-bold text-primary leading-tight">
            Welcome! Let's get your gift.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            It takes 10 seconds.
          </p>
        </div>

        {/* Character Image */}
        <div className="flex justify-center relative z-10 pt-20 md:pt-24">
          <Image
            src="/image2.png"
            alt="Welcome Character"
            width={800}
            height={320}
            priority
            className="w-[160%] max-w-none md:w-full h-auto"
          />
        </div>

        {/* Start Button */}
        <div className="flex justify-center -mt-8 md:mt-0 relative z-20">
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
