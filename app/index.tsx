// App entry point for Expo Router
// Based on specs/core/GameHubMaster.sdd.md

import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useGameSession} from '../src/systems/GameSessionContext';
import {useRouter} from 'expo-router';

export default function Index() {
  const {resetSession} = useGameSession();
  const router = useRouter();

  React.useEffect(() => {
    resetSession();
  }, []);

  const handleGetStarted = () => {
    router.push('/dashboard' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GameHub!</Text>
      <Text style={styles.subtitle}>Your Ultimate Party Game Collection</Text>
      <Pressable style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e94560',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e94560',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
