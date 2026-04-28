// User profile: username and avatar (emoji) for settings and multiplayer

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type UserProfileContextType = {
  username: string;
  avatarEmoji: string | null;
  setUsername: (name: string) => void;
  setAvatarEmoji: (emoji: string | null) => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const DEFAULT_USERNAME = '';

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState(DEFAULT_USERNAME);
  const [avatarEmoji, setAvatarEmojiState] = useState<string | null>(null);

  const setUsername = useCallback((name: string) => setUsernameState(name.trim()), []);
  const setAvatarEmoji = useCallback((emoji: string | null) => setAvatarEmojiState(emoji), []);

  return (
    <UserProfileContext.Provider
      value={{ username, avatarEmoji, setUsername, setAvatarEmoji }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile(): UserProfileContextType {
  const ctx = useContext(UserProfileContext);
  if (ctx === undefined) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return ctx;
}
