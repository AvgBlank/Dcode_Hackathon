// components/FaqSection.jsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: 'What problem does the RepoDesk solve?',
    answer: `It helps open-source maintainers deal with scattered information, stale or claimed issues, and low recognition for contributors—reducing burnout and improving community efficiency.`,
  },
  {
    question: 'How does the dashboard provide a unified view?',
    answer: `It fetches issues, PRs, reviews, comments, and stars from the GitHub API and presents them in a clean, easy-to-read dashboard with charts and timelines.`,
  },
   
  {
    question: 'Which tech stack is used?',
    answer: `Frontend: React.js + Chart.js/Recharts | Backend: Node.js (Express) or Python (FastAPI/Flask) | Integrations: GitHub Webhooks, Slack/Discord Webhooks.`,
  },
  
  {
    question: 'Can we expand the project further?',
    answer: `Yes! Stretch goals include sentiment analysis of comments, contributor CVs, and gamification badges like "Bug Slayer" or "Code Wizard" for extra engagement.`,
  },
  
];

// Accordion Item Component
const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div id='faq' className="border-b border-white/10 py-5">
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between text-left gap-4"
    >
      <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-orange-400' : 'text-gray-200'}`}>
        {question}
      </span>
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        {isOpen ? <Minus size={20} className="text-orange-400" /> : <Plus size={20} className="text-gray-400" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {/* This is the styled answer panel */}
          <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/20">
             <p className="text-gray-300 leading-relaxed">{answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Main FAQ Section Component
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // Default first item to be open

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen w-full bg-black font-sans overflow-hidden">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-blue-600/30 blur-[150px] rounded-full -z-0"></div>
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-orange-600/30 blur-[120px] rounded-full -z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Frequently Asked Questions
            </h2>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
                Everything you need to know about the RepoDesk project, from its purpose to its tech stack.
            </p>
        </div>

        {/* FAQ Container with Glassmorphism Effect */}
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-8">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;