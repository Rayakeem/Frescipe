import mongoose, { Document, Schema } from 'mongoose';
import { MeasurementUnit, StorageMethod } from './Ingredient';

// 신선도 상태
export enum FreshnessStatus {
  EXCELLENT = 'excellent',     // 매우 신선 (90-100%)
  GOOD = 'good',              // 좋음 (70-89%)
  FAIR = 'fair',              // 보통 (50-69%)
  POOR = 'poor',              // 나쁨 (30-49%)
  EXPIRED = 'expired'         // 만료 (0-29%)
}

// 구매처 정보
export interface PurchaseInfo {
  store?: string;             // 구매처
  price?: number;             // 구매 가격
  currency?: string;          // 통화
  purchaseDate: Date;         // 구매일
  expiryDate?: Date;          // 유통기한
  batchNumber?: string;       // 배치 번호
  organic?: boolean;          // 유기농 여부
  brand?: string;             // 브랜드
}

// 냉장고 아이템
export interface IFridgeItem extends Document {
  // 기본 정보
  userId: mongoose.Types.ObjectId;       // 사용자 ID
  ingredientId: mongoose.Types.ObjectId; // 재료 ID
  ingredientName: string;                // 재료명 (검색 최적화)
  
  // 수량 및 단위
  quantity: number;                      // 현재 수량
  originalQuantity: number;              // 초기 수량
  unit: MeasurementUnit;                 // 단위
  
  // 보관 정보
  storageMethod: StorageMethod;          // 보관 방법
  location?: string;                     // 구체적 위치 (예: '냉장고 1단', '팬트리 상단')
  container?: string;                    // 보관 용기 (예: '밀폐용기', '비닐봉지')
  
  // 날짜 정보
  purchaseDate: Date;                    // 구매일
  expiryDate?: Date;                     // 유통기한
  openedDate?: Date;                     // 개봉일
  estimatedExpiryDate?: Date;            // 예상 유통기한 (개봉 후)
  
  // 상태 정보
  freshnessScore: number;                // 신선도 점수 (0-100)
  freshnessStatus: FreshnessStatus;      // 신선도 상태
  isOpened: boolean;                     // 개봉 여부
  isConsumed: boolean;                   // 소비 완료 여부
  
  // 구매 정보
  purchaseInfo?: PurchaseInfo;
  
  // 사용 기록
  usageHistory: {
    recipeId?: mongoose.Types.ObjectId;  // 사용된 레시피
    recipeName?: string;                 // 레시피명
    amountUsed: number;                  // 사용량
    unit: MeasurementUnit;               // 단위
    usedDate: Date;                      // 사용일
    notes?: string;                      // 메모
  }[];
  
  // 알림 설정
  notifications: {
    expiryReminder: boolean;             // 유통기한 알림
    lowQuantityAlert: boolean;           // 부족 알림
    reminderDays: number;                // 알림 일수 (유통기한 며칠 전)
    lowQuantityThreshold: number;        // 부족 기준 수량
  };
  
  // 메모 및 태그
  notes?: string;                        // 개인 메모
  tags: string[];                        // 태그 (예: 'sale', 'premium', 'gift')
  
  // 이미지
  images?: string[];                     // 아이템 사진
  
  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt?: Date;                  // 마지막 확인일
}

const FridgeItemSchema = new Schema<IFridgeItem>({
  // 기본 정보
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true,
    index: true
  },
  ingredientName: {
    type: String,
    required: true,
    index: true
  },
  
  // 수량 및 단위
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  originalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: Object.values(MeasurementUnit),
    required: true
  },
  
  // 보관 정보
  storageMethod: {
    type: String,
    enum: Object.values(StorageMethod),
    required: true
  },
  location: String,
  container: String,
  
  // 날짜 정보
  purchaseDate: {
    type: Date,
    required: true,
    index: true
  },
  expiryDate: {
    type: Date,
    index: true
  },
  openedDate: Date,
  estimatedExpiryDate: Date,
  
  // 상태 정보
  freshnessScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  freshnessStatus: {
    type: String,
    enum: Object.values(FreshnessStatus),
    default: FreshnessStatus.EXCELLENT,
    index: true
  },
  isOpened: {
    type: Boolean,
    default: false
  },
  isConsumed: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // 구매 정보
  purchaseInfo: {
    store: String,
    price: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'KRW'
    },
    purchaseDate: Date,
    expiryDate: Date,
    batchNumber: String,
    organic: Boolean,
    brand: String
  },
  
  // 사용 기록
  usageHistory: [{
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe'
    },
    recipeName: String,
    amountUsed: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: Object.values(MeasurementUnit),
      required: true
    },
    usedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    notes: String
  }],
  
  // 알림 설정
  notifications: {
    expiryReminder: {
      type: Boolean,
      default: true
    },
    lowQuantityAlert: {
      type: Boolean,
      default: true
    },
    reminderDays: {
      type: Number,
      default: 3,
      min: 1,
      max: 30
    },
    lowQuantityThreshold: {
      type: Number,
      default: 0.2,
      min: 0,
      max: 1
    }
  },
  
  // 메모 및 태그
  notes: String,
  tags: [String],
  
  // 이미지
  images: [String],
  
  // 메타데이터
  lastCheckedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 복합 인덱스
