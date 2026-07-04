import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { COMPANY_INFO } from '../constants';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello! I am the OMEGA Virtual Assistant. How can I help you with our inspection or construction services today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Frontend-only: local fallback response (Gemini integration removed)
      const generateLocalResponse = async (text: string) => {
        await new Promise(res => setTimeout(res, 600)); // simulate thinking
        const t = text.toLowerCase();
        if (t.includes('عرض') || t.includes('سعر') || t.includes('تكلفة')) {
          return `للحصول على عرض أسعار، الرجاء التواصل عبر WhatsApp: ${COMPANY_INFO.whatsapp} أو هاتف: ${COMPANY_INFO.phone}.`;
        }
        if (t.includes('واتس') || t.includes('whatsapp') || t.includes('اتصال') || t.includes('phone')) {
          return `تواصل معنا عبر WhatsApp: ${COMPANY_INFO.whatsapp} أو هاتف: ${COMPANY_INFO.phone}.`;
        }
        return 'الرد الآلي غير متوفر محلياً — يرجى زيارة صفحة الخدمات أو التواصل معنا.';
      };

      const responseText = await generateLocalResponse(userMsg.text);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-omega-yellow animate-bounce'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-omega-dark" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[500px] animate-[fadeInUp_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-omega-dark p-4 flex items-center gap-3">
            <div className="bg-omega-yellow p-1.5 rounded-full">
              <Bot size={20} className="text-omega-dark" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">OMEGA Support AI</h3>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 h-80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-omega-blue text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                 <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                   <Loader2 size={16} className="animate-spin text-omega-yellow" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our services..."
              className="flex-grow p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-omega-yellow"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-omega-dark text-white p-2 rounded hover:bg-omega-blue transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;