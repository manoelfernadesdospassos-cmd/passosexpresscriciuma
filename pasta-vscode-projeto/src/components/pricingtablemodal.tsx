import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PRICING_TIERS } from '../constants';

interface PricingTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDistance?: number;
}

export const PricingTableModal: React.FC<PricingTableModalProps> = ({
  isOpen,
  onClose,
  currentDistance
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Tabela Oficial de Fretes — PASSOS EXPRESS
              </h3>
              <p className="text-xs text-slate-400">
                Tarifas de entregas expressas por quilometragem
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/80 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Faixa de Distância</th>
                  <th className="py-3 px-4">Tempo Médio</th>
                  <th className="py-3 px-4 text-right">Valor do Frete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRICING_TIERS.map((tier, idx) => {
                  const isCurrent =
                    currentDistance !== undefined &&
                    ((idx === 0 && currentDistance <= 3) ||
                      (idx === 1 && currentDistance > 3 && currentDistance <= 5) ||
                      (idx === 2 && currentDistance > 5 && currentDistance <= 8) ||
                      (idx === 3 && currentDistance > 8 && currentDistance <= 12) ||
                      (idx === 4 && currentDistance > 12 && currentDistance <= 15) ||
                      (idx === 5 && currentDistance > 15 && currentDistance <= 20) ||
                      (idx === 6 && currentDistance > 20));

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50/80 font-bold text-emerald-950'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                        <span>{tier.label}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono-numbers text-xs">
                        {tier.estimatedMinutes}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono-numbers text-base">
                        {tier.price !== null ? (
                          <span className={isCurrent ? 'text-emerald-700' : 'text-slate-900'}>
                            R$ {tier.price.toFixed(2).replace('.', ',')}
                          </span>
                        ) : (
                          <span className="text-amber-700 text-xs font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            Sob Consulta
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Guarantee / Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-800">Porta-Malas Amplo (Até 300kg):</b>
                <p className="mt-0.5 text-slate-500">Transporte seguro para caixas grandes, compras de atacado, peças e múltiplos pacotes.</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-800">100% Protegido da Chuva &amp; Climatizado:</b>
                <p className="mt-0.5 text-slate-500">Veículo fechado e com ar-condicionado, ideal para alimentos, confeitaria, eletrônicos e documentos.</p>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento Aceitas */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Zap className="w-4 h-4 text-emerald-600 fill-current" />
              <span>Formas de Pagamento Aceitas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
                <b className="text-emerald-950 block">⚡ PIX Instantâneo</b>
                <span className="text-slate-500">QR Code na hora e Copia e Cola</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <b className="text-slate-900 block">💳 Cartão no Local</b>
                <span className="text-slate-500">Crédito, débito e aproximação</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <b className="text-slate-900 block">💵 Dinheiro Vivo</b>
                <span className="text-slate-500">Com opção de troco</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <b className="text-slate-900 block">🏢 Convênio PJ</b>
                <span className="text-slate-500">Faturamento quinzenal para empresas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
