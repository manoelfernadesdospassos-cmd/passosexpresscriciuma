import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  Printer,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Zap,
  CreditCard,
  Banknote,
  Building2
} from 'lucide-react';
import { CalculatedOrder } from '../types';
import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_PHONE } from '../constants';
import { getPaymentMethodLabel } from '../utils/pricing';

interface ResultCardProps {
  order: CalculatedOrder | null;
  onOpenQr: () => void;
  onOpenReceipt: () => void;
  onOpenPix: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  order,
  onOpenQr,
  onOpenReceipt,
  onOpenPix
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!order) {
    return (
      <div
        id="resultado"
        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-slate-200/70 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-700">Aguardando Cálculo</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Preencha o formulário ao lado e clique em &quot;Calcular & Abrir WhatsApp&quot; para gerar sua cotação oficial.
        </p>
      </div>
    );
  }

  const { valorFrete, faixaKm, urlWhatsApp, mensagemFormatada, distancia } = order;
  const isOverDistance = valorFrete === null;
  const valorFormatado = valorFrete !== null ? valorFrete.toFixed(2).replace('.', ',') : null;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(mensagemFormatada);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(urlWhatsApp);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const urlConsultaCentral = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá, Passos Express! Tenho um pedido com distância superior a 20 km (${distancia} km) e gostaria de consultar o valor do frete especial.`
  )}`;

  return (
    <div
      id="resultado"
      className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Top Banner based on calculation condition */}
      {isOverDistance ? (
        <div className="p-6 bg-amber-50 border-b border-amber-200/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950">
                ⚠️ Distância superior a 20 km. Consulte a central.
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                Para trajetos com mais de 20 km ({distancia} km), o valor é negociado sob medida com condições especiais para você ou sua empresa.
              </p>
              <div className="mt-4">
                <a
                  href={urlConsultaCentral}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Negociar Frete com a Central no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-7 bg-emerald-50/70 border-b border-emerald-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-md">
                  {getPaymentMethodLabel(order.formaPagamento, order.trocoPara)}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>✅ Pedido Calculado com Sucesso!</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Distância de <span className="font-semibold">{distancia} km</span> classificada na faixa{' '}
                <span className="font-semibold text-slate-900">{faixaKm}</span>.
              </p>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-xs text-slate-600 font-bold uppercase">Valor da Entrega:</span>
                <span className="text-2xl font-black text-emerald-700 font-mono-numbers">
                  R$ {valorFormatado}
                </span>
              </div>
            </div>

            {/* Direct Actions: WhatsApp + PIX */}
            <div className="shrink-0 flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenPix}
                className="w-full px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-slate-700"
              >
                <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Pagar via PIX (QR Code Gerado)</span>
              </button>

              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#25d366',
                  color: 'white',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)'
                }}
                className="hover:brightness-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 text-xs"
              >
                <span>🚀 Enviar Pedido para o WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Preview Section */}
      <div className="p-6 bg-slate-50/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mensagem Pronta para Envio:
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar texto formatado"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copiedText ? 'Copiado!' : 'Copiar Texto'}
            </button>

            <button
              onClick={handleCopyLink}
              className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar link wa.me direto"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link'}
            </button>
          </div>
        </div>

        {/* Realistic WhatsApp Chat Bubble */}
        <div className="bg-[#e5ddd5] dark:bg-[#121b22] p-4 rounded-xl border border-slate-300 shadow-inner">
          <div className="bg-white dark:bg-[#1f2c34] text-slate-900 dark:text-slate-100 p-4 rounded-lg rounded-tl-none shadow-sm max-w-xl text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap select-all border border-slate-200/60">
            {mensagemFormatada}
          </div>
        </div>

        {/* Additional Tools Bar (QR Code & Printable Receipt) */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-xs text-slate-500">
            ID do Pedido: <span className="font-mono-numbers font-semibold text-slate-700">{order.id}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPix}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              Pagar com PIX
            </button>

            <button
              onClick={onOpenQr}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              QR Code do Pedido
            </button>

            <button
              onClick={onOpenReceipt}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Imprimir Ordem / Recibo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
