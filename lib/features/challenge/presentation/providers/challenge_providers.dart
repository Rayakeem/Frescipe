import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../data/repositories/firebase_challenge_repository.dart';
import '../../domain/entities/challenge.dart';
import '../../domain/repositories/challenge_repository.dart';
import '../../domain/usecases/start_challenge_usecase.dart';
import '../../domain/usecases/complete_daily_plan_usecase.dart';
import '../../../recipes/data/repositories/firebase_recipe_repository.dart';

// Repository Provider
final challengeRepositoryProvider = Provider<ChallengeRepository>((ref) {
  return FirebaseChallengeRepository();
});

// Use Cases Providers
final startChallengeUseCaseProvider = Provider<StartChallengeUseCase>((ref) {
  final challengeRepository = ref.watch(challengeRepositoryProvider);
  final recipeRepository = FirebaseRecipeRepository(); // TODO: Use provider
  return StartChallengeUseCase(challengeRepository, recipeRepository);
});

final completeDailyPlanUseCaseProvider = Provider<CompleteDailyPlanUseCase>((ref) {
  final repository = ref.watch(challengeRepositoryProvider);
  return CompleteDailyPlanUseCase(repository);
});

// Active Challenge Provider
final activeChallengeProvider = StreamProvider<Challenge?>((ref) {
  final user = FirebaseAuth.instance.currentUser;
  if (user == null) return Stream.value(null);

  final repository = ref.watch(challengeRepositoryProvider);
  return repository.watchActiveChallenge(user.uid);
});

// Challenge State Provider
final challengeStateProvider = StateNotifierProvider<ChallengeNotifier, ChallengeState>((ref) {
  final startUseCase = ref.watch(startChallengeUseCaseProvider);
  final completeUseCase = ref.watch(completeDailyPlanUseCaseProvider);
  return ChallengeNotifier(startUseCase, completeUseCase);
});

class ChallengeState {
  const ChallengeState({
    this.isLoading = false,
    this.error,
  });

  final bool isLoading;
  final String? error;

  ChallengeState copyWith({
    bool? isLoading,
    String? error,
  }) {
    return ChallengeState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ChallengeNotifier extends StateNotifier<ChallengeState> {
  ChallengeNotifier(
    this._startChallengeUseCase,
    this._completeDailyPlanUseCase,
  ) : super(const ChallengeState());

  final StartChallengeUseCase _startChallengeUseCase;
  final CompleteDailyPlanUseCase _completeDailyPlanUseCase;

  /// 챌린지 시작
  Future<bool> startChallenge({
    required String userId,
    required String mainIngredientId,
    required String mainIngredientName,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      await _startChallengeUseCase.call(
        userId: userId,
        mainIngredientId: mainIngredientId,
        mainIngredientName: mainIngredientName,
      );

      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  /// 일일 계획 완료
  Future<bool> completeDailyPlan({
    required String challengeId,
    required int day,
    required RemainingLevel remainingLevel,
  }) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      await _completeDailyPlanUseCase.call(
        challengeId: challengeId,
        day: day,
        remainingLevel: remainingLevel,
      );

      state = state.copyWith(isLoading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      return false;
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}
