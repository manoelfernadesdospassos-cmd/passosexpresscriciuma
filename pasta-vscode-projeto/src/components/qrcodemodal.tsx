import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Check, Copy } from 'lucide-react';
import { CalculatedOrder } from '../types';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CalculatedOrder | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order && order.urlWhatsApp && isOpen) {
      QRCode.toDataURL(order.urlWhatsApp, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Erro ao gerar QRCode:', err));
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(order.urlWhatsApp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 flex flex-col items-center text-center shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
          <Smartphone className="w-5 h-5" />
        </div>

        <h3 className="text-base font-extrabold text-slate-900">
          Escanear para Enviar Pedido
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Aponte a câmera do seu celular para abrir a mensagem diretamente no WhatsApp.
        </p>

        {/* QR Code Canvas */}
        <div className="my-5 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code WhatsApp"
              className="w-56 h-56 rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-400">
              Gerando QR Code...
            </div>
          )}
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Link Copiado!' : 'Copiar Link do WhatsApp'}
          </button>

          <a
            href={order.urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            🚀 Abrir no WhatsApp Agora
          </a>
        </div>
      </div>
    </div>
  );
};
