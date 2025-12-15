import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/cards/status_summary_card.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('마이페이지'),
        actions: [
          IconButton(
            onPressed: () => _showSettings(context),
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 프로필 헤더
            _buildProfileHeader(context),
            const SizedBox(height: AppTheme.spacingL),
            
            // 통계 섹션
            _buildStatsSection(context),
            const SizedBox(height: AppTheme.spacingL),
            
            // 목표 섹션
            _buildGoalsSection(context),
            const SizedBox(height: AppTheme.spacingL),
            
            // 메뉴 섹션
            _buildMenuSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Container(
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
      ),
      child: Column(
        children: [
          // 프로필 이미지
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppTheme.primaryRed,
              borderRadius: BorderRadius.circular(40),
            ),
            child: const Icon(
              Icons.person,
              size: 40,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: AppTheme.spacingM),
          
          // 사용자 정보
          Text(
            '프레시피 사용자',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            'user@frescipe.com',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
          const SizedBox(height: AppTheme.spacingM),
          
          // 레벨 정보
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppTheme.spacingM,
              vertical: AppTheme.spacingS,
            ),
            decoration: BoxDecoration(
              color: AppTheme.primaryRed,
              borderRadius: BorderRadius.circular(AppTheme.radiusL),
            ),
            child: Text(
              '🌟 소진 마스터 Lv.3',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '이번 달 성과',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        Row(
          children: [
            Expanded(
              child: StatusSummaryCard(
                title: '완료한 챌린지',
                value: '8개',
                icon: Icons.emoji_events,
                onTap: () {},
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: StatusSummaryCard(
                title: '소진률',
                value: '92%',
                icon: Icons.trending_up,
                onTap: () {},
              ),
            ),
          ],
        ),
        
        const SizedBox(height: AppTheme.spacingM),
        
        Row(
          children: [
            Expanded(
              child: StatusSummaryCard(
                title: '절약한 식비',
                value: '₩45,200',
                icon: Icons.savings,
                onTap: () {},
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: StatusSummaryCard(
                title: '만든 요리',
                value: '24개',
                icon: Icons.restaurant,
                onTap: () {},
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildGoalsSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '나의 목표',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const Spacer(),
            TextButton(
              onPressed: () => _editGoals(context),
              child: const Text('편집'),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        _buildGoalCard(
          context,
          '월 소진률',
          '90%',
          0.92, // 현재 달성률
          Icons.target,
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        _buildGoalCard(
          context,
          '월 절약 목표',
          '₩50,000',
          0.90, // 현재 달성률
          Icons.savings,
        ),
      ],
    );
  }

  Widget _buildGoalCard(
    BuildContext context,
    String title,
    String target,
    double progress,
    IconData icon,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppTheme.spacingM),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.primaryRed),
              const SizedBox(width: AppTheme.spacingS),
              Text(
                title,
                style: Theme.of(context).textTheme.labelLarge,
              ),
              const Spacer(),
              Text(
                target,
                style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: AppTheme.primaryRed,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingM),
          
          LinearProgressIndicator(
            value: progress,
            backgroundColor: AppTheme.lightGray,
            valueColor: AlwaysStoppedAnimation<Color>(
              progress >= 1.0 ? AppTheme.success : AppTheme.primaryRed,
            ),
          ),
          const SizedBox(height: AppTheme.spacingS),
          
          Text(
            '${(progress * 100).toInt()}% 달성',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '메뉴',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        _buildMenuItem(
          context,
          Icons.history,
          '활동 기록',
          '챌린지 히스토리 및 통계',
          () => _showActivityHistory(context),
        ),
        
        _buildMenuItem(
          context,
          Icons.favorite,
          '즐겨찾는 레시피',
          '저장한 레시피 모음',
          () => _showFavoriteRecipes(context),
        ),
        
        _buildMenuItem(
          context,
          Icons.shopping_list,
          '장보기 리스트',
          '구매 예정 재료 목록',
          () => _showShoppingList(context),
        ),
        
        _buildMenuItem(
          context,
          Icons.notifications,
          '알림 설정',
          '유통기한 및 챌린지 알림',
          () => _showNotificationSettings(context),
        ),
        
        _buildMenuItem(
          context,
          Icons.help_outline,
          '도움말',
          '사용법 및 FAQ',
          () => _showHelp(context),
        ),
        
        _buildMenuItem(
          context,
          Icons.info_outline,
          '앱 정보',
          '버전 정보 및 개발자 정보',
          () => _showAppInfo(context),
        ),
        
        const SizedBox(height: AppTheme.spacingL),
        
        // 로그아웃 버튼
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => _showLogoutDialog(context),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.error,
              side: const BorderSide(color: AppTheme.error),
            ),
            child: const Text('로그아웃'),
          ),
        ),
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppTheme.spacingS),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(AppTheme.spacingS),
          decoration: BoxDecoration(
            color: AppTheme.primaryRed.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppTheme.radiusS),
          ),
          child: Icon(icon, color: AppTheme.primaryRed),
        ),
        title: Text(title),
        subtitle: Text(
          subtitle,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: AppTheme.darkGray,
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
        ),
        tileColor: AppTheme.white,
      ),
    );
  }

  void _showSettings(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('설정 화면 - 추후 구현')),
    );
  }

  void _editGoals(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('목표 설정'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: InputDecoration(
                labelText: '월 소진률 목표 (%)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: AppTheme.spacingM),
            TextField(
              decoration: InputDecoration(
                labelText: '월 절약 목표 (원)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('목표가 저장되었습니다')),
              );
            },
            child: const Text('저장'),
          ),
        ],
      ),
    );
  }

  void _showActivityHistory(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('활동 기록 화면 - 추후 구현')),
    );
  }

  void _showFavoriteRecipes(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('즐겨찾는 레시피 화면 - 추후 구현')),
    );
  }

  void _showShoppingList(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('장보기 리스트 화면 - 추후 구현')),
    );
  }

  void _showNotificationSettings(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('알림 설정 화면 - 추후 구현')),
    );
  }

  void _showHelp(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('도움말 화면 - 추후 구현')),
    );
  }

  void _showAppInfo(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: 'Frescipe',
      applicationVersion: '1.0.0',
      applicationIcon: Container(
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          color: AppTheme.primaryRed,
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
        ),
        child: const Icon(
          Icons.restaurant,
          color: AppTheme.white,
          size: 32,
        ),
      ),
      children: [
        const Text('재료 소진 관리 앱'),
        const SizedBox(height: AppTheme.spacingM),
        const Text('음식물 쓰레기를 줄이고 식비를 절약하세요!'),
      ],
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('로그아웃'),
        content: const Text('정말 로그아웃하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: 로그아웃 로직 구현
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('로그아웃되었습니다')),
              );
            },
            child: const Text('로그아웃'),
          ),
        ],
      ),
    );
  }
}