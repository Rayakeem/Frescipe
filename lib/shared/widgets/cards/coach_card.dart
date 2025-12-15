import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class CoachCard extends StatelessWidget {
  const CoachCard({
    super.key,
    required this.message,
    this.characterImagePath = 'assets/images/logoImg.png',
  });

  final String message;
  final String characterImagePath;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppTheme.spacingL),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Row(
        children: [
          // Coach Character Image
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppTheme.lightGray,
              borderRadius: BorderRadius.circular(AppTheme.radiusM),
            ),
            child: Image.asset(
              characterImagePath,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(
                  Icons.person,
                  size: 30,
                  color: AppTheme.darkGray,
                );
              },
            ),
          ),
          const SizedBox(width: AppTheme.spacingM),
          // Message
          Expanded(
            child: Text(
              message,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
