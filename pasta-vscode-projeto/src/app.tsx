/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  TableProperties,
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Car,
  MessageCircle,
  Zap,
  FolderArchive
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DeliveryForm } from './components/DeliveryForm';
import { ResultCard } from './components/ResultCard';
import { RouteMap } from './components/RouteMap';
import { WhatsAppChatbot } from './components/WhatsAppChatbot';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { PricingTableModal } from './components/PricingTableModal';
import { QrCodeModal } from './components/QrCodeModal';
import { PixPaymentModal } from './components/PixPaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DownloadZipModal } from './components/DownloadZipModal';
import { DeliveryFormData, CalculatedOrder } from './types';
import { calculateFreight, processOrder } from './utils/pricing';
import {
  geocodeAddress,
  calculateRouteOSRM,
  RouteResult
} from './utils/geo';
import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_PHONE } from './constants';

export default function App() {
  // Estado do formulário inicializado em Criciúma - SC
  const [formData, setFormData] = useState<DeliveryFormData>({
    nome: '',
    telefone: '',
    coleta: 'Praça Nereu Ramos, Centro, Criciúma - SC',
    entrega: 'Nações Shopping, Av. Jorge Elias De Lucca, 765 - Próspera, Criciúma - SC',
    tipo: 'Caixas e Volumes Maiores (Porta-Malas)',
    observacao: '',
    distancia: 3.8,
    formaPagamento: 'pix',
    trocoPara: ''
  });

  // Estado do cálculo e da rota
  const [currentOrder, setCurrentOrder] = useState<CalculatedOrder | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Modais
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isDownloadZipModalOpen, setIsDownloadZipModalOpen] = useState(false);

  // Histórico em localStorage
  const [orderHistory, setOrderHistory] = useState<CalculatedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('passos_express_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (order: CalculatedOrder) => {
    setOrderHistory((prev) => {
      const next = [order, ...prev.filter((o) => o.id !== order.id)].slice(0, 30);
      try {
        localStorage.setItem('passos_express_orders', JSON.stringify(next));
      } catch (err) {
        console.error('Erro ao salvar histórico:', err);
      }
      return next;
    });
  };

  const clearHistory = () => {
    setOrderHistory([]);
    try {
      localStorage.removeItem('passos_express_orders');
    } catch (err) {
      console.error(err);
    }
  };

  // Cálculo de frete em tempo real para a distância atual
  const { valorFrete, faixaKm } = calculateFreight(formData.distancia);

  // Função para executar geocodificação e cálculo de rota pelas vias
  const handleCalculateRouteFromGeo = useCallback(async (coletaStr: string, entregaStr: string) => {
    if (!coletaStr || !entregaStr) return null;
    setIsGeocoding(true);
    setGeoError(null);

    try {
      const [coordA, coordB] = await Promise.all([
        geocodeAddress(coletaStr),
        geocodeAddress(entregaStr)
      ]);

      if (!coordA || !coordB) {
        const errorMsg = !coordA && !coordB
          ? 'Não foi possível encontrar as coordenadas para os dois endereços em Criciúma e região.'
          : !coordA
          ? 'Não foi possível encontrar o endereço de Coleta no mapa.'
          : 'Não foi possível encontrar o endereço de Entrega no mapa.';
        setGeoError(errorMsg);
        setIsGeocoding(false);
        return null;
      }

      // Calcula distância de trânsito via OSRM
      const route = await calculateRouteOSRM(coordA, coordB);
      setRouteResult(route);
      setFormData((prev) => ({ ...prev, distancia: route.distanciaKm }));
      setIsGeocoding(false);
      return route;
    } catch (err) {
      console.error('Erro ao calcular rota via geolocalização:', err);
      setGeoError('Ocorreu uma falha ao conectar com o serviço de mapas. Usando distância estimada.');
      setIsGeocoding(false);
      return null;
    }
  }, []);

  // Ao montar, inicializa rota padrão de Criciúma e escuta hashes de navegação
  useEffect(() => {
    handleCalculateRouteFromGeo(formData.coleta, formData.entrega);

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('privacidade') || hash.includes('termos') || hash.includes('politica')) {
        setIsPrivacyPolicyModalOpen(true);
      } else if (hash.includes('tabela') || hash.includes('precos') || hash.includes('valores')) {
        setIsPricingModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manipulador de submissão do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let finalDistancia = formData.distancia;
    const geoRoute = await handleCalculateRouteFromGeo(formData.coleta, formData.entrega);
    if (geoRoute) {
      finalDistancia = geoRoute.distanciaKm;
    }

    const orderData: DeliveryFormData = {
      ...formData,
      distancia: finalDistancia
    };

    const calculated = processOrder(orderData, DEFAULT_WHATSAPP_NUMBER);
    setCurrentOrder(calculated);
    saveToHistory(calculated);

    if (calculated.valorFrete !== null) {
      if (calculated.formaPagamento === 'pix') {
        setIsPixModalOpen(true);
      }
      window.open(calculated.urlWhatsApp, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* Top Bar seguindo o Top Bar Contract */}
      <Navbar
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenPix={() => {
          if (!currentOrder) {
            setCurrentOrder(processOrder(formData, DEFAULT_WHATSAPP_NUMBER));
          }
          setIsPixModalOpen(true);
        }}
        historyCount={orderHistory.length}
      />

      {/* Hero Strip de Apresentação */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-semibold text-emerald-400">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <Car className="w-3.5 h-3.5" />
                  Entregas Exclusivas de Carro
                </span>
                <span>·</span>
                <span>Criciúma, Içara, Forquilhinha, Nova Veneza &amp; Região</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
                Calculadora de Frete com GPS · Entregas de Carro
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300">
                Transporte com porta-malas espaçoso, 100% protegido contra chuva e seguro por automóvel em Criciúma e cidades vizinhas. Calcule a distância exata pelas ruas e envie o pedido no WhatsApp com 1 clique.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chamar no WhatsApp (48) 99137-7771</span>
              </a>

              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <TableProperties className="w-4 h-4 text-slate-300" />
                <span>Tabela de Preços</span>
              </button>

              <button
                onClick={() => {
                  if (!currentOrder) {
                    setCurrentOrder(processOrder(formData, DEFAULT_WHATSAPP_NUMBER));
                  }
                  setIsPixModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Pagar via PIX</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Status de Geolocalização / Alertas */}
        {isGeocoding && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-emerald-900 shadow-xs animate-fade-in">
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
            <div>
              <span className="font-bold">Calculando rota via satélite:</span> Consultando geocodificação e roteamento pelas ruas de Criciúma e região...
            </div>
          </div>
        )}

        {geoError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Aviso de Geolocalização:</span> {geoError}
            </div>
            <button
              onClick={() => handleCalculateRouteFromGeo(formData.coleta, formData.entrega)}
              className="px-2.5 py-1 bg-amber-200/70 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Grid de 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Coluna Esquerda: Formulário de Entrega (7 colunas no desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <DeliveryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              calculatedPrice={valorFrete}
              faixaKm={faixaKm}
              onRecalculateRoute={() => handleCalculateRouteFromGeo(formData.coleta, formData.entrega)}
              isCalculatingRoute={isGeocoding}
            />

            {/* Ações auxiliares de GPS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>
                  Rota Traçada de Carro:{' '}
                  <b className="text-slate-900 font-mono-numbers">{formData.distancia} km</b> ({faixaKm})
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCalculateRouteFromGeo(formData.coleta, formData.entrega)}
                disabled={isGeocoding}
                className="w-full sm:w-auto px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isGeocoding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recalculando...
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Forçar Recálculo GPS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coluna Direita: Mapa Interativo & Card de Resultado (5 colunas no desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mapa Interativo de Rota com Leaflet e OpenStreetMap */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Trajeto Visual no Mapa
                </span>
                {routeResult && (
                  <span className="text-slate-500 font-mono-numbers">
                    ~{routeResult.duracaoMinutos} min de percurso
                  </span>
                )}
              </div>
              <RouteMap
                routeResult={routeResult}
                coletaLabel={formData.coleta}
                entregaLabel={formData.entrega}
              />
            </div>

            {/* Card com o Resultado Oficial do Cálculo (id="resultado") */}
            <ResultCard
              order={currentOrder}
              onOpenQr={() => setIsQrModalOpen(true)}
              onOpenReceipt={() => setIsReceiptModalOpen(true)}
              onOpenPix={() => setIsPixModalOpen(true)}
            />

            {/* Card Informativo com Resumo de Tarifas Rápidas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Regras de Tarifação de Carro
                </span>
                <span className="text-slate-400 font-mono-numbers">Criciúma &amp; Região</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center justify-between">
                  <span>Até 3 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 12,00</b>
                </li>
                <li className="flex items-center justify-between">
                  <span>De 3 a 5 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 15,00</b>
                </li>
                <li className="flex items-center justify-between">
                  <span>De 5 a 8 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 20,00</b>
                </li>
                <li className="flex items-center justify-between">
                  <span>De 8 a 12 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 25,00</b>
                </li>
                <li className="flex items-center justify-between">
                  <span>De 12 a 15 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 30,00</b>
                </li>
                <li className="flex items-center justify-between">
                  <span>De 15 a 20 km:</span>
                  <b className="text-slate-900 font-mono-numbers">R$ 40,00</b>
                </li>
                <li className="flex items-center justify-between text-amber-700 font-semibold pt-1 border-t border-slate-100">
                  <span>Acima de 20 km:</span>
                  <span>Sob consulta</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simples e limpo */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PASSOS EXPRESS</span>
            <span>·</span>
            <span>Entregas de Carro · Criciúma e Região Carbonífera</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Tabela de Preços
            </button>
            <span>·</span>
            <button
              onClick={() => {
                if (!currentOrder) {
                  setCurrentOrder(processOrder(formData, DEFAULT_WHATSAPP_NUMBER));
                }
                setIsPixModalOpen(true);
              }}
              className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Pagar via PIX
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyPolicyModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Política de Privacidade
            </button>
            <span>·</span>
            <button
              onClick={() => setIsDownloadZipModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer flex items-center gap-1.5"
              title="Baixar pastas e arquivos do projeto compactados em ZIP"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Baixar Projeto (.ZIP)</span>
            </button>
            <span>·</span>
            <a
              href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold"
            >
              WhatsApp Central: {DISPLAY_WHATSAPP_PHONE}
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Chatbot 4.0 Floating Assistant */}
      <WhatsAppChatbot />

      {/* Modais Essenciais do Site */}
      <PricingTableModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentDistance={formData.distancia}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setIsPrivacyPolicyModalOpen(false)}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        order={currentOrder}
      />

      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        order={currentOrder}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={currentOrder}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        orders={orderHistory}
        onSelectOrder={(selected) => {
          setFormData({
            nome: selected.nome,
            telefone: selected.telefone,
            coleta: selected.coleta,
            entrega: selected.entrega,
            tipo: selected.tipo,
            observacao: selected.observacao,
            distancia: selected.distancia,
            formaPagamento: selected.formaPagamento || 'pix',
            trocoPara: selected.trocoPara || ''
          });
          setCurrentOrder(selected);
          handleCalculateRouteFromGeo(selected.coleta, selected.entrega);
        }}
        onClearHistory={clearHistory}
      />

      <DownloadZipModal
        isOpen={isDownloadZipModalOpen}
        onClose={() => setIsDownloadZipModalOpen(false)}
      />
    </div>
  );
}
