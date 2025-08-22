import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            안녕하세요! 👋
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            오늘은 어떤 요리를 해볼까요?
          </Text>
        </View>

        <Searchbar
          placeholder="재료나 요리명을 검색해보세요"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            추천 레시피
          </Text>
          
          <Card style={styles.card}>
            <Card.Cover 
              source={{ uri: 'https://via.placeholder.com/300x200?text=Recipe+Image' }} 
            />
            <Card.Content>
              <Text variant="titleMedium">저속노화 샐러드</Text>
              <Text variant="bodyMedium">신선한 채소로 만드는 건강한 샐러드</Text>
            </Card.Content>
            <Card.Actions>
              <Button>보기</Button>
              <Button>저장</Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            내 냉장고 재료
          </Text>
          
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">냉장고를 확인해보세요</Text>
              <Text variant="bodyMedium">
                보유한 재료를 등록하면 맞춤 레시피를 추천해드려요
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained">냉장고 관리</Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
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
    marginTop: 5,
    color: '#666',
  },
  searchBar: {
    margin: 20,
    marginTop: 10,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 15,
  },
});
