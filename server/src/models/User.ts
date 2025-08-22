import mongoose, { Document, Schema } from 'mongoose';

// 소셜 로그인 제공자 타입
export enum SocialProvider {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
  APPLE = 'apple'
}

// 사용자 레벨 시스템
export enum UserLevel {
  BEGINNER = 'beginner',      // 초보자 (0-99 경험치)
  INTERMEDIATE = 'intermediate', // 중급자 (100-499 경험치)
  ADVANCED = 'advanced',      // 고급자 (500-999 경험치)
  EXPERT = 'expert',          // 전문가 (1000+ 경험치)
  CHEF = 'chef'               // 셰프 (특별 인증)
}

// 알레르기 정보
export interface AllergyInfo {
  name: string;           // 알레르기 이름 (예: '견과류', '갑각류')
  severity: 'mild' | 'moderate' | 'severe'; // 심각도
  notes?: string;         // 추가 메모
}

// 식단 선호도
export interface DietaryPreference {
  type: 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'gluten-free' | 'low-carb' | 'low-fat' | 'halal' | 'kosher';
  isStrict: boolean;      // 엄격한 준수 여부
  startDate?: Date;       // 시작일
}

// 소셜 로그인 정보
export interface SocialAccount {
  provider: SocialProvider;
  providerId: string;     // 소셜 제공자의 사용자 ID
  email?: string;         // 소셜 계정 이메일
  profileUrl?: string;    // 소셜 프로필 URL
  accessToken?: string;   // 액세스 토큰 (암호화 저장)
  refreshToken?: string;  // 리프레시 토큰 (암호화 저장)
  connectedAt: Date;      // 연결된 날짜
  lastUsedAt: Date;       // 마지막 사용 날짜
}

// 사용자 통계
export interface UserStats {
  totalRecipes: number;           // 작성한 총 레시피 수
  totalLikes: number;             // 받은 총 좋아요 수
  totalFollowers: number;         // 팔로워 수
  totalFollowing: number;         // 팔로잉 수
  totalCookingTime: number;       // 총 요리 시간 (분)
  experiencePoints: number;       // 경험치
  level: UserLevel;               // 사용자 레벨
  badges: string[];               // 획득한 뱃지들
  streakDays: number;             // 연속 요리 일수
  lastCookingDate?: Date;         // 마지막 요리 날짜
}

// 사용자 설정
export interface UserSettings {
  notifications: {
    recipeRecommendations: boolean;  // 레시피 추천 알림
    expiryReminders: boolean;        // 유통기한 알림
    socialActivity: boolean;         // 소셜 활동 알림
    weeklyReport: boolean;           // 주간 리포트
    pushEnabled: boolean;            // 푸시 알림 활성화
    emailEnabled: boolean;           // 이메일 알림 활성화
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'; // 프로필 공개 범위
    recipeVisibility: 'public' | 'friends' | 'private';  // 레시피 공개 범위
    fridgeVisibility: 'public' | 'friends' | 'private';  // 냉장고 공개 범위
    allowFollowRequests: boolean;    // 팔로우 요청 허용
    showOnlineStatus: boolean;       // 온라인 상태 표시
  };
  preferences: {
    language: string;                // 언어 설정 (기본: 'ko')
    timezone: string;                // 시간대 (기본: 'Asia/Seoul')
    measurementUnit: 'metric' | 'imperial'; // 측정 단위
    defaultServingSize: number;      // 기본 인분 수
    cookingSkillLevel: UserLevel;    // 요리 실력 수준
  };
}

export interface IUser extends Document {
  // 기본 정보
  email: string;
  username: string;
  displayName: string;
  profileImage?: string;
  bio?: string;
  
  // 소셜 로그인 정보
  socialAccounts: SocialAccount[];
  primaryProvider: SocialProvider;
  
  // 개인 정보
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location?: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // 건강 및 식단 정보
  allergies: AllergyInfo[];
  dietaryPreferences: DietaryPreference[];
  healthGoals?: string[];  // 건강 목표 (예: '체중 감량', '근육 증가')
  
  // 통계 및 레벨
  stats: UserStats;
  
  // 설정
  settings: UserSettings;
  
  // 계정 상태
  isActive: boolean;
  isVerified: boolean;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  
  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  lastActiveAt: Date;
  
  // 가상 필드들
  age?: number;
  isOnline?: boolean;
}

