import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { initializeDatabase } from './models';
// import { errorHandler } from './middleware/errorHandler';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(compression()); // 응답 압축
app.use(morgan('combined')); // 로깅
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 헬스 체크 엔드포인트
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Frescipe 서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// API 라우트 (추후 추가 예정)
app.get('/api', (_req: express.Request, res: express.Response) => {
  res.json({
    message: 'Frescipe API 서버',
    version: '1.0.0'
  });
});

// 에러 핸들링 미들웨어 (추후 구현)
// app.use(errorHandler);

// 404 핸들러
app.use('*', (_req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: '요청하신 리소스를 찾을 수 없습니다.'
  });
});

// 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결
    await connectDB();
    
    // 모델 초기화
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Frescipe 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
      console.log(`🔗 API 엔드포인트: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
