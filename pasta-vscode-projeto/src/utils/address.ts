export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchCepAddress(cep: string): Promise<ViaCepResponse | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) return null;
    const data: ViaCepResponse = await response.json();
    if (data.erro) return null;
    return data;
  } catch (error) {
    console.error('Erro ao consultar CEP:', error);
    return null;
  }
}

/**
 * Estimativa inteligente de distância baseada em bairros e cidades de Criciúma e região
 * (Sul Catarinense / Região Carbonífera)
 */
export function estimateDistanceBetweenAddresses(coleta: string, entrega: string): number {
  if (!coleta || !entrega) return 3.8;

  const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const c = normalize(coleta);
  const e = normalize(entrega);

  // Se forem o mesmo bairro em Criciúma
  if (c === e) return 1.5;

  const isCentroC = c.includes('centro') && (c.includes('criciuma') || (!c.includes('icara') && !c.includes('forquilhinha')));
  const isCentroE = e.includes('centro') && (e.includes('criciuma') || (!e.includes('icara') && !e.includes('forquilhinha')));

  // Centro de Criciúma para bairros principais
  if ((isCentroC && e.includes('prospera')) || (isCentroE && c.includes('prospera'))) return 3.8;
  if ((isCentroC && e.includes('nacoes shopping')) || (isCentroE && c.includes('nacoes shopping'))) return 4.1;
  if ((isCentroC && e.includes('pinheirinho')) || (isCentroE && c.includes('pinheirinho'))) return 4.2;
  if ((isCentroC && e.includes('unesc')) || (isCentroE && c.includes('unesc'))) return 4.6;
  if ((isCentroC && e.includes('michel')) || (isCentroE && c.includes('michel'))) return 2.1;
  if ((isCentroC && e.includes('pio correa')) || (isCentroE && c.includes('pio correa'))) return 2.3;
  if ((isCentroC && e.includes('santa barbara')) || (isCentroE && c.includes('santa barbara'))) return 3.0;
  if ((isCentroC && e.includes('sao luiz')) || (isCentroE && c.includes('sao luiz'))) return 3.4;
  if ((isCentroC && e.includes('rio maina')) || (isCentroE && c.includes('rio maina'))) return 7.2;
  if ((isCentroC && e.includes('mina do mato')) || (isCentroE && c.includes('mina do mato'))) return 4.0;
  if ((isCentroC && e.includes('quarta linha')) || (isCentroE && c.includes('quarta linha'))) return 10.5;

  // Criciúma para cidades vizinhas
  if ((c.includes('criciuma') && e.includes('icara')) || (c.includes('icara') && e.includes('criciuma'))) return 10.8;
  if ((c.includes('criciuma') && e.includes('forquilhinha')) || (c.includes('forquilhinha') && e.includes('criciuma'))) return 14.6;
  if ((c.includes('criciuma') && e.includes('nova veneza')) || (c.includes('nova veneza') && e.includes('criciuma'))) return 16.8;
  if ((c.includes('criciuma') && e.includes('cocal do sul')) || (c.includes('cocal do sul') && e.includes('criciuma'))) return 13.5;
  if ((c.includes('criciuma') && e.includes('sideropolis')) || (c.includes('sideropolis') && e.includes('criciuma'))) return 15.2;
  if ((c.includes('criciuma') && e.includes('rincao')) || (c.includes('rincao') && e.includes('criciuma'))) return 26.5;
  if ((c.includes('criciuma') && e.includes('morro da fumaca')) || (c.includes('morro da fumaca') && e.includes('criciuma'))) return 18.2;

  // Entre cidades vizinhas
  if ((c.includes('icara') && e.includes('rincao')) || (c.includes('rincao') && e.includes('icara'))) return 16.5;
  if ((c.includes('forquilhinha') && e.includes('nova veneza')) || (c.includes('nova veneza') && e.includes('forquilhinha'))) return 12.0;

  // Cálculo determinístico para digitação livre
  let hash = 0;
  const combined = c + e;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const pseudoRandom = Math.abs(hash % 120) / 10 + 2.0;
  return Number(pseudoRandom.toFixed(1));
}
