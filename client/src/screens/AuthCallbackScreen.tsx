import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * OAuth 콜백 처리 화면 (웹 전용)
 */
export const AuthCallbackScreen: React.FC = () => {
  const { login } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'web') {
      handleWebCallback();
    }
  }, []);

  const handleWebCallback = async () => {
    try {
      // URL에서 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userDataString = urlParams.get('user');

      if (!token || !userDataString) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }

      const userData = JSON.parse(decodeURIComponent(userDataString));

      // 토큰과 사용자 정보로 로그인 처리
      await login(userData, token, ''); // refreshToken은 서버에서 쿠키로 설정됨

      // 메인 화면으로 이동
      navigation.navigate('Home' as never);
      
    } catch (error) {
      console.error('OAuth 콜백 처리 오류:', error);
      // 로그인 화면으로 돌아가기
      navigation.navigate('Login' as never);
    }
  };

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#fff'
    }}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={{ marginTop: 16, fontSize: 16 }}>
        로그인 처리 중...
      </Text>
    </View>
  );
};

export default AuthCallbackScreen;
