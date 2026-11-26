import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthForm } from '../components/AuthForm';

export function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-1">
        <AuthForm />
      </View>
    </SafeAreaView>
  );
}
