import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { ZipArchive } from 'archiver';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Inicialização do cliente Gemini Server-Side se a chave estiver configurada
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint do Chatbot da Passos Express WhatsApp
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem inválida' });
      return;
    }

    const systemInstruction = `
Você é o Chatbot 4.0 oficial da PASSOS EXPRESS, um serviço de entregas e transportes rápidos realizados exclusivamente de CARRO em Criciúma e região (Sul de Santa Catarina).
O WhatsApp da central de atendimento é 5548991377771 (ou (48) 99137-7771).

INFORMAÇÕES DA EMPRESA:
- Tipo de transporte: Exclusivamente de CARRO (automóvel com porta-malas espaçoso, 100% protegido contra chuva, ar-condicionado e climatizado).
- Região atendida: Criciúma, Içara, Forquilhinha, Nova Veneza, Cocal do Sul, Siderópolis, Balneário Rincão, Morro da Fumaça e região carbonífera.
- Tabela oficial de preços:
  * Até 3 km: R$ 12,00
  * 3 a 5 km: R$ 15,00
  * 5 a 8 km: R$ 20,00
  * 8 a 12 km: R$ 25,00
  * 12 a 15 km: R$ 30,00
  * 15 a 20 km: R$ 40,00
  * Acima de 20 km: Sob consulta com a central
- Vantagens do carro: Caixas maiores, compras de atacado/mercado, bolos/confeitaria, peças, não molha mercadoria e transporta até 300kg.

SEU OBJETIVO:
- Responder de forma cordial, prestativa, direta e curta (estilo WhatsApp).
- Ajudar o cliente a cotar o frete ou tirar dúvidas.
- Sempre que houver um pedido ou dúvida complexa, convidar o cliente a clicar no botão para abrir o WhatsApp oficial (48 99137-7771).
- Use formatação simples com negrito e emojis moderados.
`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.7,
            thinkingConfig: { thinkingLevel: 1 as any }
          }
        });

        const reply = response.text || 'Olá! Posso ajudar você a cotar uma entrega de carro agora mesmo em Criciúma e região.';
        res.json({ reply });
        return;
      } catch (geminiError) {
        console.warn('Erro ao chamar Gemini API, usando resposta estruturada de fallback:', geminiError);
      }
    }

    // Fallback inteligente caso Gemini não esteja com chave no momento
    const msg = message.toLowerCase();
    let fallbackReply = 'Olá! Sou o atendente virtual da Passos Express. Nossas entregas são exclusivamente de carro em Criciúma e região. Como posso ajudar com sua entrega hoje?';

    if (msg.includes('preco') || msg.includes('preço') || msg.includes('valor') || msg.includes('quanto custa') || msg.includes('tabela')) {
      fallbackReply = '💰 Nossas tarifas oficiais de carro são:\n• Até 3 km: R$ 12,00\n• 3 a 5 km: R$ 15,00\n• 5 a 8 km: R$ 20,00\n• 8 a 12 km: R$ 25,00\n• 12 a 15 km: R$ 30,00\n• 15 a 20 km: R$ 40,00\n• Acima de 20 km: Sob consulta com nossa central!\n\nQuer calcular seu frete agora?';
    } else if (msg.includes('carro') || msg.includes('moto') || msg.includes('veiculo') || msg.includes('veículo')) {
      fallbackReply = '🚗 Sim! Nossas entregas são 100% de CARRO! Isso garante porta-malas espaçoso, proteção total contra chuva para sua mercadoria e transporte climatizado para alimentos e itens frágeis.';
    } else if (msg.includes('onde') || msg.includes('cidade') || msg.includes('regiao') || msg.includes('região') || msg.includes('atende')) {
      fallbackReply = '📍 Atendemos toda a cidade de Criciúma e municípios vizinhos: Içara, Forquilhinha, Nova Veneza, Cocal do Sul, Siderópolis e Balneário Rincão!';
    } else if (msg.includes('whatsapp') || msg.includes('contato') || msg.includes('telefone') || msg.includes('falar')) {
      fallbackReply = '📱 Nosso WhatsApp oficial da central é (48) 99137-7771. Você pode clicar no botão verde abaixo para iniciar uma conversa direta!';
    }

    res.json({ reply: fallbackReply });
  } catch (error) {
    console.error('Erro na rota /api/chat:', error);
    res.status(500).json({ error: 'Erro interno ao processar mensagem do chatbot' });
  }
});

// Endpoint GET para verificação de Webhook (Meta WhatsApp Cloud API / Webhook verify)
app.get('/api/whatsapp-webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'passosexpress_token_2026';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook WhatsApp verificado com sucesso!');
    res.status(200).send(challenge);
    return;
  }
  
  res.status(200).json({
    status: 'online',
    message: 'Webhook WhatsApp Passos Express ativo e aguardando mensagens!',
    verifyTokenExpected: VERIFY_TOKEN,
  });
});

