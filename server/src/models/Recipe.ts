import mongoose, { Document, Schema } from 'mongoose';
import { MeasurementUnit } from './Ingredient';

// 레시피 난이도
export enum RecipeDifficulty {
  VERY_EASY = 'very_easy',     // 매우 쉬움 (10분 이하, 3단계 이하)
  EASY = 'easy',               // 쉬움 (30분 이하, 5단계 이하)
  MEDIUM = 'medium',           // 보통 (1시간 이하, 10단계 이하)
  HARD = 'hard',               // 어려움 (2시간 이하, 15단계 이하)
  VERY_HARD = 'very_hard'      // 매우 어려움 (2시간 이상 또는 복잡한 기술)
}

// 요리 방법
export enum CookingMethod {
  BOILING = 'boiling',         // 끓이기
  STEAMING = 'steaming',       // 찌기
  FRYING = 'frying',           // 튀기기
  STIR_FRYING = 'stir_frying', // 볶기
  GRILLING = 'grilling',       // 굽기
  BAKING = 'baking',           // 베이킹
  ROASTING = 'roasting',       // 로스팅
  BRAISING = 'braising',       // 조리기
  SAUTEING = 'sauteing',       // 소테
  BLANCHING = 'blanching',     // 데치기
  MARINATING = 'marinating',   // 재우기
  FERMENTING = 'fermenting',   // 발효
  RAW = 'raw',                 // 생식
  SLOW_COOKING = 'slow_cooking', // 저속 조리
  PRESSURE_COOKING = 'pressure_cooking', // 압력 조리
  SMOKING = 'smoking',         // 훈제
  PICKLING = 'pickling'        // 절임
}

// 레시피 카테고리
export enum RecipeCategory {
  APPETIZER = 'appetizer',     // 전채요리
  MAIN_COURSE = 'main_course', // 메인요리
  SIDE_DISH = 'side_dish',     // 반찬
  SOUP = 'soup',               // 국/탕
  SALAD = 'salad',             // 샐러드
  DESSERT = 'dessert',         // 디저트
  BEVERAGE = 'beverage',       // 음료
  SNACK = 'snack',             // 간식
  BREAKFAST = 'breakfast',     // 아침식사
  LUNCH = 'lunch',             // 점심식사
  DINNER = 'dinner',           // 저녁식사
  BRUNCH = 'brunch',           // 브런치
  SAUCE = 'sauce',             // 소스/양념
  BREAD = 'bread',             // 빵류
  NOODLES = 'noodles',         // 면류
  RICE = 'rice',               // 밥류
  STEW = 'stew',               // 찌개
  KIMCHI = 'kimchi',           // 김치류
  BANCHAN = 'banchan'          // 반찬류
}

// 식단 타입
export enum DietType {
  REGULAR = 'regular',         // 일반식
  VEGETARIAN = 'vegetarian',   // 채식
  VEGAN = 'vegan',             // 비건
  KETO = 'keto',               // 케토
  PALEO = 'paleo',             // 팔레오
  GLUTEN_FREE = 'gluten_free', // 글루텐 프리
  LOW_CARB = 'low_carb',       // 저탄수화물
  LOW_FAT = 'low_fat',         // 저지방
  HIGH_PROTEIN = 'high_protein', // 고단백
  DIABETIC = 'diabetic',       // 당뇨식
  LOW_SODIUM = 'low_sodium',   // 저나트륨
  HALAL = 'halal',             // 할랄
  KOSHER = 'kosher'            // 코셔
}

// 재료 정보
export interface RecipeIngredient {
  ingredientId: mongoose.Types.ObjectId;  // 재료 ID
  name: string;                           // 재료명 (검색 최적화용)
  amount: number;                         // 양
  unit: MeasurementUnit;                  // 단위
  notes?: string;                         // 추가 설명 (예: "잘게 썬", "실온에 둔")
  isOptional: boolean;                    // 선택 재료 여부
  substitutes?: {                         // 대체 재료
    ingredientId: mongoose.Types.ObjectId;
    name: string;
    amount: number;
    unit: MeasurementUnit;
    notes?: string;
  }[];
}

