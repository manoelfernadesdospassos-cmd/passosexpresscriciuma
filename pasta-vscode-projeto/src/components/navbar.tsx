import React from 'react';
import { Car, Phone, TableProperties, History, Zap } from 'lucide-react';
import { DISPLAY_WHATSAPP_PHONE } from '../constants';

interface NavbarProps {
  onOpenPricing: () => void;
  onOpenHistory: () => void;
  onOpenPix?: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPricing,
  onOpenHistory,
  onOpenPix,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Car className="w-5 h-5 text-slate-950 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
                PASSOS <span className="text-emerald-400">EXPRESS</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold uppercase tracking-wider">
                De Carro 🚗
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Entregas de Carro · Criciúma e Região
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <TableProperties className="w-4 h-4 text-emerald-400" />
            Tabela de Fretes
          </button>

          {onOpenPix && (
            <button
              onClick={onOpenPix}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              Pagar via PIX
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 relative cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            Histórico
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenPix && (
            <button
              onClick={onOpenPix}
              className="lg:hidden px-2.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-lg flex items-center gap-1 cursor-pointer"
              title="Pagar via PIX"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span className="hidden sm:inline">PIX</span>
            </button>
          )}

          <a
            href="https://wa.me/5548991377771"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>(48) 99137-7771</span>
          </a>
        </div>
      </div>
    </header>
  );
};
