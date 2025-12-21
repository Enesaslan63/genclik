import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';import { Colors } from '@/constants/Colors';
import { MOCK_EVENTS } from '@/api/mockData';
import { Event } from '@/types';
import { useThemeMode } from '@/context/ThemeContext';
import { supabase, processImageUrl } from '@/lib/supabase';

const CATEGORIES = ['Tümü', 'Konser', 'Gezi', 'Spor'];

// Supabase Event Veri Tipi
interface EventData {
  id: number;
  baslik: string;
  aciklama?: string;
  tarih: string;
  konum: string;
  kategori: string;
  resim_url?: string;
}

type EventScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Events'>;

const EventsScreen = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const navigation = useNavigation<EventScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Tümü');
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);

  // Supabase'den etkinlikleri çek
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('etkinlikler')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setEvents(data);
      if (error) console.log("Etkinlik hatası:", error);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrelenmiş etkinlikler
  const filteredEvents = activeTab === 'Tümü' 
    ? events 
    : activeTab === 'Favorilerim'
      ? events.filter(event => favoriteEvents.includes(event.id.toString()))
      : events.filter(event => event.kategori === activeTab);

  // Event verisini UI'a uygun formata çevir
  const formatEvent = (event: EventData): Event => ({
    id: event.id.toString(),
    title: event.baslik,
    date: event.tarih,
    location: event.konum,
    category: (event.kategori as 'Konser' | 'Gezi' | 'Spor') || 'Gezi',
    image: processImageUrl(event.resim_url, 'etkinlik_resimleri') || 'https://via.placeholder.com/400x300',
  });

  const toggleFavorite = (eventId: string) => {
    setFavoriteEvents(prevFavorites => 
      prevFavorites.includes(eventId)
        ? prevFavorites.filter(id => id !== eventId)
        : [...prevFavorites, eventId]
    );
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}>
      <ImageBackground source={{ uri: item.image }} style={styles.eventImage} imageStyle={{ borderRadius: 20 }}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.badgeContainer}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
        <TouchableOpacity style={styles.likeButton} onPress={() => toggleFavorite(item.id)}>
          <Heart color={Colors.white} size={24} fill={favoriteEvents.includes(item.id) ? Colors.primary.violet : "transparent"} />
        </TouchableOpacity>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{`${item.date} · ${item.location}`}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, isDark && { backgroundColor: '#020617' }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && { color: '#f8fafc' }]}>Etkinlikler</Text>
        <TouchableOpacity onPress={() => setActiveTab('Favorilerim')} style={styles.favoritesButton}>
          <Heart color={isDark ? Colors.white : Colors.darkGray} size={28} fill={activeTab === 'Favorilerim' ? (isDark ? Colors.primary.violet : Colors.primary.indigo) : 'transparent'} />
        </TouchableOpacity>
      </View>
      
      <View>
        <FlatList
            horizontal
            data={CATEGORIES}
            renderItem={({ item }) => (
            <TouchableOpacity 
                style={[
                    styles.tab, 
                    isDark && { backgroundColor: '#1e293b', borderColor: '#334155' },
                    activeTab === item && (isDark ? { backgroundColor: Colors.primary.indigo, borderColor: Colors.primary.indigo } : styles.activeTab)
                ]}
                onPress={() => setActiveTab(item)}
            >
                <Text style={[
                    styles.tabText, 
                    isDark && { color: '#94a3b8' },
                    activeTab === item && (isDark ? { color: Colors.white } : styles.activeTabText)
                ]}>{item}</Text>
            </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
        />
      </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary.indigo} size="large" />
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && { color: '#94a3b8' }]}>
              {activeTab === 'Tümü' ? 'Henüz etkinlik bulunmuyor.' : 
               activeTab === 'Favorilerim' ? 'Henüz favori etkinliğiniz bulunmuyor.' : 
               `${activeTab} kategorisinde etkinlik bulunmuyor.`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents.map(formatEvent)}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
    </SafeAreaView>
  );
};

// Stiller önceki modern haliyle aynı kalıyor
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  favoritesButton: {
    padding: 5,
  },
  pillsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 10,
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: '#e5e7eb'
  },
  activeTab: {
      backgroundColor: Colors.primary.indigo,
      borderWidth: 0,
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
    paddingTop: 10,
  },
  eventCard: {
    height: 350,
    marginBottom: 20,
    shadowColor: '#171717',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  eventImage: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    borderRadius: 20,
  },
  badgeContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
  },
  likeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  eventInfo: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  eventDate: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default EventsScreen;
