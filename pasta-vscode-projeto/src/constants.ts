import { PricingBracket } from './types';

export const DEFAULT_WHATSAPP_NUMBER = '5548991377771';
export const DISPLAY_WHATSAPP_PHONE = '(48) 99137-7771';
export const COMPANY_NAME = 'PASSOS EXPRESS';

// Configurações do Pix Passos Express
export const PIX_CHAVE_PADRAO = '48991377771';
export const PIX_BENEFICIARIO = 'PASSOS EXPRESS';
export const PIX_CIDADE = 'CRICIUMA';
export const PIX_DESCRICAO_PADRAO = 'Frete Carro Passos Express';

export interface PaymentMethodOption {
  id: 'pix' | 'cartao_maquininha' | 'dinheiro' | 'faturamento_empresa';
  title: string;
  badge?: string;
  description: string;
  icon: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'pix',
    title: 'PIX Instantâneo',
    badge: 'Recomendado · QR Code & Copia e Cola',
    description: 'Chave e QR Code gerados na hora para pagar pelo seu banco favorito.',
    icon: '⚡'
  },
  {
    id: 'cartao_maquininha',
    title: 'Cartão na Entrega',
    badge: 'Crédito ou Débito',
    description: 'O motorista leva a maquininha física até o endereço.',
    icon: '💳'
  },
  {
    id: 'dinheiro',
    title: 'Dinheiro em Espécie',
    badge: 'No local',
    description: 'Pagamento em espécie na coleta ou na entrega (com troco se precisar).',
    icon: '💵'
  },
  {
    id: 'faturamento_empresa',
    title: 'Faturamento Empresa',
    badge: 'Convênio PJ',
    description: 'Fechamento semanal/quinzenal para lojas e comércios parceiros.',
    icon: '🏢'
  }
];

export const PRICING_TIERS: PricingBracket[] = [
  { maxKm: 3, label: 'Até 3 km', price: 12.00, estimatedMinutes: '15 - 25 min' },
  { maxKm: 5, label: '3 a 5 km', price: 15.00, estimatedMinutes: '20 - 35 min' },
  { maxKm: 8, label: '5 a 8 km', price: 20.00, estimatedMinutes: '30 - 45 min' },
  { maxKm: 12, label: '8 a 12 km', price: 25.00, estimatedMinutes: '40 - 55 min' },
  { maxKm: 15, label: '12 a 15 km', price: 30.00, estimatedMinutes: '50 - 70 min' },
  { maxKm: 20, label: '15 a 20 km', price: 40.00, estimatedMinutes: '60 - 90 min' },
  { maxKm: Infinity, label: 'Acima de 20 km', price: null, estimatedMinutes: 'Sob consulta' }
];

export const TIPO_VEICULO = 'Carro / Automóvel';

export const DELIVERY_TYPES = [
  'Caixas e Volumes Maiores (Porta-Malas)',
  'Compras de Supermercado / Atacado',
  'Peças Automotivas / Equipamentos',
  'Bolos, Confeitaria & Alimentos (Climatizado)',
  'Eletrônicos & Cargas Frágeis',
  'Documentos & Malotes de Contratos',
  'Medicamentos & Farmácia',
  'Outros Volumes (Especificar na observação)'
];

export const REGIAO_NOME = 'Criciúma & Região Carbonífera';

export const POPULAR_ROUTES = [
  {
    nome: 'Centro → Próspera / Nações Shopping (Criciúma)',
    coleta: 'Praça Nereu Ramos, Centro, Criciúma - SC',
    entrega: 'Nações Shopping, Av. Jorge Elias De Lucca, 765 - Próspera, Criciúma',
    distancia: 3.8,
    tipo: 'Documentos / Envelopes'
  },
  {
    nome: 'Centro → Pinheirinho / UNESC (Criciúma)',
    coleta: 'Rua Henrique Lage, Centro, Criciúma - SC',
    entrega: 'Av. Universitária, 1105 - Universitário / Pinheirinho, Criciúma',
    distancia: 4.5,
    tipo: 'Encomenda Pequena / Caixa'
  },
  {
    nome: 'Centro → Rio Maina (Criciúma)',
    coleta: 'Rua Coronel Pedro Benedet, Centro, Criciúma - SC',
    entrega: 'Av. dos Imigrantes, Rio Maina, Criciúma - SC',
    distancia: 7.2,
    tipo: 'Delivery de Alimentos / Restaurante'
  },
  {
    nome: 'Criciúma (Centro) → Içara (Centro)',
    coleta: 'Av. Centenário, Centro, Criciúma - SC',
    entrega: 'Rua Altamiro Guimarães, Centro, Içara - SC',
    distancia: 10.8,
    tipo: 'Peças Automotivas / E-commerce'
  },
  {
    nome: 'Criciúma (Centro) → Forquilhinha (Centro)',
    coleta: 'Praça Nereu Ramos, Centro, Criciúma - SC',
    entrega: 'Av. 25 de Julho, Centro, Forquilhinha - SC',
    distancia: 14.6,
    tipo: 'Documentos / Envelopes'
  },
  {
    nome: 'Criciúma (Centro) → Nova Veneza (Centro)',
    coleta: 'Rua Álvaro Catão, Criciúma - SC',
    entrega: 'Rua Cônego Miguel Giacca, Centro, Nova Veneza - SC',
    distancia: 16.8,
    tipo: 'Encomenda Pequena / Caixa'
  },
  {
    nome: 'Criciúma (Centro) → Balneário Rincão',
    coleta: 'Av. Centenário, Próspera, Criciúma - SC',
    entrega: 'Av. Leoberto Leal, Centro, Balneário Rincão - SC',
    distancia: 26.5,
    tipo: 'Outro (Especificar na observação)'
  }
];

export const BAIRROS_CRICIUMA = [
  'Centro',
  'Próspera',
  'Pinheirinho',
  'Rio Maina',
  'Michel',
  'Pio Corrêa',
  'Santa Bárbara',
  'São Luiz',
  'Cruzeiro do Sul',
  'Quarta Linha',
  'São Simão',
  'Mina do Mato',
  'Universitário (UNESC)',
  'Ceará',
  'Operária Nova',
  'Vila Rica'
];

export const CIDADES_REGIAO = [
  'Criciúma',
  'Içara',
  'Forquilhinha',
  'Nova Veneza',
  'Cocal do Sul',
  'Siderópolis',
  'Balneário Rincão',
  'Morro da Fumaça',
  'Treviso',
  'Maracajá'
];
