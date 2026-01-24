// Paranoia game screen
// Expo Router compatible screen

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ParanoiaGame from '../src/games/paranoia/ParanoiaGame';

export default function ParanoiaGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    players?: string;
    packs?: string;
  }>();

  const players = params.players ? JSON.parse(params.players) : [];
  const selectedPacks = params.packs ? JSON.parse(params.packs) : [];

  const handleExit = () => {
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <ParanoiaGame
        players={players}
        selectedPacks={selectedPacks}
        onExit={handleExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
});
