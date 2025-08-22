// 모든 모델들을 한 곳에서 export
export { User, IUser, SocialProvider, UserLevel } from './User';
export { 
  Ingredient, 
  IIngredient, 
  IngredientCategory, 
  StorageMethod, 
  MeasurementUnit, 
  AllergenType 
} from './Ingredient';
export { 
  Recipe, 
  IRecipe, 
  RecipeDifficulty, 
  CookingMethod, 
  RecipeCategory, 
  DietType 
} from './Recipe';
export { 
  FridgeItem, 
  IFridgeItem, 
  FreshnessStatus, 
  FridgeService,
  IFridgeSummary 
} from './Fridge';
export { 
  Follow, 
  Comment, 
  Notification, 
  Report, 
  Activity,
  IFollow,
  IComment,
  INotification,
  IReport,
  IActivity,
  NotificationType,
  ReportType,
  ActivityType,
  SocialService
} from './Social';

// 데이터베이스 초기화 함수
import mongoose from 'mongoose';

export const initializeDatabase = async () => {
  try {
    // 모든 모델이 등록되었는지 확인
    const models = [
      'User',
      'Ingredient', 
      'Recipe',
      'FridgeItem',
      'Follow',
      'Comment',
      'Notification',
      'Report',
      'Activity'
    ];
    
    console.log('📋 등록된 모델들:');
    models.forEach(modelName => {
      if (mongoose.models[modelName]) {
        console.log(`  ✅ ${modelName}`);
      } else {
        console.log(`  ❌ ${modelName} - 등록되지 않음`);
      }
    });
    
    console.log('🗄️ 데이터베이스 모델 초기화 완료');
    
  } catch (error) {
    console.error('❌ 데이터베이스 모델 초기화 실패:', error);
    throw error;
  }
};
