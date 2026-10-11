import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Car,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Phone,
  Minimize2
} from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_PHONE } from '../constants';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const WhatsAppChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Olá! 👋 Seja bem-vindo à *PASSOS EXPRESS* — Entregas de Carro em Criciúma e região!',
      time: 'Agora'
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: 'Sou o **Chatbot 4.0** da central. Posso calcular seu frete, tirar dúvidas ou transferir você diretamente para o nosso WhatsApp oficial. Como posso te ajudar?',
      time: 'Agora'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Chama o endpoint server-side da Gemini API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      let botReply = 'Olá! Nosso time está pronto para atender você no WhatsApp oficial da Passos Express.';
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          botReply = data.reply;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: getCurrentTime(),
        actionUrl: `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
        actionLabel: '🚀 Falar com a Central no WhatsApp'
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Erro ao conectar com API de chat:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: 'Nossas entregas são exclusivamente de carro em Criciúma e região! Para atendimento imediato, clique no botão abaixo para falar com nosso motorista no WhatsApp.',
        time: getCurrentTime(),
        actionUrl: `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
        actionLabel: '💬 Abrir WhatsApp da Central'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      {/* Floating Button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-[#25d366] hover:bg-[#20ba59] active:scale-95 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer"
          aria-label="Abrir Chatbot WhatsApp"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-white fill-current" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-emerald-700 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#25d366]">
              1
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black uppercase tracking-wider leading-none text-emerald-950">
              Chatbot 4.0 WhatsApp
            </span>
            <span className="text-[11px] text-white/95 font-medium mt-0.5">
              Passos Express · Online agora
            </span>
          </div>
        </button>
      )}

      {/* WhatsApp Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#efeae2] dark:bg-[#0b141a] rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in">
          {/* Header styled like WhatsApp */}
          <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold">
                  <Car className="w-5 h-5 text-slate-900" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm tracking-tight">Passos Express</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-[#075e54] text-[9px] font-black flex items-center justify-center">
                    ✓
                  </span>
                </div>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  Chatbot 4.0 WhatsApp · Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-100">
              <a
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Ligar ou abrir WhatsApp"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Fechar Chatbot"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-xs text-xs sm:text-[13px] leading-relaxed relative ${
                    msg.sender === 'user'
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                      : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Optional action button in message */}
                  {msg.actionUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                      <a
                        href={msg.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25d366] hover:bg-[#20ba59] text-slate-950 font-black text-[11px] rounded-lg shadow-xs transition-all w-full justify-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{msg.actionLabel || 'Enviar para WhatsApp'}</span>
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2.5 bg-white dark:bg-[#202c33] rounded-xl rounded-tl-none w-20 text-xs text-slate-400 shadow-xs">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          <div className="px-3 py-2 bg-slate-100/90 dark:bg-[#111b21] border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleQuickQuestion('Qual o valor do frete?')}
              className="px-2.5 py-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              💰 Tabela de Preços
            </button>
            <button
              onClick={() => handleQuickQuestion('Quais as formas de pagamento aceitas? Tem Pix e Cartão?')}
              className="px-2.5 py-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              ⚡ Pix &amp; Cartão
            </button>
            <button
              onClick={() => handleQuickQuestion('Vocês entregam de carro?')}
              className="px-2.5 py-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              🚗 Entrega de Carro
            </button>
            <button
              onClick={() => handleQuickQuestion('Quais cidades da região atendem?')}
              className="px-2.5 py-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700 rounded-full whitespace-nowrap text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              📍 Cidades Atendidas
            </button>
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputMessage);
            }}
            className="p-2.5 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem para a central..."
              className="flex-1 px-3.5 py-2 bg-white dark:bg-[#2a3942] text-slate-900 dark:text-slate-100 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-xl bg-[#00a884] hover:bg-[#06cf9c] disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
