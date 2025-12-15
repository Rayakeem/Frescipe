import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/entities/challenge.dart';
import '../providers/challenge_providers.dart';
import '../widgets/challenge_progress_ring.dart';
import '../../../../shared/widgets/buttons/primary_button.dart';
import '../../../../shared/widgets/cards/status_summary_card.dart';

class ChallengeScreen extends ConsumerWidget {
  const ChallengeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeChallengeAsync = ref.watch(activeChallengeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('3일 재료 소진 챌린지'),
        actions: [
          IconButton(
            onPressed: () => _showChallengeHistory(context),
            icon: const Icon(Icons.history),
          ),
        ],
      ),
      body: activeChallengeAsync.when(
        data: (challenge) {
          if (challenge == null) {
            return _buildNoChallengeState(context, ref);
          }
          return _buildActiveChallengeState(context, ref, challenge);
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => _buildErrorState(context, ref, error),
      ),
    );
  }

  Widget _buildNoChallengeState(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 챌린지 소개 카드
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppTheme.spacingL),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.primaryRed.withOpacity(0.1),
                  AppTheme.primaryRed.withOpacity(0.05),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(AppTheme.radiusL),
              border: Border.all(color: AppTheme.primaryRed.withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppTheme.spacingS),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryRed,
                        borderRadius: BorderRadius.circular(AppTheme.radiusS),
                      ),
                      child: const Icon(
                        Icons.emoji_events,
                        color: AppTheme.white,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingM),
                    Expanded(
                      child: Text(
                        '3일 재료 소진 챌린지',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: AppTheme.primaryRed,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppTheme.spacingM),
                Text(
                  '유통기한이 임박한 재료를 3일 안에 완전히 소진하는 챌린지입니다. AI가 매일 다른 레시피를 추천해드려요!',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: AppTheme.spacingL),
                _buildBenefitsList(context),
              ],
            ),
          ),

          const SizedBox(height: AppTheme.spacingL),

          // 통계 카드들
          Text(
            '나의 챌린지 기록',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: AppTheme.spacingM),
          
          Row(
            children: [
              Expanded(
                child: StatusSummaryCard(
                  title: '완료한 챌린지',
                  value: '12개',
                  icon: Icons.check_circle,
                  onTap: () {},
                ),
              ),
              const SizedBox(width: AppTheme.spacingM),
              Expanded(
                child: StatusSummaryCard(
                  title: '성공률',
                  value: '85%',
                  icon: Icons.trending_up,
                  onTap: () {},
                ),
              ),
            ],
          ),

          const SizedBox(height: AppTheme.spacingM),

          StatusSummaryCard(
            title: '절약한 식비',
            value: '₩24,500',
            icon: Icons.savings,
            onTap: () {},
          ),

          const SizedBox(height: AppTheme.spacingXL),

          // 챌린지 시작 버튼
          PrimaryButton(
            text: '새 챌린지 시작하기',
            onPressed: () => _startNewChallenge(context, ref),
          ),

          const SizedBox(height: AppTheme.spacingM),

          // 재료 추가 안내
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppTheme.spacingM),
            decoration: BoxDecoration(
              color: AppTheme.lightGray,
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: AppTheme.darkGray),
                const SizedBox(width: AppTheme.spacingM),
                Expanded(
                  child: Text(
                    '챌린지를 시작하려면 먼저 냉장고에 재료를 추가해주세요',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.darkGray,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () => context.go(AppRoutes.fridge),
                  child: const Text('재료 추가'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBenefitsList(BuildContext context) {
    final benefits = [
      '음식물 쓰레기 줄이기',
      '식비 절약하기',
      '새로운 레시피 발견',
      '요리 실력 향상',
    ];

    return Column(
      children: benefits.map((benefit) => Padding(
        padding: const EdgeInsets.only(bottom: AppTheme.spacingS),
        child: Row(
          children: [
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: AppTheme.primaryRed,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: AppTheme.spacingS),
            Text(
              benefit,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      )).toList(),
    );
  }

  Widget _buildActiveChallengeState(BuildContext context, WidgetRef ref, Challenge challenge) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 메인 재료 카드
          _buildMainIngredientCard(context, challenge),
          const SizedBox(height: AppTheme.spacingL),

          // 진행 상황
          _buildProgressSection(context, challenge),
          const SizedBox(height: AppTheme.spacingL),

          // 오늘의 레시피
          _buildTodayRecipeSection(context, ref, challenge),
          const SizedBox(height: AppTheme.spacingL),

          // 완료 버튼들
          _buildCompletionButtons(context, ref, challenge),
        ],
      ),
    );
  }

  Widget _buildMainIngredientCard(BuildContext context, Challenge challenge) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppTheme.spacingL),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppTheme.lightGray,
                  borderRadius: BorderRadius.circular(AppTheme.radiusM),
                ),
                child: const Icon(
                  Icons.restaurant,
                  size: 30,
                  color: AppTheme.darkGray,
                ),
              ),
              const SizedBox(width: AppTheme.spacingM),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      challenge.mainIngredientName,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: AppTheme.spacingXS),
                    Text(
                      '${challenge.startDate.month}/${challenge.startDate.day} ~ ${challenge.endDate.month}/${challenge.endDate.day}',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.darkGray,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingM),
          LinearProgressIndicator(
            value: challenge.completedDays / 3,
            backgroundColor: AppTheme.lightGray,
            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primaryRed),
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            '${challenge.completedDays}/3일 완료',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressSection(BuildContext context, Challenge challenge) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '진행 상황',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(3, (index) {
            final dayNumber = index + 1;
            final isCompleted = challenge.completedDays >= dayNumber;
            final isToday = challenge.completedDays + 1 == dayNumber;
            
            return ChallengeProgressRing(
              day: dayNumber,
              isCompleted: isCompleted,
              isActive: isToday,
              progress: isToday ? 0.5 : (isCompleted ? 1.0 : 0.0),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildTodayRecipeSection(BuildContext context, WidgetRef ref, Challenge challenge) {
    final currentDay = challenge.completedDays + 1;
    if (currentDay > 3) return const SizedBox.shrink();

    final todayPlan = challenge.dailyPlans.firstWhere(
      (plan) => plan.day == currentDay,
      orElse: () => DailyPlan(
        day: currentDay,
        recipeTitle: '레시피 준비 중...',
        cookingTimeMinutes: 30,
        healthTags: [],
        isCompleted: false,
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '오늘의 레시피 (${currentDay}일차)',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: AppTheme.white,
            borderRadius: BorderRadius.circular(AppTheme.radiusL),
            boxShadow: AppTheme.cardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 레시피 이미지
              Container(
                width: double.infinity,
                height: 200,
                decoration: BoxDecoration(
                  color: AppTheme.lightGray,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusL),
                  ),
                ),
                child: const Icon(
                  Icons.restaurant_menu,
                  size: 64,
                  color: AppTheme.darkGray,
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppTheme.spacingL),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      todayPlan.recipeTitle,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: AppTheme.spacingS),
                    Row(
                      children: [
                        const Icon(Icons.access_time, 
                          size: 16, color: AppTheme.darkGray),
                        const SizedBox(width: AppTheme.spacingXS),
                        Text(
                          '${todayPlan.cookingTimeMinutes}분',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppTheme.darkGray,
                          ),
                        ),
                        const SizedBox(width: AppTheme.spacingM),
                        ...todayPlan.healthTags.take(2).map((tag) => Container(
                          margin: const EdgeInsets.only(right: AppTheme.spacingS),
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppTheme.spacingS,
                            vertical: AppTheme.spacingXS,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryRed.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(AppTheme.radiusS),
                          ),
                          child: Text(
                            tag,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.primaryRed,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        )),
                      ],
                    ),
                    const SizedBox(height: AppTheme.spacingM),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => _viewRecipeDetail(context, todayPlan),
                        child: const Text('레시피 보기'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCompletionButtons(BuildContext context, WidgetRef ref, Challenge challenge) {
    final currentDay = challenge.completedDays + 1;
    if (currentDay > 3) {
      return _buildChallengeCompletedSection(context, ref, challenge);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '오늘 요리는 어떠셨나요?',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        PrimaryButton(
          text: '요리 완료! 재료 다 썼어요',
          onPressed: () => _completeDay(context, ref, challenge, true),
        ),
        const SizedBox(height: AppTheme.spacingM),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => _completeDay(context, ref, challenge, false),
                child: const Text('재료 조금 남음'),
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: OutlinedButton(
                onPressed: () => _showGiveUpDialog(context, ref, challenge),
                child: const Text('포기하기'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildChallengeCompletedSection(BuildContext context, WidgetRef ref, Challenge challenge) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppTheme.spacingL),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.success.withOpacity(0.1),
            AppTheme.success.withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        border: Border.all(color: AppTheme.success.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.emoji_events,
            size: 64,
            color: AppTheme.success,
          ),
          const SizedBox(height: AppTheme.spacingM),
          Text(
            '챌린지 완료!',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: AppTheme.success,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            '3일 동안 ${challenge.mainIngredientName}을(를) 성공적으로 소진했습니다!',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingL),
          PrimaryButton(
            text: '새 챌린지 시작하기',
            onPressed: () => _startNewChallenge(context, ref),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(BuildContext context, WidgetRef ref, Object error) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.error_outline,
            size: 64,
            color: AppTheme.error,
          ),
          const SizedBox(height: AppTheme.spacingM),
          Text(
            '챌린지를 불러올 수 없습니다',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            error.toString(),
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.darkGray,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingL),
          ElevatedButton(
            onPressed: () => ref.invalidate(activeChallengeProvider),
            child: const Text('다시 시도'),
          ),
        ],
      ),
    );
  }

  void _startNewChallenge(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(AppTheme.radiusL)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '챌린지할 재료 선택',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: AppTheme.spacingL),
            // TODO: 유통기한 임박 재료 목록 표시
            ListTile(
              leading: const Icon(Icons.restaurant),
              title: const Text('당근'),
              subtitle: const Text('D-2'),
              onTap: () {
                Navigator.pop(context);
                // TODO: 챌린지 시작 로직
              },
            ),
            ListTile(
              leading: const Icon(Icons.restaurant),
              title: const Text('양파'),
              subtitle: const Text('D-3'),
              onTap: () {
                Navigator.pop(context);
                // TODO: 챌린지 시작 로직
              },
            ),
            const SizedBox(height: AppTheme.spacingL),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('취소'),
            ),
          ],
        ),
      ),
    );
  }

  void _completeDay(BuildContext context, WidgetRef ref, Challenge challenge, bool fullyConsumed) {
    // TODO: 일일 완료 로직 구현
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(fullyConsumed ? '완벽해요! 내일도 화이팅!' : '조금씩이라도 줄여가고 있어요!'),
      ),
    );
  }

  void _showGiveUpDialog(BuildContext context, WidgetRef ref, Challenge challenge) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('챌린지 포기'),
        content: const Text('정말 이번 챌린지를 포기하시겠습니까?\n다음에 다시 도전할 수 있어요!'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('계속하기'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: 챌린지 포기 로직
            },
            child: const Text('포기하기'),
          ),
        ],
      ),
    );
  }

  void _viewRecipeDetail(BuildContext context, DailyPlan plan) {
    // TODO: 레시피 상세 화면으로 이동
    context.go('/recipes/mock-recipe-id');
  }

  void _showChallengeHistory(BuildContext context) {
    // TODO: 챌린지 히스토리 화면 구현
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('챌린지 히스토리 - 추후 구현')),
    );
  }
}