export interface PricingBracket {
  maxKm: number;
  label: string;
  price: number | null;
  estimatedMinutes?: string;
}

export type FormaPagamento = 'pix' | 'cartao_maquininha' | 'dinheiro' | 'faturamento_empresa';

export interface DeliveryFormData {
  nome: string;
  telefone: string;
  coleta: string;
  coletaNumero?: string;
  coletaBairro?: string;
  coletaCep?: string;
  entrega: string;
  entregaNumero?: string;
  entregaBairro?: string;
  entregaCep?: string;
  tipo: string;
  observacao: string;
  distancia: number;
  paradasExtras?: number;
  retorno?: boolean;
  formaPagamento: FormaPagamento;
  trocoPara?: string;
}

export interface CalculatedOrder extends DeliveryFormData {
  id: string;
  createdAt: string;
  faixaKm: string;
  valorFrete: number | null;
  valorTotal: number | null;
  mensagemFormatada: string;
  urlWhatsApp: string;
  status: 'calculado' | 'enviado_whatsapp';
  pixPayload?: string;
  pixQrCodeUrl?: string;
}
