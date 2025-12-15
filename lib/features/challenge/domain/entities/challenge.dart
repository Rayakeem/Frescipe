import 'package:freezed_annotation/freezed_annotation.dart';

part 'challenge.freezed.dart';
part 'challenge.g.dart';

enum ChallengeStatus {
  active,
  completed,
  abandoned,
}

enum RemainingLevel {
  none,      // 완전 소진
  little,    // 조금 남음
  much,      // 많이 남음
}

@freezed
class DailyPlan with _$DailyPlan {
  const factory DailyPlan({
    required int day,
    required String recipeId,
    @Default(false) bool completed,
    RemainingLevel? remainingLevel,
  }) = _DailyPlan;

  factory DailyPlan.fromJson(Map<String, dynamic> json) =>
      _$DailyPlanFromJson(json);
}

@freezed
class Challenge with _$Challenge {
  const factory Challenge({
    required String id,
    required String userId,
    required String mainIngredientId,
    required DateTime startDate,
    required ChallengeStatus status,
    required List<DailyPlan> dailyPlans,
  }) = _Challenge;

  factory Challenge.fromJson(Map<String, dynamic> json) =>
      _$ChallengeFromJson(json);
}

extension ChallengeX on Challenge {
  /// 현재 진행 중인 날짜 (1, 2, 3)
  int get currentDay {
    final now = DateTime.now();
    final daysSinceStart = now.difference(startDate).inDays + 1;
    return daysSinceStart.clamp(1, 3);
  }

  /// 현재 날짜의 계획
  DailyPlan get currentDayPlan {
    return dailyPlans.firstWhere((plan) => plan.day == currentDay);
  }

  /// 챌린지 완료 여부
  bool get isCompleted => dailyPlans.every((plan) => plan.completed);

  /// 챌린지 진행률 (0.0 ~ 1.0)
  double get progress {
    final completedDays = dailyPlans.where((plan) => plan.completed).length;
    return completedDays / 3.0;
  }

  /// 챌린지 종료일
  DateTime get endDate => startDate.add(const Duration(days: 2));

  /// 챌린지 활성 상태 여부
  bool get isActive => status == ChallengeStatus.active;
}
