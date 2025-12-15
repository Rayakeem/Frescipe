import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_profile.freezed.dart';
part 'user_profile.g.dart';

enum UserGoal {
  slowAging,
  diet,
  highProtein,
  healthyEating,
  budgetSaving,
}

@freezed
class UserProfile with _$UserProfile {
  const factory UserProfile({
    required String id,
    required String email,
    String? displayName,
    String? photoUrl,
    @Default([]) List<UserGoal> goals,
    @Default([]) List<String> allergies,
    @Default([]) List<String> dislikedIngredients,
    required DateTime createdAt,
    DateTime? updatedAt,
  }) = _UserProfile;

  factory UserProfile.fromJson(Map<String, dynamic> json) =>
      _$UserProfileFromJson(json);
}

extension UserProfileX on UserProfile {
  /// 목표 표시 텍스트
  List<String> get goalTexts {
    return goals.map((goal) {
      switch (goal) {
        case UserGoal.slowAging:
          return '안티에이징';
        case UserGoal.diet:
          return '다이어트';
        case UserGoal.highProtein:
          return '고단백 식단';
        case UserGoal.healthyEating:
          return '건강한 식습관';
        case UserGoal.budgetSaving:
          return '식비 절약';
      }
    }).toList();
  }

  /// 프로필 완성도 (0.0 ~ 1.0)
  double get completeness {
    double score = 0.0;
    
    if (displayName?.isNotEmpty == true) score += 0.2;
    if (photoUrl?.isNotEmpty == true) score += 0.2;
    if (goals.isNotEmpty) score += 0.3;
    if (allergies.isNotEmpty || dislikedIngredients.isNotEmpty) score += 0.3;
    
    return score;
  }

  /// 프로필 설정 완료 여부
  bool get isComplete => completeness >= 0.8;
}
