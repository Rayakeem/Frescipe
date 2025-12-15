import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/ingredient.dart';

class IngredientCard extends StatelessWidget {
  const IngredientCard({
    super.key,
    required this.ingredient,
    this.onTap,
    this.onDelete,
  });

  final Ingredient ingredient;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        decoration: BoxDecoration(
          color: AppTheme.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Row(
          children: [
            // Ingredient Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    ingredient.name,
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingXS),
                  Row(
                    children: [
                      _buildQuantityIndicator(),
                      const SizedBox(width: AppTheme.spacingS),
                      _buildCategoryChip(context),
                    ],
                  ),
                ],
              ),
            ),
            // Expiry Badge
            _buildExpiryBadge(context),
            if (onDelete != null) ...[
              const SizedBox(width: AppTheme.spacingS),
              IconButton(
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline),
                iconSize: 20,
                color: AppTheme.darkGray,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildQuantityIndicator() {
    Color color;
    switch (ingredient.quantityLevel) {
      case QuantityLevel.high:
        color = AppTheme.success;
        break;
      case QuantityLevel.medium:
        color = AppTheme.warning;
        break;
      case QuantityLevel.low:
        color = AppTheme.error;
        break;
    }

    return Container(
      width: 12,
      height: 12,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildCategoryChip(BuildContext context) {
    String categoryText;
    switch (ingredient.category) {
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

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingS,
        vertical: AppTheme.spacingXS,
      ),
      decoration: BoxDecoration(
        color: AppTheme.lightGray,
        borderRadius: BorderRadius.circular(AppTheme.radiusS),
      ),
      child: Text(
        categoryText,
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }

  Widget _buildExpiryBadge(BuildContext context) {
    final isUrgent = ingredient.isExpiringSoon || ingredient.isExpired;
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingS,
        vertical: AppTheme.spacingXS,
      ),
      decoration: BoxDecoration(
        color: isUrgent ? AppTheme.primaryRed : AppTheme.lightGray,
        borderRadius: BorderRadius.circular(AppTheme.radiusS),
      ),
      child: Text(
        ingredient.expiryDisplayText,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: isUrgent ? AppTheme.white : AppTheme.darkGray,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