FridgeItemSchema.index({ userId: 1, ingredientId: 1 });
FridgeItemSchema.index({ userId: 1, expiryDate: 1 });
FridgeItemSchema.index({ userId: 1, freshnessStatus: 1 });
FridgeItemSchema.index({ userId: 1, isConsumed: 1, expiryDate: 1 });

// 가상 필드들
FridgeItemSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

FridgeItemSchema.virtual('isExpiringSoon').get(function() {
  const daysUntilExpiry = this.get('daysUntilExpiry');
  return daysUntilExpiry !== null && daysUntilExpiry <= this['notifications'].reminderDays;
});

FridgeItemSchema.virtual('isExpired').get(function() {
  const daysUntilExpiry = this.get('daysUntilExpiry');
  return daysUntilExpiry !== null && daysUntilExpiry < 0;
});

FridgeItemSchema.virtual('usagePercentage').get(function() {
  if (this['originalQuantity'] === 0) return 0;
  return ((this['originalQuantity'] - this['quantity']) / this['originalQuantity']) * 100;
});

FridgeItemSchema.virtual('isLowQuantity').get(function() {
  const threshold = this['originalQuantity'] * this['notifications'].lowQuantityThreshold;
  return this['quantity'] <= threshold;
});

// 미들웨어: 신선도 자동 업데이트
FridgeItemSchema.pre('save', function(next) {
  // 신선도 점수 계산을 직접 실행
  const now = new Date();
  const purchaseDate = new Date(this['purchaseDate']);
  const expiryDate = this['expiryDate'] ? new Date(this['expiryDate']) : null;
  
  let score = 100;
  
  if (expiryDate) {
    const totalLifespan = expiryDate.getTime() - purchaseDate.getTime();
    const timeElapsed = now.getTime() - purchaseDate.getTime();
    const timeRemaining = expiryDate.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      score = 0;
    } else {
      const ageRatio = timeElapsed / totalLifespan;
      score = Math.max(0, 100 - (ageRatio * 100));
    }
  } else {
    const daysElapsed = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
    score = Math.max(0, 100 - (daysElapsed * 2));
  }
  
  if (this['isOpened'] && this['openedDate']) {
    const daysSinceOpened = (now.getTime() - this['openedDate'].getTime()) / (1000 * 60 * 60 * 24);
    score = Math.max(0, score - (daysSinceOpened * 5));
  }
  
  this['freshnessScore'] = Math.round(score);
  
  if (score >= 90) {
    this['freshnessStatus'] = FreshnessStatus.EXCELLENT;
  } else if (score >= 70) {
    this['freshnessStatus'] = FreshnessStatus.GOOD;
  } else if (score >= 50) {
    this['freshnessStatus'] = FreshnessStatus.FAIR;
  } else if (score >= 30) {
    this['freshnessStatus'] = FreshnessStatus.POOR;
  } else {
    this['freshnessStatus'] = FreshnessStatus.EXPIRED;
  }
  
  next();
});

// 메서드: 신선도 점수 업데이트
FridgeItemSchema.methods['updateFreshnessScore'] = function() {
  const now = new Date();
  const purchaseDate = new Date(this['purchaseDate']);
  const expiryDate = this['expiryDate'] ? new Date(this['expiryDate']) : null;
  
  let score = 100;
  
  if (expiryDate) {
    const totalLifespan = expiryDate.getTime() - purchaseDate.getTime();
    const timeElapsed = now.getTime() - purchaseDate.getTime();
    const timeRemaining = expiryDate.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      // 만료됨
      score = 0;
    } else {
      // 시간 경과에 따른 점수 감소
      const ageRatio = timeElapsed / totalLifespan;
      score = Math.max(0, 100 - (ageRatio * 100));
    }
  } else {
    // 유통기한이 없는 경우, 구매일로부터의 경과 시간으로 계산
    const daysElapsed = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
    score = Math.max(0, 100 - (daysElapsed * 2)); // 하루에 2점씩 감소
  }
  
  // 개봉 여부에 따른 추가 감점
  if (this['isOpened'] && this['openedDate']) {
    const daysSinceOpened = (now.getTime() - this['openedDate'].getTime()) / (1000 * 60 * 60 * 24);
    score = Math.max(0, score - (daysSinceOpened * 5)); // 개봉 후 하루에 5점씩 추가 감점
  }
  
  this['freshnessScore'] = Math.round(score);
  
  // 신선도 상태 업데이트
  if (score >= 90) {
    this['freshnessStatus'] = FreshnessStatus.EXCELLENT;
  } else if (score >= 70) {
    this['freshnessStatus'] = FreshnessStatus.GOOD;
  } else if (score >= 50) {
    this['freshnessStatus'] = FreshnessStatus.FAIR;
  } else if (score >= 30) {
    this['freshnessStatus'] = FreshnessStatus.POOR;
  } else {
    this['freshnessStatus'] = FreshnessStatus.EXPIRED;
  }
};

