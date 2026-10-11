import React from 'react';
import { X, Printer, Truck, Check } from 'lucide-react';
import { CalculatedOrder } from '../types';
import { DISPLAY_WHATSAPP_PHONE } from '../constants';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CalculatedOrder | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Actions bar (hidden in print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-700">Comprovante de Ordem de Serviço</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 font-sans print:p-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight leading-none">PASSOS EXPRESS</h2>
                <span className="text-[11px] text-slate-500 font-medium">Entregas de Carro · Criciúma e Região</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold font-mono-numbers text-slate-800">{order.id}</span>
              <p className="text-[11px] text-slate-500">{formattedDate}</p>
              <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                🚗 Carro
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Cliente / Solicitante:</span>
              <p className="font-bold text-slate-900 mt-0.5">{order.nome || 'Não informado'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">Telefone de Contato:</span>
              <p className="font-bold text-slate-900 mt-0.5 font-mono-numbers">{order.telefone || 'Não informado'}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-emerald-800 font-bold block uppercase text-[10px]">📍 Ponto de Coleta (Origem):</span>
              <p className="font-medium text-slate-900 mt-0.5">{order.coleta}</p>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-rose-800 font-bold block uppercase text-[10px]">🏁 Ponto de Entrega (Destino):</span>
              <p className="font-medium text-slate-900 mt-0.5">{order.entrega}</p>
            </div>
          </div>

          {/* Metrics, Payment & Price */}
          <div className="border-t border-b border-slate-200 py-3.5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500">Distância Calculada:</span>
                <p className="font-bold text-slate-900 font-mono-numbers">{order.distancia} km ({order.faixaKm})</p>
              </div>
              <div>
                <span className="text-slate-500">Tipo de Volume:</span>
                <p className="font-bold text-slate-900">{order.tipo}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Total do Frete:</span>
                <p className="text-lg font-black text-slate-900 font-mono-numbers">
                  {order.valorFrete !== null ? `R$ ${order.valorFrete.toFixed(2).replace('.', ',')}` : 'Sob Consulta'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg">
              <div>
                <span className="text-slate-500 block text-[11px]">Forma de Pagamento:</span>
                <span className="font-bold text-slate-900 text-xs">
                  {order.formaPagamento === 'pix'
                    ? `⚡ PIX (Chave: ${DISPLAY_WHATSAPP_PHONE} - Passos Express)`
                    : order.formaPagamento === 'cartao_maquininha'
                    ? '💳 Cartão de Crédito/Débito (Maquininha no local)'
                    : order.formaPagamento === 'dinheiro'
                    ? `💵 Dinheiro${order.trocoPara ? ` (Troco para ${order.trocoPara})` : ''}`
                    : '🏢 Faturamento / Convênio Empresa'}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                {order.formaPagamento === 'pix' ? 'PIX Instantâneo' : 'A Combinar na Entrega'}
              </span>
            </div>
          </div>

          {order.observacao && (
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
              <b>Obs:</b> {order.observacao}
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-6 text-[10px] text-slate-500 text-center">
            <div className="border-t border-slate-300 pt-1">
              Assinatura do Remetente (Coleta)
            </div>
            <div className="border-t border-slate-300 pt-1">
              Assinatura do Destinatário (Entrega)
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-slate-400 text-center pt-2">
            Central de Atendimento: {DISPLAY_WHATSAPP_PHONE} · Passos Express
          </div>
        </div>
      </div>
    </div>
  );
};
