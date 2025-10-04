// src/components/SmartInvestingCard.jsx

"use client";

import React from 'react';

const SmartInvestingCard = () => {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-black p-4 font-sans">
      {/* Background Gradient Glows */}
      <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-800 via-orange-900 to-blue-800 p-8 text-center text-white shadow-2xl md:p-12">
        
        {/* Decorative Background Pattern */}
        <div
          className="absolute inset-0 h-full w-full bg-repeat opacity-10 [will-change:transform]"
          style={{
            backgroundImage: "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
            transform: 'translateX(0%) translateY(0%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Build Smarter Open-Source Projects
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            A unified dashboard for maintainers with issue tracking, cookie-licking detection, 
            and fun celebration features to keep your community engaged and efficient.
          </p>
          <button
            onClick={() => alert('Join the Hackathon!')}
            className="group mt-8 flex cursor-pointer items-center gap-3 rounded-full bg-black px-8 py-4 text-lg font-bold text-white-900 shadow-lg transition-all duration-300 hover:bg-orange-900 hover:scale-105"
          >
            Join now
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xl text-white transition-transform duration-300 group-hover:rotate-45">
              &#8594;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartInvestingCard;
