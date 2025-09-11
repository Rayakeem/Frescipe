import { Router } from 'express';
import passport from '../config/passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { AuthService } from '../services/authService';

const router = Router();

/**
 * 로그인 페이지 (개발용)
 */
router.get('/login', AuthController.renderLoginPage);

/**
 * 로그인 성공 페이지 (개발용)
 */
router.get('/success', AuthController.renderSuccessPage);

/**
 * Google OAuth 라우트 (임시 주석 처리)
 */
/*
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login?error=google_auth_failed',
    session: false 
  }),
  AuthController.socialLoginCallback
);
*/

/**
 * Kakao OAuth 라우트
 */
router.get('/kakao',
  passport.authenticate('kakao')
);

router.get('/kakao/callback',
  passport.authenticate('kakao', { 
    failureRedirect: '/auth/login?error=kakao_auth_failed',
    session: false 
  }),
  AuthController.socialLoginCallback
);

/**
 * Naver OAuth 라우트
 */
router.get('/naver',
  passport.authenticate('naver')
);

router.get('/naver/callback',
  passport.authenticate('naver', { 
    failureRedirect: '/auth/login?error=naver_auth_failed',
    session: false 
  }),
  AuthController.socialLoginCallback
);

/**
 * 인증 상태 확인
 */
router.get('/me', requireAuth, AuthController.checkAuth);

/**
 * 토큰 갱신
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * 로그아웃
 */
router.post('/logout', requireAuth, AuthController.logout);

/**
 * 사용자 프로필 조회
 */
router.get('/profile', requireAuth, AuthController.getProfile);

/**
 * 사용자 프로필 업데이트
 */
router.put('/profile', requireAuth, AuthController.updateProfile);

/**
 * 소셜 계정 연결 해제
 */
router.delete('/social/:provider', requireAuth, AuthController.unlinkSocialAccount);

/**
 * 계정 삭제
 */
router.delete('/account', requireAuth, AuthController.deleteAccount);

/**
 * 테스트용 더미 로그인 (개발 환경 전용)
 */
router.post('/test-login', async (req, res) => {
  try {
    if (process.env['NODE_ENV'] === 'production') {
      return res.status(403).json({ error: '프로덕션 환경에서는 사용할 수 없습니다.' });
    }

    // 테스트 사용자 생성 또는 조회
    const testUser = await AuthService.createTestUser();
    const loginResponse = await AuthService.handleSocialLoginSuccess(testUser);

    // 쿠키 설정
    const isProduction = process.env['NODE_ENV'] === 'production';
    
    res.cookie('accessToken', loginResponse.tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000 // 15분
    });

    res.cookie('refreshToken', loginResponse.tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    return res.json({
      success: true,
      user: loginResponse.user,
      tokens: {
        accessToken: loginResponse.tokens.accessToken,
        refreshToken: loginResponse.tokens.refreshToken
      }
    });
  } catch (error) {
    console.error('테스트 로그인 오류:', error);
    return res.status(500).json({ error: '테스트 로그인 실패' });
  }
});

/**
 * 헬스 체크 (인증 관련)
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: '인증 서비스가 정상 작동 중입니다.',
    timestamp: new Date().toISOString(),
    availableProviders: {
      // google: !!process.env['GOOGLE_CLIENT_ID'], // 임시 주석 처리
      kakao: !!process.env['KAKAO_CLIENT_ID'],
      naver: !!process.env['NAVER_CLIENT_ID'],
      test: process.env['NODE_ENV'] !== 'production' // 테스트 로그인 가능 여부
    }
  });
});

export default router;
