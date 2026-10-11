export interface GeoCoordinate {
  lat: number;
  lon: number;
  displayName?: string;
}

export interface RouteResult {
  distanciaKm: number;
  duracaoMinutos: number;
  polylineCoords?: [number, number][];
  origemCoord: GeoCoordinate;
  destinoCoord: GeoCoordinate;
  metodo: 'osrm_driving' | 'haversine_fallback';
}

/**
 * Calcula distância euclidiana/esférica (fórmula de Haversine)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;
  // Fator urbano médio de curvas e vias de trânsito (~25% a 30% maior que linha reta)
  return straightDistance * 1.28;
}

/**
 * Geocodifica um endereço usando a API pública OpenStreetMap Nominatim com foco em Criciúma e região
 */
export async function geocodeAddress(address: string): Promise<GeoCoordinate | null> {
  if (!address || address.trim().length < 3) return null;

  try {
    let queryText = address.trim();
    // Se não informou a cidade ou estado, adiciona Criciúma, SC para evitar ambiguidades com outras cidades do Brasil
    const lower = queryText.toLowerCase();
    const hasCity = lower.includes('criciuma') || lower.includes('icara') || lower.includes('forquilhinha') || lower.includes('nova veneza') || lower.includes('rincao') || lower.includes('cocal do sul') || lower.includes('sideropolis');
    if (!hasCity) {
      queryText = `${queryText}, Criciúma - SC`;
    }

    const query = encodeURIComponent(queryText);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=br`;
    
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'pt-BR,pt;q=0.9',
      }
    });

    if (!res.ok) {
      const resGlobal = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      if (!resGlobal.ok) return null;
      const dataGlobal = await resGlobal.json();
      if (!dataGlobal || dataGlobal.length === 0) return null;
      return {
        lat: parseFloat(dataGlobal[0].lat),
        lon: parseFloat(dataGlobal[0].lon),
        displayName: dataGlobal[0].display_name
      };
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      // Tenta pesquisa alternativa com o endereço original caso a inclusão de Criciúma não tenha dado resultado exato
      if (!hasCity) {
        const resFallback = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`);
        if (resFallback.ok) {
          const dataFallback = await resFallback.json();
          if (dataFallback && dataFallback.length > 0) {
            return {
              lat: parseFloat(dataFallback[0].lat),
              lon: parseFloat(dataFallback[0].lon),
              displayName: dataFallback[0].display_name
            };
          }
        }
      }
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      displayName: data[0].display_name
    };
  } catch (err) {
    console.warn('Erro ao consultar Nominatim:', err);
    return null;
  }
}

/**
 * Calcula rota real de trânsito utilizando OSRM (Open Source Routing Machine)
 */
export async function calculateRouteOSRM(
  origem: GeoCoordinate,
  destino: GeoCoordinate
): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origem.lon},${origem.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanciaKm = Number((route.distance / 1000).toFixed(1));
        const duracaoMinutos = Math.round(route.duration / 60);
        
        // Coordenadas para desenhar linha no mapa [lat, lon]
        const polylineCoords: [number, number][] = route.geometry.coordinates.map(
          ([lon, lat]: [number, number]) => [lat, lon]
        );

        return {
          distanciaKm,
          duracaoMinutos,
          polylineCoords,
          origemCoord: origem,
          destinoCoord: destino,
          metodo: 'osrm_driving'
        };
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar OSRM, usando fallback Haversine:', err);
  }

  // Fallback se OSRM estiver temporariamente indisponível
  const fallbackKm = Number(
    calculateHaversineDistance(origem.lat, origem.lon, destino.lat, destino.lon).toFixed(1)
  );
  const fallbackMinutos = Math.round(fallbackKm * 2.8);

  return {
    distanciaKm: fallbackKm,
    duracaoMinutos: fallbackMinutos,
    polylineCoords: [
      [origem.lat, origem.lon],
      [destino.lat, destino.lon]
    ],
    origemCoord: origem,
    destinoCoord: destino,
    metodo: 'haversine_fallback'
  };
}

/**
 * Script puro em Vanilla JavaScript solicitado pelo usuário para inserção direta em HTML/JS
 */
