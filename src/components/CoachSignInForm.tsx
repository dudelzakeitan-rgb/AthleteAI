import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bot } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

const MIN_PASSWORD_LENGTH = 6;

function describeAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'Email or password is incorrect.';
  if (lower.includes('already registered')) return 'An account with this email already exists. Try signing in.';
  if (lower.includes('password')) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return 'Something went wrong. Please check your connection and try again.';
}

export function CoachSignInForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    const result =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
        : await supabase.auth.signUp({ email: trimmedEmail, password });

    if (result.error) {
      setError(describeAuthError(result.error.message));
    } else if (mode === 'signup' && !result.data.session) {
      setNotice('Account created. You can now sign in.');
      setMode('signin');
      setPassword('');
    }
    setIsSubmitting(false);
  };

  return (
    <View className="flex-1 items-center justify-center px-6 bg-gray-50">
      <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
        <Bot size={28} color="#3b82f6" />
      </View>
      <Text className="text-xl font-bold text-gray-900 mb-1">
        {mode === 'signin' ? 'Sign in to your coach' : 'Create your coach account'}
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        Your conversations with the AI Coach are private to your account.
      </Text>

      <View className="w-full max-w-sm">
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
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          textContentType="password"
          onSubmitEditing={handleSubmit}
        />

        {error && <Text className="text-sm text-red-600 mb-3">{error}</Text>}
        {notice && <Text className="text-sm text-emerald-600 mb-3">{notice}</Text>}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-500 rounded-xl py-3 items-center mb-4"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-sm">
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
            setNotice(null);
          }}
          className="items-center"
        >
          <Text className="text-blue-600 text-sm">
            {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
