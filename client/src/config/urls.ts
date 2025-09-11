import { Platform } from 'react-native';
import Constants from 'expo-constants';

// 소셜 로그인 제공자 타입 정의
export type SocialProvider = 'google' | 'kakao' | 'naver';

/**
 * API 및 URL 설정
 */
export class URLConfig {
  // 서버 API 기본 URL
  static readonly API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  // OAuth 리다이렉트 URI 설정
  static readonly OAUTH_REDIRECT_URIS = {
    // 웹 환경
    web: {
      callback: '/auth/callback',
      success: '/auth/success',
      error: '/auth/error'
    },
    
    // 모바일 앱 환경
    mobile: {
      scheme: 'frescipe',
      callback: 'frescipe://auth/callback',
      success: 'frescipe://auth/success', 
      error: 'frescipe://auth/error'
    }
  };

  // 소셜 로그인 제공자별 URL
  static readonly SOCIAL_LOGIN_URLS = {
    naver: `${this.API_BASE_URL}/auth/naver`,
    kakao: `${this.API_BASE_URL}/auth/kakao`,
    google: `${this.API_BASE_URL}/auth/google`
  };

  /**
   * 현재 플랫폼에 맞는 리다이렉트 URI 반환
   */
  static getRedirectUri(type: 'callback' | 'success' | 'error' = 'callback'): string {
    if (Platform.OS === 'web') {
      // 웹 환경: 현재 도메인 + 경로
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${this.OAUTH_REDIRECT_URIS.web[type]}`;
      }
      // SSR 환경 대비
      return `http://localhost:3001${this.OAUTH_REDIRECT_URIS.web[type]}`;
    }
    
    // 모바일 앱 환경: 커스텀 스킴
    return this.OAUTH_REDIRECT_URIS.mobile[type];
  }

  /**
   * 소셜 로그인 URL 생성 (리다이렉트 URI 포함)
   */
  static getSocialLoginUrl(provider: SocialProvider): string {
    const baseUrl = this.SOCIAL_LOGIN_URLS[provider];
    const redirectUri = this.getRedirectUri('callback');
    return `${baseUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  /**
   * API 엔드포인트 URL 생성
   */
  static getApiUrl(endpoint: string): string {
    // endpoint가 '/'로 시작하지 않으면 추가
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.API_BASE_URL}${cleanEndpoint}`;
  }

  /**
   * 개발 환경 여부 확인
   */
  static get isDevelopment(): boolean {
    return __DEV__ || process.env.NODE_ENV === 'development';
  }

  /**
   * 프로덕션 환경 여부 확인  
   */
  static get isProduction(): boolean {
    return !this.isDevelopment;
  }

  /**
   * 현재 플랫폼 정보
   */
  static get platformInfo() {
    return {
      os: Platform.OS,
      version: Platform.Version,
      isWeb: Platform.OS === 'web',
      isMobile: Platform.OS !== 'web',
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android'
    };
  }
}

// 편의를 위한 단축 함수들
export const getApiUrl = URLConfig.getApiUrl.bind(URLConfig);
export const getRedirectUri = URLConfig.getRedirectUri.bind(URLConfig);
export const getSocialLoginUrl = URLConfig.getSocialLoginUrl.bind(URLConfig);

// 자주 사용되는 URL들을 상수로 export
export const API_BASE_URL = URLConfig.API_BASE_URL;
export const OAUTH_CALLBACK_URI = URLConfig.getRedirectUri('callback');
export const OAUTH_SUCCESS_URI = URLConfig.getRedirectUri('success');
export const OAUTH_ERROR_URI = URLConfig.getRedirectUri('error');

export default URLConfig;
