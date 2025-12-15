import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/theme/app_theme.dart';
import '../../domain/entities/ingredient.dart';
import '../providers/ingredient_providers.dart';
import '../../../../shared/widgets/buttons/primary_button.dart';

class AddIngredientScreen extends ConsumerStatefulWidget {
  const AddIngredientScreen({super.key});

  @override
  ConsumerState<AddIngredientScreen> createState() => _AddIngredientScreenState();
}

class _AddIngredientScreenState extends ConsumerState<AddIngredientScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _searchController = TextEditingController();
  
  IngredientCategory _selectedCategory = IngredientCategory.fridge;
  QuantityLevel _selectedQuantity = QuantityLevel.medium;
  DateTime _selectedExpiryDate = DateTime.now().add(const Duration(days: 7));
  XFile? _selectedImage;
  
  bool _isLoading = false;
  bool _showPhotoOptions = false;
  List<String> _searchResults = [];

  @override
  void dispose() {
    _nameController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('재료 추가'),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveIngredient,
            child: const Text('저장'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.spacingM),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 입력 방법 선택
              _buildInputMethodSelector(),
              const SizedBox(height: AppTheme.spacingL),
              
              // 재료 이름 입력
              _buildNameInput(),
              const SizedBox(height: AppTheme.spacingL),
              
              // 카테고리 선택
              _buildCategorySelector(),
              const SizedBox(height: AppTheme.spacingL),
              
              // 수량 선택
              _buildQuantitySelector(),
              const SizedBox(height: AppTheme.spacingL),
              
              // 유통기한 선택
              _buildExpiryDateSelector(),
              const SizedBox(height: AppTheme.spacingL),
              
              // 사진 (선택사항)
              if (_selectedImage != null) _buildSelectedImage(),
              
              const SizedBox(height: AppTheme.spacingXL),
              
              // 저장 버튼
              PrimaryButton(
                text: '재료 추가',
                onPressed: _isLoading ? null : _saveIngredient,
                isLoading: _isLoading,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputMethodSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '입력 방법',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        Row(
          children: [
            Expanded(
              child: _buildMethodCard(
                icon: Icons.camera_alt,
                title: '사진으로 추가',
                subtitle: 'AI가 재료를 인식해요',
                onTap: _pickImageFromCamera,
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: _buildMethodCard(
                icon: Icons.search,
                title: '직접 검색',
                subtitle: '재료명을 입력하세요',
                onTap: () => setState(() => _showPhotoOptions = false),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMethodCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        decoration: BoxDecoration(
          color: AppTheme.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
          border: Border.all(color: AppTheme.mediumGray),
          boxShadow: AppTheme.cardShadow,
        ),
        child: Column(
          children: [
            Icon(icon, size: 32, color: AppTheme.primaryRed),
            const SizedBox(height: AppTheme.spacingS),
            Text(
              title,
              style: Theme.of(context).textTheme.labelLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppTheme.spacingXS),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNameInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '재료명',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        TextFormField(
          controller: _nameController,
          decoration: const InputDecoration(
            hintText: '예: 당근, 양파, 우유',
            border: OutlineInputBorder(),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return '재료명을 입력해주세요';
            }
            return null;
          },
          onChanged: _searchIngredients,
        ),
        if (_searchResults.isNotEmpty) _buildSearchResults(),
      ],
    );
  }

  Widget _buildSearchResults() {
    return Container(
      margin: const EdgeInsets.only(top: AppTheme.spacingS),
      decoration: BoxDecoration(
        color: AppTheme.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusS),
        border: Border.all(color: AppTheme.mediumGray),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _searchResults.length,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final result = _searchResults[index];
          return ListTile(
            title: Text(result),
            onTap: () {
              _nameController.text = result;
              setState(() => _searchResults.clear());
            },
          );
        },
      ),
    );
  }

  Widget _buildCategorySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '보관 위치',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        Row(
          children: IngredientCategory.values.map((category) {
            final isSelected = _selectedCategory == category;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  right: category != IngredientCategory.values.last 
                    ? AppTheme.spacingS : 0,
                ),
                child: _buildCategoryChip(category, isSelected),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildCategoryChip(IngredientCategory category, bool isSelected) {
    String text;
    IconData icon;
    
    switch (category) {
      case IngredientCategory.fridge:
        text = '냉장';
        icon = Icons.kitchen;
        break;
      case IngredientCategory.freezer:
        text = '냉동';
        icon = Icons.ac_unit;
        break;
      case IngredientCategory.pantry:
        text = '실온';
        icon = Icons.room_preferences;
        break;
    }

    return GestureDetector(
      onTap: () => setState(() => _selectedCategory = category),
      child: Container(
        padding: const EdgeInsets.symmetric(
          vertical: AppTheme.spacingM,
          horizontal: AppTheme.spacingS,
        ),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryRed : AppTheme.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusS),
          border: Border.all(
            color: isSelected ? AppTheme.primaryRed : AppTheme.mediumGray,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: isSelected ? AppTheme.white : AppTheme.darkGray,
            ),
            const SizedBox(height: AppTheme.spacingXS),
            Text(
              text,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: isSelected ? AppTheme.white : AppTheme.darkGray,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '수량',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        Row(
          children: QuantityLevel.values.map((level) {
            final isSelected = _selectedQuantity == level;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  right: level != QuantityLevel.values.last 
                    ? AppTheme.spacingS : 0,
                ),
                child: _buildQuantityChip(level, isSelected),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildQuantityChip(QuantityLevel level, bool isSelected) {
    String text;
    switch (level) {
      case QuantityLevel.low:
        text = '적음';
        break;
      case QuantityLevel.medium:
        text = '보통';
        break;
      case QuantityLevel.high:
        text = '많음';
        break;
    }

    return GestureDetector(
      onTap: () => setState(() => _selectedQuantity = level),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppTheme.spacingM),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryRed : AppTheme.white,
          borderRadius: BorderRadius.circular(AppTheme.radiusS),
          border: Border.all(
            color: isSelected ? AppTheme.primaryRed : AppTheme.mediumGray,
          ),
        ),
        child: Text(
          text,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: isSelected ? AppTheme.white : AppTheme.darkGray,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          ),
        ),
      ),
    );
  }

  Widget _buildExpiryDateSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '유통기한',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        GestureDetector(
          onTap: _selectExpiryDate,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppTheme.spacingM),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: BorderRadius.circular(AppTheme.radiusS),
              border: Border.all(color: AppTheme.mediumGray),
            ),
            child: Row(
              children: [
                const Icon(Icons.calendar_today, color: AppTheme.darkGray),
                const SizedBox(width: AppTheme.spacingM),
                Text(
                  '${_selectedExpiryDate.year}.${_selectedExpiryDate.month.toString().padLeft(2, '0')}.${_selectedExpiryDate.day.toString().padLeft(2, '0')}',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const Spacer(),
                const Icon(Icons.arrow_forward_ios, 
                  size: 16, color: AppTheme.darkGray),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectedImage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '선택된 사진',
          style: Theme.of(context).textTheme.labelLarge,
        ),
        const SizedBox(height: AppTheme.spacingS),
        Container(
          width: double.infinity,
          height: 200,
          decoration: BoxDecoration(
            color: AppTheme.lightGray,
            borderRadius: BorderRadius.circular(AppTheme.radiusM),
            border: Border.all(color: AppTheme.mediumGray),
          ),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(AppTheme.radiusM),
                child: Image.network(
                  _selectedImage!.path, // 실제로는 File.fromPath 사용
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return const Center(
                      child: Icon(Icons.image, size: 64, color: AppTheme.darkGray),
                    );
                  },
                ),
              ),
              Positioned(
                top: AppTheme.spacingS,
                right: AppTheme.spacingS,
                child: GestureDetector(
                  onTap: () => setState(() => _selectedImage = null),
                  child: Container(
                    padding: const EdgeInsets.all(AppTheme.spacingXS),
                    decoration: const BoxDecoration(
                      color: AppTheme.black,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.close,
                      color: AppTheme.white,
                      size: 16,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _searchIngredients(String query) {
    if (query.trim().isEmpty) {
      setState(() => _searchResults.clear());
      return;
    }

    // TODO: 실제 검색 로직 구현
    final mockResults = [
      '당근', '양파', '감자', '토마토', '오이', '배추', '무',
      '우유', '계란', '치즈', '요거트', '버터',
      '쌀', '라면', '빵', '파스타'
    ].where((item) => item.contains(query)).take(5).toList();

    setState(() => _searchResults = mockResults);
  }

  Future<void> _pickImageFromCamera() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.camera);
    
    if (image != null) {
      setState(() {
        _selectedImage = image;
        _showPhotoOptions = true;
      });
      
      // TODO: AI 재료 인식 로직 구현
      _showAIRecognitionResults();
    }
  }

  void _showAIRecognitionResults() {
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
              'AI가 인식한 재료',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: AppTheme.spacingL),
            ...['당근', '양파', '감자'].map((ingredient) => ListTile(
              title: Text(ingredient),
              trailing: const Icon(Icons.arrow_forward_ios, size: 16),
              onTap: () {
                _nameController.text = ingredient;
                Navigator.pop(context);
              },
            )),
            const SizedBox(height: AppTheme.spacingL),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('직접 입력하기'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _selectExpiryDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedExpiryDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    
    if (date != null) {
      setState(() => _selectedExpiryDate = date);
    }
  }

  Future<void> _saveIngredient() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final ingredient = Ingredient(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: _nameController.text.trim(),
        category: _selectedCategory,
        quantityLevel: _selectedQuantity,
        expiryDate: _selectedExpiryDate,
        addedAt: DateTime.now(),
      );

      final repository = ref.read(ingredientRepositoryProvider);
      await repository.addIngredient(ingredient);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('재료가 추가되었습니다')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('재료 추가 실패: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
}