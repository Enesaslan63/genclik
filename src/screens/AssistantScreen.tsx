import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SendHorizonal, Bot, MapPin, TicketPercent, Sparkles, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { MOCK_MESSAGES } from '@/api/mockData';
import { ChatMessage } from '@/types';
import { useThemeMode } from '@/context/ThemeContext';

// 🔑 SENİN API ANAHTARIN
const API_KEY = 'AIzaSyC7vGvSl-eDZl76wCP8ACLSgtLvXr1J4nA';

// 🤖 [ÖNEMLİ] YAPAY ZEKANIN KURALLARI BURAYA YAZILIR
// Burayı dilediğin gibi değiştirebilirsin.
const SYSTEM_PROMPT = `
Sen "ŞanlıAsistan" adında yardımcı bir yapay zekasın.
GÖREVLERİN:
1. Sadece Şanlıurfa şehri, otobüs saatleri, öğrenci indirimleri ve yerel etkinlikler hakkında bilgi vermek.
2. Kullanıcı bu konuların DIŞINDA bir şey sorarsa (örneğin: matematik sorusu, yemek tarifi, siyaset, dünya gündemi vb.) kibarca "Ben sadece Şanlıurfa ve ulaşım konularında yardımcı olabilirim." diyerek reddetmek.
3. Cevapların her zaman kısa, net ve samimi olsun.
4. Asla kod yazma veya teknik konularda destek verme.
`;

const QUICK_ACTIONS = [
  {
    id: 'bus',
    label: '📍 Otobüs Saatleri',
    text: 'Otobüs saatlerini öğrenmek istiyorum.',
    icon: MapPin,
  },
  {
    id: 'discounts',
    label: '🎫 İndirimler',
    text: 'Genç Kart ile nerelerde indirim var?',
    icon: TicketPercent,
  },
  {
    id: 'events',
    label: '🎉 Etkinlikler',
    text: 'Bugün veya yakında hangi etkinlikler var?',
    icon: Sparkles,
  },
];

const TYPING_DELAY_MS = 900;

