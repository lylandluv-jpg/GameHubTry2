// Root navigator implementing the universal lifecycle
// Based on specs/core/GameHubMaster.sdd.md Section 3

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { theme } from '../systems/ThemeSystem';
import { GameSessionProvider } from '../systems/GameSessionContext';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import GameSetupScreen from '../screens/GameSetupScreen';
import RulesPreviewScreen from '../screens/RulesPreviewScreen';
import ResultScreen from '../screens/ResultScreen';

// Import game screens
import TruthOrDareGame from '../games/truth-or-dare/TruthOrDareGame';
import NeverHaveIEverGame from '../games/never-have-i-ever/NeverHaveIEverGame';
import WouldYouRatherGame from '../games/would-you-rather/WouldYouRatherGame';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <GameSessionProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.backgroundDark
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              ...theme.typography.h2,
              fontWeight: '600'
            },
            contentStyle: {
              backgroundColor: theme.colors.background
            },
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GameSetup"
            component={GameSetupScreen}
            options={{ title: 'Game Setup' }}
          />
          <Stack.Screen
            name="RulesPreview"
            component={RulesPreviewScreen}
            options={{ title: 'Game Rules' }}
          />
          <Stack.Screen
            name="TruthOrDareGame"
            component={TruthOrDareGame}
            options={{ headerShown: false, orientation: 'all' }}
          />
          <Stack.Screen
            name="NeverHaveIEverGame"
            component={NeverHaveIEverGame}
            options={{ headerShown: false, orientation: 'all' }}
          />
          <Stack.Screen
            name="WouldYouRatherGame"
            component={WouldYouRatherGame}
            options={{ headerShown: false, orientation: 'all' }}
          />
          <Stack.Screen
            name="ResultScreen"
            component={ResultScreen}
            options={{ title: 'Results' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameSessionProvider>
  );
};

export default RootNavigator;
