'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-2xl text-center">
        <div className="flex justify-center">
          <Image
            src="/image1.png"
            alt="Welcome Character"
            width={800}
            height={320}
            priority
            className="w-[120%] max-w-none md:w-full h-auto"
          />
        </div>

        <div className="flex justify-center -mt-4 md:mt-0 relative z-10">
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
