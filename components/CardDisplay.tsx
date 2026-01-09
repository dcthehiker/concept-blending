
import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, Loader2, Image as ImageIcon, FileCode } from 'lucide-react';
import { toPng } from 'html-to-image';

interface CardDisplayProps {
  html: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ html }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (iframeRef.current && html) {
      setIsIframeLoaded(false);
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        
        // Wait for styles, images and MathJax to settle
        const timeout = setTimeout(() => setIsIframeLoaded(true), 2500);
        return () => clearTimeout(timeout);
      }
    }
  }, [html]);

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybernetic-card-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = async () => {
    if (!iframeRef.current || !isIframeLoaded) return;
    
    setIsExporting(true);
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) throw new Error("Iframe content not accessible");

      // Target the specific card element inside the iframe to avoid capturing empty space
      const cardElement = doc.getElementById('artifact-card');
      const targetElement = cardElement || doc.body;

      // Small delay for MathJax final layout
      await new Promise(r => setTimeout(r, 300));

      const dataUrl = await toPng(targetElement as HTMLElement, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: null, // Allow transparency for rounded corners
      });

      const link = document.createElement('a');
      link.download = `cybernetic-artifact-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG Export Failed:", err);
      alert("PNG Export failed. Possible causes: CORS restricted images or rendering timeout.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-12 animate-in fade-in zoom-in duration-700">
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative w-[340px] h-[453px] bg-[#050505] rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10">
          {(!isIframeLoaded || isExporting) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20 font-mono">
              <Loader2 className="animate-spin text-white mb-4" size={32} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                {isExporting ? "Rendering Pixels..." : "Stabilizing Artifact..."}
              </span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            title="Generated Concept Card"
            className={`w-full h-full border-none transition-opacity duration-700 ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        {/* Floating Controls */}
        <div className="absolute -right-16 top-0 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={downloadPng}
            disabled={isExporting}
            className="p-3 bg-zinc-900/90 hover:bg-white hover:text-black rounded-full border border-white/10 transition-all shadow-xl group/btn"
            title="Download PNG"
          >
            <ImageIcon size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button 
            onClick={downloadHtml}
            className="p-3 bg-zinc-900/90 hover:bg-white hover:text-black rounded-full border border-white/10 transition-all shadow-xl group/btn"
            title="Download HTML"
          >
            <FileCode size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
          <button className="p-3 bg-zinc-900/90 hover:bg-white hover:text-black rounded-full border border-white/10 transition-all shadow-xl group/btn">
            <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]">Artifact Signature Verified</p>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>
    </div>
  );
};

export default CardDisplay;
