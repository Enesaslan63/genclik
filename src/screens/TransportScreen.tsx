import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, ChevronsRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_BUSES } from '@/api/mockData';
import { Bus } from '@/types';

// Android'de LayoutAnimation'ı etkinleştirmek için
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Her bir otobüs kartı için ayrı bir bileşen oluşturuyoruz
const BusCard = ({ item }: { item: Bus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        // Yumuşak bir geçiş için LayoutAnimation kullanıyoruz
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    }

    return (
        <TouchableOpacity style={styles.busCard} onPress={toggleExpand} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                    <View style={[styles.lineNumberBadge, { backgroundColor: item.lineColor }]}>
                        <Text style={styles.lineNumberText}>{item.lineNumber}</Text>
                    </View>
                    <View>
                        <Text style={styles.busDestination}>{item.destination}</Text>
                        <Text style={styles.busInfoText}>63 ABC 123 · Yaklaşıyor</Text>
                    </View>
                </View>
            
                <View style={styles.cardRight}>
                    <Text style={styles.busTimer}>{item.arrivalTime} dk</Text>
                    <Star color="#d1d5db" size={24} />
                </View>
            </View>

            {isExpanded && (
                <View style={styles.stopsContainer}>
                    {item.stops.map((stop, index) => (
                        <View key={index} style={styles.stopItem}>
                            <View style={styles.stopIcon}>
                                <ChevronsRight size={16} color="#9ca3af"/>
                            </View>
                            <Text style={styles.stopText}>{stop}</Text>
                        </View>
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
}


const TransportScreen = () => {
  const [activeTab, setActiveTab] = useState('Tüm Hatlar');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ulaşım Rehberi</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#9ca3af" size={20} />
        <TextInput
          placeholder="Hat veya durak ara..."
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
      </View>
      
      <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Tüm Hatlar' && styles.activeTab]}
            onPress={() => setActiveTab('Tüm Hatlar')}
          >
              <Text style={[styles.tabText, activeTab === 'Tüm Hatlar' && styles.activeTabText]}>Tüm Hatlar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'Favoriler' && styles.activeTab]}
            onPress={() => setActiveTab('Favoriler')}
          >
              <Text style={[styles.tabText, activeTab === 'Favoriler' && styles.activeTabText]}>Favoriler</Text>
          </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_BUSES}
        renderItem={({ item }) => <BusCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.darkGray
  },
  tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
  },
  tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 10,
  },
  activeTab: {
      backgroundColor: Colors.primary.indigo,
  },
  tabText: {
      fontWeight: '600',
      color: '#6b7280'
  },
  activeTabText: {
      color: Colors.white
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  busCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  lineNumberBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lineNumberText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  busDestination: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  busInfoText: {
      color: '#6b7280',
      fontSize: 12,
      marginTop: 2,
  },
  cardRight: {
      alignItems: 'center',
  },
  busTimer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.indigo,
    marginBottom: 5,
  },
  stopsContainer: {
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
  },
  stopItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  stopIcon: {
      width: 20,
      alignItems: 'center',
  },
  stopText: {
      color: '#4b5563',
      marginLeft: 5,
  }
});

export default TransportScreen;
