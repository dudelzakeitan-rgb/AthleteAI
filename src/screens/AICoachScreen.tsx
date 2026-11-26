import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot, User, Apple } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { askCoach, toCoachPreferences } from '../lib/coachApi';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { CoachSignInForm } from '../components/CoachSignInForm';
import {
  FoodEntryModal, parseMealMarker, stripMealMarker, MealType,
} from '../components/FoodEntryForm';

const MAX_HISTORY_MESSAGES = 12;

const SUGGESTIONS = [
  'How can I improve my freestyle technique?',
  'What should I eat before training?',
  'How do I build more endurance?',
  'What exercises help with injury prevention?',
];

interface ParsedMeal {
  name: string;
  calories: number;
}

function mealForMessage(messages: ChatMessage[], messageId: string): ParsedMeal | null {
  const msg = messages.find(m => m.id === messageId);
  return msg ? parseMealMarker(msg.content) : null;
}

export function AICoachScreen() {
  const { chatMessages, addChatMessage, preferences, addFoodEntry } = useApp();
  const { session, isLoading: isSessionLoading } = useSupabaseSession();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [parsedMeal, setParsedMeal] = useState<ParsedMeal | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isTyping || !session) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    const history = [...chatMessages, userMsg]
      .slice(-MAX_HISTORY_MESSAGES)
      .map(({ role, content: turn }) => ({ role, content: turn }));

    addChatMessage(userMsg);
    setInput('');
    setError(null);
    setSaveNotice(null);
    setIsTyping(true);

    try {
      const reply = await askCoach(history, toCoachPreferences(preferences));
      addChatMessage({
        id: (Date.now() + 1).toString(),
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

  const handleAddToNutrition = (meal: ParsedMeal) => {
    setParsedMeal(meal);
    setSaveNotice(null);
    setFormVisible(true);
  };

  const handleFormSubmit = async (result: { name: string; calories: number; mealType: MealType; isEstimate: boolean }) => {
    const created = await addFoodEntry({
      date: new Date().toISOString().split('T')[0],
      mealType: result.mealType,
      name: result.name,
      calories: result.calories,
      isEstimate: result.isEstimate,
    });
    if (created) {
      setSaveNotice(`"${result.name}" added to your Nutrition log.`);
      return true;
    }
    return false;
  };

  const allMessages: ChatMessage[] = chatMessages.length === 0
    ? [{
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your AI sports coach. I'm here to help you improve your training, nutrition, and technique. What would you like to work on today?`,
        timestamp: new Date().toISOString(),
      }]
    : chatMessages;

  if (isSessionLoading) {
    return <SafeAreaView className="flex-1 bg-gray-50" edges={['top']} />;
  }

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <CoachSignInForm />
      </SafeAreaView>
    );
  }

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
          renderItem={({ item }) => {
            const meal = item.role === 'assistant' ? parseMealMarker(item.content) : null;
            const visibleContent = item.role === 'assistant' ? stripMealMarker(item.content) : item.content;
            if (item.role === 'assistant' && !visibleContent.trim() && !meal) return null;
            return (
              <View className={`flex-row items-start mb-4 ${item.role === 'user' ? 'justify-end' : ''}`}>
                {item.role === 'assistant' && (
                  <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2 mt-1">
                    <Bot size={16} color="#3b82f6" />
                  </View>
                )}
                <View style={{ maxWidth: '75%' }}>
                  <View
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      item.role === 'user' ? 'bg-blue-500' : 'bg-white'
                    }`}
                  >
                    <Text className={`text-sm leading-relaxed ${item.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {visibleContent}
                    </Text>
                  </View>
                  {meal && (
                    <TouchableOpacity
                      onPress={() => handleAddToNutrition(meal)}
                      className="mt-2 bg-emerald-500 rounded-xl px-4 py-2.5 flex-row items-center"
                    >
                      <Apple size={15} color="#ffffff" />
                      <Text className="text-white font-semibold text-sm ml-2">
                        Add to Nutrition ({meal.calories} kcal)
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {item.role === 'user' && (
                  <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center ml-2 mt-1">
                    <User size={16} color="#ffffff" />
                  </View>
                )}
              </View>
            );
          }}
        />

        {/* Suggestions */}
        {chatMessages.length === 0 && (
          <View className="px-4 mb-2">
            <Text className="text-xs text-gray-400 mb-2">Suggested topics</Text>
            <ScrollableChips items={SUGGESTIONS} onSelect={sendMessage} />
          </View>
        )}

        {saveNotice && (
          <View className="mx-4 mb-2 bg-emerald-50 rounded-xl px-4 py-3">
            <Text className="text-emerald-700 text-sm">{saveNotice}</Text>
          </View>
        )}

        {error && <Text className="text-sm text-red-600 px-4 pb-2">{error}</Text>}

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
            disabled={!input.trim() || isTyping}
            className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Send size={18} color={input.trim() ? '#ffffff' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <FoodEntryModal
        key={`coach-meal-${formVisible}`}
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        initial={
          parsedMeal
            ? { name: parsedMeal.name, calories: parsedMeal.calories, mealType: 'lunch' as MealType, isEstimate: true }
            : undefined
        }
        onSubmit={handleFormSubmit}
      />
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
