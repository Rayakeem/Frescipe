import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Button, Card, ActivityIndicator } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { AuthService, SocialProvider } from '../services/authService';
import { theme } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  
  const { login, setError, error, clearError } = useAuthStore();

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setIsLoading(true);
      setLoadingProvider(provider);
      clearError();

      const result = await AuthService.loginWithSocial(provider);
      
      if (result.success) {
        await login(
          result.user,
          result.tokens.accessToken,
          result.tokens.refreshToken
        );
        
        Alert.alert(
          '로그인 성공! 🎉',
          `${result.user.displayName}님, 환영합니다!`,
          [{ text: '확인' }]
        );
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '로그인 중 오류가 발생했습니다.';
      
      setError(errorMessage);
      
      Alert.alert(
        '로그인 실패',
        errorMessage,
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const getSocialButtonConfig = (provider: SocialProvider) => {
    const configs = {
      google: {
        title: 'Google로 계속하기',
        backgroundColor: '#4285F4',
        textColor: '#FFFFFF',
        icon: '🔍' // 실제 앱에서는 Google 아이콘 이미지 사용
      },
      kakao: {
        title: 'Kakao로 계속하기',
        backgroundColor: '#FEE500',
        textColor: '#000000',
        icon: '💬' // 실제 앱에서는 Kakao 아이콘 이미지 사용
      },
      naver: {
        title: 'Naver로 계속하기',
        backgroundColor: '#03C75A',
        textColor: '#FFFFFF',
        icon: '🟢' // 실제 앱에서는 Naver 아이콘 이미지 사용
      }
    };
    
    return configs[provider];
  };

  const renderSocialButton = (provider: SocialProvider) => {
    const config = getSocialButtonConfig(provider);
    const isCurrentLoading = loadingProvider === provider;
    
    return (
      <TouchableOpacity
        key={provider}
        style={[
          styles.socialButton,
          { backgroundColor: config.backgroundColor }
        ]}
        onPress={() => handleSocialLogin(provider)}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isCurrentLoading ? (
          <ActivityIndicator 
            size="small" 
            color={config.textColor} 
            style={styles.buttonIcon}
          />
        ) : (
          <Text style={[styles.buttonIcon, { color: config.textColor }]}>
            {config.icon}
          </Text>
        )}
        <Text style={[styles.socialButtonText, { color: config.textColor }]}>
          {config.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🥗</Text>
          <Text style={styles.logoText}>Frescipe</Text>
        </View>
        <Text style={styles.subtitle}>
          신선한 재료로 만드는{'\n'}건강한 레시피 플랫폼
        </Text>
      </View>

      {/* 로그인 카드 */}
      <Card style={styles.loginCard}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.welcomeText}>환영합니다!</Text>
          <Text style={styles.descriptionText}>
            소셜 계정으로 간편하게 시작하세요
          </Text>

          {/* 에러 메시지 */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialButtonsContainer}>
            {(['google', 'kakao', 'naver'] as SocialProvider[]).map(renderSocialButton)}
          </View>

          {/* 이용약관 */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              로그인하면 Frescipe의{' '}
              <Text style={styles.termsLink}>이용약관</Text>과{' '}
              <Text style={styles.termsLink}>개인정보처리방침</Text>에{'\n'}
              동의하는 것으로 간주됩니다.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* 푸터 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          건강한 식생활의 시작, Frescipe와 함께하세요 🌱
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
  },
  loginCard: {
    margin: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  cardContent: {
    padding: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  termsText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.6,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});
