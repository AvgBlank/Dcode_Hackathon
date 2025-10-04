// components/HeroSection.js

"use client";

import {
  Activity,
  GitPullRequest,
  Users,
  MessageSquare,
  GithubIcon,
} from 'lucide-react';

// Feature data updated with your new content
const features = [
  {
    icon: <Activity className="h-6 w-6 text-orange-400" />,
    title: 'Repository Health at a Glance',
    description: 'See open issues, pending pull requests, and contribution activity so nothing slips through the cracks.',
    align: 'text-right',
  },
  {
    icon: <GitPullRequest className="h-6 w-6 text-orange-400" />,
    title: 'Issues & PR Management',
    description: 'Filter, prioritize, and assign issues and pull requests effortlessly. Spend less time digging.',
    align: 'text-right',
  },
  {
    icon: <Users className="h-6 w-6 text-orange-400" />,
    title: 'Contributor Insights',
    description: 'Identify your top contributors, track their activity, and understand how your community is performing.',
    align: 'text-left',
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-orange-400" />,
    title: 'Community Interaction',
    description: 'Quickly monitor discussions, reviews, and comments to stay engaged with your project’s ecosystem.',
    align: 'text-left',
  },
];

// Reusable Feature Item Component
const FeatureItem = ({ icon, title, description, align }) => (
  <div className={`max-w-xs ${align}`}>
    <div className={`inline-block p-3 bg-gray-800/50 rounded-full mb-3`}>
        {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 mt-1">{description}</p>
  </div>
);

const HeroSection = () => {
  return (
    <div className="bg-black font-sans text-white">
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <header className="text-center max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
            A DASHBOARD BUILT FOR MAINTAINERS
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mt-4">
            Your Repositories. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Fully Under Control.</span>
          </h1>
          <p className="text-lg text-gray-400 mt-6">
           Track activity, manage contributions, and keep your projects healthy, all in one place. Spend less time digging and more time improving your code and community.
          </p>
        </header>

        {/* Features Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 items-center gap-16 lg:gap-8 mt-20">
          {/* Left Column */}
          <div className="flex flex-col items-center lg:items-end gap-16">
            <FeatureItem {...features[0]} />
            <FeatureItem {...features[1]} />
          </div>

          {/* Center CTA Button - "Connect Your GitHub" */}
          <div className="flex justify-center items-center order-first lg:order-none">
            <div className="relative flex items-center justify-center w-64 h-64">
              {/* Outer rings */}
              <div className="absolute w-full h-full rounded-full border-2 border-orange-500/20 animate-pulse"></div>
              <div className="absolute w-5/6 h-5/6 rounded-full border border-orange-500/20"></div>
              
              {/* Orange Glow */}
              <div className="absolute w-48 h-48 bg-orange-500/20 rounded-full blur-2xl"></div>

              {/* Play Button */}
              <button className="relative z-10 flex items-center justify-center w-24 h-24 bg-orange-500/60 rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors duration-300">
                <GithubIcon className="h-10 w-10 text-black fill-black" />
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center lg:items-start gap-16">
            <FeatureItem {...features[2]} />
            <FeatureItem {...features[3]} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HeroSection;
