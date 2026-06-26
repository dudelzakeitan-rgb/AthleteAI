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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

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
  const { chatMessages, addChatMessage, userProfile, currentSport } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(input, userProfile, currentSport);
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMessage);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Coach</h1>
              <p className="text-gray-600">Your personal training assistant</p>
            </div>
          </div>
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

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI coach anything..."
              rows={1}
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

function generateAIResponse(
  input: string,
  _userProfile: { sport?: string; skillLevel?: string } | null,
  currentSport: string | null
): string {
  const inputLower = input.toLowerCase();

  if (inputLower.includes('speed') || inputLower.includes('faster')) {
    return `Great question about improving speed! Here are my key recommendations:

1. **Interval Training**: Incorporate high-intensity intervals into your sessions. For example, 8x25m sprints with 45s rest.

2. **Technique Focus**: Speed comes from efficiency. Work on reducing drag and improving your catch.

3. **Power Development**: Add resistance training like paddle work and power exercises.

4. **Starts & Turns**: These can shave significant time off your performance. Practice explosive entries and tight turns.

Would you like me to create a specific speed training plan for you?`;
  }

  if (inputLower.includes('eat') || inputLower.includes('nutrition') || inputLower.includes('food') || inputLower.includes('meal')) {
    return `Proper nutrition is crucial for athletic performance! Here's what I recommend:

**Pre-Training (2-3 hours before):**
- Complex carbs: oatmeal, whole grain toast, or rice
- Moderate protein: eggs, greek yogurt, or chicken
- Avoid heavy fats

**Quick Energy (30-60 min before):**
- Banana, energy bar, or sports drink
- Easy to digest, quick fuel

**Post-Training (within 30 min):**
- Protein + carbs combo: chocolate milk, protein shake with fruit
- This maximizes recovery

**Daily Focus:**
- Aim for 1.6-2.2g protein per kg body weight
- Stay hydrated: 16-20 oz 2 hours before training

Want specific meal suggestions for your training schedule?`;
  }

  if (inputLower.includes('workout') || inputLower.includes('plan') || inputLower.includes('training')) {
    return `I'd be happy to create a personalized workout plan for you! Based on your profile, here's a starter structure:

**Weekly Schedule Suggestion:**
- 3-4 training sessions per week
- Mix of technique and fitness work
- Include 1-2 dryland sessions

**Each Session Should Include:**
1. Warm-up (10-15 min)
2. Main set (30-40 min)
3. Technique drills (10-15 min)
4. Cool-down (5-10 min)

**Key Focus Areas:**
- ${currentSport === 'swimming' ? 'Stroke efficiency, starts, and turns' : 'Sport-specific skills and conditioning'}
- Progressive overload each week
- Recovery between sessions

Would you like me to generate a detailed plan for a specific goal (speed, endurance, technique)?`;
  }

  if (inputLower.includes('injury') || inputLower.includes('prevent') || inputLower.includes('pain') || inputLower.includes('hurt')) {
    return `Injury prevention is essential for consistent training. Here are my top recommendations:

**Warm-up Properly:**
- Always do 10-15 min dynamic warm-up
- Include mobility work for shoulders and hips
- Activate core muscles

**Common Issues to Watch:**
- Overuse injuries from sudden volume increases
- Technique flaws causing strain
- Insufficient recovery between sessions

**Prevention Strategies:**
- Follow the 10% rule: increase volume gradually
- Listen to your body - rest when needed
- Include strength training for joint stability
- Get adequate sleep (7-9 hours)

**If you're experiencing pain:**
- Stop the activity causing pain
- Apply RICE (Rest, Ice, Compression, Elevation)
- Consult a sports medicine professional

Would you like specific exercises for injury prevention in your sport?`;
  }

  if (inputLower.includes('technique') || inputLower.includes('form') || inputLower.includes('improve')) {
    return `Technique is the foundation of performance! Here's my approach:

**Key Technique Principles:**
1. **Body Position**: Maintain streamline, minimize drag
2. **Efficiency**: Focus on smooth, controlled movements
3. **Timing**: Coordinate all parts of the movement
4. **Power**: Generate force from large muscle groups

**How to Improve:**
- Video analysis is incredibly helpful - record yourself!
- One focus point at a time during practice
- Drill work isolates specific elements
- Get feedback from a coach or training partner

**Common Mistakes:**
- Overthinking during high-intensity sets
- Neglecting technique when fatigued
- Skipping drill work

Would you like specific technique tips for your sport, or help analyzing a particular movement?`;
  }

  if (inputLower.includes('rest') || inputLower.includes('recovery') || inputLower.includes('tired') || inputLower.includes('sleep')) {
    return `Recovery is where adaptation happens! Here's how to optimize it:

**Sleep (Most Important):**
- Aim for 7-9 hours per night
- Consistent sleep schedule helps
- Avoid screens 1 hour before bed
- Keep room cool and dark

**Active Recovery:**
- Light swimming, walking, or cycling
- Foam rolling and stretching
- Massage gun or manual massage

**Nutrition for Recovery:**
- Protein within 30 min post-training
- Carbs to replenish glycogen
- Stay hydrated throughout the day

**Signs You Need More Recovery:**
- Persistent fatigue
- Decreased performance
- Mood changes
- Elevated resting heart rate

How many hours of sleep are you currently getting?`;
  }

  return `Thanks for your question! I'm here to help with all aspects of your training.

I can assist you with:
- Training plan creation and modifications
- Technique tips and video analysis
- Nutrition advice and meal planning
- Recovery strategies
- Mental game and motivation

Your question about "${input.substring(0, 30)}..." is a great one! Here's my general advice:

Every athlete is unique, and the best approach depends on your specific goals, current fitness level, and constraints.

For more personalized guidance, consider:
1. Your specific sport and position
2. Your current training volume
3. Areas you want to improve most
4. Available time and resources

Would you like to dive deeper into any of these areas? I can provide more specific recommendations!`;
}
