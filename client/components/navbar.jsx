// "use client"
// import React from 'react'
// import { Github } from 'lucide-react';
// import githubOauth from '@/utils/githubOauth';

// const Navbar = () => {
//   return (
//     <div>
//       <nav className="w-full flex items-center px-12 py-4 justify-between bg-black/60 backdrop-blur-xl border-b border-white/10 z-20">
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 via-blue-600 to-orange-400 shadow-lg" />
//           <span className="text-2xl font-semibold tracking-tight">RepoDesk</span>
//         </div>
//         <div className="flex items-center space-x-8 text-gray-200 text-lg">

//           <a href="#dashboard" className="hover:text-white transition">Dashboard</a>
//           <a href="#features" className="hover:text-white transition">Features</a>
//           <a href="#repo" className="hover:text-white transition">Repo Health</a>
//           <a href="#integrations" className="hover:text-white transition">Integrations</a>
//           <a href="#faq" className="hover:text-white transition">FAQ</a>
//         </div>
//         <button onClick={githubOauth} className="\w-full flex items-center justify-center gap-2 bg-black/60 border border-white/20 rounded-lg py-3 px-4 hover:bg-black/80 transition text-white font-semiboldr cursor-pointer">
//            <Github size={20} />  Get Started with GitHub
//         </button>
//       </nav>
//     </div>
//   )
// }

// export default Navbar


"use client"
import React from 'react'
import { Github } from 'lucide-react';
import githubOauth from '@/utils/githubOauth';
import Link from 'next/link';

const Navbar = () => {

  // Function to handle smooth scrolling
  const handleScroll = (e, targetId) => {
    e.preventDefault(); // Prevent the default anchor link behavior
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // This enables the smooth scrolling
        block: 'start'
      });
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full flex items-center px-12 py-4 justify-between bg-black/60 backdrop-blur-xl border-b border-white/10 z-20">
        <div className="flex items-center space-x-3">
           <a href="/"  className="hover:text-white transition"><span className="text-2xl font-semibold tracking-tight text-white">RepoDesk</span></a>


        </div>
        <div className="flex items-center space-x-8 text-gray-200 text-lg">
          {/* Updated links with onClick handlers */}
            <Link href="/overview" className="hover:text-white transition">Dashboard</Link>
          <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="hover:text-white transition">Features</a>
          <a href="#repo" onClick={(e) => handleScroll(e, 'repo')} className="hover:text-white transition">Repo Health</a>
          <a href="#integrations" onClick={(e) => handleScroll(e, 'integrations')} className="hover:text-white transition">Integrations</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-white transition">FAQ</a>
        </div>
        <button
          onClick={githubOauth}
          className="flex items-center justify-center gap-2 bg-black/60 border border-white/20 rounded-lg py-3 px-4 hover:bg-black/80 transition text-white font-semibold cursor-pointer"
        >
          <Github size={20} />  Get Started with GitHub
        </button>
      </nav>
    </div>
  )
}

export default Navbar;