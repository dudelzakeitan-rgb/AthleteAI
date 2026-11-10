import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Dumbbell,
  Apple,
  Target,
  Loader2,
  Zap,
  Heart,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { askCoach } from '../lib/coachApi';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { CoachAuthCard } from '../components/CoachAuthCard';

const MAX_HISTORY_MESSAGES = 6;
const MAX_MESSAGE_CHARS = 2000;

const suggestedQuestions = [
  { text: "How can I improve my swimming speed?", icon: Zap },
  { text: "What should I eat before training?", icon: Apple },
  { text: "Create a workout plan for me", icon: Dumbbell },
  { text: "How do I prevent injuries?", icon: Heart },
];

const topics = [
  { id: 'training', label: 'Training Advice', icon: Dumbbell },
  { id: 'nutrition', label: 'Nutrition', icon: Apple },
  { id: 'technique', label: 'Technique Tips', icon: Target },
  { id: 'recovery', label: 'Recovery', icon: Heart },
];

export function AICoachPage() {
  const { chatMessages, addChatMessage, saveError } = useApp();
  const { session } = useSupabaseSession();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isTyping || !session) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    const history = [...chatMessages, userMessage]
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content: text }) => ({ role, content: text }));

    addChatMessage(userMessage);
    setInput('');
    setError(null);
    setIsTyping(true);

    try {
      const reply = await askCoach(history);
      addChatMessage({
        id: uuidv4(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-20 pb-4 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Coach</h1>
              <p className="text-gray-600">Your personal training assistant</p>
            </div>
          </div>
          {session && (
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          )}
        </div>

        {chatMessages.length === 0 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-500">
                Ask me anything about training, nutrition, or technique
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mb-8">
              {suggestedQuestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <suggestion.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{suggestion.text}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTopic === topic.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <topic.icon className="w-4 h-4" />
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.length > 0 && (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {chatMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1 bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-gray-500 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {chatMessages.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {suggestedQuestions.slice(0, 3).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200 hover:border-blue-300 text-sm whitespace-nowrap transition-all"
              >
                <suggestion.icon className="w-3 h-3 text-blue-500" />
                <span className="text-gray-600">{suggestion.text}</span>
              </button>
            ))}
          </div>
        )}

        {(error || saveError) && (
          <p className="text-sm text-red-600 mb-3 px-1" role="alert">
            {error || saveError}
          </p>
        )}

        {session ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI coach anything..."
                rows={1}
                maxLength={MAX_MESSAGE_CHARS}
                className="flex-1 resize-none border-none focus:outline-none text-gray-900 placeholder-gray-400 min-h-[24px] max-h-[120px]"
                style={{ height: 'auto' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isTyping
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <CoachAuthCard />
        )}

        <p className="text-center text-xs text-gray-400 mt-3">
          AI Coach provides general advice. Consult a professional for personalized guidance.
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-gray-600 to-gray-700'
            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
            : 'bg-white shadow-sm border border-gray-100'
        }`}
      >
        <div className={`text-sm whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-800'}`}>
          {message.content}
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