// Endpoint POST para receber mensagens reais de clientes no WhatsApp
app.post('/api/whatsapp-webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log('Mensagem WhatsApp recebida via Webhook:', JSON.stringify(body, null, 2));

    // Extrai mensagem e remetente (compatível com Meta Cloud API e Evolution API)
    let incomingText = '';
    let fromPhone = '';

    if (body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      // Formato oficial Meta Cloud API
      const metaMsg = body.entry[0].changes[0].value.messages[0];
      fromPhone = metaMsg.from;
      incomingText = metaMsg.text?.body || '';
    } else if (body.data?.message?.conversation) {
      // Formato Evolution API / Baileys
      incomingText = body.data.message.conversation;
      fromPhone = body.data.key?.remoteJid || '';
    } else if (body.message) {
      incomingText = typeof body.message === 'string' ? body.message : body.message.text || '';
      fromPhone = body.from || 'Cliente';
    } else {
      incomingText = body.text || '';
      fromPhone = body.from || 'Cliente';
    }

    if (!incomingText) {
      res.status(200).json({ status: 'ignored_no_text' });
      return;
    }

    // Processa a resposta automática com Gemini ou regras
    let autoReply = '';

    const systemInstruction = `
Você é o atendente automático da PASSOS EXPRESS no WhatsApp.
Entregas 100% de CARRO em Criciúma e região carbonífera (SC).
Central: (48) 99137-7771.
Preços: Até 3km: R$12 | 3-5km: R$15 | 5-8km: R$20 | 8-12km: R$25 | 12-15km: R$30 | 15-20km: R$40 | >20km: Sob consulta.
Seja breve, profissional e amigável.
`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: incomingText,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        autoReply = response.text || '';
      } catch (err) {
        console.warn('Fallback Gemini no webhook:', err);
      }
    }

    if (!autoReply) {
      const lower = incomingText.toLowerCase();
      if (lower.includes('preco') || lower.includes('preço') || lower.includes('valor') || lower.includes('tabela')) {
        autoReply = '🚗 *PASSOS EXPRESS — TABELA DE CARRO*\n\n• Até 3 km: R$ 12,00\n• 3 a 5 km: R$ 15,00\n• 5 a 8 km: R$ 20,00\n• 8 a 12 km: R$ 25,00\n• 12 a 15 km: R$ 30,00\n• 15 a 20 km: R$ 40,00\n• Acima de 20 km: Sob consulta\n\nQual o endereço de coleta e entrega para calcularmos?';
      } else {
        autoReply = 'Olá! 👋 Seja bem-vindo à *PASSOS EXPRESS* (Entregas de Carro em Criciúma e região).\n\nNosso atendimento automático já recebeu sua mensagem. Para agilizar seu frete, por favor informe:\n1. Endereço de Coleta\n2. Endereço de Entrega\n3. Tipo do produto\n\nNossa central já vai te responder!';
      }
    }

    res.status(200).json({
      status: 'success',
      recipient: fromPhone,
      reply: autoReply
    });
  } catch (err) {
    console.error('Erro no processamento do webhook WhatsApp:', err);
    res.status(500).json({ error: 'Falha no webhook' });
  }
});

// Endpoint para baixar o ZIP pronto para publicar no Netlify (apenas os arquivos compilados do dist)
app.get('/api/download-netlify-zip', async (_req: Request, res: Response) => {
  try {
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      res.status(503).json({ error: 'Pasta dist ainda não compilada. Execute o build primeiro.' });
      return;
    }

    res.attachment('passos-express-netlify-deploy.zip');
    res.setHeader('Content-Type', 'application/zip');

    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.on('error', (err: any) => {
      console.error('Erro ao gerar zip do Netlify:', err);
      if (!res.headersSent) res.status(500).send({ error: 'Falha ao compactar' });
    });

    archive.pipe(res);
    // Adiciona todo o conteúdo de dist na raiz do ZIP (perfeito para o Netlify!)
    archive.directory(distPath, false);
    await archive.finalize();
  } catch (err) {
    console.error('Erro no download do Netlify ZIP:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Erro interno ao gerar ZIP' });
  }
});

// Endpoint para baixar o código fonte completo para o VS Code
app.get('/api/download-vscode-zip', async (_req: Request, res: Response) => {
  try {
    res.attachment('passos-express-projeto-completo.zip');
    res.setHeader('Content-Type', 'application/zip');

    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.on('error', (err: any) => {
      console.error('Erro ao gerar zip do VS Code:', err);
      if (!res.headersSent) res.status(500).send({ error: 'Falha ao compactar' });
    });

    archive.pipe(res);

    // Adiciona arquivos de configuração na raiz
    const rootFiles = [
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'netlify.toml',
      'index.html',
      'server.ts',
      'metadata.json',
      'README.md'
    ];

    for (const f of rootFiles) {
      const fullPath = path.join(__dirname, f);
      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: f });
      }
    }

    // Adiciona as pastas de código-fonte
    const srcPath = path.join(__dirname, 'src');
    if (fs.existsSync(srcPath)) {
      archive.directory(srcPath, 'src');
    }

    const publicPath = path.join(__dirname, 'public');
    if (fs.existsSync(publicPath)) {
      archive.directory(publicPath, 'public');
    }

    await archive.finalize();
  } catch (err) {
    console.error('Erro no download do VS Code ZIP:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Erro interno ao gerar ZIP' });
  }
});

// Endpoint direto para download do pacote completo
app.get('/passos-express-completo.zip', (_req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'passos-express-completo.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'passos-express-completo.zip');
  } else {
    res.status(404).send('Arquivo ZIP completo não encontrado');
  }
});

// Endpoint direto para download do Netlify
app.get('/passos-express-netlify.zip', (_req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'passos-express-netlify.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'passos-express-netlify.zip');
  } else {
    res.status(404).send('Arquivo ZIP Netlify não encontrado');
  }
});

// Endpoint direto para download do VS Code
app.get('/passos-express-vscode.zip', (_req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'passos-express-vscode.zip');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'passos-express-vscode.zip');
  } else {
    res.status(404).send('Arquivo ZIP VS Code não encontrado');
  }
});

// Inicialização do servidor em desenvolvimento (Vite middlewares) ou produção (Static files)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Passos Express rodando na porta ${PORT}`);
  });
}

startServer();
