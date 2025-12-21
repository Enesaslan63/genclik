import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useThemeMode } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { supabase, processImageUrl } from '@/lib/supabase';
import { ChevronLeft, MapPin, CalendarDays, Tag } from 'lucide-react-native';
import LinearGradient from 'expo-linear-gradient';

interface EventData {
  id: string;
  baslik: string;
  aciklama?: string;
  tarih: string;
  konum: string;
  kategori: string;
  resim_url?: string;
  saat?: string; // Saat bilgisini ekle
}

type EventDetailScreenProps = StackScreenProps<RootStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(true); // Yenileme başladığında true yap
      const { data, error } = await supabase
        .from('etkinlikler')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error("Etkinlik detayları çekilirken hata oluştu:", error);
        setEvent(null);
      } else if (data) {
        setEvent(data);
      }
    } catch (e) {
      console.error("Etkinlik detayları çekilirken beklenmedik bir hata oluştu:", e);
      setEvent(null);
    } finally {
      setLoading(false);
      setRefreshing(false); // Yenileme bittiğinde (hata olsa bile) false yap
    }
  }, [eventId]); // eventId değiştiğinde yeniden çek

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]); // fetchEventDetails'i bağımlılık olarak ekle

  const handleRefresh = () => {
    fetchEventDetails();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, isDark && { backgroundColor: Colors.black }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.violet} />
          <Text style={[styles.loadingText, isDark && { color: Colors.lightGray }]}>Etkinlik yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, isDark && { backgroundColor: Colors.black }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color={isDark ? Colors.white : Colors.darkGray} size={28} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && { color: Colors.white }]}>Etkinlik Bulunamadı</Text>
        </View>
        <View style={styles.notFoundContent}>
          <Text style={[styles.notFoundText, isDark && { color: Colors.lightGray }]}>Belirtilen ID ile etkinlik bulunamadı veya bir hata oluştu.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: Colors.black }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? Colors.white : Colors.primary.violet} // Yenileme ikonunun rengi
          />
        }
      >
        <Image source={{ uri: processImageUrl(event.resim_url, 'etkinlik_resimleri') || 'https://via.placeholder.com/400x300' }} style={styles.eventImage} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
          <ChevronLeft color={Colors.white} size={28} />
        </TouchableOpacity>

        <View style={[styles.content, isDark && { backgroundColor: Colors.black }]}>
          <Text style={[styles.title, isDark && { color: Colors.white }]}>{event.baslik}</Text>
          
          <View style={styles.infoRow}>
            <CalendarDays color={isDark ? Colors.lightGray : Colors.darkGray} size={18} />
            <Text style={[styles.infoText, isDark && { color: Colors.lightGray }]}>{event.tarih} {event.saat && `• ${event.saat}`}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin color={isDark ? Colors.lightGray : Colors.darkGray} size={18} />
            <Text style={[styles.infoText, isDark && { color: Colors.lightGray }]}>{event.konum}</Text>
          </View>
          <View style={styles.infoRow}>
            <Tag color={isDark ? Colors.lightGray : Colors.darkGray} size={18} />
            <Text style={[styles.infoText, isDark && { color: Colors.lightGray }]}>{event.kategori}</Text>
          </View>

          <Text style={[styles.description, isDark && { color: Colors.lightGray }]}>
            {event.aciklama || 'Bu etkinlik için detaylı açıklama bulunmamaktadır.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: Colors.darkGray,
  },
  backButton: {
    padding: 5,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.darkGray,
  },
  notFoundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  eventImage: {
    width: '100%',
    height: Dimensions.get('window').width * 0.75, // Genişliğin %75'i kadar yükseklik
    resizeMode: 'cover',
  },
  // gradientOverlay kaldırıldı
  content: {
    padding: 20,
    backgroundColor: Colors.lightGray,
    marginTop: 0, // Resim ile çakışmayı önlemek için kaldırıldı
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.darkGray,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.darkGray,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    color: Colors.darkGray,
  },
});

export default EventDetailScreen;
