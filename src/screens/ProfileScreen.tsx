import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_USER } from '@/api/mockData';

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const MenuItem = ({ label, icon, onPress, isLast }: { label: string, icon: React.ReactNode, onPress?: () => void, isLast?: boolean }) => (
    <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            {icon}
            <Text style={styles.menuItemText}>{label}</Text>
        </View>
      <ChevronRight color="#9ca3af" size={24} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userInfoCard}>
            <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
            <View>
                <Text style={styles.userName}>{MOCK_USER.name}</Text>
                <Text style={styles.userStatus}>{MOCK_USER.status}</Text>
            </View>
        </View>

        {/* Verification Alert */}
        {!MOCK_USER.isVerified && (
          <View style={styles.alertCard}>
            <ShieldCheck color={Colors.accent.amber} size={24}/>
            <Text style={styles.alertText}>Hesabın doğrulanmadı. Avantajlardan yararlanmak için hesabını doğrula.</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.verifyButtonText}>Doğrula</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        <View style={styles.menuContainer}>
            <MenuItem label="Kişisel Bilgiler" icon={<UserIcon color="#6b7280" size={24}/>} />
            <MenuItem label="Bildirimler" icon={<Bell color="#6b7280" size={24}/>} isLast />
        </View>

        <Text style={styles.sectionTitle}>Diğer</Text>
        <View style={styles.menuContainer}>
            <MenuItem label="Çıkış Yap" icon={<LogOut color="#ef4444" size={24}/>} isLast />
        </View>
        

        {/* Verification Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>TC Kimlik Doğrulama</Text>
              <TextInput
                placeholder="TC Kimlik Numaranız"
                style={styles.modalInput}
                keyboardType="numeric"
                maxLength={11}
              />
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Doğrula</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  userInfoCard: {
      backgroundColor: Colors.white,
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#e5e7eb'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  userStatus: {
      color: '#6b7280',
      marginTop: 2,
  },
  alertCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  alertText: {
    color: '#b45309',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 20,
  },
  verifyButtonText: {
    color: Colors.accent.amber,
    fontWeight: 'bold',
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9ca3af',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  menuContainer: {
      backgroundColor: Colors.white,
      borderRadius: 20,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: '#e5e7eb'
  },
  menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6'
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
      fontSize: 16,
      marginLeft: 15,
      color: Colors.darkGray
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.darkGray,
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButton: {
      width: '100%',
      height: 50,
      backgroundColor: Colors.primary.indigo,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalButtonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: 'bold'
  },
  modalCancelText: {
      marginTop: 15,
      color: '#6b7280',
      fontWeight: '600'
  }
});

export default ProfileScreen;