export const VANILLA_JS_GEO_SCRIPT = `
// ============================================================================
// PASSOS EXPRESS — CÁLCULO DE FRETE COM GEOLOCALIZAÇÃO (OPENSTREETMAP / OSRM)
// ============================================================================

// Função auxiliar para geocodificar um endereço via OpenStreetMap (Nominatim)
async function buscarCoordenadas(endereco) {
    try {
        const query = encodeURIComponent(endereco.trim());
        const resposta = await fetch(\`https://nominatim.openstreetmap.org/search?format=json&q=\${query}&limit=1&countrycodes=br\`);
        const dados = await resposta.json();
        if (dados && dados.length > 0) {
            return {
                lat: parseFloat(dados[0].lat),
                lon: parseFloat(dados[0].lon)
            };
        }
    } catch (e) {
        console.error("Erro na geocodificação:", e);
    }
    return null;
}

// Função auxiliar para calcular distância real de condução via OSRM
async function calcularDistanciaOSRM(coordOrigem, coordDestino) {
    try {
        const url = \`https://router.project-osrm.org/route/v1/driving/\${coordOrigem.lon},\${coordOrigem.lat};\${coordDestino.lon},\${coordDestino.lat}?overview=false\`;
        const resposta = await fetch(url);
        const dados = await resposta.json();
        if (dados.routes && dados.routes.length > 0) {
            // Converte metros para quilômetros com 1 casa decimal
            return parseFloat((dados.routes[0].distance / 1000).toFixed(1));
        }
    } catch (e) {
        console.error("Erro ao calcular rota OSRM:", e);
    }

    // Fallback: cálculo de linha reta (Haversine com fator de rota urbana 1.28)
    const R = 6371;
    const dLat = ((coordDestino.lat - coordOrigem.lat) * Math.PI) / 180;
    const dLon = ((coordDestino.lon - coordOrigem.lon) * Math.PI) / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coordOrigem.lat * Math.PI / 180) * Math.cos(coordDestino.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c * 1.28).toFixed(1));
}

// Evento de envio do formulário
document.getElementById("formularioEntrega").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefoneCliente = document.getElementById("telefone").value;
    const coleta = document.getElementById("coleta").value;
    const entrega = document.getElementById("entrega").value;
    const tipo = document.getElementById("tipo").value;
    const observacao = document.getElementById("observacao").value;
    const divResultado = document.getElementById("resultado");

    // Mostra indicador de carregamento
    divResultado.innerHTML = \`<div style="padding: 15px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
        <p>🔄 <b>Calculando distância exata via satélite e GPS...</b></p>
        <p style="font-size: 13px; color: #666;">Buscando rota entre "\${coleta}" e "\${entrega}"</p>
    </div>\`;

    // 1. Obtém as coordenadas geográficas dos dois endereços
    const coordColeta = await buscarCoordenadas(coleta);
    const coordEntrega = await buscarCoordenadas(entrega);

    if (!coordColeta || !coordEntrega) {
        divResultado.innerHTML = \`<div style="padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b;">
            <h3>⚠️ Não foi possível localizar os endereços</h3>
            <p>Verifique o nome da rua, número e cidade em Coleta e Entrega.</p>
        </div>\`;
        return;
    }

    // 2. Calcula a distância real da rota pelas vias urbanas (em km)
    const distancia = await calcularDistanciaOSRM(coordColeta, coordEntrega);

    // 3. Aplica a tabela oficial de faixas e preços da Passos Express
    let valorFrete;
    let faixaKm;

    if (distancia <= 3) {
        valorFrete = 12.00;
        faixaKm = "Até 3 km";
    } else if (distancia <= 5) {
        valorFrete = 15.00;
        faixaKm = "3 a 5 km";
    } else if (distancia <= 8) {
        valorFrete = 20.00;
        faixaKm = "5 a 8 km";
    } else if (distancia <= 12) {
        valorFrete = 25.00;
        faixaKm = "8 a 12 km";
    } else if (distancia <= 15) {
        valorFrete = 30.00;
        faixaKm = "12 a 15 km";
    } else if (distancia <= 20) {
        valorFrete = 40.00;
        faixaKm = "15 a 20 km";
    } else {
        valorFrete = null;
        faixaKm = "Acima de 20 km";
    }

    // 4. Renderiza o resultado e gera o link formatado para o WhatsApp
    if (valorFrete !== null) {
        const valorFormatado = valorFrete.toFixed(2).replace('.', ',');

        // Mensagem formatada para o WhatsApp
        const mensagemTexto = 
            \`📦 *NOVO PEDIDO — PASSOS EXPRESS*\\n\\n\` +
            \`👤 *Nome:* \${nome}\\n\` +
            \`📱 *Telefone:* \${telefoneCliente}\\n\` +
            \`📍 *Coleta:* \${coleta}\\n\` +
            \`🏁 *Entrega:* \${entrega}\\n\` +
            \`📏 *Distância:* \${distancia} km (\${faixaKm})\\n\` +
            \`💰 *Valor:* R$ \${valorFormatado}\\n\` +
            \`📦 *Tipo:* \${tipo}\\n\` +
            \`📝 *Obs:* \${observacao || 'Nenhuma'}\`;

        // Codifica a mensagem para o formato de URL
        const mensagemCodificada = encodeURIComponent(mensagemTexto);
        const numeroWhatsApp = "5548991377771";
        const urlWhatsApp = \`https://wa.me/\${numeroWhatsApp}?text=\${mensagemCodificada}\`;

        divResultado.innerHTML = \`
            <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 10px;">
                <h3 style="color: #166534; margin-top: 0;">✅ Pedido Calculado com Sucesso!</h3>
                <p style="margin: 6px 0;"><b>Distância GPS calculada:</b> \${distancia} km (\${faixaKm})</p>
                <p style="margin: 6px 0; font-size: 18px;"><b>Valor da Entrega:</b> <span style="color: #15803d; font-weight: bold;">R$ \${valorFormatado}</span></p>
                <a href="\${urlWhatsApp}" target="_blank" style="display: inline-block; background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 12px; font-size: 15px;">
                    🚀 Enviar Pedido para o WhatsApp
                </a>
            </div>
        \`;

        // Abre automaticamente o WhatsApp numa nova aba
        window.open(urlWhatsApp, '_blank');

    } else {
        const mensagemConsulta = encodeURIComponent(\`Olá, Passos Express! Tenho um pedido com distância superior a 20 km (\${distancia} km) e gostaria de consultar o valor especial.\`);
        const urlConsulta = \`https://wa.me/5548991377771?text=\${mensagemConsulta}\`;
        
        divResultado.innerHTML = \`
            <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 10px; color: #92400e;">
                <h3 style="margin-top: 0;">⚠️ Distância superior a 20 km (\${distancia} km). Consulte a central.</h3>
                <p>Para distâncias acima de 20 km, consulte nossa central para cotação personalizada.</p>
                <a href="\${urlConsulta}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
                    💬 Falar com a Central no WhatsApp
                </a>
            </div>
        \`;
    }
});
`.trim();
