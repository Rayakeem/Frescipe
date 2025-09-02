import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/LoginScreen';
import { theme } from '../utils/theme';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, accessToken, refreshAccessToken } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 토큰이 있지만 사용자 정보가 없는 경우 토큰 검증
        if (accessToken && !user) {
          const success = await refreshAccessToken();
          if (!success) {
            console.log('토큰 검증 실패, 로그인 필요');
          }
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [accessToken, user, refreshAccessToken]);

  // 초기화 중이거나 로딩 중인 경우
  if (isInitializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.logoEmoji}>🥗</Text>
          <Text style={styles.logoText}>Frescipe</Text>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>앱을 준비하고 있습니다...</Text>
        </View>
      </View>
    );
  }

  // 인증되지 않은 경우 로그인 화면 표시
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 40,
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
});
