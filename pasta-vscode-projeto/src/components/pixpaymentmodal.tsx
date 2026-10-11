import React, { useEffect, useState } from 'react';
import {
  X,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { CalculatedOrder } from '../types';
import { generatePixQrCode, generatePixPayload } from '../utils/pix';
import {
  PIX_CHAVE_PADRAO,
  DISPLAY_WHATSAPP_PHONE,
  PIX_BENEFICIARIO,
  PIX_CIDADE,
  DEFAULT_WHATSAPP_NUMBER
} from '../constants';
import { formatBRL } from '../utils/pricing';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CalculatedOrder | null;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedChave, setCopiedChave] = useState(false);
  const [pixPayload, setPixPayload] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !order) return;

    // Se já tem pixPayload no pedido ou gera novo
    let payload = order.pixPayload;
    if (!payload && order.valorFrete !== null) {
      payload = generatePixPayload({
        valor: order.valorFrete,
        txId: order.id.replace(/[^a-zA-Z0-9]/g, '')
      });
    }

    if (payload) {
      setPixPayload(payload);
      generatePixQrCode(payload)
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('Erro ao gerar QRCode Pix:', err));
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const valorFormatado = formatBRL(order.valorFrete);

  const handleCopyPayload = async () => {
    if (!pixPayload) return;
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar Pix Payload:', err);
    }
  };

  const handleCopyChave = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CHAVE_PADRAO);
      setCopiedChave(true);
      setTimeout(() => setCopiedChave(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar Chave:', err);
    }
  };

  const msgComprovante = encodeURIComponent(
    `Olá, Passos Express! Segue o comprovante do pagamento PIX de R$ ${valorFormatado} para o pedido #${order.id} (${order.coleta} → ${order.entrega}).`
  );
  const urlComprovante = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${msgComprovante}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                PIX Instantâneo Oficial
              </span>
              <span className="text-[11px] text-slate-400 font-mono-numbers">
                #{order.id}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Pagar Frete com PIX
            </h3>
          </div>
        </div>

        {/* Amount Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between mb-5 shadow-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Valor Total do Frete:</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono-numbers mt-0.5">
              R$ {valorFormatado}
            </div>
          </div>
          <div className="text-right text-xs text-slate-300">
            <span className="inline-block px-2.5 py-1 bg-slate-800 rounded-lg text-emerald-300 font-semibold text-[11px] border border-slate-700">
              {order.distancia} km · {order.faixaKm}
            </span>
          </div>
        </div>

        {/* QR Code Canvas */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center mb-5">
          <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200/80 mb-3">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR Code Pix do Pedido"
                className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl"
              />
            ) : (
              <div className="w-52 h-52 flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
                <QrCode className="w-8 h-8 animate-pulse text-emerald-600" />
                <span>Gerando QR Code Pix dinâmico...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Aponte a câmera do celular ou abra o leitor de QR Code no aplicativo do seu banco.
          </p>
        </div>

        {/* Copia e Cola Field */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Pix Copia e Cola (Código):</span>
              {copiedPayload && (
                <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Copiado com sucesso!
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={pixPayload}
                onClick={handleCopyPayload}
                className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:bg-white select-all truncate cursor-pointer"
                placeholder="Código Pix Copia e Cola"
              />
              <button
                type="button"
                onClick={handleCopyPayload}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                {copiedPayload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedPayload ? 'Copiado!' : 'Copiar Código'}
              </button>
            </div>
          </div>

          {/* Chave Direta */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                Chave Pix Direta (Telefone):
              </span>
              <span className="font-bold text-slate-900 font-mono-numbers text-sm">
                {DISPLAY_WHATSAPP_PHONE}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyChave}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedChave ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedChave ? 'Chave Copiada!' : 'Copiar Chave'}
            </button>
          </div>
        </div>

        {/* Favorecido info & Segurança */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-950 space-y-1 mb-5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dados Oficiais de Pagamento Seguro:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div>
              <span className="text-emerald-700 block">Beneficiário:</span>
              <b className="text-emerald-950">{PIX_BENEFICIARIO}</b>
            </div>
            <div>
              <span className="text-emerald-700 block">Cidade / Região:</span>
              <b className="text-emerald-950">{PIX_CIDADE} - SC</b>
            </div>
          </div>
        </div>

        {/* Passo a passo simples */}
        <div className="mb-5 text-slate-600 text-xs space-y-1.5">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
            Como pagar em 3 passos simples:
          </span>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
            <li>Abra o aplicativo do seu banco (Nubank, Itaú, BB, Inter, Mercado Pago, etc.);</li>
            <li>Selecione a opção <b>PIX</b> e escolha <b>Pix Copia e Cola</b> ou <b>Ler QR Code</b>;</li>
            <li>Cole o código copiado ou aponte a câmera e confirme a transferência.</li>
          </ol>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-1">
          <a
            href={urlComprovante}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Enviar Comprovante no WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Voltar para o Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
