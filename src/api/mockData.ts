import { User, Story, Bus, DiscountPartner, ChatMessage, Event, Magazine, Bulletin, Reward, PointsHistory } from '@/types';
import { Coffee, Utensils, Film } from 'lucide-react-native';

export const MOCK_USER: User = {
  name: 'Merve',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  isVerified: false,
  dob: '2004',
  status: 'Öğrenci',
};

export const MOCK_STORIES: Story[] = [
  { id: '1', user: { name: 'Ali', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' } },
  { id: '2', user: { name: 'Ayşe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' } },
  { id: '3', user: { name: 'Fatma', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' } },
  { id: '4', user: { name: 'Mehmet', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' } },
  { id: '5', user: { name: 'Zeynep', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' } },
];

export const MOCK_BUSES: Bus[] = [
    { id: '1', lineNumber: '90', destination: 'OSMANBEY KAMPÜS', arrivalTime: 3, lineColor: '#8b5cf6', stops: ['Abide', 'Valilik', 'Karaköprü', 'Osmanbey'] },
    { id: '2', lineNumber: '63', destination: 'KARAKÖPRÜ', arrivalTime: 5, lineColor: '#22c55e', stops: ['Toplama Merkezi', 'Müze', 'Piazza', 'Diyarbakır Yolu'] },
    { id: '3', lineNumber: '74', destination: 'ESENTEPE', arrivalTime: 8, lineColor: '#f97316', stops: ['Çevik Kuvvet', 'Belediye', 'Adliye', 'Esentepe'] },
    { id: '4', lineNumber: '24', destination: 'SIRA GECESİ', arrivalTime: 12, lineColor: '#3b82f6', stops: ['Haleplibahçe', 'Balıklıgöl', 'Haşimiye', 'Belediye Konuk Evi'] },
];

export const MOCK_PARTNERS: DiscountPartner[] = [
    { id: '1', name: 'Mırra Kahve Evi', offer: '%20 İndirim', description: 'Tüm kahve çeşitlerinde', icon: Coffee, url: '#', bgColor: '#ffedd5', iconColor: '#f97316' },
    { id: '2', name: 'Meşhur Ciğerci', offer: 'Ayran İkramı', description: 'Porsiyon ciğer siparişine', icon: Utensils, url: '#', bgColor: '#fee2e2', iconColor: '#ef4444' },
    { id: '3', name: 'Piazza AVM Sinema', offer: 'Genç Bileti', description: 'Hafta içi seanslarda', icon: Film, url: '#', bgColor: '#e0e7ff', iconColor: '#4f46e5' },
];

export const MOCK_MESSAGES: ChatMessage[] = [
    { id: '1', sender: 'bot', text: 'Merhaba! Ben ŞanlıAsistan. Sana nasıl yardımcı olabilirim?', timestamp: '10:00' },
    { id: '2', sender: 'user', text: 'Otobüs saatlerini öğrenebilir miyim?', timestamp: '10:01' },
];

export const MOCK_EVENTS: Event[] = [
  { id: '1', title: 'Sıra Gecesi', date: '15 Aralık', location: 'Balıklıgöl', category: 'Gezi', image: 'https://images.unsplash.com/photo-1593839238634-2b744a8677f5?q=80&w=2574&auto=format&fit=crop' },
  { id: '2', title: 'Yaz Konseri', date: '20 Aralık', location: 'Arkeoloji Müzesi', category: 'Konser', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2670&auto=format&fit=crop' },
  { id: '3', title: 'Maraton', date: '25 Aralık', location: 'GAP Vadisi', category: 'Spor', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2670&auto=format&fit=crop' },
];

export const MOCK_MAGAZINES: Magazine[] = [
    { id: '1', title: 'Göbeklitepe', image: 'https://images.unsplash.com/photo-1628169493633-14e54b6d39c9?q=80&w=2574&auto=format&fit=crop' },
    { id: '2', title: 'Balıklıgöl', image: 'https://images.unsplash.com/photo-1593839238634-2b744a8677f5?q=80&w=2574&auto=format&fit=crop' },
];

export const MOCK_BULLETINS: Bulletin[] = [
    { id: '1', title: 'Aralık Ayı E-Dergi', url: '#' },
    { id: '2', title: 'Gençlik Festivali Broşürü', url: '#' },
];

export const MOCK_REWARDS: Reward[] = [
    { id: '1', name: 'Bedava Kahve', points: 500, icon: 'coffee' },
    { id: '2', name: 'Otobüs Bileti', points: 200, icon: 'bus' },
    { id: '3', name: 'Sinema Bileti', points: 1000, icon: 'film' },
];

export const MOCK_POINTS_HISTORY: PointsHistory[] = [
    { id: '1', description: 'Otobüs Kullanımı', points: 50, date: '10 Aralık' },
    { id: '2', description: 'Bedava Kahve', points: -500, date: '9 Aralık' },
    { id: '3', description: 'Anket Doldurma', points: 100, date: '8 Aralık' },
];
