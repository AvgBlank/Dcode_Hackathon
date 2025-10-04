import React from "react";
import HeroSection from "./section/home";
import DashboarUi from "./section/dashboardui";
import RepoDashboardUI from "./section/repoDashboardUI";
import Features from "./section/features";
import IntegrationsSection from "./section/inntergration";
import FaqSection from "./section/faqSection";
import Card from "./section/card";
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
