// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserProfileImpl _$$UserProfileImplFromJson(Map<String, dynamic> json) =>
    _$UserProfileImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String?,
      photoUrl: json['photoUrl'] as String?,
      goals: (json['goals'] as List<dynamic>?)
              ?.map((e) => $enumDecode(_$UserGoalEnumMap, e))
              .toList() ??
          const [],
      allergies: (json['allergies'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      dislikedIngredients: (json['dislikedIngredients'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$UserProfileImplToJson(_$UserProfileImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'displayName': instance.displayName,
      'photoUrl': instance.photoUrl,
      'goals': instance.goals.map((e) => _$UserGoalEnumMap[e]!).toList(),
      'allergies': instance.allergies,
      'dislikedIngredients': instance.dislikedIngredients,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

const _$UserGoalEnumMap = {
  UserGoal.slowAging: 'slowAging',
  UserGoal.diet: 'diet',
  UserGoal.highProtein: 'highProtein',
  UserGoal.healthyEating: 'healthyEating',
  UserGoal.budgetSaving: 'budgetSaving',
};
