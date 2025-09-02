import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { User, SocialProvider, UserLevel } from '../models/User';
import { Types } from 'mongoose';

// 환경 변수 검증
const requiredEnvVars = {
  google: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  kakao: ['KAKAO_CLIENT_ID', 'KAKAO_CLIENT_SECRET'],
  naver: ['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET']
};

const checkEnvVars = (provider: keyof typeof requiredEnvVars): boolean => {
  return requiredEnvVars[provider].every(envVar => process.env[envVar]);
};

/**
 * 소셜 로그인 사용자 정보 처리 공통 함수
 */
const handleSocialUser = async (
  provider: SocialProvider,
  providerId: string,
  email: string,
  displayName: string,
  profileImage?: string
) => {
  try {
    // 기존 사용자 찾기 (이메일 또는 소셜 계정으로)
    let user = await User.findOne({
      $or: [
        { email },
        { 'socialAccounts.provider': provider, 'socialAccounts.providerId': providerId }
      ]
    });

    if (user) {
      // 기존 사용자인 경우 소셜 계정 정보 업데이트
      const existingAccountIndex = user.socialAccounts.findIndex(
        account => account.provider === provider
      );

      if (existingAccountIndex >= 0) {
        // 기존 소셜 계정 업데이트
        user.socialAccounts[existingAccountIndex]!.lastUsedAt = new Date();
        user.socialAccounts[existingAccountIndex]!.email = email;
      } else {
        // 새로운 소셜 계정 추가
        (user as any).addSocialAccount({
          provider,
          providerId,
          email,
          profileUrl: profileImage
        });
      }

      // 마지막 로그인 시간 업데이트
      user.lastLoginAt = new Date();
      await user.save();
      
      return user;
    }

    // 새로운 사용자 생성
    const username = await generateUniqueUsername(displayName, email);
    
    user = new User({
      email,
      username,
      displayName,
      profileImage,
      primaryProvider: provider,
      socialAccounts: [{
        provider,
        providerId,
        email,
        profileUrl: profileImage,
        connectedAt: new Date(),
        lastUsedAt: new Date()
      }],
      stats: {
        totalRecipes: 0,
        totalLikes: 0,
        totalFollowers: 0,
        totalFollowing: 0,
        totalCookingTime: 0,
        experiencePoints: 0,
        level: UserLevel.BEGINNER,
        badges: ['new_user'],
        streakDays: 0
      },
      settings: {
        notifications: {
          recipeRecommendations: true,
          expiryReminders: true,
          socialActivity: true,
          weeklyReport: true,
          pushEnabled: true,
          emailEnabled: true
        },
        privacy: {
          profileVisibility: 'public',
          recipeVisibility: 'public',
          fridgeVisibility: 'friends',
          allowFollowRequests: true,
          showOnlineStatus: true
        },
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          measurementUnit: 'metric',
          defaultServingSize: 2,
          cookingSkillLevel: UserLevel.BEGINNER
        }
      },
      allergies: [],
      dietaryPreferences: [],
      healthGoals: [],
      isActive: true,
      isVerified: true, // 소셜 로그인은 자동으로 검증된 것으로 처리
      isPremium: false,
      lastLoginAt: new Date()
    });

    await user.save();
    
    // 신규 가입 경험치 추가
    (user as any).addExperience(10, 'new_user');
    await user.save();

    return user;
  } catch (error) {
    console.error(`${provider} 소셜 로그인 처리 오류:`, error);
    throw error;
  }
};

/**
 * 고유한 사용자명 생성
 */
const generateUniqueUsername = async (displayName: string, email: string): Promise<string> => {
  // 기본 사용자명 생성 (한글 제거, 특수문자 제거)
  let baseUsername = displayName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
  
  if (!baseUsername || baseUsername.length < 2) {
    // displayName이 사용할 수 없으면 이메일 앞부분 사용
    baseUsername = email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') || 'user';
  }

  // 최소 길이 보장
  if (baseUsername.length < 2) {
    baseUsername = 'user';
  }

  let username = baseUsername;
  let counter = 1;

  // 중복 확인 및 고유한 사용자명 생성
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

/**
 * Google OAuth 전략
 */
if (checkEnvVars('google')) {
  passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID']!,
    clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
    callbackURL: process.env['GOOGLE_CALLBACK_URL'] || '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await handleSocialUser(
        SocialProvider.GOOGLE,
        profile.id,
        profile.emails?.[0]?.value || '',
        profile.displayName || profile.name?.givenName || 'Google User',
        profile.photos?.[0]?.value
      );
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
} else {
  console.warn('⚠️ Google OAuth 환경 변수가 설정되지 않았습니다.');
}

/**
 * Kakao OAuth 전략
 */
if (checkEnvVars('kakao')) {
  passport.use(new KakaoStrategy({
    clientID: process.env['KAKAO_CLIENT_ID']!,
    clientSecret: process.env['KAKAO_CLIENT_SECRET']!,
    callbackURL: process.env['KAKAO_CALLBACK_URL'] || '/auth/kakao/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const kakaoAccount = profile._json?.kakao_account;
      const kakaoProfile = kakaoAccount?.profile;
      
      const user = await handleSocialUser(
        SocialProvider.KAKAO,
        profile.id,
        kakaoAccount?.email || '',
        kakaoProfile?.nickname || 'Kakao User',
        kakaoProfile?.profile_image_url
      );
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
} else {
  console.warn('⚠️ Kakao OAuth 환경 변수가 설정되지 않았습니다.');
}

/**
 * Naver OAuth 전략
 */
if (checkEnvVars('naver')) {
  passport.use(new NaverStrategy({
    clientID: process.env['NAVER_CLIENT_ID']!,
    clientSecret: process.env['NAVER_CLIENT_SECRET']!,
    callbackURL: process.env['NAVER_CALLBACK_URL'] || '/auth/naver/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const naverProfile = profile._json?.response;
      
      const user = await handleSocialUser(
        SocialProvider.NAVER,
        naverProfile?.id || profile.id,
        naverProfile?.email || '',
        naverProfile?.nickname || naverProfile?.name || 'Naver User',
        naverProfile?.profile_image
      );
      
      return done(null, user);
    } catch (error) {
      return done(error, undefined);
    }
  }));
} else {
  console.warn('⚠️ Naver OAuth 환경 변수가 설정되지 않았습니다.');
}

/**
 * Passport 직렬화/역직렬화
 */
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: Types.ObjectId, done) => {
  try {
    const user = await User.findById(id).select('-socialAccounts.accessToken -socialAccounts.refreshToken');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
