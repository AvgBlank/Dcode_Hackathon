

import React from "react";
import Navbar from "../../../components/navbar";
import NeonGradientShape from "./neonGradientShape";
import Image from "next/image";
import dashboardImg from "../../../public/landingPageImage/hero1.png";
import Link from "next/link";
export default function HeroSection() {
  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(110deg, #050505 60%, rgba(41,6,15,0.7) 100%)",
      }}
    >
      <Navbar />

      <main className="flex flex-1 justify-between items-center px-28 z-10">
        {/* Left Section */}
        <div className="flex flex-col justify-center max-w-xl">
          <div className="mt-12">
            <span className="px-4 py-1 rounded-full border border-gradient-to-r from-orange-400 to-blue-500 text-xs uppercase tracking-wide bg-black bg-opacity-50">
              OPEN SOURCE DASHBOARD
            </span>
          </div>
          <h1 className="mt-7 text-6xl font-extrabold leading-[1.1] max-w-3xl">
            Your Repositories.
            <br />
            Fully Under Control.
          </h1>
          <p className="mt-8 text-xl text-gray-200 max-w-xl">
            A dashboard built for open source maintainers—track activity, manage contributions,
            and keep your projects healthy, all in one place.
          </p>
          <div className="mt-12 flex space-x-6">
            <Link href="/login">
            <button className="px-8 py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-orange-500 to-blue-700 text-white border-orange-400 shadow-orange-500/30 shadow-lg hover:from-orange-400 hover:to-blue-500 transition-all">
              Get Started
            </button></Link>
            <button className="px-8 py-3 rounded-lg text-lg font-medium bg-gradient-to-r from-orange-500 to-blue-700 text-white border border-gray-200 hover:border-blue-400 transition-all">
              Explore Dashboard
            </button>
          </div>
        </div>

        
        <div className="relative w-[600px] h-[700px] flex-shrink-0">
          <Image
            src={dashboardImg}
            alt="Dashboard Illustration"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </main>

     
      <NeonGradientShape />
    </div>
  );
}
