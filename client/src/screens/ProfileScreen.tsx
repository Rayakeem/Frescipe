import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Avatar.Text 
            size={80} 
            label="김" 
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            김소희
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            sohee@example.com
          </Text>
          <Button 
            mode="outlined" 
            style={styles.editButton}
            onPress={() => console.log('프로필 편집')}
          >
            프로필 편집
          </Button>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  12
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  내 레시피
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  45
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  저장한 레시피
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>
                  128
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  팔로워
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <List.Item
            title="내가 작성한 레시피"
            description="12개의 레시피"
            left={(props) => <List.Icon {...props} icon="chef-hat" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('내 레시피')}
          />
          <Divider />
          <List.Item
            title="저장한 레시피"
            description="45개의 레시피"
            left={(props) => <List.Icon {...props} icon="bookmark" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('저장한 레시피')}
          />
          <Divider />
          <List.Item
            title="팔로잉"
            description="23명"
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('팔로잉')}
          />
        </Card>

        <Card style={styles.menuCard}>
          <List.Item
            title="알림 설정"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('알림 설정')}
          />
          <Divider />
          <List.Item
            title="개인정보 보호"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('개인정보 보호')}
          />
          <Divider />
          <List.Item
            title="고객 지원"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('고객 지원')}
          />
          <Divider />
          <List.Item
            title="앱 정보"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('앱 정보')}
          />
        </Card>

        <View style={styles.logoutContainer}>
          <Button 
            mode="outlined" 
            textColor="#F44336"
            style={[styles.logoutButton, { borderColor: '#F44336' }]}
            onPress={() => console.log('로그아웃')}
          >
            로그아웃
          </Button>
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
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginBottom: 15,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    borderColor: '#2E7D32',
  },
  statsCard: {
    margin: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  menuCard: {
    margin: 20,
    marginTop: 10,
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 10,
  },
  logoutButton: {
    marginTop: 10,
  },
});
