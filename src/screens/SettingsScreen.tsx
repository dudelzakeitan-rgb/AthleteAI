import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, User, Save, Check, LogOut, AlertCircle } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { userProfile, setUserProfile, session } = useApp();

  const [name, setName] = useState(userProfile?.name || '');
  const [age, setAge] = useState(userProfile?.age?.toString() || '');
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '');
  const [height, setHeight] = useState(userProfile?.height?.toString() || '');
  const [goal, setGoal] = useState(userProfile?.goal || '');
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaveFailed(true);
      setTimeout(() => setSaveFailed(false), 3000);
      return;
    }
    const stored = (userProfile ?? {}) as Record<string, any>;
    const now = new Date().toISOString();
    // user_profiles columns are snake_case; unknown keys are rejected by the database
    const profile = {
      id: auth.user.id,
      name: name.trim(),
      age: Number(age) || 25,
      weight: Number(weight) || 70,
      height: Number(height) || 170,
      sport: stored.sport || 'swimming',
      goal,
      skill_level: stored.skill_level || 'intermediate',
      equipment: stored.equipment || [],
      notifications: stored.notifications ?? true,
      updated_at: now,
    };

    const { error } = await supabase.from('user_profiles').upsert(profile);
    if (error) {
      setSaveFailed(true);
      setTimeout(() => setSaveFailed(false), 3000);
      return;
    }

    setUserProfile({
      ...stored,
      ...profile,
      skillLevel: profile.skill_level,
      createdAt: (stored.created_at as string) || now,
      updatedAt: now,
    } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.navigate('MainTabs' as any);
  };

  const fields = [
    { label: 'Full Name', value: name, onChange: setName, placeholder: 'John Doe', keyboard: 'default' as const },
    { label: 'Age', value: age, onChange: setAge, placeholder: '25', keyboard: 'number-pad' as const },
    { label: 'Weight (kg)', value: weight, onChange: setWeight, placeholder: '75', keyboard: 'decimal-pad' as const },
    { label: 'Height (cm)', value: height, onChange: setHeight, placeholder: '175', keyboard: 'decimal-pad' as const },
    { label: 'Training Goal', value: goal, onChange: setGoal, placeholder: 'e.g., Qualify for nationals', keyboard: 'default' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={['#0f172a', '#1e3a8a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-5 pt-4 pb-8">
        <TouchableOpacity className="flex-row items-center mb-4" onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#ffffff" />
          <Text className="text-white ml-1">Back</Text>
        </TouchableOpacity>
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mr-4">
            <User size={24} color="#ffffff" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">{name || 'Your Profile'}</Text>
            <Text className="text-white/60 text-sm">Athlete settings</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white rounded-2xl p-5 gap-4">
          <Text className="font-bold text-gray-900 text-base">Profile Information</Text>
          {fields.map(f => (
            <View key={f.label}>
              <Text className="text-sm text-gray-600 mb-1">{f.label}</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                value={f.value}
                onChangeText={f.onChange}
                placeholder={f.placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={f.keyboard}
              />
            </View>
          ))}
        </View>

        {/* BMI card */}
        {weight && height && (
          <View className="bg-blue-50 rounded-2xl p-4 mt-3">
            <Text className="text-blue-900 font-semibold mb-1">BMI</Text>
            <Text className="text-blue-600 text-2xl font-bold">
              {(Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)}
            </Text>
            <Text className="text-blue-500 text-sm">
              {(() => {
                const bmi = Number(weight) / Math.pow(Number(height) / 100, 2);
                return bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese';
              })()}
            </Text>
          </View>
        )}

        <View className="bg-amber-50 rounded-2xl p-4 mt-3">
          <Text className="text-amber-800 font-semibold mb-1">App Version</Text>
          <Text className="text-amber-600 text-sm">AthleteAI v1.0.0 · Expo Go Edition</Text>
        </View>

        {saveFailed && (
          <View className="bg-red-50 rounded-2xl p-4 mt-3">
            <Text className="text-red-700 font-semibold mb-1">Save failed</Text>
            <Text className="text-red-600 text-sm">Your profile could not be saved. Check your connection and try again.</Text>
          </View>
        )}

        {session && (
          <TouchableOpacity onPress={handleSignOut} className="mt-3">
            <View className="bg-white rounded-2xl p-4 flex-row items-center border border-red-100">
              <LogOut size={18} color="#ef4444" />
              <Text className="text-red-500 font-semibold ml-3">Sign Out</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-white border-t border-gray-100">
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <LinearGradient
            colors={saved ? ['#10b981', '#059669'] : saveFailed ? ['#ef4444', '#dc2626'] : ['#1d4ed8', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl py-4 flex-row items-center justify-center"
          >
            {saveFailed ? (
              <>
                <AlertCircle size={18} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Not Saved</Text>
              </>
            ) : saved ? (
              <>
                <Check size={18} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Saved!</Text>
              </>
            ) : (
              <>
                <Save size={18} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Save Profile</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
