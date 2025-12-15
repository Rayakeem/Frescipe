// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recipe.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RecipeIngredientImpl _$$RecipeIngredientImplFromJson(
        Map<String, dynamic> json) =>
    _$RecipeIngredientImpl(
      name: json['name'] as String,
      amount: json['amount'] as String,
    );

Map<String, dynamic> _$$RecipeIngredientImplToJson(
        _$RecipeIngredientImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'amount': instance.amount,
    };

_$RecipeImpl _$$RecipeImplFromJson(Map<String, dynamic> json) => _$RecipeImpl(
      id: json['id'] as String,
      title: json['title'] as String,
      ingredients: (json['ingredients'] as List<dynamic>)
          .map((e) => RecipeIngredient.fromJson(e as Map<String, dynamic>))
          .toList(),
      cookingTimeMinutes: (json['cookingTimeMinutes'] as num).toInt(),
      healthTags: (json['healthTags'] as List<dynamic>)
          .map((e) => $enumDecode(_$HealthTagEnumMap, e))
          .toList(),
      difficulty: $enumDecode(_$RecipeDifficultyEnumMap, json['difficulty']),
      imageUrl: json['imageUrl'] as String?,
      instructions: json['instructions'] as String?,
    );

Map<String, dynamic> _$$RecipeImplToJson(_$RecipeImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'ingredients': instance.ingredients,
      'cookingTimeMinutes': instance.cookingTimeMinutes,
      'healthTags':
          instance.healthTags.map((e) => _$HealthTagEnumMap[e]!).toList(),
      'difficulty': _$RecipeDifficultyEnumMap[instance.difficulty]!,
      'imageUrl': instance.imageUrl,
      'instructions': instance.instructions,
    };

const _$HealthTagEnumMap = {
  HealthTag.highProtein: 'highProtein',
  HealthTag.lowCalorie: 'lowCalorie',
  HealthTag.vegetarian: 'vegetarian',
  HealthTag.glutenFree: 'glutenFree',
  HealthTag.dairyFree: 'dairyFree',
  HealthTag.quickCook: 'quickCook',
};

const _$RecipeDifficultyEnumMap = {
  RecipeDifficulty.easy: 'easy',
  RecipeDifficulty.medium: 'medium',
  RecipeDifficulty.hard: 'hard',
};
