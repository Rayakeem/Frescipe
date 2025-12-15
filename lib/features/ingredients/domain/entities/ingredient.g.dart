// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ingredient.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$IngredientImpl _$$IngredientImplFromJson(Map<String, dynamic> json) =>
    _$IngredientImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      category: $enumDecode(_$IngredientCategoryEnumMap, json['category']),
      quantityLevel: $enumDecode(_$QuantityLevelEnumMap, json['quantityLevel']),
      expiryDate: DateTime.parse(json['expiryDate'] as String),
      addedAt: DateTime.parse(json['addedAt'] as String),
      consumedAt: json['consumedAt'] == null
          ? null
          : DateTime.parse(json['consumedAt'] as String),
    );

Map<String, dynamic> _$$IngredientImplToJson(_$IngredientImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'category': _$IngredientCategoryEnumMap[instance.category]!,
      'quantityLevel': _$QuantityLevelEnumMap[instance.quantityLevel]!,
      'expiryDate': instance.expiryDate.toIso8601String(),
      'addedAt': instance.addedAt.toIso8601String(),
      'consumedAt': instance.consumedAt?.toIso8601String(),
    };

const _$IngredientCategoryEnumMap = {
  IngredientCategory.fridge: 'fridge',
  IngredientCategory.freezer: 'freezer',
  IngredientCategory.pantry: 'pantry',
};

const _$QuantityLevelEnumMap = {
  QuantityLevel.low: 'low',
  QuantityLevel.medium: 'medium',
  QuantityLevel.high: 'high',
};
