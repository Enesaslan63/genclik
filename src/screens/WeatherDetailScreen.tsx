import React from 'react';

import {

  View,

  Text,

  StyleSheet,

  SafeAreaView,

  TouchableOpacity,

  ImageBackground,

} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';

import { MainStackParamList } from '@/types/navigation';

import { Colors } from '@/constants/Colors';

import { ArrowLeft, CloudRain, Sun, Cloud, CloudSnow, CloudLightning, CloudDrizzle, Thermometer, Droplet, Wind } from 'lucide-react-native';

import { useThemeMode } from '@/context/ThemeContext';



type WeatherDetailScreenProps = StackScreenProps<MainStackParamList, 'WeatherDetail'>;



const WeatherDetailScreen: React.FC<WeatherDetailScreenProps> = ({ route, navigation }) => {

  const { weatherData } = route.params;

  const { mode } = useThemeMode();

  const isDark = mode === 'dark';



  if (!weatherData) {

    return (

      <SafeAreaView style={[styles.container, isDark && { backgroundColor: Colors.black }]}>

        <View style={styles.errorContainer}>

          <Text style={styles.errorText}>Hava durumu verisi yüklenemedi.</Text>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>

            <ArrowLeft color={Colors.white} size={24} />

            <Text style={styles.backButtonText}>Geri Dön</Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    );

  }



  const weatherConditionId = weatherData.weather[0].id;

  const temperature = Math.round(weatherData.main.temp);

  const feelsLike = Math.round(weatherData.main.feels_like);

  const humidity = weatherData.main.humidity;

  const windSpeed = Math.round(weatherData.wind.speed * 3.6); // m/s to km/h

  const description = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

  const cityName = weatherData.name;



  const getBackgroundAndIcon = () => {

    let backgroundColor = '#6a11cb'; // Varsayılan: mor

    let icon = <Cloud color={Colors.white} size={80} />;



    if (weatherConditionId === 800) { // Açık

      backgroundColor = '#4facfe';

      icon = <Sun color={Colors.white} size={80} />;

    } else if (weatherConditionId >= 200 && weatherConditionId < 300) { // Fırtına

      backgroundColor = '#667eea';

      icon = <CloudLightning color={Colors.white} size={80} />;

    } else if (weatherConditionId >= 300 && weatherConditionId < 500) { // Çiseleme

      backgroundColor = '#6a11cb';

      icon = <CloudDrizzle color={Colors.white} size={80} />;

    } else if (weatherConditionId >= 500 && weatherConditionId < 600) { // Yağmur

      backgroundColor = '#845ec2';

      icon = <CloudRain color={Colors.white} size={80} />;

    } else if (weatherConditionId >= 600 && weatherConditionId < 700) { // Kar

      backgroundColor = '#a5c2f0';

      icon = <CloudSnow color={Colors.white} size={80} />;

    } else if (weatherConditionId >= 700 && weatherConditionId < 800) { // Sis vs

      backgroundColor = '#a1c4fd';

      icon = <Cloud color={Colors.white} size={80} />;

    } else { // Bulutlu

      backgroundColor = '#6a11cb';

      icon = <Cloud color={Colors.white} size={80} />;

    }



    return { backgroundColor, icon };

  };



  const { backgroundColor, icon } = getBackgroundAndIcon();



  return (

    <ImageBackground

      source={require('@/assets/images/weather_bg.jpg')} // Hava durumu arka plan resmi

      style={styles.backgroundImage}

      imageStyle={{ tintColor: backgroundColor, opacity: 0.6, resizeMode: 'cover' }}

    >

      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>

          <ArrowLeft color={Colors.white} size={28} />

        </TouchableOpacity>



        <View style={styles.weatherInfoContainer}>

          {icon}

          <Text style={styles.temperatureText}>{temperature}°C</Text>

          <Text style={styles.descriptionText}>{description}</Text>

          <Text style={styles.cityNameText}>{cityName}</Text>



          <View style={styles.detailsRow}>

            <View style={styles.detailItem}>

              <Thermometer color={Colors.white} size={20} />

              <Text style={styles.detailText}>Hissedilen: {feelsLike}°C</Text>

            </View>

            <View style={styles.detailItem}>

              <Droplet color={Colors.white} size={20} />

              <Text style={styles.detailText}>Nem: %{humidity}</Text>

            </View>

            <View style={styles.detailItem}>

              <Wind color={Colors.white} size={20} />

              <Text style={styles.detailText}>Rüzgar: {windSpeed} km/s</Text>

            </View>

          </View>

        </View>

      </SafeAreaView>

    </ImageBackground>

  );

};



const styles = StyleSheet.create({

  backgroundImage: {

    flex: 1,

    backgroundColor: Colors.darkGray, // Varsayılan koyu arka plan

  },

  container: {

    flex: 1,

    justifyContent: 'flex-start',

    alignItems: 'center',

  },

  backButtonAbsolute: {

    position: 'absolute',

    top: 50,

    left: 20,

    zIndex: 10,

    padding: 10,

  },

  weatherInfoContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: -50, // Back button ile çakışmaması için

  },

  temperatureText: {

    fontSize: 72,

    fontWeight: 'bold',

    color: Colors.white,

    marginTop: 10,

  },

  descriptionText: {

    fontSize: 24,

    color: Colors.white,

    marginTop: 5,

  },

  cityNameText: {

    fontSize: 20,

    color: Colors.white,

    marginTop: 10,

    fontWeight: '600',

  },

  detailsRow: {

    flexDirection: 'row',

    marginTop: 30,

    gap: 20,

    backgroundColor: 'rgba(255,255,255,0.2)',

    padding: 15,

    borderRadius: 20,

  },

  detailItem: {

    alignItems: 'center',

  },

  detailText: {

    color: Colors.white,

    fontSize: 14,

    marginTop: 5,

  },

  errorContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    padding: 20,

  },

  errorText: {

    fontSize: 18,

    color: Colors.darkGray,

    marginBottom: 20,

    textAlign: 'center',

  },

  backButton: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: Colors.primary.indigo,

    paddingVertical: 10,

    paddingHorizontal: 15,

    borderRadius: 10,

  },

  backButtonText: {

    color: Colors.white,

    marginLeft: 5,

    fontSize: 16,

  },

});



export default WeatherDetailScreen;