import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SendHorizonal } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { MOCK_MESSAGES } from '@/api/mockData';
import { ChatMessage } from '@/types';

const AssistantScreen = () => {
  const renderMessageItem = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.bubbleContainer,
      item.sender === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer
    ]}>
      <View style={[
        styles.bubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={item.sender === 'user' ? styles.userBubbleText : styles.botBubbleText}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>ŞanlıAsistan</Text>
            <View style={styles.onlineContainer}>
                <View style={styles.onlineIndicator} />
                <Text style={styles.onlineText}>Online</Text>
            </View>
        </View>

        {/* Chat Area */}
        <FlatList
          data={MOCK_MESSAGES}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          inverted // So messages start from the bottom
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mesaj yaz..."
            style={styles.input}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.sendButton}>
            <SendHorizonal color={Colors.white} size={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGray,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  onlineIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#0284c7',
      marginRight: 6,
  },
  onlineText: {
    color: '#0369a1',
    fontWeight: '600'
  },
  chatContainer: {
    paddingHorizontal: 15,
    flexGrow: 1,
    flexDirection: 'column-reverse' // So messages start from the bottom
  },
  bubbleContainer: {
    marginVertical: 10,
    maxWidth: '80%',
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  botBubbleContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 15,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: Colors.primary.indigo,
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userBubbleText: {
    color: Colors.white,
    fontSize: 16,
  },
  botBubbleText: {
    color: Colors.darkGray,
    fontSize: 16,
  },
  timestamp: {
      fontSize: 12,
      color: '#9ca3af',
      marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#F7F8FA',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 10,
  },
  sendButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: Colors.primary.indigo,
      justifyContent: 'center',
      alignItems: 'center',
  }
});

export default AssistantScreen;
