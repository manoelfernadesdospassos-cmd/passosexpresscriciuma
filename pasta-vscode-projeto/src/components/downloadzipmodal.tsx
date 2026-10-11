import React from 'react';
import {
  X,
  Download,
  FolderArchive,
  Globe,
  Code2,
  ExternalLink,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Baixar Projeto em Pasta Zipada (.ZIP)
              </h2>
              <p className="text-xs text-slate-300">
                Arquivos compactados prontos da Passos Express
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Opção 1: Pacote Completo (Recomendado) */}
          <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                    Recomendado
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Pacote Completo Unificado
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Inclui a pasta pronta do Netlify (compilada) + código-fonte para VS Code + guia de publicação.
                </p>
              </div>
            </div>

            <a
              href="/passos-express-completo.zip"
              download="passos-express-completo.zip"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Pacote Completo (.ZIP) — 1.6 MB</span>
            </a>
          </div>

          {/* Opção 2: Netlify (Deploy Direto) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  1. Pasta para Publicar no Netlify
                </h4>
                <p className="text-[11px] text-slate-500">
                  Arquivos estáticos prontos para arrastar em <strong>app.netlify.com/drop</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="/passos-express-netlify.zip"
                download="passos-express-netlify.zip"
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Baixar Netlify (.ZIP) — 1.3 MB</span>
              </a>

              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Abrir Netlify Drop</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Opção 3: VS Code (Código-fonte) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">
                  2. Código-Fonte para o VS Code
                </h4>
                <p className="text-[11px] text-slate-500">
                  Todo o código limpo (React, TypeScript, Tailwind, Node.js) para editar no seu computador.
                </p>
              </div>
            </div>

            <a
              href="/passos-express-vscode.zip"
              download="passos-express-vscode.zip"
              className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Baixar Código-Fonte VS Code (.ZIP) — 295 KB</span>
            </a>
          </div>

          {/* Dicas Rápidas */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Como usar os arquivos:</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
              <li><strong>Pelo celular ou computador:</strong> baixe o arquivo zip e guarde como backup ou suba no Netlify.</li>
              <li><strong>No Netlify:</strong> solte o arquivo <code className="bg-slate-200 px-1 rounded">passos-express-netlify.zip</code> na página do Netlify Drop.</li>
              <li><strong>No VS Code:</strong> descompacte <code className="bg-slate-200 px-1 rounded">passos-express-vscode.zip</code> e execute <code className="bg-slate-200 px-1 rounded">npm install</code> e <code className="bg-slate-200 px-1 rounded">npm run dev</code>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
