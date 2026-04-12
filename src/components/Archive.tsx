import React from 'react';
import { motion } from 'motion/react';

// Renders title with a line break before each underscore: agent_budget_guard →
// agent
// _budget
// _guard
const renderTitle = (title: string) => {
  const parts = title.split('_');
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <><wbr /><span>_</span></>}{part}
    </React.Fragment>
  ));
};
import tafsirImg from '../assets/projects/tafsirsearch.png';
import agentImg from '../assets/projects/agentbudgetguard.png';
import modcentralImg from '../assets/projects/modcentral.png';
import sevenDegreesImg from '../assets/projects/7degrees.png';
import movieImg from '../assets/projects/movierecommender.png';

const projects = [
  {
    id: 'tafsir_search',
    title: 'tafsir_search',
    description: 'bilingual quran rag engine with a two-stage llm pipeline. 80% fewer hallucinated citations.',
    image: tafsirImg,
    source: 'https://github.com/Digital-Ibraheem/tafsir-search',
    demo: null
  },
  {
    id: 'modcentral',
    title: 'modcentral',
    description: 'multi-vendor car parts marketplace. elasticsearch search, role-based access, ci/cd — supporting 10k+ listings.',
    image: modcentralImg,
    source: null,
    demo: 'https://modcentral.co'
  },
  {
    id: 'agent_budget_guard',
    title: 'agent_budget_guard',
    description: 'open-source sdk for hard dollar caps on llm agents. supports openai, anthropic, and gemini. 300+ downloads in the first week.',
    image: agentImg,
    source: 'https://github.com/Digital-Ibraheem/agent-budget-guard',
    demo: 'https://pypi.org/project/agent-budget-guard/'
  },
  {
    id: 'movie_recommender',
    title: 'movie_recommender',
    description: 'collaborative filtering recommendation engine built with flask and scikit-learn.',
    image: movieImg,
    source: 'https://github.com/Digital-Ibraheem/movie-recommender-backend',
    demo: 'https://creative-madeleine-a22059.netlify.app/'
  },
  {
    id: '7_degrees',
    title: '7_degrees',
    description: 'real-time transcription pipeline using openai whisper + gemini. next.js dashboard with insights loading under 2s. shipped in 36 hours.',
    image: sevenDegreesImg,
    source: 'https://github.com/adamstol/HTN-2025',
    demo: 'https://7-degrees.vercel.app/'
  },
  {
    id: 'chess_evaluation',
    title: 'chess_evaluation',
    description: 'python chess position evaluator using custom heuristics and material analysis.',
    image: 'https://opengraph.githubassets.com/1/Digital-Ibraheem/chess-evaluation',
    source: 'https://github.com/Digital-Ibraheem/chess-evaluation',
    demo: null
  }
];

export const Archive: React.FC = () => {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {projects.map((project, index) => (
        <section key={project.id} className={`snap-start h-screen flex items-center px-12 relative overflow-hidden border-b border-outline/10 last:border-b-0 ${index === projects.length - 1 ? 'pb-20' : ''}`}>
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className={`md:col-span-5 ${index % 2 !== 0 ? 'md:order-2 text-right' : ''}`}>
              <motion.h2
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-headline text-[3.5rem] font-bold tracking-[-0.04em] leading-tight mb-4"
              >
                {renderTitle(project.title)}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-body text-lg font-extralight italic tracking-wider text-secondary"
              >
                {project.description}
              </motion.p>
              <div className={`flex gap-4 mt-8 ${index % 2 !== 0 ? 'justify-end' : ''}`}>
                {project.source && (
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-full border border-outline/30 text-[10px] font-headline font-bold lowercase tracking-widest hover:bg-white hover:text-background transition-all duration-300"
                  >
                    view_source
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-full border border-outline/30 text-[10px] font-headline font-bold lowercase tracking-widest hover:bg-white hover:text-background transition-all duration-300"
                  >
                    live_demo
                  </a>
                )}
              </div>
            </div>

            <div className={`md:col-span-7 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-surface-container-low aspect-video w-full overflow-hidden relative"
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-headline text-2xl font-bold tracking-tight text-white/10 group-hover:text-white/20 transition-colors duration-700">
                      {project.title}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {index === projects.length - 1 && (
            <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
              <p className="font-body italic text-secondary text-sm tracking-wide">wanna see more?</p>
              <a
                href="https://github.com/Digital-Ibraheem"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-2 bg-transparent text-white border border-white/30 font-headline font-bold text-sm lowercase tracking-tight rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-300"
              >
                view_on_github
              </a>
            </div>
          )}
        </section>
        // test
      ))}
    </main>
  );
};
