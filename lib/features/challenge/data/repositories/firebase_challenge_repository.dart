import '../../domain/entities/challenge.dart';
import '../../domain/repositories/challenge_repository.dart';

class FirebaseChallengeRepository implements ChallengeRepository {
  FirebaseChallengeRepository();

  @override
  Future<Challenge> createChallenge(Challenge challenge) async {
    // TODO: Firebase 연동 후 구현
    throw UnimplementedError();
  }

  @override
  Future<Challenge> updateChallenge(Challenge challenge) async {
    // TODO: Firebase 연동 후 구현
    throw UnimplementedError();
  }

  @override
  Future<Challenge?> getChallenge(String challengeId) async {
    // TODO: Firebase 연동 후 구현
    return null;
  }

  @override
  Future<Challenge?> getActiveChallenge(String userId) async {
    // TODO: Firebase 연동 후 구현
    return null;
  }

  @override
  Stream<Challenge?> watchActiveChallenge(String userId) {
    // TODO: Firebase 연동 후 구현
    return Stream.value(null);
  }

  @override
  Future<List<Challenge>> getUserChallengeHistory(String userId) async {
    // TODO: Firebase 연동 후 구현
    return [];
  }

  @override
  Future<void> abandonChallenge(String challengeId) async {
    // TODO: Firebase 연동 후 구현
  }
}