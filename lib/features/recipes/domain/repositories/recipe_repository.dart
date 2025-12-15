import '../entities/recipe.dart';

abstract class RecipeRepository {
  /// 레시피 검색
  Future<List<Recipe>> searchRecipes({
    required String query,
    int? maxCookingTime,
    RecipeDifficulty? difficulty,
  });

  /// 레시피 상세 조회
  Future<Recipe?> getRecipe(String recipeId);

  /// 추천 레시피 조회
  Future<List<Recipe>> getRecommendedRecipes({
    List<String>? availableIngredients,
    List<String>? userGoals,
  });
}