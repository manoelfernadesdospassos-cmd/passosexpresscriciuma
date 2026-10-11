import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_PHONE, PIX_CHAVE_PADRAO } from '../constants';
import { DeliveryFormData, CalculatedOrder } from '../types';
import { generatePixPayload } from './pix';

export interface CalculationResult {
  valorFrete: number | null;
  faixaKm: string;
}

/**
 * Exact pricing logic matching user specification:
 * - distancia <= 3: R$ 12.00, "Até 3 km"
 * - distancia <= 5: R$ 15.00, "3 a 5 km"
 * - distancia <= 8: R$ 20.00, "5 a 8 km"
 * - distancia <= 12: R$ 25.00, "8 a 12 km"
 * - distancia <= 15: R$ 30.00, "12 a 15 km"
 * - distancia <= 20: R$ 40.00, "15 a 20 km"
 * - else: null, "Acima de 20 km"
 */
export function calculateFreight(distancia: number): CalculationResult {
  let valorFrete: number | null;
  let faixaKm: string;

  if (distancia <= 3) {
    valorFrete = 12.00;
    faixaKm = 'Até 3 km';
  } else if (distancia <= 5) {
    valorFrete = 15.00;
    faixaKm = '3 a 5 km';
  } else if (distancia <= 8) {
    valorFrete = 20.00;
    faixaKm = '5 a 8 km';
  } else if (distancia <= 12) {
    valorFrete = 25.00;
    faixaKm = '8 a 12 km';
  } else if (distancia <= 15) {
    valorFrete = 30.00;
    faixaKm = '12 a 15 km';
  } else if (distancia <= 20) {
    valorFrete = 40.00;
    faixaKm = '15 a 20 km';
  } else {
    valorFrete = null;
    faixaKm = 'Acima de 20 km';
  }

  return { valorFrete, faixaKm };
}

export function formatBRL(valor: number | null): string {
  if (valor === null || valor === undefined) return 'Sob consulta';
  return valor.toFixed(2).replace('.', ',');
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function getPaymentMethodLabel(forma: DeliveryFormData['formaPagamento'], troco?: string): string {
  switch (forma) {
    case 'pix':
      return `⚡ PIX (Chave Celular: ${DISPLAY_WHATSAPP_PHONE})`;
    case 'cartao_maquininha':
      return '💳 Cartão de Crédito/Débito (Maquininha no local)';
    case 'dinheiro':
      return `💵 Dinheiro${troco ? ` (Troco para: ${troco})` : ' (Sem necessidade de troco)'}`;
    case 'faturamento_empresa':
      return '🏢 Faturamento / Convênio Empresa';
    default:
      return '⚡ PIX Instantâneo';
  }
}

export function buildWhatsAppMessage(
  data: DeliveryFormData,
  distancia: number,
  faixaKm: string,
  valorFormatado: string,
  pixPayload?: string
): string {
  const paymentText = getPaymentMethodLabel(data.formaPagamento, data.trocoPara);
  let pixBonus = '';
  if (data.formaPagamento === 'pix') {
    pixBonus = `\n🔑 *Chave Pix (Telefone):* ${PIX_CHAVE_PADRAO}\n👤 *Favorecido:* Passos Express (Criciúma - SC)`;
    if (pixPayload) {
      pixBonus += `\n📋 *Pix Copia e Cola:* \n\`${pixPayload}\``;
    }
  }

  return (
    `📦 *NOVO PEDIDO — PASSOS EXPRESS*\n\n` +
    `🚗 *Veículo:* Entrega de Carro (Automóvel)\n` +
    `👤 *Nome:* ${data.nome || 'Não informado'}\n` +
    `📱 *Telefone:* ${data.telefone || 'Não informado'}\n` +
    `📍 *Coleta:* ${data.coleta || 'Não informada'}\n` +
    `🏁 *Entrega:* ${data.entrega || 'Não informada'}\n` +
    `📏 *Distância:* ${distancia} km (${faixaKm})\n` +
    `💰 *Valor:* R$ ${valorFormatado}\n` +
    `💳 *Pagamento:* ${paymentText}${pixBonus}\n` +
    `📦 *Tipo:* ${data.tipo || 'Geral'}\n` +
    `📝 *Obs:* ${data.observacao ? data.observacao.trim() : 'Nenhuma'}`
  );
}

export function buildWhatsAppUrl(
  mensagemTexto: string,
  numeroWhatsApp: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const mensagemCodificada = encodeURIComponent(mensagemTexto);
  return `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
}

export function processOrder(
  data: DeliveryFormData,
  numeroWhatsApp: string = DEFAULT_WHATSAPP_NUMBER
): CalculatedOrder {
  const id = `PED-${Date.now().toString(36).toUpperCase()}`;
  const { valorFrete, faixaKm } = calculateFreight(data.distancia);
  const valorFormatado = valorFrete !== null ? formatBRL(valorFrete) : 'Sob consulta';
  
  let pixPayload: string | undefined;
  if (valorFrete !== null) {
    try {
      pixPayload = generatePixPayload({
        valor: valorFrete,
        txId: id.replace(/[^a-zA-Z0-9]/g, '')
      });
    } catch (e) {
      console.error('Erro ao gerar payload Pix:', e);
    }
  }

  const mensagemTexto = buildWhatsAppMessage(data, data.distancia, faixaKm, valorFormatado, pixPayload);
  const urlWhatsApp = buildWhatsAppUrl(mensagemTexto, numeroWhatsApp);

  return {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    faixaKm,
    valorFrete,
    valorTotal: valorFrete,
    mensagemFormatada: mensagemTexto,
    urlWhatsApp,
    pixPayload,
    status: 'calculado'
  };
}
