import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // MongoDB 중복 키 오류
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 400;
    message = '중복된 데이터입니다.';
  }

  // MongoDB 유효성 검사 오류
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '입력 데이터가 유효하지 않습니다.';
  }

  // JWT 오류
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '유효하지 않은 토큰입니다.';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '토큰이 만료되었습니다.';
  }

  // 개발 환경에서는 스택 트레이스 포함
  const response: any = {
    error: {
      message,
      status: statusCode
    }
  };

  if (process.env['NODE_ENV'] === 'development') {
    response.error.stack = error.stack;
  }

  console.error('❌ 서버 오류:', error);

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
