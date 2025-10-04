import React from "react";
import HeroSection from "../landingPage/section/home";
import DashboarUi from "../landingPage/section/dashboardui";
import RepoDashboardUI from "../landingPage/section/repoDashboardUI";
import Features from "../landingPage/section/features";
import IntegrationsSection from "../landingPage/section/inntergration";
import FaqSection from "../landingPage/section/faqSection";
import Card from "../landingPage/section/card";
import Footer from "../../components/footer";
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <HeroSection />
      <DashboarUi />
      <Features />
      <RepoDashboardUI />
      <IntegrationsSection />
      <FaqSection />
      <Card/>
      <Footer/>
    </div>
  );
}
