import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const RecipeScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  
  const categories = ['전체', '저속노화', '샐러드', '스무디', '수프', '메인요리'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          레시피 모음
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        <View style={styles.recipeGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} style={styles.recipeCard}>
              <Card.Cover 
                source={{ uri: `https://via.placeholder.com/200x150?text=Recipe+${item}` }} 
              />
              <Card.Content style={styles.cardContent}>
                <Text variant="titleSmall" numberOfLines={2}>
                  건강한 저속노화 레시피 {item}
                </Text>
                <Text variant="bodySmall" style={styles.recipeInfo}>
                  ⏱️ 30분 • 👤 2인분
                </Text>
                <View style={styles.tagContainer}>
                  <Chip compact style={styles.tag}>
                    저속노화
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('레시피 추가')}
        label="레시피 추가"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryChip: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  recipeGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: '48%',
    marginBottom: 15,
  },
  cardContent: {
    paddingTop: 10,
  },
  recipeInfo: {
    color: '#666',
    marginTop: 5,
  },
  tagContainer: {
    marginTop: 8,
  },
  tag: {
    height: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});
