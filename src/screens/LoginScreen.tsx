import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Eye, EyeOff, Mail, Lock, CheckCircle2, Circle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { Colors } from '@/constants/Colors';
import BackgroundImage from '@/assets/images/background.jpg';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Şimdilik direkt ana sayfaya yönlendiriyoruz
    navigation.replace('Main', { screen: 'Home' });
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={BackgroundImage} style={StyleSheet.absoluteFill}>
        {/* Arka Plan Gradyanı ve Efektler */}
        <LinearGradient
          colors={['rgba(26,11,46,0.4)', 'rgba(45,27,77,0.5)', 'rgba(26,11,46,0.7)']}
          style={StyleSheet.absoluteFill}
        >
          {/* Dekoratif Işık Efektleri */}
          <View style={[styles.glow, { top: '10%', left: '-10%', backgroundColor: '#6d28d9' }]} />
          <View style={[styles.glow, { bottom: '20%', right: '-10%', backgroundColor: '#4c1d95' }]} />
        </LinearGradient>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Başlık Bölümü */}
            <View style={styles.header}>
              <Text style={styles.title}>Şanlı Genç</Text>
              <Text style={styles.subtitle}>Şehrin Kalbine Hoşgeldiniz</Text>
            </View>

            {/* Giriş Kartı (Glassmorphism) */}
            <View style={styles.cardContainer}>
              <BlurView intensity={30} tint="light" style={styles.cardBlur}>
                <View style={styles.cardInner}>
                  {/* Tablar */}
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      onPress={() => setActiveTab('login')}
                      style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                    >
                      <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                        Giriş Yap
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setActiveTab('register')}
                      style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                    >
                      <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                        Kayıt Ol
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Inputlar */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="E-posta"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputWrapper}>
                      <TextInput
                        placeholder="Şifre"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        {showPassword ? (
                          <EyeOff color="rgba(255,255,255,0.6)" size={20} />
                        ) : (
                          <Eye color="rgba(255,255,255,0.6)" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Alt Seçenekler */}
                  <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.forgotBtn}>
                      <Text style={styles.optionText}>Şifremi Unuttum?</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.rememberRow}
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe ? (
                        <CheckCircle2 color="#a855f7" size={18} />
                      ) : (
                        <Circle color="rgba(255,255,255,0.4)" size={18} />
                      )}
                      <Text style={[styles.optionText, { marginLeft: 6 }]}>Kullanım Koşulları'nı kabul ederim.</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Giriş Butonu */}
                  <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={handleLogin}
                    style={styles.loginBtnWrapper}
                  >
                    <LinearGradient
                      colors={['#a855f7', '#6366f1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginBtn}
                    >
                      <Text style={styles.loginBtnText}>Giriş Yap</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Sosyal Giriş */}
                  <View style={styles.socialHeader}>
                    <View style={styles.line} />
                    <Text style={styles.socialLabel}>veya</Text>
                    <View style={styles.line} />
                  </View>

                  <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialIcon}>
                      <Text style={styles.socialIconText}>G</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialIcon}>
                      <Text style={styles.socialIconText}>f</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Alt Şehir Silüeti (Basit Bir Çizim/Efekt) */}
      <View style={styles.cityOutlineContainer}>
        <View style={styles.cityOutline} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a0b2e',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
    blur: 100,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(168, 85, 247, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  cardBlur: {
    padding: 2,
  },
  cardInner: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#6d28d9',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 15,
  },
  activeTabText: {
    color: '#fff',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 20,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  forgotBtn: {
    paddingVertical: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  loginBtnWrapper: {
    marginBottom: 24,
  },
  loginBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  socialLabel: {
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 12,
    fontSize: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  socialIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  cityOutlineContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    opacity: 0.2,
  },
  cityOutline: {
    flex: 1,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    // Burada basit bir silüet efekti için borderlar kullanılabilir
    // Gerçek bir silüet için SVG veya resim daha iyi olur
  },
});

export default LoginScreen;