const UserSchema = new Schema<IUser>({
  // 기본 정보
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/,
    index: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // 소셜 로그인 정보
  socialAccounts: [{
    provider: {
      type: String,
      enum: Object.values(SocialProvider),
      required: true
    },
    providerId: {
      type: String,
      required: true
    },
    email: String,
    profileUrl: String,
    accessToken: String,  // 실제로는 암호화해서 저장
    refreshToken: String, // 실제로는 암호화해서 저장
    connectedAt: {
      type: Date,
      default: Date.now
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  }],
  primaryProvider: {
    type: String,
    enum: Object.values(SocialProvider),
    required: true
  },
  
  // 개인 정보
  birthDate: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // 건강 및 식단 정보
  allergies: [{
    name: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    notes: String
  }],
  dietaryPreferences: [{
    type: {
      type: String,
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'low-carb', 'low-fat', 'halal', 'kosher'],
      required: true
    },
    isStrict: {
      type: Boolean,
      default: false
    },
    startDate: Date
  }],
  healthGoals: [String],
  
  // 통계 및 레벨
  stats: {
    totalRecipes: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLikes: {
      type: Number,
      default: 0,
      min: 0
    },
    totalFollowers: {
      type: Number,
      default: 0,
      min: 0
    },
    totalFollowing: {
      type: Number,
      default: 0,
      min: 0
    },
    totalCookingTime: {
      type: Number,
      default: 0,
      min: 0
    },
    experiencePoints: {
      type: Number,
      default: 0,
      min: 0
    },
    level: {
      type: String,
      enum: Object.values(UserLevel),
      default: UserLevel.BEGINNER
    },
    badges: [String],
    streakDays: {
      type: Number,
      default: 0,
      min: 0
    },
    lastCookingDate: Date
  },
  
  // 설정
  settings: {
    notifications: {
      recipeRecommendations: {
        type: Boolean,
        default: true
      },
      expiryReminders: {
        type: Boolean,
        default: true
      },
      socialActivity: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: true
      },
      pushEnabled: {
        type: Boolean,
        default: true
      },
      emailEnabled: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      recipeVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      fridgeVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
      },
      allowFollowRequests: {
        type: Boolean,
        default: true
      },
      showOnlineStatus: {
        type: Boolean,
        default: true
      }
    },
    preferences: {
      language: {
        type: String,
        default: 'ko'
      },
      timezone: {
        type: String,
        default: 'Asia/Seoul'
      },
      measurementUnit: {
        type: String,
        enum: ['metric', 'imperial'],
        default: 'metric'
      },
      defaultServingSize: {
        type: Number,
        default: 2,
        min: 1,
        max: 20
      },
      cookingSkillLevel: {
        type: String,
        enum: Object.values(UserLevel),
        default: UserLevel.BEGINNER
      }
    }
  },
  
  // 계정 상태
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false,
    index: true
  },
  premiumExpiresAt: Date,
  
  // 메타데이터
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드: 나이 계산
UserSchema.virtual('age').get(function() {
  if (!this.birthDate) return undefined;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// 가상 필드: 온라인 상태 (마지막 활동이 5분 이내)
UserSchema.virtual('isOnline').get(function() {
  if (!this.lastActiveAt) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.lastActiveAt > fiveMinutesAgo;
});

// 인덱스 설정
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ username: 1, isActive: 1 });
UserSchema.index({ 'socialAccounts.provider': 1, 'socialAccounts.providerId': 1 });
UserSchema.index({ 'stats.level': 1, 'stats.experiencePoints': -1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastActiveAt: -1 });

// 미들웨어: 레벨 자동 업데이트
UserSchema.pre('save', function(next) {
  if (this.isModified('stats.experiencePoints')) {
    const exp = this.stats.experiencePoints;
    if (exp >= 1000) {
      this.stats.level = UserLevel.EXPERT;
    } else if (exp >= 500) {
      this.stats.level = UserLevel.ADVANCED;
    } else if (exp >= 100) {
      this.stats.level = UserLevel.INTERMEDIATE;
    } else {
      this.stats.level = UserLevel.BEGINNER;
    }
  }
  next();
});

// 메서드: 소셜 계정 추가
UserSchema.methods['addSocialAccount'] = function(socialAccount: Omit<SocialAccount, 'connectedAt' | 'lastUsedAt'>) {
  const existingIndex = this['socialAccounts'].findIndex(
    (account: SocialAccount) => account.provider === socialAccount.provider
  );
  
  const newAccount = {
    ...socialAccount,
    connectedAt: new Date(),
    lastUsedAt: new Date()
  };
  
  if (existingIndex >= 0) {
    this['socialAccounts'][existingIndex] = newAccount;
  } else {
    this['socialAccounts'].push(newAccount);
  }
};

// 메서드: 경험치 추가
UserSchema.methods['addExperience'] = function(points: number, reason?: string) {
  this['stats'].experiencePoints += points;
  
  // 뱃지 시스템 (예시)
  if (points > 0 && reason) {
    const badgeMap: { [key: string]: number } = {
      'first_recipe': 10,
      'recipe_liked': 5,
      'daily_cooking': 15,
      'week_streak': 50
    };
    
    if (badgeMap[reason] && !this['stats'].badges.includes(reason)) {
      this['stats'].badges.push(reason);
    }
  }
};

// 메서드: 마지막 활동 시간 업데이트
UserSchema.methods['updateLastActive'] = function() {
  this['lastActiveAt'] = new Date();
  return this['save']();
};

export const User = mongoose.model<IUser>('User', UserSchema);
