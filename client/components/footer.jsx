"use client";

import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#0d1117] bg-opacity-90 backdrop-blur-xl border-t border-white/20 text-gray-300 py-10 px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div className="flex flex-col max-w-sm space-y-4">
          <div className="flex items-center space-x-3">
            <Github size={28} className="text-orange-500" />
            {/* Added gradient for Fusion AI text */}
            <span className="text-xl font-semibold tracking-wide bg-gradient-to-r from-orange-400 to-red-600 text-transparent bg-clip-text">
              Maintainer Dashboard
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empower your AI workflows with Fusion AI agents. Connect, automate,
            and accelerate productivity.
          </p>
          <div className="flex space-x-5 mt-3 text-gray-400">
            {/* Social icons with hover effect */}
            <a href="#" aria-label="GitHub" className="hover:text-orange-400 transition-colors duration-200">
              <Github size={24} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-orange-400 transition-colors duration-200">
              <Twitter size={24} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-orange-400 transition-colors duration-200">
              <Linkedin size={24} />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-orange-400 transition-colors duration-200">
              <Facebook size={24} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-orange-400 transition-colors duration-200">
              <Instagram size={24} />
            </a>
            <a href="#" aria-label="Email" className="hover:text-orange-400 transition-colors duration-200">
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:max-w-4xl">
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Fusion AI. All rights reserved.
      </div>
    </footer>
  );
}