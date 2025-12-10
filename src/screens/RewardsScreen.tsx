import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coffee, Film, Bus, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_REWARDS, MOCK_POINTS_HISTORY } from '@/api/mockData';

const ICONS = {
    coffee: Coffee,
    film: Film,
    bus: Bus,
}

const RewardsScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Ödüller</Text>
        </View>

        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.pointsLabel}>Toplam Puan</Text>
          <Text style={styles.pointsValue}>1450 P</Text>
          
          <Text style={styles.levelLabel}>Seviye: Urfa Kaşifi</Text>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarForeground} />
          </View>
        </View>

        {/* Shop Grid */}
        <Text style={styles.sectionTitle}>Mağaza</Text>
        <View style={styles.shopGrid}>
            {MOCK_REWARDS.map(item => {
                const Icon = ICONS[item.icon as keyof typeof ICONS];
                return (
                    <TouchableOpacity key={item.id} style={styles.rewardCard}>
                        <View style={styles.rewardIconContainer}>
                            <Icon color={Colors.primary.indigo} size={24}/>
                        </View>
                        <Text style={styles.rewardName}>{item.name}</Text>
                        <Text style={styles.rewardPoints}>{item.points} Puan</Text>
                    </TouchableOpacity>
                )
            })}
        </View>

        {/* History List */}
        <Text style={styles.sectionTitle}>Puan Geçmişi</Text>
        <View style={styles.menuContainer}>
            {MOCK_POINTS_HISTORY.map((item, index) => (
                <View key={item.id} style={[styles.historyItem, index === MOCK_POINTS_HISTORY.length - 1 && { borderBottomWidth: 0 }]}>
                    <View>
                        <Text style={styles.historyDesc}>{item.description}</Text>
                        <Text style={styles.historyDate}>{item.date}</Text>
                    </View>
                    <Text style={[styles.historyPoints, item.points > 0 ? styles.pointsGained : styles.pointsSpent]}>
                        {item.points > 0 ? `+${item.points}` : item.points}
                    </Text>
                </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  headerCard: {
    backgroundColor: Colors.darkGray,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  pointsLabel: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  pointsValue: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelLabel: {
    color: Colors.white,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600'
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginTop: 8,
  },
  progressBarForeground: {
    height: '100%',
    width: '60%', // Example progress
    backgroundColor: Colors.accent.amber,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9ca3af',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  shopGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rewardCard: {
      width: '32%',
      backgroundColor: Colors.white,
      borderRadius: 20,
      padding: 15,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e5e7eb'
  },
  rewardIconContainer: {
      backgroundColor: '#e0e7ff',
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
  },
  rewardName: {
      fontWeight: '600',
      marginTop: 10,
      textAlign: 'center',
      fontSize: 12,
  },
  rewardPoints: {
      color: Colors.primary.indigo,
      fontWeight: 'bold',
      marginTop: 5,
      fontSize: 12,
  },
  menuContainer: {
      backgroundColor: Colors.white,
      borderRadius: 20,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: '#e5e7eb'
  },
  historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6'
  },
  historyDesc: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.darkGray,
  },
  historyDate: {
      color: '#9ca3af',
      fontSize: 12,
      marginTop: 2,
  },
  historyPoints: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  pointsGained: {
      color: '#16a34a'
  },
  pointsSpent: {
      color: '#dc2626'
  }
});

export default RewardsScreen;
