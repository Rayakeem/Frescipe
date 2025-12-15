import '../entities/ingredient.dart';
import '../repositories/ingredient_repository.dart';

class GetUserIngredientsUseCase {
  const GetUserIngredientsUseCase(this._repository);

  final IngredientRepository _repository;

  Stream<List<Ingredient>> call(String userId) {
    return _repository.watchUserIngredients(userId);
  }

  Stream<List<Ingredient>> byCategory(String userId, IngredientCategory category) {
    return _repository.watchIngredientsByCategory(userId, category);
  }

  Stream<List<Ingredient>> expiringSoon(String userId) {
    return _repository.watchExpiringSoonIngredients(userId);
  }
}
