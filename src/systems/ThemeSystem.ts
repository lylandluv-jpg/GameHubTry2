// Theme system for consistent styling across the app
// Based on specs/core/GameHubMaster.sdd.md Section 7

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Global dark gradient base
export const theme = {
  colors: {
    background: '#0F0F1A',
    backgroundDark: '#0A0A12',
    backgroundLight: '#1A1A2E',
    card: '#16213E',
    cardDark: '#0F1829',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textMuted: '#707080',
    success: '#4ECDC4',
    warning: '#F7B731',
    error: '#FF6B6B',
    border: '#2A2A40',
    overlay: 'rgba(0, 0, 0, 0.7)'
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16
    }
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8
    }
  },
  
  gradients: {
    background: ['#0F0F1A', '#1A1A2E'],
    primary: ['#667eea', '#764ba2'],
    success: ['#4ECDC4', '#44A08D'],
    warning: ['#F7B731', '#F79F1F'],
    error: ['#FF6B6B', '#EE5A5A']
  },
  
  dimensions: {
    width,
    height,
    isSmallScreen: width < 375,
    isMediumScreen: width >= 375 && width < 768,
    isLargeScreen: width >= 768
  }
};

// Game-specific accent colors
export const gameColors = {
  simple_would_you_rather: '#8B5CF6',
  simple_truth_or_dare: '#2563EB',
  truth_or_dare: '#FF6B6B',
  never_have_i_ever: '#4ECDC4',
  would_you_rather: '#9B59B6'
};

// Mode-specific accent colors
export const modeColors: Record<string, string> = {
  original: '#3498DB',
  friends: '#9B59B6',
  boyfriend: '#E74C3C',
  girlfriend: '#FF69B4',
  couple: '#FF1493',
  teens: '#1ABC9C',
  party: '#F39C12',
  drunk: '#E67E22',
  dirty: '#C0392B',
  hot: '#FF4500',
  extreme: '#8B0000',
  disgusting: '#556B2F'
};

// Get gradient for a game
export const getGameGradient = (gameId: string): string[] => {
  const baseColor = gameColors[gameId as keyof typeof gameColors] || '#667eea';
  return [baseColor, adjustColor(baseColor, -30)];
};

// Get gradient for a mode
export const getModeGradient = (modeId: string): string[] => {
  const baseColor = modeColors[modeId] || '#3498DB';
  return [baseColor, adjustColor(baseColor, -30)];
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Player avatar colors
export const playerColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];
