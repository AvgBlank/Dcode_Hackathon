"use client";

import {
  Plus,
  Book,
  GitBranch,
  UploadCloud,
  History,
  Github,
  FileCode,
  Users,
} from "lucide-react";

const sidebarNavItems = [
  { icon: <Plus size={18} />, label: "New repository" },
  { icon: <UploadCloud size={18} />, label: "Import repository" },
  { icon: <Book size={18} />, label: "Your repositories" },
  { icon: <Users size={18} />, label: "Your organizations" },
  { icon: <FileCode size={18} />, label: "Your gists" },
  { icon: <History size={18} />, label: "Recent activity" },
];

const DashboardUi = () => {
  return (
    <div className="p-20 h-screen">
    <div className="relative flex h-[70vh] w-full bg-[#0d1117] text-gray-300 font-sans overflow-hidden border border-white/10 rounded-2xl shadow-lg">
      {/* Blue and orange gradient glows */}
      <div className="absolute top-0 right-0 h-[36rem] w-[36rem] bg-gradient-to-tr from-orange-500 via-orange-900 to-blue-900 opacity-30 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[24rem] w-[28rem] bg-gradient-to-br from-blue-700/25 via-orange-400/30 to-yellow-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-56 w-56 bg-gradient-to-r from-blue-700/40 via-orange-400/25 to-transparent blur-[90px] rounded-full pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-72 bg-black/30 p-6 border-r border-white/10 z-20">
        <div className="flex items-center gap-3 mb-8">
          <Github size={32} />
          <span className="font-semibold text-lg">GitHub</span>
        </div>
        <nav className="flex flex-col gap-2">
          {sidebarNavItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:bg-orange-500/10 hover:text-white transition-colors duration-200 rounded-md"
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center gap-8 md:gap-12 px-6 md:px-20 z-10">
        <div className="relative w-full max-w-3xl">
          {/* Subtle glass light effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-orange-100/10 to-transparent blur-xl -z-10 rounded-2xl shadow-[0_8px_80px_0_rgba(234,88,12,0.07)]" />
          <div className="relative w-full bg-[#161b22]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl overflow-hidden p-1">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-9 w-9 bg-black/50 rounded-full">
                  <Github size={18} className="text-gray-300" />
                </div>
                <h2 className="font-semibold text-white text-base">username /</h2>
                <span className="text-gray-400 text-base">Create a new repository</span>
              </div>
              {/* Input Area */}
              <div className="w-full mb-2">
                <textarea
                  rows={2}
                  placeholder="Create a new Next.js project called 'my-awesome-app'"
                  className="w-full bg-transparent text-lg text-white placeholder:text-gray-400 resize-none focus:outline-none border-none focus:ring-0"
                  defaultValue="Create a new Next.js project with TypeScript and Tailwind CSS"
                />
              </div>
            </div>
            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between p-6 bg-black/20 border-t border-white/10">
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-white font-semibold">
                  <GitBranch size={16} /> main
                </button>
                <span className="text-gray-600">|</span>
                <button className="text-gray-400 hover:text-white transition-colors">Add .gitignore</button>
                <button className="text-gray-400 hover:text-white transition-colors">Add license</button>
              </div>
              <button className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-105">
                Create Repository
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
     </div>
  );
};

export default DashboardUi;
