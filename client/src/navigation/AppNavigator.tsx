import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 스크린 컴포넌트들 (추후 구현)
import { HomeScreen } from '../screens/HomeScreen';
import { RecipeScreen } from '../screens/RecipeScreen';
import { FridgeScreen } from '../screens/FridgeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  Main: undefined;
  RecipeDetail: { recipeId: string };
  CreateRecipe: undefined;
  EditProfile: undefined;
};

export type TabParamList = {
  Home: undefined;
  Recipe: undefined;
  Fridge: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recipe') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Fridge') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: '홈' }}
      />
      <Tab.Screen 
        name="Recipe" 
        component={RecipeScreen} 
        options={{ tabBarLabel: '레시피' }}
      />
      <Tab.Screen 
        name="Fridge" 
        component={FridgeScreen} 
        options={{ tabBarLabel: '냉장고' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: '프로필' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