type MessageBubbleProps = {
  item: ChatMessage;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ item }) => {
  const slideAnim = useRef(new Animated.Value(10)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        style={[
          styles.bubbleContainer,
          item.sender === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer,
        ]}
      >
        {item.sender === 'bot' && (
          <View style={styles.botAvatar}>
            <Bot color={Colors.primary.indigo} size={20} />
          </View>
        )}
        <LinearGradient
          colors={
            item.sender === 'user'
              ? [Colors.primary.indigo, Colors.primary.violet]
              : ['#ffffff', '#f9fafb']
          }
          style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}
        >
          <Text style={item.sender === 'user' ? styles.userBubbleText : styles.botBubbleText}>
            {item.text}
          </Text>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const AssistantScreen = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES.slice().reverse());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('.');
  
  const [activeModel, setActiveModel] = useState<string>('Model Aranıyor...');
  const flatListRef = useRef<FlatList>(null);

  // --- MODEL SEÇİCİ ---
  useEffect(() => {
    const checkModels = async () => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
          const chatModels = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
            .map((m: any) => m.name.replace("models/", ""));

          console.log("Mevcut Modeller:", chatModels);
          
          // Ücretsiz ve güvenilir modelleri önceliklendir
          const safeModel = chatModels.find((m:string) => m.includes("gemini-1.5-flash") && !m.includes("2.5")) || 
                            chatModels.find((m:string) => m.includes("flash")) ||
                            chatModels.find((m:string) => m.includes("gemini-pro") && !m.includes("vision")) ||
                            chatModels[0];
          
          if (safeModel) {
            console.log("✅ SEÇİLEN MODEL:", safeModel);
            setActiveModel(safeModel);
          } else {
            setActiveModel(chatModels[0]); 
          }

        } else if (data.error) {
           console.error("API Error", data.error);
           setActiveModel("Hata");
        }
      } catch (error) {
        console.error(error);
        setActiveModel("Bağlantı Hatası");
      }
    };

    checkModels();
  }, []);


  const getGeminiReply = async (userText: string): Promise<string> => {
    if (activeModel === 'Model Aranıyor...' || activeModel === 'Hata') {
      return "Model bulunamadı. Lütfen bekleyin...";
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 👇 BURASI YENİ EKLENDİ: SİSTEM TALİMATI
          systemInstruction: {
            parts: [
              { text: SYSTEM_PROMPT }
            ]
          },
          // ----------------------------------------
          contents: [{ parts: [{ text: userText }] }]
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API Error:", data.error);
        if (data.error.code === 429) {
            return `Yoğunluk var, lütfen 30 saniye sonra tekrar dene.`;
        }
        return `Bir hata oluştu.`;
      }

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
         return data.candidates[0].content.parts[0].text;
      } else {
         return "Cevap alınamadı.";
      }

    } catch (error) {
      return "İnternet bağlantısında sorun var.";
    }
  };

  const sendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: trimmed,
      timestamp: '',
    };

    setMessages(prev => [userMessage, ...prev]);
    setInputText('');
    setIsTyping(true);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });

    const fetchBotReply = async () => {
      const geminiReply = await getGeminiReply(trimmed);
      const botMessage: ChatMessage = {
        id: `${Date.now()}-bot`,
        sender: 'bot',
        text: geminiReply,
        timestamp: '',
      };
      setMessages(prev => [botMessage, ...prev]);
      setIsTyping(false);
    };

    setTimeout(fetchBotReply, TYPING_DELAY_MS);
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubble item={item} />
  );

  useEffect(() => {
    if (!isTyping) {
      setTypingDots('.');
      return;
    }
    const interval = setInterval(() => {
      setTypingDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 350);
    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <SafeAreaView
      style={[styles.container, isDark && { backgroundColor: '#020617' }]}
      edges={['top']}
    >
      <View
        style={[
          styles.bubblePage,
          isDark && { backgroundColor: '#020617', shadowOpacity: 0.25 },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 25}
        >
          {/* Header */}
          <View style={styles.header}>
              <Text style={styles.headerTitle}>ŞanlıAsistan</Text>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                 <Activity size={14} color="green" />
                 <Text style={styles.headerSubtitle}>
                    {activeModel === 'Model Aranıyor...' ? 'Aranıyor...' : `${activeModel}`}
                 </Text>
              </View>
          </View>
          
          {/* Quick Start Suggestions */}
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickStartContainer}
            >
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickStartChip}
                  onPress={() => sendUserMessage(action.text)}
                  activeOpacity={0.9}
                >
                  <View style={styles.quickStartChipInner}>
                    <action.icon size={18} color={Colors.primary.indigo} />
                    <Text style={styles.quickStartText}>{action.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Area */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            inverted 
            style={{ flex: 1 }}
          />

          {/* Typing indicator */}
          {isTyping && (
            <View
              style={[
                styles.bubbleContainer,
                styles.botBubbleContainer,
                { paddingHorizontal: 15 },
              ]}
            >
              <View style={styles.botAvatar}>
                <Bot color={Colors.primary.indigo} size={20} />
              </View>
              <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
                <Text style={styles.typingText}>{typingDots}</Text>
              </View>
            </View>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Mesajını buraya yaz..."
              style={styles.input}
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => sendUserMessage(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendUserMessage(inputText)}
              activeOpacity={0.9}
            >
               <LinearGradient colors={[Colors.primary.indigo, Colors.primary.violet]} style={styles.sendButtonGradient}>
                  <SendHorizonal color={Colors.white} size={24} />
               </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  bubblePage: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 95, 
    borderRadius: 30,
    overflow: 'hidden', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  headerSubtitle: {
      fontSize: 14,
      color: '#6b7280',
      marginTop: 2,
      fontWeight: '600'
  },
  quickStartContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  quickStartChip: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  quickStartChipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickStartText: {
    color: Colors.darkGray,
    fontWeight: '500',
  },
  chatContainer: {
    paddingHorizontal: 15,
    flexGrow: 1,
    paddingBottom: 10,
  },
  bubbleContainer: {
    marginVertical: 10,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
  },
  botBubbleContainer: {
    alignSelf: 'flex-start',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    padding: 15,
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: Colors.lightGray,
    borderBottomLeftRadius: 5,
  },
  userBubbleText: {
    color: Colors.white,
    fontSize: 16,
  },
  botBubbleText: {
    color: Colors.darkGray,
    fontSize: 16,
  },
  typingBubble: {
    minWidth: 50,
    alignItems: 'center',
  },
  typingText: {
    fontSize: 18,
    color: Colors.darkGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.lightGray,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 0,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AssistantScreen;