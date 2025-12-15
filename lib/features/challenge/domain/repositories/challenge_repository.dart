import '../entities/challenge.dart';

abstract class ChallengeRepository {
  /// 챌린지 생성
  Future<Challenge> createChallenge(Challenge challenge);
  
  /// 챌린지 업데이트
  Future<Challenge> updateChallenge(Challenge challenge);
  
  /// 챌린지 조회
  Future<Challenge?> getChallenge(String challengeId);
  
  /// 사용자의 활성 챌린지 조회
  Future<Challenge?> getActiveChallenge(String userId);
  
  /// 사용자의 활성 챌린지 스트림
  Stream<Challenge?> watchActiveChallenge(String userId);
  
  /// 사용자의 챌린지 히스토리 조회
  Future<List<Challenge>> getUserChallengeHistory(String userId);
  
  /// 챌린지 삭제/중단
  Future<void> abandonChallenge(String challengeId);
}
