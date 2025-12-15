import 'package:freezed_annotation/freezed_annotation.dart';

part 'ingredient.freezed.dart';
part 'ingredient.g.dart';

enum IngredientCategory {
  fridge,
  freezer,
  pantry,
}

enum QuantityLevel {
  low,
  medium,
  high,
}

@freezed
class Ingredient with _$Ingredient {
  const factory Ingredient({
    required String id,
    required String name,
    required IngredientCategory category,
    required QuantityLevel quantityLevel,
    required DateTime expiryDate,
    required DateTime addedAt,
    DateTime? consumedAt,
  }) = _Ingredient;

  factory Ingredient.fromJson(Map<String, dynamic> json) =>
      _$IngredientFromJson(json);
}

extension IngredientX on Ingredient {
  /// 유통기한까지 남은 일수
  int get daysUntilExpiry {
    final now = DateTime.now();
    final difference = expiryDate.difference(now);
    return difference.inDays;
  }

  /// 유통기한 임박 여부 (3일 이내)
  bool get isExpiringSoon => daysUntilExpiry <= 3;

  /// 유통기한 지남 여부
  bool get isExpired => daysUntilExpiry < 0;

  /// 소진 완료 여부
  bool get isConsumed => consumedAt != null;

  /// 유통기한 표시 텍스트
  String get expiryDisplayText {
    if (isExpired) return '유통기한 지남';
    if (daysUntilExpiry == 0) return '오늘까지';
    return 'D-$daysUntilExpiry';
  }
}
