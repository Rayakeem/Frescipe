# 🥗 Frescipe (프레시피)

사용자의 냉장고 재료를 기반으로 저속노화 레시피를 추천하고, 사용자들이 직접 레시피를 공유하는 소셜 쿠킹 플랫폼입니다.

## 📱 프로젝트 개요

**Frescipe**는 건강한 식생활을 위한 모바일 앱으로, 다음과 같은 핵심 기능을 제공합니다:

- 🧊 **스마트 냉장고 관리**: 보유 재료 추적 및 유통기한 알림
- 🍽️ **맞춤 레시피 추천**: AI 기반 재료 매칭 시스템
- 👥 **소셜 쿠킹**: 사용자 간 레시피 공유 및 소통
- 🌱 **저속노화 레시피**: 건강한 조리법 중심의 콘텐츠

## 🛠️ 기술 스택

### 프론트엔드 (클라이언트)
- **React Native** with TypeScript
- **Expo** - 개발 및 배포 플랫폼
- **React Navigation** - 네비게이션
- **React Native Paper** - UI 컴포넌트
- **Zustand** - 상태 관리

### 백엔드 (서버)
- **Node.js** with Express
- **TypeScript** - 타입 안전성
- **MongoDB** with Mongoose - 데이터베이스
- **JWT** - 인증 시스템
- **AWS S3** - 이미지 저장소

## 📁 프로젝트 구조

```
Frescipe/
├── client/                 # React Native 앱
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── screens/        # 화면 컴포넌트
│   │   ├── navigation/     # 네비게이션 설정
│   │   ├── services/       # API 서비스
│   │   ├── utils/          # 유틸리티 함수
│   │   ├── types/          # TypeScript 타입 정의
│   │   ├── store/          # 상태 관리
│   │   └── hooks/          # 커스텀 훅
│   ├── assets/             # 이미지, 폰트 등
│   └── package.json
├── server/                 # Node.js API 서버
│   ├── src/
│   │   ├── controllers/    # 요청 처리 로직
│   │   ├── models/         # 데이터베이스 모델
│   │   ├── routes/         # API 라우트
│   │   ├── middleware/     # 미들웨어
│   │   ├── utils/          # 유틸리티 함수
│   │   ├── config/         # 설정 파일
│   │   └── types/          # TypeScript 타입 정의
│   └── package.json
└── package.json            # 루트 패키지 (Monorepo)
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- MongoDB
- Expo CLI (`npm install -g @expo/cli`)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/Frescipe.git
   cd Frescipe
   ```

2. **의존성 설치**
   ```bash
   npm install
   npm run install:all
   ```

3. **환경 변수 설정**
   ```bash
   # 서버 환경 변수
   cp server/.env.example server/.env
   # .env 파일을 편집하여 실제 값으로 변경
   ```

4. **개발 서버 실행**
   ```bash
   # 서버와 클라이언트 동시 실행
   npm run dev
   
   # 또는 개별 실행
   npm run dev:server  # 서버만 실행
   npm run dev:client  # 클라이언트만 실행
   ```

### 📱 모바일 앱 실행

```bash
cd client
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android
```

## 🔧 개발 스크립트

```bash
# 전체 프로젝트
npm run install:all     # 모든 의존성 설치
npm run dev            # 개발 서버 실행
npm run build          # 프로덕션 빌드

# 서버
npm run dev:server     # 서버 개발 모드
npm run build:server   # 서버 빌드

# 클라이언트
npm run dev:client     # 클라이언트 개발 모드
npm run build:client   # 클라이언트 빌드
```

## 🌟 주요 기능

### 1. 홈 화면
- 개인화된 레시피 추천
- 재료 기반 검색
- 인기 레시피 탐색

### 2. 냉장고 관리
- 보유 재료 등록 및 관리
- 유통기한 추적 및 알림
- 신선도 상태 모니터링

### 3. 레시피 탐색
- 카테고리별 레시피 분류
- 저속노화 레시피 특화
- 사용자 평점 및 리뷰

### 4. 프로필 및 소셜
- 개인 레시피 컬렉션
- 팔로우 시스템
- 레시피 공유 및 소통

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 언제든 연락주세요.

---

**Frescipe** - 건강한 식생활의 시작 🌱