
import React, { useState, useEffect } from 'react';
import TerminalInput from './components/TerminalInput';
import CardDisplay from './components/CardDisplay';
import { generateConceptCard } from './services/geminiService';
import { GenerationStatus } from './types';
import { Network, BrainCircuit, Waves, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (keywords: string) => {
    setStatus(GenerationStatus.ANALYZING);
    setGeneratedHtml(null);
    setError(null);

    try {
      // Small delays for dramatic effect and "vibe"
      await new Promise(r => setTimeout(r, 800));
      setStatus(GenerationStatus.SYNTHESIZING);
      await new Promise(r => setTimeout(r, 800));
      setStatus(GenerationStatus.COLLAPSING);
      
      const html = await generateConceptCard(keywords);
      setGeneratedHtml(html);
      setStatus(GenerationStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Collapsing failed. Entropy too high.');
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-mono flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#000_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
          <Sparkles size={14} className="text-zinc-400" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-400">Quantum Conceptual Blending</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          CYBERNETIC WEB WEAVER
        </h1>
        <p className="text-sm md:text-base text-zinc-500 max-w-xl leading-relaxed italic">
          "The browser is no longer a viewer, it is a ritualistic site where keywords collapse into techno-mystic artifacts."
        </p>
      </header>

      {/* Main UI */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col gap-12">
        <TerminalInput 
          onGenerate={handleGenerate} 
          isLoading={status !== GenerationStatus.IDLE && status !== GenerationStatus.ERROR} 
        />

        {/* Status Indicators */}
        {status !== GenerationStatus.IDLE && status !== GenerationStatus.ERROR && (
          <div className="flex flex-col items-center gap-6 py-8 animate-pulse">
            <div className="flex gap-12">
              <StatusIcon 
                active={status === GenerationStatus.ANALYZING} 
                icon={<BrainCircuit size={24} />} 
                label="Analyzing" 
              />
              <StatusIcon 
                active={status === GenerationStatus.SYNTHESIZING} 
                icon={<Network size={24} />} 
                label="Synthesizing" 
              />
              <StatusIcon 
                active={status === GenerationStatus.COLLAPSING} 
                icon={<Waves size={24} />} 
                label="Collapsing" 
              />
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Engaging Semantic Field...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center font-bold uppercase tracking-widest animate-in slide-in-from-top-4">
            [ERROR]: {error}
          </div>
        )}

        {generatedHtml && <CardDisplay html={generatedHtml} />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pt-24 pb-12 text-center">
        <div className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] mb-4">
          Built for the Techno-Mystic Age
        </div>
        <div className="flex items-center justify-center gap-4 text-zinc-800">
          <div className="w-8 h-[1px] bg-zinc-900" />
          <span>v4.0.2</span>
          <div className="w-8 h-[1px] bg-zinc-900" />
        </div>
      </footer>
    </div>
  );
};

interface StatusIconProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ active, icon, label }) => (
  <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'text-white scale-110' : 'text-zinc-800'}`}>
    <div className={`p-4 rounded-full border transition-all duration-500 ${active ? 'border-white/40 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'border-white/5'}`}>
      {icon}
    </div>
    <span className="text-[9px] uppercase tracking-widest font-bold">{label}</span>
  </div>
);

export default App;
