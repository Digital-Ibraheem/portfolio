import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import teslaLogo from '../assets/logos/tesla.png';
import kinaxisLogo from '../assets/logos/kinaxis.svg';
import solinkLogo from '../assets/logos/solink.png';
import deltyLogo from '../assets/logos/delty.png';
import etherLogo from '../assets/logos/ether.svg';

const experiences = [
  {
    company: 'tesla',
    role: 'software engineer intern',
    description: 'joining the team to build automation tools with fastapi and docker for residential energy systems.',
    location: 'palo alto, ca',
    period: 'may – aug. 2026',
    current: true,
    logo: teslaLogo,
    fillLogo: true,
    logoClass: 'w-16 h-16'
  },
  {
    company: 'kinaxis',
    role: 'software engineer intern',
    description: 'developed across the stack for kinaxis maestro.',
    location: 'ottawa, on',
    period: 'jan. – apr. 2026',
    current: false,
    logo: kinaxisLogo,
    fillLogo: true,
    logoClass: 'w-13 h-13'
  },
  {
    company: 'solink',
    role: 'software developer intern',
    description: 'worked on rust-based deployment tooling for large-scale camera infrastructure.',
    location: 'ottawa, on',
    period: 'sep. – dec. 2025',
    current: false,
    logo: solinkLogo,
    fillLogo: false,
    logoClass: 'w-10 h-10'
  },
  {
    company: 'delty (yc x25)',
    role: 'software engineering intern',
    description: 'built llm pipelines and real-time features for an ai-native design platform.',
    location: 'san francisco, ca',
    period: 'may – aug. 2025',
    current: false,
    logo: deltyLogo,
    fillLogo: true,
    logoClass: 'w-10 h-10'
  },
  {
    company: 'ether technologies',
    role: 'founder & full-stack developer',
    description: 'built and shipped full-stack products for clients as a solo founder.',
    location: 'ottawa, on',
    period: 'jan. 2024 – apr. 2025',
    current: false,
    logo: etherLogo,
    fillLogo: false,
    logoClass: 'w-10 h-10'
  }
];

export const Experience: React.FC = () => {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory relative z-10">
      {/* Fixed timeline axis — spans full viewport, persists across snaps */}
      <div className="fixed left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-outline/30 to-transparent pointer-events-none hidden md:block z-10" />

      {experiences.map((exp, index) => (
        <div key={exp.company} className="snap-start h-screen flex items-center relative">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col md:flex-row items-center justify-center w-full group ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              }`}
            >
              <div className={`w-full md:w-1/2 flex flex-col ${
                index % 2 === 0
                  ? 'md:pr-24 md:items-end text-center md:text-right'
                  : 'md:pl-24 md:items-start text-center md:text-left order-1 md:order-2'
              }`}>
                {exp.current && (
                  <div className={`flex items-center gap-2 mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <span className="text-[10px] font-headline font-bold tracking-widest text-white/70 uppercase">incoming</span>
                  </div>
                )}

                {exp.logo && (
                  <div className={`mb-8 w-[72px] h-[72px] rounded-xl overflow-hidden border transition-colors duration-300 ${
                    exp.fillLogo ? '' : 'bg-white flex items-center justify-center'
                  } ${
                    exp.current
                      ? 'border-white/30 group-hover:border-white/70'
                      : 'border-white/10 group-hover:border-white/40'
                  }`}>
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className={exp.fillLogo ? `object-cover ${exp.fillPad ? 'w-4/5 h-4/5' : 'w-full h-full'}` : `${exp.logoClass} object-contain`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <h2 className={`font-headline text-[3.5rem] font-bold tracking-[-0.04em] leading-none mb-1 ${exp.current ? 'text-white' : 'text-white/80'}`}>
                  {exp.company}
                </h2>
                <p className={`font-headline text-lg font-normal tracking-tight mb-3 ${exp.current ? 'text-white/60' : 'text-white/40'}`}>
                  {exp.role}
                </p>
                <p className="text-secondary font-body italic text-lg max-w-md leading-relaxed">
                  {exp.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-headline tracking-widest text-white/70">
                    {exp.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline/20 text-sm font-headline tracking-widest text-white/70">
                    <MapPin size={13} />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Timeline dot — centered in its snap section */}
              <div className={`hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full border-4 border-background transition-transform group-hover:scale-125 ${
                exp.current
                  ? 'w-5 h-5 bg-white ring-2 ring-white/30'
                  : 'w-4 h-4 bg-white'
              }`} />

              <div className={`w-full md:w-1/2 hidden md:block ${index % 2 === 0 ? '' : 'order-1'}`} />
            </motion.div>
          </div>
        </div>
      ))}
    </main>
  );
};
