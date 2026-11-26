import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { User, LogIn } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MIN_PASSWORD_LENGTH = 6;

function describeAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Email or password is incorrect.';
  if (lower.includes('already registered')) return 'An account with this email already exists. Try signing in.';
  if (lower.includes('password')) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return 'Something went wrong. Please check your connection and try again.';
}

export function AuthForm() {
  const navigation = useNavigation<Nav>();
  const { savePreferences } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignIn = mode === 'signin';

  const createProfile = async (userId: string, displayName: string) => {
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: userId,
      name: displayName,
      notifications: true,
      updated_at: new Date().toISOString(),
    });
    if (profileError) {
      setNotice(
        'Account created, but your name could not be saved. Finish setting up your profile in Settings.'
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!isSignIn && !trimmedName) {
      setError('Enter your name to create an account.');
      return;
    }
    if (!trimmedEmail || password.length < MIN_PASSWORD_LENGTH) {
      setError(`Enter your email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    const result = isSignIn
      ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      : await supabase.auth.signUp({ email: trimmedEmail, password });

    if (result.error) {
      setError(describeAuthError(result.error.message));
      setIsSubmitting(false);
      return;
    }

    if (!isSignIn && result.data.user) {
      await createProfile(result.data.user.id, trimmedName);
      await savePreferences({
        goals: [],
        sports: [],
        skill_level: null,
        equipment: [],
        sessions_per_week: null,
        session_minutes: null,
      });
    }

    navigation.navigate('MainTabs' as never);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="flex-1 items-center justify-center px-6 py-10">
        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
          {isSignIn ? <LogIn size={28} color="#3b82f6" /> : <User size={28} color="#3b82f6" />}
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </Text>
        <Text className="text-sm text-gray-500 text-center mb-6">
          {isSignIn
            ? 'Sign in to pick up your training where you left off.'
            : 'Your workouts, nutrition, and progress stay in sync on every device.'}
        </Text>

        <View className="w-full max-w-sm">
          {!isSignIn && (
            <TextInput
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm mb-3"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9ca3af"
              autoCapitalize="words"
              textContentType="name"
            />
          )}
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm mb-3"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm mb-3"
            value={password}
            onChangeText={setPassword}
            placeholder={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}
            placeholderTextColor="#9ca3af"
            secureTextEntry
            textContentType={isSignIn ? 'password' : 'newPassword'}
          />

          {error && <Text className="text-sm text-red-600 mb-3">{error}</Text>}
          {notice && <Text className="text-sm text-amber-600 mb-3">{notice}</Text>}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-500 rounded-xl py-4 items-center mb-4"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {isSignIn ? 'Login' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setMode(isSignIn ? 'signup' : 'signin');
              setError(null);
              setNotice(null);
            }}
            className="items-center"
          >
            <Text className="text-blue-600 text-sm">
              {isSignIn ? 'New here? Create an account' : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
