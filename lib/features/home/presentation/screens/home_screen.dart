import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../../../shared/widgets/cards/coach_card.dart';
import '../../../../shared/widgets/cards/status_summary_card.dart';
import '../../../../shared/widgets/buttons/primary_button.dart';
// import '../../../ingredients/presentation/providers/ingredient_providers.dart';
// import '../../../challenge/presentation/providers/challenge_providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // TODO: Firebase 연동 후 활성화
    // final expiringSoonIngredients = ref.watch(expiringSoonIngredientsProvider);
    // final activeChallenge = ref.watch(activeChallengeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('오늘 냉장고 상태를 확인해볼까요?'),
        actions: [
          IconButton(
            onPressed: () {
              // TODO: Navigate to notifications
            },
            icon: const Icon(Icons.notifications_outlined),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Coach Character Card
            const CoachCard(
              message: '안녕하세요! Frescipe에 오신 것을 환영합니다! 🎉',
            ),
            
            const SizedBox(height: AppTheme.spacingL),
            
            // Status Summary Cards
            Row(
              children: [
                Expanded(
                  child: StatusSummaryCard(
                    title: '유통기한 임박',
                    value: '3개',
                    icon: Icons.schedule,
                    onTap: () => context.go(AppRoutes.fridge),
                  ),
                ),
                const SizedBox(width: AppTheme.spacingM),
                Expanded(
                  child: StatusSummaryCard(
                    title: '진행 중 챌린지',
                    value: '1개',
                    icon: Icons.emoji_events,
                    onTap: () => context.go(AppRoutes.challenge),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: AppTheme.spacingM),
            
            // Weekly Consumption Rate Card
            StatusSummaryCard(
              title: '이번 주 소진률',
              value: '85%', // TODO: Calculate from weekly report
              icon: Icons.trending_up,
              onTap: () {
                // TODO: Navigate to weekly report
              },
            ),
            
            const SizedBox(height: AppTheme.spacingL),
            
            // Primary CTA Button
            PrimaryButton(
              text: '오늘의 소진 레시피 보기',
              onPressed: () => context.go(AppRoutes.recipes),
            ),
            
            const SizedBox(height: AppTheme.spacingL),
            
            // Native Ad Placeholder
            _buildAdPlaceholder(context),
          ],
        ),
      ),
    );
  }

  String _getCoachMessage(int expiringCount) {
    if (expiringCount == 0) {
      return '오늘은 유통기한 임박 재료가 없어요! 👍';
    } else if (expiringCount == 1) {
      return '오늘은 유통기한 임박 재료가 1개 있어요';
    } else {
      return '오늘은 유통기한 임박 재료가 ${expiringCount}개 있어요';
    }
  }

  Widget _buildAdPlaceholder(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 120,
      padding: const EdgeInsets.all(AppTheme.spacingM),
      decoration: BoxDecoration(
        color: AppTheme.lightGray,
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
        border: Border.all(
          color: AppTheme.mediumGray,
          width: 1,
        ),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.ads_click,
              size: 32,
              color: AppTheme.darkGray,
            ),
            const SizedBox(height: AppTheme.spacingS),
            Text(
              '광고 영역',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.darkGray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
