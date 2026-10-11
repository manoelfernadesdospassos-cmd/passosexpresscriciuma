import React from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { COMPANY_NAME, DISPLAY_WHATSAPP_PHONE } from '../constants';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Política de Privacidade &amp; Termos de Uso
              </h3>
              <p className="text-xs text-slate-400">
                Conformidade com a LGPD e Diretrizes da Google Play Store
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              O aplicativo <strong>{COMPANY_NAME}</strong> não comercializa nem compartilha dados pessoais com terceiros.
            </span>
          </div>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Coleta e Uso de Informações</h4>
            <p>
              Os dados informados no formulário (nome, telefone, endereço de coleta e entrega) são utilizados única e exclusivamente para calcular a distância e valor do frete e formatar a mensagem enviada pelo próprio usuário diretamente para a central de atendimento no WhatsApp.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. Geolocalização e Rotas</h4>
            <p>
              O aplicativo utiliza serviços de mapa e roteamento público (OpenStreetMap / OSRM) para determinar a quilometragem entre os endereços de coleta e entrega digitados. Não rastreamos a localização em segundo plano do usuário nem armazenamos coordenadas sigilosas.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Armazenamento Local</h4>
            <p>
              O histórico de pedidos é armazenado localmente no próprio dispositivo do usuário (via LocalStorage do navegador) para facilitar a repetição de rotas frequentes. Esse histórico pode ser apagado a qualquer momento com um clique em &quot;Limpar Histórico&quot;.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Segurança e Contato</h4>
            <p>
              Para qualquer dúvida sobre a privacidade dos seus dados ou sobre o serviço de entregas de carro em Criciúma e região, entre em contato com nossa central pelo WhatsApp: <strong>{DISPLAY_WHATSAPP_PHONE}</strong>.
            </p>
          </section>
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
