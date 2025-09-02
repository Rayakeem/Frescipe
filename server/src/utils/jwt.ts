import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  provider: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export class JWTService {
  private static readonly ACCESS_TOKEN_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
  private static readonly REFRESH_TOKEN_SECRET = process.env['JWT_REFRESH_SECRET'] || 'fallback-refresh-secret';
  private static readonly ACCESS_TOKEN_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '15m';
  private static readonly REFRESH_TOKEN_EXPIRES_IN = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d';

  /**
   * 액세스 토큰 생성
   */
  static generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload as object, this.ACCESS_TOKEN_SECRET as any, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN as any,
      issuer: 'frescipe',
      audience: 'frescipe-client'
    });
  }

  /**
   * 리프레시 토큰 생성
   */
  static generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload as object, this.REFRESH_TOKEN_SECRET as any, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as any,
      issuer: 'frescipe',
      audience: 'frescipe-client'
    });
  }

  /**
   * 액세스 토큰 검증
   */
  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        issuer: 'frescipe',
        audience: 'frescipe-client'
      }) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('ACCESS_TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_ACCESS_TOKEN');
      }
      throw new Error('TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * 리프레시 토큰 검증
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        issuer: 'frescipe',
        audience: 'frescipe-client'
      }) as RefreshTokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('REFRESH_TOKEN_EXPIRED');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_REFRESH_TOKEN');
      }
      throw new Error('TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * 토큰에서 사용자 ID 추출
   */
  static extractUserIdFromToken(token: string): Types.ObjectId | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded?.userId ? new Types.ObjectId(decoded.userId) : null;
    } catch {
      return null;
    }
  }

  /**
   * 토큰 만료 시간 확인
   */
  static getTokenExpirationTime(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded?.exp ? new Date(decoded.exp * 1000) : null;
    } catch {
      return null;
    }
  }

  /**
   * 토큰이 곧 만료되는지 확인 (5분 이내)
   */
  static isTokenExpiringSoon(token: string): boolean {
    const expirationTime = this.getTokenExpirationTime(token);
    if (!expirationTime) return true;
    
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expirationTime <= fiveMinutesFromNow;
  }
}
