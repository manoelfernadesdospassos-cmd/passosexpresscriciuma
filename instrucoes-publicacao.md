# 🚀 PASSOS EXPRESS — Como Publicar e Rodar o Projeto

Preparamos o seu projeto completo nas pastas e arquivos compactados (.ZIP) prontos para uso:

---

## 📦 Arquivos ZIP Disponíveis na Raiz do Projeto

1. **`passos-express-netlify.zip`** (1.3 MB)
   - Contém apenas os arquivos compilados de produção e alta performance (`pasta-netlify/`).
   - Ideal para arrastar e soltar direto no Netlify, Vercel ou qualquer servidor de hospedagem.
   
2. **`passos-express-vscode.zip`** (295 KB)
   - Contém o código-fonte limpo completo (`pasta-vscode-projeto/`) pronto para abrir no VS Code e continuar desenvolvendo.
   - Inclui todos os componentes React, TypeScript, Tailwind, utilitários do Pix e backend Express.

3. **`passos-express-completo.zip`** (1.6 MB)
   - Pacote unificado contendo ambas as pastas (`pasta-netlify/` + `pasta-vscode-projeto/`) e este guia de instruções.

---

## 🌐 1. Como Publicar no Netlify em 1 Minuto (PC ou Celular)

1. Acesse: **[app.netlify.com/drop](https://app.netlify.com/drop)** no seu navegador.
2. Faça login com sua conta Netlify (ou crie uma gratuita em poucos segundos).
3. Na caixa onde diz *"Drag and drop your site output folder here"*, solte ou envie o arquivo:
   👉 **`passos-express-netlify.zip`** (ou a pasta descompactada **`pasta-netlify`**).
4. O Netlify publicará seu site em segundos, gerando um link seguro com HTTPS (exemplo: `passosexpress.netlify.app`), suporte a PWA e carregamento ultrarrápido!

---

## 💻 2. Como Rodar e Editar no VS Code (Computador)

1. Extraia o arquivo **`passos-express-vscode.zip`** no seu computador.
2. Abra a pasta no **Visual Studio Code**.
3. Abra o terminal integrado (`Ctrl + '` ou `Terminal > Novo Terminal`) e execute:
   ```bash
   npm install
   npm run dev
   ```
4. O site abrirá no endereço local `http://localhost:3000` pronto para você testar e editar.

---

## 📲 3. Links de Download Direto pelo Navegador

Os arquivos `.zip` também estão disponíveis diretamente pelo servidor web da aplicação:
- **Netlify Deploy ZIP:** `/passos-express-netlify.zip`
- **Código-Fonte VS Code ZIP:** `/passos-express-vscode.zip`
- **Pacote Completo ZIP:** `/passos-express-completo.zip`

---

## ✅ Alterações Incluídas Nesta Versão

- **Menu Limpo para o Cliente:** Remoção de botões administrativos ("Configurar Chatbot", "Meu Chatbot", "Instalar App") para que os clientes tenham foco 100% no cálculo de frete e no pedido.
- **Formas de Pagamento no Cálculo:** Adicionada seleção de pagamento (PIX Instantâneo, Cartão na maquininha, Dinheiro com troco e Faturamento para empresas).
- **PIX Dinâmico com QR Code e Copia e Cola:** Geração do padrão BR Code EMV com chave `48991377771`, botão de copiar com feedback visual e envio estruturado dos dados do Pix no WhatsApp.