// 조리 단계
export interface CookingStep {
  stepNumber: number;                     // 단계 번호
  title?: string;                         // 단계 제목
  description: string;                    // 조리 방법 설명
  duration?: number;                      // 소요 시간 (분)
  temperature?: {                         // 온도 설정
    value: number;
    unit: 'celsius' | 'fahrenheit';
  };
  tips?: string[];                        // 팁
  images?: string[];                      // 단계별 이미지
  video?: string;                         // 단계별 비디오 URL
  timer?: {                               // 타이머 설정
    duration: number;                     // 시간 (초)
    message: string;                      // 알림 메시지
  };
}

// 영양 정보 (1인분 기준)
export interface RecipeNutrition {
  calories: number;                       // 칼로리
  protein: number;                        // 단백질 (g)
  carbohydrates: number;                  // 탄수화물 (g)
  fat: number;                           // 지방 (g)
  fiber: number;                         // 식이섬유 (g)
  sugar: number;                         // 당분 (g)
  sodium: number;                        // 나트륨 (mg)
  cholesterol?: number;                  // 콜레스테롤 (mg)
  saturatedFat?: number;                 // 포화지방 (g)
  transFat?: number;                     // 트랜스지방 (g)
  vitamins?: Map<string, number>;        // 비타민
  minerals?: Map<string, number>;        // 미네랄
}

// 레시피 평가
export interface RecipeRating {
  userId: mongoose.Types.ObjectId;
  rating: number;                        // 1-5점
  review?: string;                       // 리뷰 내용
  images?: string[];                     // 완성품 사진
  cookingTime?: number;                  // 실제 조리 시간
  difficulty?: RecipeDifficulty;         // 체감 난이도
  wouldMakeAgain: boolean;               // 재조리 의향
  tags?: string[];                       // 태그 (예: 'too_salty', 'perfect', 'needs_more_time')
  createdAt: Date;
  updatedAt: Date;
}

// 레시피 수정 이력
export interface RecipeVersion {
  version: number;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  modifiedBy: mongoose.Types.ObjectId;
  modificationReason?: string;
  createdAt: Date;
}

export interface IRecipe extends Document {
  // 기본 정보
  title: string;
  description: string;
  summary?: string;                      // 한 줄 요약
  
  // 작성자 정보
  author: mongoose.Types.ObjectId;       // 작성자 ID
  authorName: string;                    // 작성자 이름 (검색 최적화)
  
  // 분류 및 태그
  category: RecipeCategory;
  subcategory?: string;                  // 세부 카테고리
  cuisine?: string;                      // 요리 종류 (한식, 중식, 일식 등)
  dietTypes: DietType[];                 // 식단 타입들
  tags: string[];                        // 자유 태그
  
  // 재료 및 조리법
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  
  // 조리 정보
  servings: number;                      // 인분 수
  prepTime: number;                      // 준비 시간 (분)
  cookTime: number;                      // 조리 시간 (분)
  totalTime: number;                     // 총 소요 시간 (분)
  difficulty: RecipeDifficulty;
  cookingMethods: CookingMethod[];       // 사용된 조리 방법들
  
  // 영양 정보
  nutrition?: RecipeNutrition;
  
  // 미디어
  images: string[];                      // 레시피 이미지들
  mainImage?: string;                    // 대표 이미지
  videos?: string[];                     // 동영상 URLs
  
  // 소셜 기능
  likes: mongoose.Types.ObjectId[];      // 좋아요한 사용자들
  bookmarks: mongoose.Types.ObjectId[];  // 북마크한 사용자들
  ratings: RecipeRating[];               // 평가들
  comments: mongoose.Types.ObjectId[];   // 댓글 IDs
  shares: number;                        // 공유 횟수
  
