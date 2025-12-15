import '../../domain/entities/ingredient.dart';
import '../../domain/repositories/ingredient_repository.dart';

class FirebaseIngredientRepository implements IngredientRepository {
  FirebaseIngredientRepository();

  @override
  Stream<List<Ingredient>> watchUserIngredients(String userId) {
    // TODO: Firebase 연동 후 구현
    return Stream.value([]);
  }

  @override
  Stream<List<Ingredient>> watchIngredientsByCategory(
    String userId,
    IngredientCategory category,
  ) {
    // TODO: Firebase 연동 후 구현
    return Stream.value([]);
  }

  @override
  Stream<List<Ingredient>> watchExpiringSoonIngredients(String userId) {
    // TODO: Firebase 연동 후 구현
    return Stream.value([]);
  }

  @override
  Future<void> addIngredient(Ingredient ingredient) async {
    // TODO: Firebase 연동 후 구현
  }

  @override
  Future<void> updateIngredient(Ingredient ingredient) async {
    // TODO: Firebase 연동 후 구현
  }

  @override
  Future<void> deleteIngredient(String ingredientId) async {
    // TODO: Firebase 연동 후 구현
  }

  @override
  Future<void> markAsConsumed(String ingredientId) async {
    // TODO: Firebase 연동 후 구현
  }

  @override
  Future<Ingredient?> getIngredient(String ingredientId) async {
    // TODO: Firebase 연동 후 구현
    return null;
  }
}