// 메서드: 재료 사용
FridgeItemSchema.methods['useIngredient'] = function(amount: number, unit: MeasurementUnit, recipeId?: mongoose.Types.ObjectId, recipeName?: string, notes?: string) {
  // 단위 변환 로직 필요 (추후 구현)
  if (unit !== this['unit']) {
    throw new Error(`Unit mismatch: expected ${this['unit']}, got ${unit}`);
  }
  
  if (amount > this['quantity']) {
    throw new Error(`Insufficient quantity: requested ${amount}, available ${this['quantity']}`);
  }
  
  // 수량 차감
  this['quantity'] -= amount;
  
  // 사용 기록 추가
  this['usageHistory'].push({
    recipeId,
    recipeName,
    amountUsed: amount,
    unit,
    usedDate: new Date(),
    notes
  });
  
  // 완전 소비 체크
  if (this['quantity'] <= 0) {
    this['isConsumed'] = true;
    this['quantity'] = 0;
  }
  
  return this['save']();
};

// 메서드: 개봉 처리
FridgeItemSchema.methods['markAsOpened'] = function() {
  if (!this['isOpened']) {
    this['isOpened'] = true;
    this['openedDate'] = new Date();
    
    // 개봉 후 예상 유통기한 계산 (재료별로 다르게 설정 가능)
    if (!this['estimatedExpiryDate']) {
      const openedShelfLife = 7; // 기본 7일 (실제로는 재료별로 다름)
      this['estimatedExpiryDate'] = new Date(Date.now() + openedShelfLife * 24 * 60 * 60 * 1000);
    }
  }
  return this['save']();
};

export const FridgeItem = mongoose.model<IFridgeItem>('FridgeItem', FridgeItemSchema);

// 냉장고 요약 정보 (가상 컬렉션)
export interface IFridgeSummary {
  userId: mongoose.Types.ObjectId;
  totalItems: number;
  expiringSoonCount: number;
  expiredCount: number;
  lowQuantityCount: number;
  categories: {
    [category: string]: number;
  };
  totalValue?: number;
  lastUpdated: Date;
}

// 냉장고 통계를 위한 집계 함수들
export class FridgeService {
  static async getFridgeSummary(userId: mongoose.Types.ObjectId): Promise<IFridgeSummary> {
    const items = await FridgeItem.find({ 
      userId, 
      isConsumed: false 
    }).populate('ingredientId');
    
    const summary: IFridgeSummary = {
      userId,
      totalItems: items.length,
      expiringSoonCount: 0,
      expiredCount: 0,
      lowQuantityCount: 0,
      categories: {},
      totalValue: 0,
      lastUpdated: new Date()
    };
    
    items.forEach(item => {
      // 만료 관련 카운트
      if (item.get('isExpired')) {
        summary.expiredCount++;
      } else if (item.get('isExpiringSoon')) {
        summary.expiringSoonCount++;
      }
      
      // 부족 수량 카운트
      if (item.get('isLowQuantity')) {
        summary.lowQuantityCount++;
      }
      
      // 카테고리별 카운트
      const ingredient = item.ingredientId as any;
      if (ingredient && ingredient.category) {
        summary.categories[ingredient.category] = (summary.categories[ingredient.category] || 0) + 1;
      }
      
      // 총 가치 계산
      if (item.purchaseInfo?.price) {
        summary.totalValue! += item.purchaseInfo.price * (item.quantity / item.originalQuantity);
      }
    });
    
    return summary;
  }
  
  static async getExpiringItems(userId: mongoose.Types.ObjectId, days: number = 3) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    return FridgeItem.find({
      userId,
      isConsumed: false,
      expiryDate: { $lte: targetDate, $gte: new Date() }
    }).populate('ingredientId').sort({ expiryDate: 1 });
  }
  
  static async getIngredientsByCategory(userId: mongoose.Types.ObjectId, category?: string) {
    const matchCondition: any = { 
      userId, 
      isConsumed: false 
    };
    
    const pipeline = [
      { $match: matchCondition },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'ingredientId',
          foreignField: '_id',
          as: 'ingredient'
        }
      },
      { $unwind: '$ingredient' }
    ];
    
    if (category) {
      pipeline.push({ $match: { 'ingredient.category': category } });
    }
    
    pipeline.push({
      '$group': {
        _id: '$ingredient.category',
        items: { '$push': '$$ROOT' },
        count: { '$sum': 1 }
      }
    } as any);
    
    return FridgeItem.aggregate(pipeline);
  }
}
