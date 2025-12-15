import '../entities/ingredient.dart';
import '../repositories/ingredient_repository.dart';

class AddIngredientUseCase {
  const AddIngredientUseCase(this._repository);

  final IngredientRepository _repository;

  Future<void> call({
    required String name,
    required IngredientCategory category,
    required QuantityLevel quantityLevel,
    required DateTime expiryDate,
  }) async {
    final ingredient = Ingredient(
      id: '', // Will be set by repository
      name: name.trim(),
      category: category,
      quantityLevel: quantityLevel,
      expiryDate: expiryDate,
      addedAt: DateTime.now(),
    );

    await _repository.addIngredient(ingredient);
  }
}
