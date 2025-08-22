import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/frescipe';
    
    await mongoose.connect(mongoUri, {
      // MongoDB 6.0+ 에서는 아래 옵션들이 기본값이므로 제거
    });

    console.log('✅ MongoDB 연결 성공');
    
    // 연결 이벤트 리스너
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB 연결 오류:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB 연결이 끊어졌습니다.');
    });

    // 프로세스 종료 시 연결 정리
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB 연결이 정상적으로 종료되었습니다.');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    throw error;
  }
};
