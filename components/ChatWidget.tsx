
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Namaste! I am your BharatVayu AI assistant. How can I help you with air quality information today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Chat Session
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = createChatSession();
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Optimized for Indian English

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition", err);
      }
    }
  }, [isListening]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let aiText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          aiText += c.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: aiText };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-6 sm:right-6 z-[1001]">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-orange-600 text-white'}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-2xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <i className="fa-solid fa-robot text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">BharatVayu Assistant</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">AI Powered</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-700 rounded-tl-none shadow-sm border border-slate-100'
                }`}>
                  {msg.text || <div className="flex gap-1 py-1"><div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div><div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-orange-600'}`}
              title={isListening ? "Stop Listening" : "Start Voice Typing"}
            >
              <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about air quality..."}
              className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-orange-700 transition-colors"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
