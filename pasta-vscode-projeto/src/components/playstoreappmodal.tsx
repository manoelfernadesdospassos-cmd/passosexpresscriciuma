import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  UploadCloud,
  FolderCheck,
  FileText,
  Code2,
  Terminal,
  FileArchive
} from 'lucide-react';
import { COMPANY_NAME, DISPLAY_WHATSAPP_PHONE } from '../constants';

interface PlayStoreAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreAppModal: React.FC<PlayStoreAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'playstore' | 'manifest' | 'netlify' | 'vscode'>('netlify');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback alert / guidance
      alert(
        'Para instalar agora no seu celular:\n1. Abra este site no Google Chrome\n2. Toque no menu de 3 pontinhos (⋮)\n3. Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Aplicativo no Celular &amp; Google Play Store
                </h3>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-black rounded-full uppercase">
                  PWA / APK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Seu aplicativo já está pronto e otimizado para instalar no celular sem mostrar nenhum código
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex flex-wrap sm:flex-nowrap gap-1">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'install'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            1. Instalar no Celular
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'playstore'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            2. Publicar na Play Store
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'manifest'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            3. Manifest &amp; Pacote
          </button>
          <button
            onClick={() => setActiveTab('netlify')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'netlify'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
            4. Netlify (Celular/PC)
          </button>
          <button
            onClick={() => setActiveTab('vscode')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'vscode'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            5. Código no VS Code
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {activeTab === 'install' && (
            <div className="space-y-5">
              {/* Card de Instalação Imediata */}
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Instalar Passos Express no Celular
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Fica como um aplicativo nativo na tela inicial do seu smartphone, com ícone próprio e sem barra de navegador.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalled ? 'App Já Instalado' : 'Instalar Aplicativo'}</span>
                </button>
              </div>

              {/* Como Funciona para seus Clientes */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Como seus clientes instalam no Android &amp; iPhone:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                        A
                      </span>
                      <b className="text-slate-900 text-xs">No Android (Google Chrome)</b>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ao abrir o site, basta tocar no menu de 3 pontinhos (⋮) no topo e escolher <strong>&quot;Instalar aplicativo&quot;</strong>. Ele cria o ícone do Passos Express automaticamente.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                        B
                      </span>
                      <b className="text-slate-900 text-xs">No iPhone (Safari)</b>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Basta tocar no botão de Compartilhar (quadrado com seta para cima) e escolher <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vantagens */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Vantagens do Aplicativo Passos Express:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>100% Limpo:</strong> Nenhum código ou termo técnico é exibido para o cliente.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Super Rápido:</strong> Abre em 1 segundo e funciona em tela cheia como qualquer app da Play Store.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Cálculo Automático:</strong> O cliente escolhe a coleta e entrega em Criciúma e manda no seu WhatsApp.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Como Publicar na Google Play Store em 3 Passos</span>
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Este site já possui todos os arquivos oficiais exigidos pelo Google: <strong>Manifest PWA</strong>, ícones de alta resolução (192px, 512px, maskable) e <strong>Digital Asset Links</strong> (<code>/.well-known/assetlinks.json</code>).
                </p>
              </div>

              {/* Passo a Passo PWABuilder */}
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <b className="text-slate-900 text-xs">Passo 1: Acesse a ferramenta oficial da Google/Microsoft</b>
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Abrir PWABuilder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600">
                    O <strong>PWABuilder</strong> transforma este site num arquivo <code>.aab</code> (Android App Bundle) assinado, que é o formato exigido pela Google Play Store para aprovação.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <b className="text-slate-900 text-xs">Passo 2: Links para Colocar no Google Play Console &amp; PWABuilder</b>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Pronto para envio
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Copie os links abaixo conforme os campos solicitados no Google Play Console e no gerador PWABuilder:
                  </p>

                  <div className="space-y-2">
                    {/* Link do Site Oficial */}
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          1. URL Oficial do App (Site no Netlify):
                        </span>
                        <span className="font-mono text-xs text-blue-600 break-all select-all">
                          https://passosexpresscriciuma.netlify.app
                        </span>
                      </div>
                      <button
                        onClick={() => copyText('https://passosexpresscriciuma.netlify.app', 'url-netlify')}
                        className="self-start sm:self-auto px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === 'url-netlify' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url-netlify' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* Link da Política de Privacidade */}
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          2. URL da Política de Privacidade (Obrigatório no Google Console):
                        </span>
                        <span className="font-mono text-xs text-blue-600 break-all select-all">
                          https://passosexpresscriciuma.netlify.app/#privacidade
                        </span>
                      </div>
                      <button
                        onClick={() => copyText('https://passosexpresscriciuma.netlify.app/#privacidade', 'url-privacy')}
                        className="self-start sm:self-auto px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === 'url-privacy' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url-privacy' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* Link do Manifest */}
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          3. URL do Web App Manifest:
                        </span>
                        <span className="font-mono text-xs text-blue-600 break-all select-all">
                          https://passosexpresscriciuma.netlify.app/manifest.json
                        </span>
                      </div>
                      <button
                        onClick={() => copyText('https://passosexpresscriciuma.netlify.app/manifest.json', 'url-manifest')}
                        className="self-start sm:self-auto px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === 'url-manifest' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url-manifest' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>

                    {/* Link do Digital Asset Links */}
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          4. URL do Digital Asset Links (Validação de App no Google):
                        </span>
                        <span className="font-mono text-xs text-blue-600 break-all select-all">
                          https://passosexpresscriciuma.netlify.app/.well-known/assetlinks.json
                        </span>
                      </div>
                      <button
                        onClick={() => copyText('https://passosexpresscriciuma.netlify.app/.well-known/assetlinks.json', 'url-assetlinks')}
                        className="self-start sm:self-auto px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedField === 'url-assetlinks' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'url-assetlinks' ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <b className="text-slate-900 text-xs">Passo 3: Dados Cadastrais Pré-Configurados para a Google Play</b>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[11px]">ID do Pacote (Package ID):</span>
                        <b className="text-slate-900 font-mono">com.passosexpress.criciuma</b>
                      </div>
                      <button
                        onClick={() => copyText('com.passosexpress.criciuma', 'pkg-id')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'pkg-id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Nome do App:</span>
                        <b className="text-slate-900">Passos Express Criciúma</b>
                      </div>
                      <button
                        onClick={() => copyText('Passos Express Criciúma', 'app-name')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'app-name' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                      <span className="text-slate-500 block text-[11px]">Categoria da Play Store:</span>
                      <b className="text-slate-900">Mapas e Navegação / Entregas</b>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Telefone de Contato:</span>
                        <b className="text-slate-900 font-mono">{DISPLAY_WHATSAPP_PHONE}</b>
                      </div>
                      <button
                        onClick={() => copyText(DISPLAY_WHATSAPP_PHONE, 'support-phone')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'support-phone' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href="https://play.google.com/console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Acessar Google Play Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Manifest Oficial Atualizado (com.passosexpress.criciuma)</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Este manifesto está salvo em <code>/manifest.json</code> e sincronizado no <code>vite.config.ts</code> e <code>index.html</code>. Pronto para pacotes no PWABuilder, Bubblewrap e Google Play Store.
                </p>
              </div>

              {/* Status checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Package ID:</span>
                  <b className="text-slate-900 font-mono text-[11px] truncate block" title="com.passosexpress.criciuma">
                    com.passosexpress.criciuma
                  </b>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">App Name:</span>
                  <b className="text-slate-900 text-[11px] truncate block">
                    Passos Express Criciúma
                  </b>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Orientation:</span>
                  <b className="text-slate-900 font-mono text-[11px]">
                    any
                  </b>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Display:</span>
                  <b className="text-slate-900 font-mono text-[11px]">
                    standalone
                  </b>
                </div>
              </div>

              {/* Code viewer & copy */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100">
                <div className="p-2.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-slate-300 text-xs">manifest.json</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/manifest.json"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Abrir Arquivo</span>
                    </a>
                    <button
                      onClick={() =>
                        copyText(
                          JSON.stringify(
                            {
                              background_color: '#ffffff',
                              dir: 'ltr',
                              display: 'standalone',
                              name: 'Passos Express Criciúma',
                              orientation: 'any',
                              scope: '/',
                              short_name: 'Passos Express Criciúma',
                              start_url: '/',
                              theme_color: '#ffffff',
                              icons: [
                                {
                                  src: 'https://via.placeholder.com/512x512.png?text=Passos+Express',
                                  sizes: '512x512',
                                  type: 'image/png',
                                  purpose: 'any maskable'
                                },
                                {
                                  src: '/pwa-192x192.png',
                                  sizes: '192x192',
                                  type: 'image/png',
                                  purpose: 'any'
                                },
                                {
                                  src: '/pwa-512x512.png',
                                  sizes: '512x512',
                                  type: 'image/png',
                                  purpose: 'any'
                                },
                                {
                                  src: '/pwa-maskable-512x512.png',
                                  sizes: '512x512',
                                  type: 'image/png',
                                  purpose: 'maskable'
                                }
                              ],
                              id: 'com.passosexpress.criciuma'
                            },
                            null,
                            2
                          ),
                          'manifest-code'
                        )
                      }
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'manifest-code' ? (
                        <>
                          <Check className="w-3 h-3" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Manifest
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56 leading-relaxed">
{`{
  "background_color": "#ffffff",
  "dir": "ltr",
  "display": "standalone",
  "name": "Passos Express Criciúma",
  "orientation": "any",
  "scope": "/",
  "short_name": "Passos Express Criciúma",
  "start_url": "/",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "https://via.placeholder.com/512x512.png?text=Passos+Express",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "id": "com.passosexpress.criciuma"
}`}
                </pre>
              </div>

              {/* Assetlinks link */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Digital Asset Links para a Play Store:
                </span>
                <a
                  href="/.well-known/assetlinks.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <span>/.well-known/assetlinks.json</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'netlify' && (
            <div className="space-y-5">
              {/* Card principal Netlify */}
              <div className="p-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
                    <FileArchive className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-400 text-emerald-950 font-black text-[10px] rounded-full uppercase tracking-wider inline-block mb-1">
                      Ideal para Celular
                    </span>
                    <h4 className="font-black text-white text-base">
                      Arquivo .ZIP Pronto para Publicar no Netlify
                    </h4>
                    <p className="text-xs text-teal-100 mt-0.5">
                      Contém todos os arquivos compilados da pasta <strong>dist</strong> prontos. No Netlify pelo celular você só envia este ZIP e seu site atualiza na hora!
                    </p>
                  </div>
                </div>

                <a
                  href="/api/download-netlify-zip"
                  download="passos-express-netlify-deploy.zip"
                  className="w-full sm:w-auto px-5 py-3 bg-white text-teal-700 hover:bg-teal-50 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Baixar ZIP para Netlify</span>
                </a>
              </div>

              {/* Passo a passo pelo Celular */}
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
                  <h5 className="font-extrabold text-amber-950 text-sm">
                    Como publicar no Netlify direto pelo CELULAR (3 Passos):
                  </h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1">
                    <div className="font-black text-amber-600 text-xs">PASSO 1</div>
                    <p className="font-bold text-slate-800">Baixe o ZIP</p>
                    <p className="text-slate-600 text-[11px]">
                      Toque no botão verde acima <strong>"Baixar ZIP para Netlify"</strong>. Ele salvará o arquivo <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded">passos-express-netlify-deploy.zip</code> no seu celular.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1">
                    <div className="font-black text-amber-600 text-xs">PASSO 2</div>
                    <p className="font-bold text-slate-800">Abra o Netlify no Navegador</p>
                    <p className="text-slate-600 text-[11px]">
                      Acesse <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-bold underline">app.netlify.com</a> no Chrome/Safari do celular, faça login e entre no seu site <span className="font-semibold text-slate-900">passosexpresscriciuma</span>.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1">
                    <div className="font-black text-amber-600 text-xs">PASSO 3</div>
                    <p className="font-bold text-slate-800">Envie o ZIP na aba Deploys</p>
                    <p className="text-slate-600 text-[11px]">
                      Vá na aba <strong>Deploys</strong>. Toque na área de upload de arquivos ou arraste o <strong>.zip</strong> baixado. O Netlify descompacta e publica em 15 segundos!
                    </p>
                  </div>
                </div>
              </div>

              {/* Opções de Publicação no PC e Git */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opção 1: Drag & Drop da Pasta dist */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold flex items-center justify-center">1</span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Publicar pelo Computador (PC)</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    Se estiver no PC, você pode tanto enviar esse mesmo arquivo ZIP quanto arrastar a pasta descompactada para a aba <strong>Deploys</strong> no painel do Netlify.
                  </p>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                    <li>Acesse <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-semibold underline">app.netlify.com</a></li>
                    <li>Vá no seu site <strong>passosexpresscriciuma</strong></li>
                    <li>Abra a aba <strong>Deploys</strong></li>
                    <li>Arraste o arquivo ZIP ou a pasta para a área pontilhada <em>"Need to update your site? Drag and drop your site output folder here"</em></li>
                  </ol>
                </div>

                {/* Opção 2: Conexão via GitHub / Netlify Build */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">Publicação Contínua (GitHub / Git)</h5>
                  </div>
                  <p className="text-xs text-slate-600">
                    O projeto já possui os arquivos <code className="text-teal-700 font-bold">netlify.toml</code> e <code className="text-teal-700 font-bold">public/_redirects</code> pré-configurados:
                  </p>
                  <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono space-y-1">
                    <div><span className="text-slate-400">Build command:</span> npm run build</div>
                    <div><span className="text-slate-400">Publish directory:</span> dist</div>
                    <div><span className="text-slate-400">SPA Redirect:</span> /* /index.html 200</div>
                  </div>
                </div>
              </div>

              {/* Arquivos incluídos no pacote de publicação */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-emerald-600" />
                  <b className="text-slate-900 text-xs">O que está dentro do ZIP do Netlify:</b>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>index.html</strong> (HTML minificado de alta performance)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>_redirects</strong> (Evita tela branca ou 404 ao recarregar a rota)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>manifest.json</strong> (Web App Manifest com ícones oficiais)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>.well-known/assetlinks.json</strong> (Chave para a Google Play TWA)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>assets/</strong> (CSS compilado Tailwind e JS com Leaflet e Mapas)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>sw.js &amp; workbox</strong> (Service Worker Offline para instalar no celular)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vscode' && (
            <div className="space-y-6">
              {/* Card de Download do Código Fonte */}
              <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-indigo-700/50">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 font-bold text-[10px] rounded-full uppercase tracking-wider inline-block mb-1">
                      Código Fonte Completo
                    </span>
                    <h4 className="font-extrabold text-white text-base">
                      Baixar Projeto Completo para VS Code
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Baixe o arquivo ZIP contendo todo o código-fonte em React 19 + TypeScript + Vite + Tailwind + Leaflet pronto para abrir no seu editor.
                    </p>
                  </div>
                </div>

                <a
                  href="/api/download-vscode-zip"
                  download="passos-express-projeto-completo.zip"
                  className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-95 border border-indigo-400/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Projeto (.ZIP)</span>
                </a>
              </div>

              {/* Guia Rápido de 3 Passos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">1</span>
                    <h5 className="font-bold text-slate-900 text-xs">Extraia a pasta</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Extraia o arquivo baixado em uma pasta como <code>C:\projetos\passos-express</code> e abra no Visual Studio Code.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">2</span>
                    <h5 className="font-bold text-slate-900 text-xs">Instale as dependências</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Abra o terminal do VS Code (<kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-300 text-[10px]">Ctrl + `</kbd>) e rode o comando:
                  </p>
                  <div className="flex items-center justify-between bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-xs">
                    <code>npm install</code>
                    <button
                      onClick={() => copyText('npm install', 'cmd-install')}
                      className="text-slate-400 hover:text-white cursor-pointer ml-2"
                    >
                      {copiedField === 'cmd-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">3</span>
                    <h5 className="font-bold text-slate-900 text-xs">Inicie ou Compile</h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Para testar no navegador em tempo real:
                  </p>
                  <div className="flex items-center justify-between bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-xs">
                    <code>npm run dev</code>
                    <button
                      onClick={() => copyText('npm run dev', 'cmd-dev')}
                      className="text-slate-400 hover:text-white cursor-pointer ml-2"
                    >
                      {copiedField === 'cmd-dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comandos para o Netlify no VS Code */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <h5 className="font-bold text-slate-900 text-xs">Comando para compilar e gerar a pasta dist no seu PC:</h5>
                </div>
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs">
                  <code>npm run build</code>
                  <button
                    onClick={() => copyText('npm run build', 'cmd-build')}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans font-bold cursor-pointer"
                  >
                    {copiedField === 'cmd-build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Depois de rodar <code>npm run build</code>, a pasta <strong>dist</strong> será criada ou atualizada. Você só precisa arrastá-la para o Netlify!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {COMPANY_NAME} · Entregas de Carro em Criciúma e Região
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