  // 통계
  stats: {
    views: number;                       // 조회수
    likes: number;                       // 좋아요 수
    bookmarks: number;                   // 북마크 수
    comments: number;                    // 댓글 수
    averageRating: number;               // 평균 평점
    totalRatings: number;                // 총 평가 수
    successRate: number;                 // 성공률 (완성 사진 업로드 비율)
    avgCookingTime: number;              // 평균 실제 조리 시간
  };
  
  // 상태 및 설정
  status: 'draft' | 'published' | 'private' | 'archived';
  visibility: 'public' | 'friends' | 'private';
  isVerified: boolean;                   // 검증된 레시피 여부
  isFeatured: boolean;                   // 추천 레시피 여부
  
  // 저속노화 관련
  isSlowAging: boolean;                  // 저속노화 레시피 여부
  slowAgingBenefits?: string[];          // 저속노화 효과
  antioxidantScore?: number;             // 항산화 점수 (0-100)
  
  // 계절성 및 특별 정보
  seasonality?: number[];                // 제철 월 (1-12)
  occasions?: string[];                  // 적합한 상황 (생일, 명절 등)
  equipment?: string[];                  // 필요한 조리도구
  
  // 버전 관리
  versions: RecipeVersion[];             // 수정 이력
  currentVersion: number;
  
  // 메타데이터
  source?: string;                       // 출처 (외부에서 가져온 경우)
  originalUrl?: string;                  // 원본 URL
  language: string;                      // 언어 (기본: 'ko')
  
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  lastViewedAt?: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  // 기본 정보
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  summary: {
    type: String,
    maxlength: 300
  },
  
  // 작성자 정보
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  authorName: {
    type: String,
    required: true,
    index: true
  },
  
  // 분류 및 태그
  category: {
    type: String,
    enum: Object.values(RecipeCategory),
    required: true,
    index: true
  },
  subcategory: String,
  cuisine: {
    type: String,
    index: true
  },
  dietTypes: [{
    type: String,
    enum: Object.values(DietType)
  }],
  tags: [{
    type: String,
    maxlength: 30
  }],
  
