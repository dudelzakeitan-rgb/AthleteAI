import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, MessageCircle, Bot, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

const SUGGESTIONS = [
  'How can I improve my freestyle technique?',
  'What should I eat before training?',
  'How do I build more endurance?',
  'What exercises help with injury prevention?',
];

function generateResponse(input: string, sport: string | null): string {
  const lower = input.toLowerCase();
  if (lower.includes('speed') || lower.includes('fast')) {
    return `To improve your speed in ${sport || 'your sport'}, focus on high-intensity interval training (HIIT), sprint sets with full recovery, and explosive strength work like plyometrics and power cleans. Consistency over 8-12 weeks will show measurable gains.`;
  }
  if (lower.includes('nutrition') || lower.includes('eat') || lower.includes('food') || lower.includes('diet')) {
    return `Optimal sports nutrition: eat 2-3g of carbs/kg bodyweight before training, prioritize 20-40g protein within 30 minutes post-workout, and stay hydrated with 500ml of water 2 hours before sessions. Whole foods over supplements where possible.`;
  }
  if (lower.includes('technique') || lower.includes('form') || lower.includes('freestyle') || lower.includes('stroke')) {
    return `Technique drills to try: catch-up drill for timing, fingertip drag for high elbow recovery, and side-kick drill for body rotation. Film yourself underwater if possible — small technique flaws are often invisible from above.`;
  }
  if (lower.includes('endurance') || lower.includes('stamina')) {
    return `Build your aerobic base with long, steady sets at 60-70% effort. Gradually increase weekly volume by no more than 10%. Add threshold intervals (85% effort, short rest) once you have a solid base. This 12-week progression is evidence-based and reduces injury risk.`;
  }
  if (lower.includes('injur') || lower.includes('pain') || lower.includes('sore')) {
    return `First: rest the affected area and avoid training through sharp pain. Distinguish between muscle soreness (normal) and joint/tendon pain (needs attention). Ice for acute injuries, heat for chronic tightness. See a physio if pain persists more than 3-5 days. Prevention: always warm up properly and don't skip mobility work.`;
  }
  if (lower.includes('recover') || lower.includes('rest')) {
    return `Recovery is where gains happen. Prioritize 7-9 hours of sleep, active recovery (light swimming/yoga) on rest days, and adequate protein (1.6-2.2g/kg). Cold water immersion, foam rolling, and compression garments can help. Don't underestimate rest — overtraining is a real performance limiter.`;
  }
  return `Great question! For ${sport || 'your sport'}, focus on consistency over intensity. Build your base fitness first, master the fundamentals, and progressively overload your training. Track your workouts and look for patterns in your performance improvements. What specific aspect would you like to dive deeper into?`;
}

export function AICoachScreen() {
  const { chatMessages, addChatMessage, currentSport } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    await addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(text, currentSport),
        timestamp: new Date().toISOString(),
      };
      await addChatMessage(aiMsg);
      setIsTyping(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1200);
  };

  const allMessages: ChatMessage[] = chatMessages.length === 0
    ? [{
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your AI sports coach. I'm here to help you improve your training, nutrition, and technique. What would you like to work on today?`,
        timestamp: new Date().toISOString(),
      }]
    : chatMessages;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#1d4ed8', '#3b82f6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 py-4">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
            <Bot size={20} color="#ffffff" />
          </View>
          <View>
            <Text className="text-white font-bold text-base">AI Coach</Text>
            <Text className="text-white/70 text-xs">Always here to help</Text>
          </View>
          <View className="ml-auto flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
            <Text className="text-white/70 text-xs">Online</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View className="flex-row items-start mb-4">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                  <Bot size={16} color="#3b82f6" />
                </View>
                <View className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <Text className="text-gray-400 text-sm">Thinking...</Text>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View className={`flex-row items-start mb-4 ${item.role === 'user' ? 'justify-end' : ''}`}>
              {item.role === 'assistant' && (
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2 mt-1">
                  <Bot size={16} color="#3b82f6" />
                </View>
              )}
              <View
                className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm ${
                  item.role === 'user' ? 'bg-blue-500' : 'bg-white'
                }`}
                style={{ maxWidth: '75%' }}
              >
                <Text className={`text-sm leading-relaxed ${item.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {item.content}
                </Text>
              </View>
              {item.role === 'user' && (
                <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center ml-2 mt-1">
                  <User size={16} color="#ffffff" />
                </View>
              )}
            </View>
          )}
        />

        {/* Suggestions */}
        {chatMessages.length === 0 && (
          <View className="px-4 mb-2">
            <Text className="text-xs text-gray-400 mb-2">Suggested topics</Text>
            <ScrollableChips items={SUGGESTIONS} onSelect={sendMessage} />
          </View>
        )}

        {/* Input */}
        <View className="flex-row items-end px-4 pb-4 gap-2 bg-white border-t border-gray-100 pt-3">
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-gray-900 text-sm"
            value={input}
            onChangeText={setInput}
            placeholder="Ask your coach anything..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            style={{ maxHeight: 100 }}
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Send size={18} color={input.trim() ? '#ffffff' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ScrollableChips({ items, onSelect }: { items: string[]; onSelect: (s: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {items.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onSelect(item)}
            className="bg-blue-50 border border-blue-100 rounded-full px-3 py-2"
          >
            <Text className="text-blue-700 text-xs">{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
