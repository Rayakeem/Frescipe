import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage?: string;
  level: string;
  experiencePoints: number;
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
}

export interface AuthState {
  // 상태
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

// 토큰을 안전하게 저장하는 함수
const storeTokensSecurely = async (accessToken: string, refreshToken: string) => {
  // 먼저 AsyncStorage에 저장 (더 안정적)
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error('AsyncStorage 토큰 저장 실패:', error);
  }

  // Keychain에도 저장 시도 (선택적)
  try {
    if (Keychain && typeof Keychain.setInternetCredentials === 'function') {
      await Keychain.setInternetCredentials(
        'frescipe_tokens',
        'access_token',
        accessToken
      );
      await Keychain.setInternetCredentials(
        'frescipe_refresh_tokens',
        'refresh_token',
        refreshToken
      );
    }
  } catch (error) {
    console.warn('Keychain 저장 실패, AsyncStorage 사용:', error.message);
  }
};

// 토큰을 안전하게 불러오는 함수
const getStoredTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  // 먼저 AsyncStorage에서 시도 (더 안정적)
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
  } catch (error) {
    console.error('AsyncStorage에서 토큰 불러오기 실패:', error);
  }

  // Keychain 시도 (선택적)
  try {
    // Keychain이 사용 가능한지 확인
    if (Keychain && typeof Keychain.getInternetCredentials === 'function') {
      const accessTokenCreds = await Keychain.getInternetCredentials('frescipe_tokens');
      const refreshTokenCreds = await Keychain.getInternetCredentials('frescipe_refresh_tokens');
      
      if (accessTokenCreds && refreshTokenCreds) {
        return {
          accessToken: accessTokenCreds.password,
          refreshToken: refreshTokenCreds.password
        };
      }
    }
  } catch (error) {
    console.warn('Keychain 사용 불가, AsyncStorage 사용:', error.message);
  }

  return { accessToken: null, refreshToken: null };
};

// 토큰을 안전하게 삭제하는 함수
const clearStoredTokens = async () => {
  // AsyncStorage에서 삭제
  try {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('AsyncStorage 토큰 삭제 실패:', error);
  }

  // Keychain에서도 삭제 시도 (선택적)
  try {
    if (Keychain && typeof Keychain.resetInternetCredentials === 'function') {
      await Keychain.resetInternetCredentials('frescipe_tokens');
      await Keychain.resetInternetCredentials('frescipe_refresh_tokens');
    }
  } catch (error) {
    console.warn('Keychain 삭제 실패:', error.message);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 액션
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: async (accessToken: string, refreshToken: string) => {
        await storeTokensSecurely(accessToken, refreshToken);
        set({ accessToken, refreshToken });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: async (user: User, accessToken: string, refreshToken: string) => {
        try {
          set({ isLoading: true, error: null });
          
          await storeTokensSecurely(accessToken, refreshToken);
          
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('로그인 처리 실패:', error);
          set({
            error: '로그인 처리 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          // 서버에 로그아웃 요청 (선택사항)
          const { accessToken } = get();
          if (accessToken) {
            try {
              await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                }
              });
            } catch (error) {
              console.error('서버 로그아웃 요청 실패:', error);
            }
          }

          // 로컬 토큰 삭제
          await clearStoredTokens();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('로그아웃 처리 실패:', error);
          set({ isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      refreshAccessToken: async (): Promise<boolean> => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            return false;
          }

          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
          });

          if (!response.ok) {
            throw new Error('토큰 갱신 실패');
          }

          const data = await response.json();
          
          if (data.success && data.accessToken) {
            await storeTokensSecurely(data.accessToken, refreshToken);
            set({ accessToken: data.accessToken });
            return true;
          }

          return false;
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          // 토큰 갱신 실패 시 로그아웃 처리
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 민감한 토큰 정보는 persist에서 제외
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      // 앱 시작 시 토큰 복원
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 저장된 토큰 복원
          getStoredTokens().then(({ accessToken, refreshToken }) => {
            if (accessToken && refreshToken && state.isAuthenticated) {
              state.accessToken = accessToken;
              state.refreshToken = refreshToken;
            } else if (state.isAuthenticated) {
              // 토큰이 없으면 로그아웃 처리
              state.logout();
            }
          });
        }
      }
    }
  )
);
