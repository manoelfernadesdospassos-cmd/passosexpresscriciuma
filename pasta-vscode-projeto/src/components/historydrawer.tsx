import React from 'react';
import { X, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { CalculatedOrder } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CalculatedOrder[];
  onSelectOrder: (order: CalculatedOrder) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h3 className="text-base font-bold text-white">Histórico de Pedidos</h3>
            <p className="text-xs text-slate-400">
              {orders.length} {orders.length === 1 ? 'cotação salva' : 'cotações salvas'} no navegador
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhuma cotação salva ainda. Faça um cálculo para salvar aqui!
            </div>
          ) : (
            orders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
              });

              return (
                <div
                  key={order.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-numbers font-bold text-slate-800">{order.id}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        {order.formaPagamento === 'cartao_maquininha'
                          ? '💳 Cartão'
                          : order.formaPagamento === 'dinheiro'
                          ? '💵 Dinheiro'
                          : order.formaPagamento === 'faturamento_empresa'
                          ? '🏢 Empresa'
                          : '⚡ Pix'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{dateStr}</span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-900 truncate">
                      {order.nome || 'Cliente sem nome'} · {order.telefone || 'Sem fone'}
                    </p>
                    <p className="text-slate-500 truncate text-[11px]">
                      De: {order.coleta}
                    </p>
                    <p className="text-slate-500 truncate text-[11px]">
                      Para: {order.entrega}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-slate-900 font-mono-numbers">
                        {order.valorFrete !== null ? `R$ ${order.valorFrete.toFixed(2).replace('.', ',')}` : 'Sob Consulta'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({order.distancia} km)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={order.urlWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center"
                        title="Abrir no WhatsApp"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => {
                          onSelectOrder(order);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Carregar <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar Histórico
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
