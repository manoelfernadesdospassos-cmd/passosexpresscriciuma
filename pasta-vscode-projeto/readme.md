# 🚗 Passos Express Criciúma - Aplicativo Web & PWA

Aplicativo completo de cálculo de rotas, cotação de fretes por km, chatbot inteligente e PWA pronto para publicação no Netlify e Google Play Store (TWA).

---

## 📋 Pré-requisitos

Para rodar este projeto no seu computador via VS Code, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Visual Studio Code](https://code.visualstudio.com/)

---

## 🚀 Como Executar no VS Code

### 1. Extrair os Arquivos
Abra a pasta do projeto no VS Code (`Arquivo -> Abrir Pasta...` ou `File -> Open Folder...`).

### 2. Abrir o Terminal Integrado
No VS Code, pressione **Ctrl + `** (ou vá em `Terminal -> Novo Terminal`).

### 3. Instalar as Dependências
Execute o comando:
```bash
npm install
```

### 4. Iniciar o Servidor de Desenvolvimento
Execute:
```bash
npm run dev
```
O terminal exibirá o link local (exemplo: `http://localhost:3000`). Segure **Ctrl** e clique no link para abrir no navegador.

---

## 📁 Estrutura de Arquivos do Projeto

```
├── public/                     # Arquivos estáticos servidos diretamente
│   ├── manifest.json           # Manifesto PWA com ID com.passosexpress.criciuma
│   ├── _redirects              # Regra do Netlify para SPA (/* /index.html 200)
│   ├── icon.svg, favicon.ico   # Favicons e ícones da aplicação
│   └── pwa-*.png, play-store-* # Ícones 192x192, 512x512 e banner da loja
│
├── src/                        # Código-fonte da aplicação React + TypeScript
│   ├── components/             # Componentes modulares
│   │   ├── DeliveryForm.tsx    # Formulário de CEP / endereços e tipo de entrega
│   │   ├── RouteMap.tsx        # Mapa interativo Leaflet com rotas
│   │   ├── ResultCard.tsx      # Exibição do valor, km e botão de chamar WhatsApp
│   │   ├── WhatsAppChatbot.tsx # Chatbot interativo flutuante
│   │   ├── PlayStoreAppModal.tsx# Central com guias de instalação, Play Store e Netlify
│   │   ├── PricingTableModal.tsx# Tabela oficial de preços por km
│   │   └── HistoryDrawer.tsx   # Histórico de cotações salvas
│   ├── utils/                  # Utilitários de geolocalização e cálculo
│   │   ├── pricing.ts          # Regras e faixas de preço por km
│   │   ├── geo.ts              # Cálculo de distância e rota
│   │   └── address.ts          # Consulta de endereços e ViaCEP
│   ├── constants.ts            # Telefones, WhatsApp, dados de contato e endereço base
│   ├── types.ts                # Tipagens TypeScript
│   ├── App.tsx                 # Componente raiz do aplicativo
│   ├── index.css               # Estilos com Tailwind CSS v4
│   └── main.tsx                # Entrada React
│
├── index.html                  # HTML base com meta tags, OpenGraph e PWA
├── netlify.toml                # Configuração de build e publicação no Netlify
├── server.ts                   # Servidor Express com API do Chatbot
├── vite.config.ts              # Configuração Vite e VitePWA
└── package.json                # Dependências e scripts do Node.js
```

---

## 🛠️ Como Ajustar Informações

- **Número de WhatsApp e Telefones:**  
  Edite o arquivo `src/constants.ts`:
  ```typescript
  export const WHATSAPP_PHONE = '5548991377771';
  export const DISPLAY_WHATSAPP_PHONE = '(48) 99137-7771';
  ```

- **Tabela de Preços por KM:**  
  Edite `src/utils/pricing.ts` para alterar as faixas de valores (ex.: R$ 12 até 3km, R$ 15 até 5km, etc.).

- **Manifesto PWA / Nome do App:**  
  Edite `public/manifest.json`.

---

## 🌐 Como Gerar a Versão Final e Publicar no Netlify

### 1. Compilar o Projeto
No terminal do VS Code, execute:
```bash
npm run build
```
Este comando criará a pasta **`dist`** com todos os arquivos otimizados e prontos para a internet.

### 2. Publicar no Netlify (Arrastar e Soltar)
1. Acesse sua conta em [app.netlify.com](https://app.netlify.com).
2. Vá até o seu site **`passosexpresscriciuma.netlify.app`** (ou na aba **Deploys**).
3. Arraste a pasta **`dist`** inteira para o campo pontilhado:  
   *"Need to update your site? Drag and drop your site output folder here"*.
4. O Netlify atualizará seu site em poucos segundos!

### 3. Publicar via Git / GitHub
Se o seu projeto estiver conectado a um repositório GitHub, basta fazer:
```bash
git add .
git commit -m "Atualizações Passos Express"
git push
```
O Netlify lerá o arquivo `netlify.toml` e fará o deploy automático!
