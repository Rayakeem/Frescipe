import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../../../core/theme/app_theme.dart';

class ChallengeProgressRing extends StatelessWidget {
  const ChallengeProgressRing({
    super.key,
    required this.day,
    required this.progress,
    required this.isActive,
    required this.isCompleted,
    this.size = 60,
  });

  final int day;
  final double progress; // 0.0 ~ 1.0
  final bool isActive;
  final bool isCompleted;
  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          // Background Circle
          CustomPaint(
            size: Size(size, size),
            painter: _CirclePainter(
              progress: 1.0,
              color: AppTheme.lightGray,
              strokeWidth: 4,
            ),
          ),
          // Progress Circle
          if (progress > 0)
            CustomPaint(
              size: Size(size, size),
              painter: _CirclePainter(
                progress: progress,
                color: isActive ? AppTheme.primaryRed : AppTheme.success,
                strokeWidth: 4,
              ),
            ),
          // Day Number
          Center(
            child: Text(
              '$day',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: isCompleted
                    ? AppTheme.success
                    : isActive
                        ? AppTheme.primaryRed
                        : AppTheme.darkGray,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CirclePainter extends CustomPainter {
  const _CirclePainter({
    required this.progress,
    required this.color,
    required this.strokeWidth,
  });

  final double progress;
  final Color color;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - strokeWidth) / 2;

    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    const startAngle = -math.pi / 2; // Start from top
    final sweepAngle = 2 * math.pi * progress;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
