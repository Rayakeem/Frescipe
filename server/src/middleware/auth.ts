import { Request, Response, NextFunction } from 'express';
import { JWTService, JWTPayload } from '../utils/jwt';
import { User, IUser } from '../models/User';
import { Types } from 'mongoose';

// Request 인터페이스 확장 (Passport와 충돌 방지를 위해 제거)

export interface AuthenticatedRequest extends Request {
  user: any;
  userId: Types.ObjectId;
  token: string;
}

/**
 * JWT 토큰 추출 함수
 */
const extractTokenFromRequest = (req: Request): string | null => {
  // Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 쿠키에서 토큰 추출
  const cookieToken = req.cookies?.['accessToken'];
  if (cookieToken) {
    return cookieToken;
  }

  // 쿼리 파라미터에서 토큰 추출 (웹소켓 등에서 사용)
  const queryToken = req.query['token'] as string;
  if (queryToken) {
    return queryToken;
  }

  return null;
};

/**
 * 필수 인증 미들웨어
 * 유효한 JWT 토큰이 있어야만 접근 가능
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: '인증 토큰이 필요합니다.'
      });
      return;
    }

    // 토큰 검증
    let payload: JWTPayload;
    try {
      payload = JWTService.verifyAccessToken(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'TOKEN_VERIFICATION_FAILED';
      
      if (errorMessage === 'ACCESS_TOKEN_EXPIRED') {
        res.status(401).json({
          error: 'TOKEN_EXPIRED',
          message: '토큰이 만료되었습니다. 다시 로그인해주세요.'
        });
      } else {
        res.status(401).json({
          error: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다.'
        });
      }
      return;
    }

    // 사용자 정보 조회
    const user = await User.findById(payload.userId).select('-socialAccounts.accessToken -socialAccounts.refreshToken');
    
    if (!user || !user.isActive) {
      res.status(401).json({
        error: 'USER_NOT_FOUND',
        message: '사용자를 찾을 수 없거나 비활성화된 계정입니다.'
      });
      return;
    }

    // 마지막 활동 시간 업데이트
    (user as any).updateLastActive();

    // Request 객체에 사용자 정보 추가
    (req as any).user = user;
    (req as any).userId = user._id as Types.ObjectId;
    (req as any).token = token;

    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    });
  }
};

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 사용자 정보를 추가하고, 없어도 계속 진행
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      next();
      return;
    }

    try {
      const payload = JWTService.verifyAccessToken(token);
      const user = await User.findById(payload.userId).select('-socialAccounts.accessToken -socialAccounts.refreshToken');
      
      if (user && user.isActive) {
        (req as any).user = user;
        (req as any).userId = user._id as Types.ObjectId;
        (req as any).token = token;
        
        // 마지막 활동 시간 업데이트 (비동기로 처리)
        (user as any).updateLastActive().catch(console.error);
      }
    } catch (error) {
      // 토큰이 유효하지 않아도 계속 진행
      console.warn('선택적 인증에서 토큰 검증 실패:', error);
    }

    next();
  } catch (error) {
    console.error('선택적 인증 미들웨어 오류:', error);
    next(); // 오류가 있어도 계속 진행
  }
};

/**
 * 관리자 권한 확인 미들웨어
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: '인증이 필요합니다.'
      });
      return;
    }

    // 관리자 권한 확인 (예: 특정 이메일 도메인 또는 역할)
    const isAdmin = (req.user as any).email.endsWith('@frescipe.com') || 
                   (req.user as any).stats.badges.includes('admin');

    if (!isAdmin) {
      res.status(403).json({
        error: 'FORBIDDEN',
        message: '관리자 권한이 필요합니다.'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    });
  }
};

/**
 * 프리미엄 사용자 확인 미들웨어
 */
export const requirePremium = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'UNAUTHORIZED',
        message: '인증이 필요합니다.'
      });
      return;
    }

    const isPremium = (req.user as any).isPremium && 
                     (req.user as any).premiumExpiresAt && 
                     (req.user as any).premiumExpiresAt > new Date();

    if (!isPremium) {
      res.status(403).json({
        error: 'PREMIUM_REQUIRED',
        message: '프리미엄 멤버십이 필요한 기능입니다.'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('프리미엄 권한 확인 오류:', error);
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: '서버 내부 오류가 발생했습니다.'
    });
  }
};

/**
 * 토큰 갱신 미들웨어
 * 토큰이 곧 만료될 예정이면 새로운 토큰을 발급
 */
export const refreshTokenIfNeeded = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!(req as any).token || !(req as any).user) {
      next();
      return;
    }

    // 토큰이 곧 만료되는지 확인
    if (JWTService.isTokenExpiringSoon((req as any).token)) {
      const newToken = JWTService.generateAccessToken({
        userId: ((req as any).user._id as any).toString(),
        email: (req.user as any).email,
        username: (req.user as any).username,
        provider: (req.user as any).primaryProvider
      });

      // 새로운 토큰을 응답 헤더에 추가
      res.setHeader('X-New-Token', newToken);
      
      // 쿠키로도 설정 (클라이언트가 자동으로 사용할 수 있도록)
      res.cookie('accessToken', newToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15분
      });
    }

    next();
  } catch (error) {
    console.error('토큰 갱신 미들웨어 오류:', error);
    next(); // 오류가 있어도 계속 진행
  }
};
