import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Home, Dumbbell, BarChart3, MessageCircle, MoreHorizontal } from 'lucide-react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { SportsScreen } from '../screens/SportsScreen';
import { SportDetailScreen } from '../screens/SportDetailScreen';
import { QuestionnaireScreen } from '../screens/QuestionnaireScreen';
import { PlanPreviewScreen } from '../screens/PlanPreviewScreen';
import { TrainingPlanScreen } from '../screens/TrainingPlanScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AICoachScreen } from '../screens/AICoachScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { MyProgressScreen } from '../screens/MyProgressScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;
  Onboarding: undefined;
  SportDetail: { sportId: string };
  Questionnaire: { sportId: string; improvementId: string };
  PlanPreview: { sportId: string; improvementId: string };
  TrainingPlan: { sportId: string; improvementId: string };
  MyProgress: undefined;
  Nutrition: undefined;
  Settings: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Sports: undefined;
  Dashboard: undefined;
  Coach: undefined;
  More: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 90 : 72,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sports"
        component={SportsScreen}
        options={{
          tabBarIcon: ({ color }) => <Dumbbell size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <BarChart3 size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Coach"
        component={AICoachScreen}
        options={{
          tabBarLabel: 'AI Coach',
          tabBarIcon: ({ color }) => <MessageCircle size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ color }) => <MoreHorizontal size={26} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8fafc' },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SportDetail" component={SportDetailScreen} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <Stack.Screen name="PlanPreview" component={PlanPreviewScreen} />
      <Stack.Screen name="TrainingPlan" component={TrainingPlanScreen} />
      <Stack.Screen name="MyProgress" component={MyProgressScreen} />
      <Stack.Screen name="Nutrition" component={NutritionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
