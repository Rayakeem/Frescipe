import '../../domain/entities/recipe.dart';
import '../../domain/repositories/recipe_repository.dart';

class FirebaseRecipeRepository implements RecipeRepository {
  FirebaseRecipeRepository();

  @override
  Future<List<Recipe>> searchRecipes({
    required String query,
    int? maxCookingTime,
    RecipeDifficulty? difficulty,
  }) async {
    // TODO: Firebase 연동 후 구현
    return [];
  }

  @override
  Future<Recipe?> getRecipe(String recipeId) async {
    // TODO: Firebase 연동 후 구현
    return null;
  }

  @override
  Future<List<Recipe>> getRecommendedRecipes({
    List<String>? availableIngredients,
    List<String>? userGoals,
  }) async {
    // TODO: Firebase 연동 후 구현
    return [];
  }
}