import '../entities/challenge.dart';
import '../repositories/challenge_repository.dart';

class CompleteDailyPlanUseCase {
  const CompleteDailyPlanUseCase(this._repository);

  final ChallengeRepository _repository;

  /// 일일 계획 완료 처리
  Future<Challenge> call({
    required String challengeId,
    required int day,
    required RemainingLevel remainingLevel,
  }) async {
    final challenge = await _repository.getChallenge(challengeId);
    if (challenge == null) {
      throw Exception('챌린지를 찾을 수 없습니다.');
    }

    if (!challenge.isActive) {
      throw Exception('활성 상태가 아닌 챌린지입니다.');
    }

    // 해당 날짜의 계획 업데이트
    final updatedPlans = challenge.dailyPlans.map((plan) {
      if (plan.day == day) {
        return plan.copyWith(
          completed: true,
          remainingLevel: remainingLevel,
        );
      }
      return plan;
    }).toList();

    // 다음 날 계획 조정 (재료가 많이 남은 경우)
    final adjustedPlans = _adjustNextDayPlan(updatedPlans, day, remainingLevel);

    // 챌린지 상태 업데이트
    final updatedChallenge = challenge.copyWith(
      dailyPlans: adjustedPlans,
      status: _calculateChallengeStatus(adjustedPlans),
    );

    return await _repository.updateChallenge(updatedChallenge);
  }

  /// 다음 날 계획 조정
  List<DailyPlan> _adjustNextDayPlan(
    List<DailyPlan> plans,
    int currentDay,
    RemainingLevel remainingLevel,
  ) {
    if (currentDay >= 3) return plans; // 마지막 날이면 조정 불필요

    final nextDay = currentDay + 1;
    
    // 재료가 많이 남은 경우 다음 날 레시피 조정 필요
    if (remainingLevel == RemainingLevel.much) {
      return plans.map((plan) {
        if (plan.day == nextDay) {
          // TODO: 남은 재료 양을 고려한 레시피로 변경
          // 현재는 기존 레시피 유지
          return plan;
        }
        return plan;
      }).toList();
    }

    return plans;
  }

  /// 챌린지 상태 계산
  ChallengeStatus _calculateChallengeStatus(List<DailyPlan> plans) {
    final completedPlans = plans.where((plan) => plan.completed).length;
    
    if (completedPlans == 3) {
      return ChallengeStatus.completed;
    }
    
    return ChallengeStatus.active;
  }
}
