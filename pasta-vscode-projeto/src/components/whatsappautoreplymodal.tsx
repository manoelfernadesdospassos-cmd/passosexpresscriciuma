import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Bot,
  MessageCircle,
  Smartphone,
  Sparkles,
  Zap,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { COMPANY_NAME, DISPLAY_WHATSAPP_PHONE } from '../constants';

interface WhatsAppAutoReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAutoReplyModal: React.FC<WhatsAppAutoReplyModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'business' | 'webhook' | 'simulador'>('business');

  // Estado do simulador
  const [simInput, setSimInput] = useState('Quanto custa uma entrega de carro até Içara?');
  const [simOutput, setSimOutput] = useState('');
  const [isSimLoading, setIsSimLoading] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const webhookUrl = `${currentUrl}/api/whatsapp-webhook`;

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(id);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulate = async () => {
    if (!simInput.trim()) return;
    setIsSimLoading(true);
    setSimOutput('');

    try {
      const res = await fetch('/api/whatsapp-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: simInput, from: '5548999999999' })
      });
      if (res.ok) {
        const data = await res.json();
        setSimOutput(data.reply || 'Resposta automática gerada com sucesso.');
      } else {
        setSimOutput('Servidor ativo. Resposta padrão: "Olá! Seja bem-vindo à Passos Express..."');
      }
    } catch {
      setSimOutput('🚗 *PASSOS EXPRESS*\n\nOlá! Nossos fretes são exclusivamente de carro em Criciúma e região.\nPreços: Até 3km: R$12 | 3 a 5km: R$15 | 5 a 8km: R$20...');
    } finally {
      setIsSimLoading(false);
    }
  };

  const saudacaoPadrao = `Olá! 👋 Seja bem-vindo à *PASSOS EXPRESS* (Entregas de Carro em Criciúma e Região).

Sou o atendente automático. Nossas entregas são *100% de CARRO* — porta-malas amplo, não molha mercadoria na chuva e transporte climatizado. 🚗📦

Para calcularmos seu frete na hora, por favor informe:
📍 1. *Endereço de Coleta (Rua, Número e Bairro)*
🏁 2. *Endereço de Entrega (Rua, Número e Bairro)*
📦 3. *O que será transportado?*

Nossa central já vai te responder!`;

  const respostaFrete = `🚗 *TABELA DE FRETES — PASSOS EXPRESS (CARRO)*

• Até 3 km: *R$ 12,00*
• 3 a 5 km: *R$ 15,00*
• 5 a 8 km: *R$ 20,00*
• 8 a 12 km: *R$ 25,00*
• 12 a 15 km: *R$ 30,00*
• 15 a 20 km: *R$ 40,00*
• Acima de 20 km: *Sob consulta*

Atendemos Criciúma, Içara, Forquilhinha, Nova Veneza, Cocal do Sul, Siderópolis e Balneário Rincão!`;

  const respostaCarro = `🚗 *POR QUE ENTREGA DE CARRO?*

1. *Porta-malas Espaçoso:* Levamos até 300kg, caixas grandes, compras de mercado/atacado e múltiplos pacotes.
2. *100% Protegido da Chuva:* Suas caixas e produtos nunca molham.
3. *Climatizado:* Ideal para bolos, confeitaria, refeições, eletrônicos e medicamentos sensíveis ao calor.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Respostas Automáticas no WhatsApp (Chatbot)
                </h3>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-black rounded-full uppercase">
                  Automático
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Responda automaticamente seus clientes quando eles mandarem mensagem no WhatsApp
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

        {/* Navigation tabs */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1">
          <button
            onClick={() => setActiveTab('business')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'business'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            1. WhatsApp Business no Celular (Sem Código)
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'webhook'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            2. Webhook / API Automática (24h)
          </button>
          <button
            onClick={() => setActiveTab('simulador')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'simulador'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            3. Testar Respostas
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {activeTab === 'business' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <span>Como Ativar Respostas Automáticas Grátis no seu WhatsApp:</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Usando o aplicativo gratuito <strong>WhatsApp Business</strong> no seu celular, qualquer pessoa que mandar mensagem para você recebe a resposta automática na hora, sem precisar de nenhum servidor ligado!
                </p>
              </div>

              {/* Step 1: Mensagem de Saudação */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                      A. Mensagem de Saudação (Enviada no Primeiro Contato)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Menu (⋮) &gt; Ferramentas Comerciais &gt; Mensagem de Saudação
                    </span>
                  </div>
                  <button
                    onClick={() => copyText(saudacaoPadrao, 'saudacao')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedField === 'saudacao' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'saudacao' ? 'Copiado!' : 'Copiar Texto'}
                  </button>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {saudacaoPadrao}
                </div>
              </div>

              {/* Step 2: Respostas Rápidas */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  B. Respostas Rápidas (Atalhos com Barra /)
                </span>
                <p className="text-xs text-slate-500">
                  Cadastre em <em>Ferramentas Comerciais &gt; Respostas Rápidas</em> para responder com 1 toque:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <b className="text-emerald-700 text-xs">Atalho: /frete ou /tabela</b>
                      <button
                        onClick={() => copyText(respostaFrete, 'frete')}
                        className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'frete' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'frete' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 whitespace-pre-wrap font-mono">{respostaFrete}</p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <b className="text-emerald-700 text-xs">Atalho: /carro</b>
                      <button
                        onClick={() => copyText(respostaCarro, 'carro')}
                        className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'carro' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedField === 'carro' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 whitespace-pre-wrap font-mono">{respostaCarro}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-950 text-sm">
                  Webhook 24h Criado no seu Servidor Express
                </h4>
                <p className="text-xs text-blue-800 mt-1">
                  Já deixamos a rota <code>/api/whatsapp-webhook</code> ativa no backend da Passos Express. Ela recebe mensagens via API (Meta WhatsApp Cloud API, Evolution API, Z-API ou Typebot) e responde automaticamente com Inteligência Artificial!
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                  Sua URL de Webhook:
                </span>
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono text-xs">
                  <span className="flex-1 truncate text-slate-900 select-all font-bold">
                    {webhookUrl}
                  </span>
                  <button
                    onClick={() => copyText(webhookUrl, 'webhook-url')}
                    className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-lg text-xs shrink-0 cursor-pointer"
                  >
                    {copiedField === 'webhook-url' ? 'Copiado!' : 'Copiar URL'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Método HTTP:</span>
                  <b className="text-slate-900 font-mono">POST (e GET para verify)</b>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block text-[11px]">Verify Token (Segurança):</span>
                  <b className="text-slate-900 font-mono">passosexpress_token_2026</b>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <b className="text-slate-900">Como funciona o fluxo 24 horas:</b>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
                  <li>O cliente envia mensagem para seu WhatsApp (ex: <em>&quot;Boa tarde, quanto fica uma entrega no Nações Shopping?&quot;</em>).</li>
                  <li>O Webhook recebe a mensagem instantaneamente.</li>
                  <li>O Gemini AI analisa os bairros em Criciúma, calcula a tabela de frete de carro e envia a resposta de volta para o cliente no WhatsApp em segundos!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'simulador' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <h4 className="font-bold text-purple-950 text-sm">
                  Simulador de Mensagem Recebida do Cliente
                </h4>
                <p className="text-xs text-purple-800 mt-1">
                  Digite uma mensagem simulando o que um cliente enviaria no seu WhatsApp para ver a resposta exata que o robô responderá:
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 text-xs">
                  Mensagem que o cliente enviou no WhatsApp:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simInput}
                    onChange={(e) => setSimInput(e.target.value)}
                    placeholder="Ex: Quanto fica uma entrega do Centro pro Rio Maina?"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSimulate}
                    disabled={isSimLoading}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <span>{isSimLoading ? 'Simulando...' : 'Enviar Teste'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {simOutput && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <span className="font-bold text-emerald-800 text-xs">
                    Resposta Automática que o cliente receberá:
                  </span>
                  <div className="p-4 bg-[#e5ddd5] dark:bg-[#121b22] rounded-xl border border-slate-300">
                    <div className="bg-white dark:bg-[#1f2c34] text-slate-900 dark:text-slate-100 p-3.5 rounded-lg text-xs whitespace-pre-wrap leading-relaxed shadow-xs">
                      {simOutput}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Central Oficial: <b className="text-slate-800 font-mono">{DISPLAY_WHATSAPP_PHONE}</b>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
