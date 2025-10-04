// src/components/MaintainerDashboardPlan.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Github,
  GitMerge,
  FileWarning,
  PartyPopper,
  BarChart2,
  Slack,
  Users,
  Star,
  Code,
  HeartPulse,
  MessageSquare,
  Bug,
  Trophy,
  Lightbulb,
  Clock,
  Zap,
  Rocket,
  ShieldCheck,
  Target,
} from 'lucide-react';

// An expanded array of icon components for your hackathon plan
const iconList = [
  LayoutDashboard, Github, GitMerge, FileWarning, PartyPopper, BarChart2,
  Slack, Users, Star, Code, HeartPulse, MessageSquare, Bug, Trophy,
  Lightbulb, Clock, Zap, Rocket, ShieldCheck, Target
];

const MaintainerDashboardPlan = () => {
  const numIcons = iconList.length;
  const orbitRadius = 250; // Larger radius for the icons to orbit
  const centralSphereSize = 400; // Size of the central gradient sphere

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black text-white overflow-hidden px-4 pb-8">
      {/* Top Label */}
      <div className="border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-orange-300 mb-6">
        FOR OPEN SOURCE MAINTAINERS
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-center tracking-tighter max-w-4xl mb-12">
        Making Open Source Contribution Transparent, Fun & Efficient
      </h1>

      {/* Container for the sphere and icons */}
      <div className="relative w-full max-w-lg h-[500px] flex items-center justify-center"> {/* Increased height */}
        {/* Blurred background glow */}
        <div 
          className="absolute rounded-full blur-[100px] animate-pulse"
          style={{
            width: `${centralSphereSize}px`,
            height: `${centralSphereSize}px`,
            background: 'radial-gradient(circle at center, rgba(255, 121, 63, 0.6) 0%, rgba(255, 140, 0, 0.4) 40%, rgba(28, 98, 201, 0.3) 100%)',  
            zIndex: 5,  
          }}
        ></div>

        {/* Central sphere with GitHub Icon */}
        <div 
          className="absolute rounded-full bg-gradient-to-br from-blue-600/50 to-orange-900/80 flex items-center justify-center"
          style={{
            width: `${centralSphereSize * 0.4}px`, 
            height: `${centralSphereSize * 0.4}px`,
            zIndex: 6,
          }}
        >
          <Github className="w-20 h-20 text-white/90" />
        </div>

        {/* Mapping over icons to place them in a perfect circular orbit */}
        {iconList.map((Icon, index) => {
          const angle = (index / numIcons) * 2 * Math.PI; // Distribute icons evenly in a circle

          // Calculate the (x, y) coordinates for a circular path
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius;

          return (
            <motion.div
              key={index}
              className="absolute p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center"
              style={{
                zIndex: 20, // Ensure icons are on top
                // Position relative to the center of the container
                left: `calc(50% + ${x}px - 28px)`, // Subtract half of the icon div's width (56px/2 = 28px)
                top: `calc(50% + ${y}px - 28px)`,  // Subtract half of the icon div's height
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <motion.div
                 animate={{
                    y: [0, -4, 0], // Subtle floating animation
                 }}
                 transition={{
                    duration: 2 + index * 0.1, // Vary duration for each icon
                    repeat: Infinity,
                    ease: 'easeInOut',
                 }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Button */}
      <button className="mt-12 bg-black/30 border border-white/20 hover:bg-white/10 transition-colors duration-300 rounded-full px-8 py-3 text-sm font-medium">
        Explore Features
      </button>
    </div>
  );
};

export default MaintainerDashboardPlan;