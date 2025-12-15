import 'package:freezed_annotation/freezed_annotation.dart';

part 'recipe.freezed.dart';
part 'recipe.g.dart';

enum RecipeDifficulty {
  easy,
  medium,
  hard,
}

enum HealthTag {
  highProtein,
  lowCalorie,
  vegetarian,
  glutenFree,
  dairyFree,
  quickCook,
}

@freezed
class RecipeIngredient with _$RecipeIngredient {
  const factory RecipeIngredient({
    required String name,
    required String amount,
  }) = _RecipeIngredient;

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) =>
      _$RecipeIngredientFromJson(json);
}

@freezed
class Recipe with _$Recipe {
  const factory Recipe({
    required String id,
    required String title,
    required List<RecipeIngredient> ingredients,
    required int cookingTimeMinutes,
    required List<HealthTag> healthTags,
    required RecipeDifficulty difficulty,
    String? imageUrl,
    String? instructions,
  }) = _Recipe;

  factory Recipe.fromJson(Map<String, dynamic> json) =>
      _$RecipeFromJson(json);
}

extension RecipeX on Recipe {
  /// 요리 시간 표시 텍스트
  String get cookingTimeText {
    if (cookingTimeMinutes < 60) {
      return '${cookingTimeMinutes}분';
    } else {
      final hours = cookingTimeMinutes ~/ 60;
      final minutes = cookingTimeMinutes % 60;
      return minutes > 0 ? '${hours}시간 ${minutes}분' : '${hours}시간';
    }
  }

  /// 빠른 요리 여부 (30분 이내)
  bool get isQuickCook => cookingTimeMinutes <= 30;

  /// 건강 태그 표시 텍스트
  List<String> get healthTagTexts {
    return healthTags.map((tag) {
      switch (tag) {
        case HealthTag.highProtein:
          return '고단백';
        case HealthTag.lowCalorie:
          return '저칼로리';
        case HealthTag.vegetarian:
          return '채식';
        case HealthTag.glutenFree:
          return '글루텐프리';
        case HealthTag.dairyFree:
          return '유제품프리';
        case HealthTag.quickCook:
          return '간단요리';
      }
    }).toList();
  }

  /// 난이도 표시 텍스트
  String get difficultyText {
    switch (difficulty) {
      case RecipeDifficulty.easy:
        return '쉬움';
      case RecipeDifficulty.medium:
        return '보통';
      case RecipeDifficulty.hard:
        return '어려움';
    }
  }
}
