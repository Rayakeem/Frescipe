import React from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { theme } from '../utils/theme';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('로그아웃 오류:', error);
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={80}
            source={{
              uri: user?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            }}
            style={styles.avatar}
          />
          <Text variant="headlineSmall" style={styles.name}>
            {user?.displayName || '사용자'}
          </Text>
          <Text variant="bodyMedium" style={styles.email}>
            {user?.email || 'user@example.com'}
          </Text>
          <Text variant="bodySmall" style={styles.level}>
            🌟 {user?.level || '요리 초보자'} • {user?.experiencePoints || 0}XP
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
                  8
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  팔로워
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Item
              title="내 레시피"
              description="작성한 레시피 관리"
              left={props => <List.Icon {...props} icon="book-open-variant" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('내 레시피')}
            />
            <Divider />
            <List.Item
              title="저장한 레시피"
              description="북마크한 레시피 모음"
              left={props => <List.Icon {...props} icon="bookmark" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('저장한 레시피')}
            />
            <Divider />
            <List.Item
              title="냉장고 관리"
              description="재료 및 유통기한 관리"
              left={props => <List.Icon {...props} icon="fridge" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('냉장고 관리')}
            />
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Item
              title="알림 설정"
              description="푸시 알림 및 이메일 설정"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('알림 설정')}
            />
            <Divider />
            <List.Item
              title="개인정보 설정"
              description="계정 및 개인정보 관리"
              left={props => <List.Icon {...props} icon="account-cog" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('개인정보 설정')}
            />
            <Divider />
            <List.Item
              title="도움말"
              description="자주 묻는 질문 및 가이드"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('도움말')}
            />
            <Divider />
            <List.Item
              title="고객센터"
              description="문의 및 지원"
              left={props => <List.Icon {...props} icon="headset" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => console.log('고객센터')}
            />
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Item
              title="로그아웃"
              description="계정에서 로그아웃"
              left={props => <List.Icon {...props} icon="logout" color="#F44336" />}
              titleStyle={styles.logoutText}
              onPress={handleLogout}
            />
          </Card.Content>
        </Card>

        {/* 계정 정보 */}
        {user && (
          <Card style={styles.accountInfoCard}>
            <Card.Content>
              <Text variant="titleSmall" style={styles.accountInfoTitle}>
                계정 정보
              </Text>
              <Text variant="bodySmall" style={styles.accountInfoText}>
                가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </Text>
              <Text variant="bodySmall" style={styles.accountInfoText}>
                인증 상태: {user.isVerified ? '✅ 인증됨' : '❌ 미인증'}
              </Text>
              <Text variant="bodySmall" style={styles.accountInfoText}>
                멤버십: {user.isPremium ? '🌟 프리미엄' : '🆓 기본'}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  avatar: {
    marginBottom: 15,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.primary,
  },
  email: {
    color: '#666',
    marginBottom: 5,
  },
  level: {
    color: '#888',
    marginBottom: 15,
  },
  editButton: {
    marginTop: 10,
  },
  statsCard: {
    margin: 10,
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
    color: theme.colors.primary,
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  menuCard: {
    margin: 10,
    marginBottom: 10,
  },
  logoutText: {
    color: '#F44336',
    fontWeight: '600',
  },
  accountInfoCard: {
    margin: 10,
    marginBottom: 20,
  },
  accountInfoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  accountInfoText: {
    color: '#666',
    marginBottom: 5,
  },
});