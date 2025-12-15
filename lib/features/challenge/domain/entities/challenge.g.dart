// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'challenge.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DailyPlanImpl _$$DailyPlanImplFromJson(Map<String, dynamic> json) =>
    _$DailyPlanImpl(
      day: (json['day'] as num).toInt(),
      recipeId: json['recipeId'] as String,
      completed: json['completed'] as bool? ?? false,
      remainingLevel:
          $enumDecodeNullable(_$RemainingLevelEnumMap, json['remainingLevel']),
    );

Map<String, dynamic> _$$DailyPlanImplToJson(_$DailyPlanImpl instance) =>
    <String, dynamic>{
      'day': instance.day,
      'recipeId': instance.recipeId,
      'completed': instance.completed,
      'remainingLevel': _$RemainingLevelEnumMap[instance.remainingLevel],
    };

const _$RemainingLevelEnumMap = {
  RemainingLevel.none: 'none',
  RemainingLevel.little: 'little',
  RemainingLevel.much: 'much',
};

_$ChallengeImpl _$$ChallengeImplFromJson(Map<String, dynamic> json) =>
    _$ChallengeImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      mainIngredientId: json['mainIngredientId'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      status: $enumDecode(_$ChallengeStatusEnumMap, json['status']),
      dailyPlans: (json['dailyPlans'] as List<dynamic>)
          .map((e) => DailyPlan.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$ChallengeImplToJson(_$ChallengeImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'mainIngredientId': instance.mainIngredientId,
      'startDate': instance.startDate.toIso8601String(),
      'status': _$ChallengeStatusEnumMap[instance.status]!,
      'dailyPlans': instance.dailyPlans,
    };

const _$ChallengeStatusEnumMap = {
  ChallengeStatus.active: 'active',
  ChallengeStatus.completed: 'completed',
  ChallengeStatus.abandoned: 'abandoned',
};
