// Word Wizards – Setup screen
// Step 1: Add players & assign teams (A / B)
// Step 2: Choose categories, game modes, adjust settings

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme, gameColors } from '../src/systems/ThemeSystem';
import {
  CATEGORIES,
  GAME_MODES,
  CategoryId,
  GameModeId
} from '../src/games/word-wizards/content';

const accent = gameColors.word_wizards;
const TEAM_A_COLOR = '#F5A623';
const TEAM_B_COLOR = '#7C5CFC';
const CARD_BG = '#1A1A1A';

interface PlayerEntry {
  name: string;
  team: 'A' | 'B';
}

export default function WordWizardsSetupScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // Step tracking
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 – players
  const [players, setPlayers] = useState<PlayerEntry[]>([
    { name: '', team: 'A' },
    { name: '', team: 'A' },
    { name: '', team: 'B' },
    { name: '', team: 'B' }
  ]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Step 2 – settings
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(['classics']);
  const [selectedModes, setSelectedModes] = useState<GameModeId[]>(['explain']);
  const [modesExpanded, setModesExpanded] = useState(false);
  const [roundLength, setRoundLength] = useState(60);
  const [pointsToWin, setPointsToWin] = useState(60);

  // UI
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  // ── Player helpers ──────────────────────────────────────────────────────
  const handleNameChange = (i: number, name: string) => {
    const copy = [...players];
    copy[i] = { ...copy[i], name };
    setPlayers(copy);
    if (error) setError(null);
  };

  const toggleTeam = (i: number) => {
    const copy = [...players];
    copy[i] = { ...copy[i], team: copy[i].team === 'A' ? 'B' : 'A' };
    setPlayers(copy);
  };

  const addPlayer = () => {
    // alternate default team
    const lastTeam = players.length > 0 ? players[players.length - 1].team : 'A';
    setPlayers(prev => [...prev, { name: '', team: lastTeam === 'A' ? 'B' : 'A' }]);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
      const idx = players.length;
      setTimeout(() => inputRefs.current[idx]?.focus(), 150);
    }, 100);
  };

  const removePlayer = (i: number) => {
    if (players.length <= 4) return;
    setPlayers(prev => prev.filter((_, idx) => idx !== i));
  };

  // ── Step 2 helpers ──────────────────────────────────────────────────────
  const toggleCategory = (id: CategoryId) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleMode = (id: GameModeId) => {
    setSelectedModes(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // at least one
        return prev.filter(m => m !== id);
      }
      return [...prev, id];
    });
  };

  // ── Navigation ──────────────────────────────────────────────────────────
  const handleStep1Next = () => {
    const empty = players.filter(p => !(p.name && p.name.trim())).length;
    if (empty > 0) {
      setError(empty === 1 ? 'One player has no name' : `${empty} players have no name`);
      return;
    }
    const teamA = players.filter(p => p.team === 'A').length;
    const teamB = players.filter(p => p.team === 'B').length;
    if (teamA === 0 || teamB === 0) {
      setError('Each team needs at least 1 player');
      return;
    }
    setError(null);
    setStep(2);
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: false }), 50);
  };

  const handleStartGame = () => {
    if (selectedCategories.length === 0) {
      setError('Select at least one category');
      return;
    }
    if (selectedModes.length === 0) {
      setError('Select at least one game mode');
      return;
    }
    setError(null);
    router.push({
      pathname: '/word-wizards',
      params: {
        players: JSON.stringify(players.map(p => ({ name: p.name.trim(), team: p.team }))),
        categories: JSON.stringify(selectedCategories),
        modes: JSON.stringify(selectedModes),
        roundLength: String(roundLength),
        pointsToWin: String(pointsToWin)
      }
    } as any);
  };

  // ── Category icon helper ────────────────────────────────────────────────
  const catIcon = (id: CategoryId): keyof typeof Ionicons.glyphMap => {
    switch (id) {
      case 'classics': return 'dice-outline';
      case 'junior':   return 'happy-outline';
      case 'experts':  return 'school-outline';
      default:         return 'help-outline';
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (step === 2 ? setStep(1) : router.back())}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color={accent} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Word Wizards</Text>
          <Pressable onPress={() => setShowRules(true)} hitSlop={12}>
            <Ionicons name="help-circle-outline" size={22} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 ? renderStep1() : renderStep2()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable
            style={styles.startBtn}
            onPress={step === 1 ? handleStep1Next : handleStartGame}
          >
            <Text style={styles.startBtnText}>
              {step === 1 ? 'Start Game' : 'Next'}
            </Text>
          </Pressable>
          {step === 1 && (
            <Pressable style={styles.addBtn} onPress={addPlayer}>
              <Ionicons name="add" size={28} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Rules modal */}
      <Modal visible={showRules} transparent animationType="fade" onRequestClose={() => setShowRules(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowRules(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to Play</Text>
              <Pressable onPress={() => setShowRules(false)} hitSlop={12}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </Pressable>
            </View>
            <Text style={styles.modalBody}>
              Split into two teams. Pick game modes (Explain, Act, Draw, Hum, One Word).
              Each player gets 60 seconds to express words while their team guesses. +1 correct, −1 wrong, 3 skips per round.
              Team with most points wins!
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 1 – Add players & assign teams
  // ═══════════════════════════════════════════════════════════════════════════
  function renderStep1() {
    return (
      <>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Add players</Text>
          <Text style={styles.reorderLabel}>
            <Ionicons name="swap-vertical-outline" size={14} color={theme.colors.textMuted} />
            {'  Reorder'}
          </Text>
        </View>

        <View style={styles.playerList}>
          {players.map((p, i) => (
            <View key={i} style={styles.playerRow}>
              <TextInput
                ref={ref => { inputRefs.current[i] = ref; }}
                style={styles.playerInput}
                value={p.name}
                onChangeText={t => handleNameChange(i, t)}
                placeholder={`Player ${i + 1}`}
                placeholderTextColor={theme.colors.textMuted}
                returnKeyType="next"
                onSubmitEditing={() => inputRefs.current[i + 1]?.focus()}
              />
              {players.length > 4 && (
                <Pressable onPress={() => removePlayer(i)} style={styles.removeBtn} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                </Pressable>
              )}
              <View style={styles.teamToggle}>
                <Pressable
                  onPress={() => { if (p.team !== 'A') toggleTeam(i); }}
                  style={[
                    styles.teamBtn,
                    p.team === 'A' && { backgroundColor: TEAM_A_COLOR }
                  ]}
                >
                  <Text style={[styles.teamBtnText, p.team === 'A' && { color: '#000' }]}>A</Text>
                </Pressable>
                <Pressable
                  onPress={() => { if (p.team !== 'B') toggleTeam(i); }}
                  style={[
                    styles.teamBtn,
                    p.team === 'B' && { backgroundColor: TEAM_B_COLOR }
                  ]}
                >
                  <Text style={[styles.teamBtnText, p.team === 'B' && { color: '#fff' }]}>B</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP 2 – Categories, modes, settings
  // ═══════════════════════════════════════════════════════════════════════════
  function renderStep2() {
    return (
      <>
        {/* Category chips */}
        <View style={styles.catRow}>
          {CATEGORIES.map(cat => {
            const selected = selectedCategories.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                onPress={() => toggleCategory(cat.id)}
                style={[styles.catChip, selected && styles.catChipSelected]}
              >
                {selected && (
                  <Ionicons name="checkmark-circle" size={16} color={accent} style={{ marginRight: 4 }} />
                )}
                <Ionicons
                  name={catIcon(cat.id) as any}
                  size={28}
                  color={selected ? accent : theme.colors.textSecondary}
                />
                <Text style={[styles.catChipText, selected && { color: theme.colors.text }]}>
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Game Modes */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Select Game Modes</Text>
        <Pressable
          style={styles.modesHeader}
          onPress={() => setModesExpanded(prev => !prev)}
        >
          <Text style={styles.modesHeaderText}>
            {selectedModes.map(m => GAME_MODES.find(gm => gm.id === m)?.name).join(', ')}
          </Text>
          <Ionicons
            name={modesExpanded ? 'chevron-up' : 'chevron-forward'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
        {modesExpanded && (
          <View style={styles.modesListCard}>
            {GAME_MODES.map(mode => {
              const sel = selectedModes.includes(mode.id);
              return (
                <Pressable
                  key={mode.id}
                  style={styles.modeRow}
                  onPress={() => toggleMode(mode.id)}
                >
                  <Ionicons
                    name={sel ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={sel ? accent : theme.colors.textSecondary}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modeName}>{mode.name}</Text>
                    <Text style={styles.modeDesc}>{mode.description}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Settings */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Adjust game settings</Text>
        <View style={styles.settingsCard}>
          {/* Round length */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Round length in seconds</Text>
            <View style={styles.counter}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setRoundLength(prev => Math.max(15, prev - 15))}
              >
                <Ionicons name="remove" size={18} color={theme.colors.text} />
              </Pressable>
              <Text style={styles.counterVal}>{roundLength}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setRoundLength(prev => Math.min(180, prev + 15))}
              >
                <Ionicons name="add" size={18} color={theme.colors.text} />
              </Pressable>
            </View>
          </View>
          <View style={styles.divider} />
          {/* Points to win */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Points to win</Text>
            <View style={styles.counter}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setPointsToWin(prev => Math.max(10, prev - 10))}
              >
                <Ionicons name="remove" size={18} color={theme.colors.text} />
              </Pressable>
              <Text style={styles.counterVal}>{pointsToWin}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setPointsToWin(prev => Math.min(200, prev + 10))}
              >
                <Ionicons name="add" size={18} color={theme.colors.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </>
    );
  }
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: theme.spacing.sm
  },
  backBtn: { padding: theme.spacing.xs, width: 40 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },

  // Section
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
  sectionLabel: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500', marginBottom: theme.spacing.md },
  reorderLabel: { fontSize: 13, color: theme.colors.textMuted },

  // Player list
  playerList: { gap: theme.spacing.sm },
  playerRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG, borderRadius: theme.borderRadius.md,
    paddingLeft: theme.spacing.md, paddingRight: 6, minHeight: 56
  },
  playerInput: { flex: 1, fontSize: 16, color: theme.colors.text, paddingVertical: theme.spacing.sm },
  removeBtn: { padding: 6, marginRight: 2 },
  teamToggle: { flexDirection: 'row', gap: 4, marginLeft: 8 },
  teamBtn: {
    width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#333'
  },
  teamBtnText: { fontSize: 14, fontWeight: '700', color: theme.colors.textMuted },

  // Category chips
  catRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  catChip: {
    flex: 1, alignItems: 'center', padding: theme.spacing.md, borderRadius: theme.borderRadius.md,
    backgroundColor: CARD_BG, borderWidth: 2, borderColor: 'transparent', gap: 6
  },
  catChipSelected: { borderColor: accent, backgroundColor: '#2A2000' },
  catChipText: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },

  // Modes
  modesHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: CARD_BG, padding: theme.spacing.md, borderRadius: theme.borderRadius.md
  },
  modesHeaderText: { fontSize: 15, color: theme.colors.text, fontWeight: '500' },
  modesListCard: { backgroundColor: CARD_BG, borderRadius: theme.borderRadius.md, padding: theme.spacing.sm, marginTop: 4, gap: 4 },
  modeRow: { flexDirection: 'row', alignItems: 'flex-start', padding: theme.spacing.sm },
  modeName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  modeDesc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

  // Settings card
  settingsCard: { backgroundColor: CARD_BG, borderRadius: theme.borderRadius.md, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md
  },
  settingLabel: { fontSize: 15, color: theme.colors.text, fontWeight: '500', flex: 1 },
  divider: { height: 1, backgroundColor: '#333', marginHorizontal: theme.spacing.md },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 17, borderWidth: 1.5,
    borderColor: theme.colors.textSecondary, alignItems: 'center', justifyContent: 'center'
  },
  counterVal: { fontSize: 17, fontWeight: '700', color: theme.colors.text, minWidth: 28, textAlign: 'center' },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  startBtn: { flex: 1, backgroundColor: accent, paddingVertical: 16, borderRadius: theme.borderRadius.full, alignItems: 'center' },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#000' },
  addBtn: {
    width: 52, height: 52, borderRadius: 26, borderWidth: 2,
    borderColor: theme.colors.textSecondary, alignItems: 'center', justifyContent: 'center'
  },
  errorText: { fontSize: 13, color: accent, textAlign: 'center', marginTop: 8, fontWeight: '500' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg },
  modalContent: { backgroundColor: theme.colors.card, borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, width: '100%', maxWidth: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
  modalBody: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 }
});
