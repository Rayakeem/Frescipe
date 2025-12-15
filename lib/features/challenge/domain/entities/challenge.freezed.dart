// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'challenge.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

DailyPlan _$DailyPlanFromJson(Map<String, dynamic> json) {
  return _DailyPlan.fromJson(json);
}

/// @nodoc
mixin _$DailyPlan {
  int get day => throw _privateConstructorUsedError;
  String get recipeId => throw _privateConstructorUsedError;
  bool get completed => throw _privateConstructorUsedError;
  RemainingLevel? get remainingLevel => throw _privateConstructorUsedError;

  /// Serializes this DailyPlan to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DailyPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DailyPlanCopyWith<DailyPlan> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DailyPlanCopyWith<$Res> {
  factory $DailyPlanCopyWith(DailyPlan value, $Res Function(DailyPlan) then) =
      _$DailyPlanCopyWithImpl<$Res, DailyPlan>;
  @useResult
  $Res call(
      {int day,
      String recipeId,
      bool completed,
      RemainingLevel? remainingLevel});
}

/// @nodoc
class _$DailyPlanCopyWithImpl<$Res, $Val extends DailyPlan>
    implements $DailyPlanCopyWith<$Res> {
  _$DailyPlanCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DailyPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? recipeId = null,
    Object? completed = null,
    Object? remainingLevel = freezed,
  }) {
    return _then(_value.copyWith(
      day: null == day
          ? _value.day
          : day // ignore: cast_nullable_to_non_nullable
              as int,
      recipeId: null == recipeId
          ? _value.recipeId
          : recipeId // ignore: cast_nullable_to_non_nullable
              as String,
      completed: null == completed
          ? _value.completed
          : completed // ignore: cast_nullable_to_non_nullable
              as bool,
      remainingLevel: freezed == remainingLevel
          ? _value.remainingLevel
          : remainingLevel // ignore: cast_nullable_to_non_nullable
              as RemainingLevel?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$DailyPlanImplCopyWith<$Res>
    implements $DailyPlanCopyWith<$Res> {
  factory _$$DailyPlanImplCopyWith(
          _$DailyPlanImpl value, $Res Function(_$DailyPlanImpl) then) =
      __$$DailyPlanImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int day,
      String recipeId,
      bool completed,
      RemainingLevel? remainingLevel});
}

/// @nodoc
class __$$DailyPlanImplCopyWithImpl<$Res>
    extends _$DailyPlanCopyWithImpl<$Res, _$DailyPlanImpl>
    implements _$$DailyPlanImplCopyWith<$Res> {
  __$$DailyPlanImplCopyWithImpl(
      _$DailyPlanImpl _value, $Res Function(_$DailyPlanImpl) _then)
      : super(_value, _then);

  /// Create a copy of DailyPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? recipeId = null,
    Object? completed = null,
    Object? remainingLevel = freezed,
  }) {
    return _then(_$DailyPlanImpl(
      day: null == day
          ? _value.day
          : day // ignore: cast_nullable_to_non_nullable
              as int,
      recipeId: null == recipeId
          ? _value.recipeId
          : recipeId // ignore: cast_nullable_to_non_nullable
              as String,
      completed: null == completed
          ? _value.completed
          : completed // ignore: cast_nullable_to_non_nullable
              as bool,
      remainingLevel: freezed == remainingLevel
          ? _value.remainingLevel
          : remainingLevel // ignore: cast_nullable_to_non_nullable
              as RemainingLevel?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$DailyPlanImpl implements _DailyPlan {
  const _$DailyPlanImpl(
      {required this.day,
      required this.recipeId,
      this.completed = false,
      this.remainingLevel});

  factory _$DailyPlanImpl.fromJson(Map<String, dynamic> json) =>
      _$$DailyPlanImplFromJson(json);

  @override
  final int day;
  @override
  final String recipeId;
  @override
  @JsonKey()
  final bool completed;
  @override
  final RemainingLevel? remainingLevel;

  @override
  String toString() {
    return 'DailyPlan(day: $day, recipeId: $recipeId, completed: $completed, remainingLevel: $remainingLevel)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DailyPlanImpl &&
            (identical(other.day, day) || other.day == day) &&
            (identical(other.recipeId, recipeId) ||
                other.recipeId == recipeId) &&
            (identical(other.completed, completed) ||
                other.completed == completed) &&
            (identical(other.remainingLevel, remainingLevel) ||
                other.remainingLevel == remainingLevel));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, day, recipeId, completed, remainingLevel);

  /// Create a copy of DailyPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DailyPlanImplCopyWith<_$DailyPlanImpl> get copyWith =>
      __$$DailyPlanImplCopyWithImpl<_$DailyPlanImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DailyPlanImplToJson(
      this,
    );
  }
}

abstract class _DailyPlan implements DailyPlan {
  const factory _DailyPlan(
      {required final int day,
      required final String recipeId,
      final bool completed,
      final RemainingLevel? remainingLevel}) = _$DailyPlanImpl;

  factory _DailyPlan.fromJson(Map<String, dynamic> json) =
      _$DailyPlanImpl.fromJson;

  @override
  int get day;
  @override
  String get recipeId;
  @override
  bool get completed;
  @override
  RemainingLevel? get remainingLevel;

  /// Create a copy of DailyPlan
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DailyPlanImplCopyWith<_$DailyPlanImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Challenge _$ChallengeFromJson(Map<String, dynamic> json) {
  return _Challenge.fromJson(json);
}

/// @nodoc
mixin _$Challenge {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get mainIngredientId => throw _privateConstructorUsedError;
  DateTime get startDate => throw _privateConstructorUsedError;
  ChallengeStatus get status => throw _privateConstructorUsedError;
  List<DailyPlan> get dailyPlans => throw _privateConstructorUsedError;

  /// Serializes this Challenge to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Challenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChallengeCopyWith<Challenge> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChallengeCopyWith<$Res> {
  factory $ChallengeCopyWith(Challenge value, $Res Function(Challenge) then) =
      _$ChallengeCopyWithImpl<$Res, Challenge>;
  @useResult
  $Res call(
      {String id,
      String userId,
      String mainIngredientId,
      DateTime startDate,
      ChallengeStatus status,
      List<DailyPlan> dailyPlans});
}

/// @nodoc
class _$ChallengeCopyWithImpl<$Res, $Val extends Challenge>
    implements $ChallengeCopyWith<$Res> {
  _$ChallengeCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Challenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? mainIngredientId = null,
    Object? startDate = null,
    Object? status = null,
    Object? dailyPlans = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      mainIngredientId: null == mainIngredientId
          ? _value.mainIngredientId
          : mainIngredientId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as ChallengeStatus,
      dailyPlans: null == dailyPlans
          ? _value.dailyPlans
          : dailyPlans // ignore: cast_nullable_to_non_nullable
              as List<DailyPlan>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ChallengeImplCopyWith<$Res>
    implements $ChallengeCopyWith<$Res> {
  factory _$$ChallengeImplCopyWith(
          _$ChallengeImpl value, $Res Function(_$ChallengeImpl) then) =
      __$$ChallengeImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String userId,
      String mainIngredientId,
      DateTime startDate,
      ChallengeStatus status,
      List<DailyPlan> dailyPlans});
}

/// @nodoc
class __$$ChallengeImplCopyWithImpl<$Res>
    extends _$ChallengeCopyWithImpl<$Res, _$ChallengeImpl>
    implements _$$ChallengeImplCopyWith<$Res> {
  __$$ChallengeImplCopyWithImpl(
      _$ChallengeImpl _value, $Res Function(_$ChallengeImpl) _then)
      : super(_value, _then);

  /// Create a copy of Challenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? mainIngredientId = null,
    Object? startDate = null,
    Object? status = null,
    Object? dailyPlans = null,
  }) {
    return _then(_$ChallengeImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      mainIngredientId: null == mainIngredientId
          ? _value.mainIngredientId
          : mainIngredientId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as ChallengeStatus,
      dailyPlans: null == dailyPlans
          ? _value._dailyPlans
          : dailyPlans // ignore: cast_nullable_to_non_nullable
              as List<DailyPlan>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ChallengeImpl implements _Challenge {
  const _$ChallengeImpl(
      {required this.id,
      required this.userId,
      required this.mainIngredientId,
      required this.startDate,
      required this.status,
      required final List<DailyPlan> dailyPlans})
      : _dailyPlans = dailyPlans;

  factory _$ChallengeImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChallengeImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String mainIngredientId;
  @override
  final DateTime startDate;
  @override
  final ChallengeStatus status;
  final List<DailyPlan> _dailyPlans;
  @override
  List<DailyPlan> get dailyPlans {
    if (_dailyPlans is EqualUnmodifiableListView) return _dailyPlans;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_dailyPlans);
  }

  @override
  String toString() {
    return 'Challenge(id: $id, userId: $userId, mainIngredientId: $mainIngredientId, startDate: $startDate, status: $status, dailyPlans: $dailyPlans)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChallengeImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.mainIngredientId, mainIngredientId) ||
                other.mainIngredientId == mainIngredientId) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.status, status) || other.status == status) &&
            const DeepCollectionEquality()
                .equals(other._dailyPlans, _dailyPlans));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, userId, mainIngredientId,
      startDate, status, const DeepCollectionEquality().hash(_dailyPlans));

  /// Create a copy of Challenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChallengeImplCopyWith<_$ChallengeImpl> get copyWith =>
      __$$ChallengeImplCopyWithImpl<_$ChallengeImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChallengeImplToJson(
      this,
    );
  }
}

abstract class _Challenge implements Challenge {
  const factory _Challenge(
      {required final String id,
      required final String userId,
      required final String mainIngredientId,
      required final DateTime startDate,
      required final ChallengeStatus status,
      required final List<DailyPlan> dailyPlans}) = _$ChallengeImpl;

  factory _Challenge.fromJson(Map<String, dynamic> json) =
      _$ChallengeImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get mainIngredientId;
  @override
  DateTime get startDate;
  @override
  ChallengeStatus get status;
  @override
  List<DailyPlan> get dailyPlans;

  /// Create a copy of Challenge
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChallengeImplCopyWith<_$ChallengeImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
