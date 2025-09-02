import { Router } from 'express';
import passport from '../config/passport';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

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
 * Google OAuth 라우트
 */
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
 * 헬스 체크 (인증 관련)
 */
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: '인증 서비스가 정상 작동 중입니다.',
    timestamp: new Date().toISOString(),
    availableProviders: {
      google: !!process.env['GOOGLE_CLIENT_ID'],
      kakao: !!process.env['KAKAO_CLIENT_ID'],
      naver: !!process.env['NAVER_CLIENT_ID']
    }
  });
});

export default router;
