

import Image from 'next/image';

// Updated image paths (you can replace these with relevant images)
import repoHealthImg from "../../../public/landingPageImage/glance.png";
import issuesImg from "../../../public/landingPageImage/fitured.png";
import contributorsImg from "../../../public/landingPageImage/contributor.png";
import communityImg from "../../../public/landingPageImage/contributor.png";
import metricsImg from "../../../public/landingPageImage/metrics.png";

// Updated feature cards data
const featuresData = [
  {
    title: "Repository Health at a Glance",
    description: "See the status of all your repos—open issues, pending pull requests, and contribution activity—so nothing slips through the cracks.",
    image: repoHealthImg,
    className: "md:col-span-2",
  },
  {
    title: "Issues & PR Management",
    description: "Filter, prioritize, and assign issues and pull requests effortlessly. Spend less time digging and more time improving your projects.",
    image: issuesImg,
    className: "md:col-span-3",
  },
  {
    title: "Contributor Insights",
    description: "Identify your top contributors, track their activity, and understand how your team or community is performing.",
    image: contributorsImg,
    className: "md:col-span-3",
  },
  {
    title: "Community Interaction",
    description: "Quickly monitor discussions, reviews, and comments to stay engaged with contributors and maintain a healthy project ecosystem.",
    image: communityImg,
    className: "md:col-span-2",
  },
  {
    title: "Actionable Metrics",
    description: "Get real-time stats on open/closed issues, PR trends, response times, and repo growth to make informed decisions.",
    image: metricsImg,
    className: "md:col-span-5", // spans full width on medium screens
  },
];

const AiFeaturesSection = () => {
  return (
    <section id='features' className="bg-black text-white font-sans py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#1a1a1a] border border-gray-800 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            DASHBOARD FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Your Repositories. Fully Under Control.
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            A dashboard built for open source maintainers—track activity, manage contributions, and keep your projects healthy, all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 relative overflow-hidden group ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-transparent to-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-auto object-cover" 
                    placeholder="blur"
                  />
                </div>
                
                <div className="flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiFeaturesSection;
