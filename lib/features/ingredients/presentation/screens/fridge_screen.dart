import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/entities/ingredient.dart';
import '../providers/ingredient_providers.dart';
import '../widgets/ingredient_card.dart';

class FridgeScreen extends ConsumerStatefulWidget {
  const FridgeScreen({super.key});

  @override
  ConsumerState<FridgeScreen> createState() => _FridgeScreenState();
}

class _FridgeScreenState extends ConsumerState<FridgeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('내 냉장고'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '냉장'),
            Tab(text: '냉동'),
            Tab(text: '실온'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildIngredientList(IngredientCategory.fridge),
          _buildIngredientList(IngredientCategory.freezer),
          _buildIngredientList(IngredientCategory.pantry),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go(AppRoutes.addIngredient),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildIngredientList(IngredientCategory category) {
    final provider = _getProviderForCategory(category);
    
    return Consumer(
      builder: (context, ref, child) {
        final ingredientsAsync = ref.watch(provider);
        
        return ingredientsAsync.when(
          data: (ingredients) {
            if (ingredients.isEmpty) {
              return _buildEmptyState(category);
            }
            
            return ListView.separated(
              padding: const EdgeInsets.all(AppTheme.spacingM),
              itemCount: ingredients.length,
              separatorBuilder: (context, index) => const SizedBox(
                height: AppTheme.spacingM,
              ),
              itemBuilder: (context, index) {
                final ingredient = ingredients[index];
                return IngredientCard(
                  ingredient: ingredient,
                  onTap: () => _showIngredientDetails(ingredient),
                  onDelete: () => _deleteIngredient(ingredient.id),
                );
              },
            );
          },
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
          error: (error, stackTrace) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 48,
                  color: AppTheme.error,
                ),
                const SizedBox(height: AppTheme.spacingM),
                Text(
                  '재료를 불러올 수 없습니다',
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
                  onPressed: () => ref.invalidate(provider),
                  child: const Text('다시 시도'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  StreamProvider<List<Ingredient>> _getProviderForCategory(IngredientCategory category) {
    switch (category) {
      case IngredientCategory.fridge:
        return fridgeIngredientsProvider;
      case IngredientCategory.freezer:
        return freezerIngredientsProvider;
      case IngredientCategory.pantry:
        return pantryIngredientsProvider;
    }
  }

  Widget _buildEmptyState(IngredientCategory category) {
    String categoryText;
    switch (category) {
      case IngredientCategory.fridge:
        categoryText = '냉장';
        break;
      case IngredientCategory.freezer:
        categoryText = '냉동';
        break;
      case IngredientCategory.pantry:
        categoryText = '실온';
        break;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.kitchen_outlined,
            size: 64,
            color: AppTheme.darkGray,
          ),
          const SizedBox(height: AppTheme.spacingL),
          Text(
            '$categoryText 재료가 없습니다',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            '첫 번째 재료를 추가해보세요!',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
          const SizedBox(height: AppTheme.spacingL),
          ElevatedButton.icon(
            onPressed: () => context.go(AppRoutes.addIngredient),
            icon: const Icon(Icons.add),
            label: const Text('재료 추가'),
          ),
        ],
      ),
    );
  }

  void _showIngredientDetails(Ingredient ingredient) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppTheme.radiusL),
        ),
      ),
      builder: (context) => _buildIngredientDetailsSheet(ingredient),
    );
  }

  Widget _buildIngredientDetailsSheet(Ingredient ingredient) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingL),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle bar
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.mediumGray,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppTheme.spacingL),
          
          // Ingredient name
          Text(
            ingredient.name,
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: AppTheme.spacingM),
          
          // Details
          _buildDetailRow('카테고리', _getCategoryText(ingredient.category)),
          _buildDetailRow('수량', _getQuantityText(ingredient.quantityLevel)),
          _buildDetailRow('유통기한', ingredient.expiryDisplayText),
          _buildDetailRow('추가일', _formatDate(ingredient.addedAt)),
          
          const SizedBox(height: AppTheme.spacingL),
          
          // Actions
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _markAsConsumed(ingredient.id),
                  child: const Text('소진 완료'),
                ),
              ),
              const SizedBox(width: AppTheme.spacingM),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    // TODO: Navigate to edit ingredient
                  },
                  child: const Text('수정'),
                ),
              ),
            ],
          ),
          
          // Safe area padding
          SizedBox(height: MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppTheme.spacingS),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.darkGray,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }

  String _getCategoryText(IngredientCategory category) {
    switch (category) {
      case IngredientCategory.fridge:
        return '냉장';
      case IngredientCategory.freezer:
        return '냉동';
      case IngredientCategory.pantry:
        return '실온';
    }
  }

  String _getQuantityText(QuantityLevel level) {
    switch (level) {
      case QuantityLevel.high:
        return '많음';
      case QuantityLevel.medium:
        return '보통';
      case QuantityLevel.low:
        return '적음';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}.${date.month.toString().padLeft(2, '0')}.${date.day.toString().padLeft(2, '0')}';
  }

  void _deleteIngredient(String ingredientId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('재료 삭제'),
        content: const Text('이 재료를 삭제하시겠습니까?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('취소'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final repository = ref.read(ingredientRepositoryProvider);
              await repository.deleteIngredient(ingredientId);
            },
            child: const Text('삭제'),
          ),
        ],
      ),
    );
  }

  void _markAsConsumed(String ingredientId) async {
    Navigator.pop(context); // Close bottom sheet
    final repository = ref.read(ingredientRepositoryProvider);
    await repository.markAsConsumed(ingredientId);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('재료를 소진 완료로 처리했습니다')),
      );
    }
  }
}
