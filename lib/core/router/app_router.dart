import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/ingredients/presentation/screens/fridge_screen.dart';
import '../../features/ingredients/presentation/screens/add_ingredient_screen.dart';
import '../../features/challenge/presentation/screens/challenge_screen.dart';
import '../../features/recipes/presentation/screens/recipes_screen.dart';
import '../../features/recipes/presentation/screens/recipe_detail_screen.dart';
import '../../features/auth/presentation/screens/profile_screen.dart';
import '../../shared/widgets/navigation/main_navigation.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/home',
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      
      // Main App Shell with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) {
          return MainNavigation(child: child);
        },
        routes: [
          // Home
          GoRoute(
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          
          // Fridge
          GoRoute(
            path: '/fridge',
            builder: (context, state) => const FridgeScreen(),
            routes: [
              GoRoute(
                path: 'add',
                builder: (context, state) => const AddIngredientScreen(),
              ),
            ],
          ),
          
          // Challenge
          GoRoute(
            path: '/challenge',
            builder: (context, state) => const ChallengeScreen(),
          ),
          
          // Recipes
          GoRoute(
            path: '/recipes',
            builder: (context, state) => const RecipesScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final recipeId = state.pathParameters['id']!;
                  return RecipeDetailScreen(recipeId: recipeId);
                },
              ),
            ],
          ),
          
          // Profile
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
    ],
  );
});

// Navigation Keys
class AppRoutes {
  static const String login = '/login';
  static const String home = '/home';
  static const String fridge = '/fridge';
  static const String addIngredient = '/fridge/add';
  static const String challenge = '/challenge';
  static const String recipes = '/recipes';
  static const String profile = '/profile';
  
  static String recipeDetail(String id) => '/recipes/$id';
}
