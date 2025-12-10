import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUpRight, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_USER, MOCK_PARTNERS } from '@/api/mockData';
import { DiscountPartner } from '@/types';

// Artık bu ICONS listesine ihtiyacımız yok, çünkü ikonlar veriden geliyor.
// const ICONS = { ... }

const GencKartScreen = () => {
  const renderPartnerItem = (item: DiscountPartner) => {
    // İkonu artık doğrudan veriden alıyoruz
    const Icon = item.icon; 
    return (
        <View style={styles.partnerCard}>
            <View style={[styles.partnerIconContainer, { backgroundColor: item.bgColor }]}>
                <Icon color={item.iconColor} size={24}/>
            </View>
            <View style={styles.partnerInfo}>
                <Text style={styles.partnerName}>{item.name}</Text>
                <Text style={styles.partnerOffer}>{item.offer}</Text>
                <Text style={styles.partnerDesc}>{item.description}</Text>
            </View>
            <TouchableOpacity>
                <ArrowUpRight color={Colors.darkGray} size={24} />
            </TouchableOpacity>
        </View>
    )
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ŞanlıGenç Kart</Text>
                <Text style={styles.headerSubtitle}>Şehrin anahtarı cebinde!</Text>
            </View>

            {/* Genç Kart */}
            <LinearGradient
                colors={['#2A2D48', '#22243C']}
                style={styles.gencKart}
            >
                {/* This View would be for the pattern overlay if we had an image */}
                <View style={StyleSheet.absoluteFill} />
                <View style={styles.cardTop}>
                    <View>
                        <View style={styles.cardLogoContainer}>
                           <MapPin color={Colors.white} size={16}/>
                           <Text style={styles.cardLogoText}>ŞANLIGENÇ</Text>
                        </View>
                        <Text style={styles.cardAgeText}>◎ 16-30 YAŞ</Text>
                    </View>
                    <Text style={styles.cardYear}>2024</Text>
                </View>

                <View style={styles.cardBottom}>
                    <View>
                        <Text style={styles.cardHolderLabel}>KART SAHİBİ</Text>
                        <Text style={styles.cardHolderName}>MERT YILMAZ</Text>
                        <Text style={styles.cardId}>TR-63-9921</Text>
                    </View>
                    <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=sanligenc&bgcolor=22243C&color=FFFFFF&qzone=1' }} style={styles.qrCode}/>
                </View>
            </LinearGradient>

            {/* Partner List */}
            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Anlaşmalı Mekanlar</Text>
                <Text style={styles.firsatCount}>4 Fırsat</Text>
            </View>

            <View style={styles.listContainer}>
                {/* Her bir elemana doğrudan key veriyoruz */}
                {MOCK_PARTNERS.map((item) => (
                    <View key={item.id}>
                        {renderPartnerItem(item)}
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
    backgroundColor: '#F7F8FA', // A slightly different light gray
  },
  header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  headerSubtitle: {
      fontSize: 16,
      color: '#6b7280',
      marginTop: 2,
  },
  gencKart: {
    borderRadius: 25,
    marginHorizontal: 20,
    padding: 20,
    height: 210,
    justifyContent: 'space-between'
  },
  cardTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  cardLogoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  cardLogoText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
  },
  cardAgeText: {
      color: '#9ca3af',
      fontSize: 12,
      marginLeft: 22,
      marginTop: 2
  },
  cardYear: {
      color: Colors.white,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
      fontSize: 12,
      fontWeight: 'bold'
  },
  cardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
  },
  cardHolderLabel: {
      color: '#9ca3af',
      fontSize: 12,
  },
  cardHolderName: {
      color: Colors.white,
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 2
  },
  cardId: {
      color: '#9ca3af',
      fontSize: 12,
      marginTop: 2
  },
  qrCode: {
      width: 80,
      height: 80,
  },
  listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 30,
      marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  firsatCount: {
      color: '#6b7280',
      fontWeight: '600'
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  partnerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  partnerOffer: {
      color: Colors.primary.indigo,
      fontWeight: 'bold'
  },
  partnerDesc: {
      color: '#6b7280',
      fontSize: 12,
      marginTop: 2,
  }
});

export default GencKartScreen;
