import mongoose, { Document, Schema } from 'mongoose';

// 재료 카테고리
export enum IngredientCategory {
  VEGETABLES = 'vegetables',           // 채소류
  FRUITS = 'fruits',                  // 과일류
  MEAT = 'meat',                      // 육류
  SEAFOOD = 'seafood',                // 해산물
  DAIRY = 'dairy',                    // 유제품
  GRAINS = 'grains',                  // 곡물류
  LEGUMES = 'legumes',                // 콩류
  NUTS_SEEDS = 'nuts_seeds',          // 견과류/씨앗류
  HERBS_SPICES = 'herbs_spices',      // 허브/향신료
  OILS_FATS = 'oils_fats',           // 오일/지방류
  CONDIMENTS = 'condiments',          // 조미료
  BEVERAGES = 'beverages',            // 음료류
  BAKING = 'baking',                  // 베이킹 재료
  FROZEN = 'frozen',                  // 냉동식품
  CANNED = 'canned',                  // 통조림
  SNACKS = 'snacks',                  // 간식류
  OTHER = 'other'                     // 기타
}

// 보관 방법
export enum StorageMethod {
  ROOM_TEMPERATURE = 'room_temperature',  // 실온
  REFRIGERATED = 'refrigerated',          // 냉장
  FROZEN = 'frozen',                      // 냉동
  PANTRY = 'pantry',                      // 팬트리
  COOL_DRY_PLACE = 'cool_dry_place'      // 서늘하고 건조한 곳
}

// 측정 단위
export enum MeasurementUnit {
  // 무게
  GRAM = 'g',
  KILOGRAM = 'kg',
  POUND = 'lb',
  OUNCE = 'oz',
  
  // 부피
  MILLILITER = 'ml',
  LITER = 'l',
  CUP = 'cup',
  TABLESPOON = 'tbsp',
  TEASPOON = 'tsp',
  FLUID_OUNCE = 'fl_oz',
  PINT = 'pint',
  QUART = 'quart',
  GALLON = 'gallon',
  
  // 개수
  PIECE = 'piece',
  SLICE = 'slice',
  CLOVE = 'clove',
  BUNCH = 'bunch',
  PACKAGE = 'package',
  CAN = 'can',
  BOTTLE = 'bottle',
  
  // 기타
  PINCH = 'pinch',
  DASH = 'dash',
  TO_TASTE = 'to_taste'
}

// 영양 정보 (100g 기준)
export interface NutritionInfo {
  calories: number;           // 칼로리 (kcal)
  protein: number;           // 단백질 (g)
  carbohydrates: number;     // 탄수화물 (g)
  fat: number;               // 지방 (g)
  fiber: number;             // 식이섬유 (g)
  sugar: number;             // 당분 (g)
  sodium: number;            // 나트륨 (mg)
  cholesterol?: number;      // 콜레스테롤 (mg)
  vitamins?: {               // 비타민
    [key: string]: number;   // 비타민명: 함량
  };
  minerals?: {               // 미네랄
    [key: string]: number;   // 미네랄명: 함량
  };
}

// 알레르기 유발 요소
export enum AllergenType {
  GLUTEN = 'gluten',
  DAIRY = 'dairy',
  EGGS = 'eggs',
  FISH = 'fish',
  SHELLFISH = 'shellfish',
  TREE_NUTS = 'tree_nuts',
  PEANUTS = 'peanuts',
  SOY = 'soy',
  SESAME = 'sesame',
  SULFITES = 'sulfites'
}

// 재료 대체 정보
export interface SubstitutionInfo {
  ingredientId: mongoose.Types.ObjectId;  // 대체 재료 ID
  ratio: number;                          // 대체 비율 (1:1이면 1.0)
  notes?: string;                         // 대체 시 주의사항
  suitableFor: string[];                  // 적합한 요리 타입
}

export interface IIngredient extends Document {
  // 기본 정보
  name: string;                    // 재료명 (한국어)
  nameEn?: string;                 // 영어명
  aliases: string[];               // 별칭들 (예: 토마토 -> 방울토마토, 대추방울토마토)
  description?: string;            // 재료 설명
  
  // 분류
  category: IngredientCategory;
  subcategory?: string;            // 세부 카테고리 (예: 채소류 -> 잎채소)
  tags: string[];                  // 태그 (예: 'organic', 'seasonal', 'local')
  
  // 보관 및 유통기한
  storageMethod: StorageMethod;
  averageShelfLife: {              // 평균 유통기한 (일)
    unopened?: number;             // 미개봉 시
    opened?: number;               // 개봉 후
  };
  storageTemperature?: {           // 보관 온도 (섭씨)
    min: number;
    max: number;
  };
  storageTips?: string[];          // 보관 팁
  
  // 영양 정보
  nutrition: NutritionInfo;
  
  // 알레르기 정보
  allergens: AllergenType[];
  
  // 측정 단위
  commonUnits: MeasurementUnit[];  // 일반적으로 사용되는 단위들
  defaultUnit: MeasurementUnit;    // 기본 단위
  
