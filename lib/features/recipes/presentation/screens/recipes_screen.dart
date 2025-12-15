import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../core/router/app_router.dart';
import '../../domain/entities/recipe.dart';

class RecipesScreen extends ConsumerStatefulWidget {
  const RecipesScreen({super.key});

  @override
  ConsumerState<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends ConsumerState<RecipesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _searchController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('레시피'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(100),
          child: Column(
            children: [
              // 검색바
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingM),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: '재료나 요리명으로 검색',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: IconButton(
                      onPressed: () => _searchController.clear(),
                      icon: const Icon(Icons.clear),
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                      borderSide: BorderSide.none,
                    ),
                    filled: true,
                    fillColor: AppTheme.lightGray,
                  ),
                  onChanged: _onSearchChanged,
                ),
              ),
              const SizedBox(height: AppTheme.spacingM),
              // 탭바
              TabBar(
                controller: _tabController,
                tabs: const [
                  Tab(text: '추천'),
                  Tab(text: '소진'),
                  Tab(text: '빠른'),
                  Tab(text: '전체'),
                ],
              ),
            ],
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildRecommendedRecipes(),
          _buildExpiringRecipes(),
          _buildQuickRecipes(),
          _buildAllRecipes(),
        ],
      ),
    );
  }

  Widget _buildRecommendedRecipes() {
    return _buildRecipeGrid(_getMockRecommendedRecipes());
  }

  Widget _buildExpiringRecipes() {
    return _buildRecipeGrid(_getMockExpiringRecipes());
  }

  Widget _buildQuickRecipes() {
    return _buildRecipeGrid(_getMockQuickRecipes());
  }

  Widget _buildAllRecipes() {
    return _buildRecipeGrid(_getMockAllRecipes());
  }

  Widget _buildRecipeGrid(List<Recipe> recipes) {
    if (recipes.isEmpty) {
      return _buildEmptyState();
    }

    return GridView.builder(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: AppTheme.spacingM,
        mainAxisSpacing: AppTheme.spacingM,
        childAspectRatio: 0.75,
      ),
      itemCount: recipes.length,
      itemBuilder: (context, index) {
        final recipe = recipes[index];
        return _buildRecipeCard(recipe);
      },
    );
  }

  Widget _buildRecipeCard(Recipe recipe) {
    return GestureDetector(
      onTap: () => context.go(AppRoutes.recipeDetail(recipe.id)),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 레시피 이미지
            Expanded(
              flex: 3,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppTheme.lightGray,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusM),
                  ),
                ),
                child: Stack(
                  children: [
                    const Center(
                      child: Icon(
                        Icons.restaurant_menu,
                        size: 48,
                        color: AppTheme.darkGray,
                      ),
                    ),
                    // 즐겨찾기 버튼
                    Positioned(
                      top: AppTheme.spacingS,
                      right: AppTheme.spacingS,
                      child: GestureDetector(
                        onTap: () => _toggleFavorite(recipe),
                        child: Container(
                          padding: const EdgeInsets.all(AppTheme.spacingXS),
                          decoration: BoxDecoration(
                            color: AppTheme.white.withOpacity(0.9),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.favorite_border, // TODO: 즐겨찾기 상태에 따라 변경
                            size: 20,
                            color: AppTheme.darkGray,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // 레시피 정보
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(AppTheme.spacingM),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      recipe.title,
                      style: Theme.of(context).textTheme.labelLarge,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: AppTheme.spacingXS),
                    Row(
                      children: [
                        const Icon(Icons.access_time, 
                          size: 14, color: AppTheme.darkGray),
                        const SizedBox(width: AppTheme.spacingXS),
                        Text(
                          '${recipe.cookingTimeMinutes}분',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                    const SizedBox(height: AppTheme.spacingXS),
                    Wrap(
                      spacing: AppTheme.spacingXS,
                      children: recipe.healthTags.take(2).map((tag) => Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppTheme.spacingXS,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryRed.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(AppTheme.radiusS),
                        ),
                        child: Text(
                          tag,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.primaryRed,
                            fontSize: 10,
                          ),
                        ),
                      )).toList(),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.restaurant_menu_outlined,
            size: 64,
            color: AppTheme.darkGray,
          ),
          const SizedBox(height: AppTheme.spacingL),
          Text(
            '레시피가 없습니다',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.darkGray,
            ),
          ),
          const SizedBox(height: AppTheme.spacingS),
          Text(
            '냉장고에 재료를 추가하면\n맞춤 레시피를 추천해드려요!',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.darkGray,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingL),
          ElevatedButton.icon(
            onPressed: () => context.go(AppRoutes.fridge),
            icon: const Icon(Icons.add),
            label: const Text('재료 추가하기'),
          ),
        ],
      ),
    );
  }

  void _onSearchChanged(String query) {
    // TODO: 검색 로직 구현
    setState(() {});
  }

  void _toggleFavorite(Recipe recipe) {
    // TODO: 즐겨찾기 토글 로직 구현
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('${recipe.title} 즐겨찾기 토글')),
    );
  }

  // Mock 데이터 생성 메서드들
  List<Recipe> _getMockRecommendedRecipes() {
    return [
      Recipe(
        id: '1',
        title: '당근 볶음밥',
        ingredients: [
          RecipeIngredient(name: '당근', amount: '1개', isAvailable: true),
          RecipeIngredient(name: '밥', amount: '1공기', isAvailable: true),
          RecipeIngredient(name: '계란', amount: '2개', isAvailable: false),
        ],
        cookingTimeMinutes: 15,
        healthTags: ['간단', '영양'],
        instructions: ['당근을 썰어주세요', '팬에 볶아주세요'],
        createdAt: DateTime.now(),
      ),
      Recipe(
        id: '2',
        title: '양파 스프',
        ingredients: [
          RecipeIngredient(name: '양파', amount: '2개', isAvailable: true),
          RecipeIngredient(name: '육수', amount: '500ml', isAvailable: false),
        ],
        cookingTimeMinutes: 25,
        healthTags: ['따뜻한', '건강'],
        instructions: ['양파를 볶아주세요', '육수를 넣어주세요'],
        createdAt: DateTime.now(),
      ),
    ];
  }

  List<Recipe> _getMockExpiringRecipes() {
    return [
      Recipe(
        id: '3',
        title: '유통기한 임박 재료 활용 볶음',
        ingredients: [
          RecipeIngredient(name: '당근', amount: '1개', isAvailable: true),
          RecipeIngredient(name: '양파', amount: '1개', isAvailable: true),
        ],
        cookingTimeMinutes: 20,
        healthTags: ['소진', '절약'],
        instructions: ['재료를 썰어주세요', '볶아주세요'],
        createdAt: DateTime.now(),
      ),
    ];
  }

  List<Recipe> _getMockQuickRecipes() {
    return [
      Recipe(
        id: '4',
        title: '5분 샐러드',
        ingredients: [
          RecipeIngredient(name: '양상추', amount: '적당량', isAvailable: true),
          RecipeIngredient(name: '토마토', amount: '1개', isAvailable: false),
        ],
        cookingTimeMinutes: 5,
        healthTags: ['빠른', '신선'],
        instructions: ['재료를 씻어주세요', '썰어서 섞어주세요'],
        createdAt: DateTime.now(),
      ),
      Recipe(
        id: '5',
        title: '간단 토스트',
        ingredients: [
          RecipeIngredient(name: '식빵', amount: '2장', isAvailable: true),
          RecipeIngredient(name: '버터', amount: '적당량', isAvailable: true),
        ],
        cookingTimeMinutes: 3,
        healthTags: ['빠른', '간단'],
        instructions: ['식빵에 버터를 발라주세요', '토스터에 구워주세요'],
        createdAt: DateTime.now(),
      ),
    ];
  }

  List<Recipe> _getMockAllRecipes() {
    return [
      ..._getMockRecommendedRecipes(),
      ..._getMockExpiringRecipes(),
      ..._getMockQuickRecipes(),
      Recipe(
        id: '6',
        title: '김치찌개',
        ingredients: [
          RecipeIngredient(name: '김치', amount: '1컵', isAvailable: true),
          RecipeIngredient(name: '돼지고기', amount: '100g', isAvailable: false),
          RecipeIngredient(name: '두부', amount: '1/2모', isAvailable: true),
        ],
        cookingTimeMinutes: 30,
        healthTags: ['한식', '매운맛'],
        instructions: ['김치를 볶아주세요', '물을 넣고 끓여주세요'],
        createdAt: DateTime.now(),
      ),
    ];
  }
}