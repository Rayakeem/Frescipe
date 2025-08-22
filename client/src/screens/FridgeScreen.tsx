import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, FAB, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const FridgeScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  
  const categories = ['전체', '채소', '과일', '육류', '유제품', '조미료'];
  
  const fridgeItems = [
    { id: 1, name: '토마토', category: '채소', quantity: 5, unit: '개', freshness: 0.8, expiryDays: 3 },
    { id: 2, name: '양파', category: '채소', quantity: 2, unit: '개', freshness: 0.9, expiryDays: 7 },
    { id: 3, name: '우유', category: '유제품', quantity: 1, unit: '팩', freshness: 0.7, expiryDays: 2 },
    { id: 4, name: '닭가슴살', category: '육류', quantity: 300, unit: 'g', freshness: 0.6, expiryDays: 1 },
  ];

  const getFreshnessColor = (freshness: number) => {
    if (freshness > 0.7) return '#4CAF50';
    if (freshness > 0.4) return '#FF9800';
    return '#F44336';
  };

  const getFreshnessText = (freshness: number) => {
    if (freshness > 0.7) return '신선함';
    if (freshness > 0.4) return '보통';
    return '주의';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          내 냉장고
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          보유 재료: {fridgeItems.length}개
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
        <View style={styles.itemsContainer}>
          {fridgeItems.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <Card.Content>
                <View style={styles.itemHeader}>
                  <Text variant="titleMedium">{item.name}</Text>
                  <Chip 
                    compact 
                    style={[
                      styles.categoryTag, 
                      { backgroundColor: getFreshnessColor(item.freshness) + '20' }
                    ]}
                    textStyle={{ color: getFreshnessColor(item.freshness) }}
                  >
                    {item.category}
                  </Chip>
                </View>
                
                <Text variant="bodyMedium" style={styles.quantity}>
                  수량: {item.quantity}{item.unit}
                </Text>
                
                <View style={styles.freshnessContainer}>
                  <Text variant="bodySmall" style={styles.freshnessLabel}>
                    신선도: {getFreshnessText(item.freshness)}
                  </Text>
                  <ProgressBar 
                    progress={item.freshness} 
                    color={getFreshnessColor(item.freshness)}
                    style={styles.progressBar}
                  />
                </View>
                
                <Text variant="bodySmall" style={[
                  styles.expiry,
                  { color: item.expiryDays <= 2 ? '#F44336' : '#666' }
                ]}>
                  {item.expiryDays <= 0 
                    ? '⚠️ 유통기한 만료' 
                    : `📅 ${item.expiryDays}일 후 만료`
                  }
                </Text>
              </Card.Content>
              
              <Card.Actions>
                <Button>수정</Button>
                <Button textColor="#F44336">삭제</Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        <Card style={styles.recommendationCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.recommendationTitle}>
              🍳 추천 레시피
            </Text>
            <Text variant="bodyMedium">
              토마토와 닭가슴살로 만들 수 있는 요리가 있어요!
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained">레시피 보기</Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('재료 추가')}
        label="재료 추가"
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
  subtitle: {
    color: '#666',
    marginTop: 5,
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
  itemsContainer: {
    padding: 20,
  },
  itemCard: {
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    height: 24,
  },
  quantity: {
    color: '#666',
    marginBottom: 10,
  },
  freshnessContainer: {
    marginBottom: 10,
  },
  freshnessLabel: {
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  expiry: {
    fontSize: 12,
  },
  recommendationCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#E8F5E8',
  },
  recommendationTitle: {
    color: '#2E7D32',
    marginBottom: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});
