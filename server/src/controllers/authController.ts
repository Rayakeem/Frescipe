import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  /**
   * 소셜 로그인 성공 콜백 처리
   */
  static async socialLoginCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as IUser;
      
      if (!user) {
        res.redirect(`${process.env['CORS_ORIGIN']}/login?error=authentication_failed`);
        return;
      }

      // JWT 토큰 생성
      const loginResponse = await AuthService.handleSocialLoginSuccess(user);

      // 쿠키에 토큰 설정
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

      // 클라이언트로 리다이렉트 (토큰 정보와 함께)
      const redirectUrl = new URL('/auth/success', process.env['CORS_ORIGIN'] || 'http://localhost:3001');
      redirectUrl.searchParams.set('token', loginResponse.tokens.accessToken);
      redirectUrl.searchParams.set('user', JSON.stringify(loginResponse.user));

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('소셜 로그인 콜백 오류:', error);
      res.redirect(`${process.env['CORS_ORIGIN']}/login?error=server_error`);
    }
  }

  /**
   * 로그인 상태 확인
   */
  static async checkAuth(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userProfile = await AuthService.getUserProfile(req.userId);
      
      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('인증 상태 확인 오류:', error);
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: '인증되지 않은 사용자입니다.'
      });
    }
  }

  /**
   * 토큰 갱신
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.['refreshToken'] || req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          error: 'REFRESH_TOKEN_REQUIRED',
          message: '리프레시 토큰이 필요합니다.'
        });
        return;
      }

      const tokenResponse = await AuthService.refreshAccessToken(refreshToken);

      // 새로운 액세스 토큰을 쿠키에 설정
      const isProduction = process.env['NODE_ENV'] === 'production';
      
      res.cookie('accessToken', tokenResponse.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000 // 15분
      });

      res.json({
        success: true,
        accessToken: tokenResponse.accessToken,
        expiresIn: tokenResponse.expiresIn
      });
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      
      // 리프레시 토큰 쿠키 삭제
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(401).json({
        error: 'TOKEN_REFRESH_FAILED',
        message: error instanceof Error ? error.message : '토큰 갱신에 실패했습니다.'
      });
    }
  }

  /**
   * 로그아웃
   */
  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await AuthService.logout(req.userId);

      // 쿠키 삭제
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: '성공적으로 로그아웃되었습니다.'
      });
    } catch (error) {
      console.error('로그아웃 오류:', error);
      res.status(500).json({
        error: 'LOGOUT_FAILED',
        message: '로그아웃 처리 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 사용자 프로필 조회
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userProfile = await AuthService.getUserProfile(req.userId);
      
      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      res.status(500).json({
        error: 'PROFILE_FETCH_FAILED',
        message: '프로필 조회 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updateData = req.body;
      const updatedProfile = await AuthService.updateUserProfile(req.userId, updateData);
      
      res.json({
        success: true,
        message: '프로필이 성공적으로 업데이트되었습니다.',
        user: updatedProfile
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      res.status(400).json({
        error: 'PROFILE_UPDATE_FAILED',
        message: error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 소셜 계정 연결
   */
  static async linkSocialAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 이 엔드포인트는 소셜 로그인 콜백에서 기존 사용자가 로그인된 상태일 때 사용
      const user = req.user as IUser;
      
      if (!user) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: '로그인이 필요합니다.'
        });
        return;
      }

      // 소셜 로그인 성공 후 계정 연결 처리는 passport 콜백에서 자동으로 처리됨
      res.json({
        success: true,
        message: '소셜 계정이 성공적으로 연결되었습니다.'
      });
    } catch (error) {
      console.error('소셜 계정 연결 오류:', error);
      res.status(400).json({
        error: 'ACCOUNT_LINK_FAILED',
        message: error instanceof Error ? error.message : '계정 연결 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 소셜 계정 연결 해제
   */
  static async unlinkSocialAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { provider } = req.params;
      
      if (!provider || !['google', 'kakao', 'naver'].includes(provider)) {
        res.status(400).json({
          error: 'INVALID_PROVIDER',
          message: '유효하지 않은 소셜 제공자입니다.'
        });
        return;
      }

      await AuthService.unlinkSocialAccount(req.userId, provider as any);
      
      res.json({
        success: true,
        message: `${provider} 계정 연결이 해제되었습니다.`
      });
    } catch (error) {
      console.error('소셜 계정 연결 해제 오류:', error);
      res.status(400).json({
        error: 'ACCOUNT_UNLINK_FAILED',
        message: error instanceof Error ? error.message : '계정 연결 해제 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 계정 삭제
   */
  static async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { confirmPassword } = req.body;
      
      // 추가 보안 확인 (예: 비밀번호 재입력, 이메일 인증 등)
      if (confirmPassword !== 'DELETE_MY_ACCOUNT') {
        res.status(400).json({
          error: 'CONFIRMATION_REQUIRED',
          message: '계정 삭제를 위한 확인이 필요합니다.'
        });
        return;
      }

      await AuthService.deleteAccount(req.userId);

      // 쿠키 삭제
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: '계정이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('계정 삭제 오류:', error);
      res.status(500).json({
        error: 'ACCOUNT_DELETE_FAILED',
        message: '계정 삭제 중 오류가 발생했습니다.'
      });
    }
  }

  /**
   * 로그인 페이지 (개발용)
   */
  static renderLoginPage(_req: Request, res: Response): void {
    const loginPageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Frescipe 로그인</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
            .login-btn { display: block; width: 100%; padding: 12px; margin: 10px 0; text-decoration: none; text-align: center; border-radius: 5px; color: white; font-weight: bold; }
            .google { background-color: #db4437; }
            .kakao { background-color: #fee500; color: #000; }
            .naver { background-color: #03c75a; }
            h1 { text-align: center; color: #2E7D32; }
        </style>
    </head>
    <body>
        <h1>🥗 Frescipe 로그인</h1>
        <p>소셜 계정으로 간편하게 로그인하세요:</p>
        
        <a href="/auth/google" class="login-btn google">Google로 로그인</a>
        <a href="/auth/kakao" class="login-btn kakao">Kakao로 로그인</a>
        <a href="/auth/naver" class="login-btn naver">Naver로 로그인</a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
            로그인하면 Frescipe의 <a href="/terms">이용약관</a>과 <a href="/privacy">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
        </p>
    </body>
    </html>
    `;
    
    res.send(loginPageHtml);
  }

  /**
   * 로그인 성공 페이지 (개발용)
   */
  static renderSuccessPage(_req: Request, res: Response): void {
    const successPageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>로그인 성공</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; text-align: center; }
            .success { color: #2E7D32; }
        </style>
    </head>
    <body>
        <h1 class="success">✅ 로그인 성공!</h1>
        <p>Frescipe에 오신 것을 환영합니다!</p>
        <p>이 창을 닫고 앱을 사용해보세요.</p>
        <script>
            // 모바일 앱으로 돌아가기
            setTimeout(() => {
                window.close();
            }, 2000);
        </script>
    </body>
    </html>
    `;
    
    res.send(successPageHtml);
  }
}
