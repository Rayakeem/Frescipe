import '../entities/challenge.dart';
import '../repositories/challenge_repository.dart';
import '../../../recipes/domain/repositories/recipe_repository.dart';
import '../../../recipes/domain/entities/recipe.dart';

class StartChallengeUseCase {
  const StartChallengeUseCase(
    this._challengeRepository,
    this._recipeRepository,
  );

  final ChallengeRepository _challengeRepository;
  final RecipeRepository _recipeRepository;

  /// 3일 챌린지 시작
  Future<Challenge> call({
    required String userId,
    required String mainIngredientId,
    required String mainIngredientName,
  }) async {
    // 1. 기존 활성 챌린지 확인
    final existingChallenge = await _challengeRepository.getActiveChallenge(userId);
    if (existingChallenge != null) {
      throw Exception('이미 진행 중인 챌린지가 있습니다.');
    }

    // 2. 메인 재료를 활용한 3일 레시피 생성
    final recipes = await _generateThreeDayRecipes(mainIngredientName);
    if (recipes.length < 3) {
      throw Exception('충분한 레시피를 생성할 수 없습니다.');
    }

    // 3. 챌린지 생성
    final challenge = Challenge(
      id: '', // Repository에서 설정
      userId: userId,
      mainIngredientId: mainIngredientId,
      startDate: DateTime.now(),
      status: ChallengeStatus.active,
      dailyPlans: [
        DailyPlan(day: 1, recipeId: recipes[0].id),
        DailyPlan(day: 2, recipeId: recipes[1].id),
        DailyPlan(day: 3, recipeId: recipes[2].id),
      ],
    );

    // 4. 챌린지 저장
    return await _challengeRepository.createChallenge(challenge);
  }

  /// 메인 재료를 활용한 3일 레시피 생성
  Future<List<Recipe>> _generateThreeDayRecipes(String mainIngredient) async {
    // 1일차: 간단한 요리 (30분 이내)
    final day1Recipes = await _recipeRepository.searchRecipes(
      query: mainIngredient,
      maxCookingTime: 30,
      difficulty: RecipeDifficulty.easy,
    );

    // 2일차: 보통 난이도 요리
    final day2Recipes = await _recipeRepository.searchRecipes(
      query: mainIngredient,
      maxCookingTime: 45,
      difficulty: RecipeDifficulty.medium,
    );

    // 3일차: 남은 재료 활용 요리
    final day3Recipes = await _recipeRepository.searchRecipes(
      query: '$mainIngredient 남은',
      maxCookingTime: 60,
    );

    final selectedRecipes = <Recipe>[];
    
    if (day1Recipes.isNotEmpty) selectedRecipes.add(day1Recipes.first);
    if (day2Recipes.isNotEmpty) selectedRecipes.add(day2Recipes.first);
    if (day3Recipes.isNotEmpty) selectedRecipes.add(day3Recipes.first);

    // 부족한 경우 일반 레시피로 보완
    while (selectedRecipes.length < 3) {
      final fallbackRecipes = await _recipeRepository.searchRecipes(
        query: mainIngredient,
      );
      
      for (final recipe in fallbackRecipes) {
        if (!selectedRecipes.any((r) => r.id == recipe.id)) {
          selectedRecipes.add(recipe);
          break;
        }
      }
      
      if (fallbackRecipes.isEmpty) break;
    }

    return selectedRecipes;
  }
}
