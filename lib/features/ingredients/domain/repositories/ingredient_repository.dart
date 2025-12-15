import '../entities/ingredient.dart';

abstract class IngredientRepository {
  /// 사용자의 모든 재료 조회
  Stream<List<Ingredient>> watchUserIngredients(String userId);
  
  /// 특정 카테고리의 재료 조회
  Stream<List<Ingredient>> watchIngredientsByCategory(
    String userId, 
    IngredientCategory category,
  );
  
  /// 유통기한 임박 재료 조회
  Stream<List<Ingredient>> watchExpiringSoonIngredients(String userId);
  
  /// 재료 추가
  Future<void> addIngredient(Ingredient ingredient);
  
  /// 재료 수정
  Future<void> updateIngredient(Ingredient ingredient);
  
  /// 재료 삭제
  Future<void> deleteIngredient(String ingredientId);
  
  /// 재료 소진 처리
  Future<void> markAsConsumed(String ingredientId);
  
  /// 특정 재료 조회
  Future<Ingredient?> getIngredient(String ingredientId);
}
