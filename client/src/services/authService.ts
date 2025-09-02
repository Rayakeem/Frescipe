import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// WebBrowser 설정 (OAuth 완료 후 앱으로 돌아오기 위함)
WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  success: boolean;
  user: {
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
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export type SocialProvider = 'google' | 'kakao' | 'naver';

export class AuthService {
  /**
   * 소셜 로그인 URL 생성
   */
  private static getSocialLoginUrl(provider: SocialProvider): string {
    return `${API_BASE_URL}/auth/${provider}`;
  }

  /**
   * 리다이렉트 URI 생성
   */
  private static getRedirectUri(): string {
    if (Platform.OS === 'web') {
      return `${window.location.origin}/auth/callback`;
    }
    
    // 모바일 앱의 경우 커스텀 스킴 사용
    return AuthSession.makeRedirectUri({
      scheme: 'frescipe',
      path: 'auth/callback'
    });
  }

  /**
   * 소셜 로그인 (OAuth)
   */
  static async loginWithSocial(provider: SocialProvider): Promise<LoginResponse> {
    try {
      const redirectUri = this.getRedirectUri();
      const authUrl = `${this.getSocialLoginUrl(provider)}?redirect_uri=${encodeURIComponent(redirectUri)}`;

      console.log(`${provider} 로그인 시작:`, authUrl);

      // OAuth 세션 시작
      const result = await (AuthSession as any).startAsync({
        authUrl,
        returnUrl: redirectUri
      });

      console.log('OAuth 결과:', result);

      if (result.type === 'success') {
        // URL에서 토큰과 사용자 정보 추출
        const { url } = result;
        const urlParams = new URLSearchParams(url.split('?')[1]);
        
        const token = urlParams.get('token');
        const userDataString = urlParams.get('user');

        if (!token || !userDataString) {
          throw new Error('로그인 응답에서 필요한 정보를 찾을 수 없습니다.');
        }

        const userData = JSON.parse(decodeURIComponent(userDataString));

        // 서버에서 완전한 로그인 정보 가져오기
        const loginData = await this.getLoginData(token);

        return {
          success: true,
          user: loginData.user,
          tokens: loginData.tokens
        };
      } else if (result.type === 'error') {
        throw new Error(`로그인 오류: ${result.errorCode}`);
      } else {
        throw new Error('로그인이 취소되었습니다.');
      }
    } catch (error) {
      console.error(`${provider} 로그인 실패:`, error);
      throw error;
    }
  }

  /**
   * 토큰으로 로그인 데이터 가져오기
   */
  private static async getLoginData(accessToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();

      return {
        success: true,
        user: data.user,
        tokens: {
          accessToken,
          refreshToken: '', // 서버에서 제공되지 않으면 빈 문자열
          expiresIn: 15 * 60 // 15분
        }
      };
    } catch (error) {
      console.error('로그인 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('토큰 갱신에 실패했습니다.');
      }

      const data = await response.json();

      if (!data.success || !data.accessToken) {
        throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
      }

      return {
        accessToken: data.accessToken,
        expiresIn: data.expiresIn
      };
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  }

  /**
   * 로그아웃
   */
  static async logout(accessToken: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('서버 로그아웃 요청 실패:', error);
      // 서버 로그아웃 실패해도 로컬에서는 로그아웃 처리
    }
  }

  /**
   * 사용자 프로필 조회
   */
  static async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('프로필 조회에 실패했습니다.');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('프로필 조회 응답이 올바르지 않습니다.');
      }

      return data.user;
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateUserProfile(
    accessToken: string,
    updateData: {
      displayName?: string;
      bio?: string;
      allergies?: any[];
      dietaryPreferences?: any[];
      healthGoals?: string[];
      settings?: any;
    }
  ): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('프로필 업데이트 응답이 올바르지 않습니다.');
      }

      return data.user;
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      throw error;
    }
  }

  /**
   * 인증 상태 확인
   */
  static async checkAuthStatus(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return false;
    }
  }
}
