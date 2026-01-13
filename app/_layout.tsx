import {Stack} from 'expo-router';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GameSessionProvider} from '../src/systems/GameSessionContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameSessionProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="dashboard" options={{headerShown: false}} />
          <Stack.Screen name="game-setup" options={{headerShown: false}} />
          <Stack.Screen name="rules-preview" options={{headerShown: false}} />
          <Stack.Screen name="simple-truth-or-dare" options={{headerShown: false}} />
          <Stack.Screen name="truth-or-dare" options={{headerShown: false}} />
          <Stack.Screen name="never-have-i-ever" options={{headerShown: false}} />
          <Stack.Screen name="would-you-rather" options={{headerShown: false}} />
          <Stack.Screen name="result" options={{headerShown: false}} />
        </Stack>
      </GameSessionProvider>
    </SafeAreaProvider>
  );
}
