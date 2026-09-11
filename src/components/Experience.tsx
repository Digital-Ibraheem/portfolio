import React, { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { MapPin } from 'lucide-react';
import shopifyLogo from '../assets/logos/shopify.svg';
import teslaLogo from '../assets/logos/tesla.png';
import kinaxisLogo from '../assets/logos/kinaxis.svg';
import solinkLogo from '../assets/logos/solink.png';
import deltyLogo from '../assets/logos/delty.png';
import etherLogo from '../assets/logos/ether.svg';

const experiences = [
  {
    company: 'shopify',
    role: 'software engineer intern',
    description: 'joined the optimizations team, working on performance and merchant-facing tooling.',
    location: 'ottawa, on',
    period: 'sep. 2026 – present',
    current: true,
    logo: shopifyLogo,
    fillLogo: false,
    logoClass: 'w-9 h-9'
  },
  {
    company: 'tesla',
    role: 'software engineer intern',
    description: 'built automation tools with fastapi and docker for residential energy systems.',
    location: 'palo alto, ca',
    period: 'may – aug. 2026',
    current: false,
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
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });

  return (
    <main ref={scrollRef} className="h-screen overflow-y-scroll md:snap-y md:snap-mandatory relative z-10">
      {/* Fixed timeline axis — desktop only */}
      <div className="fixed left-1/2 top-24 bottom-24 -translate-x-1/2 w-[1px] bg-outline/15 pointer-events-none hidden md:block z-10">
        <motion.div
          className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-white/70 to-white/20 origin-top"
          style={{ scaleY: scrollYProgress }}
        />
      </div>

      {experiences.map((exp, index) => (
        <div key={exp.company} className="min-h-screen md:h-screen md:snap-start flex items-center relative py-20 md:py-0">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col md:flex-row items-start md:items-center justify-center w-full group ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              }`}
            >
              <div className={`w-full md:w-1/2 flex flex-col ${
                index % 2 === 0
                  ? 'md:pr-24 items-start md:items-end text-left md:text-right'
                  : 'md:pl-24 items-start md:items-start text-left md:text-left order-1 md:order-2'
              }`}>
                {/* Mobile section index */}
                <span className="md:hidden text-[10px] font-headline tracking-widest text-white/20 mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {exp.current && (
                  <div className="flex items-center gap-2 mb-4 justify-start md:justify-end">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    <span className="text-[10px] font-headline font-bold tracking-widest text-white/70 uppercase">current</span>
                  </div>
                )}

                {exp.logo && (
                  <div className={`mb-4 md:mb-8 w-14 h-14 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden border transition-colors duration-300 ${
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

                <h2 className={`font-headline text-3xl sm:text-[3.5rem] font-bold tracking-[-0.04em] leading-none mb-1 ${exp.current ? 'text-white' : 'text-white/80'}`}>
                  {exp.company}
                </h2>
                <p className={`font-headline text-base sm:text-lg font-normal tracking-tight mb-3 ${exp.current ? 'text-white/60' : 'text-white/40'}`}>
                  {exp.role}
                </p>
                <p className="text-secondary font-body italic text-base sm:text-lg max-w-md leading-relaxed">
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

              {/* Timeline dot — desktop only */}
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