  // 가격 정보 (선택적)
  averagePrice?: {
    amount: number;                // 가격
    unit: MeasurementUnit;         // 단위
    currency: string;              // 통화 (기본: KRW)
    region?: string;               // 지역
    lastUpdated: Date;             // 마지막 업데이트
  };
  
  // 계절성
  seasonality?: {
    peak: number[];                // 제철 월 (1-12)
    available: number[];           // 구매 가능한 월
    region?: string;               // 지역
  };
  
  // 대체 재료
  substitutions: SubstitutionInfo[];
  
  // 이미지
  images: string[];                // 재료 이미지 URLs
  
  // 메타데이터
  isActive: boolean;               // 활성 상태
  isVerified: boolean;             // 검증된 정보 여부
  source?: string;                 // 정보 출처
  createdBy?: mongoose.Types.ObjectId; // 생성자 (관리자 또는 검증된 사용자)
  
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredient>({
  // 기본 정보
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  nameEn: {
    type: String,
    trim: true,
    maxlength: 100
  },
  aliases: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  
  // 분류
  category: {
    type: String,
    enum: Object.values(IngredientCategory),
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    maxlength: 50
  },
  tags: [{
    type: String,
    maxlength: 30
  }],
  
  // 보관 및 유통기한
  storageMethod: {
    type: String,
    enum: Object.values(StorageMethod),
    required: true
  },
  averageShelfLife: {
    unopened: {
      type: Number,
      min: 0
    },
    opened: {
      type: Number,
      min: 0
    }
  },
  storageTemperature: {
    min: Number,
    max: Number
  },
  storageTips: [String],
  
  // 영양 정보
  nutrition: {
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    protein: {
      type: Number,
      required: true,
      min: 0
    },
    carbohydrates: {
      type: Number,
      required: true,
      min: 0
    },
    fat: {
      type: Number,
      required: true,
      min: 0
    },
    fiber: {
      type: Number,
      required: true,
      min: 0
    },
    sugar: {
      type: Number,
      required: true,
      min: 0
    },
    sodium: {
      type: Number,
      required: true,
      min: 0
    },
    cholesterol: {
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
  
  // 알레르기 정보
  allergens: [{
    type: String,
    enum: Object.values(AllergenType)
  }],
  
  // 측정 단위
  commonUnits: [{
    type: String,
    enum: Object.values(MeasurementUnit),
    required: true
  }],
  defaultUnit: {
    type: String,
    enum: Object.values(MeasurementUnit),
    required: true
  },
  
  // 가격 정보
  averagePrice: {
    amount: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: Object.values(MeasurementUnit)
    },
    currency: {
      type: String,
      default: 'KRW'
    },
    region: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // 계절성
  seasonality: {
    peak: [{
      type: Number,
      min: 1,
      max: 12
    }],
    available: [{
      type: Number,
      min: 1,
      max: 12
    }],
    region: String
  },
  
  // 대체 재료
  substitutions: [{
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    ratio: {
      type: Number,
      required: true,
      min: 0.1,
      max: 10
    },
    notes: String,
    suitableFor: [String]
  }],
  
  // 이미지
  images: [String],
  
  // 메타데이터
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  source: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 설정
IngredientSchema.index({ name: 'text', nameEn: 'text', aliases: 'text' }); // 텍스트 검색
IngredientSchema.index({ category: 1, isActive: 1 });
IngredientSchema.index({ 'nutrition.calories': 1 });
IngredientSchema.index({ allergens: 1 });
IngredientSchema.index({ tags: 1 });

// 가상 필드: 현재 계절 여부
IngredientSchema.virtual('isInSeason').get(function() {
  if (!this.seasonality?.available) return true;
  const currentMonth = new Date().getMonth() + 1;
  return this.seasonality.available.includes(currentMonth);
});

// 가상 필드: 제철 여부
IngredientSchema.virtual('isPeakSeason').get(function() {
  if (!this.seasonality?.peak) return false;
  const currentMonth = new Date().getMonth() + 1;
  return this.seasonality.peak.includes(currentMonth);
});

// 메서드: 단위 변환
IngredientSchema.methods['convertUnit'] = function(amount: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit): number {
  // 단위 변환 로직 구현 (예시)
  const conversionTable: { [key: string]: { [key: string]: number } } = {
    [MeasurementUnit.GRAM]: {
      [MeasurementUnit.KILOGRAM]: 0.001,
      [MeasurementUnit.OUNCE]: 0.035274,
      [MeasurementUnit.POUND]: 0.00220462
    },
    [MeasurementUnit.MILLILITER]: {
      [MeasurementUnit.LITER]: 0.001,
      [MeasurementUnit.CUP]: 0.00422675,
      [MeasurementUnit.TABLESPOON]: 0.067628,
      [MeasurementUnit.TEASPOON]: 0.202884
    }
    // 더 많은 변환 규칙 추가 가능
  };
  
  if (fromUnit === toUnit) return amount;
  
  const conversion = conversionTable[fromUnit]?.[toUnit];
  if (conversion) {
    return amount * conversion;
  }
  
  throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
};

export const Ingredient = mongoose.model<IIngredient>('Ingredient', IngredientSchema);