  // 재료 및 조리법
  ingredients: [{
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: Object.values(MeasurementUnit),
      required: true
    },
    notes: String,
    isOptional: {
      type: Boolean,
      default: false
    },
    substitutes: [{
      ingredientId: {
        type: Schema.Types.ObjectId,
        ref: 'Ingredient'
      },
      name: String,
      amount: Number,
      unit: {
        type: String,
        enum: Object.values(MeasurementUnit)
      },
      notes: String
    }]
  }],
  
  steps: [{
    stepNumber: {
      type: Number,
      required: true,
      min: 1
    },
    title: String,
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    duration: {
      type: Number,
      min: 0
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit']
      }
    },
    tips: [String],
    images: [String],
    video: String,
    timer: {
      duration: Number,
      message: String
    }
  }],
  
  // 조리 정보
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  cookTime: {
    type: Number,
    required: true,
    min: 0
  },
  totalTime: {
    type: Number,
    required: true,
    min: 0
  },
  difficulty: {
    type: String,
    enum: Object.values(RecipeDifficulty),
    required: true
  },
  cookingMethods: [{
    type: String,
    enum: Object.values(CookingMethod)
  }],
  
  // 영양 정보
  nutrition: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbohydrates: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    },
    sugar: {
      type: Number,
      min: 0
    },
    sodium: {
      type: Number,
      min: 0
    },
    cholesterol: {
      type: Number,
      min: 0
    },
    saturatedFat: {
      type: Number,
      min: 0
    },
    transFat: {
      type: Number,
      min: 0
    },
    vitamins: {
      type: Map,
      of: Number
    },
    minerals: {
      type: Map,
      of: Number
    }
  },
  
  // 미디어
  images: [String],
  mainImage: String,
  videos: [String],
  
  // 소셜 기능
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    images: [String],
    cookingTime: Number,
    difficulty: {
      type: String,
      enum: Object.values(RecipeDifficulty)
    },
    wouldMakeAgain: {
      type: Boolean,
      default: true
    },
    tags: [String]
  }, {
    timestamps: true
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // 통계
  stats: {
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    bookmarks: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    avgCookingTime: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // 상태 및 설정
  status: {
    type: String,
    enum: ['draft', 'published', 'private', 'archived'],
    default: 'draft',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public',
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // 저속노화 관련
  isSlowAging: {
    type: Boolean,
    default: false,
    index: true
  },
  slowAgingBenefits: [String],
  antioxidantScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // 계절성 및 특별 정보
  seasonality: [{
    type: Number,
    min: 1,
    max: 12
  }],
  occasions: [String],
  equipment: [String],
  
  // 버전 관리
  versions: [{
    version: {
      type: Number,
      required: true
    },
    title: String,
    description: String,
    ingredients: [Schema.Types.Mixed],
    steps: [Schema.Types.Mixed],
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    modificationReason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  currentVersion: {
    type: Number,
    default: 1
  },
  
  // 메타데이터
  source: String,
  originalUrl: String,
  language: {
    type: String,
    default: 'ko'
  },
  
  publishedAt: Date,
  lastViewedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' }); // 텍스트 검색
RecipeSchema.index({ category: 1, status: 1, visibility: 1 });
RecipeSchema.index({ author: 1, status: 1 });
RecipeSchema.index({ 'stats.averageRating': -1, 'stats.totalRatings': -1 });
RecipeSchema.index({ createdAt: -1 });
RecipeSchema.index({ 'stats.views': -1 });
RecipeSchema.index({ isSlowAging: 1, status: 1 });
RecipeSchema.index({ dietTypes: 1 });
RecipeSchema.index({ difficulty: 1, totalTime: 1 });

// 가상 필드들
RecipeSchema.virtual('isPopular').get(function() {
  return this.stats.views > 1000 || this.stats.likes > 100;
});

RecipeSchema.virtual('isHighlyRated').get(function() {
  return this.stats.averageRating >= 4.0 && this.stats.totalRatings >= 10;
});

RecipeSchema.virtual('estimatedCost').get(function() {
  // 재료 비용 계산 로직 (추후 구현)
  return 0;
});

// 미들웨어: 통계 업데이트
RecipeSchema.pre('save', function(next) {
  // 총 시간 계산
  this.totalTime = this.prepTime + this.cookTime;
  
  // 통계 업데이트
  this.stats.likes = this.likes.length;
  this.stats.bookmarks = this.bookmarks.length;
  this.stats.comments = this.comments.length;
  this.stats.totalRatings = this.ratings.length;
  
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.stats.averageRating = totalRating / this.ratings.length;
  }
  
  next();
});

// 메서드: 좋아요 토글
RecipeSchema.methods['toggleLike'] = function(userId: mongoose.Types.ObjectId) {
  const likeIndex = this['likes'].indexOf(userId);
  if (likeIndex > -1) {
    this['likes'].splice(likeIndex, 1);
    return false; // 좋아요 취소
  } else {
    this['likes'].push(userId);
    return true; // 좋아요 추가
  }
};

// 메서드: 북마크 토글
RecipeSchema.methods['toggleBookmark'] = function(userId: mongoose.Types.ObjectId) {
  const bookmarkIndex = this['bookmarks'].indexOf(userId);
  if (bookmarkIndex > -1) {
    this['bookmarks'].splice(bookmarkIndex, 1);
    return false; // 북마크 취소
  } else {
    this['bookmarks'].push(userId);
    return true; // 북마크 추가
  }
};

// 메서드: 조회수 증가
RecipeSchema.methods['incrementViews'] = function() {
  this['stats'].views += 1;
  this['lastViewedAt'] = new Date();
  return this['save']();
};

// 메서드: 인분 수 조정
RecipeSchema.methods['adjustServings'] = function(newServings: number) {
  const ratio = newServings / this['servings'];
  
  return {
    servings: newServings,
    ingredients: this['ingredients'].map((ingredient: any) => ({
      ...ingredient.toObject(),
      amount: ingredient.amount * ratio
    }))
  };
};

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
