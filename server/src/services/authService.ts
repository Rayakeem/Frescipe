import { Types } from 'mongoose';
import { User, IUser, SocialProvider } from '../models/User';
import { JWTService } from '../utils/jwt';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    profileImage?: string;
    level: string;
    experiencePoints: number;
    isVerified: boolean;
    isPremium: boolean;
    createdAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export class AuthService {
  /**
   * 소셜 로그인 성공 후 토큰 생성
   */
  static async handleSocialLoginSuccess(user: IUser): Promise<LoginResponse> {
    try {
      // 마지막 로그인 시간 업데이트
      user.lastLoginAt = new Date();
      await user.save();

      // JWT 토큰 생성
      const accessToken = JWTService.generateAccessToken({
        userId: (user._id as any).toString(),
        email: user.email,
        username: user.username,
        provider: user.primaryProvider
      });

      const refreshToken = JWTService.generateRefreshToken({
        userId: (user._id as any).toString(),
        tokenVersion: 1 // 추후 토큰 무효화를 위한 버전 관리
      });

      // 사용자 정보 정리 (민감한 정보 제외)
      const userResponse = {
        id: (user._id as any).toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        level: user.stats.level,
        experiencePoints: user.stats.experiencePoints,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        createdAt: user.createdAt
      };

      return {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 15 * 60 // 15분 (초 단위)
        }
      };
    } catch (error) {
      console.error('소셜 로그인 성공 처리 오류:', error);
      throw new Error('로그인 처리 중 오류가 발생했습니다.');
    }
  }

  /**
   * 리프레시 토큰으로 새로운 액세스 토큰 발급
   */
  static async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // 리프레시 토큰 검증
      const payload = JWTService.verifyRefreshToken(refreshToken);

      // 사용자 존재 여부 확인
      const user = await User.findById(payload.userId);
      if (!user || !user.isActive) {
        throw new Error('사용자를 찾을 수 없거나 비활성화된 계정입니다.');
      }

      // 새로운 액세스 토큰 생성
      const newAccessToken = JWTService.generateAccessToken({
        userId: (user._id as any).toString(),
        email: user.email,
        username: user.username,
        provider: user.primaryProvider
      });

      return {
        accessToken: newAccessToken,
        expiresIn: 15 * 60 // 15분
      };
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('REFRESH_TOKEN_EXPIRED')) {
          throw new Error('리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.');
        } else if (error.message.includes('INVALID_REFRESH_TOKEN')) {
          throw new Error('유효하지 않은 리프레시 토큰입니다.');
        }
      }
      
      throw new Error('토큰 갱신 중 오류가 발생했습니다.');
    }
  }

  /**
   * 로그아웃 처리
   */
  static async logout(userId: Types.ObjectId): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (user) {
        // 마지막 활동 시간 업데이트
        await (user as any).updateLastActive();
      }
      
      // 추후 토큰 블랙리스트 구현 시 여기에 추가
      // 현재는 클라이언트에서 토큰을 삭제하는 것으로 처리
    } catch (error) {
      console.error('로그아웃 처리 오류:', error);
      throw new Error('로그아웃 처리 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 프로필 조회
   */
  static async getUserProfile(userId: Types.ObjectId): Promise<any> {
    try {
      const user = await User.findById(userId)
        .select('-socialAccounts.accessToken -socialAccounts.refreshToken')
        .lean();

      if (!user || !user.isActive) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      return {
        id: (user._id as any).toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        bio: user.bio,
        level: user.stats.level,
        experiencePoints: user.stats.experiencePoints,
        badges: user.stats.badges,
        totalRecipes: user.stats.totalRecipes,
        totalFollowers: user.stats.totalFollowers,
        totalFollowing: user.stats.totalFollowing,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        settings: user.settings,
        allergies: user.allergies,
        dietaryPreferences: user.dietaryPreferences,
        healthGoals: user.healthGoals,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt
      };
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
      throw new Error('프로필 조회 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateUserProfile(
    userId: Types.ObjectId,
    updateData: Partial<{
      displayName: string;
      bio: string;
      allergies: any[];
      dietaryPreferences: any[];
      healthGoals: string[];
      settings: any;
    }>
  ): Promise<any> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 허용된 필드만 업데이트
      const allowedFields = ['displayName', 'bio', 'allergies', 'dietaryPreferences', 'healthGoals', 'settings'];
      const filteredUpdateData: any = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          filteredUpdateData[key] = value;
        }
      }

      // 사용자 정보 업데이트
      Object.assign(user, filteredUpdateData);
      await user.save();

      // 프로필 업데이트 경험치 추가
      (user as any).addExperience(5, 'profile_update');
      await user.save();

      return this.getUserProfile(userId);
    } catch (error) {
      console.error('사용자 프로필 업데이트 오류:', error);
      throw new Error('프로필 업데이트 중 오류가 발생했습니다.');
    }
  }

  /**
   * 계정 연결 (추가 소셜 계정 연결)
   */
  static async linkSocialAccount(
    userId: Types.ObjectId,
    provider: SocialProvider,
    providerId: string,
    email: string,
    profileUrl?: string
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 이미 연결된 계정인지 확인
      const existingAccount = user.socialAccounts.find(
        account => account.provider === provider && account.providerId === providerId
      );

      if (existingAccount) {
        throw new Error('이미 연결된 소셜 계정입니다.');
      }

      // 다른 사용자가 같은 소셜 계정을 사용하는지 확인
      const existingUser = await User.findOne({
        'socialAccounts.provider': provider,
        'socialAccounts.providerId': providerId,
        _id: { $ne: userId }
      });

      if (existingUser) {
        throw new Error('해당 소셜 계정은 다른 사용자가 이미 사용 중입니다.');
      }

      // 소셜 계정 추가
      (user as any).addSocialAccount({
        provider,
        providerId,
        email,
        profileUrl
      });

      await user.save();

      // 계정 연결 경험치 추가
      (user as any).addExperience(10, 'account_link');
      await user.save();
    } catch (error) {
      console.error('소셜 계정 연결 오류:', error);
      throw error;
    }
  }

  /**
   * 계정 연결 해제
   */
  static async unlinkSocialAccount(
    userId: Types.ObjectId,
    provider: SocialProvider
  ): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 연결된 소셜 계정이 1개뿐인 경우 해제 불가
      if (user.socialAccounts.length <= 1) {
        throw new Error('최소 하나의 소셜 계정은 연결되어 있어야 합니다.');
      }

      // 해당 소셜 계정 제거
      user.socialAccounts = user.socialAccounts.filter(
        account => account.provider !== provider
      );

      // 주 제공자가 해제되는 경우 다른 제공자로 변경
      if (user.primaryProvider === provider && user.socialAccounts[0]) {
        user.primaryProvider = user.socialAccounts[0].provider;
      }

      await user.save();
    } catch (error) {
      console.error('소셜 계정 연결 해제 오류:', error);
      throw error;
    }
  }

  /**
   * 계정 삭제 (소프트 삭제)
   */
  static async deleteAccount(userId: Types.ObjectId): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }

      // 소프트 삭제 (비활성화)
      user.isActive = false;
      user.email = `deleted_${Date.now()}_${user.email}`;
      user.username = `deleted_${Date.now()}_${user.username}`;
      
      await user.save();

      // 추후 관련 데이터 정리 작업 추가
      // - 레시피 비공개 처리
      // - 댓글 익명 처리
      // - 팔로우 관계 정리 등
    } catch (error) {
      console.error('계정 삭제 오류:', error);
      throw new Error('계정 삭제 중 오류가 발생했습니다.');
    }
  }

  /**
   * 테스트용 사용자 생성 (개발 환경 전용)
   */
  static async createTestUser(): Promise<any> {
    try {
      // 기존 테스트 사용자 확인
      let testUser = await User.findOne({ 
        'socialAccounts.providerId': 'test-user-id',
        'socialAccounts.provider': 'naver'
      });

      if (testUser) {
        return testUser;
      }

      // 새 테스트 사용자 생성
      testUser = new User({
        email: 'test@frescipe.com',
        username: 'testuser',
        displayName: '테스트 사용자',
        profileImage: 'https://via.placeholder.com/150',
        bio: '테스트용 계정입니다.',
        primaryProvider: 'naver',
        socialAccounts: [{
          provider: 'naver',
          providerId: 'test-user-id',
          email: 'test@frescipe.com',
          profileUrl: 'https://via.placeholder.com/150',
          connectedAt: new Date(),
          lastUsedAt: new Date()
        }],
        stats: {
          totalRecipes: 0,
          totalLikes: 0,
          totalFollowers: 0,
          totalFollowing: 0,
          totalCookingTime: 0,
          experiencePoints: 100,
          level: 'beginner',
          badges: ['new_user', 'test_user'],
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
            theme: 'light',
            units: 'metric',
            timezone: 'Asia/Seoul'
          }
        }
      });

      await testUser.save();
      console.log('✅ 테스트 사용자 생성 완료');
      
      return testUser;
    } catch (error) {
      console.error('테스트 사용자 생성 오류:', error);
      throw new Error('테스트 사용자 생성에 실패했습니다.');
    }
  }
}
