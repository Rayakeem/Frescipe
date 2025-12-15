import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/entities/recipe.dart';
import '../../../../shared/widgets/buttons/primary_button.dart';

class RecipeDetailScreen extends ConsumerWidget {
  const RecipeDetailScreen({
    super.key,
    required this.recipeId,
  });

  final String recipeId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // TODO: 실제 레시피 데이터 로드
    final recipe = _getMockRecipe(recipeId);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // 앱바와 이미지
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    color: AppTheme.lightGray,
                    child: const Icon(
                      Icons.restaurant_menu,
                      size: 80,
                      color: AppTheme.darkGray,
                    ),
                  ),
                  // 그라데이션 오버레이
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.3),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              IconButton(
                onPressed: () => _toggleFavorite(context, recipe),
                icon: const Icon(Icons.favorite_border),
              ),
              IconButton(
                onPressed: () => _shareRecipe(context, recipe),
                icon: const Icon(Icons.share),
              ),
            ],
          ),
          
          // 레시피 내용
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spacingM),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 제목과 기본 정보
                  _buildRecipeHeader(context, recipe),
                  const SizedBox(height: AppTheme.spacingL),
                  
                  // 재료 목록
                  _buildIngredientsSection(context, recipe),
                  const SizedBox(height: AppTheme.spacingL),
                  
                  // 조리법
                  _buildInstructionsSection(context, recipe),
                  const SizedBox(height: AppTheme.spacingL),
                  
                  // 액션 버튼들
                  _buildActionButtons(context, recipe),
                  
                  // 하단 여백
                  const SizedBox(height: AppTheme.spacingXL),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecipeHeader(BuildContext context, Recipe recipe) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          recipe.title,
          style: Theme.of(context).textTheme.headlineLarge,
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        // 기본 정보 카드
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppTheme.spacingM),
          decoration: BoxDecoration(
            color: AppTheme.lightGray,
            borderRadius: BorderRadius.circular(AppTheme.radiusM),
          ),
          child: Row(
            children: [
              // 조리 시간
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.access_time, color: AppTheme.primaryRed),
                    const SizedBox(height: AppTheme.spacingXS),
                    Text(
                      '조리시간',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.darkGray,
                      ),
                    ),
                    Text(
                      '${recipe.cookingTimeMinutes}분',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                  ],
                ),
              ),
              
              // 구분선
              Container(
                width: 1,
                height: 40,
                color: AppTheme.mediumGray,
              ),
              
              // 재료 개수
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.restaurant, color: AppTheme.primaryRed),
                    const SizedBox(height: AppTheme.spacingXS),
                    Text(
                      '재료',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.darkGray,
                      ),
                    ),
                    Text(
                      '${recipe.ingredients.length}개',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                  ],
                ),
              ),
              
              // 구분선
              Container(
                width: 1,
                height: 40,
                color: AppTheme.mediumGray,
              ),
              
              // 난이도 (임시)
              Expanded(
                child: Column(
                  children: [
                    const Icon(Icons.star, color: AppTheme.primaryRed),
                    const SizedBox(height: AppTheme.spacingXS),
                    Text(
                      '난이도',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.darkGray,
                      ),
                    ),
                    Text(
                      '쉬움',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: AppTheme.spacingM),
        
        // 건강 태그들
        if (recipe.healthTags.isNotEmpty)
          Wrap(
            spacing: AppTheme.spacingS,
            runSpacing: AppTheme.spacingS,
            children: recipe.healthTags.map((tag) => Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.spacingM,
                vertical: AppTheme.spacingS,
              ),
              decoration: BoxDecoration(
                color: AppTheme.primaryRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
                border: Border.all(
                  color: AppTheme.primaryRed.withOpacity(0.3),
                ),
              ),
              child: Text(
                tag,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppTheme.primaryRed,
                  fontWeight: FontWeight.w500,
                ),
              ),
            )).toList(),
          ),
      ],
    );
  }

  Widget _buildIngredientsSection(BuildContext context, Recipe recipe) {
    final availableIngredients = recipe.ingredients.where((i) => i.isAvailable).toList();
    final missingIngredients = recipe.ingredients.where((i) => !i.isAvailable).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              '재료 (${recipe.ingredients.length}개)',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const Spacer(),
            if (missingIngredients.isNotEmpty)
              TextButton.icon(
                onPressed: () => _addToShoppingList(context, missingIngredients),
                icon: const Icon(Icons.add_shopping_cart, size: 16),
                label: const Text('장보기 추가'),
              ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        // 보유 재료
        if (availableIngredients.isNotEmpty) ...[
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppTheme.spacingM),
            decoration: BoxDecoration(
              color: AppTheme.success.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
              border: Border.all(color: AppTheme.success.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.check_circle, 
                      color: AppTheme.success, size: 20),
                    const SizedBox(width: AppTheme.spacingS),
                    Text(
                      '보유 재료 (${availableIngredients.length}개)',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: AppTheme.success,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppTheme.spacingS),
                ...availableIngredients.map((ingredient) => Padding(
                  padding: const EdgeInsets.only(bottom: AppTheme.spacingXS),
                  child: Row(
                    children: [
                      const SizedBox(width: 28), // 아이콘 공간
                      Expanded(
                        child: Text(
                          ingredient.name,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ),
                      Text(
                        ingredient.amount,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppTheme.darkGray,
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ),
          ),
          const SizedBox(height: AppTheme.spacingM),
        ],
        
        // 부족한 재료
        if (missingIngredients.isNotEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppTheme.spacingM),
            decoration: BoxDecoration(
              color: AppTheme.warning.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
              border: Border.all(color: AppTheme.warning.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.shopping_cart, 
                      color: AppTheme.warning, size: 20),
                    const SizedBox(width: AppTheme.spacingS),
                    Text(
                      '구매 필요 (${missingIngredients.length}개)',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: AppTheme.warning,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppTheme.spacingS),
                ...missingIngredients.map((ingredient) => Padding(
                  padding: const EdgeInsets.only(bottom: AppTheme.spacingXS),
                  child: Row(
                    children: [
                      const SizedBox(width: 28), // 아이콘 공간
                      Expanded(
                        child: Text(
                          ingredient.name,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ),
                      Text(
                        ingredient.amount,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppTheme.darkGray,
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildInstructionsSection(BuildContext context, Recipe recipe) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '조리법',
          style: Theme.of(context).textTheme.headlineSmall,
        ),
        const SizedBox(height: AppTheme.spacingM),
        
        ...recipe.instructions.asMap().entries.map((entry) {
          final index = entry.key;
          final instruction = entry.value;
          
          return Container(
            margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 단계 번호
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryRed,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Text(
                      '${index + 1}',
                      style: Theme.of(context).textTheme.labelLarge?.copyWith(
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: AppTheme.spacingM),
                
                // 설명
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(AppTheme.spacingM),
                    decoration: BoxDecoration(
                      color: AppTheme.lightGray,
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                    ),
                    child: Text(
                      instruction,
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context, Recipe recipe) {
    final missingIngredients = recipe.ingredients.where((i) => !i.isAvailable).toList();
    
    return Column(
      children: [
        // 주요 액션 버튼
        if (missingIngredients.isNotEmpty) ...[
          PrimaryButton(
            text: '장보기 리스트에 추가',
            onPressed: () => _addToShoppingList(context, missingIngredients),
          ),
          const SizedBox(height: AppTheme.spacingM),
        ],
        
        PrimaryButton(
          text: '조리 완료',
          onPressed: () => _markAsCooked(context, recipe),
        ),
        
        const SizedBox(height: AppTheme.spacingM),
        
        // 보조 액션 버튼들
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _startTimer(context, recipe),
                icon: const Icon(Icons.timer),
                label: const Text('타이머'),
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => _shareRecipe(context, recipe),
                icon: const Icon(Icons.share),
                label: const Text('공유'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Recipe _getMockRecipe(String id) {
    return Recipe(
      id: id,
      title: '당근 볶음밥',
      ingredients: [
        RecipeIngredient(name: '당근', amount: '1개', isAvailable: true),
        RecipeIngredient(name: '밥', amount: '1공기', isAvailable: true),
        RecipeIngredient(name: '계란', amount: '2개', isAvailable: false),
        RecipeIngredient(name: '간장', amount: '1큰술', isAvailable: true),
        RecipeIngredient(name: '참기름', amount: '1작은술', isAvailable: false),
      ],
      cookingTimeMinutes: 15,
      healthTags: ['간단', '영양', '한식'],
      instructions: [
        '당근을 작은 주사위 모양으로 썰어주세요.',
        '팬에 기름을 두르고 당근을 볶아주세요.',
        '계란을 풀어서 스크램블을 만들어주세요.',
        '밥과 당근, 계란을 함께 볶아주세요.',
        '간장과 참기름으로 간을 맞춰주세요.',
        '그릇에 담고 파슬리를 뿌려 완성해주세요.',
      ],
      createdAt: DateTime.now(),
    );
  }

  void _toggleFavorite(BuildContext context, Recipe recipe) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${recipe.title} 즐겨찾기 토글')),
    );
  }

  void _shareRecipe(BuildContext context, Recipe recipe) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${recipe.title} 레시피 공유')),
    );
  }

  void _addToShoppingList(BuildContext context, List<RecipeIngredient> ingredients) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${ingredients.length}개 재료를 장보기 리스트에 추가했습니다'),
        action: SnackBarAction(
          label: '보기',
          onPressed: () {
            // TODO: 장보기 리스트 화면으로 이동
          },
        ),
      ),
    );
  }

  void _markAsCooked(BuildContext context, Recipe recipe) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('조리 완료'),
        content: const Text('이 레시피로 요리를 완료하셨나요?\n사용한 재료들을 소진 처리합니다.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('조리 완료! 재료들을 소진 처리했습니다')),
              );
            },
            child: const Text('완료'),
          ),
        ],
      ),
    );
  }

  void _startTimer(BuildContext context, Recipe recipe) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('타이머 설정'),
        content: Text('${recipe.cookingTimeMinutes}분 타이머를 시작하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${recipe.cookingTimeMinutes}분 타이머 시작!')),
              );
            },
            child: const Text('시작'),
          ),
        ],
      ),
    );
  }
}