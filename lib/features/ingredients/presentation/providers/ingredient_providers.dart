import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:firebase_auth/firebase_auth.dart';

import '../../data/repositories/firebase_ingredient_repository.dart';
import '../../domain/entities/ingredient.dart';
import '../../domain/repositories/ingredient_repository.dart';
import '../../domain/usecases/add_ingredient_usecase.dart';
import '../../domain/usecases/get_user_ingredients_usecase.dart';

// Repository Provider
final ingredientRepositoryProvider = Provider<IngredientRepository>((ref) {
  return FirebaseIngredientRepository();
});

// Use Cases Providers
final addIngredientUseCaseProvider = Provider<AddIngredientUseCase>((ref) {
  final repository = ref.watch(ingredientRepositoryProvider);
  return AddIngredientUseCase(repository);
});

final getUserIngredientsUseCaseProvider = Provider<GetUserIngredientsUseCase>((ref) {
  final repository = ref.watch(ingredientRepositoryProvider);
  return GetUserIngredientsUseCase(repository);
});

// Current User Provider (임시 Mock)
final currentUserProvider = StreamProvider<String?>((ref) {
  return Stream.value('demo-user-id'); // 임시 사용자 ID
});

// Ingredients Stream Providers
final userIngredientsProvider = StreamProvider<List<Ingredient>>((ref) {
  final userId = ref.watch(currentUserProvider).value;
  if (userId == null) return Stream.value([]);

  final useCase = ref.watch(getUserIngredientsUseCaseProvider);
  return useCase.call(userId);
});

final fridgeIngredientsProvider = StreamProvider<List<Ingredient>>((ref) {
  final userId = ref.watch(currentUserProvider).value;
  if (userId == null) return Stream.value([]);

  final useCase = ref.watch(getUserIngredientsUseCaseProvider);
  return useCase.byCategory(userId, IngredientCategory.fridge);
});

final freezerIngredientsProvider = StreamProvider<List<Ingredient>>((ref) {
  final userId = ref.watch(currentUserProvider).value;
  if (userId == null) return Stream.value([]);

  final useCase = ref.watch(getUserIngredientsUseCaseProvider);
  return useCase.byCategory(userId, IngredientCategory.freezer);
});

final pantryIngredientsProvider = StreamProvider<List<Ingredient>>((ref) {
  final userId = ref.watch(currentUserProvider).value;
  if (userId == null) return Stream.value([]);

  final useCase = ref.watch(getUserIngredientsUseCaseProvider);
  return useCase.byCategory(userId, IngredientCategory.pantry);
});

final expiringSoonIngredientsProvider = StreamProvider<List<Ingredient>>((ref) {
  final userId = ref.watch(currentUserProvider).value;
  if (userId == null) return Stream.value([]);

  final useCase = ref.watch(getUserIngredientsUseCaseProvider);
  return useCase.expiringSoon(userId);
});

// Add Ingredient State Provider
final addIngredientStateProvider = StateNotifierProvider<AddIngredientNotifier, AddIngredientState>((ref) {
  final useCase = ref.watch(addIngredientUseCaseProvider);
  return AddIngredientNotifier(useCase);
});

class AddIngredientState {
  const AddIngredientState({
    this.isLoading = false,
    this.error,
  });

  final bool isLoading;
  final String? error;

  AddIngredientState copyWith({
    bool? isLoading,
    String? error,
  }) {
    return AddIngredientState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AddIngredientNotifier extends StateNotifier<AddIngredientState> {
  AddIngredientNotifier(this._addIngredientUseCase) : super(const AddIngredientState());

  final AddIngredientUseCase _addIngredientUseCase;

  Future<bool> addIngredient({
    required String name,
    required IngredientCategory category,
    required QuantityLevel quantityLevel,
    required DateTime expiryDate,
  }) async {
    if (name.trim().isEmpty) {
      state = state.copyWith(error: '재료명을 입력해주세요.');
      return false;
    }

    state = state.copyWith(isLoading: true, error: null);

    try {
      await _addIngredientUseCase.call(
        name: name,
        category: category,
        quantityLevel: quantityLevel,
        expiryDate: expiryDate,
      );

      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: '재료 추가에 실패했습니다: ${e.toString()}',
      );
      return false;
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
