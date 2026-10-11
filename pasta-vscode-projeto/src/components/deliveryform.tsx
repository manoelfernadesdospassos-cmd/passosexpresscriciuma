import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Package,
  Phone,
  User,
  FileText,
  Gauge,
  Sparkles,
  Search,
  CheckCircle2,
  CreditCard,
  Banknote,
  Building2,
  Zap,
  DollarSign
} from 'lucide-react';
import { DELIVERY_TYPES, POPULAR_ROUTES, PAYMENT_METHODS, DISPLAY_WHATSAPP_PHONE } from '../constants';
import { DeliveryFormData, FormaPagamento } from '../types';
import { formatPhone } from '../utils/pricing';
import { fetchCepAddress, estimateDistanceBetweenAddresses } from '../utils/address';

interface DeliveryFormProps {
  formData: DeliveryFormData;
  setFormData: React.Dispatch<React.SetStateAction<DeliveryFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  calculatedPrice: number | null;
  faixaKm: string;
  onRecalculateRoute?: () => void;
  isCalculatingRoute?: boolean;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  calculatedPrice,
  faixaKm,
  onRecalculateRoute,
  isCalculatingRoute
}) => {
  const [cepColetaInput, setCepColetaInput] = useState('');
  const [cepEntregaInput, setCepEntregaInput] = useState('');
  const [cepLoading, setCepLoading] = useState<'coleta' | 'entrega' | null>(null);
  const [quickRouteSuccess, setQuickRouteSuccess] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setFormData((prev) => ({ ...prev, telefone: formatPhone(raw) }));
  };

  const handleCepSearch = async (tipo: 'coleta' | 'entrega') => {
    const cep = tipo === 'coleta' ? cepColetaInput : cepEntregaInput;
    if (!cep) return;
    setCepLoading(tipo);
    const result = await fetchCepAddress(cep);
    setCepLoading(null);

    if (result) {
      const fullAddress = `${result.logradouro}, ${result.bairro} - ${result.localidade}/${result.uf}`;
      if (tipo === 'coleta') {
        setFormData((prev) => {
          const next = { ...prev, coleta: fullAddress };
          const estimated = estimateDistanceBetweenAddresses(next.coleta, next.entrega);
          return { ...next, distancia: estimated };
        });
      } else {
        setFormData((prev) => {
          const next = { ...prev, entrega: fullAddress };
          const estimated = estimateDistanceBetweenAddresses(next.coleta, next.entrega);
          return { ...next, distancia: estimated };
        });
      }
    }
  };

  const applyPresetRoute = (route: typeof POPULAR_ROUTES[0]) => {
    setFormData((prev) => ({
      ...prev,
      coleta: route.coleta,
      entrega: route.entrega,
      distancia: route.distancia,
      tipo: route.tipo
    }));
    setQuickRouteSuccess(route.nome);
    setTimeout(() => setQuickRouteSuccess(null), 3000);
  };

  const quickDistances = [2.5, 4.8, 7.2, 11.5, 14.2, 18.0, 24.0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Header section of the form */}
      <div className="mb-6 pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">
              🚗 Veículo: Carro
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Porta-malas espaçoso &amp; 100% Protegido da Chuva
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Solicitar Entrega de Carro
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Calcule o valor do frete e envie o pedido diretamente para o WhatsApp da central Passos Express.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="text-slate-400">Atendimento:</span>
          <span className="text-emerald-700 font-semibold">Criciúma &amp; Região Carbonífera</span>
        </div>
      </div>

      {/* Quick routes presets */}
      <div className="mb-6 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Rotas Frequentes Rápidas (1 Clique para preencher):
          </span>
          {quickRouteSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rota carregada!
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ROUTES.map((route, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPresetRoute(route)}
              className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium transition-all text-left"
            >
              {route.nome} <span className="text-slate-400 text-[11px]">({route.distancia} km)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Delivery Form - id="formularioEntrega" */}
      <form id="formularioEntrega" onSubmit={onSubmit} className="space-y-6">
        {/* Row 1: Nome and Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="nome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nome do Solicitante / Empresa *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: Carlos Eduardo / Loja Alpha"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="telefone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Telefone / WhatsApp do Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(48) 99123-4567"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono-numbers focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Coleta and Entrega */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Ponto de Coleta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="coleta" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Endereço de Coleta (Ponto A) *
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Buscar CEP..."
                  value={cepColetaInput}
                  onChange={(e) => setCepColetaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCepSearch('coleta');
                    }
                  }}
                  className="w-24 text-[11px] px-1.5 py-0.5 border border-slate-200 rounded bg-slate-50 focus:bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleCepSearch('coleta')}
                  disabled={cepLoading === 'coleta'}
                  className="text-[11px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium flex items-center gap-0.5"
                  title="Consultar CEP nos Correios"
                >
                  <Search className="w-3 h-3" />
                  {cepLoading === 'coleta' ? '...' : 'CEP'}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="coleta"
                name="coleta"
                required
                value={formData.coleta}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => {
                    const next = { ...prev, coleta: val };
                    const estimated = estimateDistanceBetweenAddresses(val, next.entrega);
                    return { ...next, distancia: estimated };
                  });
                }}
                placeholder="Rua, número, bairro e cidade de coleta"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Ponto de Entrega */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="entrega" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Endereço de Entrega (Ponto B) *
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Buscar CEP..."
                  value={cepEntregaInput}
                  onChange={(e) => setCepEntregaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCepSearch('entrega');
                    }
                  }}
                  className="w-24 text-[11px] px-1.5 py-0.5 border border-slate-200 rounded bg-slate-50 focus:bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleCepSearch('entrega')}
                  disabled={cepLoading === 'entrega'}
                  className="text-[11px] px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium flex items-center gap-0.5"
                  title="Consultar CEP nos Correios"
                >
                  <Search className="w-3 h-3" />
                  {cepLoading === 'entrega' ? '...' : 'CEP'}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                <Navigation className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="entrega"
                name="entrega"
                required
                value={formData.entrega}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => {
                    const next = { ...prev, entrega: val };
                    const estimated = estimateDistanceBetweenAddresses(next.coleta, val);
                    return { ...next, distancia: estimated };
                  });
                }}
                placeholder="Rua, número, bairro e cidade de entrega"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* GPS auto-route button below addresses */}
        {onRecalculateRoute && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Quer calcular a distância exata pelas ruas com GPS de Criciúma?
              </span>
            </div>
            <button
              type="button"
              onClick={onRecalculateRoute}
              disabled={isCalculatingRoute || !formData.coleta || !formData.entrega}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isCalculatingRoute ? 'Roteando...' : 'Calcular Rota GPS Agora'}</span>
            </button>
          </div>
        )}

        {/* Row 3: Distância Selector & Sliders */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <label htmlFor="distanciaInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-600" />
                Distância do Percurso (km)
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Ajuste manualmente ou selecione um atalho. Faixa calculada:{' '}
                <span className="font-semibold text-slate-900">{faixaKm}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-28">
                <input
                  type="number"
                  id="distanciaInput"
                  min="0.5"
                  max="50"
                  step="0.1"
                  value={formData.distancia}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0.1;
                    setFormData((prev) => ({ ...prev, distancia: Number(val.toFixed(1)) }));
                  }}
                  className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 font-mono-numbers text-right focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  km
                </span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.1"
              value={formData.distancia}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData((prev) => ({ ...prev, distancia: Number(val.toFixed(1)) }));
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono-numbers">
              <span>0.5 km (Até 3)</span>
              <span>5 km</span>
              <span>8 km</span>
              <span>12 km</span>
              <span>15 km</span>
              <span>20 km</span>
              <span>25+ km</span>
            </div>
          </div>

          {/* Quick distance buttons */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Atalhos:</span>
            {quickDistances.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, distancia: km }))}
                className={`text-xs px-2.5 py-1 rounded-md font-mono-numbers transition-all ${
                  formData.distancia === km
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Tipo de Encomenda and Observações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label htmlFor="tipo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo da Encomenda *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Package className="w-4 h-4" />
              </div>
              <select
                id="tipo"
                name="tipo"
                required
                value={formData.tipo}
                onChange={(e) => setFormData((prev) => ({ ...prev, tipo: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
              >
                {DELIVERY_TYPES.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="observacao" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Instruções / Observações
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="observacao"
                name="observacao"
                value={formData.observacao}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacao: e.target.value }))}
                placeholder="Ex: Entregar para Amanda na recepção, 3º andar"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 5: Formas de Pagamento & PIX Gerado */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Forma de Pagamento *</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
              ⚡ PIX com QR Code dinâmico gerado na hora
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = formData.formaPagamento === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      formaPagamento: method.id as FormaPagamento
                    }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{method.icon}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {method.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {method.description}
                    </div>
                  </div>

                  {method.badge && (
                    <div className="mt-2 pt-1 border-t border-slate-200/60">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {method.badge}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Conditional details based on selected payment method */}
          {formData.formaPagamento === 'pix' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                  ⚡
                </div>
                <div>
                  <span className="font-bold text-emerald-900 block">
                    PIX Automático Ativado (Chave Celular: {DISPLAY_WHATSAPP_PHONE})
                  </span>
                  <span className="text-emerald-800 text-[11px]">
                    Ao calcular, geramos na tela o <b>QR Code Pix</b> e o código <b>Pix Copia e Cola</b> com o valor exato para você escanear ou copiar.
                  </span>
                </div>
              </div>
            </div>
          )}

          {formData.formaPagamento === 'dinheiro' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs animate-fade-in">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Banknote className="w-4 h-4 text-amber-600" />
                <span>Pagamento em Espécie</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor="troco" className="text-slate-600 text-xs shrink-0">
                  Precisa de troco? Se sim, para quanto?
                </label>
                <div className="relative flex-1 max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    id="troco"
                    value={formData.trocoPara || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, trocoPara: e.target.value }))}
                    placeholder="Ex: R$ 50,00 ou Não preciso"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.formaPagamento === 'cartao_maquininha' && (
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center gap-2.5 animate-fade-in">
              <CreditCard className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <b>Maquininha de Cartão:</b> O motorista levará a maquininha sem fio no carro para aceitar débito, crédito ou aproximação (NFC) no endereço.
              </span>
            </div>
          )}

          {formData.formaPagamento === 'faturamento_empresa' && (
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-center gap-2.5 animate-fade-in">
              <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span>
                <b>Convênio Empresarial:</b> Faturamento fechado por relatório para empresas e comércios parceiros de Criciúma e região.
              </span>
            </div>
          )}
        </div>

        {/* Submit Bar with live quick summary */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">Estimativa em tempo real:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono-numbers">
                  {calculatedPrice !== null ? `R$ ${calculatedPrice.toFixed(2).replace('.', ',')}` : 'Sob Consulta'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({formData.distancia} km · {faixaKm})
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-extrabold rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 text-base transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Calcular & Abrir WhatsApp</span>
            <span className="text-lg">🚀</span>
          </button>
        </div>
      </form>
    </div>
  );
};
