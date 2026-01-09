
import React, { useState } from 'react';
import { Terminal, Send, Zap } from 'lucide-react';

interface TerminalInputProps {
  onGenerate: (keywords: string) => void;
  isLoading: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({ onGenerate, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onGenerate(input);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-white/20"
    >
      <div className="flex items-center gap-2 mb-3 px-2">
        <Terminal size={14} className="text-zinc-500" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Web Weaver Terminal v4.0</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
      
      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入关键词（例：对抗硅基, 顺势巫术...）"
          className="w-full h-32 bg-transparent text-zinc-200 placeholder-zinc-700 resize-none border-none focus:ring-0 font-mono text-sm leading-relaxed p-2"
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`absolute bottom-2 right-2 flex items-center gap-2 px-4 py-2 rounded font-bold text-[10px] uppercase tracking-widest transition-all ${
            isLoading || !input.trim() 
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
            : 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
          }`}
        >
          {isLoading ? (
            <Zap size={14} className="animate-spin" />
          ) : (
            <>
              Collapse <Send size={12} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TerminalInput;
